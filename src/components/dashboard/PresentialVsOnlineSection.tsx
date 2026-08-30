import React from 'react';
import { Globe, Store, ArrowRight, DollarSign, Percent, Users, ShoppingBag } from 'lucide-react';
import { PresentialVsOnlineMetric } from '../../types/dashboard';

interface PresentialVsOnlineSectionProps {
  data: PresentialVsOnlineMetric;
  onSelectChannel: (type: 'online' | 'presencial') => void;
}

export const PresentialVsOnlineSection: React.FC<PresentialVsOnlineSectionProps> = ({
  data,
  onSelectChannel,
}) => {
  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="bg-[#1C1C1E] border border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-800">
        <div>
          <h3 className="text-sm font-semibold text-white">Comparativo: Presencial vs Online</h3>
          <p className="text-xs text-neutral-400">
            Diferença de volume, conversão e ticket médio entre os canais de atendimento
          </p>
        </div>
        <span className="text-xs text-neutral-400">Análise de Canal</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* CANAL ONLINE */}
        <div
          id="card-channel-online"
          onClick={() => onSelectChannel('online')}
          className="group bg-neutral-900/90 hover:bg-[#25252a] border border-neutral-800 hover:border-[#8B5CF6]/40 rounded-xl p-4 transition-all cursor-pointer shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-[#8B5CF6] transition-colors">
                  Atendimento Online (Digital)
                </h4>
                <p className="text-[11px] text-neutral-400">WhatsApp, Meta Ads, Portais e Site</p>
              </div>
            </div>
            <span className="text-xs text-neutral-400 group-hover:text-[#8B5CF6] font-medium flex items-center gap-0.5">
              Ver leads <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-xs">
            <div className="bg-neutral-850 p-2.5 rounded-lg">
              <span className="text-[10px] text-neutral-400 block">Leads</span>
              <span className="font-bold text-white text-base">{data.online.leads}</span>
            </div>
            <div className="bg-neutral-850 p-2.5 rounded-lg">
              <span className="text-[10px] text-neutral-400 block">Visitas</span>
              <span className="font-bold text-neutral-200 text-base">{data.online.visits}</span>
            </div>
            <div className="bg-neutral-850 p-2.5 rounded-lg">
              <span className="text-[10px] text-neutral-400 block">Vendas</span>
              <span className="font-bold text-emerald-400 text-base">{data.online.sales}</span>
            </div>
            <div className="bg-neutral-850 p-2.5 rounded-lg">
              <span className="text-[10px] text-neutral-400 block">Conversão</span>
              <span className="font-bold text-[#A78BFA] text-base">{data.online.conversionRate}%</span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-xs">
            <span className="text-neutral-400">Receita Gerada no Online:</span>
            <span className="font-bold text-white">{formatCurrency(data.online.revenue)}</span>
          </div>
        </div>

        {/* CANAL PRESENCIAL */}
        <div
          id="card-channel-presential"
          onClick={() => onSelectChannel('presencial')}
          className="group bg-neutral-900/90 hover:bg-[#25252a] border border-neutral-800 hover:border-emerald-500/40 rounded-xl p-4 transition-all cursor-pointer shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Atendimento Presencial (Showroom)
                </h4>
                <p className="text-[11px] text-neutral-400">Clientes espontâneos, passagem e indicações</p>
              </div>
            </div>
            <span className="text-xs text-neutral-400 group-hover:text-emerald-400 font-medium flex items-center gap-0.5">
              Ver leads <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-xs">
            <div className="bg-neutral-850 p-2.5 rounded-lg">
              <span className="text-[10px] text-neutral-400 block">Atendimentos</span>
              <span className="font-bold text-white text-base">{data.presential.attendances}</span>
            </div>
            <div className="bg-neutral-850 p-2.5 rounded-lg">
              <span className="text-[10px] text-neutral-400 block">Propostas</span>
              <span className="font-bold text-neutral-200 text-base">{data.presential.proposals}</span>
            </div>
            <div className="bg-neutral-850 p-2.5 rounded-lg">
              <span className="text-[10px] text-neutral-400 block">Vendas</span>
              <span className="font-bold text-emerald-400 text-base">{data.presential.sales}</span>
            </div>
            <div className="bg-neutral-850 p-2.5 rounded-lg">
              <span className="text-[10px] text-neutral-400 block">Conversão</span>
              <span className="font-bold text-emerald-400 text-base">
                {data.presential.conversionRate}%
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-xs">
            <span className="text-neutral-400">Receita Gerada no Presencial:</span>
            <span className="font-bold text-white">{formatCurrency(data.presential.revenue)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
