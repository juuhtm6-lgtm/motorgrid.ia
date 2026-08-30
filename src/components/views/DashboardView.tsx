import React, { useState, useMemo } from 'react';
import { initialExecutiveRecords } from '../../data/executiveRecordsData';
import {
  DashboardFilters,
  ExecutiveLeadRecord,
  ExecutiveAlert,
} from '../../types/dashboard';
import {
  filterExecutiveRecords,
  computeExecutiveKpis,
  computeOperationalStatusCounts,
  computeCommercialFunnel,
  computeTimeSeries,
  computeOriginMetrics,
  computeTeamPerformance,
  computeLossReasons,
  computeVehiclePerformance,
  computeAttendancePerformance,
  computeStoreGoalAndProjection,
  computePresentialVsOnline,
  computeManagerAlerts,
  generateAiInsights,
} from '../../services/executiveDashboardEngine';

import { ExecutiveHeader } from '../dashboard/ExecutiveHeader';
import { GlobalFiltersBar } from '../dashboard/GlobalFiltersBar';
import { ExecutiveKpisRow } from '../dashboard/ExecutiveKpisRow';
import { CommercialOperationRow } from '../dashboard/CommercialOperationRow';
import { MonthlyTargetAndProjection } from '../dashboard/MonthlyTargetAndProjection';
import { CommercialFunnel } from '../dashboard/CommercialFunnel';
import { TimeSeriesCharts } from '../dashboard/TimeSeriesCharts';
import { ServicePerformanceSection } from '../dashboard/ServicePerformanceSection';
import { LeadsByOriginSection } from '../dashboard/LeadsByOriginSection';
import { TopSellersRanking } from '../dashboard/TopSellersRanking';
import { TeamPerformanceTable } from '../dashboard/TeamPerformanceTable';
import { ConversionAndLossSection } from '../dashboard/ConversionAndLossSection';
import { PresentialVsOnlineSection } from '../dashboard/PresentialVsOnlineSection';
import { LeadsDistributionSection } from '../dashboard/LeadsDistributionSection';
import { VehiclePerformanceSection } from '../dashboard/VehiclePerformanceSection';
import { RecentLeadsSection } from '../dashboard/RecentLeadsSection';
import { ManagerAlertsSection } from '../dashboard/ManagerAlertsSection';
import { AiInsightsSection } from '../dashboard/AiInsightsSection';
import { DrillDownModal } from '../dashboard/DrillDownModal';
import { ExportModal } from '../dashboard/ExportModal';

interface DashboardViewProps {
  metrics?: any;
  customers?: any[];
  invoices?: any[];
  deals?: any[];
  onOpenCustomerDetail?: (customer: any) => void;
  onOpenAiCopilot?: () => void;
  onNavigateTab?: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenCustomerDetail,
  onNavigateTab,
}) => {
  // Estado de Dados do Sistema
  const [allRecords, setAllRecords] = useState<ExecutiveLeadRecord[]>(
    initialExecutiveRecords
  );

  // Estado de Filtros Globais
  const [filters, setFilters] = useState<DashboardFilters>({
    period: 'mes_atual',
    store: 'all',
    team: 'all',
    seller: 'all',
    origin: 'all',
    channelType: 'all',
  });

  // Estado de Granularidade dos Gráficos Temporais
  const [timeGranularity, setTimeGranularity] = useState<'diario' | 'semanal' | 'mensal'>(
    'diario'
  );

  // Estados dos Modais
  const [drillDownState, setDrillDownState] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    records: ExecutiveLeadRecord[];
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    records: [],
  });

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // 1. Filtragem dos Dados em Tempo Real (atual e período anterior para comparativo)
  const { current: filteredRecords, previous: previousRecords } = useMemo(() => {
    return filterExecutiveRecords(allRecords, filters);
  }, [allRecords, filters]);

  // 2. Cálculos dos Indicadores Executivos
  const kpis = useMemo(() => {
    return computeExecutiveKpis(filteredRecords, previousRecords);
  }, [filteredRecords, previousRecords]);

  const commercialOperation = useMemo(() => {
    return computeOperationalStatusCounts(filteredRecords);
  }, [filteredRecords]);

  const monthlyGoal = useMemo(() => {
    return computeStoreGoalAndProjection(filteredRecords);
  }, [filteredRecords]);

  const funnelResult = useMemo(() => {
    return computeCommercialFunnel(filteredRecords);
  }, [filteredRecords]);

  const timeSeriesData = useMemo(() => {
    return computeTimeSeries(filteredRecords, timeGranularity);
  }, [filteredRecords, timeGranularity]);

  const attendancePerformance = useMemo(() => {
    return computeAttendancePerformance(filteredRecords);
  }, [filteredRecords]);

  const originMetrics = useMemo(() => {
    return computeOriginMetrics(filteredRecords);
  }, [filteredRecords]);

  const sellerMetrics = useMemo(() => {
    return computeTeamPerformance(filteredRecords);
  }, [filteredRecords]);

  const lossReasons = useMemo(() => {
    return computeLossReasons(filteredRecords);
  }, [filteredRecords]);

  const presentialVsOnline = useMemo(() => {
    return computePresentialVsOnline(filteredRecords);
  }, [filteredRecords]);

  const vehicleMetrics = useMemo(() => {
    return computeVehiclePerformance(filteredRecords);
  }, [filteredRecords]);

  const alerts = useMemo(() => {
    return computeManagerAlerts(filteredRecords);
  }, [filteredRecords]);

  const aiInsights = useMemo(() => {
    return generateAiInsights(
      kpis,
      originMetrics,
      sellerMetrics,
      funnelResult,
      lossReasons,
      attendancePerformance
    );
  }, [
    kpis,
    originMetrics,
    sellerMetrics,
    funnelResult,
    lossReasons,
    attendancePerformance,
  ]);

  // Handlers de Drill-Down
  const handleDrillDownKpi = (kpiKey: string) => {
    let title = 'Detalhamento de Leads';
    let subtitle = 'Registros correspondentes';
    let records = filteredRecords;

    if (kpiKey === 'leads') {
      title = 'Todos os Leads Recebidos';
      subtitle = 'Volume total de contatos no período filtrado';
      records = filteredRecords;
    } else if (kpiKey === 'sales') {
      title = 'Vendas Fechadas (Ganhos)';
      subtitle = 'Veículos comercializados no período';
      records = filteredRecords.filter((r) => r.status === 'ganho');
    } else if (kpiKey === 'revenue') {
      title = 'Faturamento Gerado';
      subtitle = 'Leads que geraram receita de venda';
      records = filteredRecords.filter((r) => r.status === 'ganho');
    } else if (kpiKey === 'conversion') {
      title = 'Leads Convertidos em Venda';
      subtitle = 'Relação de sucesso comercial';
      records = filteredRecords.filter((r) => r.status === 'ganho');
    } else if (kpiKey === 'pipeline') {
      title = 'Oportunidades em Negociação';
      subtitle = 'Pipeline ativo com valor potencial';
      records = filteredRecords.filter(
        (r) => r.status !== 'ganho' && r.status !== 'perdido'
      );
    } else if (kpiKey === 'sla') {
      title = 'Performance de Primeiro Atendimento';
      subtitle = 'Todos os contatos avaliados pelo SLA de resposta';
      records = filteredRecords;
    }

    setDrillDownState({ isOpen: true, title, subtitle, records });
  };

  const handleDrillDownOperationStatus = (statusKey: string) => {
    let records = filteredRecords;
    if (statusKey === 'open') {
      records = filteredRecords.filter(
        (r) => r.status !== 'ganho' && r.status !== 'perdido'
      );
    } else if (statusKey === 'qualified') {
      records = filteredRecords.filter(
        (r) => r.isQualified || r.status === 'qualificado'
      );
    } else if (statusKey === 'scheduled') {
      records = filteredRecords.filter(
        (r) => r.isScheduled || r.status === 'agendado'
      );
    } else if (statusKey === 'visited') {
      records = filteredRecords.filter(
        (r) => r.isVisited || r.status === 'visitou'
      );
    } else if (statusKey === 'proposals') {
      records = filteredRecords.filter(
        (r) => r.isProposal || r.status === 'proposta'
      );
    } else if (statusKey === 'lost') {
      records = filteredRecords.filter((r) => r.status === 'perdido');
    }

    const titles: Record<string, string> = {
      open: 'Leads em Aberto / Em Andamento',
      qualified: 'Leads Qualificados pelo SDR',
      scheduled: 'Test Drives & Visitas Agendadas',
      visited: 'Visitas Realizadas no Showroom',
      proposals: 'Propostas Comerciais em Análise',
      lost: 'Leads Perdidos / Arquivados',
    };

    setDrillDownState({
      isOpen: true,
      title: titles[statusKey] || 'Leads por Operação',
      subtitle: `Exibindo ${records.length} registros`,
      records,
    });
  };

  const handleDrillDownFunnel = (stageKey: string) => {
    let records = filteredRecords;
    if (stageKey === 'leads') {
      records = filteredRecords;
    } else if (stageKey === 'atendidos') {
      records = filteredRecords.filter((r) => r.isAttended);
    } else if (stageKey === 'qualificados') {
      records = filteredRecords.filter((r) => r.isQualified);
    } else if (stageKey === 'agendados') {
      records = filteredRecords.filter((r) => r.isScheduled);
    } else if (stageKey === 'visitaram') {
      records = filteredRecords.filter((r) => r.isVisited);
    } else if (stageKey === 'proposta') {
      records = filteredRecords.filter((r) => r.isProposal);
    } else if (stageKey === 'vendidos') {
      records = filteredRecords.filter((r) => r.status === 'ganho');
    }

    const labels: Record<string, string> = {
      leads: '1. Todos os Leads',
      atendidos: '2. Leads Atendidos',
      qualificados: '3. Leads Qualificados',
      agendados: '4. Leads com Agendamento',
      visitaram: '5. Leads que Visitaram a Loja',
      proposta: '6. Leads com Proposta Enviada',
      vendidos: '7. Veículos Vendidos',
    };

    setDrillDownState({
      isOpen: true,
      title: `Etapa do Funil: ${labels[stageKey] || stageKey}`,
      subtitle: `${records.length} contatos nesta etapa`,
      records,
    });
  };

  const handleDrillDownOrigin = (origin: string) => {
    const records = filteredRecords.filter(
      (r) => r.origin.toLowerCase() === origin.toLowerCase()
    );
    setDrillDownState({
      isOpen: true,
      title: `Origem: ${origin}`,
      subtitle: `Todos os ${records.length} leads recebidos através do canal ${origin}`,
      records,
    });
  };

  const handleDrillDownSeller = (sellerName: string) => {
    const records = filteredRecords.filter((r) => r.assignedTo === sellerName);
    setDrillDownState({
      isOpen: true,
      title: `Vendedor: ${sellerName}`,
      subtitle: `Carteira de ${records.length} leads atribuídos a ${sellerName}`,
      records,
    });
  };

  const handleDrillDownLossReason = (reason: string) => {
    const records = filteredRecords.filter(
      (r) => r.status === 'perdido' && r.lossReason === reason
    );
    setDrillDownState({
      isOpen: true,
      title: `Motivo de Perda: ${reason}`,
      subtitle: `${records.length} oportunidades perdidas pelo motivo "${reason}"`,
      records,
    });
  };

  const handleDrillDownChannel = (channel: 'online' | 'presencial') => {
    const records = filteredRecords.filter((r) => r.channelType === channel);
    setDrillDownState({
      isOpen: true,
      title: `Canal: ${channel === 'online' ? 'Atendimento Digital (Online)' : 'Showroom Presencial'}`,
      subtitle: `${records.length} contatos originados neste canal`,
      records,
    });
  };

  const handleDrillDownVehicle = (vehicleName: string) => {
    const records = filteredRecords.filter((r) => r.vehicleName === vehicleName);
    setDrillDownState({
      isOpen: true,
      title: `Veículo: ${vehicleName}`,
      subtitle: `${records.length} interessados cadastrados neste modelo`,
      records,
    });
  };

  const handleAlertClick = (alert: ExecutiveAlert) => {
    let records = filteredRecords;
    if (alert.filterKey === 'unattended') {
      records = filteredRecords.filter((r) => !r.isAttended);
    } else if (alert.filterKey === 'idle') {
      records = filteredRecords.filter(
        (r) =>
          r.status !== 'ganho' &&
          r.status !== 'perdido' &&
          r.lastInteractionMinutesAgo > 120
      );
    } else if (alert.filterKey === 'unconfirmed') {
      records = filteredRecords.filter(
        (r) => r.isScheduled && !r.appointmentConfirmed
      );
    } else if (alert.filterKey === 'proposals') {
      records = filteredRecords.filter(
        (r) =>
          r.isProposal &&
          r.status === 'proposta' &&
          r.lastInteractionMinutesAgo > 90
      );
    } else if (alert.filterKey === 'stuck') {
      records = filteredRecords.filter(
        (r) =>
          r.status !== 'ganho' &&
          r.status !== 'perdido' &&
          r.daysInFunnel >= 3
      );
    }

    setDrillDownState({
      isOpen: true,
      title: alert.title,
      subtitle: alert.description,
      records,
    });
  };

  const handleSelectLeadRecord = (lead: ExecutiveLeadRecord) => {
    setDrillDownState({
      isOpen: true,
      title: `Lead: ${lead.contactName}`,
      subtitle: `${lead.vehicleName} • Vendedor: ${lead.assignedTo}`,
      records: [lead],
    });
  };

  const handleCreateNewLead = () => {
    if (onNavigateTab) {
      onNavigateTab('atendimento');
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div id="executive-automotive-dashboard" className="space-y-6 pb-16">
      {/* 1. Header Executivo */}
      <ExecutiveHeader
        filters={filters}
        onOpenNewLead={handleCreateNewLead}
        onOpenExport={() => setIsExportModalOpen(true)}
        onPrint={handlePrintPdf}
      />

      {/* 2. Barra de Filtros Globais */}
      <GlobalFiltersBar
        filters={filters}
        onFilterChange={setFilters}
        onResetFilters={() => {
          setFilters({
            period: 'mes_atual',
            store: 'all',
            team: 'all',
            seller: 'all',
            origin: 'all',
            channelType: 'all',
            status: 'all',
          });
        }}
      />

      {/* 3. Cards de Resumo Executivo (KPIs Principais) */}
      <ExecutiveKpisRow kpis={kpis} onDrillDown={handleDrillDownKpi} />

      {/* 4. Cards de Operação Comercial */}
      <CommercialOperationRow
        counts={commercialOperation}
        onDrillDown={handleDrillDownOperationStatus}
      />

      {/* 5. Meta do Mês e Projeção */}
      <MonthlyTargetAndProjection
        data={monthlyGoal}
      />

      {/* 6. Funil Comercial Completo */}
      <CommercialFunnel
        stages={funnelResult.stages}
        overallLeadToSaleConversion={funnelResult.overallLeadToSaleConversion}
        onDrillDown={handleDrillDownFunnel}
      />

      {/* 7 & 8. Gráficos de Evolução Temporal (Leads + Vendas) */}
      <TimeSeriesCharts
        data={timeSeriesData}
        granularity={timeGranularity}
        onGranularityChange={setTimeGranularity}
      />

      {/* 17. Performance de Atendimento & SLA */}
      <ServicePerformanceSection
        data={attendancePerformance}
        onDrillDownUnattended={() =>
          handleDrillDownKpi('sla')
        }
      />

      {/* 9. Leads e Vendas por Origem */}
      <LeadsByOriginSection
        origins={originMetrics}
        onDrillDownOrigin={handleDrillDownOrigin}
      />

      {/* 11. Top Vendedores do Período */}
      <TopSellersRanking
        sellers={sellerMetrics}
        onSelectSeller={handleDrillDownSeller}
      />

      {/* 10. Performance Individual da Equipe (Tabela com ordenação) */}
      <TeamPerformanceTable
        sellers={sellerMetrics}
        onSelectSeller={handleDrillDownSeller}
      />

      {/* 12, 13 & 14. Conversão por Vendedor + Ganhos vs Perdidos + Motivos de Perda */}
      <ConversionAndLossSection
        wonCount={kpis.totalSales}
        lostCount={commercialOperation.lost}
        openCount={commercialOperation.open}
        lossReasons={lossReasons}
        sellers={sellerMetrics}
        onDrillDownLossReason={handleDrillDownLossReason}
      />

      {/* 16. Comparativo Presencial vs Online */}
      <PresentialVsOnlineSection
        data={presentialVsOnline}
        onSelectChannel={handleDrillDownChannel}
      />

      {/* 15. Distribuição de Leads por Vendedor */}
      <LeadsDistributionSection
        sellers={sellerMetrics}
        onSelectSeller={handleDrillDownSeller}
      />

      {/* 23 & 24. Veículos com Mais Oportunidades + Atenção no Estoque */}
      <VehiclePerformanceSection
        topVehicles={vehicleMetrics.topVehicles}
        attentionVehicles={vehicleMetrics.attentionVehicles}
        onSelectVehicle={handleDrillDownVehicle}
      />

      {/* 18. Leads Recentes da Operação */}
      <RecentLeadsSection
        leads={filteredRecords}
        onSelectLead={handleSelectLeadRecord}
        onViewAllLeads={() => handleDrillDownKpi('leads')}
      />

      {/* 19. Atenção Necessária • Alertas da Operação */}
      <ManagerAlertsSection alerts={alerts} onAlertClick={handleAlertClick} />

      {/* 20. Grid AI • Insights Executivos */}
      <AiInsightsSection insights={aiInsights} />

      {/* Modais Globais do Dashboard */}
      <DrillDownModal
        isOpen={drillDownState.isOpen}
        title={drillDownState.title}
        subtitle={drillDownState.subtitle}
        records={drillDownState.records}
        onClose={() =>
          setDrillDownState({
            isOpen: false,
            title: '',
            subtitle: '',
            records: [],
          })
        }
        onOpenLeadDetail={(lead) => {
          if (onOpenCustomerDetail) {
            onOpenCustomerDetail({
              id: lead.id,
              name: lead.contactName,
              phone: lead.contactPhone,
              email: lead.contactEmail,
              status: lead.status,
              assignedTo: lead.assignedTo,
              vehicleName: lead.vehicleName,
              value: lead.vehiclePrice,
            });
          }
        }}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        filters={filters}
        kpis={kpis}
        records={filteredRecords}
        onPrint={handlePrintPdf}
      />
    </div>
  );
};
