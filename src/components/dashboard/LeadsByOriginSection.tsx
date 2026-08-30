import React from 'react';
import { Share2, ArrowRight } from 'lucide-react';
import { OriginMetric } from '../../types/dashboard';

interface LeadsByOriginSectionProps {
  origins: OriginMetric[];
  onDrillDownOrigin: (origin: string) => void;
}

export const LeadsByOriginSection: React.FC<LeadsByOriginSectionProps> = ({
  origins,
  onDrillDownOrigin,
}) => {
  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    });
  };

  const totalLeads = origins.reduce((acc, o) => acc + o.leads, 0);

  return (
    <div className="bg-[#1C1C1E] border border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6]">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Leads e Vendas por Origem</h3>
            <p className="text-xs text-neutral-400">
              Desempenho comparativo por canal de captação e mídia
            </p>
          </div>
        </div>
        <span className="text-xs text-neutral-400">
          Total: <strong className="text-white">{totalLeads}</strong> leads no período
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-800 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              <th className="pb-3 pl-2">Canal / Origem</th>
              <th className="pb-3 text-right">Leads</th>
              <th className="pb-3 text-right">% do Mix</th>
              <th className="pb-3 text-right">Vendas</th>
              <th className="pb-3 text-right">Conversão</th>
              <th className="pb-3 text-right">Receita (R$)</th>
              <th className="pb-3 text-right pr-2">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-850 text-neutral-300">
            {origins.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-neutral-500">
                  Nenhum dado de origem no período selecionado
                </td>
              </tr>
            ) : (
              origins.map((item) => {
                const mixPercent = totalLeads > 0 ? (item.leads / totalLeads) * 100 : 0;
                return (
                  <tr
                    key={item.origin}
                    onClick={() => onDrillDownOrigin(item.origin)}
                    className="hover:bg-neutral-900/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 pl-2 font-medium text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                      <span>{item.origin}</span>
                    </td>
                    <td className="py-3 text-right font-bold text-white">{item.leads}</td>
                    <td className="py-3 text-right text-neutral-400">
                      <div className="inline-flex items-center gap-2">
                        <span>{mixPercent.toFixed(1)}%</span>
                        <div className="w-12 bg-neutral-800 rounded-full h-1.5 hidden sm:block">
                          <div
                            className="bg-[#8B5CF6] h-1.5 rounded-full"
                            style={{ width: `${mixPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-right font-bold text-emerald-400">{item.sales}</td>
                    <td className="py-3 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          item.conversionRate >= 20
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : item.conversionRate > 0
                            ? 'bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {item.conversionRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 text-right font-semibold text-white">
                      {formatCurrency(item.revenue)}
                    </td>
                    <td className="py-3 text-right pr-2">
                      <span className="text-neutral-500 group-hover:text-[#8B5CF6] transition-colors inline-flex items-center gap-0.5">
                        Ver <ArrowRight className="w-3 h-3" />
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
