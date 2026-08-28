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

  // ========================================================
  // META MARKETING API & AUTOMOTIVE ADS ENDPOINTS
  // ========================================================

  // In-memory tenant connection state
  let metaConnectionState = {
    isConnected: true,
    businessManagerId: 'bm_289410982341',
    businessManagerName: 'MotorGrid Holdings Brasil',
    adAccountId: 'act_48291048190',
    adAccountName: 'MotorGrid Motors - SP Matriz & Jardins',
    pageId: 'page_99182374615',
    pageName: 'MotorGrid Motors Premium',
    instagramId: 'ig_77491028341',
    instagramHandle: '@motorgridmotors',
    pixelId: 'pix_9281740192',
    appId: '109284719284019',
    lastSyncAt: new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    webhookActive: true,
    status: 'CONNECTED',
  };

  // 1. Get Meta Connection Status
  app.get('/api/meta/status', (req: Request, res: Response) => {
    res.json({
      success: true,
      data: metaConnectionState,
    });
  });

  // 2. Connect / Save Meta Credentials
  app.post('/api/meta/connect', (req: Request, res: Response) => {
    const {
      adAccountId,
      adAccountName,
      businessManagerId,
      businessManagerName,
      pageId,
      pageName,
      instagramHandle,
      accessToken,
    } = req.body;

    metaConnectionState = {
      ...metaConnectionState,
      isConnected: true,
      adAccountId: adAccountId || metaConnectionState.adAccountId,
      adAccountName: adAccountName || metaConnectionState.adAccountName,
      businessManagerId: businessManagerId || metaConnectionState.businessManagerId,
      businessManagerName: businessManagerName || metaConnectionState.businessManagerName,
      pageId: pageId || metaConnectionState.pageId,
      pageName: pageName || metaConnectionState.pageName,
      instagramHandle: instagramHandle || metaConnectionState.instagramHandle,
      status: 'CONNECTED',
      lastSyncAt: 'Agora mesmo (' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + ')',
    };

    res.json({
      success: true,
      message: 'Conta da Meta Marketing API conectada com sucesso!',
      data: metaConnectionState,
    });
  });

  // 3. Disconnect Meta Account
  app.post('/api/meta/disconnect', (req: Request, res: Response) => {
    metaConnectionState = {
      ...metaConnectionState,
      isConnected: false,
      status: 'DISCONNECTED',
    };
    res.json({
      success: true,
      message: 'Conta Meta desconectada com segurança.',
      data: metaConnectionState,
    });
  });

  // 4. Trigger Meta Sync
  app.post('/api/meta/sync', (req: Request, res: Response) => {
    const now = new Date();
    metaConnectionState.lastSyncAt =
      'Hoje às ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    res.json({
      success: true,
      message: 'Sincronização com a Meta Graph API v19.0 concluída com sucesso!',
      syncedAt: metaConnectionState.lastSyncAt,
      stats: {
        campaignsUpdated: 5,
        adSetsUpdated: 12,
        adsUpdated: 20,
        leadsSynced: 186,
      },
    });
  });

  // 5. Ingestion Webhook for Lead Ads
  app.post('/api/meta/webhook/lead', (req: Request, res: Response) => {
    const leadPayload = req.body;
    console.log('Recebido novo Lead via Webhook Meta:', leadPayload);
    res.status(200).json({
      received: true,
      processed: true,
      leadId: `lead_meta_${Date.now()}`,
      routedTo: 'SDR Automático MotorGrid',
    });
  });

  // 6. Gemini AI Automotive Ad Intelligence Analysis
  app.post('/api/meta/ai-analysis', async (req: Request, res: Response) => {
    const { period, summaryMetrics, campaigns } = req.body;

    const ai = getAiClient();

    const promptText = `Você é o Principal Especialista em Tráfego Pago Automotivo e Diretor Comercial de Lojas de Carros e Concessionárias.
Analise os seguintes dados reais da conta do Meta Ads e do CRM da loja no período "${period || 'Este Mês'}":

MÉTRICAS GERAIS:
- Investimento Total: R$ ${summaryMetrics?.spend || '4.850,00'}
- Impressões: ${summaryMetrics?.impressions || '125.430'}
- Cliques no Link: ${summaryMetrics?.clicks || '3.420'} (CTR: 2,73% | CPC: R$ 1,42)
- Leads Gerados: ${summaryMetrics?.leads || '186'}
- Custo por Lead (CPL): R$ ${summaryMetrics?.cpl || '26,08'}
- Atendimentos Iniciados: ${summaryMetrics?.atendimentos || '174'} (93,5% dos leads)
- Leads Qualificados: ${summaryMetrics?.qualificados || '92'} (52,9%)
- Agendamentos de Test-Drive/Visita: ${summaryMetrics?.agendamentos || '48'} (52,2%)
- Visitas Realizadas no Showroom: ${summaryMetrics?.visitas || '31'} (64,6%)
- Vendas Fechadas: ${summaryMetrics?.vendas || '12'} (38,7% das visitas | 6,45% do total de leads)
- Custo por Venda (CAC): R$ ${summaryMetrics?.cac || '404,17'}
- Receita de Vendas Gerada: R$ ${summaryMetrics?.revenue || '1.840.000,00'}
- ROAS da Mídia: ${summaryMetrics?.roas || '379.4x'}

CAMPANHAS EM DESTAQUE:
${JSON.stringify(campaigns || [], null, 2)}

Gere um diagnóstico executivo de alto impacto estruturado com:
1. 🏁 **Diagnóstico Executivo de Conversão (Mídia → Showroom → Fechamento)**: Pontos fortes e rentabilidade real da mídia.
2. 🚨 **Gargalos Operacionais & Perda de Oportunidades**: Onde os leads estão se perdendo (SLA de resposta, qualificação ou visita).
3. 💡 **Recomendações Práticas para a Próxima Semana**: Ações concretas nos criativos, no orçamento e no time de vendas para aumentar o número de carros vendidos.

Responda em português brasileiro com formatação Markdown impecável, tom consultivo premium e foco em ROI financeiro da loja.`;

    if (!ai) {
      return res.json({
        analysis: `### 🏁 Diagnóstico Executivo de Tráfego Automotivo & Conversão

#### 1. Performance Geral de Mídia & Eficiência Financeira
* **Excelente Retorno sobre Investimento (ROAS 379.4x):** Com um investimento de R$ 4.850,00 em Meta Ads, a loja gerou R$ 1.840.000,00 em receita bruta através de 12 veículos entregues, resultando em um **CAC de apenas R$ 404,17 por carro vendido**.
* **CPL Saudável (R$ 26,08):** O custo por lead está 14% abaixo da média do mercado automotivo premium (benchmark R$ 30-40).
* **Taxa de Fechamento Lead → Venda em 6,45%:** Índice muito acima da média nacional de concessionárias (3-4%), comprovando alta precisão da segmentação de público.

#### 2. Diagnóstico dos Gargalos Comerciais (Meta + CRM)
* **Gargalo no Funil do Creta:** A campanha do Creta gera grande volume a baixo custo (CPL R$ 11,81), mas apenas 13,6% dos qualificados avançam para agendamento. Muitos leads buscam apenas curiosidades de valor de parcela sem crédito pré-aprovado.
* **12 Leads sem Primeiro Contato:** Identificamos leads que ficaram sem resposta nos primeiros 10 minutos. No mercado de veículos, o contato em menos de 3 minutos triplica a chance de agendamento de visita.

#### 3. Plano de Ação Estratégico Imediato
* **1. Realocar R$ 400 da verba do Creta para a Porsche 911 e Compass:** A campanha da Porsche entregou 4 vendas diretas (R$ 780k de faturamento) com CAC de R$ 362,50.
* **2. Reforçar criativos de Vídeo no Instagram:** Os anúncios em formato Reels e Vídeo registraram CTR 32% superior aos estáticos.
* **3. Trava de Qualificação no Formulário:** Incluir campo obrigatório "Possui veículo na troca?" e "Faixa de entrada disponível" para filtrar leads mais quentes.`,
        isOfflineFallback: true,
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: promptText,
        config: {
          systemInstruction:
            'Você é o Principal Especialista em Tráfego Pago Automotivo e Diretor Comercial de Lojas de Carros e Concessionárias. Forneça análises de alto nível, dados precisos e recomendações objetivas para donos de lojas de veículos.',
        },
      });

      return res.json({
        analysis: response.text || '',
        isOfflineFallback: false,
      });
    } catch (err: any) {
      console.error('Erro no AI analysis Meta:', err);
      return res.status(500).json({ error: 'Erro ao gerar análise de anúncios.' });
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
