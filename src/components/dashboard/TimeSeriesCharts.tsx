import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, BarChart2 } from 'lucide-react';
import { TimeSeriesPoint } from '../../types/dashboard';

interface TimeSeriesChartsProps {
  data: TimeSeriesPoint[];
  granularity: 'diario' | 'semanal' | 'mensal';
  onGranularityChange: (g: 'diario' | 'semanal' | 'mensal') => void;
}

export const TimeSeriesCharts: React.FC<TimeSeriesChartsProps> = ({
  data,
  granularity,
  onGranularityChange,
}) => {
  const [salesMetric, setSalesMetric] = useState<'qty' | 'revenue'>('revenue');

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `R$ ${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `R$ ${(val / 1000).toFixed(0)}k`;
    return `R$ ${val}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1C1C1E] border border-neutral-700 p-3 rounded-lg shadow-xl text-xs space-y-1">
          <p className="font-semibold text-neutral-200">{label}</p>
          {payload.map((p: any, idx: number) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-neutral-400 capitalize">{p.name}:</span>
              <span className="font-bold text-white">
                {p.name === 'Receita' ? formatCurrency(p.value) : p.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. LEADS AO LONGO DO TEMPO */}
      <div className="bg-[#1C1C1E] border border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Leads ao Longo do Tempo</h3>
              <p className="text-xs text-neutral-400">Evolução do volume de entrada</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
            {(['diario', 'semanal', 'mensal'] as const).map((g) => (
              <button
                key={g}
                id={`btn-leads-granularity-${g}`}
                onClick={() => onGranularityChange(g)}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-all capitalize ${
                  granularity === g
                    ? 'bg-[#8B5CF6] text-white shadow-sm font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          {data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-neutral-500">
              Nenhum dado de leads no período selecionado
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="leadAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis
                  dataKey="label"
                  stroke="#737373"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#737373"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="leads"
                  name="Leads"
                  stroke="#8B5CF6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#leadAreaGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 2. VENDAS AO LONGO DO TEMPO */}
      <div className="bg-[#1C1C1E] border border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Vendas ao Longo do Tempo</h3>
              <p className="text-xs text-neutral-400">Fechamentos e faturamento por período</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
            <button
              id="btn-sales-metric-qty"
              onClick={() => setSalesMetric('qty')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                salesMetric === 'qty'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Quantidade
            </button>
            <button
              id="btn-sales-metric-revenue"
              onClick={() => setSalesMetric('revenue')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                salesMetric === 'revenue'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Faturamento (R$)
            </button>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          {data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-neutral-500">
              Nenhum dado de vendas no período selecionado
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: salesMetric === 'revenue' ? -5 : -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis
                  dataKey="label"
                  stroke="#737373"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#737373"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={salesMetric === 'revenue' ? formatCurrency : undefined}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                {salesMetric === 'qty' ? (
                  <Bar dataKey="sales" name="Vendas" fill="#10B981" radius={[4, 4, 0, 0]} />
                ) : (
                  <Bar dataKey="revenue" name="Receita" fill="#10B981" radius={[4, 4, 0, 0]} />
                )}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};
