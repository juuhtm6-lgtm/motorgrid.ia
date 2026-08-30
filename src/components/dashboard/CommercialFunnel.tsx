import React from 'react';
import { Filter, ArrowDown, ChevronRight } from 'lucide-react';
import { FunnelStageMetric } from '../../types/dashboard';

interface CommercialFunnelProps {
  stages: FunnelStageMetric[];
  overallLeadToSaleConversion: number;
  onDrillDown: (stageKey: string) => void;
}

export const CommercialFunnel: React.FC<CommercialFunnelProps> = ({
  stages,
  overallLeadToSaleConversion,
  onDrillDown,
}) => {
  const maxCount = stages.length > 0 ? Math.max(...stages.map((s) => s.count), 1) : 1;

  return (
    <div className="bg-[#1C1C1E] border border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6]">
              <Filter className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white">Funil Comercial Completo</h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Conversão etapa a etapa e taxa de eficiência da operação
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
              Conversão Global (Lead → Venda)
            </span>
            <span className="text-xl font-bold text-emerald-400">
              {overallLeadToSaleConversion.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Grid horizontal das 7 etapas do funil */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
        {stages.map((stage, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === stages.length - 1;
          const barHeightPercent = Math.max(18, (stage.count / maxCount) * 100);

          return (
            <div
              key={stage.key}
              id={`funnel-stage-${stage.key}`}
              onClick={() => onDrillDown(stage.key)}
              className={`group relative flex flex-col justify-between bg-neutral-900/90 hover:bg-[#26262b] border ${
                isLast
                  ? 'border-emerald-500/40 bg-emerald-950/10'
                  : 'border-neutral-800 hover:border-[#8B5CF6]/50'
              } rounded-xl p-3.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02]`}
            >
              {/* Cabeçalho da Etapa */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-neutral-300 group-hover:text-white truncate">
                    {stage.label}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-[#8B5CF6] transition-colors" />
                </div>

                <div className="mt-2 flex items-baseline justify-between">
                  <span
                    className={`text-2xl font-extrabold tracking-tight ${
                      isLast ? 'text-emerald-400' : 'text-white'
                    }`}
                  >
                    {stage.count}
                  </span>
                  <span className="text-[10px] font-medium text-neutral-400">
                    {stage.overallConversionRate.toFixed(0)}% do total
                  </span>
                </div>
              </div>

              {/* Barra Gráfica de Nível */}
              <div className="my-3 w-full bg-neutral-800/80 rounded-md h-2 overflow-hidden">
                <div
                  className={`h-full rounded-md transition-all ${
                    isLast ? 'bg-emerald-500' : 'bg-[#8B5CF6]'
                  }`}
                  style={{ width: `${barHeightPercent}%` }}
                />
              </div>

              {/* Métricas de Conversão e Queda */}
              <div className="pt-2 border-t border-neutral-800/60 space-y-1 text-[10px]">
                <div className="flex items-center justify-between text-neutral-400">
                  <span>vs Anterior:</span>
                  <span className="text-neutral-200 font-semibold">
                    {isFirst ? '100%' : `${stage.prevConversionRate.toFixed(1)}%`}
                  </span>
                </div>

                {!isFirst && stage.dropCount > 0 && (
                  <div className="flex items-center justify-between text-rose-400/90 font-medium">
                    <span className="flex items-center gap-0.5">
                      <ArrowDown className="w-2.5 h-2.5" /> Queda:
                    </span>
                    <span>-{stage.dropCount} contatos</span>
                  </div>
                )}

                <div className="pt-1 text-right">
                  <span className="text-[9px] text-neutral-500 group-hover:text-[#8B5CF6] transition-colors font-medium">
                    Ver {stage.count} leads →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
