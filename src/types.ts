export type ActiveTab =
  | 'dashboard'
  | 'atendimento'
  | 'crm'
  | 'estoque'
  | 'automacao'
  | 'automacoes'
  | 'grid-ai'
  | 'integracoes'
  | 'relatorios'
  | 'meta-ads'
  | 'campanhas'
  | 'anuncios'
  | 'relatorio-leads'
  | 'conversoes'
  | 'vendedores'
  | 'funil-comercial'
  | 'visao-geral'
  | 'ajustes'
  | 'leads'
  | 'pipeline'
  | 'performance'
  | 'customers'
  | 'projects'
  | 'billing'
  | 'settings'
  | 'sales'
  | 'ai-copilot'
  | 'login'
  | 'administracao'
  | 'equipe'
  | 'metas'
  | 'agenda'
  | 'tarefas';

export type PlanTier = 'Starter' | 'Pro' | 'Enterprise' | 'Custom';
export type LeadTemperature = 'Frio' | 'Morno' | 'Quente' | 'Pronto para Fechar';
export type ThemeMode = 'dark' | 'light';

// RBAC Canonical Roles
export type CanonicalRole =
  | 'platform_admin'
  | 'manager'
  | 'supervisor'
  | 'sdr'
  | 'salesperson';

// Granular RBAC Permissions
export interface UserPermissions {
  crm: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  leads: {
    viewOwn: boolean;
    viewAll: boolean;
    edit: boolean;
    transfer: boolean;
    delete: boolean;
  };
  atendimentos: {
    view: boolean;
    reply: boolean;
    transfer: boolean;
  };
  pipeline: {
    view: boolean;
    move: boolean;
  };
  relatorios: {
    viewOwn: boolean;
    viewTeam: boolean;
    export: boolean;
  };
  equipe: {
    createUser: boolean;
    editUser: boolean;
    changePermissions: boolean;
  };
  estoque: {
    view: boolean;
    edit: boolean;
  };
  gridAi: {
    useAi: boolean;
  };
  configuracoes: {
    view: boolean;
    edit: boolean;
  };
}

export interface IntegrationItem {
  id: string;
  name: string;
  category: 'mensageria' | 'portais' | 'financiamento' | 'ia';
  status: 'Conectado' | 'Desconectado';
  icon: string;
  description: string;
  lastSync?: string;
}

// Multi-tenant Types
export interface TenantUnit {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  vehicleCount: number;
  sellersCount: number;
}

export interface CompanyTenant {
  id: string; // e.g. 'tenant-1'
  name: string;
  tradeName: string;
  cnpj: string;
  logo: string;
  address: string;
  phone: string;
  timezone: string;
  plan: PlanTier;
  status: 'Ativo' | 'Inativo' | 'Bloqueado';
  userLimit: number;
  activeUsersCount: number;
  managerId?: string;
  managerName?: string;
  enabledModules: {
    crm: boolean;
    leads: boolean;
    pipeline: boolean;
    atendimentos: boolean;
    agenda: boolean;
    tarefas: boolean;
    equipe: boolean;
    metas: boolean;
    relatorios: boolean;
    estoque: boolean;
    gridAi: boolean;
    metaAds: boolean;
    configuracoes: boolean;
  };
  units: TenantUnit[];
  activeUnitId: string;
}

export interface Tenant {
  id: string;
  name: string;
  tradeName: string;
  cnpj: string;
  logo: string;
  address: string;
  phone: string;
  timezone: string;
  plan: PlanTier;
  units: TenantUnit[];
  activeUnitId: string;
}

// User & RBAC
export type UserRole =
  | 'Administrador'
  | 'Administrador MotorGrid'
  | 'platform_admin'
  | 'Gerente'
  | 'manager'
  | 'Supervisor'
  | 'supervisor'
  | 'SDR'
  | 'sdr'
  | 'Vendedor'
  | 'salesperson'
  | 'Gestor'
  | 'SDR / ACO'
  | 'Documentação'
  | 'Marketing'
  | 'Admin / Diretor'
  | 'Diretor / Sócio'
  | 'Gerente Geral'
  | 'Vendedor Showroom'
  | 'SDR / Pré-vendas'
  | 'Operador F&I'
  | 'Gestor de Vendas'
  | 'Customer Success'
  | 'Desenvolvedor'
  | 'Analista'
  | 'Gestor de Frotas';

export type UserTeam =
  | 'Pré-Atendimento'
  | 'Vendas Matriz'
  | 'Vendas Filial Jardins'
  | 'Vendas Barra'
  | 'Recuperação'
  | 'Documentação & F&I'
  | 'Pós-Venda'
  | 'Comercial'
  | 'Operações'
  | 'Diretoria';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  canonicalRole?: CanonicalRole;
  team?: string;
  company: string;
  companyId?: string;
  unitId?: string;
  unitName?: string;
  avatar?: string;
  plan: PlanTier;
  phone?: string;
  twoFactorEnabled?: boolean;
  lastLogin: string;
  createdAt: string;
  status: 'Ativo' | 'Ausente' | 'Offline' | 'Bloqueado' | 'Inativo';
  leadsCount?: number;
  attendancesCount?: number;
  salesCount?: number;
  salesMonth?: number;
  avgResponseTimeMin?: number;
  scoreAi?: number;
  permissions?: UserPermissions;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  companyId: string;
  companyName: string;
  action: string;
  module: string;
  targetRecord: string;
  ipAddress: string;
  result: 'Sucesso' | 'Bloqueado' | 'Erro';
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  team?: string;
  unitId?: string;
  status: 'Ativo' | 'Pendente';
  avatar: string;
  lastLogin: string;
  phone?: string;
}

// Channels & Tags
export type CommunicationChannel =
  | 'WhatsApp'
  | 'Instagram'
  | 'Facebook'
  | 'Messenger'
  | 'TikTok'
  | 'Webmotors'
  | 'OLX'
  | 'Mobiauto'
  | 'Chave na Mão'
  | 'iCarros'
  | 'Mercado Livre'
  | 'WebChat'
  | 'Telefone';

export interface LeadTag {
  id: string;
  label: string;
  color: string; // Hex color or Tailwind class
}

// Automotive Stock
export type VehicleStatus =
  | 'AVAILABLE'
  | 'RESERVED'
  | 'SOLD'
  | 'IN_PREPARATION'
  | 'Disponível'
  | 'Reservado'
  | 'Vendido'
  | 'Preparação'
  | 'Inativo';
export type TransmissionType =
  | 'Automático'
  | 'Manual'
  | 'CVT'
  | 'Dupla Embreagem'
  | 'Automatic'
  | 'PDK'
  | 'Dual-Clutch';
export type FuelType = 'Flex' | 'Gasolina' | 'Diesel' | 'Híbrido' | 'Elétrico' | 'Gasoline' | 'Hybrid' | 'Electric';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  version: string;
  fabYear: number;
  modelYear: number;
  km: number;
  gearbox: TransmissionType;
  fuel: FuelType;
  color: string;
  licensePlate: string;
  chassis: string; // VIN
  vin?: string;
  price: number; // Preço de venda
  costPrice: number; // Preço de custo
  options: string[];
  photos: string[];
  videoUrl?: string;
  status: VehicleStatus;
  storeUnit: string;
  location?: string;
  viewsCount: number;
  leadsCount: number;
  createdAt: string;
}

// Lead Tracking
export interface LeadTrackingInfo {
  origin: string; // 'Instagram Ads' | 'Webmotors' | 'Google Search' | 'Facebook' | 'OLX' | 'WhatsApp Direto'
  campaign?: string;
  adSet?: string;
  adName?: string;
  vehicleOfInterest?: {
    id: string;
    brand: string;
    model: string;
    version: string;
    year: number;
    km: number;
    price: number;
    gearbox: string;
    color: string;
    fuel: string;
    photo: string;
    store: string;
  };
  adUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
}

// Chat & Omnichannel
export interface ChatAttachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document' | 'audio' | 'car_card';
  size?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'client' | 'agent' | 'bot' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  isAiGenerated?: boolean;
  audioUrl?: string;
  audioDuration?: string;
  audioTranscription?: string;
  attachments?: ChatAttachment[];
}

export interface ConversationEvent {
  id: string;
  type:
    | 'lead_received'
    | 'distributed'
    | 'agent_joined'
    | 'message_sent'
    | 'message_received'
    | 'transferred'
    | 'tag_added'
    | 'qualified'
    | 'appointment_created'
    | 'crm_card_created'
    | 'sale_registered'
    | 'closed';
  title: string;
  description: string;
  timestamp: string;
  authorName: string;
}

export interface AttendanceSummary {
  text: string;
  nextAction?: string;
  source: 'ai' | 'manual' | 'ai_edited';
  isManuallyEdited: boolean;
  lastUpdated: string;
  updatedBy: string;
}

export interface Conversation {
  id: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  contactAvatar?: string;
  channel: CommunicationChannel;
  status: 'Novo' | 'Em Atendimento' | 'Aguardando Cliente' | 'Concluído';
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  assignedTo: string;
  assignedUserRole: string;
  team: UserTeam;
  tags: string[];
  isNewLead: boolean;
  leadScore: number; // 0 to 100
  temperature: 'Quente' | 'Morno' | 'Frio';
  unitId: string;
  tracking: LeadTrackingInfo;
  messages: ChatMessage[];
  events: ConversationEvent[];
  summary?: AttendanceSummary;
}

// CRM & Pipelines
export type PipelineType =
  | 'pre-atendimento'
  | 'vendas'
  | 'documentacao'
  | 'recuperacao'
  | 'pos-venda';

export interface PipelineStageConfig {
  id: string;
  name: string;
  color: string;
}

export interface PipelineConfig {
  id: PipelineType;
  name: string;
  description: string;
  stages: PipelineStageConfig[];
  teamResponsible: UserTeam;
}

export interface CrmCard {
  id: string;
  pipelineId: PipelineType;
  stageId: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactAvatar?: string;
  vehicleName: string;
  vehiclePrice: number;
  vehiclePhoto?: string;
  origin: string;
  assignedTo: string;
  timeInStage: string;
  temperature: 'Quente' | 'Morno' | 'Frio';
  gridScore: number;
  lastInteraction: string;
  nextTask?: string;
  nextTaskDate?: string;
  tradeInVehicle?: string; // Veículo de troca
  financingStatus?: string; // Ex: 'Aprovado BV 60x', 'Em Análise'
  lossReason?: string;
  documentsChecklist?: { id: string; name: string; completed: boolean }[];
  isOverdue?: boolean; // Item atrasado no SLA
  unitId: string;
  createdAt?: string;
  notes?: string;
}

// Contacts 360
export interface Contact {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  instagram?: string;
  email: string;
  cpf?: string;
  city: string;
  state: string;
  tags: string[];
  origin: string;
  assignedTo: string; // Carteirização permanente
  lastContact: string;
  createdAt: string;
  status: 'Ativo' | 'Arquivado' | 'Bloqueado';
  totalPurchases: number;
  vehiclesConsulted: string[];
  notes: string;
  tradeInHistory?: string;
}

// Tasks & Appointments
export type CrmTaskType =
  | 'Ligação'
  | 'WhatsApp'
  | 'Retorno'
  | 'Proposta'
  | 'Visita'
  | 'Documentação'
  | 'Pós-venda';

export interface CrmTask {
  id: string;
  title: string;
  contactName: string;
  contactPhone: string;
  contactId?: string;
  opportunityId?: string;
  assignedTo: string;
  dueDate: string;
  dueTime: string;
  priority: 'Baixa' | 'Média' | 'Alta' | 'Urgente';
  type: CrmTaskType;
  status: 'Hoje' | 'Atrasada' | 'Próxima' | 'Concluída';
  notes?: string;
}

export type AppointmentType =
  | 'Visita à Loja'
  | 'Test Drive'
  | 'Avaliação de Usado'
  | 'Ligação'
  | 'Videochamada'
  | 'Entrega de Veículo';

export interface Appointment {
  id: string;
  contactName: string;
  contactPhone: string;
  sellerName: string;
  vehicleName: string;
  date: string;
  time: string;
  storeUnit: string;
  type: AppointmentType;
  status: 'Agendado' | 'Confirmado (24h)' | 'Lembrete (2h)' | 'Realizado' | 'Cancelado' | 'No-Show';
  notes?: string;
}

// Scheduled Messages & Sequences & Campaigns
export interface ScheduledMessage {
  id: string;
  contactName: string;
  contactPhone: string;
  channel: CommunicationChannel;
  assignedTo: string;
  messageText: string;
  scheduledFor: string;
  createdAt: string;
  status: 'Agendada' | 'Enviada' | 'Entregue' | 'Lida' | 'Cancelada' | 'Erro';
}

export interface FollowUpSequence {
  id: string;
  name: string;
  description: string;
  category: 'Recuperação' | 'Pós-Venda' | 'Boas-Vindas' | 'Nutrição';
  status: 'Ativo' | 'Pausado' | 'Arquivado';
  totalContacts: number;
  totalSent: number;
  delivered: number;
  opened: number;
  replied: number;
  conversions: number;
  steps: {
    stepNumber: number;
    delayText: string;
    actionType: string;
    content: string;
  }[];
}

export interface BroadcastCampaign {
  id: string;
  title: string;
  channel: CommunicationChannel;
  targetSegment: string;
  scheduledDate: string;
  status: 'Rascunho' | 'Agendada' | 'Em Execução' | 'Concluída' | 'Pausada';
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  responsesCount: number;
  opportunitiesCount: number;
  salesCount: number;
  revenueGenerated: number;
  cpl: number;
  roas: number;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  channel: CommunicationChannel | 'Todos';
  enabled: boolean;
  executionsCount: number;
  lastExecuted: string;
  category: 'Comercial' | 'SLA & Alerta' | 'Atendimento' | 'Pós-Venda';
}

// Grid AI
export interface GridScoreDetail {
  overall: number; // 0 to 100
  responseSpeedScore: number;
  priceInterestScore: number;
  financingQueryScore: number;
  tradeInScore: number;
  engagementScore: number;
  classification: '🔥 Quente (Alta Probabilidade)' | '🌡️ Morno (Média Probabilidade)' | '❄️ Frio (Baixa Probabilidade)';
}

export interface ConversationQualityAnalysis {
  overallScore: number; // 0 to 100
  speedScore: number;
  approachScore: number;
  qualificationScore: number;
  objectionHandlingScore: number;
  closingAttemptScore: number;
  positivePoints: string[];
  improvementPoints: string[];
  suggestedAction: string;
}

export interface SmartAlert {
  id: string;
  severity: 'critical' | 'warning' | 'opportunity' | 'info';
  title: string;
  description: string;
  count: number;
  actionLabel: string;
  targetTab: ActiveTab;
}

// Integrations Marketplace
export interface IntegrationApp {
  id: string;
  name: string;
  category: 'Mensageria' | 'Portais Automotivos' | 'Mídia Paga' | 'Financeiras' | 'IA & Voice';
  description: string;
  iconName: string;
  status: 'Ativo' | 'Inativo';
  badge?: string;
  connectedAccount?: string;
  lastSync?: string;
}

// Reports & BI
export interface CommercialFunnelMetric {
  stage: string;
  count: number;
  conversionRate: number; // % do estágio anterior
  dropRate: number;
}

export interface SellerPerformanceRank {
  id: string;
  name: string;
  avatar: string;
  team: string;
  leadsReceived: number;
  contactsMade: number;
  avgResponseTimeMin: number;
  qualifiedCount: number;
  appointmentsCount: number;
  visitsCount: number;
  proposalsCount: number;
  salesCount: number;
  revenue: number;
  conversionRate: number;
  gridQualityScore: number;
}

export interface ChannelRoiMetric {
  origin: string;
  leads: number;
  appointments: number;
  visits: number;
  sales: number;
  conversionRate: number;
  revenue: number;
  cost: number;
  cpl: number;
  cpa: number;
  roas: number;
}

// Settings & Audit
export interface AuditLogItem {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  targetRecord: string;
  ipAddress: string;
}

// Notifications
export interface ActivityNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'lead' | 'sale' | 'alert' | 'appointment' | 'system' | 'payment' | 'churn';
  read: boolean;
  linkTo?: string;
}

// Legacy compatibility types to ensure 0 build breaks
export type CustomerStatus = 'Ativo' | 'Trial' | 'Em Risco' | 'Churned' | 'Lead';
export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  avatar?: string;
  plan: PlanTier;
  mrr: number;
  status: CustomerStatus;
  healthScore: number;
  renewalDate?: string;
  startDate?: string;
  city?: string;
  segment?: string;
  tags?: string[];
  contactPhone?: string;
  phone?: string;
  vehiclesCount?: number;
  joinedDate?: string;
  lastContact?: string;
  contractRenewal?: string;
  assignedTo?: string;
  notes?: string;
  lastActive?: string;
}

export type PipelineStage = 'Lead' | 'Qualificação' | 'Demonstração' | 'Proposta' | 'Fechado';
export interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: PipelineStage;
  probability: number;
  contactName: string;
  contactEmail: string;
  expectedClose: string;
  assignedTo: string;
}

export type TaskStatus = 'Backlog' | 'Em Progresso' | 'Em Revisão' | 'Concluído';
export type TaskPriority = 'Baixa' | 'Média' | 'Alta' | 'Urgente';
export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  project: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: {
    name: string;
    avatar: string;
    role: string;
  };
  dueDate: string;
  subtasks: { id: string; title: string; completed: boolean }[];
  tags: string[];
}

export type InvoiceStatus = 'Pago' | 'Pendente' | 'Atrasado';
export type PaymentMethod = 'PIX' | 'Cartão de Crédito' | 'Boleto';
export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  company: string;
  amount: number;
  plan: PlanTier;
  status: InvoiceStatus;
  dueDate: string;
  paymentDate?: string;
  paymentMethod: PaymentMethod;
}

export interface MetricSummary {
  mrr: number;
  mrrGrowth: number;
  arr: number;
  activeCustomers: number;
  customerGrowth: number;
  churnRate: number;
  churnRateChange: number;
  ltv: number;
  cac: number;
  nrr: number;
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  status: 'Ativo' | 'Inativo';
  createdAt: string;
  lastTriggered?: string;
}

export type LeadStatus = 'Novo' | 'Em Contato' | 'Qualificado' | 'Agendado' | 'Proposta Enviada' | 'Negociação' | 'Ganho' | 'Perdido';
export type LeadSource = 'Site / Landing Page' | 'WhatsApp Direto' | 'Indicação de Frotista' | 'Tráfego Pago' | 'Feira Automotiva' | 'Outbound' | 'Instagram Ads' | 'Google Ads' | 'Webmotors' | 'OLX Autos' | 'Facebook Ads';
export interface LeadItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  fleetSize: number;
  estimatedValue: number;
  source: LeadSource;
  status: LeadStatus;
  notes?: string;
  assignedTo: string;
  createdAt: string;
  lastContact: string;
  tags?: string[];
  vehicleInterest?: string;
  channel?: CommunicationChannel | string;
  trafficType?: string;
  origin?: string;
}

export type EstoqueStatus = 'Disponível' | 'Instalado' | 'Em Teste' | 'Em Manutenção' | 'Reservado';
export type DeviceType = 'Rastreador OBD-II 4G' | 'Sensor CAN-Bus Pro' | 'Módulo GPS Satelital' | 'Câmera Veicular ADAS' | 'Sensor de Combustível Ultrassônico';
export interface EstoqueItem {
  id: string;
  serialNumber: string;
  model: DeviceType;
  supplier: string;
  status: EstoqueStatus;
  batteryHealth: number;
  firmwareVersion: string;
  installedInVehicle?: string;
  installedInCompany?: string;
  lastPing?: string;
  receivedDate: string;
  locationStock: string;
}

// ==========================================
// META MARKETING API & RELATÓRIOS TYPES
// ==========================================

export type MetaPeriodFilter =
  | 'Hoje'
  | 'Ontem'
  | '7 dias'
  | '30 dias'
  | 'Este mês'
  | 'Mês anterior'
  | 'Personalizado';

export type MetaPlatform = 'ALL' | 'FACEBOOK' | 'INSTAGRAM';
export type MetaCampaignStatus = 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
export type MetaRoleView = 'ADMINISTRADOR' | 'GESTOR' | 'MARKETING' | 'VENDEDOR' | 'PROPRIETARIO';

export interface MetaAccountConfig {
  id: string;
  tenantId: string;
  businessManagerId: string;
  businessManagerName: string;
  adAccountId: string;
  adAccountName: string;
  pageId: string;
  pageName: string;
  instagramId: string;
  instagramHandle: string;
  pixelId: string;
  appId: string;
  accessTokenMasked: string;
  connectedAt: string;
  lastSyncAt: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'TOKEN_EXPIRED' | 'SYNCING';
  webhookActive: boolean;
  currency: string;
  timezone: string;
}

export interface MetaCampaign {
  id: string;
  name: string;
  status: MetaCampaignStatus;
  objective: string;
  vehicleOffer: string;
  vehicleId?: string;
  vehicleThumbnail: string;
  startDate: string;
  budget: number;
  budgetType: 'DAILY' | 'LIFETIME';
  spend: number;
  impressions: number;
  reach: number;
  frequency: number;
  clicks: number;
  linkClicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  leads: number;
  cpl: number;
  // CRM Linked Commercial Metrics
  crmAtendimentos: number;
  crmQualificados: number;
  crmAgendamentos: number;
  crmVisitas: number;
  crmPropostas: number;
  crmVendas: number;
  crmReceita: number;
  crmLucro: number;
  costPerSale: number;
  cpaAgendamento: number;
  costPerVisita: number;
  conversionLeadToSale: number;
  roas: number;
  roi: number;
  avgResponseTimeMin: number;
  adsetsCount: number;
  adsCount: number;
  platform: 'FACEBOOK' | 'INSTAGRAM' | 'ALL';
}

export interface MetaAd {
  id: string;
  name: string;
  campaignId: string;
  campaignName: string;
  adsetId: string;
  adsetName: string;
  vehicleAnnounced: string;
  vehicleId?: string;
  creativeType: 'IMAGE' | 'VIDEO' | 'CAROUSEL';
  creativeThumbnail: string;
  headline: string;
  bodyText: string;
  status: MetaCampaignStatus;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  leads: number;
  cpl: number;
  crmAgendamentos: number;
  crmVisitas: number;
  crmVendas: number;
  crmReceita: number;
  costPerSale: number;
  roas: number;
  badges?: ('BEST_CREATIVE' | 'TOP_LEADS' | 'LOWEST_CPL' | 'TOP_SALES')[];
}

export interface MetaLeadTracking {
  id: string;
  metaLeadId: string;
  campaignId: string;
  campaignName: string;
  adsetId: string;
  adsetName: string;
  adId: string;
  adName: string;
  formId: string;
  formName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  vehicleInterest: string;
  vehiclePrice: number;
  origin: string;
  createdAt: string;
  crmStatus:
    | 'NOVO'
    | 'EM_ATENDIMENTO'
    | 'EM_ANDAMENTO'
    | 'PENDENTE'
    | 'QUALIFICADO'
    | 'AGENDADO'
    | 'VISITOU'
    | 'PROPOSTA'
    | 'VENDA'
    | 'PERDIDO';
  assignedSeller: string;
  sellerAvatar?: string;
  responseTimeMin?: number;
  saleValue?: number;
  saleDate?: string;
  notes?: string;
  inactivityLabel?: string;
  firstResponseLabel?: string;
  totalTimeLabel?: string;
  statusBadge?: string;
  channelType?: 'whatsapp' | 'instagram' | 'facebook' | 'web';
  channelNumber?: string;
  hasMetaBadge?: boolean;
  team?: string;
}

export interface MetaPerformanceByVehicle {
  vehicleId: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  thumbnail: string;
  campaignsCount: number;
  spend: number;
  leads: number;
  cpl: number;
  agendamentos: number;
  visitas: number;
  vendas: number;
  costPerSale: number;
  revenue: number;
  profitMarginEstimated: number;
  roas: number;
}

export interface MetaDailyDataPoint {
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
  cpl: number;
  agendamentos: number;
  visitas: number;
  vendas: number;
  revenue: number;
  previousPeriodSpend?: number;
  previousPeriodLeads?: number;
  previousPeriodVendas?: number;
}

export interface MetaPerformanceInsight {
  id: string;
  type: 'positive' | 'warning' | 'info' | 'opportunity';
  title: string;
  message: string;
  metricBadge: string;
  impactScore?: number;
  actionRecommendation?: string;
}

export interface MetaSyncLog {
  id: string;
  timestamp: string;
  event: string;
  recordsSynced: number;
  status: 'SUCCESS' | 'WARNING' | 'ERROR';
  durationMs: number;
  details: string;
}

