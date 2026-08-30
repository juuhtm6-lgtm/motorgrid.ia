export type PeriodPreset =
  | 'hoje'
  | 'ontem'
  | '7dias'
  | '30dias'
  | 'mes_atual'
  | 'mes_anterior'
  | 'personalizado';

export interface DashboardFilters {
  period: PeriodPreset;
  startDate?: string;
  endDate?: string;
  store: string; // 'all' | 'unit-1' | 'unit-2' | 'unit-3'
  team: string; // 'all' | team name
  seller: string; // 'all' | seller name
  origin: string; // 'all' | origin name
  channelType: 'all' | 'online' | 'presencial';
  status: 'all' | 'novo' | 'em_atendimento' | 'qualificado' | 'agendado' | 'visitou' | 'proposta' | 'ganho' | 'perdido';
}

export type LeadOperationalStatus =
  | 'novo'
  | 'em_atendimento'
  | 'qualificado'
  | 'agendado'
  | 'visitou'
  | 'proposta'
  | 'ganho'
  | 'perdido';

export interface ExecutiveLeadRecord {
  id: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactAvatar?: string;
  vehicleId: string;
  vehicleName: string;
  vehiclePhoto: string;
  vehiclePrice: number;
  origin: string; // 'Meta Ads' | 'Instagram' | 'Facebook' | 'Google' | 'Webmotors' | 'iCarros' | 'OLX' | 'Site' | 'Presencial' | 'Indicação' | 'WhatsApp'
  channelType: 'online' | 'presencial';
  assignedTo: string;
  sellerAvatar?: string;
  unitId: string;
  storeName: string;
  team: string;
  createdAt: string; // 'YYYY-MM-DD HH:mm'
  dateOnly: string; // 'YYYY-MM-DD'
  firstResponseTimeMinutes: number; // SLA em minutos
  isAttended: boolean;
  isQualified: boolean;
  isScheduled: boolean;
  appointmentConfirmed?: boolean;
  isVisited: boolean;
  isProposal: boolean;
  status: LeadOperationalStatus;
  lossReason?: string; // Motivo de perda
  closedAt?: string;
  closedRevenue?: number;
  daysToClose?: number;
  lastInteractionMinutesAgo: number;
  daysInFunnel: number;
}

export interface ExecutiveKpis {
  totalLeads: number;
  totalLeadsPrevious: number;
  leadsChangePercent: number;

  totalSales: number;
  totalSalesPrevious: number;
  salesChangePercent: number;

  totalRevenue: number;
  totalRevenuePrevious: number;
  revenueChangePercent: number;

  conversionRate: number;
  conversionRatePrevious: number;
  conversionChangePp: number;
}

export interface OperationalStatusCounts {
  open: number; // Em aberto
  qualified: number; // Qualificados
  scheduled: number; // Agendamentos
  visited: number; // Visitas
  proposals: number; // Propostas
  lost: number; // Perdidos
}

export interface FunnelStageMetric {
  key: string;
  label: string;
  count: number;
  prevConversionRate: number; // % em relação à etapa anterior
  overallConversionRate: number; // % em relação ao total de leads
  dropCount: number;
}

export interface TimeSeriesPoint {
  date: string;
  label: string;
  leads: number;
  sales: number;
  revenue: number;
}

export interface OriginMetric {
  origin: string;
  leads: number;
  sales: number;
  conversionRate: number;
  revenue: number;
  ticketMedio: number;
}

export interface SellerPerformanceMetric {
  position: number;
  sellerName: string;
  avatar: string;
  team: string;
  leads: number;
  attendances: number;
  appointments: number;
  visits: number;
  proposals: number;
  sales: number;
  conversionRate: number;
  revenue: number;
  avgResponseTimeMin: number;
}

export interface LossReasonMetric {
  reason: string;
  count: number;
  percentage: number;
}

export interface VehiclePerformanceMetric {
  vehicleId: string;
  vehicleName: string;
  brand: string;
  photo: string;
  price: number;
  leads: number;
  appointments: number;
  visits: number;
  sales: number;
  conversionRate: number;
  revenue: number;
  isHighDemandLowConversion?: boolean;
}

export interface AttendancePerformance {
  avgFirstResponseTimeMin: number;
  percentAnsweredUnder5Min: number;
  unattendedLeadsCount: number;
  avgDaysToSale: number;
}

export interface StoreGoalAndProjection {
  goalUnits: number;
  realizedUnits: number;
  remainingUnits: number;
  unitsAttainmentPercent: number;

  goalRevenue: number;
  realizedRevenue: number;
  revenueAttainmentPercent: number;

  daysElapsed: number;
  daysRemaining: number;
  totalDaysInMonth: number;
  projectedUnits: number;
  projectedRevenue: number;
  status: 'ACIMA DA META' | 'DENTRO DO ESPERADO' | 'RISCO DE NÃO ATINGIR A META';
}

export interface PresentialVsOnlineMetric {
  online: {
    leads: number;
    appointments: number;
    visits: number;
    sales: number;
    conversionRate: number;
    revenue: number;
  };
  presential: {
    attendances: number;
    proposals: number;
    sales: number;
    conversionRate: number;
    revenue: number;
  };
}

export interface ExecutiveAlert {
  id: string;
  type: 'unattended' | 'idle_interaction' | 'unconfirmed_appointments' | 'proposals_no_followup' | 'stuck_funnel';
  title: string;
  description: string;
  count: number;
  severity: 'high' | 'medium' | 'info';
  filterKey: string;
}

export interface DrillDownState {
  isOpen: boolean;
  title: string;
  subtitle: string;
  records: ExecutiveLeadRecord[];
}
