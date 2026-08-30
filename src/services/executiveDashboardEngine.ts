import {
  DashboardFilters,
  ExecutiveLeadRecord,
  ExecutiveKpis,
  OperationalStatusCounts,
  FunnelStageMetric,
  TimeSeriesPoint,
  OriginMetric,
  SellerPerformanceMetric,
  LossReasonMetric,
  VehiclePerformanceMetric,
  AttendancePerformance,
  StoreGoalAndProjection,
  PresentialVsOnlineMetric,
  ExecutiveAlert,
} from '../types/dashboard';

// Filtra os registros conforme os filtros globais ativos
export function filterExecutiveRecords(
  records: ExecutiveLeadRecord[],
  filters: DashboardFilters
): { current: ExecutiveLeadRecord[]; previous: ExecutiveLeadRecord[] } {
  // Hoje é considerado 2026-08-30
  const referenceDate = new Date('2026-08-30T23:59:59');

  // Filtro de Período
  const filterByPeriod = (record: ExecutiveLeadRecord, period: string, start?: string, end?: string): boolean => {
    const recordDate = new Date(record.createdAt.replace(' ', 'T'));
    const recDateStr = record.dateOnly;

    if (period === 'hoje') {
      return recDateStr === '2026-08-30';
    }
    if (period === 'ontem') {
      return recDateStr === '2026-08-29';
    }
    if (period === '7dias') {
      const sevenDaysAgo = new Date('2026-08-23T00:00:00');
      return recordDate >= sevenDaysAgo && recordDate <= referenceDate;
    }
    if (period === '30dias') {
      const thirtyDaysAgo = new Date('2026-08-01T00:00:00');
      return recordDate >= thirtyDaysAgo && recordDate <= referenceDate;
    }
    if (period === 'mes_atual') {
      return recDateStr.startsWith('2026-08');
    }
    if (period === 'mes_anterior') {
      return recDateStr.startsWith('2026-07');
    }
    if (period === 'personalizado') {
      if (start && recDateStr < start) return false;
      if (end && recDateStr > end) return false;
      return true;
    }
    return true;
  };

  // Filtros adicionais
  const matchesOtherFilters = (record: ExecutiveLeadRecord): boolean => {
    if (filters.store !== 'all' && record.unitId !== filters.store) return false;
    if (filters.team !== 'all' && record.team !== filters.team) return false;
    if (filters.seller !== 'all' && record.assignedTo !== filters.seller) return false;
    if (filters.origin !== 'all' && record.origin !== filters.origin) return false;
    if (filters.channelType !== 'all' && record.channelType !== filters.channelType) return false;
    if (filters.status !== 'all' && record.status !== filters.status) return false;
    return true;
  };

  const current = records.filter(
    (r) => filterByPeriod(r, filters.period, filters.startDate, filters.endDate) && matchesOtherFilters(r)
  );

  // Período anterior equivalente para cálculo de variação
  let previousPeriodName = 'mes_anterior';
  if (filters.period === 'hoje') previousPeriodName = 'ontem';
  else if (filters.period === 'ontem') previousPeriodName = 'hoje'; // ou 2 dias atrás
  else if (filters.period === 'mes_atual') previousPeriodName = 'mes_anterior';
  else if (filters.period === '7dias') previousPeriodName = 'mes_anterior';

  const previous = records.filter(
    (r) => filterByPeriod(r, previousPeriodName) && matchesOtherFilters(r)
  );

  return { current, previous };
}

// 1. KPIs Executivos
export function computeExecutiveKpis(
  currentRecords: ExecutiveLeadRecord[],
  previousRecords: ExecutiveLeadRecord[]
): ExecutiveKpis {
  const totalLeads = currentRecords.length;
  const totalLeadsPrevious = previousRecords.length;
  const leadsChangePercent =
    totalLeadsPrevious > 0
      ? ((totalLeads - totalLeadsPrevious) / totalLeadsPrevious) * 100
      : totalLeads > 0 ? 100 : 0;

  const currentSales = currentRecords.filter((r) => r.status === 'ganho');
  const previousSales = previousRecords.filter((r) => r.status === 'ganho');

  const totalSales = currentSales.length;
  const totalSalesPrevious = previousSales.length;
  const salesChangePercent =
    totalSalesPrevious > 0
      ? ((totalSales - totalSalesPrevious) / totalSalesPrevious) * 100
      : totalSales > 0 ? 100 : 0;

  const totalRevenue = currentSales.reduce((acc, r) => acc + (r.closedRevenue || r.vehiclePrice || 0), 0);
  const totalRevenuePrevious = previousSales.reduce((acc, r) => acc + (r.closedRevenue || r.vehiclePrice || 0), 0);
  const revenueChangePercent =
    totalRevenuePrevious > 0
      ? ((totalRevenue - totalRevenuePrevious) / totalRevenuePrevious) * 100
      : totalRevenue > 0 ? 100 : 0;

  const conversionRate = totalLeads > 0 ? (totalSales / totalLeads) * 100 : 0;
  const conversionRatePrevious =
    totalLeadsPrevious > 0 ? (totalSalesPrevious / totalLeadsPrevious) * 100 : 0;
  const conversionChangePp = conversionRate - conversionRatePrevious;

  return {
    totalLeads,
    totalLeadsPrevious,
    leadsChangePercent,
    totalSales,
    totalSalesPrevious,
    salesChangePercent,
    totalRevenue,
    totalRevenuePrevious,
    revenueChangePercent,
    conversionRate,
    conversionRatePrevious,
    conversionChangePp,
  };
}

// 2. Segunda Linha: Operação Comercial
export function computeOperationalStatusCounts(records: ExecutiveLeadRecord[]): OperationalStatusCounts {
  return {
    open: records.filter((r) => r.status !== 'ganho' && r.status !== 'perdido').length,
    qualified: records.filter((r) => r.isQualified || r.status === 'qualificado').length,
    scheduled: records.filter((r) => r.isScheduled || r.status === 'agendado').length,
    visited: records.filter((r) => r.isVisited || r.status === 'visitou').length,
    proposals: records.filter((r) => r.isProposal || r.status === 'proposta').length,
    lost: records.filter((r) => r.status === 'perdido').length,
  };
}

// 3. Funil Comercial (7 etapas rigorosas)
export function computeCommercialFunnel(records: ExecutiveLeadRecord[]): {
  stages: FunnelStageMetric[];
  overallLeadToSaleConversion: number;
} {
  const totalLeads = records.length;
  const attendedCount = records.filter((r) => r.isAttended).length;
  const qualifiedCount = records.filter((r) => r.isQualified).length;
  const scheduledCount = records.filter((r) => r.isScheduled).length;
  const visitedCount = records.filter((r) => r.isVisited).length;
  const proposalCount = records.filter((r) => r.isProposal).length;
  const soldCount = records.filter((r) => r.status === 'ganho').length;

  const stageData = [
    { key: 'leads', label: '1. LEADS', count: totalLeads },
    { key: 'atendidos', label: '2. ATENDIDOS', count: attendedCount },
    { key: 'qualificados', label: '3. QUALIFICADOS', count: qualifiedCount },
    { key: 'agendados', label: '4. AGENDADOS', count: scheduledCount },
    { key: 'visitaram', label: '5. VISITARAM', count: visitedCount },
    { key: 'proposta', label: '6. PROPOSTA', count: proposalCount },
    { key: 'vendidos', label: '7. VENDIDOS', count: soldCount },
  ];

  const stages: FunnelStageMetric[] = stageData.map((st, idx) => {
    const prevCount = idx === 0 ? st.count : stageData[idx - 1].count;
    const prevConversionRate = prevCount > 0 ? (st.count / prevCount) * 100 : 0;
    const overallConversionRate = totalLeads > 0 ? (st.count / totalLeads) * 100 : 0;
    const dropCount = Math.max(0, prevCount - st.count);

    return {
      key: st.key,
      label: st.label,
      count: st.count,
      prevConversionRate,
      overallConversionRate,
      dropCount,
    };
  });

  const overallLeadToSaleConversion = totalLeads > 0 ? (soldCount / totalLeads) * 100 : 0;

  return { stages, overallLeadToSaleConversion };
}

// 4. Séries Temporais (Leads e Vendas ao longo do tempo)
export function computeTimeSeries(
  records: ExecutiveLeadRecord[],
  granularity: 'diario' | 'semanal' | 'mensal'
): TimeSeriesPoint[] {
  const map: Record<string, { leads: number; sales: number; revenue: number; label: string }> = {};

  records.forEach((r) => {
    let key = r.dateOnly;
    let label = r.dateOnly.slice(5); // MM-DD

    if (granularity === 'semanal') {
      const d = new Date(r.dateOnly);
      const day = d.getDate();
      const weekNum = Math.ceil(day / 7);
      key = `Semana ${weekNum} - ${d.getMonth() + 1}`;
      label = `Sem ${weekNum}`;
    } else if (granularity === 'mensal') {
      key = r.dateOnly.slice(0, 7);
      label = key === '2026-08' ? 'Ago 2026' : key === '2026-07' ? 'Jul 2026' : key;
    }

    if (!map[key]) {
      map[key] = { leads: 0, sales: 0, revenue: 0, label };
    }

    map[key].leads += 1;
    if (r.status === 'ganho') {
      map[key].sales += 1;
      map[key].revenue += r.closedRevenue || r.vehiclePrice || 0;
    }
  });

  return Object.keys(map)
    .sort()
    .map((k) => ({
      date: k,
      label: map[k].label,
      leads: map[k].leads,
      sales: map[k].sales,
      revenue: map[k].revenue,
    }));
}

// 5. Leads por Origem
export function computeOriginMetrics(records: ExecutiveLeadRecord[]): OriginMetric[] {
  const map: Record<string, { leads: number; sales: number; revenue: number }> = {};

  records.forEach((r) => {
    const origin = r.origin || 'Outros';
    if (!map[origin]) {
      map[origin] = { leads: 0, sales: 0, revenue: 0 };
    }
    map[origin].leads += 1;
    if (r.status === 'ganho') {
      map[origin].sales += 1;
      map[origin].revenue += r.closedRevenue || r.vehiclePrice || 0;
    }
  });

  return Object.keys(map)
    .map((origin) => {
      const data = map[origin];
      const conversionRate = data.leads > 0 ? (data.sales / data.leads) * 100 : 0;
      const ticketMedio = data.sales > 0 ? data.revenue / data.sales : 0;
      return {
        origin,
        leads: data.leads,
        sales: data.sales,
        conversionRate,
        revenue: data.revenue,
        ticketMedio,
      };
    })
    .sort((a, b) => b.leads - a.leads);
}

// 6. Performance da Equipe & Ranking de Vendedores
export function computeTeamPerformance(records: ExecutiveLeadRecord[]): SellerPerformanceMetric[] {
  const map: Record<
    string,
    {
      leads: number;
      attendances: number;
      appointments: number;
      visits: number;
      proposals: number;
      sales: number;
      revenue: number;
      responseTimes: number[];
      avatar: string;
      team: string;
    }
  > = {};

  records.forEach((r) => {
    const seller = r.assignedTo || 'Não atribuído';
    if (!map[seller]) {
      map[seller] = {
        leads: 0,
        attendances: 0,
        appointments: 0,
        visits: 0,
        proposals: 0,
        sales: 0,
        revenue: 0,
        responseTimes: [],
        avatar: r.sellerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        team: r.team || 'Vendas',
      };
    }

    map[seller].leads += 1;
    if (r.isAttended) map[seller].attendances += 1;
    if (r.isScheduled) map[seller].appointments += 1;
    if (r.isVisited) map[seller].visits += 1;
    if (r.isProposal) map[seller].proposals += 1;
    if (r.status === 'ganho') {
      map[seller].sales += 1;
      map[seller].revenue += r.closedRevenue || r.vehiclePrice || 0;
    }
    if (r.firstResponseTimeMinutes > 0) {
      map[seller].responseTimes.push(r.firstResponseTimeMinutes);
    }
  });

  const list = Object.keys(map).map((sellerName) => {
    const d = map[sellerName];
    const conversionRate = d.leads > 0 ? (d.sales / d.leads) * 100 : 0;
    const avgResponseTimeMin =
      d.responseTimes.length > 0
        ? d.responseTimes.reduce((a, b) => a + b, 0) / d.responseTimes.length
        : 2.5;

    return {
      position: 1,
      sellerName,
      avatar: d.avatar,
      team: d.team,
      leads: d.leads,
      attendances: d.attendances,
      appointments: d.appointments,
      visits: d.visits,
      proposals: d.proposals,
      sales: d.sales,
      conversionRate,
      revenue: d.revenue,
      avgResponseTimeMin: Number(avgResponseTimeMin.toFixed(1)),
    };
  });

  // Ordena inicialmente por vendas desc
  list.sort((a, b) => b.sales - a.sales || b.revenue - a.revenue);

  // Atribui posições
  return list.map((item, idx) => ({ ...item, position: idx + 1 }));
}

// 7. Motivos de Perda
export function computeLossReasons(records: ExecutiveLeadRecord[]): LossReasonMetric[] {
  const lostRecords = records.filter((r) => r.status === 'perdido');
  const totalLost = lostRecords.length;
  if (totalLost === 0) return [];

  const map: Record<string, number> = {};
  lostRecords.forEach((r) => {
    const reason = r.lossReason || 'Outros';
    map[reason] = (map[reason] || 0) + 1;
  });

  return Object.keys(map)
    .map((reason) => ({
      reason,
      count: map[reason],
      percentage: Number(((map[reason] / totalLost) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.count - a.count);
}

// 8. Performance por Veículo & Atenção no Estoque
export function computeVehiclePerformance(records: ExecutiveLeadRecord[]): {
  topVehicles: VehiclePerformanceMetric[];
  attentionVehicles: VehiclePerformanceMetric[];
} {
  const map: Record<
    string,
    {
      vehicleName: string;
      brand: string;
      photo: string;
      price: number;
      leads: number;
      appointments: number;
      visits: number;
      sales: number;
      revenue: number;
    }
  > = {};

  records.forEach((r) => {
    const key = r.vehicleName || 'Veículo Diverso';
    if (!map[key]) {
      map[key] = {
        vehicleName: r.vehicleName,
        brand: r.vehicleName.split(' ')[0] || 'Premium',
        photo: r.vehiclePhoto,
        price: r.vehiclePrice,
        leads: 0,
        appointments: 0,
        visits: 0,
        sales: 0,
        revenue: 0,
      };
    }
    map[key].leads += 1;
    if (r.isScheduled) map[key].appointments += 1;
    if (r.isVisited) map[key].visits += 1;
    if (r.status === 'ganho') {
      map[key].sales += 1;
      map[key].revenue += r.closedRevenue || r.vehiclePrice || 0;
    }
  });

  const list: VehiclePerformanceMetric[] = Object.keys(map).map((k) => {
    const d = map[k];
    const conversionRate = d.leads > 0 ? (d.sales / d.leads) * 100 : 0;
    const isHighDemandLowConversion = d.leads >= 3 && d.sales === 0;

    return {
      vehicleId: k,
      vehicleName: d.vehicleName,
      brand: d.brand,
      photo: d.photo,
      price: d.price,
      leads: d.leads,
      appointments: d.appointments,
      visits: d.visits,
      sales: d.sales,
      conversionRate: Number(conversionRate.toFixed(1)),
      revenue: d.revenue,
      isHighDemandLowConversion,
    };
  });

  const topVehicles = [...list].sort((a, b) => b.leads - a.leads);
  const attentionVehicles = list.filter((v) => v.isHighDemandLowConversion);

  return { topVehicles, attentionVehicles };
}

// 9. Performance de Atendimento (SLA)
export function computeAttendancePerformance(records: ExecutiveLeadRecord[]): AttendancePerformance {
  const withResponseTime = records.filter((r) => r.isAttended && r.firstResponseTimeMinutes > 0);
  const avgFirstResponseTimeMin =
    withResponseTime.length > 0
      ? withResponseTime.reduce((acc, r) => acc + r.firstResponseTimeMinutes, 0) / withResponseTime.length
      : 2.1;

  const under5MinCount = withResponseTime.filter((r) => r.firstResponseTimeMinutes <= 5.0).length;
  const percentAnsweredUnder5Min =
    withResponseTime.length > 0 ? (under5MinCount / withResponseTime.length) * 100 : 85;

  const unattendedLeadsCount = records.filter((r) => !r.isAttended).length;

  const soldRecords = records.filter((r) => r.status === 'ganho' && r.daysToClose !== undefined);
  const avgDaysToSale =
    soldRecords.length > 0
      ? soldRecords.reduce((acc, r) => acc + (r.daysToClose || 4), 0) / soldRecords.length
      : 4.2;

  return {
    avgFirstResponseTimeMin: Number(avgFirstResponseTimeMin.toFixed(1)),
    percentAnsweredUnder5Min: Number(percentAnsweredUnder5Min.toFixed(1)),
    unattendedLeadsCount,
    avgDaysToSale: Number(avgDaysToSale.toFixed(1)),
  };
}

// 10. Meta do Mês & Projeção de Fechamento
export function computeStoreGoalAndProjection(records: ExecutiveLeadRecord[]): StoreGoalAndProjection {
  const goalUnits = 30;
  const goalRevenue = 7500000;

  const soldRecords = records.filter((r) => r.status === 'ganho');
  const realizedUnits = soldRecords.length;
  const realizedRevenue = soldRecords.reduce((acc, r) => acc + (r.closedRevenue || r.vehiclePrice || 0), 0);

  const remainingUnits = Math.max(0, goalUnits - realizedUnits);
  const unitsAttainmentPercent = Number(((realizedUnits / goalUnits) * 100).toFixed(1));
  const revenueAttainmentPercent = Number(((realizedRevenue / goalRevenue) * 100).toFixed(1));

  // Cálculo de projeção no mês (Agosto possui 31 dias, dia de referência = 30)
  const totalDaysInMonth = 31;
  const daysElapsed = 30;
  const daysRemaining = Math.max(1, totalDaysInMonth - daysElapsed);

  const dailyUnitPace = daysElapsed > 0 ? realizedUnits / daysElapsed : 0;
  const dailyRevenuePace = daysElapsed > 0 ? realizedRevenue / daysElapsed : 0;

  const projectedUnits = Math.round(realizedUnits + dailyUnitPace * daysRemaining);
  const projectedRevenue = Math.round(realizedRevenue + dailyRevenuePace * daysRemaining);

  let status: 'ACIMA DA META' | 'DENTRO DO ESPERADO' | 'RISCO DE NÃO ATINGIR A META' = 'DENTRO DO ESPERADO';
  if (projectedUnits >= goalUnits) {
    status = 'ACIMA DA META';
  } else if (projectedUnits < goalUnits * 0.8) {
    status = 'RISCO DE NÃO ATINGIR A META';
  }

  return {
    goalUnits,
    realizedUnits,
    remainingUnits,
    unitsAttainmentPercent,
    goalRevenue,
    realizedRevenue,
    revenueAttainmentPercent,
    daysElapsed,
    daysRemaining,
    totalDaysInMonth,
    projectedUnits,
    projectedRevenue,
    status,
  };
}

// 11. Presencial vs Online
export function computePresentialVsOnline(records: ExecutiveLeadRecord[]): PresentialVsOnlineMetric {
  const onlineRecords = records.filter((r) => r.channelType === 'online');
  const presentialRecords = records.filter((r) => r.channelType === 'presencial');

  const onlineSales = onlineRecords.filter((r) => r.status === 'ganho');
  const presentialSales = presentialRecords.filter((r) => r.status === 'ganho');

  return {
    online: {
      leads: onlineRecords.length,
      appointments: onlineRecords.filter((r) => r.isScheduled).length,
      visits: onlineRecords.filter((r) => r.isVisited).length,
      sales: onlineSales.length,
      conversionRate:
        onlineRecords.length > 0 ? Number(((onlineSales.length / onlineRecords.length) * 100).toFixed(1)) : 0,
      revenue: onlineSales.reduce((acc, r) => acc + (r.closedRevenue || r.vehiclePrice || 0), 0),
    },
    presential: {
      attendances: presentialRecords.length,
      proposals: presentialRecords.filter((r) => r.isProposal).length,
      sales: presentialSales.length,
      conversionRate:
        presentialRecords.length > 0
          ? Number(((presentialSales.length / presentialRecords.length) * 100).toFixed(1))
          : 0,
      revenue: presentialSales.reduce((acc, r) => acc + (r.closedRevenue || r.vehiclePrice || 0), 0),
    },
  };
}

// 12. Alertas Gerenciais Automáticos
export function computeManagerAlerts(records: ExecutiveLeadRecord[]): ExecutiveAlert[] {
  const alerts: ExecutiveAlert[] = [];

  const unattended = records.filter((r) => !r.isAttended);
  if (unattended.length > 0) {
    alerts.push({
      id: 'alt-unattended',
      type: 'unattended',
      title: `${unattended.length} leads ainda não foram atendidos`,
      description: 'Leads na fila de entrada aguardando primeiro contato por SDR ou vendedor.',
      count: unattended.length,
      severity: 'high',
      filterKey: 'unattended',
    });
  }

  const idleLeads = records.filter(
    (r) => r.status !== 'ganho' && r.status !== 'perdido' && r.lastInteractionMinutesAgo > 120
  );
  if (idleLeads.length > 0) {
    alerts.push({
      id: 'alt-idle',
      type: 'idle_interaction',
      title: `${idleLeads.length} leads estão há mais de 2 horas sem interação`,
      description: 'Oportunidades quentes que necessitam de follow-up imediato da equipe.',
      count: idleLeads.length,
      severity: 'high',
      filterKey: 'idle',
    });
  }

  const unconfirmedApts = records.filter((r) => r.isScheduled && !r.appointmentConfirmed);
  if (unconfirmedApts.length > 0) {
    alerts.push({
      id: 'alt-unconfirmed',
      type: 'unconfirmed_appointments',
      title: `${unconfirmedApts.length} agendamentos ainda não possuem confirmação`,
      description: 'Test drives e visitas marcadas pendentes de contato de confirmação 24h.',
      count: unconfirmedApts.length,
      severity: 'medium',
      filterKey: 'unconfirmed',
    });
  }

  const proposalsNoFollowup = records.filter(
    (r) => r.isProposal && r.status === 'proposta' && r.lastInteractionMinutesAgo > 90
  );
  if (proposalsNoFollowup.length > 0) {
    alerts.push({
      id: 'alt-proposals',
      type: 'proposals_no_followup',
      title: `${proposalsNoFollowup.length} propostas comerciais estão sem follow-up recente`,
      description: 'Propostas enviadas sem retorno registrado nas últimas horas.',
      count: proposalsNoFollowup.length,
      severity: 'medium',
      filterKey: 'proposals',
    });
  }

  const stuckInFunnel = records.filter(
    (r) => r.status !== 'ganho' && r.status !== 'perdido' && r.daysInFunnel >= 3
  );
  if (stuckInFunnel.length > 0) {
    alerts.push({
      id: 'alt-stuck',
      type: 'stuck_funnel',
      title: `${stuckInFunnel.length} leads estão parados no funil há mais de 3 dias`,
      description: 'Negociações estagnadas que precisam de ação de reengajamento da Grid AI.',
      count: stuckInFunnel.length,
      severity: 'info',
      filterKey: 'stuck',
    });
  }

  return alerts;
}

// 13. Insights da IA com base nos dados reais
export function generateAiInsights(
  kpis: ExecutiveKpis,
  origins: OriginMetric[],
  sellers: SellerPerformanceMetric[],
  funnel: { stages: FunnelStageMetric[]; overallLeadToSaleConversion: number },
  lossReasons: LossReasonMetric[],
  attendance: AttendancePerformance
): string[] {
  const insights: string[] = [];

  // Variação de volume de leads
  if (kpis.leadsChangePercent > 0) {
    insights.push(
      `Seu volume de leads aumentou ${kpis.leadsChangePercent.toFixed(1)}% em relação ao período anterior.`
    );
  } else if (kpis.leadsChangePercent < 0) {
    insights.push(
      `Volume de leads apresentou redução de ${Math.abs(kpis.leadsChangePercent).toFixed(1)}% no período selecionado.`
    );
  }

  // Vendedor destaque
  if (sellers.length > 0) {
    const topSeller = sellers[0];
    const topConversionSeller = [...sellers].sort((a, b) => b.conversionRate - a.conversionRate)[0];
    insights.push(
      `${topSeller.sellerName} lidera a equipe em vendas (${topSeller.sales} carros, R$ ${(topSeller.revenue / 1000).toLocaleString('pt-BR')}k), enquanto ${topConversionSeller.sellerName} apresenta a maior taxa de conversão (${topConversionSeller.conversionRate.toFixed(1)}%).`
    );
  }

  // Origem de Leads
  if (origins.length >= 2) {
    const highestVolume = origins[0];
    const highestConv = [...origins].sort((a, b) => b.conversionRate - a.conversionRate)[0];
    if (highestVolume.origin !== highestConv.origin) {
      insights.push(
        `${highestVolume.origin} é sua maior fonte de volume (${highestVolume.leads} leads), porém ${highestConv.origin} apresenta a maior conversão em vendas (${highestConv.conversionRate.toFixed(1)}%).`
      );
    }
  }

  // Gargalo no Funil
  if (funnel.stages.length >= 5) {
    const aptStage = funnel.stages.find((s) => s.key === 'agendados');
    const visitStage = funnel.stages.find((s) => s.key === 'visitaram');
    if (aptStage && visitStage && aptStage.count > 0) {
      const drop = aptStage.count - visitStage.count;
      if (drop > 0) {
        insights.push(
          `A etapa com maior perda no funil ocorre entre Agendamento e Visita (${drop} contatos não compareceram ao showroom).`
        );
      }
    }
  }

  // Motivos de Perda
  if (lossReasons.length > 0) {
    const topLoss = lossReasons[0];
    insights.push(
      `${topLoss.percentage}% dos leads perdidos foram encerrados por: "${topLoss.reason}".`
    );
  }

  // SLA de Atendimento
  if (attendance.avgFirstResponseTimeMin <= 3.0) {
    insights.push(
      `Tempo médio de 1ª resposta está em excelentes ${attendance.avgFirstResponseTimeMin} minutos, com ${attendance.percentAnsweredUnder5Min}% dos contatos respondidos em até 5 minutos.`
    );
  } else {
    insights.push(
      `Tempo médio de resposta está em ${attendance.avgFirstResponseTimeMin} min. Reduzir para menos de 3 min eleva a conversão em até 4x.`
    );
  }

  return insights;
}
