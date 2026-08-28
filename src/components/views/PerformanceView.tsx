import React from 'react';
import {
  TrendingUp,
  BarChart3,
  DollarSign,
  Car,
  Fuel,
  Users,
  ShieldCheck,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';
import { MetricSummary } from '../../types';

interface PerformanceViewProps {
  metrics: MetricSummary;
}

export const PerformanceView: React.FC<PerformanceViewProps> = ({ metrics }) => {
  const rankingSales = [
    { name: 'Rodrigo Mendes', role: 'Executivo Comercial', closed: 18, mrr: 16400, target: 120, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
    { name: 'Camila Rocha', role: 'Key Account Enterprise', closed: 12, mrr: 14200, target: 115, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80' },
    { name: 'Ana Luísa', role: 'Head Ops & Expansão', closed: 9, mrr: 8900, target: 98, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-400">Retenção Líquida (NRR)</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{metrics.nrr}%</div>
            <div className="text-[11px] text-emerald-400/80 mt-0.5">+4.8% vs benchmark</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-400">LTV / CAC Ratio</div>
            <div className="text-2xl font-bold text-white mt-1">
              {(metrics.ltv / (metrics.cac || 1)).toFixed(1)}x
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">LTV: R$ {metrics.ltv.toLocaleString('pt-BR')}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[#8B5CF6]/30">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-400">Economia Gerada de Combustível</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">24.6%</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Média calculada em 180 veículos</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Fuel className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-400">Taxa de Churn Mensal</div>
            <div className="text-2xl font-bold text-white mt-1">{metrics.churnRate}%</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">-0.4% no último trimestre</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/15 text-blue-300 border border-blue-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid: Performance Telemetria & Ranking Vendas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Telemetria & Eficiência */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#141416] border border-zinc-800/80 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#A78BFA]" />
                <span>Eficiência Operacional de Frota & CAN-Bus</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">Impacto real gerado nos clientes conectados</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#8B5CF6]/15 text-[#DDD6FE] border border-[#8B5CF6]/30 font-semibold font-mono">
              Safra Q1 2026
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-[#1C1C1E] border border-zinc-800">
              <div className="text-xs text-zinc-400">Redução de Ociosidade</div>
              <div className="text-xl font-bold text-emerald-400 mt-1">-32%</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Menos tempo com motor ligado parado</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#1C1C1E] border border-zinc-800">
              <div className="text-xs text-zinc-400">Prevenção de Quebras</div>
              <div className="text-xl font-bold text-emerald-400 mt-1">94.8%</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Alertas precoces de temperatura/óleo</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#1C1C1E] border border-zinc-800">
              <div className="text-xs text-zinc-400">ROI Médio do Cliente</div>
              <div className="text-xl font-bold text-white mt-1">4.2x</div>
              <div className="text-[10px] text-[#A78BFA] mt-0.5">Payback em menos de 45 dias</div>
            </div>
          </div>

          {/* Telemetry Progress Bars */}
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs text-zinc-300 font-semibold mb-1">
                <span>Conformidade de Condução Segura (Motoristas)</span>
                <span className="font-mono text-emerald-400">91.4%</span>
              </div>
              <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-emerald-400" style={{ width: '91.4%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-zinc-300 font-semibold mb-1">
                <span>Disponibilidade dos Rastreadores 4G/GPS (SLA)</span>
                <span className="font-mono text-[#C4B5FD]">99.98%</span>
              </div>
              <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full rounded-full bg-[#8B5CF6]" style={{ width: '99.98%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-zinc-300 font-semibold mb-1">
                <span>Aderência às Rotas Otimizadas por IA</span>
                <span className="font-mono text-amber-300">86.2%</span>
              </div>
              <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full rounded-full bg-amber-400" style={{ width: '86.2%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Ranking Comercial */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#141416] border border-zinc-800/80 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Ranking Comercial & Fechamento</span>
            </h3>
            <span className="text-[10px] text-zinc-400">Mês Vigente</span>
          </div>

          <div className="space-y-3">
            {rankingSales.map((rep, idx) => (
              <div
                key={rep.name}
                className="p-3.5 rounded-xl bg-[#1C1C1E] border border-zinc-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    idx === 0 ? 'bg-amber-500 text-black' : idx === 1 ? 'bg-zinc-400 text-black' : 'bg-amber-800 text-white'
                  }`}>
                    {idx + 1}
                  </div>
                  <img src={rep.avatar} alt={rep.name} className="w-9 h-9 rounded-full object-cover ring-1 ring-[#8B5CF6]/40" />
                  <div>
                    <div className="text-xs font-bold text-white">{rep.name}</div>
                    <div className="text-[10px] text-zinc-400">{rep.role}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-400 font-mono">
                    R$ {rep.mrr.toLocaleString('pt-BR')} /mês
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">
                    {rep.closed} frotas ({rep.target}% da meta)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
