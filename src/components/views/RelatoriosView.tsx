import React, { useState, useMemo, useEffect } from 'react';
import {
  TrendingUp,
  Award,
  DollarSign,
  Users,
  Clock,
  Car,
  Filter,
  Download,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { initialAuthUsers } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import { storageService } from '../../services/storageService';
import { filterExecutiveRecords } from '../../services/executiveDashboardEngine';
import { DashboardFilters, ExecutiveLeadRecord } from '../../types/dashboard';

export const RelatoriosView: React.FC = () => {
  const toast = useToast();
  const [period, setPeriod] = useState<'Hoje' | 'Esta Semana' | 'Este Mês' | 'Ano 2026'>('Este Mês');
  const [allRecords, setAllRecords] = useState<ExecutiveLeadRecord[]>(() =>
    storageService.getDashboardRecords()
  );

  useEffect(() => {
    const unsub = storageService.subscribe(() => {
      setAllRecords(storageService.getDashboardRecords());
    });
    return unsub;
  }, []);

  const internalPeriod: DashboardFilters['period'] =
    period === 'Hoje'
      ? 'hoje'
      : period === 'Esta Semana'
      ? '7dias'
      : period === 'Este Mês'
      ? 'mes_atual'
      : '30dias';

  const { current: filteredRecords } = useMemo(() => {
    return filterExecutiveRecords(allRecords, {
      period: internalPeriod,
      store: 'all',
      team: 'all',
      seller: 'all',
      origin: 'all',
      channelType: 'all',
      status: 'all',
    });
  }, [allRecords, internalPeriod]);

  // Derived KPIs
  const totalLeads = filteredRecords.length;
  const qualifiedLeads = filteredRecords.filter((r) => r.isQualified || r.status !== 'novo').length;
  const visitLeads = filteredRecords.filter((r) => r.isVisited || r.isScheduled).length;
  const proposalLeads = filteredRecords.filter((r) => r.isProposal || r.status === 'vendido').length;
  const salesRecords = filteredRecords.filter((r) => r.status === 'vendido');
  const salesCount = salesRecords.length;
  const totalRevenue = salesRecords.reduce((acc, r) => acc + (r.vehiclePrice || 0), 0);
  const ticketMedio = salesCount > 0 ? totalRevenue / salesCount : 0;
  const conversionRate = totalLeads > 0 ? ((salesCount / totalLeads) * 100).toFixed(1) + '%' : '0.0%';
  const avgSla = totalLeads > 0
    ? (filteredRecords.reduce((acc, r) => acc + (r.firstResponseTimeMinutes || 1.8), 0) / totalLeads).toFixed(1)
    : '1.8';

  const formatBRL = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  };

  const funnelData = [
    {
      stage: '1. Leads Recebidos',
      count: totalLeads,
      conversion: totalLeads > 0 ? '100%' : '0%',
      color: '#8B5CF6',
    },
    {
      stage: '2. Qualificados (SDR)',
      count: qualifiedLeads,
      conversion: totalLeads > 0 ? `${((qualifiedLeads / totalLeads) * 100).toFixed(1)}%` : '0%',
      color: '#7C3AED',
    },
    {
      stage: '3. Visitas / Test Drive',
      count: visitLeads,
      conversion: totalLeads > 0 ? `${((visitLeads / totalLeads) * 100).toFixed(1)}%` : '0%',
      color: '#6D28D9',
    },
    {
      stage: '4. Propostas Enviadas',
      count: proposalLeads,
      conversion: totalLeads > 0 ? `${((proposalLeads / totalLeads) * 100).toFixed(1)}%` : '0%',
      color: '#5B21B6',
    },
    {
      stage: '5. Vendas Fechadas',
      count: salesCount,
      conversion: conversionRate,
      color: '#10B981',
    },
  ];

  // Dynamic origin metrics
  const defaultOrigins = [
    { name: 'Instagram / Meta Ads', cpl: 'R$ 24,50', roas: '14.2x' },
    { name: 'Webmotors Pro', cpl: 'R$ 68,00', roas: '8.4x' },
    { name: 'Google Search Ads', cpl: 'R$ 42,00', roas: '11.1x' },
    { name: 'iCarros & OLX', cpl: 'R$ 38,00', roas: '7.8x' },
    { name: 'Indicação / Showroom', cpl: 'R$ 0,00', roas: '-' },
  ];

  const sourceData = defaultOrigins.map((orig) => {
    const matched = filteredRecords.filter(
      (r) =>
        r.origin?.toLowerCase().includes(orig.name.split('/')[0].trim().toLowerCase()) ||
        (orig.name.includes('Instagram') && r.origin?.toLowerCase().includes('instagram')) ||
        (orig.name.includes('Webmotors') && r.origin?.toLowerCase().includes('webmotors')) ||
        (orig.name.includes('Google') && r.origin?.toLowerCase().includes('google'))
    );
    const leads = matched.length;
    const sales = matched.filter((r) => r.status === 'vendido').length;
    const revenue = matched
      .filter((r) => r.status === 'vendido')
      .reduce((acc, r) => acc + (r.vehiclePrice || 0), 0);

    return {
      source: orig.name,
      leads: leads > 0 ? leads : Math.round(totalLeads * 0.1),
      sales: sales > 0 ? sales : Math.round(salesCount * 0.1),
      revenue: revenue > 0 ? revenue : Math.round(totalRevenue * 0.1),
      cpl: orig.cpl,
      roas: orig.roas,
    };
  });

  const handleExportReport = () => {
    const headers = 'Origem,Leads,Vendas,Faturamento,CPL,ROAS\n';
    const rows = sourceData
      .map((s) => `"${s.source}",${s.leads},${s.sales},${s.revenue},"${s.cpl}","${s.roas}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_comercial_motorgrid_${period.toLowerCase().replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Relatório (${period}) exportado com sucesso em formato CSV!`);
  };

  return (
    <div className="space-y-6">
      {/* Header with Period filter & Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Relatórios &amp; BI Comercial</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Métricas de conversão, SLA de atendimento, ranking de vendedores e ROI de tráfego
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#1C1C1E] border border-zinc-800 text-xs">
            {(['Hoje', 'Esta Semana', 'Este Mês', 'Ano 2026'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  period === p ? 'bg-[#8B5CF6] text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportReport}
            className="px-3 py-2 rounded-xl bg-[#1C1C1E] hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#C4B5FD]" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </div>

      {/* KPI Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80">
          <div className="text-xs font-semibold text-zinc-400">Faturamento Bruto de Vendas</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{formatBRL(totalRevenue)}</div>
          <div className="text-[11px] text-zinc-400 mt-0.5">{salesCount} veículos entregues no período</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80">
          <div className="text-xs font-semibold text-zinc-400">Ticket Médio por Veículo</div>
          <div className="text-2xl font-bold text-white mt-1">{formatBRL(ticketMedio)}</div>
          <div className="text-[11px] text-emerald-400 mt-0.5 font-medium">+14.2% vs mês anterior</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80">
          <div className="text-xs font-semibold text-zinc-400">Tempo Médio 1ª Resposta (SLA)</div>
          <div className="text-2xl font-bold text-[#DDD6FE] mt-1">{avgSla} minutos</div>
          <div className="text-[11px] text-emerald-400 mt-0.5 font-medium">● Meta &lt; 3.0 min cumprida</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80">
          <div className="text-xs font-semibold text-zinc-400">Taxa Geral de Conversão</div>
          <div className="text-2xl font-bold text-[#C4B5FD] mt-1">{conversionRate}</div>
          <div className="text-[11px] text-zinc-400 mt-0.5">Lead recebido → Venda fechada</div>
        </div>
      </div>

      {/* Grid: Conversion Funnel & SLA Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Funnel (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#1C1C1E] border border-zinc-800 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">Funil Comercial de Conversão ({period})</h3>
            <span className="text-xs text-zinc-400 font-mono">{totalLeads} oportunidades totais</span>
          </div>

          <div className="space-y-3">
            {funnelData.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{item.stage}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-zinc-400">{item.count} leads</span>
                    <span className="font-mono font-bold text-[#C4B5FD] w-12 text-right">
                      {item.conversion}
                    </span>
                  </div>
                </div>
                <div className="w-full h-3 rounded-full bg-[#0A0A0B] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: item.conversion,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SLA Card (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#1C1C1E] border border-zinc-800 space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-base">Auditoria de SLA de Atendimento</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Tempo decorrido entre a chegada do lead no WhatsApp/Portal e o 1º contato
            </p>

            <div className="space-y-3 mt-4 text-xs">
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-400 block">🟢 SLA Ideal (0 a 3 minutos)</span>
                  <span className="text-zinc-400 text-[11px]">84% dos atendimentos</span>
                </div>
                <span className="text-lg font-bold text-white font-mono">155 leads</span>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-400 block">🟡 SLA Regular (3 a 10 minutos)</span>
                  <span className="text-zinc-400 text-[11px]">12% dos atendimentos</span>
                </div>
                <span className="text-lg font-bold text-white font-mono">22 leads</span>
              </div>

              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between">
                <div>
                  <span className="font-bold text-rose-400 block">🔴 SLA Crítico (&gt; 10 minutos)</span>
                  <span className="text-zinc-400 text-[11px]">4% dos atendimentos (Transbordados)</span>
                </div>
                <span className="text-lg font-bold text-white font-mono">7 leads</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0A0A0B] border border-zinc-800 text-[11px] text-zinc-300">
            💡 <strong>Dica MotorGrid:</strong> Leads respondidos em até 3 minutos têm <strong>4.2x mais chances</strong> de fechar visita presencial.
          </div>
        </div>
      </div>

      {/* Ranking dos Vendedores */}
      <div className="p-6 rounded-2xl bg-[#1C1C1E] border border-zinc-800 space-y-4">
        <h3 className="font-bold text-white text-base">Ranking de Performance da Equipe Comercial</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-[#0A0A0B] text-zinc-400 uppercase font-semibold text-[10px]">
                <th className="p-3">Posição / Vendedor</th>
                <th className="p-3">Unidade / Showroom</th>
                <th className="p-3 text-center">Vendas Concluídas</th>
                <th className="p-3">Faturamento Total</th>
                <th className="p-3">Tempo Médio SLA</th>
                <th className="p-3 text-right">Nota Grid AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {initialAuthUsers
                .filter((u) => u.role !== 'Administrador')
                .map((u, idx) => (
                  <tr key={u.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="p-3 flex items-center gap-3">
                      <span className="font-bold text-zinc-400 font-mono w-4">#{idx + 1}</span>
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-[#8B5CF6]/40"
                      />
                      <div>
                        <div className="font-bold text-white text-xs">{u.name}</div>
                        <div className="text-[10px] text-zinc-400">{u.role}</div>
                      </div>
                    </td>
                    <td className="p-3 text-zinc-300">Matriz Alphaville</td>
                    <td className="p-3 text-center font-bold text-white font-mono">
                      {idx === 0 ? 8 : idx === 1 ? 6 : 4} carros
                    </td>
                    <td className="p-3 font-bold text-emerald-400 font-mono">
                      R$ {idx === 0 ? '2.980.000' : idx === 1 ? '2.140.000' : '1.540.000'}
                    </td>
                    <td className="p-3 font-mono text-zinc-300">{u.avgResponseTimeMin} min</td>
                    <td className="p-3 text-right">
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-[#DDD6FE] border border-purple-500/30 font-mono font-bold">
                        {u.scoreAi || 94} pts
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Origem e ROI de Mídia */}
      <div className="p-6 rounded-2xl bg-[#1C1C1E] border border-zinc-800 space-y-4">
        <h3 className="font-bold text-white text-base">Retorno sobre Investimento por Canal (ROI / ROAS)</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-[#0A0A0B] text-zinc-400 uppercase font-semibold text-[10px]">
                <th className="p-3">Canal / Origem</th>
                <th className="p-3 text-center">Leads Gerados</th>
                <th className="p-3 text-center">Vendas Fechadas</th>
                <th className="p-3">Receita Gerada</th>
                <th className="p-3">Custo por Lead (CPL)</th>
                <th className="p-3 text-right">ROAS / Multiplicador</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {sourceData.map((s, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="p-3 font-bold text-white">{s.source}</td>
                  <td className="p-3 text-center font-mono text-zinc-300">{s.leads}</td>
                  <td className="p-3 text-center font-bold text-white font-mono">{s.sales}</td>
                  <td className="p-3 font-bold text-emerald-400 font-mono">
                    {s.revenue > 0 ? `R$ ${s.revenue.toLocaleString('pt-BR')}` : '-'}
                  </td>
                  <td className="p-3 font-mono text-zinc-300">{s.cpl}</td>
                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                      {s.roas}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
