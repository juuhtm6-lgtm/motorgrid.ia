import React from 'react';
import { Car, AlertTriangle, ArrowRight, DollarSign } from 'lucide-react';
import { VehiclePerformanceMetric } from '../../types/dashboard';

interface VehiclePerformanceSectionProps {
  topVehicles: VehiclePerformanceMetric[];
  attentionVehicles: VehiclePerformanceMetric[];
  onSelectVehicle: (vehicleName: string) => void;
}

export const VehiclePerformanceSection: React.FC<VehiclePerformanceSectionProps> = ({
  topVehicles,
  attentionVehicles,
  onSelectVehicle,
}) => {
  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 1. VEÍCULOS COM MAIS OPORTUNIDADES (2 Colunas) */}
      <div className="lg:col-span-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6]">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Veículos com Mais Oportunidades</h3>
              <p className="text-xs text-neutral-400">Modelos com maior atratividade e demanda</p>
            </div>
          </div>
          <span className="text-xs text-neutral-400">Top Estoque</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                <th className="pb-3 pl-2">Veículo</th>
                <th className="pb-3 text-right">Preço</th>
                <th className="pb-3 text-right">Leads</th>
                <th className="pb-3 text-right">Agendados</th>
                <th className="pb-3 text-right">Vendas</th>
                <th className="pb-3 text-right">Conversão</th>
                <th className="pb-3 text-right pr-2">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-850 text-neutral-300">
              {topVehicles.slice(0, 6).map((veh) => (
                <tr
                  key={veh.vehicleId}
                  onClick={() => onSelectVehicle(veh.vehicleName)}
                  className="hover:bg-neutral-900/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3 pl-2 font-medium text-white">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={veh.photo}
                        alt={veh.vehicleName}
                        className="w-10 h-8 rounded-md object-cover border border-neutral-700"
                      />
                      <div>
                        <span className="font-semibold text-white group-hover:text-[#8B5CF6] transition-colors block truncate max-w-[200px]">
                          {veh.vehicleName}
                        </span>
                        <span className="text-[10px] text-neutral-500">{veh.brand}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-right text-neutral-300 font-medium">
                    {formatCurrency(veh.price)}
                  </td>
                  <td className="py-3 text-right font-bold text-white">{veh.leads}</td>
                  <td className="py-3 text-right text-neutral-300">{veh.appointments}</td>
                  <td className="py-3 text-right font-bold text-emerald-400">{veh.sales}</td>
                  <td className="py-3 text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        veh.conversionRate >= 20
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : veh.conversionRate > 0
                          ? 'bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {veh.conversionRate}%
                    </span>
                  </td>
                  <td className="py-3 text-right pr-2">
                    <span className="text-neutral-500 group-hover:text-[#8B5CF6] transition-colors inline-flex items-center gap-0.5">
                      Ver <ArrowRight className="w-3 h-3" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. ATENÇÃO NO ESTOQUE: ALTA PROCURA & BAIXA CONVERSÃO */}
      <div className="bg-[#1C1C1E] border border-neutral-800 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Atenção no Estoque</h3>
                <p className="text-xs text-neutral-400">Alta procura e baixa conversão</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-neutral-400 mt-3 leading-relaxed">
            Veículos com forte geração de leads mas com conversão em vendas abaixo da média esperada.
            Recomenda-se revisar preço de anúncio, condição de financiamento ou fotos.
          </p>

          <div className="space-y-3 mt-4">
            {attentionVehicles.length === 0 ? (
              <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800 text-center text-xs text-emerald-400">
                ✓ Nenhum veículo crítico detectado no estoque atual.
              </div>
            ) : (
              attentionVehicles.map((veh) => (
                <div
                  key={veh.vehicleId}
                  onClick={() => onSelectVehicle(veh.vehicleName)}
                  className="p-3 rounded-lg bg-neutral-900/90 hover:bg-neutral-850 border border-amber-500/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                      {veh.vehicleName}
                    </h4>
                    <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      0 Vendas
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400">
                    <span>{veh.leads} leads recebidos</span>
                    <span className="font-semibold text-white">{formatCurrency(veh.price)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-800/80 text-[11px] text-neutral-500">
          Dica IA: Crie campanhas de taxa reduzida para estes modelos.
        </div>
      </div>
    </div>
  );
};
