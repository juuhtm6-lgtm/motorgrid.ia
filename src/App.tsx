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
} from './types';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { CommandPalette } from './components/CommandPalette';
import { NotificationDrawer } from './components/NotificationDrawer';
import { CustomerDetailDrawer } from './components/CustomerDetailDrawer';
import { DashboardView } from './components/views/DashboardView';
import { CustomersView } from './components/views/CustomersView';
import { ProjectsView } from './components/views/ProjectsView';
import { BillingView } from './components/views/BillingView';
import { AiCopilotView } from './components/views/AiCopilotView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';
import { NewCustomerModal } from './components/modals/NewCustomerModal';
import { NewTaskModal } from './components/modals/NewTaskModal';

export default function App() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Application Data States
  const [metrics, setMetrics] = useState(initialMetrics);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [tasks, setTasks] = useState<ProjectTask[]>(initialTasks);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>(initialWebhooks);
  const [notifications, setNotifications] = useState<ActivityNotification[]>(initialNotifications);
  const [activePlan, setActivePlan] = useState<PlanTier>('Pro');

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

  // Handlers
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

    // Add activity notification
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

  return (
    <div className="flex h-screen bg-[#0A0A0B] text-zinc-100 font-sans antialiased overflow-hidden selection:bg-[#8B5CF6] selection:text-white">
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

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        customersRiskCount={customersRiskCount}
        unreadNotifications={unreadCount}
        onOpenNotifications={() => setIsNotificationOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#0A0A0B] bg-motorgrid-pattern">
        {/* Top Navbar */}
        <Navbar
          activeTab={activeTab}
          onOpenCommandPalette={() => setIsCommandOpen(true)}
          onOpenNotifications={() => setIsNotificationOpen(true)}
          unreadNotifications={unreadCount}
          onOpenNewCustomer={() => setIsNewCustomerModalOpen(true)}
          onOpenNewTask={() => setIsNewTaskModalOpen(true)}
          onOpenAiCopilot={() => setActiveTab('ai-copilot')}
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

          {activeTab === 'reports' && (
            <ReportsView metrics={metrics} />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              teamMembers={teamMembers}
              webhooks={webhooks}
              onAddTeamMember={handleAddTeamMember}
              onAddWebhook={handleAddWebhook}
            />
          )}
        </main>
      </div>
    </div>
  );
}
