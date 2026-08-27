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
} from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface NavbarProps {
  activeTab: ActiveTab;
  onOpenCommandPalette: () => void;
  onOpenNotifications: () => void;
  unreadNotifications: number;
  onOpenNewCustomer: () => void;
  onOpenNewTask: () => void;
  onOpenAiCopilot: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onOpenCommandPalette,
  onOpenNotifications,
  unreadNotifications,
  onOpenNewCustomer,
  onOpenNewTask,
  onOpenAiCopilot,
}) => {
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);

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
      default:
        return { title: 'MotorGrid', subtitle: 'Automotive Technology' };
    }
  };

  const { title, subtitle } = getTabTitle();

  return (
    <header id="main-navbar" className="h-16 px-6 border-b border-[#8B5CF6]/15 bg-[#1C1C1E]/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-20">
      {/* Title & Breadcrumb */}
      <div className="flex flex-col">
        <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
          {title}
        </h1>
        <p className="text-xs text-zinc-400 hidden sm:block font-medium">{subtitle}</p>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        {/* Search trigger button styled after MotorGrid Design System */}
        <button
          id="navbar-search-btn"
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[#0A0A0B] hover:bg-zinc-900 border border-zinc-700/80 hover:border-[#8B5CF6]/40 text-zinc-400 hover:text-zinc-200 text-xs transition-all group cursor-pointer shadow-inner"
        >
          <Search className="w-3.5 h-3.5 text-[#A78BFA] group-hover:text-[#8B5CF6] transition-colors" />
          <span className="hidden md:inline text-zinc-400">Buscar frotas, clientes ou sensores...</span>
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
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold shadow-lg shadow-[#8B5CF6]/25 hover:shadow-[#8B5CF6]/40 transition-all cursor-pointer"
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
      </div>
    </header>
  );
};
