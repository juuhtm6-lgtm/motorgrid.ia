import React, { useState } from 'react';
import { ArrowUpDown, Users, ChevronRight, Award } from 'lucide-react';
import { SellerPerformanceMetric } from '../../types/dashboard';

interface TeamPerformanceTableProps {
  sellers: SellerPerformanceMetric[];
  onSelectSeller: (sellerName: string) => void;
}

type SortKey = keyof SellerPerformanceMetric;

export const TeamPerformanceTable: React.FC<TeamPerformanceTableProps> = ({
  sellers,
  onSelectSeller,
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('sales');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const sortedSellers = [...sellers].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    const numA = Number(valA) || 0;
    const numB = Number(valB) || 0;
    return sortOrder === 'asc' ? numA - numB : numB - numA;
  });

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    });
  };

  const columns: { key: SortKey; label: string; align: 'left' | 'right' }[] = [
    { key: 'position', label: '#', align: 'left' },
    { key: 'sellerName', label: 'Vendedor', align: 'left' },
    { key: 'leads', label: 'Leads', align: 'right' },
    { key: 'attendances', label: 'Atendimentos', align: 'right' },
    { key: 'appointments', label: 'Agendamentos', align: 'right' },
    { key: 'visits', label: 'Visitas', align: 'right' },
    { key: 'proposals', label: 'Propostas', align: 'right' },
    { key: 'sales', label: 'Vendas', align: 'right' },
    { key: 'conversionRate', label: 'Conversão %', align: 'right' },
    { key: 'revenue', label: 'Receita (R$)', align: 'right' },
  ];

  return (
    <div className="bg-[#1C1C1E] border border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6]">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Performance Individual da Equipe</h3>
            <p className="text-xs text-neutral-400">
              Clique em qualquer coluna para ordenar ou no vendedor para ver seus leads
            </p>
          </div>
        </div>
        <span className="text-xs text-neutral-400">
          Total: <strong className="text-white">{sellers.length}</strong> vendedores avaliados
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-800 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`pb-3 cursor-pointer select-none hover:text-white transition-colors ${
                    col.align === 'right' ? 'text-right' : 'text-left'
                  } ${col.key === 'position' ? 'pl-2 w-10' : ''}`}
                >
                  <div
                    className={`inline-flex items-center gap-1 ${
                      col.align === 'right' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>{col.label}</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-500" />
                  </div>
                </th>
              ))}
              <th className="pb-3 text-right pr-2">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-850 text-neutral-300">
            {sortedSellers.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-neutral-500">
                  Nenhum registro encontrado para a equipe no período
                </td>
              </tr>
            ) : (
              sortedSellers.map((seller, index) => {
                const isTop = index === 0 && sortKey === 'sales';
                return (
                  <tr
                    key={seller.sellerName}
                    onClick={() => onSelectSeller(seller.sellerName)}
                    className="hover:bg-neutral-900/80 transition-colors cursor-pointer group"
                  >
                    {/* # Posição */}
                    <td className="py-3 pl-2 font-bold text-neutral-400">
                      {isTop ? (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[10px]">
                          1º
                        </span>
                      ) : (
                        <span>{index + 1}º</span>
                      )}
                    </td>

                    {/* Vendedor */}
                    <td className="py-3 font-medium text-white">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={seller.avatar}
                          alt={seller.sellerName}
                          className="w-7 h-7 rounded-full object-cover border border-neutral-700"
                        />
                        <div>
                          <span className="font-semibold text-white group-hover:text-[#8B5CF6] transition-colors block">
                            {seller.sellerName}
                          </span>
                          <span className="text-[10px] text-neutral-500">{seller.team}</span>
                        </div>
                      </div>
                    </td>

                    {/* Leads */}
                    <td className="py-3 text-right font-medium text-neutral-200">{seller.leads}</td>

                    {/* Atendimentos */}
                    <td className="py-3 text-right text-neutral-300">{seller.attendances}</td>

                    {/* Agendamentos */}
                    <td className="py-3 text-right text-neutral-300">{seller.appointments}</td>

                    {/* Visitas */}
                    <td className="py-3 text-right text-neutral-300">{seller.visits}</td>

                    {/* Propostas */}
                    <td className="py-3 text-right text-neutral-300">{seller.proposals}</td>

                    {/* Vendas */}
                    <td className="py-3 text-right font-bold text-emerald-400 text-sm">
                      {seller.sales}
                    </td>

                    {/* Conversão % */}
                    <td className="py-3 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          seller.conversionRate >= 25
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : seller.conversionRate > 0
                            ? 'bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {seller.conversionRate.toFixed(1)}%
                      </span>
                    </td>

                    {/* Receita */}
                    <td className="py-3 text-right font-semibold text-white">
                      {formatCurrency(seller.revenue)}
                    </td>

                    {/* Ação */}
                    <td className="py-3 text-right pr-2">
                      <span className="text-neutral-500 group-hover:text-[#8B5CF6] transition-colors inline-flex items-center gap-0.5">
                        Ver <ChevronRight className="w-3.5 h-3.5" />
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
