import React from 'react';
import { Trophy, Medal, Award, DollarSign, ShoppingBag } from 'lucide-react';
import { SellerPerformanceMetric } from '../../types/dashboard';

interface TopSellersRankingProps {
  sellers: SellerPerformanceMetric[];
  onSelectSeller: (sellerName: string) => void;
}

export const TopSellersRanking: React.FC<TopSellersRankingProps> = ({
  sellers,
  onSelectSeller,
}) => {
  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    });
  };

  const top3 = sellers.slice(0, 3);

  const getPositionBadge = (pos: number) => {
    switch (pos) {
      case 1:
        return {
          icon: Trophy,
          bgColor: 'bg-amber-500/15',
          textColor: 'text-amber-400',
          borderColor: 'border-amber-500/40',
          label: '1º Lugar • Campeão de Vendas',
        };
      case 2:
        return {
          icon: Medal,
          bgColor: 'bg-neutral-300/15',
          textColor: 'text-neutral-200',
          borderColor: 'border-neutral-400/40',
          label: '2º Lugar',
        };
      case 3:
        return {
          icon: Award,
          bgColor: 'bg-amber-700/15',
          textColor: 'text-amber-600',
          borderColor: 'border-amber-700/40',
          label: '3º Lugar',
        };
      default:
        return {
          icon: Award,
          bgColor: 'bg-neutral-800',
          textColor: 'text-neutral-400',
          borderColor: 'border-neutral-700',
          label: `${pos}º Lugar`,
        };
    }
  };

  return (
    <div className="bg-[#1C1C1E] border border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Top Vendedores do Período</h3>
            <p className="text-xs text-neutral-400">Destaques comerciais em volume e receita</p>
          </div>
        </div>
        <span className="text-xs text-neutral-400">Ranking Executivo</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        {top3.length === 0 ? (
          <div className="col-span-3 py-6 text-center text-xs text-neutral-500">
            Nenhuma venda registrada para o período selecionado
          </div>
        ) : (
          top3.map((seller, index) => {
            const badge = getPositionBadge(index + 1);
            const Icon = badge.icon;
            const isFirst = index === 0;

            return (
              <div
                key={seller.sellerName}
                onClick={() => onSelectSeller(seller.sellerName)}
                className={`group relative bg-neutral-900/90 hover:bg-[#25252a] border ${
                  isFirst
                    ? 'border-amber-500/40 shadow-amber-500/5'
                    : 'border-neutral-800 hover:border-neutral-700'
                } rounded-xl p-4 transition-all cursor-pointer flex flex-col justify-between shadow-sm hover:scale-[1.02]`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.bgColor} ${badge.textColor} ${badge.borderColor}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {badge.label}
                    </span>
                    <span className="text-[10px] text-neutral-500">{seller.team}</span>
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    <img
                      src={seller.avatar}
                      alt={seller.sellerName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-neutral-700 group-hover:border-[#8B5CF6] transition-colors"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#8B5CF6] transition-colors">
                        {seller.sellerName}
                      </h4>
                      <p className="text-[11px] text-neutral-400">
                        {seller.leads} leads • {seller.conversionRate.toFixed(1)}% conv.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800/80 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-neutral-850 p-2 rounded-lg">
                    <span className="text-[10px] text-neutral-400 block flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3 text-emerald-400" /> Vendas
                    </span>
                    <span className="font-bold text-emerald-400 text-base">
                      {seller.sales} <span className="text-[10px] font-normal text-neutral-400">un</span>
                    </span>
                  </div>
                  <div className="bg-neutral-850 p-2 rounded-lg">
                    <span className="text-[10px] text-neutral-400 block flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-[#8B5CF6]" /> Receita
                    </span>
                    <span className="font-bold text-white text-xs truncate block">
                      {formatCurrency(seller.revenue)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
