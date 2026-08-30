import React, { useState } from 'react';
import {
  LayoutGrid,
  MessageSquare,
  UserPlus,
  GitPullRequest,
  Car,
  Cloud,
  TrendingUp,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ChevronUp,
  ChevronDown,
  HelpCircle,
  Sparkles,
  Globe,
  BarChart3,
  Layers,
  Eye,
  Users,
  Target,
  Award,
} from 'lucide-react';
import { MotorGridIcon } from './MotorGridLogo';
import { AuthUser, ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  customersRiskCount?: number;
  unreadNotifications?: number;
  onOpenNotifications?: () => void;
  currentUser: AuthUser | null;
  onOpenCreateUser: () => void;
  onOpenLogoutModal: () => void;
  availableUsers: AuthUser[];
  onSwitchUser: (user: AuthUser) => void;
  onOpenNewLead?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  currentUser,
  onOpenCreateUser,
  onOpenLogoutModal,
  availableUsers,
  onSwitchUser,
  onOpenNewLead,
}) => {
  const [relatoriosExpanded, setRelatoriosExpanded] = useState(true);

  // Main menu items with RELATÓRIOS > Meta Ads
  const mainMenuItems: Array<{
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isDropdown?: boolean;
    subItems?: Array<{ id: ActiveTab; label: string; badge?: string }>;
  }> = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutGrid,
    },
    {
      id: 'atendimento' as ActiveTab,
      label: 'Atendimento',
      icon: MessageSquare,
    },
    {
      id: 'leads' as ActiveTab,
      label: 'Leads',
      icon: UserPlus,
    },
    {
      id: 'pipeline' as ActiveTab,
      label: 'Pipeline',
      icon: GitPullRequest,
    },
    {
      id: 'estoque' as ActiveTab,
      label: 'Estoque',
      icon: Car,
    },
    {
      id: 'automacao' as ActiveTab,
      label: 'Automação',
      icon: Cloud,
    },
    {
      id: 'performance' as ActiveTab,
      label: 'Performance',
      icon: TrendingUp,
    },
    {
      id: 'relatorios' as ActiveTab,
      label: 'Relatórios',
      icon: BarChart3,
      isDropdown: true,
      subItems: [
        { id: 'relatorios' as ActiveTab, label: 'Visão Geral' },
        { id: 'meta-ads' as ActiveTab, label: 'Meta Ads' },
        { id: 'campanhas' as ActiveTab, label: 'Campanhas' },
        { id: 'anuncios' as ActiveTab, label: 'Anúncios' },
        { id: 'relatorio-leads' as ActiveTab, label: 'Leads' },
        { id: 'conversoes' as ActiveTab, label: 'Conversões' },
        { id: 'vendedores' as ActiveTab, label: 'Vendedores' },
        { id: 'funil-comercial' as ActiveTab, label: 'Funil Comercial' },
      ],
    },
    {
      id: 'administracao' as ActiveTab,
      label: 'Administração',
      icon: Settings,
    },
  ];

  return (
    <aside
      id="main-sidebar"
      className={`relative flex flex-col border-r border-[rgba(255,255,255,0.06)] bg-[#0A0A0B] transition-all duration-300 z-30 select-none font-['Inter',sans-serif] ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-20 px-4 border-b border-[rgba(255,255,255,0.06)] bg-[#0A0A0B]">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* MotorGrid Icon Container */}
          <div className="relative shrink-0 flex items-center justify-center p-2.5 rounded-xl bg-[#101012] border border-[rgba(139,92,246,0.35)] shadow-md shadow-[#8B5CF6]/20">
            <MotorGridIcon className="w-9 h-9" />
          </div>

          {!collapsed && (
            <div className="flex flex-col justify-center min-w-0">
              <div className="font-bold text-white tracking-tight text-[19px] leading-tight flex items-center">
                <span>MotorGrid</span>
              </div>
              <span className="font-semibold uppercase text-[#A1A1AA] text-[10px] tracking-[0.15em] mt-0.5">
                AUTOMOTIVE COMMAND
              </span>
            </div>
          )}
        </div>

        <button
          id="toggle-sidebar-btn"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-[#1C1C1E] transition-colors cursor-pointer shrink-0"
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-[#8B5CF6]" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-[#A1A1AA]" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {mainMenuItems.map((item) => {
          const Icon = item.icon;
          const isRelatoriosSection =
            item.id === 'relatorios' &&
            (activeTab === 'relatorios' ||
              activeTab === 'meta-ads' ||
              activeTab === 'campanhas' ||
              activeTab === 'anuncios' ||
              activeTab === 'relatorio-leads' ||
              activeTab === 'conversoes' ||
              activeTab === 'vendedores' ||
              activeTab === 'funil-comercial');

          const isActive =
            activeTab === item.id ||
            isRelatoriosSection ||
            (item.id === 'dashboard' && activeTab === 'sales') ||
            (item.id === 'leads' && activeTab === 'customers') ||
            (item.id === 'pipeline' && activeTab === 'projects') ||
            (item.id === 'performance' && activeTab === 'reports') ||
            (item.id === 'administracao' && (activeTab === 'settings' || activeTab === 'billing'));

          if (item.isDropdown) {
            return (
              <div key={item.id} className="space-y-1">
                <button
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    if (collapsed) {
                      setCollapsed(false);
                      setRelatoriosExpanded(true);
                      setActiveTab('meta-ads');
                    } else {
                      setRelatoriosExpanded(!relatoriosExpanded);
                      if (!isRelatoriosSection) {
                        setActiveTab('meta-ads');
                      }
                    }
                  }}
                  title={collapsed ? item.label : undefined}
                  className={`w-full relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[rgba(139,92,246,0.14)] text-white font-semibold'
                      : 'text-[#A1A1AA] hover:bg-[#1C1C1E] hover:text-white'
                  } ${collapsed ? 'justify-center px-2' : ''}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4.5 h-4.5 shrink-0 transition-colors ${
                        isActive ? 'text-[#8B5CF6]' : 'text-[#A1A1AA]'
                      }`}
                    />
                    {!collapsed && (
                      <span className="truncate text-sm">
                        {item.label}
                      </span>
                    )}
                  </div>

                  {!collapsed && (
                    <ChevronDown
                      className={`w-4 h-4 text-[#A1A1AA] transition-transform ${
                        relatoriosExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  )}

                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#8B5CF6] rounded-r-md" />
                  )}
                </button>

                {/* Sub-items */}
                {!collapsed && relatoriosExpanded && item.subItems && (
                  <div className="pl-7 pr-1 py-1 space-y-1 border-l border-[rgba(255,255,255,0.06)] ml-4 my-1">
                    {item.subItems.map((sub) => {
                      const isSubActive = activeTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          id={`nav-subitem-${sub.id}`}
                          onClick={() => setActiveTab(sub.id)}
                          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            isSubActive
                              ? 'bg-[rgba(139,92,246,0.14)] text-white font-semibold'
                              : 'text-[#A1A1AA] hover:text-white hover:bg-[#1C1C1E]'
                          }`}
                        >
                          <span className="truncate">{sub.label}</span>
                          {sub.badge && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#8B5CF6] text-white">
                              {sub.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <button
              id={`nav-item-${item.id}`}
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-[rgba(139,92,246,0.14)] text-white font-semibold'
                  : 'text-[#A1A1AA] hover:bg-[#1C1C1E] hover:text-white'
              } ${collapsed ? 'justify-center px-2' : ''}`}
            >
              <Icon
                className={`w-4.5 h-4.5 shrink-0 transition-colors ${
                  isActive ? 'text-[#8B5CF6]' : 'text-[#A1A1AA]'
                }`}
              />

              {!collapsed && (
                <span className="truncate text-sm">
                  {item.label}
                </span>
              )}

              {/* Purple Active Indicator Bar */}
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#8B5CF6] rounded-r-md" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section: Primary Button & Actions */}
      <div className="p-3 border-t border-[rgba(255,255,255,0.06)] bg-[#0A0A0B] space-y-2">
        {/* + New Lead Button (Primary: bg #8B5CF6 text #FFFFFF hover #7C3AED / #6D28D9) */}
        <button
          id="sidebar-new-lead-btn"
          onClick={onOpenNewLead}
          className={`w-full bg-[#8B5CF6] hover:bg-[#7C3AED] active:bg-[#6D28D9] text-white font-semibold text-sm rounded-xl py-2.5 px-4 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            collapsed ? 'px-0 py-2.5' : ''
          }`}
          title="Novo Lead"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          {!collapsed && <span>Novo Lead</span>}
        </button>

        {/* Support Link */}
        <button
          id="sidebar-support-btn"
          onClick={() => alert('Central de Ajuda MotorGrid: Suporte 24/7 via WhatsApp ou helpdesk@motorgrid.io')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[#A1A1AA] hover:text-white hover:bg-[#1C1C1E] transition-colors cursor-pointer text-xs font-medium ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          title="Suporte"
        >
          <HelpCircle className="w-4 h-4 text-[#A1A1AA] shrink-0" />
          {!collapsed && <span>Suporte</span>}
        </button>

        {/* Sign Out Link */}
        <button
          id="sidebar-signout-btn"
          onClick={onOpenLogoutModal}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[#A1A1AA] hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer text-xs font-medium ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          title="Sair"
        >
          <LogOut className="w-4 h-4 text-[#A1A1AA] hover:text-rose-400 shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
};


