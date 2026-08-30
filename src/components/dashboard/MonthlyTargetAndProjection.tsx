import React from 'react';
import { Target, TrendingUp, AlertTriangle, CheckCircle2, Award } from 'lucide-react';
import { StoreGoalAndProjection } from '../../types/dashboard';

interface MonthlyTargetAndProjectionProps {
  data: StoreGoalAndProjection;
}

export const MonthlyTargetAndProjection: React.FC<MonthlyTargetAndProjectionProps> = ({
  data,
}) => {
  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    });
  };

  const getStatusBadge = () => {
    switch (data.status) {
      case 'ACIMA DA META':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Acima da Meta
          </span>
        );
      case 'DENTRO DO ESPERADO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30">
            <Award className="w-3.5 h-3.5" />
            Dentro do Esperado
          </span>
        );
      case 'RISCO DE NÃO ATINGIR A META':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            Risco de Não Atingir a Meta
          </span>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. META DO MÊS */}
      <div className="bg-[#1C1C1E] border border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Meta do Mês (Agosto 2026)</h3>
              <p className="text-xs text-neutral-400">Progresso de veículos e receita</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700">
            {data.daysElapsed} de {data.totalDaysInMonth} dias decorridos
          </span>
        </div>

        {/* Barra 1: Unidades */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-300 font-medium">Veículos Vendidos</span>
            <span className="text-white font-bold">
              {data.realizedUnits} <span className="text-neutral-500 font-normal">/ {data.goalUnits} carros</span> ({data.unitsAttainmentPercent}%)
            </span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-3 overflow-hidden p-0.5 border border-neutral-750">
            <div
              className="h-full rounded-full bg-[#8B5CF6] transition-all duration-500"
              style={{ width: `${Math.min(100, data.unitsAttainmentPercent)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-neutral-400">
            <span>Realizado: {data.realizedUnits} carros</span>
            <span>Faltam: {data.remainingUnits} para meta</span>
          </div>
        </div>

        {/* Barra 2: Faturamento */}
        <div className="space-y-1.5 pt-2 border-t border-neutral-800/80">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-300 font-medium">Faturamento Total</span>
            <span className="text-white font-bold">
              {formatCurrency(data.realizedRevenue)} <span className="text-neutral-500 font-normal">/ {formatCurrency(data.goalRevenue)}</span> ({data.revenueAttainmentPercent}%)
            </span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-3 overflow-hidden p-0.5 border border-neutral-750">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${Math.min(100, data.revenueAttainmentPercent)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-neutral-400">
            <span>Realizado: {formatCurrency(data.realizedRevenue)}</span>
            <span>Meta: {formatCurrency(data.goalRevenue)}</span>
          </div>
        </div>
      </div>

      {/* 2. PROJEÇÃO DE FECHAMENTO */}
      <div className="bg-[#1C1C1E] border border-neutral-800 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Projeção de Fechamento</h3>
                <p className="text-xs text-neutral-400">Estimativa baseada no ritmo diário atual</p>
              </div>
            </div>
            {getStatusBadge()}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-lg p-3">
              <span className="text-[11px] text-neutral-400 uppercase font-medium">
                Projeção de Vendas
              </span>
              <div className="text-2xl font-bold text-white mt-1">
                {data.projectedUnits} <span className="text-xs text-neutral-400 font-normal">carros</span>
              </div>
              <span className="text-[10px] text-neutral-500 mt-0.5 block">
                Ritmo diário: {(data.realizedUnits / data.daysElapsed).toFixed(2)} carros/dia
              </span>
            </div>

            <div className="bg-neutral-900/80 border border-neutral-800 rounded-lg p-3">
              <span className="text-[11px] text-neutral-400 uppercase font-medium">
                Projeção de Faturamento
              </span>
              <div className="text-lg sm:text-xl font-bold text-white mt-1">
                {formatCurrency(data.projectedRevenue)}
              </div>
              <span className="text-[10px] text-neutral-500 mt-0.5 block">
                Ritmo diário: {formatCurrency(data.realizedRevenue / data.daysElapsed)}/dia
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
          <span>Restam {data.daysRemaining} dia(s) úteis no mês</span>
          <span className="text-neutral-300 font-medium">
            Meta: {data.goalUnits} un ({((data.projectedUnits / data.goalUnits) * 100).toFixed(0)}% projetado)
          </span>
        </div>
      </div>
    </div>
  );
};
