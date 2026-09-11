import React, { useState, useEffect } from 'react';
import {
  Search,
  Users,
  KanbanSquare,
  CreditCard,
  Sparkles,
  BarChart3,
  Settings,
  Plus,
  ArrowRight,
  Zap,
  Building2,
  UserPlus,
  LogOut,
  Globe,
  MessageSquare,
  GitPullRequest,
  Car,
  Cloud,
  TrendingUp,
  Share2,
} from 'lucide-react';
import { ActiveTab, Customer, ProjectTask } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  customers: Customer[];
  tasks: ProjectTask[];
  onSelectCustomer: (customer: Customer) => void;
  onOpenNewCustomer: () => void;
  onOpenNewTask: () => void;
  onOpenCreateUser?: () => void;
  onOpenLogoutModal?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  setActiveTab,
  customers,
  tasks,
  onSelectCustomer,
  onOpenNewCustomer,
  onOpenNewTask,
  onOpenCreateUser,
  onOpenLogoutModal,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.company.toLowerCase().includes(query.toLowerCase()) ||
      c.plan.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.project.toLowerCase().includes(query.toLowerCase())
  );

  const quickNav = [
    { label: 'Ir para Dashboard', tab: 'dashboard' as ActiveTab, icon: Zap },
    { label: 'Ir para Atendimento (WhatsApp / Suporte)', tab: 'atendimento' as ActiveTab, icon: MessageSquare },
    { label: 'Ir para Leads', tab: 'leads' as ActiveTab, icon: UserPlus },
    { label: 'Ir para Pipeline & Funil', tab: 'pipeline' as ActiveTab, icon: GitPullRequest },
    { label: 'Ir para Estoque de Rastreadores', tab: 'estoque' as ActiveTab, icon: Car },
    { label: 'Ir para Automação', tab: 'automacao' as ActiveTab, icon: Cloud },
    { label: 'Ir para Performance', tab: 'performance' as ActiveTab, icon: TrendingUp },
    { label: 'Ir para Gestão de Equipe', tab: 'equipe' as ActiveTab, icon: Users },
    { label: 'Ir para Administração', tab: 'administracao' as ActiveTab, icon: Settings },
    { label: 'Ir para Meta API (Conexões Meta)', tab: 'meta-api' as ActiveTab, icon: Share2 },
    { label: 'Ir para Clientes & CRM', tab: 'customers' as ActiveTab, icon: Users },
    { label: 'Ir para Operações & Sprints', tab: 'projects' as ActiveTab, icon: KanbanSquare },
    { label: 'Ir para Planos & Faturamento', tab: 'billing' as ActiveTab, icon: CreditCard },
    { label: 'Abrir Copilot IA Gemini', tab: 'ai-copilot' as ActiveTab, icon: Sparkles },
    { label: 'Ver Página de Vendas & Planos', tab: 'sales' as ActiveTab, icon: Globe },
    { label: 'Ir para Relatórios > Meta Ads (Facebook & Instagram)', tab: 'meta-ads' as ActiveTab, icon: Globe },
    { label: 'Ir para Relatórios > Campanhas', tab: 'campanhas' as ActiveTab, icon: BarChart3 },
    { label: 'Ir para Relatórios > Funil Comercial Meta + CRM', tab: 'funil-comercial' as ActiveTab, icon: TrendingUp },
    { label: 'Ir para Relatórios & Métricas', tab: 'reports' as ActiveTab, icon: BarChart3 },
    { label: 'Ir para Configurações', tab: 'settings' as ActiveTab, icon: Settings },
  ].filter((n) => n.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="fixed inset-0 -z-10"
        onClick={onClose}
      />
      <div
        id="command-palette-modal"
        className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-950/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Digite para buscar páginas, clientes, tarefas ou ações..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <kbd className="px-2 py-1 text-[11px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Quick Actions */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
              Ações Rápidas
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              <button
                id="cmd-new-user-btn"
                onClick={() => {
                  onClose();
                  onOpenCreateUser?.();
                }}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors text-left cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-[#A78BFA]" />
                Criar Novo Usuário / Operador
              </button>
              <button
                id="cmd-new-customer-btn"
                onClick={() => {
                  onClose();
                  onOpenNewCustomer();
                }}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors text-left cursor-pointer"
              >
                <Plus className="w-4 h-4 text-blue-400" />
                Cadastrar Novo Cliente
              </button>
              <button
                id="cmd-new-task-btn"
                onClick={() => {
                  onClose();
                  onOpenNewTask();
                }}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors text-left cursor-pointer"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                Adicionar Nova Tarefa
              </button>
              <button
                id="cmd-logout-btn"
                onClick={() => {
                  onClose();
                  onOpenLogoutModal?.();
                }}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                Sair da Conta (Logout)
              </button>
            </div>
          </div>

          {/* Navigation */}
          {quickNav.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                Navegação
              </div>
              <div className="space-y-1">
                {quickNav.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveTab(item.tab);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-slate-400" />
                        <span>{item.label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customers matches */}
          {filteredCustomers.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                Clientes & Contas ({filteredCustomers.length})
              </div>
              <div className="space-y-1">
                {filteredCustomers.slice(0, 4).map((customer) => (
                  <button
                    key={customer.id}
                    onClick={() => {
                      setActiveTab('customers');
                      onSelectCustomer(customer);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <div className="truncate">
                        <span className="font-semibold text-slate-200">{customer.company}</span>
                        <span className="text-slate-500 ml-2 text-[11px]">({customer.name})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {customer.plan}
                      </span>
                      <span className="font-mono text-emerald-400 text-[11px]">
                        R$ {customer.mrr.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks matches */}
          {filteredTasks.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                Tarefas Operacionais ({filteredTasks.length})
              </div>
              <div className="space-y-1">
                {filteredTasks.slice(0, 3).map((task) => (
                  <button
                    key={task.id}
                    onClick={() => {
                      setActiveTab('projects');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors text-left"
                  >
                    <span className="truncate text-slate-300 font-medium">{task.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400">
                      {task.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Dica: Use <strong>Ctrl + K</strong> a qualquer momento para abrir</span>
          <span>PulseSaaS v2.4</span>
        </div>
      </div>
    </div>
  );
};
