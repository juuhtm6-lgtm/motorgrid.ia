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
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Exact menu items from user screenshot
  const mainMenuItems = [
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
  ];

  return (
    <aside
      id="main-sidebar"
      className={`relative flex flex-col border-r border-[#8B5CF6]/15 bg-[#121214] transition-all duration-300 z-30 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header - Exact font and layout from user screenshot */}
      <div className="flex items-center justify-between h-20 px-4 border-b border-zinc-800/60 bg-[#121214]">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Neon Icon Container */}
          <div className="relative shrink-0 flex items-center justify-center p-2 rounded-xl bg-[#0F0D1A] border border-[#8B5CF6]/35 shadow-md shadow-[#8B5CF6]/20">
            <MotorGridIcon className="w-8 h-8" />
          </div>

          {!collapsed && (
            <div className="flex flex-col justify-center min-w-0">
              <div className="font-bold text-white tracking-tight text-[19px] leading-tight flex items-center gap-1 font-['Plus_Jakarta_Sans',sans-serif]">
                <span>MotorGrid</span>
                <span className="text-white">OS</span>
              </div>
              <span className="font-bold uppercase text-zinc-400 text-[10px] tracking-[0.15em] mt-0.5 font-['Plus_Jakarta_Sans',sans-serif]">
                AUTOMOTIVE COMMAND
              </span>
            </div>
          )}
        </div>

        <button
          id="toggle-sidebar-btn"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer shrink-0"
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-[#C4B5FD]" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-zinc-400" />
          )}
        </button>
      </div>

      {/* Top Action Button: + New Lead (Matching exact lilac pill from screenshot) */}
      <div className="px-3 pt-4 pb-2">
        <button
          id="sidebar-new-lead-btn"
          onClick={onOpenNewLead}
          className={`w-full bg-[#C4B5FD] hover:bg-[#DDD6FE] active:scale-[0.98] text-[#2E1065] font-bold text-sm rounded-xl py-2.5 px-4 shadow-lg shadow-[#8B5CF6]/20 transition-all flex items-center justify-center gap-2 cursor-pointer font-['Plus_Jakarta_Sans',sans-serif] ${
            collapsed ? 'px-0 py-2.5' : ''
          }`}
          title="Criar Novo Lead"
        >
          <Plus className="w-5 h-5 stroke-[2.5] shrink-0" />
          {!collapsed && <span className="tracking-tight">New Lead</span>}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {mainMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.id === 'dashboard' && activeTab === 'sales') ||
            (item.id === 'leads' && activeTab === 'customers') ||
            (item.id === 'pipeline' && activeTab === 'projects') ||
            (item.id === 'performance' && activeTab === 'reports');

          return (
            <button
              id={`nav-item-${item.id}`}
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#25193A] text-white font-semibold shadow-inner'
                  : 'text-zinc-300 hover:bg-zinc-800/60 hover:text-white'
              } ${collapsed ? 'justify-center px-2' : ''}`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-zinc-300'
                }`}
              />

              {!collapsed && (
                <span className="truncate text-[15px] font-['Plus_Jakarta_Sans',sans-serif]">
                  {item.label}
                </span>
              )}

              {/* Right Purple Active Indicator Bar (as in screenshot) */}
              {isActive && (
                <span className="absolute right-0 top-0 bottom-0 w-1.5 bg-[#C4B5FD] rounded-l-md" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Administration Button (Exact Card from screenshot) */}
      <div className="p-3 border-t border-zinc-800/80 bg-[#121214]">
        <button
          id="nav-item-administracao"
          onClick={() => setActiveTab('administracao')}
          title={collapsed ? 'Administração' : undefined}
          className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl bg-[#1C1C1E] hover:bg-[#232328] border border-zinc-800/80 transition-all cursor-pointer ${
            activeTab === 'administracao' || activeTab === 'settings' || activeTab === 'billing'
              ? 'border-[#8B5CF6]/60 bg-[#25193A] text-white'
              : 'text-zinc-200 hover:text-white'
          } ${collapsed ? 'justify-center px-2' : ''}`}
        >
          <Settings className="w-5 h-5 text-zinc-300 shrink-0" />
          {!collapsed && (
            <span className="font-semibold text-sm tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
              Administração
            </span>
          )}
        </button>

        {/* User Profile Popover / Dropdown when open */}
        {userMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setUserMenuOpen(false)}
            />
            <div
              id="sidebar-user-popover"
              className={`absolute bottom-20 ${
                collapsed ? 'left-20 w-64' : 'left-3 right-3'
              } rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/30 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1.5`}
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
                <UserPlus className="w-4 h-4 text-[#C4B5FD]" />
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

        {/* User Mini Capsule */}
        <div className="mt-2.5 flex items-center justify-between gap-2 pt-2 border-t border-zinc-800/60">
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
                className="w-7 h-7 rounded-full ring-2 ring-[#8B5CF6]/50 object-cover shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded-full ring-2 ring-[#8B5CF6]/50 overflow-hidden shrink-0 bg-gradient-to-tr from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center font-bold text-white text-[10px]">
                MG
              </div>
            )}

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-zinc-200 truncate">
                  {currentUser?.name || 'Ana Luísa'}
                </div>
                <div className="text-[10px] text-[#A78BFA] truncate">
                  {currentUser?.role || 'Head de Operações'}
                </div>
              </div>
            )}

            {!collapsed && (
              <ChevronUp className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            )}
          </button>

          {!collapsed && (
            <button
              id="sidebar-quick-logout-btn"
              onClick={onOpenLogoutModal}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/15 transition-all cursor-pointer shrink-0"
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


