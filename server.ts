import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Gemini Generic Generate API
  app.post('/api/gemini/generate', async (req: Request, res: Response) => {
    const { prompt, systemInstruction } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt é obrigatório.' });
    }

    const ai = getAiClient();

    if (!ai) {
      // Fallback heuristics if API Key not provided
      return res.json({
        text: `[Assistente PulseSaaS]: Análise gerada com sucesso para: "${prompt}".\n\nPrincipais Recomendações Operacionais:\n1. Otimizar a retenção dos clientes nos primeiros 30 dias de onboarding para elevar o Net Revenue Retention para mais de 115%.\n2. Aumentar o volume de contatos proativos em contas com Health Score abaixo de 70.\n3. Aproveitar o forte crescimento do MRR do plano Enterprise acelerando ofertas de expansão multi-unidades.`,
        isOfflineFallback: true,
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction:
            systemInstruction ||
            'Você é um consultor especialista em métricas de SaaS B2B, finanças recorrentes (MRR, ARR, Churn, LTV, CAC, NRR) e operações de Customer Success e Vendas corporativas. Forneça respostas estratégicas, claras, práticas e em português brasileiro.',
        },
      });

      return res.json({
        text: response.text || 'Sem resposta gerada pelo modelo.',
        isOfflineFallback: false,
      });
    } catch (err: any) {
      console.error('Erro na chamada Gemini:', err);
      return res.status(500).json({
        error: err.message || 'Falha ao processar solicitação com IA.',
      });
    }
  });

  // Gemini Specialized Business Insights API
  app.post('/api/gemini/insights', async (req: Request, res: Response) => {
    const { metrics, customersSummary } = req.body;

    const ai = getAiClient();

    const promptText = `Analise as seguintes métricas de SaaS B2B e gere um relatório executivo estratégico com 3 tópicos: 
1. Diagnóstico Geral de Performance e Saúde Financeira.
2. Contas em Risco e Alertas Imediatos.
3. Plano de Ação para Expansão de MRR no próximo trimestre.

Métricas:
${JSON.stringify(metrics || {}, null, 2)}

Resumo de Clientes & Churn:
${JSON.stringify(customersSummary || {}, null, 2)}

Formate com tópicos em Markdown elegantes e diretos.`;

    if (!ai) {
      return res.json({
        text: `### 📊 Diagnóstico Executivo de SaaS (PulseSaaS Intelligence)

#### 1. Diagnóstico Geral de Performance
* **MRR Atual de R$ 148.750,00 (+14,8% MoM):** Ritmo de tração sólido, puxado principalmente por contratos Enterprise (58% da receita).
* **Churn Rate de 1,4% (Redução de -0,3%):** Nível saudável para o segmento B2B médio, abaixo do benchmark de mercado (2,0%).
* **NRR em 112,5%:** A expansão de contas existentes já supera as perdas com cancelamentos.

#### 2. Alertas Imediatos & Gestão de Risco
* **Atenção na Rede Saúde Integrada (Score 52):** Queda de 40% no volume de requisições e fatura com 18 dias de atraso. Ação: Agendar call de resgate com o patrocinador executivo.
* **Conversão do Trial Nexus Hub (3 dias restantes):** Apresentar proposta do plano Pro com condições especiais de onboarding.

#### 3. Plano de Ação Estratégico (Próximos 90 Dias)
* **Campanha de Upsell no Plano Pro:** 35% dos clientes Pro atingiram 85% do limite de requisições API.
* **Automação de Régua de Cobrança PIX:** Reduzir a inadimplência involuntária em até 22% com lembretes D-3 e D+1 via WhatsApp.`,
        isOfflineFallback: true,
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: promptText,
        config: {
          systemInstruction:
            'Você é o Principal Data Analyst & CFO de um SaaS B2B de alto crescimento. Gere diagnósticos analíticos precisos, de alto impacto e práticos.',
        },
      });

      return res.json({
        text: response.text || '',
        isOfflineFallback: false,
      });
    } catch (err: any) {
      console.error('Erro no insight Gemini:', err);
      return res.status(500).json({ error: 'Erro ao gerar diagnóstico inteligente.' });
    }
  });

  // Gemini Specialized Email & Proposal Drafter API
  app.post('/api/gemini/draft', async (req: Request, res: Response) => {
    const { type, customerName, company, context } = req.body;

    const ai = getAiClient();

    const promptText = `Escreva um e-mail comercial altamente profissional, persuasivo e cordial em português do Brasil.
Tipo de Comunicação: ${type || 'Follow-up de Negociação'}
Destinatário: ${customerName || 'Cliente'} (${company || 'Empresa'})
Contexto Adicional: ${context || 'Nenhum detalhe extra fornecido'}

Inclua Assunto e Corpo do e-mail com tom B2B consultivo.`;

    if (!ai) {
      const defaultDrafts: Record<string, string> = {
        upsell: `**Assunto:** Oportunidade de expansão e novos recursos para a ${company || 'sua empresa'}

Olá ${customerName || 'Gestor'}, tudo bem?

Acompanhando a evolução do uso da plataforma pela equipe da ${company || 'sua empresa'}, notamos um aumento substancial de volume nas últimas semanas.

Para garantir que vocês continuem com máxima performance e desbloqueiem limites dedicados de API e suporte prioritário 24/7 com SLA de 99.9%, estruturamos uma proposta exclusiva de upgrade para o plano Enterprise.

Podemos conversar por 15 minutos nesta quinta-feira às 14h para apresentar as novas capacidades?

Um abraço,  
**Equipe de Parcerias PulseSaaS**`,
        churn: `**Assunto:** Como podemos apoiar melhor a equipe da ${company || 'sua empresa'}?

Olá ${customerName || 'Gestor'}, espero que esteja tendo uma excelente semana.

Notei que sua equipe teve uma redução no volume de acessos nos últimos dias e gostaria de entender se vocês encontraram algum obstáculo técnico ou se precisam de um reforço no treinamento prático.

Nosso time de Customer Success está à disposição para um workshop sem custos para destravar o valor total da ferramenta.

Qual o melhor dia para nos falarmos rapidamente?

Atenciosamente,  
**Mariana Lima | Head de Customer Success**`,
        onboarding: `**Assunto:** Bem-vindo ao PulseSaaS — Seus primeiros passos para acelerar resultados!

Olá ${customerName || 'Gestor'}, seja muito bem-vindo!

É um prazer ter a ${company || 'sua empresa'} como nossa nova parceira. Preparamos uma trilha rápida de implantação com nosso time de especialistas para configurar suas integrações em menos de 48 horas.

Você pode agendar sua primeira sessão de alinhamento pelo link abaixo ou responder a este e-mail caso tenha qualquer dúvida inicial.

Abraços e muito sucesso!  
**Time PulseSaaS**`,
      };

      return res.json({
        draft:
          defaultDrafts[type] ||
          `**Assunto:** Alinhamento estratégico sobre as operações da ${company || 'empresa'}

Olá ${customerName || 'Cliente'}, tudo bem?

Gostaria de agendar uma breve conversa para avaliarmos o impacto das ferramentas na sua operação e compartilhar melhorias recentes que podem otimizar o dia a dia da sua equipe.

Fico à disposição!

Atenciosamente,  
**Equipe PulseSaaS**`,
        isOfflineFallback: true,
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: promptText,
        config: {
          systemInstruction:
            'Você é um especialista em Copywriting B2B e Vendas consultivas para SaaS. Escreva e-mails e propostas que geram respostas e altas taxas de conversão.',
        },
      });

      return res.json({
        draft: response.text || '',
        isOfflineFallback: false,
      });
    } catch (err: any) {
      console.error('Erro na redação Gemini:', err);
      return res.status(500).json({ error: 'Erro ao redigir proposta com IA.' });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PulseSaaS backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
