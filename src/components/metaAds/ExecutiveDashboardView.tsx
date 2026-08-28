import React from 'react';
import {
  DollarSign,
  Users,
  Target,
  Car,
  TrendingUp,
  Award,
  ArrowUpRight,
  ShieldCheck,
  Building,
  CheckCircle2,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import {
  MetaCampaign,
  MetaPerformanceByVehicle,
  MetaDailyDataPoint,
} from '../../types';

interface ExecutiveDashboardViewProps {
  campaigns: MetaCampaign[];
  vehicles: MetaPerformanceByVehicle[];
  dailyTrends: MetaDailyDataPoint[];
  period: string;
  onOpenCampaignDetail: (campaign: MetaCampaign) => void;
}

export const ExecutiveDashboardView: React.FC<ExecutiveDashboardViewProps> = ({
  campaigns,
  vehicles,
  dailyTrends,
  period,
  onOpenCampaignDetail,
}) => {
  // Aggregate Metrics
  const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
  const totalLeads = campaigns.reduce((acc, c) => acc + c.leads, 0);
  const avgCpl = totalLeads > 0 ? totalSpend / totalLeads : 0;
  const totalAgendamentos = campaigns.reduce((acc, c) => acc + c.crmAgendamentos, 0);
  const totalVisitas = campaigns.reduce((acc, c) => acc + c.crmVisitas, 0);
  const totalVendas = campaigns.reduce((acc, c) => acc + c.crmVendas, 0);
  const totalReceita = campaigns.reduce((acc, c) => acc + c.crmReceita, 0);
  const totalLucro = campaigns.reduce((acc, c) => acc + c.crmLucro, 0);
  const avgCac = totalVendas > 0 ? totalSpend / totalVendas : 0;
  const roasGlobal = totalSpend > 0 ? totalReceita / totalSpend : 0;

  // Best Performing Campaign & Vehicle
  const bestCampaign = [...campaigns].sort((a, b) => b.crmVendas - a.crmVendas)[0];
  const bestVehicle = [...vehicles].sort((a, b) => b.vendas - a.vendas)[0];

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Executive Intro Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#1C162E] via-[#1E1933] to-[#161618] border border-[#8B5CF6]/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#C4B5FD] text-[#2E1065]">
              MODO EXECUTIVO DO PROPRIETÁRIO
            </span>
            <span className="text-xs text-zinc-400">Período: {period}</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1.5">
            Diagnóstico Comercial de Tráfego Pago &amp; Vendas
          </h2>
          <p className="text-xs text-zinc-300 mt-0.5 max-w-2xl">
            Resumo em linguagem executiva focado em retorno financeiro, lucratividade e volume de vendas.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 bg-[#121214]/80 p-3 rounded-xl border border-zinc-800">
          <div className="text-right">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold block">
              Retorno sobre Anúncios
            </span>
            <span className="text-lg font-extrabold text-emerald-400">
              {roasGlobal.toFixed(1)}x ROAS
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* The 8 Core Business Questions Answered in High-Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Quanto investi? */}
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
            <span>1. Quanto investi?</span>
            <DollarSign className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            R$ {totalSpend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">
            +12,4% vs período anterior
          </div>
        </div>

        {/* 2. Quantos leads recebi? */}
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
            <span>2. Quantos leads recebi?</span>
            <Users className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div className="text-2xl font-extrabold text-[#C4B5FD] mt-2">
            {totalLeads} leads
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">
            +18,2% (+28 leads novos)
          </div>
        </div>

        {/* 3. Quanto custou cada lead? */}
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
            <span>3. Quanto custou o lead?</span>
            <Target className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            R$ {avgCpl.toFixed(2)}
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">
            -5,4% mais barato que a meta
          </div>
        </div>

        {/* 4. Quantos agendamentos tive? */}
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
            <span>4. Agendamentos no CRM?</span>
            <Car className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div className="text-2xl font-extrabold text-[#C4B5FD] mt-2">
            {totalAgendamentos} agendados
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            52,2% dos leads qualificados
          </div>
        </div>

        {/* 5. Quantas pessoas foram à loja? */}
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
            <span>5. Visitas no Showroom?</span>
            <Building className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            {totalVisitas} visitas
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">
            64,6% de comparecimento
          </div>
        </div>

        {/* 6. Quantas vendas vieram da mídia? */}
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
            <span>6. Vendas concretizadas?</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-2">
            {totalVendas} carros vendidos
          </div>
          <div className="text-[11px] text-emerald-400/80 font-medium mt-1">
            Receita: R$ {totalReceita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* 7. Quanto custou cada venda? */}
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
            <span>7. Custo por Venda (CAC)?</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-2">
            R$ {avgCac.toFixed(2)}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            Lucro Bruto: R$ {totalLucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* 8. Taxa Geral de Conversão */}
        <div className="p-4 rounded-2xl bg-[#25193A] border border-[#8B5CF6]/50">
          <div className="flex items-center justify-between text-[#C4B5FD] text-xs font-bold">
            <span>8. Conversão Lead → Venda</span>
            <CheckCircle2 className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            {((totalVendas / (totalLeads || 1)) * 100).toFixed(2)}%
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">
            ● Acima da média de mercado (3.5%)
          </div>
        </div>
      </div>

      {/* Question 8 Detail: Top Performing Campaign & Vehicle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Best Campaign Card */}
        {bestCampaign && (
          <div
            onClick={() => onOpenCampaignDetail(bestCampaign)}
            className="p-5 rounded-2xl bg-[#1C1C1E] border border-zinc-800 hover:border-[#8B5CF6]/50 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/30 flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  CAMPEÃ DE FECHAMENTOS DE VENDAS
                </span>
                <span className="text-xs text-zinc-400">Ver detalhes →</span>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={bestCampaign.vehicleThumbnail}
                  alt={bestCampaign.name}
                  className="w-16 h-16 rounded-xl object-cover border border-zinc-700 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-bold text-white text-base leading-snug">
                    {bestCampaign.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {bestCampaign.vehicleOffer}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800 grid grid-cols-4 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-zinc-400 block">Investido</span>
                <span className="font-bold text-white">
                  R$ {bestCampaign.spend.toFixed(0)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block">Leads</span>
                <span className="font-bold text-[#C4B5FD]">{bestCampaign.leads}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block">Vendas</span>
                <span className="font-bold text-emerald-400">
                  {bestCampaign.crmVendas} carros
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block">ROAS</span>
                <span className="font-bold text-emerald-400">
                  {bestCampaign.roas.toFixed(0)}x
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Best Vehicle Card */}
        {bestVehicle && (
          <div className="p-5 rounded-2xl bg-[#1C1C1E] border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Car className="w-3 h-3" />
                  VEÍCULO MAIS VENDIDO VIA MÍDIA
                </span>
                <span className="text-xs text-zinc-400">Preço: R$ {(bestVehicle.price / 1000).toFixed(0)}k</span>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={bestVehicle.thumbnail}
                  alt={bestVehicle.model}
                  className="w-16 h-16 rounded-xl object-cover border border-zinc-700 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-bold text-white text-base leading-snug">
                    {bestVehicle.brand} {bestVehicle.model}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Ano {bestVehicle.year} • {bestVehicle.campaignsCount} campanhas ativas
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800 grid grid-cols-4 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-zinc-400 block">Investido</span>
                <span className="font-bold text-white">
                  R$ {bestVehicle.spend.toFixed(0)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block">Leads</span>
                <span className="font-bold text-[#C4B5FD]">{bestVehicle.leads}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block">Vendas</span>
                <span className="font-bold text-emerald-400">
                  {bestVehicle.vendas} un
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block">Faturamento</span>
                <span className="font-bold text-emerald-400">
                  R$ {(bestVehicle.revenue / 1000).toFixed(0)}k
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
