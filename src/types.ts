export type PlanTier = 'Starter' | 'Pro' | 'Enterprise' | 'Custom';

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
  renewalDate: string;
  startDate: string;
  city: string;
  segment: string;
  tags: string[];
  contactPhone?: string;
  notes?: string;
  lastActive: string;
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
