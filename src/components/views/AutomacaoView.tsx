import React, { useState } from 'react';
import {
  Cloud,
  Plus,
  Play,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Radio,
  SlidersHorizontal,
  Bell,
  MessageSquare,
  Mail,
  Webhook,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Clock,
  Trash2,
} from 'lucide-react';
import { AutomacaoRule } from '../../types';

const initialRules: AutomacaoRule[] = [
  {
    id: 'aut-1',
    name: 'Alerta de Ignição Fora de Horário (Anti-Furto)',
    trigger: 'Ignição ligada entre 22:00 e 05:00 sem agendamento prévio',
    action: 'Disparo de WhatsApp para gestor de frota e bloqueio preventivo via app',
    channel: 'WhatsApp',
    enabled: true,
    executionsCount: 38,
    lastExecuted: 'Hoje às 03:14',
    category: 'Segurança',
  },
  {
    id: 'aut-2',
    name: 'Rompimento de Cerca Virtual (Geofence)',
    trigger: 'Veículo cruzar limite perimetral de raio 50km da sede',
    action: 'Notificação Push + Alerta no painel de comando + Registro de telemetria',
    channel: 'Push / Notificação',
    enabled: true,
    executionsCount: 142,
    lastExecuted: 'Hoje às 08:21',
    category: 'Telemetria',
  },
  {
    id: 'aut-3',
    name: 'Excesso de Velocidade CAN-Bus (> 110 km/h)',
    trigger: 'Velocidade superior a 110 km/h por mais de 30 segundos contínuos',
    action: 'Alerta sonoro na cabine do motorista e notificação no canal do gestor',
    channel: 'WhatsApp',
    enabled: true,
    executionsCount: 219,
    lastExecuted: 'Há 18 minutos',
    category: 'Telemetria',
  },
  {
    id: 'aut-4',
    name: 'Cobrança Automática via PIX no Vencimento',
    trigger: 'Fatura de assinatura atingir dia do vencimento às 07:00',
    action: 'Envio de Copia e Cola PIX + QR Code dinâmico no WhatsApp do frotista',
    channel: 'WhatsApp',
    enabled: true,
    executionsCount: 650,
    lastExecuted: 'Ontem às 07:00',
    category: 'Financeiro',
  },
  {
    id: 'aut-5',
    name: 'Follow-up Automático de Lead sem Resposta',
    trigger: 'Lead novo sem interação há 48 horas no pipeline',
    action: 'Disparo de mensagem consultiva com comparativo de economia de combustível',
    channel: 'Email',
    enabled: true,
    executionsCount: 89,
    lastExecuted: 'Ontem às 14:30',
    category: 'Comercial',
  },
  {
    id: 'aut-6',
    name: 'Sincronização de Telemetria com ERP / TMS Externo',
    trigger: 'Evento de chegada em cliente ou finalização de viagem',
    action: 'Webhook POST HTTP com payload JSON assinado HMAC-SHA256',
    channel: 'Webhook',
    enabled: true,
    executionsCount: 12400,
    lastExecuted: 'Há 2 minutos',
    category: 'Telemetria',
  },
];

export const AutomacaoView: React.FC = () => {
  const [rules, setRules] = useState<AutomacaoRule[]>(initialRules);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newTrigger, setNewTrigger] = useState('');
  const [newAction, setNewAction] = useState('');
  const [newChannel, setNewChannel] = useState<'WhatsApp' | 'Email' | 'Webhook' | 'SMS' | 'Push / Notificação'>('WhatsApp');
  const [newCategory, setNewCategory] = useState<'Telemetria' | 'Comercial' | 'Financeiro' | 'Segurança'>('Telemetria');

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName) return;

    const created: AutomacaoRule = {
      id: `aut-${Date.now()}`,
      name: newRuleName,
      trigger: newTrigger || 'Gatilho customizado por sensor',
      action: newAction || 'Ação imediata configurada',
      channel: newChannel,
      category: newCategory,
      enabled: true,
      executionsCount: 0,
      lastExecuted: 'Aguardando primeiro disparo',
    };

    setRules((prev) => [created, ...prev]);
    setIsModalOpen(false);
    setNewRuleName('');
    setNewTrigger('');
    setNewAction('');
  };

  return (
    <div className="space-y-6">
      {/* Header Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-400">Regras de Automação</div>
            <div className="text-2xl font-bold text-white mt-1">{rules.length} ativas</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">100% monitoramento 24/7</div>
          </div>
          <div className="p-3 rounded-xl bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[#8B5CF6]/30">
            <Cloud className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-400">Disparos Hoje</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">1.842 ações</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Tempo médio de execução: 12ms</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-400">Alertas de Segurança</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">0 incidentes graves</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Geofence & Anti-furto ativos</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-400">Canal WhatsApp</div>
            <div className="text-2xl font-bold text-white mt-1">99.98% Entrega</div>
            <div className="text-[11px] text-[#A78BFA] mt-0.5">API Oficial Meta Cloud</div>
          </div>
          <div className="p-3 rounded-xl bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[#8B5CF6]/30">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#A78BFA]" />
            <span>Fluxos & Gatilhos Inteligentes</span>
          </h3>
          <p className="text-xs text-zinc-400">Automatize respostas para telemetria, cobranças e funil de vendas</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#C4B5FD] hover:bg-[#DDD6FE] text-[#2E1065] font-bold text-xs shadow-md shadow-[#8B5CF6]/20 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Nova Automação</span>
        </button>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((rule) => {
          return (
            <div
              key={rule.id}
              className="p-5 rounded-2xl bg-[#141416] border border-zinc-800/80 hover:border-[#8B5CF6]/40 transition-all shadow-xl space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase ${
                        rule.category === 'Segurança'
                          ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          : rule.category === 'Telemetria'
                          ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                          : rule.category === 'Financeiro'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      {rule.category}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {rule.executionsCount} disparos
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-1.5">{rule.name}</h4>
                </div>

                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`p-1 rounded-lg transition-colors cursor-pointer ${
                    rule.enabled ? 'text-emerald-400' : 'text-zinc-600'
                  }`}
                  title={rule.enabled ? 'Desativar automação' : 'Ativar automação'}
                >
                  {rule.enabled ? (
                    <ToggleRight className="w-8 h-8" />
                  ) : (
                    <ToggleLeft className="w-8 h-8" />
                  )}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[#1C1C1E] border border-zinc-800 space-y-2 text-xs">
                <div>
                  <span className="text-zinc-500 font-semibold uppercase text-[10px] block">
                    SE (Gatilho):
                  </span>
                  <p className="text-zinc-300 mt-0.5">{rule.trigger}</p>
                </div>

                <div className="pt-2 border-t border-zinc-800/80">
                  <span className="text-zinc-500 font-semibold uppercase text-[10px] block">
                    ENTÃO (Ação):
                  </span>
                  <p className="text-[#C4B5FD] font-medium mt-0.5">{rule.action}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#A78BFA]" />
                  <span>Último: {rule.lastExecuted}</span>
                </span>

                <span className="px-2 py-0.5 rounded-lg bg-[#0A0A0B] text-zinc-300 font-mono border border-zinc-700/60 text-[11px]">
                  Canal: {rule.channel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add Rule */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#141416] border border-[#8B5CF6]/30 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Criar Nova Automação / Gatilho</h3>
            <form onSubmit={handleAddRule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Nome da Regra</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Alerta de Temperatura Alta no Motor"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Categoria</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white outline-none"
                  >
                    <option value="Telemetria">Telemetria</option>
                    <option value="Segurança">Segurança</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Financeiro">Financeiro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Canal de Disparo</label>
                  <select
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white outline-none"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Push / Notificação">Push / Notificação</option>
                    <option value="Email">Email</option>
                    <option value="Webhook">Webhook</option>
                    <option value="SMS">SMS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Condição de Gatilho (SE)</label>
                <input
                  type="text"
                  placeholder="Ex: Temperatura de óleo > 105°C por 2 minutos"
                  value={newTrigger}
                  onChange={(e) => setNewTrigger(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Ação a Executar (ENTÃO)</label>
                <input
                  type="text"
                  placeholder="Ex: Enviar WhatsApp para plantão mecânico com localização GPS"
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-[#2E1065] bg-[#C4B5FD] hover:bg-[#DDD6FE] rounded-xl"
                >
                  Salvar Automação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
