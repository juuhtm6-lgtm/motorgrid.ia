import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  AlertTriangle,
  Bot,
  Sliders,
  ShieldCheck,
  Zap,
  Mic,
  FileText,
  DollarSign,
  Car,
  Award,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';
import { initialAiAudits } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import { storageService } from '../../services/storageService';

export const GridAiView: React.FC = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'scoring' | 'auditoria' | 'objecoes' | 'audio'>('scoring');

  // Simulator state
  const [hasTradeIn, setHasTradeIn] = useState(true);
  const [downPaymentPercent, setDownPaymentPercent] = useState(40);
  const [isFinancingApproved, setIsFinancingApproved] = useState(true);
  const [urgencyLevel, setUrgencyLevel] = useState<'Alta (Esta Semana)' | 'Média (Este Mês)' | 'Baixa'>('Alta (Esta Semana)');
  const [contactChannel, setContactChannel] = useState('WhatsApp Direct');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Calculate simulated score
  let score = 50;
  if (hasTradeIn) score += 15;
  if (downPaymentPercent >= 30) score += 15;
  if (isFinancingApproved) score += 10;
  if (urgencyLevel === 'Alta (Esta Semana)') score += 10;
  if (score > 100) score = 98;

  const objectionArguments = [
    {
      objection: '"Achei a avaliação do meu seminovo na troca muito baixa."',
      strategy: 'Valorização de Mercado + Segurança e Liquidez Imediata',
      script:
        'Entendo perfeitamente sua colocação, Marcelo! Na nossa avaliação já assumimos todo o risco de laudo cautelar, transferência imediata no Detran, revisão preventiva e garantia para o próximo comprador, sem você precisar passar pelo estresse de negociar com particulares. Além disso, se fecharmos hoje, consigo abater esse valor diretamente na entrada com bônus de R$ 3.000 da concessionária.',
    },
    {
      objection: '"O preço do carro está um pouco acima do que pretendo pagar."',
      strategy: 'Ancoragem de Opcionais Exclusivos + Custo de Oportunidade',
      script:
        'Compreendo, doutor! Vale ressaltar que este exemplar específico é uma versão única com pacote Sport Chrono, escape original de fábrica e todas as revisões feitas na concessionária alemã com histórico 100% carimbado. Um carro nesse estado de conservação mantém o valor de revenda muito acima da média de mercado.',
    },
    {
      objection: '"Vou pensar no final de semana e te dou um retorno na segunda."',
      strategy: 'Escassez Real + Agendamento de Test Drive sem Compromisso',
      script:
        'Sem problemas! Apenas um aviso de cortesia: tivemos 4 consultas neste mesmo veículo ontem através do portal Webmotors. Para que você não corra o risco de perder a oportunidade, o que acha de passar aqui hoje às 17h para dar uma volta no carro? Se gostar, seguramos a preferência para você até segunda-feira.',
    },
  ];

  const handleCopyScript = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    toast.success('Script de objeção copiado para a área de transferência!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Sub navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-800 text-xs">
        <button
          onClick={() => setActiveTab('scoring')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'scoring'
              ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30'
              : 'bg-[#1C1C1E] text-zinc-400 border border-zinc-800 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Grid Score Automotivo (0-100)</span>
        </button>

        <button
          onClick={() => setActiveTab('auditoria')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'auditoria'
              ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30'
              : 'bg-[#1C1C1E] text-zinc-400 border border-zinc-800 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Auditoria de Qualidade Comercial</span>
        </button>

        <button
          onClick={() => setActiveTab('objecoes')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'objecoes'
              ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30'
              : 'bg-[#1C1C1E] text-zinc-400 border border-zinc-800 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Contorno de Objeções Instantâneo</span>
        </button>

        <button
          onClick={() => setActiveTab('audio')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'audio'
              ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30'
              : 'bg-[#1C1C1E] text-zinc-400 border border-zinc-800 hover:text-white'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>Transcrição de Áudio (Whisper IA)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. GRID SCORE SIMULATOR */}
      {/* ========================================================================= */}
      {activeTab === 'scoring' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Simulator Controls (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-[#1C1C1E] border border-zinc-800 space-y-5">
            <div>
              <h3 className="font-bold text-white text-base">
                Simulador de Qualificação Automotiva (Grid Score)
              </h3>
              <p className="text-xs text-zinc-400">
                A IA analisa sinais de compra em tempo real no atendimento e pontua de 0 a 100
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-2">
                  Cliente possui veículo usado para dar de entrada na troca?
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setHasTradeIn(true)}
                    className={`flex-1 py-2.5 rounded-xl border font-bold transition-all cursor-pointer ${
                      hasTradeIn
                        ? 'bg-[#25193A] border-[#8B5CF6] text-white'
                        : 'bg-[#0A0A0B] border-zinc-800 text-zinc-400'
                    }`}
                  >
                    ✓ Sim, tem veículo de troca (+15 pts)
                  </button>
                  <button
                    onClick={() => setHasTradeIn(false)}
                    className={`flex-1 py-2.5 rounded-xl border font-bold transition-all cursor-pointer ${
                      !hasTradeIn
                        ? 'bg-[#25193A] border-[#8B5CF6] text-white'
                        : 'bg-[#0A0A0B] border-zinc-800 text-zinc-400'
                    }`}
                  >
                    Sem troca
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold text-zinc-300">
                    Percentual de Entrada Disponível à Vista:
                  </label>
                  <span className="font-bold text-[#DDD6FE] font-mono">{downPaymentPercent}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={80}
                  step={5}
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full accent-[#8B5CF6] cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-2">
                  Crédito / Financiamento Bancário:
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsFinancingApproved(true)}
                    className={`flex-1 py-2.5 rounded-xl border font-bold transition-all cursor-pointer ${
                      isFinancingApproved
                        ? 'bg-[#25193A] border-emerald-500 text-emerald-300'
                        : 'bg-[#0A0A0B] border-zinc-800 text-zinc-400'
                    }`}
                  >
                    ✓ Crédito Já Pré-Aprovado (+10 pts)
                  </button>
                  <button
                    onClick={() => setIsFinancingApproved(false)}
                    className={`flex-1 py-2.5 rounded-xl border font-bold transition-all cursor-pointer ${
                      !isFinancingApproved
                        ? 'bg-[#25193A] border-zinc-700 text-zinc-300'
                        : 'bg-[#0A0A0B] border-zinc-800 text-zinc-400'
                    }`}
                  >
                    Avaliar Financiamento
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-2">
                  Urgência Declarada do Comprador:
                </label>
                <select
                  value={urgencyLevel}
                  onChange={(e) => setUrgencyLevel(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white outline-none cursor-pointer"
                >
                  <option value="Alta (Esta Semana)">Alta - Quer fechar e retirar o carro esta semana (+10 pts)</option>
                  <option value="Média (Este Mês)">Média - Pesquisando opções para trocar neste mês (+5 pts)</option>
                  <option value="Baixa">Baixa - Apenas curiosidade sobre valores (+0 pts)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Gauge & Result Card (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/40 flex flex-col justify-between space-y-6 shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Classificação do Lead
                </span>
                <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-extrabold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  LEAD QUENTE
                </span>
              </div>

              {/* Huge Score Display */}
              <div className="text-center py-4 bg-[#0A0A0B] rounded-2xl border border-zinc-800/80">
                <div className="text-6xl font-black text-emerald-400 font-mono tracking-tight">
                  {score}
                </div>
                <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider mt-1">
                  Pontos de Intenção de Compra
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${score}%` }}
                />
              </div>

              {/* Summary recommendation */}
              <div className="p-3.5 rounded-xl bg-purple-950/20 border border-[#8B5CF6]/30 text-xs space-y-1">
                <span className="font-bold text-[#DDD6FE] block">
                  🎯 Recomendação Comercial da Grid AI:
                </span>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  Alta probabilidade de conversão nas próximas 48 horas. Priorize o agendamento do
                  Test Drive presencial e bloqueie o veículo no estoque com pré-reserva.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const cards = storageService.getCards();
                if (cards.length > 0) {
                  const updated = cards.map((c, i) => i === 0 ? { ...c, gridScore: score } : c);
                  storageService.saveCards(updated);
                }
                toast.success(`Grid Score de ${score} pts sincronizado com sucesso nos leads ativos!`);
              }}
              className="w-full py-3 rounded-xl bg-[#C4B5FD] hover:bg-[#DDD6FE] text-[#2E1065] font-extrabold text-xs shadow-lg shadow-[#8B5CF6]/20 transition-all cursor-pointer font-['Plus_Jakarta_Sans',sans-serif]"
            >
              Aplicar Score nos Atendimentos Ativos
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. AUDITORIA DE QUALIDADE COMERCIAL */}
      {/* ========================================================================= */}
      {activeTab === 'auditoria' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#1C1C1E] border border-zinc-800 space-y-4">
            <div>
              <h3 className="font-bold text-white text-base">
                Auditoria Automatizada de Conversas (Qualidade do Vendedor)
              </h3>
              <p className="text-xs text-zinc-400">
                A IA analisa todas as mensagens, áudios e tempos de resposta e pontua a eficácia da abordagem comercial
              </p>
            </div>

            <div className="space-y-4">
              {initialAiAudits.map((audit) => (
                <div
                  key={audit.id}
                  className="p-4 rounded-xl bg-[#0A0A0B] border border-zinc-800 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-sm">
                        Atendimento: {audit.conversationId}
                      </span>
                      <span className="text-zinc-400 block text-[11px]">
                        Vendedor: {audit.sellerName} • {audit.timestamp}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-emerald-400 font-mono">
                        {audit.score} / 100
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">Nota de Eficácia</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                      <span className="font-bold text-emerald-400 text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Pontos Fortes:
                      </span>
                      <ul className="text-zinc-300 text-[11px] list-disc list-inside space-y-0.5">
                        {audit.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/20 space-y-1">
                      <span className="font-bold text-amber-400 text-[11px] flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Oportunidades de Melhoria:
                      </span>
                      <ul className="text-zinc-300 text-[11px] list-disc list-inside space-y-0.5">
                        {audit.improvements.map((imp, i) => (
                          <li key={i}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CONTORNO DE OBJEÇÕES */}
      {/* ========================================================================= */}
      {activeTab === 'objecoes' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#1C1C1E] border border-zinc-800 space-y-4">
            <div>
              <h3 className="font-bold text-white text-base">
                Biblioteca de Quebra de Objeções Automotivas
              </h3>
              <p className="text-xs text-zinc-400">
                Scripts validados por negociadores de alta performance para copiar e enviar no WhatsApp
              </p>
            </div>

            <div className="space-y-4">
              {objectionArguments.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#0A0A0B] border border-zinc-800 space-y-2.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-400 text-sm">{item.objection}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-[#DDD6FE] font-semibold border border-purple-500/30">
                      {item.strategy}
                    </span>
                  </div>

                  <p className="text-zinc-200 leading-relaxed bg-[#141416] p-3 rounded-lg border border-zinc-700/80">
                    "{item.script}"
                  </p>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleCopyScript(item.script, idx)}
                      className="px-3 py-1.5 rounded-lg bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/35 text-[#DDD6FE] border border-[#8B5CF6]/40 font-bold transition-all flex items-center gap-1.5 cursor-pointer text-xs"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar para o WhatsApp</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TRANSCRIÇÃO DE ÁUDIO WHISPER IA */}
      {/* ========================================================================= */}
      {activeTab === 'audio' && (
        <div className="p-6 rounded-2xl bg-[#1C1C1E] border border-zinc-800 space-y-4">
          <div>
            <h3 className="font-bold text-white text-base">
              Processador de Áudio &amp; Notas de Voz com IA
            </h3>
            <p className="text-xs text-zinc-400">
              Transforme áudios recebidos dos clientes em dados estruturados de CRM (Marca, Modelo, Ano, Entrada e Restrições)
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0A0A0B] border border-[#8B5CF6]/40 space-y-3 text-xs">
            <div className="flex items-center justify-between font-bold text-white">
              <span>Áudio recebido de: Marcelo Albuquerque (0:38)</span>
              <span className="text-emerald-400 font-mono">100% Transcrito</span>
            </div>

            <div className="p-3 rounded-lg bg-[#141416] border border-zinc-800 text-zinc-300 italic">
              "Boa tarde Camila, tudo bem? Vi a BMW 320i 2024 que vocês anunciaram no Instagram. Gostaria de saber se vocês aceitam meu Jeep Compass Longitude 2022 com 35 mil km na troca e qual seria a volta em dinheiro."
            </div>

            <div className="p-3 rounded-lg bg-purple-950/20 border border-[#8B5CF6]/30 text-xs space-y-1.5">
              <span className="font-bold text-[#C4B5FD] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Entidades Automotivas Extraídas pela IA:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                <div className="p-1.5 rounded bg-[#0A0A0B] border border-zinc-800">
                  <span className="text-zinc-500 block">Veículo Desejado:</span>
                  <span className="font-bold text-white">BMW 320i M Sport (2024)</span>
                </div>
                <div className="p-1.5 rounded bg-[#0A0A0B] border border-zinc-800">
                  <span className="text-zinc-500 block">Veículo na Troca:</span>
                  <span className="font-bold text-amber-300">Jeep Compass (2022, 35k km)</span>
                </div>
                <div className="p-1.5 rounded bg-[#0A0A0B] border border-zinc-800">
                  <span className="text-zinc-500 block">Condição de Pagamento:</span>
                  <span className="font-bold text-emerald-400">Troca + Saldo em Dinheiro</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
