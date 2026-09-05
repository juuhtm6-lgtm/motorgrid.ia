import React, { useState, useEffect } from 'react';
import {
  initialMetrics,
  initialCustomers,
  initialDeals,
  initialTasks,
  initialInvoices,
  initialTeamMembers,
  initialWebhooks,
  initialNotifications,
  initialAuthUsers,
  initialLeads,
} from './data/mockData';
import {
  Customer,
  Deal,
  ProjectTask,
  Invoice,
  TeamMember,
  WebhookEndpoint,
  ActivityNotification,
  PipelineStage,
  TaskStatus,
  PlanTier,
  AuthUser,
  LeadItem,
  LeadStatus,
  ActiveTab,
  ThemeMode,
} from './types';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { CommandPalette } from './components/CommandPalette';
import { NotificationDrawer } from './components/NotificationDrawer';
import { CustomerDetailDrawer } from './components/CustomerDetailDrawer';
import { DashboardView } from './components/views/DashboardView';
import { AtendimentoView } from './components/views/AtendimentoView';
import { LeadsView } from './components/views/LeadsView';
import { PipelineView } from './components/views/PipelineView';
import { EstoqueView } from './components/views/EstoqueView';
import { AutomacaoView } from './components/views/AutomacaoView';
import { PerformanceView } from './components/views/PerformanceView';
import { CustomersView } from './components/views/CustomersView';
import { ProjectsView } from './components/views/ProjectsView';
import { BillingView } from './components/views/BillingView';
import { AiCopilotView } from './components/views/AiCopilotView';
import { ReportsView } from './components/views/ReportsView';
import { RelatoriosView } from './components/views/RelatoriosView';
import { MetaAdsView } from './components/views/MetaAdsView';
import { SettingsView } from './components/views/SettingsView';
import { NewCustomerModal } from './components/modals/NewCustomerModal';
import { NewTaskModal } from './components/modals/NewTaskModal';
import { CreateLeadModal } from './components/modals/CreateLeadModal';
import { CreateUserModal } from './components/modals/CreateUserModal';
import { LogoutConfirmModal } from './components/modals/LogoutConfirmModal';
import { AuthPortal } from './components/auth/AuthPortal';
import { MotorGridLoginView } from './components/auth/MotorGridLoginView';
import { SalesLandingPage } from './components/sales/SalesLandingPage';

export default function App() {
  // Authentication & Users State
  const [authUsers, setAuthUsers] = useState<AuthUser[]>(() => {
    try {
      const saved = localStorage.getItem('motorgrid_auth_users');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error reading auth users:', e);
    }
    return initialAuthUsers;
  });

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('motorgrid_current_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) return parsed;
      }
    } catch (e) {
      console.error('Error reading current user:', e);
    }
    return initialAuthUsers[0] || null;
  });

  // Modal States
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isCreateLeadModalOpen, setIsCreateLeadModalOpen] = useState(false);

  // Sync users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('motorgrid_auth_users', JSON.stringify(authUsers));
    } catch (e) {
      console.error('Error saving users:', e);
    }
  }, [authUsers]);

  // Sync currentUser to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('motorgrid_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('motorgrid_current_user');
      }
    } catch (e) {
      console.error('Error saving current user:', e);
    }
  }, [currentUser]);

  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Global Theme Mode State (dark | light) with localStorage Persistence
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('theme') || localStorage.getItem('motorgrid_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {
      console.error('Error reading theme from storage:', e);
    }
    return 'dark';
  });

  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
      localStorage.setItem('motorgrid_theme', theme);
    } catch (e) {
      console.error('Error writing theme to storage:', e);
    }

    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Application Data States
  const [metrics, setMetrics] = useState(initialMetrics);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [tasks, setTasks] = useState<ProjectTask[]>(initialTasks);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>(initialWebhooks);
  const [notifications, setNotifications] = useState<ActivityNotification[]>(initialNotifications);
  const [activePlan, setActivePlan] = useState<PlanTier>('Pro');
  const [activeChatConversationId, setActiveChatConversationId] = useState<string | null>(null);
  const [activeChatPhone, setActiveChatPhone] = useState<string | null>(null);

  const handleOpenChatFromLead = (lead: LeadItem) => {
    setActiveChatConversationId(lead.id);
    setActiveChatPhone(lead.phone);
    setActiveTab('atendimento');
  };

  // Command Palette Keyboard Shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auth Handlers
  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    const newNotif: ActivityNotification = {
      id: `notif-${Date.now()}`,
      title: 'Sessão Autenticada',
      description: `Bem-vindo de volta, ${user.name}! Login efetuado com sucesso.`,
      timestamp: 'Agora',
      type: 'system',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleRegister = (newUser: AuthUser) => {
    setAuthUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);

    // Also add to team members
    const teamMember: TeamMember = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      team: newUser.team || 'Comercial',
      unitId: newUser.unitId || 'unit-1',
      phone: newUser.phone || '',
      status: 'Ativo',
      avatar: newUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      lastLogin: 'Agora',
    };
    setTeamMembers((prev) => [...prev, teamMember]);

    const newNotif: ActivityNotification = {
      id: `notif-${Date.now()}`,
      title: 'Nova Conta Criada & Autenticada',
      description: `Usuário ${newUser.name} registrado com o cargo de ${newUser.role}.`,
      timestamp: 'Agora',
      type: 'system',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleCreateUser = (newUser: AuthUser) => {
    setAuthUsers((prev) => [...prev, newUser]);

    const teamMember: TeamMember = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      team: newUser.team || 'Comercial',
      unitId: newUser.unitId || 'unit-1',
      phone: newUser.phone || '',
      status: 'Ativo',
      avatar: newUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      lastLogin: 'Nunca',
    };
    setTeamMembers((prev) => [...prev, teamMember]);

    const newNotif: ActivityNotification = {
      id: `notif-${Date.now()}`,
      title: 'Novo Usuário Criado',
      description: `${newUser.name} (${newUser.role}) foi adicionado com sucesso ao MotorGrid.`,
      timestamp: 'Agora',
      type: 'system',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleSwitchUser = (user: AuthUser) => {
    setCurrentUser(user);
    const newNotif: ActivityNotification = {
      id: `notif-${Date.now()}`,
      title: 'Alternância de Perfil',
      description: `Você agora está operando como ${user.name} (${user.role}).`,
      timestamp: 'Agora',
      type: 'system',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleConfirmLogout = () => {
    const prevName = currentUser?.name || 'Usuário';
    try {
      localStorage.removeItem('motorgrid_current_user');
    } catch (e) {
      console.error('Error clearing storage on logout:', e);
    }
    setCurrentUser(null);
    setUnauthenticatedScreen('login');
    setIsLogoutModalOpen(false);

    const newNotif: ActivityNotification = {
      id: `notif-${Date.now()}`,
      title: 'Sessão Encerrada',
      description: `O usuário ${prevName} desconectou da plataforma.`,
      timestamp: 'Agora',
      type: 'system',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Leads Handlers
  const handleAddLead = (newLeadData: Omit<LeadItem, 'id' | 'createdAt' | 'lastContact'>) => {
    const created: LeadItem = {
      ...newLeadData,
      id: `lead-${Date.now()}`,
      createdAt: 'Agora mesmo',
      lastContact: 'Criado agora',
    };
    setLeads((prev) => [created, ...prev]);

    // Add notification
    const newNotif: ActivityNotification = {
      id: `notif-${Date.now()}`,
      title: 'Novo Lead Registrado',
      description: `${created.name} (${created.company}) com ${created.fleetSize} veículos cadastrado.`,
      timestamp: 'Agora',
      type: 'lead',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleUpdateLeadStatus = (id: string, status: LeadStatus) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const handleConvertLeadToCustomer = (lead: LeadItem) => {
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      plan: lead.fleetSize > 40 ? 'Enterprise' : 'Pro',
      status: 'Ativo',
      mrr: lead.estimatedValue,
      vehiclesCount: lead.fleetSize,
      healthScore: 95,
      joinedDate: 'Hoje',
      lastContact: 'Agora',
      segment: 'Transporte & Frotas',
      contractRenewal: '2027-02-28',
      assignedTo: lead.assignedTo,
      notes: `Convertido a partir de Lead (${lead.source}). ${lead.notes || ''}`,
    };

    setCustomers((prev) => [newCust, ...prev]);
    handleUpdateLeadStatus(lead.id, 'Ganho');

    // Update metrics
    setMetrics((prev) => ({
      ...prev,
      mrr: prev.mrr + newCust.mrr,
      arr: (prev.mrr + newCust.mrr) * 12,
      activeCustomers: prev.activeCustomers + 1,
    }));

    const newNotif: ActivityNotification = {
      id: `notif-${Date.now()}`,
      title: 'Lead Convertido em Cliente!',
      description: `${lead.company} assinou contrato de R$ ${lead.estimatedValue.toLocaleString('pt-BR')}/mês!`,
      timestamp: 'Agora',
      type: 'lead',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Data Handlers
  const handleAddCustomer = (newCust: Omit<Customer, 'id' | 'healthScore'>) => {
    const created: Customer = {
      ...newCust,
      id: `cust-${Date.now()}`,
      healthScore: 92,
    };
    setCustomers((prev) => [created, ...prev]);

    // Recalculate metrics
    setMetrics((prev) => ({
      ...prev,
      mrr: prev.mrr + newCust.mrr,
      arr: (prev.mrr + newCust.mrr) * 12,
      activeCustomers: prev.activeCustomers + 1,
    }));

    const newNotif: ActivityNotification = {
      id: `notif-${Date.now()}`,
      title: 'Novo Cliente Cadastrado',
      description: `${created.company} (${created.name}) contratou o plano ${created.plan}.`,
      timestamp: 'Agora',
      type: 'lead',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleAddTask = (newTask: Omit<ProjectTask, 'id'>) => {
    const created: ProjectTask = {
      ...newTask,
      id: `task-${Date.now()}`,
    };
    setTasks((prev) => [created, ...prev]);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          subtasks: t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          ),
        };
      })
    );
  };

  const handleUpdateDealStage = (dealId: string, newStage: PipelineStage) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d))
    );
  };

  const handleAddTeamMember = (member: Omit<TeamMember, 'id'>) => {
    const created: TeamMember = {
      ...member,
      id: `usr-${Date.now()}`,
    };
    setTeamMembers((prev) => [...prev, created]);
  };

  const handleAddWebhook = (webhook: Omit<WebhookEndpoint, 'id'>) => {
    const created: WebhookEndpoint = {
      ...webhook,
      id: `whk-${Date.now()}`,
    };
    setWebhooks((prev) => [...prev, created]);
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleUpgradePlan = (newPlan: PlanTier) => {
    setActivePlan(newPlan);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const customersRiskCount = customers.filter((c) => c.healthScore < 60).length;

  // Unauthenticated view toggle ('login' | 'sales')
  const [unauthenticatedScreen, setUnauthenticatedScreen] = useState<'login' | 'sales'>('login');

  // If not authenticated, display official MotorGrid Login View
  if (!currentUser) {
    if (unauthenticatedScreen === 'sales') {
      return (
        <SalesLandingPage
          onLogin={handleLogin}
          onRegister={handleRegister}
          availableUsers={authUsers}
          currentUser={null}
          onGoToDashboard={() => setUnauthenticatedScreen('login')}
        />
      );
    }

    return (
      <MotorGridLoginView
        onLogin={handleLogin}
        availableUsers={authUsers}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onNavigateToPlans={() => setUnauthenticatedScreen('sales')}
      />
    );
  }

  return (
    <div className="flex h-screen bg-[#F7F8FC] dark:bg-[#0A0A0B] text-slate-900 dark:text-zinc-100 font-sans antialiased overflow-hidden selection:bg-[#8B5CF6] selection:text-white">
      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        setActiveTab={setActiveTab}
        customers={customers}
        tasks={tasks}
        onSelectCustomer={(c) => {
          setSelectedCustomer(c);
          setIsCommandOpen(false);
        }}
        onOpenNewCustomer={() => {
          setIsCommandOpen(false);
          setIsNewCustomerModalOpen(true);
        }}
        onOpenNewTask={() => {
          setIsCommandOpen(false);
          setIsNewTaskModalOpen(true);
        }}
        onOpenCreateUser={() => {
          setIsCommandOpen(false);
          setIsCreateUserModalOpen(true);
        }}
        onOpenLogoutModal={() => {
          setIsCommandOpen(false);
          setIsLogoutModalOpen(true);
        }}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onClearAll={handleClearAllNotifications}
      />

      {/* Customer Detail Drawer */}
      <CustomerDetailDrawer
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        invoices={invoices}
        onUpdateNotes={(id, notes) => {
          setCustomers((prev) =>
            prev.map((c) => (c.id === id ? { ...c, notes } : c))
          );
          if (selectedCustomer && selectedCustomer.id === id) {
            setSelectedCustomer((prev) => (prev ? { ...prev, notes } : null));
          }
        }}
      />

      {/* New Lead Modal */}
      <CreateLeadModal
        isOpen={isCreateLeadModalOpen}
        onClose={() => setIsCreateLeadModalOpen(false)}
        onCreateLead={handleAddLead}
      />

      {/* New Customer Modal */}
      <NewCustomerModal
        isOpen={isNewCustomerModalOpen}
        onClose={() => setIsNewCustomerModalOpen(false)}
        onAddCustomer={handleAddCustomer}
      />

      {/* New Task Modal */}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        teamMembers={teamMembers}
        onAddTask={handleAddTask}
      />

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        onCreateUser={handleCreateUser}
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        onConfirmLogout={handleConfirmLogout}
        user={currentUser}
        theme={theme}
      />

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        customersRiskCount={customersRiskCount}
        unreadNotifications={unreadCount}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        currentUser={currentUser}
        onOpenCreateUser={() => setIsCreateUserModalOpen(true)}
        onOpenLogoutModal={() => setIsLogoutModalOpen(true)}
        availableUsers={authUsers}
        onSwitchUser={handleSwitchUser}
        onOpenNewLead={() => setIsCreateLeadModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#F7F8FC] dark:bg-[#0A0A0B] bg-motorgrid-pattern">
        {/* Top Navbar */}
        <Navbar
          activeTab={activeTab}
          onOpenCommandPalette={() => setIsCommandOpen(true)}
          onOpenNotifications={() => setIsNotificationOpen(true)}
          unreadNotifications={unreadCount}
          onOpenNewCustomer={() => setIsNewCustomerModalOpen(true)}
          onOpenNewTask={() => setIsNewTaskModalOpen(true)}
          onOpenAiCopilot={() => setActiveTab('ai-copilot')}
          currentUser={currentUser}
          onOpenCreateUser={() => setIsCreateUserModalOpen(true)}
          onOpenLogoutModal={() => setIsLogoutModalOpen(true)}
          availableUsers={authUsers}
          onSwitchUser={handleSwitchUser}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              metrics={metrics}
              customers={customers}
              invoices={invoices}
              deals={deals}
              onOpenCustomerDetail={setSelectedCustomer}
              onOpenAiCopilot={() => setActiveTab('ai-copilot')}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'atendimento' && (
            <AtendimentoView
              initialConversationId={activeChatConversationId}
              initialLeadPhone={activeChatPhone}
            />
          )}

          {activeTab === 'leads' && (
            <LeadsView
              theme={theme}
              leads={leads}
              onOpenNewLead={() => setIsCreateLeadModalOpen(true)}
              onOpenChat={handleOpenChatFromLead}
              onConvertToCustomer={handleConvertLeadToCustomer}
              onUpdateLeadStatus={handleUpdateLeadStatus}
            />
          )}

          {activeTab === 'pipeline' && (
            <PipelineView
              deals={deals}
              onUpdateDealStage={handleUpdateDealStage}
              onOpenNewDeal={() => setIsCreateLeadModalOpen(true)}
            />
          )}

          {activeTab === 'estoque' && (
            <EstoqueView />
          )}

          {activeTab === 'automacao' && (
            <AutomacaoView />
          )}

          {activeTab === 'performance' && (
            <PerformanceView metrics={metrics} />
          )}

          {activeTab === 'customers' && (
            <CustomersView
              customers={customers}
              deals={deals}
              onOpenNewCustomer={() => setIsNewCustomerModalOpen(true)}
              onOpenCustomerDetail={setSelectedCustomer}
              onUpdateCustomerStatus={(id, status) => {
                setCustomers((prev) =>
                  prev.map((c) => (c.id === id ? { ...c, status } : c))
                );
              }}
              onUpdateDealStage={handleUpdateDealStage}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsView
              tasks={tasks}
              onOpenNewTask={() => setIsNewTaskModalOpen(true)}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onToggleSubtask={handleToggleSubtask}
            />
          )}

          {activeTab === 'billing' && (
            <BillingView
              invoices={invoices}
              activePlan={activePlan}
              onUpgradePlan={handleUpgradePlan}
            />
          )}

          {activeTab === 'ai-copilot' && (
            <AiCopilotView
              metrics={metrics}
              customers={customers}
            />
          )}

          {activeTab === 'sales' && (
            <div className="-m-4 sm:-m-6 lg:-m-8 -mt-6">
              <SalesLandingPage
                onLogin={handleLogin}
                onRegister={handleRegister}
                availableUsers={authUsers}
                currentUser={currentUser}
                onGoToDashboard={() => setActiveTab('dashboard')}
                onLogout={() => setIsLogoutModalOpen(true)}
              />
            </div>
          )}

          {activeTab === 'reports' && (
            <ReportsView metrics={metrics} />
          )}

          {activeTab === 'relatorios' && (
            <RelatoriosView />
          )}

          {activeTab === 'meta-ads' && (
            <MetaAdsView
              key="meta-ads"
              initialSubTab="dashboard-ads"
              onNavigateToChat={(l) =>
                handleOpenChatFromLead({
                  id: l.id,
                  name: l.name,
                  phone: l.phone,
                  company: '',
                  email: '',
                  estimatedValue: 0,
                  fleetSize: 0,
                  status: 'Novo',
                  source: 'Tráfego Pago',
                  createdAt: '',
                  lastContact: '',
                  assignedTo: '',
                })
              }
            />
          )}

          {activeTab === 'campanhas' && (
            <MetaAdsView
              key="campanhas"
              initialSubTab="campanhas"
              onNavigateToChat={(l) =>
                handleOpenChatFromLead({
                  id: l.id,
                  name: l.name,
                  phone: l.phone,
                  company: '',
                  email: '',
                  estimatedValue: 0,
                  fleetSize: 0,
                  status: 'Novo',
                  source: 'Tráfego Pago',
                  createdAt: '',
                  lastContact: '',
                  assignedTo: '',
                })
              }
            />
          )}

          {activeTab === 'anuncios' && (
            <MetaAdsView
              key="anuncios"
              initialSubTab="anuncios"
              onNavigateToChat={(l) =>
                handleOpenChatFromLead({
                  id: l.id,
                  name: l.name,
                  phone: l.phone,
                  company: '',
                  email: '',
                  estimatedValue: 0,
                  fleetSize: 0,
                  status: 'Novo',
                  source: 'Tráfego Pago',
                  createdAt: '',
                  lastContact: '',
                  assignedTo: '',
                })
              }
            />
          )}

          {activeTab === 'relatorio-leads' && (
            <MetaAdsView
              key="relatorio-leads"
              initialSubTab="relatorio-leads"
              onNavigateToChat={(l) =>
                handleOpenChatFromLead({
                  id: l.id,
                  name: l.name,
                  phone: l.phone,
                  company: '',
                  email: '',
                  estimatedValue: 0,
                  fleetSize: 0,
                  status: 'Novo',
                  source: 'Tráfego Pago',
                  createdAt: '',
                  lastContact: '',
                  assignedTo: '',
                })
              }
            />
          )}

          {activeTab === 'conversoes' && (
            <MetaAdsView
              key="conversoes"
              initialSubTab="funil-comercial"
              onNavigateToChat={(l) =>
                handleOpenChatFromLead({
                  id: l.id,
                  name: l.name,
                  phone: l.phone,
                  company: '',
                  email: '',
                  estimatedValue: 0,
                  fleetSize: 0,
                  status: 'Novo',
                  source: 'Tráfego Pago',
                  createdAt: '',
                  lastContact: '',
                  assignedTo: '',
                })
              }
            />
          )}

          {activeTab === 'vendedores' && (
            <MetaAdsView
              key="vendedores"
              initialSubTab="rankings"
              onNavigateToChat={(l) =>
                handleOpenChatFromLead({
                  id: l.id,
                  name: l.name,
                  phone: l.phone,
                  company: '',
                  email: '',
                  estimatedValue: 0,
                  fleetSize: 0,
                  status: 'Novo',
                  source: 'Tráfego Pago',
                  createdAt: '',
                  lastContact: '',
                  assignedTo: '',
                })
              }
            />
          )}

          {activeTab === 'funil-comercial' && (
            <MetaAdsView
              key="funil-comercial"
              initialSubTab="funil-comercial"
              onNavigateToChat={(l) =>
                handleOpenChatFromLead({
                  id: l.id,
                  name: l.name,
                  phone: l.phone,
                  company: '',
                  email: '',
                  estimatedValue: 0,
                  fleetSize: 0,
                  status: 'Novo',
                  source: 'Tráfego Pago',
                  createdAt: '',
                  lastContact: '',
                  assignedTo: '',
                })
              }
            />
          )}

          {activeTab === 'login' && (
            <div className="py-4">
              <MotorGridLoginView
                onLogin={handleLogin}
                availableUsers={authUsers}
                theme={theme}
                onToggleTheme={handleToggleTheme}
                onNavigateToPlans={() => setActiveTab('sales')}
              />
            </div>
          )}

          {(activeTab === 'administracao' || activeTab === 'settings') && (
            <SettingsView
              theme={theme}
              teamMembers={teamMembers}
              webhooks={webhooks}
              onAddTeamMember={handleAddTeamMember}
              onAddWebhook={handleAddWebhook}
              currentUser={currentUser}
              onOpenCreateUser={() => setIsCreateUserModalOpen(true)}
              onOpenLogoutModal={() => setIsLogoutModalOpen(true)}
              authUsers={authUsers}
            />
          )}
        </main>
      </div>
    </div>
  );
}

