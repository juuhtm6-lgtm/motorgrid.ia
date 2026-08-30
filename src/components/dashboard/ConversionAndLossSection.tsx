import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieIcon, XCircle, Percent, ArrowRight } from 'lucide-react';
import { LossReasonMetric, SellerPerformanceMetric } from '../../types/dashboard';

interface ConversionAndLossSectionProps {
  wonCount: number;
  lostCount: number;
  openCount: number;
  lossReasons: LossReasonMetric[];
  sellers: SellerPerformanceMetric[];
  onDrillDownLossReason: (reason: string) => void;
}

export const ConversionAndLossSection: React.FC<ConversionAndLossSectionProps> = ({
  wonCount,
  lostCount,
  openCount,
  lossReasons,
  sellers,
  onDrillDownLossReason,
}) => {
  const total = wonCount + lostCount + openCount;

  const pieData = [
    { name: 'Vendas (Ganhos)', value: wonCount, color: '#10B981' },
    { name: 'Em Aberto', value: openCount, color: '#8B5CF6' },
    { name: 'Perdidos', value: lostCount, color: '#F43F5E' },
  ].filter((d) => d.value > 0);

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const pct = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-[#1C1C1E] border border-neutral-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
          <p className="font-semibold text-white">{data.name}</p>
          <p className="text-neutral-400">
            {data.value} contatos ({pct}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 1. GANHOS VS PERDIDOS VS EM ABERTO */}
      <div className="bg-[#1C1C1E] border border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
          <div className="p-1.5 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6]">
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Ganhos vs Perdidos vs Em Aberto</h3>
            <p className="text-xs text-neutral-400">Status geral da carteira</p>
          </div>
        </div>

        <div className="h-44 w-full relative flex items-center justify-center">
          {total === 0 ? (
            <div className="text-xs text-neutral-500">Sem dados no período</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomPieTooltip />} />
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#1C1C1E" strokeWidth={2} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="space-y-2 pt-2 border-t border-neutral-800/80 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-neutral-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Vendas Fechadas (Ganhos)
            </span>
            <span className="font-bold text-white">
              {wonCount} ({total > 0 ? ((wonCount / total) * 100).toFixed(0) : 0}%)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-neutral-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
              Em Negociação (Aberto)
            </span>
            <span className="font-bold text-white">
              {openCount} ({total > 0 ? ((openCount / total) * 100).toFixed(0) : 0}%)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-neutral-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Leads Perdidos
            </span>
            <span className="font-bold text-rose-400">
              {lostCount} ({total > 0 ? ((lostCount / total) * 100).toFixed(0) : 0}%)
            </span>
          </div>
        </div>
      </div>

      {/* 2. TAXA DE CONVERSÃO POR VENDEDOR */}
      <div className="bg-[#1C1C1E] border border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Percent className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Conversão por Vendedor</h3>
            <p className="text-xs text-neutral-400">Aproveitamento de leads recebidos</p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          {sellers.slice(0, 5).map((s) => (
            <div key={s.sellerName} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-200 font-medium truncate">{s.sellerName}</span>
                <span className="text-emerald-400 font-bold">{s.conversionRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, s.conversionRate * 2.5)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-neutral-500">
                <span>{s.leads} leads recebidos</span>
                <span>{s.sales} vendas realizadas</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. MOTIVOS DE PERDA */}
      <div className="bg-[#1C1C1E] border border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <XCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Motivos de Perda</h3>
              <p className="text-xs text-neutral-400">Diagnóstico de oportunidades perdidas</p>
            </div>
          </div>
          <span className="text-xs text-neutral-400">{lostCount} perdidos</span>
        </div>

        <div className="space-y-2.5 pt-1">
          {lossReasons.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500">
              Nenhuma perda registrada no período
            </div>
          ) : (
            lossReasons.map((reason) => (
              <div
                key={reason.reason}
                onClick={() => onDrillDownLossReason(reason.reason)}
                className="group p-2 rounded-lg bg-neutral-900/80 hover:bg-neutral-850 border border-neutral-800 hover:border-rose-500/30 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-200 font-medium group-hover:text-white truncate">
                    {reason.reason}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-rose-400 font-bold">{reason.count} un</span>
                    <span className="text-[10px] text-neutral-400">({reason.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
                  <div
                    className="bg-rose-500 h-1.5 rounded-full"
                    style={{ width: `${reason.percentage}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
