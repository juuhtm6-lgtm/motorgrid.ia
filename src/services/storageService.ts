import {
  LeadItem,
  LeadStatus,
  Vehicle,
  VehicleStatus,
  CrmCard,
  Contact,
  CrmTask,
  Appointment,
  Conversation,
  AttendanceSummary,
  AutomationRule,
  AuthUser,
  CompanyTenant,
  AuditLogEntry,
  UserPermissions,
  CanonicalRole,
} from '../types';
import { ExecutiveLeadRecord } from '../types/dashboard';
import {
  initialLeads,
  initialVehicles,
  initialCrmCards,
  initialContacts,
  initialCrmTasks,
  initialAppointments,
  initialConversations,
  initialAutomations,
  initialCompanies,
  initialAuthUsers,
  initialAuditLogs,
  getDefaultPermissions,
} from '../data/mockData';
import { initialExecutiveRecords } from '../data/executiveRecordsData';

const STORAGE_KEYS = {
  LEADS: 'motorgrid_leads_v2',
  VEHICLES: 'motorgrid_vehicles_v2',
  CRM_CARDS: 'motorgrid_crm_cards_v2',
  CONTACTS: 'motorgrid_contacts_v2',
  TASKS: 'motorgrid_crm_tasks_v2',
  APPOINTMENTS: 'motorgrid_appointments_v2',
  CONVERSATIONS: 'motorgrid_conversations_v2',
  AUTOMATIONS: 'motorgrid_automations_v2',
  SCHEDULED_MESSAGES: 'motorgrid_scheduled_messages_v2',
  DASHBOARD_RECORDS: 'motorgrid_dashboard_records_v2',
  BROADCASTS: 'motorgrid_broadcasts_v2',
  MARKETPLACE_MODULES: 'motorgrid_marketplace_modules_v2',
  USERS: 'motorgrid_auth_users',
  COMPANIES: 'motorgrid_companies_v2',
  AUDIT_LOGS: 'motorgrid_audit_logs_v2',
};

export interface BroadcastCampaignItem {
  id: string;
  title: string;
  sent: number;
  delivered: string;
  read: string;
  leadsGenerated: number;
  sales: number;
  status: 'Concluída' | 'Em Andamento' | 'Agendada';
}

const initialBroadcasts: BroadcastCampaignItem[] = [
  {
    id: 'bc-1',
    title: 'Feirão de Taxa Zero - Linha SUV Premium',
    sent: 450,
    delivered: '99.2%',
    read: '88.4%',
    leadsGenerated: 38,
    sales: 4,
    status: 'Concluída',
  },
  {
    id: 'bc-2',
    title: 'Resgate de Propostas Antigas (Últimos 60 Dias)',
    sent: 280,
    delivered: '98.5%',
    read: '82.1%',
    leadsGenerated: 24,
    sales: 2,
    status: 'Concluída',
  },
];

export interface ScheduledMessageItem {
  id: string;
  to: string;
  time: string;
  msg: string;
  car: string;
  status: 'Pendente' | 'Enviada' | 'Cancelada';
}

const initialScheduledMessages: ScheduledMessageItem[] = [
  {
    id: 'sch-1',
    to: 'Dr. Roberto Silveira (+55 11 98841-1122)',
    time: 'Hoje às 17:30 (em 45 min)',
    msg: 'Olá Dr. Roberto! Lembrando que seu Porsche Macan estará polido e pronto para o Test Drive amanhã às 10:00.',
    car: 'Porsche Macan GTS',
    status: 'Pendente',
  },
  {
    id: 'sch-2',
    to: 'Eduardo Martins (+55 11 97711-2233)',
    time: 'Amanhã às 09:00',
    msg: 'Bom dia Eduardo! A aprovação do financiamento BV da sua Toyota Hilux foi concluída com taxa de 1.19% a.m.',
    car: 'Toyota Hilux GR-Sport',
    status: 'Pendente',
  },
  {
    id: 'sch-3',
    to: 'Fernanda Lima (+55 21 99881-4455)',
    time: 'Sexta-feira às 14:00',
    msg: 'Olá Fernanda! Chegou uma Mercedes C300 exatamente na cor Branco Polar que você estava procurando.',
    car: 'Mercedes-Benz C300',
    status: 'Pendente',
  },
];

type StorageListener = () => void;

class StorageService {
  private listeners: Set<StorageListener> = new Set();

  private getStored<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
    } catch (e) {
      console.error(`Error reading ${key} from storage:`, e);
    }
    return fallback;
  }

  private setStored<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.notify();
    } catch (e) {
      console.error(`Error writing ${key} to storage:`, e);
    }
  }

  public subscribe(listener: StorageListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error in storage listener:', err);
      }
    });
  }

  // ==========================================
  // 1. LEADS
  // ==========================================
  public getLeads(): LeadItem[] {
    return this.getStored<LeadItem[]>(STORAGE_KEYS.LEADS, initialLeads);
  }

  public addLead(leadData: Omit<LeadItem, 'id' | 'createdAt' | 'lastContact'>): LeadItem {
    const leads = this.getLeads();
    const newLead: LeadItem = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdAt: 'Hoje',
      lastContact: 'Criado agora',
    };

    const updated = [newLead, ...leads];
    this.setStored(STORAGE_KEYS.LEADS, updated);

    // Also register in CRM Cards (Pipeline Kanban)
    const cards = this.getCrmCards();
    const newCard: CrmCard = {
      id: `card-${Date.now()}`,
      pipelineId: 'vendas',
      stageId: 'lead_novo',
      contactName: newLead.name,
      contactPhone: newLead.phone,
      contactEmail: newLead.email,
      origin: newLead.source || 'Website / Frotas',
      unitId: 'unit-matriz',
      timeInStage: '0d',
      lastInteraction: 'Criado agora',
      vehicleName: newLead.notes || `${newLead.company} (${newLead.fleetSize} un)`,
      vehiclePrice: newLead.estimatedValue || 289900,
      temperature: 'Quente',
      gridScore: 90,
      assignedTo: newLead.assignedTo || 'Rodrigo Mendes',
    };
    this.setStored(STORAGE_KEYS.CRM_CARDS, [newCard, ...cards]);

    // Also register in Conversations (Atendimento WhatsApp)
    const conversations = this.getConversations();
    const convExists = conversations.some((c) => c.contactPhone === newLead.phone);
    if (!convExists) {
      const newConv: Conversation = {
        id: newLead.id,
        contactId: `contact-${newLead.id}`,
        contactName: newLead.name,
        contactPhone: newLead.phone,
        channel: 'WhatsApp',
        assignedTo: newLead.assignedTo || 'Camila Rocha',
        assignedUserRole: 'SDR de Pré-Vendas',
        team: 'Pré-Atendimento',
        status: 'Novo',
        unreadCount: 1,
        leadScore: 90,
        temperature: 'Quente',
        unitId: 'unit-matriz',
        tags: ['Novo Lead', newLead.source || 'Online'],
        isNewLead: true,
        lastMessage: `Olá! Tenho interesse em veículos da MotorGrid (${newLead.company}).`,
        lastMessageTime: 'Agora',
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'client',
            senderName: newLead.name,
            text: `Olá! Tenho interesse em veículos da MotorGrid (${newLead.company}).`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
        events: [
          {
            id: `ev-${Date.now()}`,
            type: 'lead_received',
            title: 'Lead Recebido no Sistema',
            description: `Origem: ${newLead.source || 'Website'}. Responsável: ${newLead.assignedTo || 'Camila Rocha'}`,
            timestamp: 'Agora mesmo',
            authorName: 'MotorGrid Ingestion Engine',
          },
        ],
        tracking: {
          origin: newLead.source || 'Website',
          utmSource: 'direct_entry',
          vehicleOfInterest: {
            id: 'veh-interest',
            brand: 'MotorGrid',
            model: newLead.company,
            version: 'Fleet Edition',
            year: 2025,
            price: newLead.estimatedValue || 289900,
            km: 0,
            photo: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=300&auto=format&fit=crop&q=80',
            gearbox: 'Automático',
            color: 'Cinza',
            fuel: 'Híbrido',
            store: 'Matriz Sorocaba',
          },
        },
      };
      this.setStored(STORAGE_KEYS.CONVERSATIONS, [newConv, ...conversations]);
    }

    // Also register in Dashboard Records
    const newRecord: ExecutiveLeadRecord = {
      id: `rec-${Date.now()}`,
      contactName: newLead.name,
      contactPhone: newLead.phone,
      contactEmail: newLead.email,
      vehicleId: 'veh-fleet',
      vehicleName: `${newLead.company} (${newLead.fleetSize} un)`,
      vehiclePhoto: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=300&auto=format&fit=crop&q=80',
      vehiclePrice: newLead.estimatedValue,
      origin: newLead.source || 'WhatsApp',
      channelType: 'online',
      assignedTo: newLead.assignedTo || 'Rodrigo Mendes',
      unitId: 'unit-matriz',
      storeName: 'Matriz Sorocaba',
      team: 'Comercial',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      dateOnly: new Date().toISOString().slice(0, 10),
      firstResponseTimeMinutes: 1.2,
      isAttended: true,
      isQualified: true,
      isScheduled: false,
      isVisited: false,
      isProposal: false,
      status: 'novo',
      lastInteractionMinutesAgo: 2,
      daysInFunnel: 0,
    };
    this.addDashboardRecord(newRecord);

    return newLead;
  }

  public updateLead(id: string, partial: Partial<LeadItem>): LeadItem | null {
    const leads = this.getLeads();
    let updatedLead: LeadItem | null = null;
    const updated = leads.map((l) => {
      if (l.id === id) {
        updatedLead = { ...l, ...partial };
        return updatedLead;
      }
      return l;
    });

    if (updatedLead) {
      this.setStored(STORAGE_KEYS.LEADS, updated);
    }
    return updatedLead;
  }

  public updateLeadStatus(id: string, status: LeadStatus): void {
    this.updateLead(id, { status });
  }

  public deleteLead(id: string): void {
    const leads = this.getLeads();
    const updated = leads.filter((l) => l.id !== id);
    this.setStored(STORAGE_KEYS.LEADS, updated);
  }

  // ==========================================
  // 2. VEÍCULOS (ESTOQUE)
  // ==========================================
  public getVehicles(): Vehicle[] {
    return this.getStored<Vehicle[]>(STORAGE_KEYS.VEHICLES, initialVehicles);
  }

  public addVehicle(vehicleData: Omit<Vehicle, 'id'>): Vehicle {
    const vehicles = this.getVehicles();
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `veh-${Date.now()}`,
    };
    const updated = [newVehicle, ...vehicles];
    this.setStored(STORAGE_KEYS.VEHICLES, updated);
    return newVehicle;
  }

  public updateVehicle(id: string, partial: Partial<Vehicle>): Vehicle | null {
    const vehicles = this.getVehicles();
    let updatedVehicle: Vehicle | null = null;
    const updated = vehicles.map((v) => {
      if (v.id === id) {
        updatedVehicle = { ...v, ...partial };
        return updatedVehicle;
      }
      return v;
    });

    if (updatedVehicle) {
      this.setStored(STORAGE_KEYS.VEHICLES, updated);
    }
    return updatedVehicle;
  }

  public updateVehicleStatus(id: string, status: VehicleStatus): void {
    this.updateVehicle(id, { status });
  }

  public deleteVehicle(id: string): void {
    const vehicles = this.getVehicles();
    const updated = vehicles.filter((v) => v.id !== id);
    this.setStored(STORAGE_KEYS.VEHICLES, updated);
  }

  // ==========================================
  // 3. CRM CARDS / PIPELINE DEALS
  // ==========================================
  public getCrmCards(): CrmCard[] {
    return this.getStored<CrmCard[]>(STORAGE_KEYS.CRM_CARDS, initialCrmCards);
  }

  public addCrmCard(cardData: Omit<CrmCard, 'id' | 'createdAt'>): CrmCard {
    const cards = this.getCrmCards();
    const newCard: CrmCard = {
      ...cardData,
      id: `crm-${Date.now()}`,
      createdAt: 'Hoje',
    };
    const updated = [newCard, ...cards];
    this.setStored(STORAGE_KEYS.CRM_CARDS, updated);
    return newCard;
  }

  public updateCrmCard(id: string, partial: Partial<CrmCard>): CrmCard | null {
    const cards = this.getCrmCards();
    let updatedCard: CrmCard | null = null;
    const updated = cards.map((c) => {
      if (c.id === id) {
        updatedCard = { ...c, ...partial };
        return updatedCard;
      }
      return c;
    });

    if (updatedCard) {
      this.setStored(STORAGE_KEYS.CRM_CARDS, updated);
    }
    return updatedCard;
  }

  public moveCardStage(id: string, targetStageId: string): void {
    this.updateCrmCard(id, { stageId: targetStageId });
  }

  public markCardWon(id: string, finalPrice?: number): void {
    const card = this.updateCrmCard(id, {
      stageId: 'fechamento',
      vehiclePrice: finalPrice || undefined,
    });

    if (card) {
      // 1. Update matching Lead status to 'Ganho'
      const leads = this.getLeads();
      const matched = leads.find((l) => l.name === card.contactName || l.phone === card.contactPhone);
      if (matched) {
        this.updateLead(matched.id, { status: 'Ganho' });
      }

      // 2. Update dashboard record to 'vendido'
      const records = this.getDashboardRecords();
      let recordUpdated = false;
      const updatedRecords = records.map((r) => {
        if (r.contactName === card.contactName || r.contactPhone === card.contactPhone) {
          recordUpdated = true;
          return {
            ...r,
            status: 'vendido' as const,
            isProposal: true,
            isVisited: true,
            vehiclePrice: finalPrice || r.vehiclePrice,
          };
        }
        return r;
      });

      if (!recordUpdated) {
        const newRecord: ExecutiveLeadRecord = {
          id: `rec-${Date.now()}`,
          contactName: card.contactName,
          contactPhone: card.contactPhone,
          contactEmail: card.contactEmail || '',
          vehicleId: 'veh-won',
          vehicleName: card.vehicleName || 'Veículo Negociado',
          vehiclePhoto: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=300&auto=format&fit=crop&q=80',
          vehiclePrice: finalPrice || card.vehiclePrice || 289900,
          origin: card.origin || 'Showroom',
          channelType: 'presencial',
          assignedTo: card.assignedTo || 'Rodrigo Mendes',
          unitId: card.unitId || 'unit-matriz',
          storeName: 'Matriz Sorocaba',
          team: 'Comercial',
          createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          dateOnly: new Date().toISOString().slice(0, 10),
          firstResponseTimeMinutes: 1.5,
          isAttended: true,
          isQualified: true,
          isScheduled: true,
          isVisited: true,
          isProposal: true,
          status: 'ganho',
          lastInteractionMinutesAgo: 1,
          daysInFunnel: 3,
        };
        updatedRecords.unshift(newRecord);
      }

      this.setStored(STORAGE_KEYS.DASHBOARD_RECORDS, updatedRecords);
    }
  }

  public markCardLost(id: string, lossReason: string): void {
    const card = this.updateCrmCard(id, {
      stageId: 'perdido',
      lossReason,
    });

    if (card) {
      // 1. Update matching Lead status to 'Perdido'
      const leads = this.getLeads();
      const matched = leads.find((l) => l.name === card.contactName || l.phone === card.contactPhone);
      if (matched) {
        this.updateLead(matched.id, {
          status: 'Perdido',
          notes: `${matched.notes || ''} [Perda: ${lossReason}]`,
        });
      }

      // 2. Update dashboard record to 'perdido' and attach lossReason
      const records = this.getDashboardRecords();
      const updatedRecords = records.map((r) => {
        if (r.contactName === card.contactName || r.contactPhone === card.contactPhone) {
          return {
            ...r,
            status: 'perdido' as const,
            lossReason,
          };
        }
        return r;
      });
      this.setStored(STORAGE_KEYS.DASHBOARD_RECORDS, updatedRecords);
    }
  }

  public deleteCrmCard(id: string): void {
    const cards = this.getCrmCards();
    const updated = cards.filter((c) => c.id !== id);
    this.setStored(STORAGE_KEYS.CRM_CARDS, updated);
  }

  public getCards(): CrmCard[] {
    return this.getCrmCards();
  }

  public saveCards(cards: CrmCard[]): void {
    this.setStored(STORAGE_KEYS.CRM_CARDS, cards);
  }

  // ==========================================
  // 4. CONTATOS 360º
  // ==========================================
  public getContacts(): Contact[] {
    return this.getStored<Contact[]>(STORAGE_KEYS.CONTACTS, initialContacts);
  }

  public addContact(contactData: Omit<Contact, 'id' | 'createdAt' | 'status' | 'totalPurchases' | 'vehiclesConsulted'>): Contact {
    const contacts = this.getContacts();
    const newContact: Contact = {
      ...contactData,
      id: `ct-${Date.now()}`,
      createdAt: 'Hoje',
      status: 'Ativo',
      totalPurchases: 0,
      vehiclesConsulted: [],
    };
    const updated = [newContact, ...contacts];
    this.setStored(STORAGE_KEYS.CONTACTS, updated);
    return newContact;
  }

  public updateContact(id: string, partial: Partial<Contact>): Contact | null {
    const contacts = this.getContacts();
    let updatedContact: Contact | null = null;
    const updated = contacts.map((c) => {
      if (c.id === id) {
        updatedContact = { ...c, ...partial };
        return updatedContact;
      }
      return c;
    });

    if (updatedContact) {
      this.setStored(STORAGE_KEYS.CONTACTS, updated);
    }
    return updatedContact;
  }

  public deleteContact(id: string): void {
    const contacts = this.getContacts();
    const updated = contacts.filter((c) => c.id !== id);
    this.setStored(STORAGE_KEYS.CONTACTS, updated);
  }

  // ==========================================
  // 5. TAREFAS COMERCIAIS
  // ==========================================
  public getCrmTasks(): CrmTask[] {
    return this.getStored<CrmTask[]>(STORAGE_KEYS.TASKS, initialCrmTasks);
  }

  public addCrmTask(taskData: Omit<CrmTask, 'id'>): CrmTask {
    const tasks = this.getCrmTasks();
    const newTask: CrmTask = {
      ...taskData,
      id: `task-${Date.now()}`,
    };
    const updated = [newTask, ...tasks];
    this.setStored(STORAGE_KEYS.TASKS, updated);
    return newTask;
  }

  public toggleCrmTaskStatus(id: string): void {
    const tasks = this.getCrmTasks();
    const updated = tasks.map((t) =>
      t.id === id
        ? { ...t, status: (t.status === 'Concluída' ? 'Hoje' : 'Concluída') as CrmTask['status'] }
        : t
    );
    this.setStored(STORAGE_KEYS.TASKS, updated);
  }

  public deleteCrmTask(id: string): void {
    const tasks = this.getCrmTasks();
    const updated = tasks.filter((t) => t.id !== id);
    this.setStored(STORAGE_KEYS.TASKS, updated);
  }

  // ==========================================
  // 6. AGENDAMENTOS VIP
  // ==========================================
  public getAppointments(): Appointment[] {
    return this.getStored<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
  }

  public addAppointment(aptData: Omit<Appointment, 'id'>): Appointment {
    const appointments = this.getAppointments();
    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
    };
    const updated = [newApt, ...appointments];
    this.setStored(STORAGE_KEYS.APPOINTMENTS, updated);

    // Sync matching Lead status to 'Agendado'
    const leads = this.getLeads();
    const matchedLead = leads.find((l) => l.name === newApt.contactName || l.phone === newApt.contactPhone);
    if (matchedLead) {
      this.updateLead(matchedLead.id, { status: 'Agendado' });
    }

    // Sync matching CRM Card stage to 'visita_agendada'
    const cards = this.getCrmCards();
    const matchedCard = cards.find((c) => c.contactName === newApt.contactName || c.contactPhone === newApt.contactPhone);
    if (matchedCard) {
      this.updateCrmCard(matchedCard.id, { stageId: 'visita_agendada' });
    }

    // Sync Dashboard records
    const records = this.getDashboardRecords();
    const updatedRecords = records.map((r) => {
      if (r.contactName === newApt.contactName || r.contactPhone === newApt.contactPhone) {
        return {
          ...r,
          isScheduled: true,
          status: 'agendado' as const,
        };
      }
      return r;
    });
    this.setStored(STORAGE_KEYS.DASHBOARD_RECORDS, updatedRecords);

    return newApt;
  }

  public deleteAppointment(id: string): void {
    const appointments = this.getAppointments();
    const updated = appointments.filter((a) => a.id !== id);
    this.setStored(STORAGE_KEYS.APPOINTMENTS, updated);
  }

  // ==========================================
  // 7. CONVERSAS & ATENDIMENTO
  // ==========================================
  public getConversations(): Conversation[] {
    return this.getStored<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, initialConversations);
  }

  public updateConversations(conversations: Conversation[]): void {
    this.setStored(STORAGE_KEYS.CONVERSATIONS, conversations);
  }

  public addMessageToConversation(convId: string, message: any): void {
    const convs = this.getConversations();
    const updated = convs.map((c) => {
      if (c.id === convId) {
        return {
          ...c,
          lastMessage: message.text,
          lastMessageTime: 'Agora',
          unreadCount: 0,
          messages: [...c.messages, message],
        };
      }
      return c;
    });
    this.setStored(STORAGE_KEYS.CONVERSATIONS, updated);
  }

  public updateConversation(convId: string, partial: Partial<Conversation>): void {
    const convs = this.getConversations();
    const updated = convs.map((c) => (c.id === convId ? { ...c, ...partial } : c));
    this.setStored(STORAGE_KEYS.CONVERSATIONS, updated);
  }

  public sendMessage(convId: string, textOrMsg: any, sender: string = 'agent', senderName?: string, extra?: any): void {
    const msgObj = typeof textOrMsg === 'string'
      ? {
          id: `msg-${Date.now()}`,
          sender: sender || 'agent',
          senderName: senderName || 'Você',
          text: textOrMsg,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          status: 'sent',
          ...(extra || {}),
        }
      : {
          id: `msg-${Date.now()}`,
          sender: sender || 'agent',
          senderName: senderName || 'Você',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          status: 'sent',
          ...textOrMsg,
          ...(extra || {}),
        };
    this.addMessageToConversation(convId, msgObj);
  }

  // ==========================================
  // 8. AUTOMAÇÕES
  // ==========================================
  public getAutomations(): AutomationRule[] {
    return this.getStored<AutomationRule[]>(STORAGE_KEYS.AUTOMATIONS, initialAutomations);
  }

  public addAutomation(ruleData: Omit<AutomationRule, 'id' | 'executionsCount' | 'lastExecuted'>): AutomationRule {
    const rules = this.getAutomations();
    const newRule: AutomationRule = {
      ...ruleData,
      id: `auto-${Date.now()}`,
      executionsCount: 0,
      lastExecuted: 'Criado agora',
    };
    const updated = [newRule, ...rules];
    this.setStored(STORAGE_KEYS.AUTOMATIONS, updated);
    return newRule;
  }

  public toggleAutomation(id: string): boolean {
    const rules = this.getAutomations();
    let newState = false;
    const updated = rules.map((r) => {
      if (r.id === id) {
        newState = !r.enabled;
        return { ...r, enabled: newState };
      }
      return r;
    });
    this.setStored(STORAGE_KEYS.AUTOMATIONS, updated);
    return newState;
  }

  public deleteAutomation(id: string): void {
    const rules = this.getAutomations();
    const updated = rules.filter((r) => r.id !== id);
    this.setStored(STORAGE_KEYS.AUTOMATIONS, updated);
  }

  // ==========================================
  // 9. MENSAGENS AGENDADAS
  // ==========================================
  public getScheduledMessages(): ScheduledMessageItem[] {
    return this.getStored<ScheduledMessageItem[]>(STORAGE_KEYS.SCHEDULED_MESSAGES, initialScheduledMessages);
  }

  public cancelScheduledMessage(id: string): void {
    const msgs = this.getScheduledMessages();
    const updated = msgs.filter((m) => m.id !== id);
    this.setStored(STORAGE_KEYS.SCHEDULED_MESSAGES, updated);
  }

  // ==========================================
  // 10. DASHBOARD EXECUTIVE RECORDS
  // ==========================================
  public getDashboardRecords(): ExecutiveLeadRecord[] {
    return this.getStored<ExecutiveLeadRecord[]>(STORAGE_KEYS.DASHBOARD_RECORDS, initialExecutiveRecords);
  }

  public addDashboardRecord(record: ExecutiveLeadRecord): void {
    const records = this.getDashboardRecords();
    const updated = [record, ...records];
    this.setStored(STORAGE_KEYS.DASHBOARD_RECORDS, updated);
  }

  // ==========================================
  // 11. CAMPANHAS DE TRANSMISSÃO
  // ==========================================
  public getBroadcastCampaigns(): BroadcastCampaignItem[] {
    return this.getStored<BroadcastCampaignItem[]>(STORAGE_KEYS.BROADCASTS, initialBroadcasts);
  }

  public addBroadcastCampaign(title: string): BroadcastCampaignItem {
    const broadcasts = this.getBroadcastCampaigns();
    const newBc: BroadcastCampaignItem = {
      id: `bc-${Date.now()}`,
      title,
      sent: 120,
      delivered: '100%',
      read: '92.5%',
      leadsGenerated: 14,
      sales: 1,
      status: 'Concluída',
    };
    const updated = [newBc, ...broadcasts];
    this.setStored(STORAGE_KEYS.BROADCASTS, updated);
    return newBc;
  }

  // ==========================================
  // 12. MARKETPLACE DE MÓDULOS
  // ==========================================
  public getMarketplaceModules<T>(defaultModules: T[]): T[] {
    return this.getStored<T[]>(STORAGE_KEYS.MARKETPLACE_MODULES, defaultModules);
  }

  public saveMarketplaceModules<T>(modules: T[]): void {
    this.setStored(STORAGE_KEYS.MARKETPLACE_MODULES, modules);
  }

  // ==========================================
  // 13. GESTÃO DE EMPRESAS & MULTI-TENANCY
  // ==========================================
  public getCompanies(): CompanyTenant[] {
    return this.getStored<CompanyTenant[]>(STORAGE_KEYS.COMPANIES, initialCompanies);
  }

  public getCompany(companyId: string): CompanyTenant | undefined {
    const companies = this.getCompanies();
    return companies.find((c) => c.id === companyId);
  }

  public updateCompany(companyId: string, partial: Partial<CompanyTenant>): void {
    const companies = this.getCompanies();
    const updated = companies.map((c) => (c.id === companyId ? { ...c, ...partial } : c));
    this.setStored(STORAGE_KEYS.COMPANIES, updated);
  }

  // ==========================================
  // 14. GESTÃO DE USUÁRIOS & EQUIPES (RBAC)
  // ==========================================
  public getUsers(): AuthUser[] {
    return this.getStored<AuthUser[]>(STORAGE_KEYS.USERS, initialAuthUsers);
  }

  public getTeamUsers(companyId?: string): AuthUser[] {
    const users = this.getUsers();
    if (!companyId || companyId === 'platform') {
      return users;
    }
    return users.filter((u) => u.companyId === companyId);
  }

  public getUserById(userId: string): AuthUser | undefined {
    const users = this.getUsers();
    return users.find((u) => u.id === userId);
  }

  public addUser(user: AuthUser, actorUser?: AuthUser): { success: boolean; error?: string } {
    const users = this.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (existing) {
      return { success: false, error: 'Já existe um usuário cadastrado com este e-mail corporativo.' };
    }

    // Tenant check user limit
    if (user.companyId && user.companyId !== 'platform') {
      const company = this.getCompany(user.companyId);
      if (company) {
        const currentCount = users.filter((u) => u.companyId === user.companyId && u.status !== 'Bloqueado').length;
        if (currentCount >= company.userLimit) {
          return {
            success: false,
            error: `Limite de usuários do plano (${company.userLimit} licenças) atingido para esta empresa.`,
          };
        }
      }
    }

    const updated = [user, ...users];
    this.setStored(STORAGE_KEYS.USERS, updated);

    // Audit log
    this.addAuditLog({
      userId: actorUser?.id || user.id,
      userName: actorUser?.name || user.name,
      userRole: actorUser?.role || user.role,
      companyId: user.companyId || 'tenant-1',
      companyName: user.company || 'Empresa',
      action: 'Criação de Usuário',
      module: 'Gestão de Equipe',
      targetRecord: `${user.name} (${user.role} - ${user.email})`,
      ipAddress: '189.40.122.9',
      result: 'Sucesso',
    });

    return { success: true };
  }

  public updateUser(userId: string, partial: Partial<AuthUser>, actorUser?: AuthUser): void {
    const users = this.getUsers();
    const targetUser = users.find((u) => u.id === userId);
    const updated = users.map((u) => (u.id === userId ? { ...u, ...partial } : u));
    this.setStored(STORAGE_KEYS.USERS, updated);

    if (targetUser) {
      this.addAuditLog({
        userId: actorUser?.id || 'usr-system',
        userName: actorUser?.name || 'Sistema',
        userRole: actorUser?.role || 'Gerente',
        companyId: targetUser.companyId || 'tenant-1',
        companyName: targetUser.company || 'Empresa',
        action: partial.status ? `Alteração de Status para ${partial.status}` : 'Edição de Cadastro de Usuário',
        module: 'Gestão de Equipe',
        targetRecord: `${targetUser.name} (${userId})`,
        ipAddress: '189.40.122.9',
        result: 'Sucesso',
      });
    }
  }

  // ==========================================
  // 15. REGRA DE HERANÇA DE PERMISSÕES
  // ==========================================
  public validatePermissionGrant(
    targetRole: CanonicalRole,
    proposedPermissions: UserPermissions,
    granterUser: AuthUser,
    company?: CompanyTenant
  ): { valid: boolean; violations: string[] } {
    const violations: string[] = [];

    // 1. Regra da Empresa: Módulos contratados no Plano/Empresa
    if (company) {
      if (!company.enabledModules.gridAi && proposedPermissions.gridAi?.useAi) {
        violations.push('Módulo Grid AI não contratado pela concessionária no plano atual.');
      }
      if (!company.enabledModules.estoque && (proposedPermissions.estoque?.view || proposedPermissions.estoque?.edit)) {
        violations.push('Módulo de Estoque não habilitado no plano da concessionária.');
      }
      if (!company.enabledModules.relatorios && proposedPermissions.relatorios?.export) {
        violations.push('Exportação de relatórios bloqueada pelo plano da empresa.');
      }
    }

    // 2. Regra do Concedente: Nenhum usuário pode conceder permissão superior à sua própria
    if (granterUser.canonicalRole !== 'platform_admin') {
      const granterPerms = granterUser.permissions || getDefaultPermissions(granterUser.canonicalRole || 'manager');

      // Check CRM
      if (!granterPerms.crm.delete && proposedPermissions.crm.delete) {
        violations.push('Você não pode conceder permissão de exclusão no CRM que você mesmo não possui.');
      }
      // Check Leads
      if (!granterPerms.leads.viewAll && proposedPermissions.leads.viewAll) {
        violations.push('Você não pode conceder visualização de todos os leads da empresa.');
      }
      if (!granterPerms.leads.delete && proposedPermissions.leads.delete) {
        violations.push('Você não pode conceder exclusão de leads.');
      }
      // Check Relatórios
      if (!granterPerms.relatorios.export && proposedPermissions.relatorios.export) {
        violations.push('Você não possui permissão para exportar relatórios.');
      }
      // Check Equipe
      if (!granterPerms.equipe.changePermissions && proposedPermissions.equipe.changePermissions) {
        violations.push('Apenas administradores ou gerentes com permissão podem delegar gestão de acessos.');
      }

      // Check Role hierarchy: Manager can only create/manage Supervisor, SDR, Salesperson
      if (targetRole === 'platform_admin') {
        violations.push('Gerentes não podem promover usuários a Administrador MotorGrid.');
      }
    }

    return {
      valid: violations.length === 0,
      violations,
    };
  }

  public updateUserPermissions(
    userId: string,
    permissions: UserPermissions,
    granterUser: AuthUser
  ): { success: boolean; error?: string } {
    const user = this.getUserById(userId);
    if (!user) {
      return { success: false, error: 'Usuário não encontrado.' };
    }

    const company = user.companyId ? this.getCompany(user.companyId) : undefined;
    const validation = this.validatePermissionGrant(
      user.canonicalRole || 'salesperson',
      permissions,
      granterUser,
      company
    );

    if (!validation.valid) {
      this.addAuditLog({
        userId: granterUser.id,
        userName: granterUser.name,
        userRole: granterUser.role,
        companyId: user.companyId || 'tenant-1',
        companyName: user.company,
        action: 'Tentativa Inválida de Alteração de Permissões (Violação de Herança)',
        module: 'Permissões RBAC',
        targetRecord: `${user.name} - ${validation.violations.join('; ')}`,
        ipAddress: '189.40.122.9',
        result: 'Bloqueado',
      });
      return { success: false, error: validation.violations.join(' ') };
    }

    this.updateUser(userId, { permissions }, granterUser);

    this.addAuditLog({
      userId: granterUser.id,
      userName: granterUser.name,
      userRole: granterUser.role,
      companyId: user.companyId || 'tenant-1',
      companyName: user.company,
      action: 'Atualização de Permissões Granulares (RBAC)',
      module: 'Permissões RBAC',
      targetRecord: `${user.name} (${user.role})`,
      ipAddress: '189.40.122.9',
      result: 'Sucesso',
    });

    return { success: true };
  }

  // ==========================================
  // 16. AUDITORIA OPERACIONAL & LOGS
  // ==========================================
  public getAuditLogs(companyId?: string): AuditLogEntry[] {
    const logs = this.getStored<AuditLogEntry[]>(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs);
    if (!companyId || companyId === 'platform') {
      return logs;
    }
    return logs.filter((l) => l.companyId === companyId || l.companyId === 'platform');
  }

  public addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'> & { timestamp?: string }): AuditLogEntry {
    const logs = this.getAuditLogs();
    const now = new Date();
    const timeString =
      entry.timestamp ||
      `Hoje às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: timeString,
      ...entry,
    };

    const updated = [newLog, ...logs.slice(0, 99)]; // retain last 100
    this.setStored(STORAGE_KEYS.AUDIT_LOGS, updated);
    return newLog;
  }
}

export const storageService = new StorageService();
