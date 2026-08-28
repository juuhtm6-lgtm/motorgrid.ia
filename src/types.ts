export type ActiveTab =
  | 'dashboard'
  | 'atendimento'
  | 'leads'
  | 'pipeline'
  | 'estoque'
  | 'automacao'
  | 'performance'
  | 'administracao'
  | 'sales'
  | 'customers'
  | 'projects'
  | 'billing'
  | 'ai-copilot'
  | 'reports'
  | 'settings';

export type PlanTier = 'Starter' | 'Pro' | 'Enterprise' | 'Custom';

export type LeadStatus = 'Novo' | 'Em Contato' | 'Qualificado' | 'Proposta Enviada' | 'Ganho' | 'Perdido';
export type LeadSource = 'Site / Landing Page' | 'WhatsApp Direto' | 'Indicação de Frotista' | 'Tráfego Pago' | 'Feira Automotiva' | 'Outbound';

export interface LeadItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  fleetSize: number; // quantidade estimada de veículos
  estimatedValue: number; // em R$
  source: LeadSource;
  status: LeadStatus;
  notes?: string;
  assignedTo: string;
  createdAt: string;
  lastContact: string;
  tags?: string[];
}

export type EstoqueStatus = 'Disponível' | 'Instalado' | 'Em Teste' | 'Em Manutenção' | 'Reservado';
export type DeviceType = 'Rastreador OBD-II 4G' | 'Sensor CAN-Bus Pro' | 'Módulo GPS Satelital' | 'Câmera Veicular ADAS' | 'Sensor de Combustível Ultrassônico';

export interface EstoqueItem {
  id: string;
  serialNumber: string; // IMEI ou Serial
  model: DeviceType;
  supplier: string;
  status: EstoqueStatus;
  batteryHealth: number; // 0 a 100%
  firmwareVersion: string;
  installedInVehicle?: string; // Placa ou identificador
  installedInCompany?: string;
  lastPing?: string;
  receivedDate: string;
  locationStock: string;
}

export interface AutomacaoRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  channel: 'WhatsApp' | 'Email' | 'Webhook' | 'SMS' | 'Push / Notificação';
  enabled: boolean;
  executionsCount: number;
  lastExecuted: string;
  category: 'Telemetria' | 'Comercial' | 'Financeiro' | 'Segurança';
}

export interface ChatMessage {
  id: string;
  sender: 'client' | 'agent' | 'bot';
  senderName: string;
  text: string;
  timestamp: string;
  isAiGenerated?: boolean;
}

export interface ChatConversation {
  id: string;
  clientName: string;
  clientCompany: string;
  clientPhone: string;
  clientAvatar?: string;
  channel: 'WhatsApp' | 'WebChat' | 'Telemetria SOS' | 'Email';
  status: 'Aberto' | 'Em Atendimento' | 'Resolvido';
  assignedTo: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  vehiclePlate?: string;
  telemetryAlert?: string;
  messages: ChatMessage[];
}

export type CustomerStatus = 'Ativo' | 'Trial' | 'Em Risco' | 'Churned' | 'Lead';

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  avatar?: string;
  plan: PlanTier;
  mrr: number; // in BRL (R$)
  status: CustomerStatus;
  healthScore: number; // 0 to 100
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
  nrr: number; // Net Revenue Retention %
}

export type UserRole =
  | 'Administrador'
  | 'Gestor de Frotas'
  | 'Engenheiro de Telemetria'
  | 'Customer Success'
  | 'Analista de Operações'
  | 'Gestor de Vendas'
  | 'Desenvolvedor'
  | 'Analista';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Ativo' | 'Pendente';
  avatar: string;
  lastLogin: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company: string;
  avatar?: string;
  plan: PlanTier;
  phone?: string;
  twoFactorEnabled?: boolean;
  lastLogin: string;
  createdAt: string;
  status: 'Ativo' | 'Inativo';
}

export interface ActivityNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'payment' | 'lead' | 'alert' | 'system' | 'churn';
  read: boolean;
  linkTo?: string;
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  status: 'Ativo' | 'Inativo';
  createdAt: string;
  lastTriggered?: string;
}
