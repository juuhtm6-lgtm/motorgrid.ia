import React, { useState } from 'react';
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
  LogOut,
  UserPlus,
  UserCheck,
  ChevronUp,
  MoreVertical,
  Globe,
} from 'lucide-react';
import { MotorGridLogo, MotorGridIcon } from './MotorGridLogo';
import { AuthUser } from '../types';

export type ActiveTab =
  | 'dashboard'
  | 'customers'
  | 'projects'
  | 'billing'
  | 'ai-copilot'
  | 'reports'
  | 'settings'
  | 'sales';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  customersRiskCount: number;
  unreadNotifications: number;
  onOpenNotifications: () => void;
  currentUser: AuthUser | null;
  onOpenCreateUser: () => void;
  onOpenLogoutModal: () => void;
  availableUsers: AuthUser[];
  onSwitchUser: (user: AuthUser) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  customersRiskCount,
  unreadNotifications,
  onOpenNotifications,
  currentUser,
  onOpenCreateUser,
  onOpenLogoutModal,
  availableUsers,
  onSwitchUser,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

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
      id: 'sales' as ActiveTab,
      label: 'Página de Vendas & Planos',
      icon: Globe,
      badge: 'Pública',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
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
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-700 cursor-pointer"
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
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
      <div className="p-3 border-t border-[#8B5CF6]/15 bg-[#0A0A0B]/80 relative">
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
                className="relative p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
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
            className="w-full flex justify-center p-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors relative cursor-pointer"
            title="Notificações"
          >
            <Bell className="w-5 h-5 text-[#A78BFA]" />
            {unreadNotifications > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#8B5CF6] rounded-full shadow-[0_0_6px_#8B5CF6]" />
            )}
          </button>
        )}

        {/* User Profile Popover / Dropdown when open */}
        {userMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setUserMenuOpen(false)}
            />
            <div
              id="sidebar-user-popover"
              className={`absolute bottom-16 ${
                collapsed ? 'left-20 w-64' : 'left-3 right-3'
              } rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/30 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1`}
            >
              <div className="p-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-800 mb-1">
                <div className="text-xs font-bold text-white truncate">
                  {currentUser?.name || 'Usuário MotorGrid'}
                </div>
                <div className="text-[11px] text-zinc-400 truncate">
                  {currentUser?.email}
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#8B5CF6]/20 text-[#DDD6FE] border border-[#8B5CF6]/30">
                    {currentUser?.role || 'Operador'}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium">● Online</span>
                </div>
              </div>

              {/* Action: Create User */}
              <button
                id="sidebar-create-user-action-btn"
                onClick={() => {
                  setUserMenuOpen(false);
                  onOpenCreateUser();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-200 hover:text-white hover:bg-[#8B5CF6]/20 rounded-xl transition-colors text-left cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-[#A78BFA]" />
                <span>Criar Novo Usuário</span>
              </button>

              {/* Action: Switch User demo */}
              <div className="pt-1 border-t border-zinc-800/80">
                <div className="px-2 py-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Alternar Conta
                </div>
                <div className="max-h-28 overflow-y-auto space-y-0.5">
                  {availableUsers
                    .filter((u) => u.id !== currentUser?.id)
                    .map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          onSwitchUser(u);
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-zinc-300 hover:text-white hover:bg-zinc-800 text-left transition-colors cursor-pointer"
                      >
                        <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full object-cover" />
                        <span className="truncate flex-1">{u.name}</span>
                        <span className="text-[9px] text-[#A78BFA]">{u.role.split(' ')[0]}</span>
                      </button>
                    ))}
                </div>
              </div>

              {/* Action: Logout Button (Botão Sair) */}
              <div className="pt-1 border-t border-zinc-800/80">
                <button
                  id="sidebar-logout-btn"
                  onClick={() => {
                    setUserMenuOpen(false);
                    onOpenLogoutModal();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-600/25 rounded-xl transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Sair da Conta (Logout)</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* User profile capsule with click-to-open menu & fast logout */}
        <div className="mt-3 flex items-center justify-between gap-2 pt-3 border-t border-zinc-800/80">
          <button
            id="sidebar-user-profile-btn"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={`flex items-center gap-2.5 p-1 rounded-xl hover:bg-zinc-800/60 transition-all text-left flex-1 min-w-0 cursor-pointer ${
              collapsed ? 'justify-center' : ''
            }`}
            title="Menu do Usuário / Criar Usuário / Sair"
          >
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full ring-2 ring-[#8B5CF6]/50 object-cover shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full ring-2 ring-[#8B5CF6]/50 overflow-hidden shrink-0 bg-gradient-to-tr from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center font-bold text-white text-xs">
                {currentUser?.name
                  ? currentUser.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()
                  : 'MG'}
              </div>
            )}

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-zinc-200 truncate flex items-center gap-1">
                  <span>{currentUser?.name || 'Ana Luísa'}</span>
                </div>
                <div className="text-[10px] text-[#A78BFA] truncate font-medium">
                  {currentUser?.role || 'Head de Operações'}
                </div>
              </div>
            )}

            {!collapsed && (
              <ChevronUp className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            )}
          </button>

          {/* Dedicated direct Logout button in footer */}
          {!collapsed && (
            <button
              id="sidebar-quick-logout-btn"
              onClick={onOpenLogoutModal}
              className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/15 transition-all border border-transparent hover:border-rose-500/30 cursor-pointer shrink-0"
              title="Sair da Conta (Logout)"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

