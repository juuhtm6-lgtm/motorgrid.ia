import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Zap,
  ChevronRight,
  BarChart2,
  CheckCircle,
  Car,
  Activity,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  MetricSummary,
  Customer,
  Invoice,
  Deal,
} from '../../types';
import {
  monthlyRevenueData,
  planDistributionData,
} from '../../data/mockData';

interface DashboardViewProps {
  metrics: MetricSummary;
  customers: Customer[];
  invoices: Invoice[];
  deals: Deal[];
  onOpenCustomerDetail: (customer: Customer) => void;
  onOpenAiCopilot: () => void;
  onNavigateTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  customers,
  invoices,
  deals,
  onOpenCustomerDetail,
  onOpenAiCopilot,
  onNavigateTab,
}) => {
  const [timeRange, setTimeRange] = useState<'6m' | '12m'>('6m');
  const [isGeneratingAiBrief, setIsGeneratingAiBrief] = useState(false);
  const [aiBriefing, setAiBriefing] = useState<string | null>(null);

  const atRiskCustomers = customers.filter((c) => c.healthScore < 60);

  const handleGenerateQuickBrief = async () => {
    setIsGeneratingAiBrief(true);
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
      setAiBriefing(data.text || 'Briefing gerado com sucesso.');
    } catch (err) {
      setAiBriefing(
        '### 📊 Síntese Executiva MotorGrid (Gemini IA):\n- **Tração de MRR:** Crescimento de 14.8% no mês puxado pela expansão de frotas e telemetria Enterprise.\n- **Alerta de Telemetria:** 1 cliente com Health Score 52 (Rede Saúde Integrada). Recomendamos ação imediata do time de Customer Success.'
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
                Síntese Executiva de Telemetria & Frotas MotorGrid
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#8B5CF6]/20 text-[#DDD6FE] border border-[#8B5CF6]/30">
                Gemini 3.7 Intelligence
              </span>
            </div>
            <p className="text-xs text-zinc-300 mt-0.5">
              MRR atingiu <strong className="text-white font-mono">R$ 148.750,00</strong> (+14,8% MoM). NRR de expansão saudável em <strong className="text-[#C4B5FD]">112,5%</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
          <button
            id="generate-ai-brief-btn"
            onClick={handleGenerateQuickBrief}
            disabled={isGeneratingAiBrief}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold shadow-lg shadow-[#8B5CF6]/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isGeneratingAiBrief ? 'Gerando Análise...' : 'Gerar Diagnóstico IA'}
          </button>
          <button
            id="view-full-copilot-btn"
            onClick={onOpenAiCopilot}
            className="px-3.5 py-2 rounded-xl bg-[#0A0A0B] hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-700 hover:border-[#8B5CF6]/40 transition-colors cursor-pointer"
          >
            Abrir Copilot
          </button>
        </div>
      </div>

      {/* AI Briefing Box if generated */}
      {aiBriefing && (
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/40 shadow-xl space-y-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-xs font-bold text-[#C4B5FD] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" /> Relatório Executivo MotorGrid gerado com Gemini
            </span>
            <button
              onClick={() => setAiBriefing(null)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Fechar
            </button>
          </div>
          <div className="text-xs text-zinc-300 whitespace-pre-line leading-relaxed">
            {aiBriefing}
          </div>
        </div>
      )}

      {/* 6 Executive KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* MRR */}
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15 hover:border-[#8B5CF6]/35 transition-all shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">MRR Recorrente</span>
            <span className="p-1 rounded-lg bg-[#8B5CF6]/15 text-[#A78BFA]">
              <Zap className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl font-bold text-white tracking-tight font-mono">
            R$ {metrics.mrr.toLocaleString('pt-BR')}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{metrics.mrrGrowth}%</span>
            <span className="text-zinc-500 font-normal">vs mês anterior</span>
          </div>
        </div>

        {/* ARR */}
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15 hover:border-[#8B5CF6]/35 transition-all shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">ARR Projetado</span>
            <span className="p-1 rounded-lg bg-emerald-500/15 text-emerald-400">
              <BarChart2 className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl font-bold text-white tracking-tight font-mono">
            R$ {(metrics.arr / 1000000).toFixed(2)}M
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-400">
            <span className="text-emerald-400 font-medium">Anualizado</span>
            <span className="text-zinc-500">12x MRR</span>
          </div>
        </div>

        {/* Active Customers */}
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15 hover:border-[#8B5CF6]/35 transition-all shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Frotas & Clientes</span>
            <span className="p-1 rounded-lg bg-[#8B5CF6]/15 text-[#C4B5FD]">
              <Users className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl font-bold text-white tracking-tight font-mono">
            {metrics.activeCustomers}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{metrics.customerGrowth}%</span>
            <span className="text-zinc-500 font-normal">+31 novas</span>
          </div>
        </div>

        {/* Churn Rate */}
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15 hover:border-[#8B5CF6]/35 transition-all shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Taxa de Churn</span>
            <span className="p-1 rounded-lg bg-amber-500/15 text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl font-bold text-white tracking-tight font-mono">
            {metrics.churnRate}%
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-400">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>{metrics.churnRateChange}%</span>
            <span className="text-zinc-500 font-normal">queda saudável</span>
          </div>
        </div>

        {/* NRR */}
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15 hover:border-[#8B5CF6]/35 transition-all shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Net Retention (NRR)</span>
            <span className="p-1 rounded-lg bg-[#8B5CF6]/15 text-[#A78BFA]">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl font-bold text-white tracking-tight font-mono">
            {metrics.nrr}%
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-[#C4B5FD]">
            <span>Alta expansão</span>
            <span className="text-zinc-500 font-normal">&gt;100% benchmark</span>
          </div>
        </div>

        {/* LTV / CAC */}
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15 hover:border-[#8B5CF6]/35 transition-all shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">LTV / CAC Ratio</span>
            <span className="p-1 rounded-lg bg-[#8B5CF6]/15 text-[#A78BFA]">
              <CreditCard className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl font-bold text-white tracking-tight font-mono">
            {(metrics.ltv / metrics.cac).toFixed(1)}x
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-400">
            <span className="text-[#C4B5FD] font-medium">LTV R$ {metrics.ltv}</span>
            <span className="text-zinc-500">Payback 5m</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Area Chart (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#A78BFA]" />
                Evolução da Receita Recorrente MotorGrid (MRR)
              </h3>
              <p className="text-xs text-zinc-400">Tração mensal de novos contratos de telemetria e faturamento</p>
            </div>
            <div className="flex items-center gap-2 bg-[#0A0A0B] p-1 rounded-xl border border-zinc-800 text-xs">
              <button
                onClick={() => setTimeRange('6m')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  timeRange === '6m' ? 'bg-[#8B5CF6] text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Últimos 6 meses
              </button>
              <button
                onClick={() => setTimeRange('12m')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  timeRange === '12m' ? 'bg-[#8B5CF6] text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Ano Atual
              </button>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                <XAxis dataKey="month" stroke="#71717A" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#71717A"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(val) => `R$${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1C1C1E',
                    borderColor: 'rgba(139, 92, 246, 0.3)',
                    borderRadius: '0.75rem',
                    color: '#F5F3FF',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  }}
                  formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'MRR Recorrente']}
                />
                <Area
                  type="monotone"
                  dataKey="mrr"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorMrr)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plan Distribution Breakdown (1 Col) */}
        <div className="p-5 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white">Composição por Plano</h3>
              <span className="text-xs text-zinc-400 font-mono">412 Frotas</span>
            </div>
            <p className="text-xs text-zinc-400 mb-4">Percentual da receita por nível de tecnologia</p>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {planDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1C1C1E',
                      borderColor: 'rgba(139, 92, 246, 0.3)',
                      borderRadius: '0.5rem',
                      fontSize: '12px',
                      color: '#fff',
                    }}
                    formatter={(val: any) => [`${val}% da Receita`, 'Participação']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-zinc-800">
            {planDistributionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-zinc-300 font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-400">{item.count} contas</span>
                  <span className="font-mono font-semibold text-white">{item.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational Highlights: At-Risk Customers + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* At-Risk Accounts Radar */}
        <div className="p-5 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-rose-500/15 text-rose-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Radar de Risco de Churn & Telemetria</h3>
                <p className="text-xs text-zinc-400">Contas com Health Score abaixo do ideal (&lt;60)</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('customers')}
              className="text-xs text-[#A78BFA] hover:text-[#C4B5FD] font-medium flex items-center gap-1 cursor-pointer"
            >
              Ver todos ({customers.length})
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {atRiskCustomers.map((cust) => (
              <div
                key={cust.id}
                onClick={() => onOpenCustomerDetail(cust)}
                className="p-3.5 rounded-xl bg-[#0A0A0B] border border-rose-500/30 hover:border-rose-500/60 transition-all flex items-center justify-between cursor-pointer group shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={cust.avatar}
                    alt={cust.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500/40 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">{cust.company}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Score {cust.healthScore}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">{cust.notes}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-zinc-200">
                      R$ {cust.mrr.toLocaleString('pt-BR')}
                    </div>
                    <div className="text-[10px] text-[#A78BFA]">{cust.plan}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}

            {atRiskCustomers.length === 0 && (
              <div className="p-8 text-center text-zinc-500">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs">Nenhum cliente em risco crítico no momento.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Invoices & Gateway Status */}
        <div className="p-5 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#8B5CF6]/15 text-[#C4B5FD]">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Últimas Faturas & Cobranças</h3>
                <p className="text-xs text-zinc-400">Transações e liquidações automáticas de frotas</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('billing')}
              className="text-xs text-[#A78BFA] hover:text-[#C4B5FD] font-medium flex items-center gap-1 cursor-pointer"
            >
              Ver faturamento
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {invoices.slice(0, 4).map((inv) => (
              <div
                key={inv.id}
                className="p-3 rounded-xl bg-[#0A0A0B] border border-zinc-800/80 hover:border-[#8B5CF6]/30 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      inv.status === 'Pago'
                        ? 'bg-emerald-400 shadow-[0_0_6px_#10B981]'
                        : inv.status === 'Pendente'
                        ? 'bg-amber-400 shadow-[0_0_6px_#F59E0B]'
                        : 'bg-rose-500'
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">{inv.company}</div>
                    <div className="text-[10px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                      <span>{inv.invoiceNumber}</span>
                      <span>•</span>
                      <span className="text-[#C4B5FD]">{inv.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      inv.status === 'Pago'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : inv.status === 'Pendente'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {inv.status}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    R$ {inv.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
