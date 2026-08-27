import React from 'react';
import {
  LayoutDashboard,
  Users,
  KanbanSquare,
  CreditCard,
  Sparkles,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Bell,
  Cpu,
} from 'lucide-react';
import { MotorGridLogo, MotorGridIcon } from './MotorGridLogo';

export type ActiveTab =
  | 'dashboard'
  | 'customers'
  | 'projects'
  | 'billing'
  | 'ai-copilot'
  | 'reports'
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  customersRiskCount: number;
  unreadNotifications: number;
  onOpenNotifications: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  customersRiskCount,
  unreadNotifications,
  onOpenNotifications,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Visão Geral & Métricas',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'customers' as ActiveTab,
      label: 'Clientes & Frotas',
      icon: Users,
      badge: customersRiskCount > 0 ? `${customersRiskCount} alerta` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'projects' as ActiveTab,
      label: 'Operações & Sprints',
      icon: KanbanSquare,
      badge: null,
    },
    {
      id: 'billing' as ActiveTab,
      label: 'Planos & Faturamento',
      icon: CreditCard,
      badge: null,
    },
    {
      id: 'ai-copilot' as ActiveTab,
      label: 'Copilot IA Gemini',
      icon: Sparkles,
      badge: 'PRO',
      badgeColor: 'bg-[#8B5CF6]/20 text-[#C4B5FD] border-[#8B5CF6]/40',
      highlight: true,
    },
    {
      id: 'reports' as ActiveTab,
      label: 'Relatórios & Telemetria',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Configurações & API',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside
      id="main-sidebar"
      className={`relative flex flex-col border-r border-[#8B5CF6]/20 bg-[#1C1C1E] transition-all duration-300 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-18 px-3.5 border-b border-[#8B5CF6]/15 bg-[#0A0A0B]/60">
        <div className="flex items-center gap-2 overflow-hidden">
          {collapsed ? (
            <div className="p-1 rounded-xl bg-[#1C1C1E] border border-[#8B5CF6]/30 shadow-md shadow-[#8B5CF6]/20 flex items-center justify-center">
              <MotorGridIcon className="w-8 h-8" />
            </div>
          ) : (
            <MotorGridLogo size="md" showSubtitle={true} />
          )}
        </div>

        <button
          id="toggle-sidebar-btn"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-700"
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4 text-[#A78BFA]" /> : <ChevronLeft className="w-4 h-4 text-zinc-400" />}
        </button>
      </div>

      {/* Workspace Status pill when expanded */}
      {!collapsed && (
        <div className="px-3 pt-3">
          <div className="p-2.5 rounded-xl bg-[#0A0A0B] border border-[#8B5CF6]/20 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#8B5CF6] shadow-[0_0_8px_#8B5CF6] animate-pulse" />
              <div className="text-xs text-zinc-300 font-medium flex items-center gap-1.5">
                <span>MotorGrid Hub</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#8B5CF6]/15 text-[#C4B5FD] font-mono border border-[#8B5CF6]/30">v3.2</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
              <Cpu className="w-3 h-3 text-[#A78BFA]" />
              <span>LIVE</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              id={`nav-item-${item.id}`}
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white shadow-lg shadow-[#8B5CF6]/25 font-semibold'
                  : item.highlight
                  ? 'text-[#C4B5FD] hover:bg-[#8B5CF6]/10 hover:text-white border border-[#8B5CF6]/30'
                  : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200'
              } ${collapsed ? 'justify-center px-2' : ''}`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform ${
                  isActive ? 'scale-110 text-white' : item.highlight ? 'text-[#A78BFA]' : 'text-zinc-400'
                }`}
              />

              {!collapsed && (
                <div className="flex-1 flex items-center justify-between text-left">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold tracking-wide ${
                        item.badgeColor || 'bg-zinc-800 text-zinc-300 border-zinc-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Action Footer */}
      <div className="p-3 border-t border-[#8B5CF6]/15 bg-[#0A0A0B]/80">
        {!collapsed ? (
          <div className="p-3 rounded-xl bg-[#1C1C1E] border border-[#8B5CF6]/20 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#8B5CF6]" />
                <span className="text-xs font-semibold text-zinc-200">SLA Telemetria 99.98%</span>
              </div>
              <button
                id="sidebar-notifications-btn"
                onClick={onOpenNotifications}
                className="relative p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Ver notificações"
              >
                <Bell className="w-4 h-4 text-[#A78BFA]" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#8B5CF6] rounded-full ring-2 ring-[#0A0A0B] shadow-[0_0_6px_#8B5CF6]" />
                )}
              </button>
            </div>
            <div className="text-[11px] text-zinc-400 leading-relaxed">
              Clusters IoT & Conexões CAN-Bus com latência ultra-baixa de 18ms.
            </div>
          </div>
        ) : (
          <button
            id="sidebar-notifications-collapsed-btn"
            onClick={onOpenNotifications}
            className="w-full flex justify-center p-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors relative"
            title="Notificações"
          >
            <Bell className="w-5 h-5 text-[#A78BFA]" />
            {unreadNotifications > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#8B5CF6] rounded-full shadow-[0_0_6px_#8B5CF6]" />
            )}
          </button>
        )}

        {/* User profile capsule */}
        <div className="mt-3 flex items-center gap-3 pt-3 border-t border-zinc-800/80">
          <div className="w-9 h-9 rounded-full ring-2 ring-[#8B5CF6]/50 overflow-hidden shrink-0 bg-gradient-to-tr from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center font-bold text-white text-xs">
            AL
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-zinc-200 truncate">Ana Luísa Castilho</div>
              <div className="text-[11px] text-[#A78BFA] truncate font-medium">Head de Operações SaaS</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
