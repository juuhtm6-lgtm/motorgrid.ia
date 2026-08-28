import React, { useState } from 'react';
import {
  TrendingUp,
  MessageSquare,
  Users,
  Car,
  Calendar,
  Clock,
  Zap,
  Sparkles,
  Flame,
  CheckCircle2,
  Phone,
  ShieldCheck,
  ChevronRight,
  Plus,
  ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { initialVehicles, initialOmniConversations, initialAppointments } from '../../data/mockData';

interface DashboardViewProps {
  metrics: any;
  customers: any[];
  invoices: any[];
  deals: any[];
  onOpenCustomerDetail: (customer: any) => void;
  onOpenAiCopilot: () => void;
  onNavigateTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
}) => {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [isGeneratingAiBrief, setIsGeneratingAiBrief] = useState(false);
  const [aiBriefing, setAiBriefing] = useState<string | null>(null);

  const salesTrend = [
    { month: 'Out', sales: 12, revenue: 4200000 },
    { month: 'Nov', sales: 15, revenue: 5300000 },
    { month: 'Dez', sales: 21, revenue: 7800000 },
    { month: 'Jan', sales: 16, revenue: 5900000 },
    { month: 'Fev', sales: 18, revenue: 6660000 },
  ];

  const handleGenerateBrief = async () => {
    setIsGeneratingAiBrief(true);
    try {
      const res = await fetch('/api/gemini/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'Briefing Matinal Showroom MotorGrid',
          stockCount: initialVehicles.length,
          leadsCount: 184,
          appointmentsToday: appointments.length,
        }),
      });
      const data = await res.json();
      setAiBriefing(data.text || 'Briefing gerado com sucesso.');
    } catch {
      setAiBriefing(
        '### ⚡ Diagnóstico Comercial MotorGrid (Grid AI):\n- **Aquecimento de Showroom:** 3 Test Drives confirmados para hoje (BMW M3 Competition e Porsche Macan GTS têm alta probabilidade de fechamento).\n- **SLA Operacional:** Tempo médio de resposta mantido em 1.8 min no WhatsApp. Nenhuma conversa atrasada acima de 5 min.'
      );
    } finally {
      setIsGeneratingAiBrief(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner with AI Briefing Trigger */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#1C1C1E] via-[#2A1B4E] to-[#1C1C1E] border border-[#8B5CF6]/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#C4B5FD] shrink-0">
            <Sparkles className="w-6 h-6 text-[#A78BFA] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                Painel Geral &amp; Comando de Showroom MotorGrid
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#8B5CF6]/20 text-[#DDD6FE] border border-[#8B5CF6]/30">
                Grid AI Online
              </span>
            </div>
            <p className="text-xs text-zinc-300 mt-0.5">
              18 veículos vendidos no mês (<strong className="text-emerald-400 font-mono">R$ 6.660.000</strong>). SLA médio de 1º contato:{' '}
              <strong className="text-[#C4B5FD]">1.8 minutos</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
          <button
            onClick={handleGenerateBrief}
            disabled={isGeneratingAiBrief}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#C4B5FD] hover:bg-[#DDD6FE] text-[#2E1065] text-xs font-bold shadow-lg shadow-[#8B5CF6]/30 transition-all cursor-pointer font-['Plus_Jakarta_Sans',sans-serif] disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isGeneratingAiBrief ? 'Gerando Análise...' : 'Gerar Briefing Matinal'}
          </button>
          <button
            onClick={() => onNavigateTab('atendimento')}
            className="px-3.5 py-2 rounded-xl bg-[#0A0A0B] hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-700 hover:border-[#8B5CF6]/40 transition-colors cursor-pointer"
          >
            Abrir WhatsApp
          </button>
        </div>
      </div>

      {/* AI Briefing Box */}
      {aiBriefing && (
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/40 shadow-xl space-y-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-xs font-bold text-[#C4B5FD] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" /> Diagnóstico Gerado com Grid AI
            </span>
            <button onClick={() => setAiBriefing(null)} className="text-xs text-zinc-400 hover:text-white cursor-pointer">
              Fechar
            </button>
          </div>
          <div className="text-xs text-zinc-300 whitespace-pre-line leading-relaxed">{aiBriefing}</div>
        </div>
      )}

      {/* 6 Executive Automotive KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15 hover:border-[#8B5CF6]/35 transition-all shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Vendas do Mês</span>
            <span className="p-1 rounded-lg bg-emerald-500/15 text-emerald-400">
              <Car className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl font-bold text-white tracking-tight font-mono">18 unidades</div>
          <div className="text-xs font-medium text-emerald-400 mt-2">R$ 6.660.000</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15 hover:border-[#8B5CF6]/35 transition-all shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Ticket Médio</span>
            <span className="p-1 rounded-lg bg-[#8B5CF6]/15 text-[#A78BFA]">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl font-bold text-white tracking-tight font-mono">R$ 370.000</div>
          <div className="text-xs text-emerald-400 mt-2">+14.2% vs mês anterior</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15 hover:border-[#8B5CF6]/35 transition-all shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Leads no Funil</span>
            <span className="p-1 rounded-lg bg-[#8B5CF6]/15 text-[#C4B5FD]">
              <Users className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl font-bold text-white tracking-tight font-mono">184 leads</div>
          <div className="text-xs text-[#C4B5FD] mt-2">39 em negociação</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15 hover:border-[#8B5CF6]/35 transition-all shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">SLA 1ª Resposta</span>
            <span className="p-1 rounded-lg bg-emerald-500/15 text-emerald-400">
              <Clock className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl font-bold text-emerald-400 tracking-tight font-mono">1.8 min</div>
          <div className="text-xs text-zinc-400 mt-2">● Meta &lt; 3.0 min</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15 hover:border-[#8B5CF6]/35 transition-all shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Estoque Ativo</span>
            <span className="p-1 rounded-lg bg-[#8B5CF6]/15 text-[#A78BFA]">
              <Car className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl font-bold text-white tracking-tight font-mono">
            {initialVehicles.length} veículos
          </div>
          <div className="text-xs text-zinc-400 mt-2">R$ 5.925.000 em pátio</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15 hover:border-[#8B5CF6]/35 transition-all shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Taxa de Conversão</span>
            <span className="p-1 rounded-lg bg-[#8B5CF6]/15 text-[#C4B5FD]">
              <Zap className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl font-bold text-[#DDD6FE] tracking-tight font-mono">9.8%</div>
          <div className="text-xs text-emerald-400 mt-2">+2.1% no trimestre</div>
        </div>
      </div>

      {/* Main Charts & Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Trend Chart (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Evolução de Vendas &amp; Faturamento (R$)</h3>
              <p className="text-xs text-zinc-400">Total de veículos entregues e receita gerada por mês</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#8B5CF6]/20 text-[#DDD6FE] text-xs font-bold font-mono">
              Fev 2026: R$ 6.6M
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                <XAxis dataKey="month" stroke="#71717A" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#71717A"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(val) => `R$${val / 1000000}M`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1C1C1E',
                    borderColor: '#8B5CF6',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`R$ ${Number(val).toLocaleString('pt-BR')}`, 'Faturamento']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={3} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Visitas & Agendamentos do Dia (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15 shadow-md flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#A78BFA]" />
                <span>Test Drives &amp; Visitas de Hoje</span>
              </h3>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                {appointments.length} confirmados
              </span>
            </div>

            <div className="space-y-2.5">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3 rounded-xl bg-[#0A0A0B] border border-zinc-800 hover:border-[#8B5CF6]/40 transition-colors flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{apt.contactName}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-500/20 text-[#DDD6FE]">
                        {apt.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#A78BFA] font-medium mt-0.5">
                      {apt.vehicleModel || 'Interesse Geral'}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">Com: {apt.assignedTo}</div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-400 block">{apt.time}</span>
                    <span className="text-[10px] text-zinc-400">{apt.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('pipeline')}
            className="w-full py-2 rounded-xl bg-[#0A0A0B] hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Ver Quadro Kanban de Agendamentos</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Atendimentos Recentes no WhatsApp & Ações Rápidas */}
      <div className="p-5 rounded-2xl bg-[#1C1C1E] border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Últimos Atendimentos Recebidos (WhatsApp &amp; Portais)</span>
            </h3>
            <p className="text-xs text-zinc-400">Tempo real de mensagens e classificação de interesse</p>
          </div>

          <button
            onClick={() => onNavigateTab('atendimento')}
            className="text-xs text-[#C4B5FD] hover:text-white font-bold flex items-center gap-1 cursor-pointer"
          >
            Ver Inbox Completo
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {initialOmniConversations.slice(0, 3).map((conv) => (
            <div
              key={conv.id}
              onClick={() => onNavigateTab('atendimento')}
              className="p-4 rounded-xl bg-[#0A0A0B] border border-zinc-800 hover:border-[#8B5CF6]/50 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={conv.contactAvatar}
                    alt={conv.contactName}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-[#8B5CF6]/40"
                  />
                  <span className="font-bold text-white text-xs group-hover:text-[#C4B5FD] transition-colors truncate">
                    {conv.contactName}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">{conv.lastMessageTime}</span>
              </div>

              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{conv.lastMessage}</p>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[10px]">
                <span className="text-[#A78BFA] font-medium truncate">
                  {conv.tracking.vehicleOfInterest
                    ? `${conv.tracking.vehicleOfInterest.brand} ${conv.tracking.vehicleOfInterest.model}`
                    : 'Interesse Geral'}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-[#DDD6FE] font-mono">
                  {conv.channel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
