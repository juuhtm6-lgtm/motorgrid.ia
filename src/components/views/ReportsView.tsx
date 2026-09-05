import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Users,
  CreditCard,
  ShieldCheck,
  Zap,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Car,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { MetricSummary } from '../../types';
import { useToast } from '../../context/ToastContext';

interface ReportsViewProps {
  metrics: MetricSummary;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ metrics }) => {
  const toast = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('2026-Q2');

  const waterfallData = [
    { month: 'Jan', Novo: 16800, Expansao: 8200, Churn: -1900, Liquido: 23100 },
    { month: 'Fev', Novo: 15400, Expansao: 9100, Churn: -2100, Liquido: 22400 },
    { month: 'Mar', Novo: 18200, Expansao: 10400, Churn: -1800, Liquido: 26800 },
    { month: 'Abr', Novo: 19600, Expansao: 11200, Churn: -2400, Liquido: 28400 },
    { month: 'Mai', Novo: 22100, Expansao: 12800, Churn: -1650, Liquido: 33250 },
  ];

  const cohortsData = [
    { cohort: 'Jan 2026', total: 42, m0: '100%', m1: '95%', m2: '92%', m3: '90%', m4: '88%' },
    { cohort: 'Fev 2026', total: 38, m0: '100%', m1: '97%', m2: '94%', m3: '91%', m4: '-' },
    { cohort: 'Mar 2026', total: 48, m0: '100%', m1: '96%', m2: '93%', m3: '-', m4: '-' },
    { cohort: 'Abr 2026', total: 54, m0: '100%', m1: '98%', m2: '-', m3: '-', m4: '-' },
    { cohort: 'Mai 2026', total: 62, m0: '100%', m1: '-', m2: '-', m3: '-', m4: '-' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="p-5 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#A78BFA]" />
            Relatórios Financeiros & Análise de Coortes MotorGrid
          </h2>
          <p className="text-xs text-zinc-400">
            Métricas de expansão de telemetria líquida (Net Revenue), retenção histórica de frotas e Payback.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-[#0A0A0B] border border-zinc-700 text-zinc-300 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#8B5CF6]"
          >
            <option value="2026-Q2">2º Trimestre 2026</option>
            <option value="2026-Q1">1º Trimestre 2026</option>
            <option value="2025-Q4">4º Trimestre 2025</option>
          </select>

          <button
            onClick={() => {
              const headers = "Mes,Novo,Expansao,Churn,Liquido\n";
              const rows = waterfallData.map(d => `${d.month},${d.Novo},${d.Expansao},${d.Churn},${d.Liquido}`).join("\n");
              const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `relatorio_financeiro_${selectedPeriod.toLowerCase()}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              toast.success(`Relatório (${selectedPeriod}) exportado com sucesso!`);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold shadow-lg shadow-[#8B5CF6]/25 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exportar XLSX</span>
          </button>
        </div>
      </div>

      {/* MRR Waterfall Chart */}
      <div className="p-6 rounded-3xl bg-[#1C1C1E] border border-[#8B5CF6]/15 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">MRR Waterfall (Novas Frotas + Expansão vs Desconexão)</h3>
            <p className="text-xs text-zinc-400">Composição líquida do crescimento da receita de telemetria</p>
          </div>
          <span className="text-xs font-bold text-emerald-400 font-mono">+R$ 33.250 Líquido em Maio</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={waterfallData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  fontSize: '12px',
                  color: '#fff',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                }}
                formatter={(val: any) => [`R$ ${Number(val).toLocaleString('pt-BR')}`, '']}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', color: '#A1A1AA' }}
              />
              <Bar dataKey="Novo" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Novas Frotas (MRR)" />
              <Bar dataKey="Expansao" fill="#10B981" radius={[4, 4, 0, 0]} name="Expansão / Dispositivos Adicionais" />
              <Bar dataKey="Churn" fill="#F43F5E" radius={[4, 4, 0, 0]} name="Cancelamentos (Churn)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Retention Cohorts Matrix */}
      <div className="p-6 rounded-3xl bg-[#1C1C1E] border border-[#8B5CF6]/15 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Tabela de Coortes de Retenção de Frotas MotorGrid</h3>
            <p className="text-xs text-zinc-400">Percentual de contas retidas após M0, M1, M2, M3 e M4</p>
          </div>
          <span className="text-xs text-[#C4B5FD] font-semibold font-mono">Média M1: 96.5% de retenção</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0A0A0B]/80 border-b border-zinc-800 text-zinc-400 font-semibold uppercase">
              <tr>
                <th className="px-4 py-3">Safra / Cohort</th>
                <th className="px-4 py-3">Novas Frotas</th>
                <th className="px-4 py-3">Mês 0</th>
                <th className="px-4 py-3">Mês 1</th>
                <th className="px-4 py-3">Mês 2</th>
                <th className="px-4 py-3">Mês 3</th>
                <th className="px-4 py-3">Mês 4</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {cohortsData.map((c, idx) => (
                <tr key={idx} className="hover:bg-[#8B5CF6]/5 transition-colors">
                  <td className="px-4 py-3 font-sans font-bold text-white">{c.cohort}</td>
                  <td className="px-4 py-3 text-zinc-300 font-bold">{c.total} contas</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                      {c.m0}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded font-semibold ${
                        c.m1 === '-' ? 'text-zinc-600' : 'bg-emerald-500/10 text-emerald-400'
                      }`}
                    >
                      {c.m1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded font-semibold ${
                        c.m2 === '-' ? 'text-zinc-600' : 'bg-emerald-500/10 text-emerald-400'
                      }`}
                    >
                      {c.m2}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded font-semibold ${
                        c.m3 === '-' ? 'text-zinc-600' : 'bg-[#8B5CF6]/20 text-[#DDD6FE]'
                      }`}
                    >
                      {c.m3}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded font-semibold ${
                        c.m4 === '-' ? 'text-zinc-600' : 'bg-[#8B5CF6]/20 text-[#DDD6FE]'
                      }`}
                    >
                      {c.m4}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
