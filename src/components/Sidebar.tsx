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
import { AuthUser, ActiveTab } from '../types';
import { useToast } from '../context/ToastContext';
import { GridIAIcon } from './brand/GridIAIcon';
import { GridIALogoFull } from './brand/GridIALogoFull';

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
  theme?: 'light' | 'dark';
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
  theme = 'dark',
}) => {
  const toast = useToast();
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
      id: 'equipe' as ActiveTab,
      label: 'Gestão de Equipe',
      icon: Users,
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
      className={`relative flex flex-col transition-all duration-300 z-30 select-none font-['Inter',sans-serif] ${
        theme === 'light'
          ? 'border-r border-slate-200/80 bg-white text-slate-800'
          : 'border-r border-[rgba(255,255,255,0.06)] bg-[#0A0A0B] text-zinc-100'
      } ${collapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Official GRID IA Brand Header */}
      <div className={`flex items-center justify-between h-20 px-3.5 border-b transition-colors ${
        theme === 'light'
          ? 'border-slate-200/80 bg-white'
          : 'border-[rgba(255,255,255,0.06)] bg-[#0A0A0B]'
      }`}>
        {collapsed ? (
          /* Símbolo Oficial GRID IA Recolhido (Proporção 1:1, 40px, centralizado) */
          <div className="w-full flex items-center justify-center">
            <div
              className={`relative shrink-0 flex items-center justify-center p-1.5 rounded-xl transition-all ${
                theme === 'light'
                  ? 'bg-slate-50 border border-slate-200 shadow-sm'
                  : 'bg-[#101012] border border-[rgba(139,92,246,0.30)] shadow-md shadow-[#8B5CF6]/15'
              }`}
            >
              <GridIAIcon
                size={40}
                theme={theme}
                title="GRID IA"
              />
            </div>
          </div>
        ) : (
          /* Logotipo Completo Oficial GRID IA Expandido ([SÍMBOLO OFICIAL GRID IA] + [GRID IA]) */
          <div className="flex items-center justify-start flex-1 min-w-0 pr-1">
            <GridIALogoFull
              theme={theme}
              size="md"
              iconSize={38}
            />
          </div>
        )}

        <button
          id="toggle-sidebar-btn"
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
            theme === 'light'
              ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
              : 'text-[#A1A1AA] hover:text-white hover:bg-[#1C1C1E]'
          }`}
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-[#8B5CF6]" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-inherit" />
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
                      ? theme === 'light'
                        ? 'bg-purple-50 text-[#6D28D9] font-semibold'
                        : 'bg-[rgba(139,92,246,0.14)] text-white font-semibold'
                      : theme === 'light'
                        ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        : 'text-[#A1A1AA] hover:bg-[#1C1C1E] hover:text-white'
                  } ${collapsed ? 'justify-center px-2' : ''}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4.5 h-4.5 shrink-0 transition-colors ${
                        isActive
                          ? 'text-[#8B5CF6]'
                          : theme === 'light'
                            ? 'text-slate-400'
                            : 'text-[#A1A1AA]'
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
                      className={`w-4 h-4 transition-transform ${
                        theme === 'light' ? 'text-slate-400' : 'text-[#A1A1AA]'
                      } ${relatoriosExpanded ? 'rotate-180' : ''}`}
                    />
                  )}

                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#8B5CF6] rounded-r-md" />
                  )}
                </button>

                {/* Sub-items */}
                {!collapsed && relatoriosExpanded && item.subItems && (
                  <div className={`pl-7 pr-1 py-1 space-y-1 ml-4 my-1 border-l ${
                    theme === 'light' ? 'border-slate-200' : 'border-[rgba(255,255,255,0.06)]'
                  }`}>
                    {item.subItems.map((sub) => {
                      const isSubActive = activeTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          id={`nav-subitem-${sub.id}`}
                          onClick={() => setActiveTab(sub.id)}
                          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            isSubActive
                              ? theme === 'light'
                                ? 'bg-purple-50 text-[#6D28D9] font-semibold'
                                : 'bg-[rgba(139,92,246,0.14)] text-white font-semibold'
                              : theme === 'light'
                                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
              onClick={() => {
                if (
                  item.id === 'equipe' &&
                  currentUser &&
                  currentUser.canonicalRole !== 'platform_admin' &&
                  currentUser.canonicalRole !== 'manager' &&
                  currentUser.canonicalRole !== 'supervisor' &&
                  !currentUser.permissions?.equipe?.createUser &&
                  !currentUser.permissions?.equipe?.editUser
                ) {
                  toast.error(
                    `Acesso restrito: Gestão de Equipe é restrita a Gerentes, Supervisores e Administradores. Seu perfil é: ${currentUser.role}`
                  );
                  return;
                }
                if (
                  item.id === 'administracao' &&
                  currentUser &&
                  currentUser.canonicalRole !== 'platform_admin' &&
                  currentUser.canonicalRole !== 'manager' &&
                  currentUser.role !== 'Administrador MotorGrid' &&
                  currentUser.role !== 'Administrador' &&
                  currentUser.role !== 'Gestor Geral'
                ) {
                  toast.error(
                    `Acesso restrito: Módulo exclusivo para Administradores e Gerentes. Perfil atual: ${currentUser.role}`
                  );
                  return;
                }
                setActiveTab(item.id);
              }}
              title={collapsed ? item.label : undefined}
              className={`w-full relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? theme === 'light'
                    ? 'bg-purple-50 text-[#6D28D9] font-semibold'
                    : 'bg-[rgba(139,92,246,0.14)] text-white font-semibold'
                  : theme === 'light'
                    ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    : 'text-[#A1A1AA] hover:bg-[#1C1C1E] hover:text-white'
              } ${collapsed ? 'justify-center px-2' : ''}`}
            >
              <Icon
                className={`w-4.5 h-4.5 shrink-0 transition-colors ${
                  isActive
                    ? 'text-[#8B5CF6]'
                    : theme === 'light'
                      ? 'text-slate-400'
                      : 'text-[#A1A1AA]'
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
      <div className={`p-3 border-t space-y-2 transition-colors ${
        theme === 'light'
          ? 'border-slate-200/80 bg-white'
          : 'border-[rgba(255,255,255,0.06)] bg-[#0A0A0B]'
      }`}>
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
          onClick={() => toast.info('Central de Ajuda GRID IA: Suporte 24/7 via WhatsApp (+55 11 9999-8888) ou suporte@gridia.com.br')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer text-xs font-medium ${
            theme === 'light'
              ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              : 'text-[#A1A1AA] hover:text-white hover:bg-[#1C1C1E]'
          } ${collapsed ? 'justify-center px-0' : ''}`}
          title="Suporte"
        >
          <HelpCircle className="w-4 h-4 shrink-0 text-inherit" />
          {!collapsed && <span>Suporte</span>}
        </button>

        {/* Sign Out Link */}
        <button
          id="sidebar-signout-btn"
          onClick={onOpenLogoutModal}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer text-xs font-medium ${
            theme === 'light'
              ? 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
              : 'text-[#A1A1AA] hover:text-rose-400 hover:bg-rose-500/10'
          } ${collapsed ? 'justify-center px-0' : ''}`}
          title="Sair"
        >
          <LogOut className="w-4 h-4 hover:text-rose-400 shrink-0 text-inherit" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
};


