import React from 'react';
import { Users2, ArrowRight } from 'lucide-react';
import { SellerPerformanceMetric } from '../../types/dashboard';

interface LeadsDistributionSectionProps {
  sellers: SellerPerformanceMetric[];
  onSelectSeller: (sellerName: string) => void;
}

export const LeadsDistributionSection: React.FC<LeadsDistributionSectionProps> = ({
  sellers,
  onSelectSeller,
}) => {
  const totalLeads = sellers.reduce((acc, s) => acc + s.leads, 0);

  return (
    <div className="bg-[#1C1C1E] border border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6]">
            <Users2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Distribuição de Leads por Vendedor</h3>
            <p className="text-xs text-neutral-400">
              Equilíbrio da roleta de distribuição e capacidade de atendimento
            </p>
          </div>
        </div>
        <span className="text-xs text-neutral-400">Total: {totalLeads} leads distribuídos</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
        {sellers.map((seller) => {
          const share = totalLeads > 0 ? (seller.leads / totalLeads) * 100 : 0;
          return (
            <div
              key={seller.sellerName}
              onClick={() => onSelectSeller(seller.sellerName)}
              className="bg-neutral-900/80 hover:bg-[#25252a] border border-neutral-800 hover:border-[#8B5CF6]/40 p-3 rounded-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <img
                    src={seller.avatar}
                    alt={seller.sellerName}
                    className="w-8 h-8 rounded-full object-cover border border-neutral-700"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-white group-hover:text-[#8B5CF6] transition-colors truncate block">
                      {seller.sellerName.split(' ')[0]} {seller.sellerName.split(' ')[1] || ''}
                    </span>
                    <span className="text-[10px] text-neutral-500">{seller.team.split(' ')[0]}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-lg font-bold text-white">{seller.leads} leads</span>
                  <span className="text-xs font-semibold text-[#A78BFA]">{share.toFixed(0)}%</span>
                </div>
              </div>

              <div className="w-full bg-neutral-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
                <div
                  className="bg-[#8B5CF6] h-1.5 rounded-full"
                  style={{ width: `${share}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
