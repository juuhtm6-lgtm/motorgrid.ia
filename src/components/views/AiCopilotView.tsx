import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Zap,
  TrendingUp,
  AlertTriangle,
  Mail,
  FileSpreadsheet,
  Copy,
  Check,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  MessageSquare,
  Car,
} from 'lucide-react';
import { Customer, MetricSummary } from '../../types';

interface AiCopilotViewProps {
  metrics: MetricSummary;
  customers: Customer[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string;
}

export const AiCopilotView: React.FC<AiCopilotViewProps> = ({ metrics, customers }) => {
  const [activeModule, setActiveModule] = useState<'chat' | 'diagnostic' | 'drafter' | 'churn'>('chat');

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'gemini',
      text: 'Olá! Sou o seu Copilot de Inteligência Automotiva MotorGrid, integrado ao Gemini 3.7. Como posso ajudar com diagnósticos de frotas, análise de telemetria CAN-Bus, retenção de concessionárias ou expansão de MRR hoje?',
      timestamp: 'Agora',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Diagnostic State
  const [diagnosticResult, setDiagnosticResult] = useState<string | null>(null);
  const [isDiagnosticLoading, setIsDiagnosticLoading] = useState(false);

  // Drafter State
  const [drafterType, setDrafterType] = useState('upsell');
  const [targetCustomer, setTargetCustomer] = useState(customers[0]?.company || '');
  const [drafterContext, setDrafterContext] = useState('');
  const [drafterResult, setDrafterResult] = useState<string | null>(null);
  const [isDrafterLoading, setIsDrafterLoading] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Churn Radar State
  const atRiskCustomers = customers.filter((c) => c.healthScore < 60);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputPrompt('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          systemInstruction: `Você é o Diretor de Tecnologia e Estrategista da MotorGrid - Automotive Technology, plataforma de telemetria veicular B2B com R$ 148k de MRR, 412 frotas conectadas, Churn de 1.4% e NRR de 112.5%. Responda em português brasileiro com tom altamente técnico, preciso e executivo.`,
        }),
      });
      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'gemini',
        text: data.text || 'Sem resposta do assistente.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'gemini',
        text: 'Não foi possível completar a requisição no momento. Tente novamente em instantes.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleRunFullDiagnostic = async () => {
    setIsDiagnosticLoading(true);
    try {
      const res = await fetch('/api/gemini/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metrics,
          customersSummary: {
            total: customers.length,
            atRisk: atRiskCustomers.length,
            enterpriseMRR: customers
              .filter((c) => c.plan === 'Enterprise')
              .reduce((acc, curr) => acc + curr.mrr, 0),
          },
        }),
      });
      const data = await res.json();
      setDiagnosticResult(data.text);
    } catch (e) {
      setDiagnosticResult('Erro ao conectar com o serviço de IA.');
    } finally {
      setIsDiagnosticLoading(false);
    }
  };

  const handleGenerateDraft = async () => {
    setIsDrafterLoading(true);
    const selectedCustObj = customers.find((c) => c.company === targetCustomer) || customers[0];

    try {
      const res = await fetch('/api/gemini/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: drafterType,
          customerName: selectedCustObj?.name,
          company: selectedCustObj?.company,
          context: drafterContext || `Plano ${selectedCustObj?.plan}, MRR R$ ${selectedCustObj?.mrr}`,
        }),
      });
      const data = await res.json();
      setDrafterResult(data.draft);
    } catch (e) {
      setDrafterResult('Erro ao gerar rascunho.');
    } finally {
      setIsDrafterLoading(false);
    }
  };

  const promptSuggestions = [
    'Como expandir o número de veículos conectados nas contas Pro Telematics?',
    'Estratégias para prevenir churn em concessionárias com baixa leitura de telemetria.',
    'Como estruturar o SLA de 99.98% para o plano Enterprise Fleet?',
    'Elabore um plano de contingência para a conta da Rede Saúde Integrada (Score 52).',
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15">
        <button
          onClick={() => setActiveModule('chat')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeModule === 'chat'
              ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/25'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Chat Estratégico MotorGrid
        </button>

        <button
          onClick={() => setActiveModule('diagnostic')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeModule === 'diagnostic'
              ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/25'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#DDD6FE]" />
          Diagnóstico de Telemetria & MRR
        </button>

        <button
          onClick={() => setActiveModule('drafter')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeModule === 'drafter'
              ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/25'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Mail className="w-4 h-4" />
          Redator de Propostas & E-mails
        </button>

        <button
          onClick={() => setActiveModule('churn')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeModule === 'churn'
              ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/25'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          Prevenção de Churn ({atRiskCustomers.length})
        </button>
      </div>

      {/* MODULE 1: CHAT */}
      {activeModule === 'chat' && (
        <div className="rounded-3xl bg-[#1C1C1E] border border-[#8B5CF6]/15 shadow-xl overflow-hidden flex flex-col h-[640px]">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'gemini' && (
                  <div className="w-8 h-8 rounded-xl bg-[#8B5CF6] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#8B5CF6]/30">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#8B5CF6] text-white rounded-tr-none shadow-md'
                      : 'bg-[#0A0A0B] border border-zinc-800 text-zinc-200 rounded-tl-none whitespace-pre-line shadow-sm'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1.5 font-mono ${
                      msg.sender === 'user' ? 'text-[#DDD6FE] text-right' : 'text-zinc-500'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isChatLoading && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#8B5CF6] flex items-center justify-center text-white shrink-0 animate-pulse shadow-md shadow-[#8B5CF6]/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="p-3 rounded-2xl bg-[#0A0A0B] border border-zinc-800 text-xs text-zinc-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-ping" />
                  Gemini 3.7 analisando telemetria e gerando parecer...
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestions Pills */}
          <div className="px-5 py-2.5 bg-[#0A0A0B]/60 border-t border-zinc-800 flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] text-zinc-500 shrink-0 font-medium">Sugestões:</span>
            {promptSuggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(sug)}
                className="px-3 py-1 rounded-lg bg-[#1C1C1E] hover:bg-zinc-800 border border-zinc-800 hover:border-[#8B5CF6]/40 text-zinc-300 hover:text-white text-[11px] shrink-0 transition-colors cursor-pointer"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-4 border-t border-zinc-800 bg-[#0A0A0B]/80 flex items-center gap-2">
            <input
              type="text"
              placeholder="Pergunte sobre telemetria veicular, frotas conectadas, precificação ou expansão..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              className="flex-1 bg-[#1C1C1E] border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#8B5CF6]"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isChatLoading || !inputPrompt.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold shadow-lg shadow-[#8B5CF6]/25 transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar</span>
            </button>
          </div>
        </div>
      )}

      {/* MODULE 2: DIAGNOSTIC */}
      {activeModule === 'diagnostic' && (
        <div className="p-6 rounded-3xl bg-[#1C1C1E] border border-[#8B5CF6]/15 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C4B5FD]" />
                Diagnóstico Estratégico & Projeções de Frotas MotorGrid
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Avaliação completa dos dados operacionais e geração de plano de ação para os próximos 90 dias.
              </p>
            </div>

            <button
              onClick={handleRunFullDiagnostic}
              disabled={isDiagnosticLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold shadow-lg shadow-[#8B5CF6]/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#DDD6FE]" />
              {isDiagnosticLoading ? 'Executando Análise...' : 'Gerar Novo Diagnóstico'}
            </button>
          </div>

          {diagnosticResult ? (
            <div className="p-5 rounded-2xl bg-[#0A0A0B] border border-[#8B5CF6]/30 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="text-xs font-semibold text-[#C4B5FD]">
                  Relatório Executivo Gerado com Sucesso (MotorGrid + Gemini)
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(diagnosticResult);
                    alert('Relatório copiado!');
                  }}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> Copiar Texto
                </button>
              </div>
              <div className="text-xs text-zinc-200 whitespace-pre-line leading-relaxed">
                {diagnosticResult}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-zinc-500 space-y-3">
              <Sparkles className="w-10 h-10 text-[#8B5CF6]/40 mx-auto" />
              <p className="text-sm font-medium text-zinc-300">
                Nenhum diagnóstico gerado na sessão atual.
              </p>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                Clique no botão "Gerar Novo Diagnóstico" para alimentar o modelo Gemini 3.7 com as métricas atuais de telemetria, MRR e saúde das frotas.
              </p>
            </div>
          )}
        </div>
      )}

      {/* MODULE 3: DRAFTER */}
      {activeModule === 'drafter' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="p-6 rounded-3xl bg-[#1C1C1E] border border-[#8B5CF6]/15 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#A78BFA]" />
              Configuração da Proposta / E-mail
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 font-semibold">Tipo de Comunicação</label>
                <select
                  value={drafterType}
                  onChange={(e) => setDrafterType(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-200 focus:outline-none focus:border-[#8B5CF6]"
                >
                  <option value="upsell">Proposta de Expansão / Upsell de Telemetria</option>
                  <option value="churn">Resgate & Alinhamento de Frota em Risco</option>
                  <option value="onboarding">Boas-vindas & Guia de Ativação OBD-II</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-300 font-semibold">Empresa / Concessionária Destinatária</label>
                <select
                  value={targetCustomer}
                  onChange={(e) => setTargetCustomer(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-200 focus:outline-none focus:border-[#8B5CF6]"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.company}>
                      {c.company} ({c.name} - Plano {c.plan})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-300 font-semibold">Instruções / Contexto Adicional</label>
                <textarea
                  rows={4}
                  value={drafterContext}
                  onChange={(e) => setDrafterContext(e.target.value)}
                  placeholder="Ex: Oferecer 10% de desconto no faturamento anual com instalação gratuita dos módulos OBD-II..."
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <button
                onClick={handleGenerateDraft}
                disabled={isDrafterLoading}
                className="w-full py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs shadow-lg shadow-[#8B5CF6]/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#DDD6FE]" />
                {isDrafterLoading ? 'Escrevendo...' : 'Redigir com Gemini'}
              </button>
            </div>
          </div>

          {/* Result Output */}
          <div className="p-6 rounded-3xl bg-[#1C1C1E] border border-[#8B5CF6]/15 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-sm font-bold text-white">Rascunho Gerado</h3>
                {drafterResult && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(drafterResult);
                      setCopiedDraft(true);
                      setTimeout(() => setCopiedDraft(false), 2000);
                    }}
                    className="text-xs text-[#A78BFA] hover:text-[#C4B5FD] flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    {copiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedDraft ? 'Copiado!' : 'Copiar E-mail'}
                  </button>
                )}
              </div>

              {drafterResult ? (
                <div className="p-4 rounded-2xl bg-[#0A0A0B] border border-zinc-800 text-xs text-zinc-200 whitespace-pre-line leading-relaxed">
                  {drafterResult}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center text-zinc-500">
                  <Mail className="w-8 h-8 text-zinc-700 mb-2" />
                  <p className="text-xs">Selecione os parâmetros e clique em Redigir.</p>
                </div>
              )}
            </div>

            {drafterResult && (
              <div className="pt-4 border-t border-zinc-800 text-[11px] text-zinc-400">
                Pronto para envio via e-mail corporativo ou WhatsApp da conta.
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODULE 4: CHURN PREVENT */}
      {activeModule === 'churn' && (
        <div className="p-6 rounded-3xl bg-[#1C1C1E] border border-[#8B5CF6]/15 shadow-xl space-y-6">
          <div className="border-b border-zinc-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              Radar Preditivo de Churn & Playbooks de Resgate
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Identificação de sinais precoces de desconexão de dispositivos e sugestões de contato proativo do time de CS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {atRiskCustomers.map((cust) => (
              <div
                key={cust.id}
                className="p-5 rounded-2xl bg-[#0A0A0B] border border-rose-500/30 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={cust.avatar}
                      alt={cust.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500/40"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{cust.company}</h4>
                      <p className="text-[11px] text-zinc-400">{cust.name} • {cust.city}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                    Score {cust.healthScore}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#1C1C1E] border border-zinc-800 text-xs text-zinc-300 space-y-1.5">
                  <div className="text-[11px] font-semibold text-amber-400">
                    Sintomas Detectados:
                  </div>
                  <p className="text-zinc-400 leading-relaxed">{cust.notes}</p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="font-mono text-zinc-300">
                    MRR em Risco: <strong className="text-white">R$ {cust.mrr.toLocaleString('pt-BR')}</strong>
                  </span>
                  <button
                    onClick={() => {
                      setActiveModule('drafter');
                      setDrafterType('churn');
                      setTargetCustomer(cust.company);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold transition-all cursor-pointer shadow-md shadow-[#8B5CF6]/20"
                  >
                    Gerar E-mail de Resgate &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
