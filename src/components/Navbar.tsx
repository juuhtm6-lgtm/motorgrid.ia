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
  Sun,
  Moon,
} from 'lucide-react';
import { ActiveTab, AuthUser, ThemeMode } from '../types';

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
  availableUsers?: AuthUser[];
  onSwitchUser?: (user: AuthUser) => void;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
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
  availableUsers,
  onSwitchUser,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Deduplicate and ensure unique keys for available users
  const sanitizedAvailableUsers = React.useMemo(() => {
    if (!availableUsers || !Array.isArray(availableUsers)) return [];
    const seen = new Set<string>();
    const result: AuthUser[] = [];
    availableUsers.forEach((u, idx) => {
      if (!u) return;
      const key = u.id && typeof u.id === 'string' && u.id.trim() !== ''
        ? u.id.trim()
        : `user-${idx}-${u.email || ''}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push(u);
      }
    });
    return result;
  }, [availableUsers]);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Dashboard Geral', subtitle: 'Painel executivo, funil de vendas e performance comercial' };
      case 'atendimento':
        return { title: 'Central de Atendimento & WhatsApp', subtitle: 'Atendimento via WhatsApp Oficial, fila de contatos e SAC' };
      case 'leads':
        return { title: 'Gestão de Leads & Oportunidades', subtitle: 'Captação de leads, qualificação e conversão em vendas' };
      case 'pipeline':
        return { title: 'Pipeline & Funil de Vendas Automotivo', subtitle: 'Negociações em andamento, visitas e propostas comerciais' };
      case 'estoque':
        return { title: 'Estoque de Veículos', subtitle: 'Catálogo de seminovos e 0km com histórico e status' };
      case 'automacao':
        return { title: 'Automação & Gatilhos Comerciais', subtitle: 'Regras de atendimento 24/7, distribuição de leads e disparos automáticos' };
      case 'performance':
        return { title: 'Performance & Eficiência Comercial', subtitle: 'Desempenho da equipe, conversão por vendedor e metas' };
      case 'equipe':
        return {
          title: 'Gestão de Equipe & Controle de Permissões',
          subtitle: 'Estrutura hierárquica, gestão de colaboradores, unidades e permissões RBAC',
        };
      case 'administracao':
      case 'settings':
        return { title: 'Painel de Administração do Sistema', subtitle: 'Membros da equipe, planos, credenciais de API e segurança do workspace' };
      case 'customers':
        return { title: 'Gestão de Clientes & Compradores', subtitle: 'Base de clientes, contratos e histórico de negociações' };
      case 'projects':
        return { title: 'Operações & Tarefas', subtitle: 'Acompanhamento de processos de entrega e vistorias' };
      case 'billing':
        return { title: 'Planos & Faturamento MotorGrid', subtitle: 'Gestão de assinaturas, cobranças PIX/Cartão e faturas fiscais' };
      case 'ai-copilot':
        return { title: 'Copilot IA Gemini - MotorGrid Intelligence', subtitle: 'Diagnósticos automotivos preditivos e estratégias comerciais' };
      case 'reports':
        return { title: 'Relatórios & Análise de Vendas', subtitle: 'Desempenho de canais, conversão e métricas financeiras' };
      case 'meta-ads':
      case 'relatorios':
        return { title: 'Relatórios > Meta Ads (Facebook & Instagram)', subtitle: 'Painel integrado à Meta Marketing API com cruzamento direto no CRM automotivo' };
      case 'campanhas':
        return { title: 'Relatórios > Campanhas Meta Ads', subtitle: 'Performance detalhada por campanha, investimento, CTR, CPL e fechamentos' };
      case 'anuncios':
        return { title: 'Relatórios > Anúncios & Criativos Meta', subtitle: 'Galeria de criativos, vídeos, carrosséis e badges de melhor performance' };
      case 'relatorio-leads':
        return { title: 'Relatórios > Leads Meta Ads', subtitle: 'Rastreamento de leads instantâneos com UTMs, SLA de resposta e vendedor atribuído' };
      case 'conversoes':
      case 'funil-comercial':
        return { title: 'Relatórios > Funil Comercial Meta + CRM', subtitle: 'Jornada completa: Impressões → Cliques → Leads → Visitas → Vendas concretizadas' };
      case 'vendedores':
        return { title: 'Relatórios > Rankings de Vendedores & Campanhas', subtitle: 'Produtividade comercial e conversão de leads em fechamentos de veículos' };
      case 'sales':
        return { title: 'Página de Vendas & Planos Comerciais', subtitle: 'Landing page pública com simulador de ROI, planos e checkout integrado' };
      default:
        return { title: 'MotorGrid', subtitle: 'Automotive Command' };
    }
  };

  const { title, subtitle } = getTabTitle();


  return (
    <header id="main-navbar" className="h-16 px-4 sm:px-6 border-b border-[rgba(255,255,255,0.06)] bg-[#0A0A0B] flex items-center justify-between sticky top-0 z-20 font-['Inter',sans-serif]">
      {/* Title & Breadcrumb */}
      <div className="flex flex-col">
        <h1 className="text-base sm:text-lg font-semibold text-white tracking-tight flex items-center gap-2">
          {title}
        </h1>
        <p className="text-xs text-[#A1A1AA] hidden sm:block font-normal">{subtitle}</p>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Search Input Button */}
        <button
          id="navbar-search-btn"
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#1C1C1E] hover:bg-[#27272A] border border-[rgba(255,255,255,0.08)] hover:border-[#8B5CF6] text-[#A1A1AA] hover:text-white text-xs transition-all group cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-[#A1A1AA] group-hover:text-white transition-colors" />
          <span className="hidden lg:inline text-[#A1A1AA] group-hover:text-white">Buscar frotas, clientes ou sensores...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#27272A] text-[#A1A1AA] border border-[rgba(255,255,255,0.08)]">
            <Command className="w-3 h-3" /> K
          </kbd>
        </button>

        {/* AI Quick Button - IA Component using #8B5CF6 background rgba(139,92,246,0.15) */}
        <button
          id="navbar-ai-copilot-btn"
          onClick={onOpenAiCopilot}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[rgba(139,92,246,0.15)] hover:bg-[rgba(139,92,246,0.25)] border border-[rgba(139,92,246,0.35)] text-white text-xs font-medium transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span className="hidden sm:inline">✦ Copilot IA</span>
        </button>

        {/* Quick Add Dropdown */}
        <div className="relative">
          <button
            id="navbar-quick-add-btn"
            onClick={() => setQuickMenuOpen(!quickMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
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
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#1C1C1E] border border-[rgba(255,255,255,0.08)] shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  id="quick-add-user-btn"
                  onClick={() => {
                    setQuickMenuOpen(false);
                    onOpenCreateUser();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-white hover:bg-[#27272A] rounded-lg transition-colors text-left"
                >
                  <UserPlus className="w-4 h-4 text-[#8B5CF6]" />
                  Novo Usuário / Operador
                </button>
                <div className="my-1 border-t border-[rgba(255,255,255,0.05)]" />
                <button
                  id="quick-add-customer-btn"
                  onClick={() => {
                    setQuickMenuOpen(false);
                    onOpenNewCustomer();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#A1A1AA] hover:text-white hover:bg-[#27272A] rounded-lg transition-colors text-left"
                >
                  <UserPlus className="w-4 h-4 text-[#A1A1AA]" />
                  Novo Cliente / Frota
                </button>
                <button
                  id="quick-add-task-btn"
                  onClick={() => {
                    setQuickMenuOpen(false);
                    onOpenNewTask();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#A1A1AA] hover:text-white hover:bg-[#27272A] rounded-lg transition-colors text-left"
                >
                  <CheckSquare className="w-4 h-4 text-[#A1A1AA]" />
                  Nova Tarefa / Sprint
                </button>
                <div className="my-1 border-t border-[rgba(255,255,255,0.05)]" />
                <button
                  id="quick-add-insight-btn"
                  onClick={() => {
                    setQuickMenuOpen(false);
                    onOpenAiCopilot();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#8B5CF6] hover:bg-[rgba(139,92,246,0.15)] rounded-lg transition-colors text-left"
                >
                  <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                  ✦ Diagnóstico IA de Frotas
                </button>
              </div>
            </>
          )}
        </div>

        {/* Notifications Bell */}
        <button
          id="navbar-notifications-bell-btn"
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl bg-[#1C1C1E] hover:bg-[#27272A] border border-[rgba(255,255,255,0.08)] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
          title="Notificações operacionais"
        >
          <Bell className="w-4 h-4 text-[#A1A1AA] hover:text-white" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#8B5CF6] rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-[#0A0A0B]">
              {unreadNotifications}
            </span>
          )}
        </button>

        {/* Global Dark / Light Theme Toggle */}
        <button
          id="navbar-theme-toggle-btn"
          type="button"
          onClick={onToggleTheme}
          className="p-2 rounded-xl bg-[#1C1C1E] hover:bg-[#27272A] border border-[rgba(255,255,255,0.08)] hover:border-[#8B5CF6] text-[#A1A1AA] hover:text-white transition-all cursor-pointer group flex items-center justify-center shadow-sm"
          title={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
          aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
        >
          {theme === 'dark' ? (
            <Moon className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500 group-hover:text-amber-600 transition-colors" />
          )}
        </button>

        {/* Authenticated User Menu Dropdown */}
        <div className="relative">
          <button
            id="navbar-user-avatar-btn"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl bg-[#1C1C1E] hover:bg-[#27272A] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(139,92,246,0.35)] transition-all cursor-pointer group"
          >
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-lg object-cover ring-1 ring-[rgba(255,255,255,0.1)]"
              />
            ) : (
              <div className="w-6 h-6 rounded-lg bg-[rgba(139,92,246,0.2)] text-[#8B5CF6] flex items-center justify-center text-xs font-bold">
                {currentUser?.name ? currentUser.name[0] : 'U'}
              </div>
            )}
            <span className="hidden md:inline text-xs font-medium text-white max-w-[100px] truncate">
              {currentUser?.name?.split(' ')[0] || 'Usuário'}
            </span>
            <ChevronDown className="w-3 h-3 text-[#A1A1AA] group-hover:text-white transition-transform" />
          </button>

          {userDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#1C1C1E] border border-[rgba(255,255,255,0.08)] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                <div className="p-2.5 rounded-lg bg-[#101012] border border-[rgba(255,255,255,0.06)] mb-1">
                  <div className="text-xs font-semibold text-white truncate">
                    {currentUser?.name}
                  </div>
                  <div className="text-[11px] text-[#A1A1AA] truncate">
                    {currentUser?.email}
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-[rgba(139,92,246,0.15)] text-[#8B5CF6] border border-[rgba(139,92,246,0.30)] font-medium">
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
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#A1A1AA] hover:text-white hover:bg-[#27272A] rounded-lg transition-colors text-left cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-[#8B5CF6]" />
                  <span>Criar Novo Usuário</span>
                </button>

                {/* Alternar Perfil */}
                {sanitizedAvailableUsers.length > 1 && onSwitchUser && (
                  <div className="pt-1.5 pb-1">
                    <div className="px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      Alternar Perfil
                    </div>
                    <div className="space-y-0.5 max-h-36 overflow-y-auto">
                      {sanitizedAvailableUsers.map((u, index) => {
                        const isCurrent = currentUser?.id ? u.id === currentUser.id : false;
                        const uniqueKey = `switch-user-${u.id || index}-${u.email || 'user'}`;
                        return (
                          <button
                            key={uniqueKey}
                            onClick={() => {
                              onSwitchUser(u);
                              setUserDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                              isCurrent
                                ? 'bg-[#8B5CF6]/20 text-white font-semibold'
                                : 'text-zinc-400 hover:text-white hover:bg-[#27272A]'
                            }`}
                          >
                            <span className="truncate">{u.name}</span>
                            <span className="text-[10px] font-mono opacity-70 shrink-0 ml-1">
                              {u.role.split(' ')[0]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="my-1 border-t border-[rgba(255,255,255,0.05)]" />

                {/* Botão Sair / Logout */}
                <button
                  id="navbar-logout-btn"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    onOpenLogoutModal();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-600 rounded-lg transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Sair da Conta (Logout)</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Direct Sair / Logout Quick Button */}
        <button
          id="navbar-direct-logout-btn"
          type="button"
          onClick={onOpenLogoutModal}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 active:bg-rose-500/30 border border-rose-500/30 hover:border-rose-500/50 text-rose-400 hover:text-rose-300 text-xs font-semibold transition-all cursor-pointer shadow-sm"
          title="Sair do sistema (Logout)"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  );
};

