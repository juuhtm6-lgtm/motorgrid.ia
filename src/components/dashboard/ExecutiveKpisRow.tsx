import React from 'react';
import { Users, ShoppingBag, DollarSign, Percent, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { ExecutiveKpis } from '../../types/dashboard';

interface ExecutiveKpisRowProps {
  kpis: ExecutiveKpis;
  onDrillDown: (type: 'leads' | 'sales' | 'revenue' | 'conversion') => void;
}

export const ExecutiveKpisRow: React.FC<ExecutiveKpisRowProps> = ({ kpis, onDrillDown }) => {
  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    });
  };

  const renderComparison = (val: number, isPp: boolean = false) => {
    const isPositive = val >= 0;
    return (
      <div
        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded ${
          isPositive
            ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
            : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
        }`}
      >
        {isPositive ? (
          <TrendingUp className="w-3 h-3 text-emerald-400" />
        ) : (
          <TrendingDown className="w-3 h-3 text-rose-400" />
        )}
        <span>
          {isPositive ? '+' : ''}
          {val.toFixed(1)}
          {isPp ? ' p.p.' : '%'}
        </span>
        <span className="text-[10px] text-neutral-400 font-normal ml-0.5">vs ant.</span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. LEADS RECEBIDOS */}
      <div
        id="kpi-card-leads"
        onClick={() => onDrillDown('leads')}
        className="group relative bg-[#1C1C1E] hover:bg-[#242428] border border-neutral-800 hover:border-[#8B5CF6]/40 rounded-xl p-5 transition-all cursor-pointer shadow-sm hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Leads Recebidos
          </span>
          <div className="p-2 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20 group-hover:scale-105 transition-transform">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {kpis.totalLeads}
          </div>
          {renderComparison(kpis.leadsChangePercent)}
        </div>

        <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
          <span>Anterior: {kpis.totalLeadsPrevious} leads</span>
          <span className="text-neutral-500 group-hover:text-[#8B5CF6] flex items-center gap-0.5 font-medium transition-colors">
            Ver detalhes <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* 2. VENDAS FECHADAS */}
      <div
        id="kpi-card-sales"
        onClick={() => onDrillDown('sales')}
        className="group relative bg-[#1C1C1E] hover:bg-[#242428] border border-neutral-800 hover:border-emerald-500/40 rounded-xl p-5 transition-all cursor-pointer shadow-sm hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Vendas Fechadas
          </span>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {kpis.totalSales}
          </div>
          {renderComparison(kpis.salesChangePercent)}
        </div>

        <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
          <span>Anterior: {kpis.totalSalesPrevious} veículos</span>
          <span className="text-neutral-500 group-hover:text-emerald-400 flex items-center gap-0.5 font-medium transition-colors">
            Ver detalhes <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* 3. RECEITA TOTAL */}
      <div
        id="kpi-card-revenue"
        onClick={() => onDrillDown('revenue')}
        className="group relative bg-[#1C1C1E] hover:bg-[#242428] border border-neutral-800 hover:border-[#8B5CF6]/40 rounded-xl p-5 transition-all cursor-pointer shadow-sm hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Receita Total
          </span>
          <div className="p-2 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20 group-hover:scale-105 transition-transform">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            {formatCurrency(kpis.totalRevenue)}
          </div>
          {renderComparison(kpis.revenueChangePercent)}
        </div>

        <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
          <span>Anterior: {formatCurrency(kpis.totalRevenuePrevious)}</span>
          <span className="text-neutral-500 group-hover:text-[#8B5CF6] flex items-center gap-0.5 font-medium transition-colors">
            Ver detalhes <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* 4. TAXA DE CONVERSÃO */}
      <div
        id="kpi-card-conversion"
        onClick={() => onDrillDown('conversion')}
        className="group relative bg-[#1C1C1E] hover:bg-[#242428] border border-neutral-800 hover:border-[#8B5CF6]/40 rounded-xl p-5 transition-all cursor-pointer shadow-sm hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Taxa de Conversão
          </span>
          <div className="p-2 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20 group-hover:scale-105 transition-transform">
            <Percent className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {kpis.conversionRate.toFixed(1)}%
          </div>
          {renderComparison(kpis.conversionChangePp, true)}
        </div>

        <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
          <span>Anterior: {kpis.conversionRatePrevious.toFixed(1)}%</span>
          <span className="text-neutral-500 group-hover:text-[#8B5CF6] flex items-center gap-0.5 font-medium transition-colors">
            Ver detalhes <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
};
