import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Clock,
  Send,
  GitBranch,
  Users,
  Play,
  Pause,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  MessageSquare,
  Bot,
  Layers,
  ChevronRight,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { AutomationRule } from '../../types';
import { storageService, ScheduledMessageItem, BroadcastCampaignItem } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { CreateAutomationModal } from '../modals/CreateAutomationModal';
import { CreateBroadcastModal } from '../modals/CreateBroadcastModal';

export const AutomacaoView: React.FC = () => {
  const toast = useToast();
  const [subTab, setSubTab] = useState<
    'regras' | 'sequencias' | 'agendadas' | 'transmissoes' | 'chatbot' | 'distribuicao'
  >('regras');

  const [rules, setRules] = useState<AutomationRule[]>(() => storageService.getAutomations());
  const [scheduledMsgs, setScheduledMsgs] = useState<ScheduledMessageItem[]>(() => storageService.getScheduledMessages());
  const [broadcasts, setBroadcasts] = useState<BroadcastCampaignItem[]>(() => storageService.getBroadcastCampaigns());

  const [isCreateRuleOpen, setIsCreateRuleOpen] = useState(false);
  const [isCreateBroadcastOpen, setIsCreateBroadcastOpen] = useState(false);

  useEffect(() => {
    const unsub = storageService.subscribe(() => {
      setRules(storageService.getAutomations());
      setScheduledMsgs(storageService.getScheduledMessages());
      setBroadcasts(storageService.getBroadcastCampaigns());
    });
    return unsub;
  }, []);

  const toggleRule = (id: string) => {
    const newState = storageService.toggleAutomation(id);
    toast.info(`Regra de automação ${newState ? 'ativada' : 'pausada'}.`);
  };

  const handleDeleteRule = (id: string, name: string) => {
    storageService.deleteAutomation(id);
    toast.success(`Regra "${name}" removida com sucesso.`);
  };

  const handleCancelScheduledMessage = (id: string) => {
    storageService.cancelScheduledMessage(id);
    toast.success('Mensagem agendada cancelada com sucesso.');
  };

  const handleSaveNewRule = (ruleData: Omit<AutomationRule, 'id' | 'executionsCount' | 'lastExecuted'>) => {
    storageService.addAutomation(ruleData);
    toast.success('Nova regra de automação criada e ativada com sucesso!');
  };

  const handleSendBroadcast = (campaign: { name: string; segment: string; message: string; scheduledTime: string }) => {
    storageService.addBroadcastCampaign(campaign.name);
    toast.success(`Campanha "${campaign.name}" iniciada para ${campaign.segment}!`);
  };

  return (
    <div className="space-y-6">
      {/* Sub Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-800 text-xs">
        <button
          onClick={() => setSubTab('regras')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            subTab === 'regras'
              ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30'
              : 'bg-[#1C1C1E] text-zinc-400 border border-zinc-800 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Regras de Automação</span>
        </button>

        <button
          onClick={() => setSubTab('sequencias')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            subTab === 'sequencias'
              ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30'
              : 'bg-[#1C1C1E] text-zinc-400 border border-zinc-800 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Sequências de Follow-Up</span>
        </button>

        <button
          onClick={() => setSubTab('agendadas')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            subTab === 'agendadas'
              ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30'
              : 'bg-[#1C1C1E] text-zinc-400 border border-zinc-800 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Mensagens Agendadas</span>
        </button>

        <button
          onClick={() => setSubTab('transmissoes')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            subTab === 'transmissoes'
              ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30'
              : 'bg-[#1C1C1E] text-zinc-400 border border-zinc-800 hover:text-white'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Campanhas de Transmissão</span>
        </button>

        <button
          onClick={() => setSubTab('chatbot')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            subTab === 'chatbot'
              ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30'
              : 'bg-[#1C1C1E] text-zinc-400 border border-zinc-800 hover:text-white'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Chatbot Visual</span>
        </button>

        <button
          onClick={() => setSubTab('distribuicao')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            subTab === 'distribuicao'
              ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30'
              : 'bg-[#1C1C1E] text-zinc-400 border border-zinc-800 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Distribuição de Leads (SLA)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. REGRAS DE AUTOMAÇÃO */}
      {/* ========================================================================= */}
      {subTab === 'regras' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Gatilhos Comerciais &amp; Automações Ativas</h3>
            <button
              onClick={() => setIsCreateRuleOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#C4B5FD] hover:bg-[#DDD6FE] text-[#2E1065] font-bold text-xs shadow-md shadow-[#8B5CF6]/20 transition-all flex items-center gap-1.5 cursor-pointer font-['Plus_Jakarta_Sans',sans-serif]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Nova Regra de Automação</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="p-5 rounded-2xl bg-[#1C1C1E] border border-zinc-800 hover:border-[#8B5CF6]/40 shadow-xl transition-all space-y-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-white text-sm">{rule.name}</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">{rule.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                        rule.enabled
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                      }`}
                    >
                      {rule.enabled ? 'Ativa' : 'Pausada'}
                    </button>
                    <button
                      onClick={() => handleDeleteRule(rule.id, rule.name)}
                      title="Excluir regra"
                      className="p-1 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Visual Logic Blocks: Trigger -> Condition -> Action */}
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-800 flex items-center gap-2">
                    <span className="text-[#A78BFA] font-bold text-[10px] uppercase font-mono">
                      SE (Gatilho):
                    </span>
                    <span className="text-zinc-300">{rule.trigger}</span>
                  </div>

                  {rule.condition && (
                    <div className="p-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-800 flex items-center gap-2">
                      <span className="text-amber-400 font-bold text-[10px] uppercase font-mono">
                        E SE (Condição):
                      </span>
                      <span className="text-zinc-300">{rule.condition}</span>
                    </div>
                  )}

                  <div className="p-2.5 rounded-xl bg-[#0A0A0B] border border-[#8B5CF6]/30 flex items-center gap-2">
                    <span className="text-emerald-400 font-bold text-[10px] uppercase font-mono">
                      ENTÃO (Ação):
                    </span>
                    <span className="text-[#DDD6FE] font-medium">{rule.action}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span>Execuções: {rule.executionsCount} leads</span>
                  <span>Última: {rule.lastExecuted}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SEQUÊNCIAS DE FOLLOW-UP */}
      {/* ========================================================================= */}
      {subTab === 'sequencias' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#1C1C1E] border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">
                  Cadência Automotiva de 7 Dias (Leads de Portais)
                </h3>
                <p className="text-xs text-zinc-400">
                  Régua multicanal inteligente: WhatsApp + Áudio Humanizado + Notificação Vendedor
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                Taxa de Resposta: 68.4%
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {[
                {
                  day: 'Minuto 1',
                  channel: 'WhatsApp',
                  title: 'Primeiro Contato Imediato + Ficha Técnica do Veículo',
                  desc: 'Envia mensagem personalizada com fotos em alta resolução do carro e opção de simular financiamento.',
                },
                {
                  day: 'Hora 3 (Sem Resposta)',
                  channel: 'WhatsApp (Áudio IA)',
                  title: 'Áudio Humanizado com Transcrição do SDR',
                  desc: '"Oi Marcelo, tudo bem? Vi que você pediu detalhes da BMW 320i. Conseguiu dar uma olhada nas fotos?"',
                },
                {
                  day: 'Dia 2',
                  channel: 'CRM + WhatsApp',
                  title: 'Oferta de Avaliação Técnica do Usado',
                  desc: 'Pergunta se o cliente possui algum seminovo para entrar na troca com valorização de até 100% da FIPE.',
                },
                {
                  day: 'Dia 4',
                  channel: 'Notificação Push',
                  title: 'Alerta de Escalação para o Gerente de Vendas',
                  desc: 'Cria tarefa prioritária para o gerente ligar pessoalmente com condição especial de taxa zero.',
                },
                {
                  day: 'Dia 7',
                  channel: 'WhatsApp',
                  title: 'Mensagem de Resgate & Encerramento Educado',
                  desc: 'Informa que o carro teve muita procura e pergunta se deseja manter o interesse ou ver outro modelo.',
                },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#0A0A0B] border border-zinc-800 flex items-start gap-3.5"
                >
                  <div className="px-2.5 py-1 rounded-lg bg-[#8B5CF6]/20 text-[#C4B5FD] font-mono text-xs font-bold shrink-0">
                    {step.day}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-xs">{step.title}</h4>
                      <span className="text-[10px] px-2 py-0.2 rounded bg-zinc-800 text-zinc-300 font-mono">
                        {step.channel}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MENSAGENS AGENDADAS */}
      {/* ========================================================================= */}
      {subTab === 'agendadas' && (
        <div className="p-5 rounded-2xl bg-[#1C1C1E] border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Fila de Envios Agendados via WhatsApp</h3>
            <span className="text-xs text-zinc-400 font-mono">{scheduledMsgs.length} mensagens na fila</span>
          </div>

          {scheduledMsgs.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-[#0A0A0B] border border-zinc-800 text-zinc-400 text-sm">
              Nenhuma mensagem agendada no momento.
            </div>
          ) : (
            <div className="space-y-3">
              {scheduledMsgs.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[#0A0A0B] border border-zinc-800 flex items-start justify-between gap-4 text-xs"
                >
                  <div className="space-y-1.5">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{item.to}</span>
                      <span className="text-[#C4B5FD] font-mono text-[10px]">🚗 {item.car}</span>
                    </div>
                    <p className="text-zinc-300 italic">"{item.msg}"</p>
                    <div className="text-[11px] text-amber-400 font-mono">⏰ Disparo: {item.time}</div>
                  </div>
                  <button
                    onClick={() => handleCancelScheduledMessage(item.id)}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs transition-colors cursor-pointer shrink-0"
                  >
                    Cancelar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CAMPANHAS DE TRANSMISSÃO */}
      {/* ========================================================================= */}
      {subTab === 'transmissoes' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#1C1C1E] border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Disparos em Massa &amp; Campanhas de Feirão</h3>
                <p className="text-xs text-zinc-400">
                  Envios inteligentes respeitando limites anti-bloqueio da Meta WhatsApp API
                </p>
              </div>
              <button
                onClick={() => setIsCreateBroadcastOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#C4B5FD] hover:bg-[#DDD6FE] text-[#2E1065] font-bold text-xs shadow-md shadow-[#8B5CF6]/20 transition-all cursor-pointer font-['Plus_Jakarta_Sans',sans-serif]"
              >
                + Nova Transmissão
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {broadcasts.map((c) => (
                <div key={c.id} className="p-4 rounded-xl bg-[#0A0A0B] border border-zinc-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">{c.title}</h4>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                      {c.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-[#1C1C1E] border border-zinc-800">
                      <div className="text-[10px] text-zinc-500">Disparados</div>
                      <div className="font-bold text-white mt-0.5">{c.sent}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-[#1C1C1E] border border-zinc-800">
                      <div className="text-[10px] text-zinc-500">Taxa Abertura</div>
                      <div className="font-bold text-emerald-400 mt-0.5">{c.read}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-[#1C1C1E] border border-zinc-800">
                      <div className="text-[10px] text-zinc-500">Vendas Geradas</div>
                      <div className="font-bold text-[#DDD6FE] mt-0.5">{c.sales} carros</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. CHATBOT VISUAL */}
      {/* ========================================================================= */}
      {subTab === 'chatbot' && (
        <div className="p-6 rounded-2xl bg-[#1C1C1E] border border-zinc-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Fluxo Interativo de Atendimento Inicial</h3>
              <p className="text-xs text-zinc-400">
                Qualificação automática de veículo, troca e entrada antes do transbordo humano
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-[#DDD6FE] border border-purple-500/30 text-xs font-bold flex items-center gap-1.5">
              <Bot className="w-4 h-4" />
              IA Autônoma Ativa
            </span>
          </div>

          {/* Visual flowchart diagram */}
          <div className="flex flex-col items-center space-y-4 max-w-xl mx-auto text-xs">
            {/* Step 1 */}
            <div className="w-full p-4 rounded-xl bg-[#0A0A0B] border border-[#8B5CF6] text-center shadow-lg space-y-1">
              <div className="font-bold text-white text-sm">1. Entrada do Lead (Meta/Webmotors/WhatsApp)</div>
              <p className="text-zinc-400 text-xs">
                Mensagem de boas-vindas com o nome do cliente e identificação do carro pesquisado.
              </p>
            </div>

            <div className="text-zinc-500">↓</div>

            {/* Step 2 */}
            <div className="w-full p-4 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-center space-y-1">
              <div className="font-bold text-white text-sm">2. Pergunta de Qualificação: Possui Veículo na Troca?</div>
              <div className="flex items-center justify-center gap-3 pt-1">
                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  Opção A: Sim (Solicita Modelo e Km)
                </span>
                <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
                  Opção B: Não (Compra à Vista ou Financiada)
                </span>
              </div>
            </div>

            <div className="text-zinc-500">↓</div>

            {/* Step 3 */}
            <div className="w-full p-4 rounded-xl bg-[#0A0A0B] border border-emerald-500 text-center shadow-lg space-y-1">
              <div className="font-bold text-emerald-400 text-sm">3. Transbordo Humano Inteligente (Round Robin)</div>
              <p className="text-zinc-300 text-xs">
                Cria o Card no funil de CRM, calcula o Grid Score (ex: 92 pts) e notifica o vendedor de plantão em menos de 30 segundos.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. DISTRIBUIÇÃO DE LEADS */}
      {/* ========================================================================= */}
      {subTab === 'distribuicao' && (
        <div className="p-5 rounded-2xl bg-[#1C1C1E] border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">Regras de Roleta Comercial (Round Robin)</h3>
            <span className="text-xs text-emerald-400 font-mono font-bold">● Distribuição Ativa</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#0A0A0B] border border-zinc-800 space-y-2">
              <h4 className="font-bold text-white">Roleta Equitativa</h4>
              <p className="text-zinc-400">
                Cada novo lead é distribuído em ordem circular para o próximo vendedor online no horário comercial.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0A0B] border border-zinc-800 space-y-2">
              <h4 className="font-bold text-white">Regra de Carteirização</h4>
              <p className="text-zinc-400">
                Se o contato já tiver um vendedor titular registrado nos últimos 180 dias, o lead vai direto para ele.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0A0B] border border-zinc-800 space-y-2">
              <h4 className="font-bold text-white">SLA de Transbordo (5 Minutos)</h4>
              <p className="text-zinc-400">
                Caso o vendedor não responda em até 5 minutos, o lead é automaticamente transferido para o plantonista.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateAutomationModal
        isOpen={isCreateRuleOpen}
        onClose={() => setIsCreateRuleOpen(false)}
        onSave={handleSaveNewRule}
      />

      <CreateBroadcastModal
        isOpen={isCreateBroadcastOpen}
        onClose={() => setIsCreateBroadcastOpen(false)}
        onSend={handleSendBroadcast}
      />
    </div>
  );
};
