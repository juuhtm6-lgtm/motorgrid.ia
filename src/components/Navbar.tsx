import React, { useState } from 'react';
import {
  Search,
  Plus,
  Bell,
  Sparkles,
  UserPlus,
  CheckSquare,
  Command,
  Activity,
  Layers,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react';
import { ActiveTab } from './Sidebar';
import { AuthUser } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  onOpenCommandPalette: () => void;
  onOpenNotifications: () => void;
  unreadNotifications: number;
  onOpenNewCustomer: () => void;
  onOpenNewTask: () => void;
  onOpenAiCopilot: () => void;
  currentUser: AuthUser | null;
  onOpenCreateUser: () => void;
  onOpenLogoutModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onOpenCommandPalette,
  onOpenNotifications,
  unreadNotifications,
  onOpenNewCustomer,
  onOpenNewTask,
  onOpenAiCopilot,
  currentUser,
  onOpenCreateUser,
  onOpenLogoutModal,
}) => {
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Painel Executivo de Telemetria & Receita', subtitle: 'MRR, saúde de frotas ativas e telemetria de veículos conectados' };
      case 'customers':
        return { title: 'Gestão de Frotas, Concessionárias & Clientes', subtitle: 'Base de contas ativas, contratos de telemetria e estágios de pipeline' };
      case 'projects':
        return { title: 'Operações & Sprints IoT', subtitle: 'Acompanhamento de implantações, homologação de sensores e sprints' };
      case 'billing':
        return { title: 'Planos & Faturamento MotorGrid', subtitle: 'Gestão de assinaturas de frotas, cobranças PIX/Cartão e faturas fiscais' };
      case 'ai-copilot':
        return { title: 'Copilot IA Gemini 3.7 - MotorGrid Intelligence', subtitle: 'Diagnósticos automotivos preditivos, mitigação de churn e estratégias B2B' };
      case 'reports':
        return { title: 'Relatórios & Análise de Safra / Coortes', subtitle: 'Retenção NRR, métricas LTV/CAC e telemetria avançada de dispositivos' };
      case 'settings':
        return { title: 'Configurações do Workspace & Design System', subtitle: 'Equipe de engenharia, credenciais de API, webhooks e tokens de integração' };
      case 'sales':
        return { title: 'Página de Vendas & Planos Comerciais', subtitle: 'Landing page pública com simulador de ROI, planos e login/checkout integrado' };
      default:
        return { title: 'MotorGrid', subtitle: 'Automotive Technology' };
    }
  };

  const { title, subtitle } = getTabTitle();

  return (
    <header id="main-navbar" className="h-16 px-4 sm:px-6 border-b border-[#8B5CF6]/15 bg-[#1C1C1E]/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-20">
      {/* Title & Breadcrumb */}
      <div className="flex flex-col">
        <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
          {title}
        </h1>
        <p className="text-xs text-zinc-400 hidden sm:block font-medium">{subtitle}</p>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Search trigger button styled after MotorGrid Design System */}
        <button
          id="navbar-search-btn"
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#0A0A0B] hover:bg-zinc-900 border border-zinc-700/80 hover:border-[#8B5CF6]/40 text-zinc-400 hover:text-zinc-200 text-xs transition-all group cursor-pointer shadow-inner"
        >
          <Search className="w-3.5 h-3.5 text-[#A78BFA] group-hover:text-[#8B5CF6] transition-colors" />
          <span className="hidden lg:inline text-zinc-400">Buscar frotas, clientes ou sensores...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono rounded bg-zinc-800 text-[#C4B5FD] border border-zinc-700">
            <Command className="w-3 h-3" /> K
          </kbd>
        </button>

        {/* AI Quick Button */}
        <button
          id="navbar-ai-copilot-btn"
          onClick={onOpenAiCopilot}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#8B5CF6]/20 to-[#6D28D9]/30 hover:from-[#8B5CF6]/35 hover:to-[#6D28D9]/45 border border-[#8B5CF6]/40 text-[#EDE9FE] text-xs font-semibold transition-all shadow-sm cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C4B5FD] animate-pulse" />
          <span className="hidden sm:inline">Copilot IA</span>
        </button>

        {/* Quick Add Dropdown */}
        <div className="relative">
          <button
            id="navbar-quick-add-btn"
            onClick={() => setQuickMenuOpen(!quickMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold shadow-lg shadow-[#8B5CF6]/25 hover:shadow-[#8B5CF6]/40 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Criar</span>
          </button>

          {quickMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setQuickMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#1C1C1E] border border-[#8B5CF6]/30 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  id="quick-add-user-btn"
                  onClick={() => {
                    setQuickMenuOpen(false);
                    onOpenCreateUser();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#DDD6FE] hover:text-white hover:bg-[#8B5CF6]/25 rounded-lg transition-colors text-left"
                >
                  <UserPlus className="w-4 h-4 text-[#8B5CF6]" />
                  Novo Usuário / Operador
                </button>
                <div className="my-1 border-t border-zinc-800" />
                <button
                  id="quick-add-customer-btn"
                  onClick={() => {
                    setQuickMenuOpen(false);
                    onOpenNewCustomer();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-200 hover:text-white hover:bg-[#8B5CF6]/20 rounded-lg transition-colors text-left"
                >
                  <UserPlus className="w-4 h-4 text-[#A78BFA]" />
                  Novo Cliente / Frota
                </button>
                <button
                  id="quick-add-task-btn"
                  onClick={() => {
                    setQuickMenuOpen(false);
                    onOpenNewTask();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-200 hover:text-white hover:bg-[#8B5CF6]/20 rounded-lg transition-colors text-left"
                >
                  <CheckSquare className="w-4 h-4 text-[#C4B5FD]" />
                  Nova Tarefa / Sprint
                </button>
                <div className="my-1 border-t border-zinc-800" />
                <button
                  id="quick-add-insight-btn"
                  onClick={() => {
                    setQuickMenuOpen(false);
                    onOpenAiCopilot();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#C4B5FD] hover:text-white hover:bg-[#8B5CF6]/30 rounded-lg transition-colors text-left"
                >
                  <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                  Diagnóstico IA de Frotas
                </button>
              </div>
            </>
          )}
        </div>

        {/* Notifications Bell */}
        <button
          id="navbar-notifications-bell-btn"
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl bg-[#0A0A0B] hover:bg-zinc-800 border border-zinc-700/80 hover:border-[#8B5CF6]/30 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          title="Notificações operacionais"
        >
          <Bell className="w-4 h-4 text-[#A78BFA]" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#8B5CF6] rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-[#1C1C1E] shadow-[0_0_6px_#8B5CF6]">
              {unreadNotifications}
            </span>
          )}
        </button>

        {/* Authenticated User Menu Dropdown & Logout */}
        <div className="relative">
          <button
            id="navbar-user-avatar-btn"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-xl bg-[#0A0A0B] hover:bg-zinc-800 border border-zinc-700/80 hover:border-[#8B5CF6]/40 transition-all cursor-pointer group"
          >
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-[#8B5CF6]/40"
              />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-[#8B5CF6]/30 text-[#DDD6FE] flex items-center justify-center text-xs font-bold">
                {currentUser?.name ? currentUser.name[0] : 'U'}
              </div>
            )}
            <span className="hidden md:inline text-xs font-semibold text-zinc-200 max-w-[100px] truncate">
              {currentUser?.name?.split(' ')[0] || 'Usuário'}
            </span>
            <ChevronDown className="w-3 h-3 text-zinc-400 group-hover:text-white transition-transform" />
          </button>

          {userDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/30 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                <div className="p-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-800 mb-1">
                  <div className="text-xs font-bold text-white truncate">
                    {currentUser?.name}
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate">
                    {currentUser?.email}
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-[#8B5CF6]/20 text-[#DDD6FE] border border-[#8B5CF6]/30 font-medium">
                      {currentUser?.role}
                    </span>
                    <span className="text-emerald-400 font-medium">● Conectado</span>
                  </div>
                </div>

                <button
                  id="navbar-create-user-item-btn"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    onOpenCreateUser();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-200 hover:text-white hover:bg-[#8B5CF6]/20 rounded-xl transition-colors text-left cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-[#A78BFA]" />
                  <span>Criar Novo Usuário</span>
                </button>

                <div className="my-1 border-t border-zinc-800" />

                {/* Botão Sair / Logout */}
                <button
                  id="navbar-logout-btn"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    onOpenLogoutModal();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-600/25 rounded-xl transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Sair da Conta (Logout)</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

