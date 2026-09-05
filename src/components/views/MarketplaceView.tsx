import React, { useState, useEffect } from 'react';
import {
  Users,
  GitFork,
  ListOrdered,
  Cpu,
  Warehouse,
  Waves,
  Filter,
  Search,
  CheckCircle2,
  Sliders,
  Settings2,
  X,
  Sparkles,
  Zap,
  Save,
  Check,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Plus,
  Power,
  Info,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { storageService } from '../../services/storageService';

export interface MarketplaceModule {
  id: string;
  name: string;
  category: 'crm' | 'routing' | 'automation' | 'ai' | 'inventory' | 'audio';
  categoryLabel: string;
  status: 'ACTIVE' | 'INACTIVE';
  badge?: string;
  icon: 'users' | 'routing' | 'sequences' | 'grid-ai' | 'inventory' | 'audio';
  description: string;
  versionOrRequirement: string;
  usageText?: string;
  isProprietaryAi?: boolean;
  functionalColors: {
    iconLight: string;
    containerLight: string;
    borderLight: string;
    iconDark: string;
    containerDark: string;
    borderDark: string;
    accentGlow?: string;
  };
  settings: {
    enabledChannels?: string[];
    routingMode?: string;
    aiModel?: string;
    dmsProvider?: string;
    maxHours?: number;
    hoursUsed?: number;
    roundRobinTeams?: string[];
    autoTranscribeAudio?: boolean;
    slaMinutes?: number;
  };
}

const initialModules: MarketplaceModule[] = [
  {
    id: 'crm-core',
    name: 'CRM Principal',
    category: 'crm',
    categoryLabel: 'CRM',
    status: 'ACTIVE',
    icon: 'users',
    description: 'Gestão centralizada de relacionamento com clientes, preparada para operações automotivas de alto volume.',
    versionOrRequirement: 'v2.4.1',
    functionalColors: {
      iconLight: 'text-[#7C3AED]',
      containerLight: 'bg-[#F3E8FF]',
      borderLight: 'border-[#DDD6FE]',
      iconDark: 'dark:text-[#C4B5FD]',
      containerDark: 'dark:bg-[#2A1B4E]',
      borderDark: 'dark:border-[#8B5CF6]/40',
    },
    settings: {
      enabledChannels: ['WhatsApp Cloud API', 'Webmotors Pro', 'Instagram Direct', 'Showroom Presencial'],
      routingMode: 'Pipeline Multicanal Ativo',
    },
  },
  {
    id: 'distribuicao-atendimentos',
    name: 'Distribuição de Atendimentos',
    category: 'routing',
    categoryLabel: 'Distribuição',
    status: 'ACTIVE',
    icon: 'routing',
    description: 'Distribuição inteligente de leads por round-robin, equipe, desempenho e regras comerciais.',
    versionOrRequirement: 'v1.8.0',
    functionalColors: {
      iconLight: 'text-[#7C3AED]',
      containerLight: 'bg-[#F3E8FF]',
      borderLight: 'border-[#DDD6FE]',
      iconDark: 'dark:text-[#DDD6FE]',
      containerDark: 'dark:bg-[#261B3D]',
      borderDark: 'dark:border-[#A78BFA]/40',
    },
    settings: {
      routingMode: 'Roleta Inteligente Ponderada (Round-Robin por Desempenho)',
      roundRobinTeams: ['Equipe Showroom Matriz', 'Equipe Digital / SDR', 'Equipe Seminovos VIP'],
      slaMinutes: 3,
    },
  },
  {
    id: 'sequencias',
    name: 'Sequências',
    category: 'automation',
    categoryLabel: 'Automação',
    status: 'INACTIVE',
    icon: 'sequences',
    description: 'Cadências automáticas de follow-up por WhatsApp, e-mail e SMS.',
    versionOrRequirement: 'Requer API do WhatsApp',
    functionalColors: {
      iconLight: 'text-[#2563EB]',
      containerLight: 'bg-[#EFF6FF]',
      borderLight: 'border-[#BFDBFE]',
      iconDark: 'dark:text-[#93C5FD]',
      containerDark: 'dark:bg-[#172554]',
      borderDark: 'dark:border-[#3B82F6]/40',
    },
    settings: {
      enabledChannels: ['WhatsApp API', 'E-mail Comercial', 'SMS Transacional'],
    },
  },
  {
    id: 'grid-ai',
    name: 'Grid AI',
    badge: 'BETA',
    category: 'ai',
    categoryLabel: 'IA',
    status: 'ACTIVE',
    icon: 'grid-ai',
    isProprietaryAi: true,
    description: 'Score preditivo de leads, análise de intenção e automações inteligentes com IA.',
    versionOrRequirement: 'v0.9.4-beta',
    functionalColors: {
      iconLight: 'text-[#7C3AED]',
      containerLight: 'bg-[#F3E8FF]',
      borderLight: 'border-[#C4B5FD]',
      iconDark: 'dark:text-[#E9D5FF]',
      containerDark: 'dark:bg-[#3B1C71]',
      borderDark: 'dark:border-[#8B5CF6]/60',
      accentGlow: 'shadow-[0_0_24px_rgba(139,92,246,0.14)] dark:shadow-[0_0_24px_rgba(139,92,246,0.22)]',
    },
    settings: {
      aiModel: 'Gemini 3.7 Pro + MotorGrid Automotive Engine',
    },
  },
  {
    id: 'integracao-estoque',
    name: 'Integração de Estoque',
    category: 'inventory',
    categoryLabel: 'Estoque',
    status: 'INACTIVE',
    icon: 'inventory',
    description: 'Sincronização em tempo real do estoque com DMS, portais e plataformas externas.',
    versionOrRequirement: 'Requer Conexão DMS',
    functionalColors: {
      iconLight: 'text-[#059669]',
      containerLight: 'bg-[#ECFDF5]',
      borderLight: 'border-[#A7F3D0]',
      iconDark: 'dark:text-[#5EEAD4]',
      containerDark: 'dark:bg-[#134E4A]',
      borderDark: 'dark:border-[#14B8A6]/40',
    },
    settings: {
      dmsProvider: 'AutoConexão Webmotors + Linx DMS + NBS',
    },
  },
  {
    id: 'transcricao-audio',
    name: 'Transcrição de Áudio',
    category: 'audio',
    categoryLabel: 'Comunicação',
    status: 'ACTIVE',
    icon: 'audio',
    description: 'Transcrição automática de chamadas e áudios do WhatsApp com identificação de palavras-chave.',
    versionOrRequirement: 'Consumo: 45/100 hrs',
    usageText: 'Consumo: 45/100 hrs',
    functionalColors: {
      iconLight: 'text-[#059669]',
      containerLight: 'bg-[#ECFDF5]',
      borderLight: 'border-[#A7F3D0]',
      iconDark: 'dark:text-[#6EE7B7]',
      containerDark: 'dark:bg-[#064E3B]',
      borderDark: 'dark:border-[#10B981]/40',
    },
    settings: {
      maxHours: 100,
      hoursUsed: 45,
      autoTranscribeAudio: true,
    },
  },
];

interface MarketplaceViewProps {
  onNavigateTab?: (tab: any) => void;
  theme?: 'dark' | 'light';
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ onNavigateTab, theme }) => {
  const toast = useToast();
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>(() => {
    if (theme) return theme;
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('light') ? 'light' : 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    if (theme) {
      setCurrentTheme(theme);
      return;
    }
    const updateThemeFromDoc = () => {
      if (typeof document !== 'undefined') {
        setCurrentTheme(document.documentElement.classList.contains('light') ? 'light' : 'dark');
      }
    };
    updateThemeFromDoc();
    const observer = new MutationObserver(updateThemeFromDoc);
    if (typeof document !== 'undefined') {
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    }
    return () => observer.disconnect();
  }, [theme]);

  const isLight = currentTheme === 'light';
  const [modules, setModules] = useState<MarketplaceModule[]>(() => {
    const saved = storageService.getMarketplaceModules<MarketplaceModule>(initialModules);
    return initialModules.map((init) => {
      const match = saved.find((s) => s.id === init.id);
      if (match) {
        return {
          ...init,
          status: match.status,
          settings: match.settings || init.settings,
        };
      }
      return init;
    });
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Modal State
  const [selectedModuleForConfig, setSelectedModuleForConfig] = useState<MarketplaceModule | null>(null);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [editableSettings, setEditableSettings] = useState<any>({});

  // Persist modules whenever changed
  const updateModulesState = (newModules: MarketplaceModule[]) => {
    setModules(newModules);
    storageService.saveMarketplaceModules(newModules);
  };

  const handleToggleModuleStatus = (moduleId: string) => {
    const targetModule = modules.find((m) => m.id === moduleId);
    if (!targetModule) return;

    const newStatus = targetModule.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const updated = modules.map((mod) => {
      if (mod.id === moduleId) {
        return {
          ...mod,
          status: newStatus,
        };
      }
      return mod;
    });

    updateModulesState(updated);

    if (newStatus === 'ACTIVE') {
      toast.success(`Módulo "${targetModule.name}" ativado com sucesso!`, 'Módulo Ativado');
    } else {
      toast.info(`Módulo "${targetModule.name}" foi desativado.`, 'Módulo Desativado');
    }
  };

  const handleOpenConfig = (module: MarketplaceModule) => {
    setSelectedModuleForConfig(module);
    setShowDeactivateConfirm(false);
    setEditableSettings({ ...module.settings });
  };

  const handleSaveConfig = () => {
    if (!selectedModuleForConfig) return;

    const updated = modules.map((m) =>
      m.id === selectedModuleForConfig.id
        ? { ...m, settings: { ...editableSettings } }
        : m
    );

    updateModulesState(updated);
    toast.success(`Configurações de "${selectedModuleForConfig.name}" atualizadas!`, 'Salvo com Sucesso');
    setSelectedModuleForConfig(null);
  };

  const handleDeactivateFromModal = () => {
    if (!selectedModuleForConfig) return;

    const updated = modules.map((mod) =>
      mod.id === selectedModuleForConfig.id
        ? { ...mod, status: 'INACTIVE' as const }
        : mod
    );

    updateModulesState(updated);
    toast.info(`Módulo "${selectedModuleForConfig.name}" desativado com sucesso.`, 'Módulo Desativado');
    setSelectedModuleForConfig(null);
    setShowDeactivateConfirm(false);
  };

  const filteredModules = modules.filter((mod) => {
    const matchesSearch =
      mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || mod.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || mod.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const renderModuleIcon = (iconType: string) => {
    switch (iconType) {
      case 'users':
        return <Users className="w-6 h-6 sm:w-7 sm:h-7" />;
      case 'routing':
        return <GitFork className="w-6 h-6 sm:w-7 sm:h-7" />;
      case 'sequences':
        return <ListOrdered className="w-6 h-6 sm:w-7 sm:h-7" />;
      case 'grid-ai':
        return <Cpu className="w-6 h-6 sm:w-7 sm:h-7" />;
      case 'inventory':
        return <Warehouse className="w-6 h-6 sm:w-7 sm:h-7" />;
      case 'audio':
        return <Waves className="w-6 h-6 sm:w-7 sm:h-7" />;
      default:
        return <Users className="w-6 h-6 sm:w-7 sm:h-7" />;
    }
  };

  const hasActiveFilters = statusFilter !== 'ALL' || categoryFilter !== 'ALL' || searchQuery.trim().length > 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Marketplace de Módulos
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
            Descubra, integre e configure módulos para controlar todos os aspectos da sua operação automotiva.
          </p>
        </div>

        {/* Filter Modules Button with Dropdown */}
        <div className="relative shrink-0">
          <button
            id="filter-modules-btn"
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isFilterDropdownOpen || hasActiveFilters
                ? 'bg-purple-50 dark:bg-[#2A1B4E] border-[#8B5CF6] text-[#7C3AED] dark:text-white shadow-md shadow-[#8B5CF6]/15'
                : 'bg-white dark:bg-[#18181B] hover:bg-slate-50 dark:hover:bg-zinc-800 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300'
            }`}
          >
            <Filter className="w-4 h-4 text-[#8B5CF6]" />
            <span>Filtrar Módulos</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" />
            )}
          </button>

          {/* Filter Popover */}
          {isFilterDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsFilterDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-zinc-800 shadow-2xl p-4 z-40 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Filtrar Módulos
                  </span>
                  {hasActiveFilters && (
                    <button
                      onClick={() => {
                        setStatusFilter('ALL');
                        setCategoryFilter('ALL');
                        setSearchQuery('');
                      }}
                      className="text-[11px] text-purple-600 dark:text-[#C4B5FD] hover:underline cursor-pointer font-medium"
                    >
                      Limpar Filtros
                    </button>
                  )}
                </div>

                {/* Search in filter */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Buscar módulo..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-zinc-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:border-[#8B5CF6] outline-none"
                  />
                </div>

                {/* Status Filter */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 block">
                    Status do Módulo
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                          statusFilter === st
                            ? 'bg-[#8B5CF6] text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-[#0A0A0B] hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                        }`}
                      >
                        {st === 'ALL' ? 'Todos' : st === 'ACTIVE' ? 'Ativos' : 'Inativos'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 block">
                    Categoria
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'ALL', label: 'Todas' },
                      { id: 'crm', label: 'CRM' },
                      { id: 'routing', label: 'Distribuição' },
                      { id: 'automation', label: 'Automação' },
                      { id: 'ai', label: 'IA' },
                      { id: 'inventory', label: 'Estoque' },
                      { id: 'audio', label: 'Comunicação' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setCategoryFilter(cat.id)}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all text-left truncate cursor-pointer ${
                          categoryFilter === cat.id
                            ? 'bg-purple-100 dark:bg-[#8B5CF6]/30 text-purple-900 dark:text-[#DDD6FE] border border-[#8B5CF6]/40'
                            : 'bg-slate-100 dark:bg-[#0A0A0B] hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Grid of Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((item) => {
          const isActive = item.status === 'ACTIVE';

          return (
            <div
              key={item.id}
              className={`marketplace-module-card px-6 py-5 rounded-[20px] transition-all duration-[180ms] ease-out flex flex-col justify-between space-y-4 group ${
                item.isProprietaryAi
                  ? 'border-[#C4B5FD] dark:border-[#8B5CF6]/50 shadow-[0_8px_24px_rgba(15,23,42,0.07)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)] dark:shadow-[0_0_24px_rgba(139,92,246,0.18)] hover:-translate-y-0.5 hover:border-[#8B5CF6] hover:shadow-[0_12px_30px_rgba(15,23,42,0.10)] dark:hover:-translate-y-0.5 dark:hover:border-[#8B5CF6]'
                  : 'border-[#E2E8F0] dark:border-zinc-800/90 shadow-[0_8px_24px_rgba(15,23,42,0.07)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 hover:border-[#C4B5FD] hover:shadow-[0_12px_30px_rgba(15,23,42,0.10)] dark:hover:-translate-y-0.5 dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.45)] dark:hover:border-[#8B5CF6]/40'
              }`}
              style={{
                backgroundColor: 'var(--marketplace-card-bg)',
                borderColor: item.isProprietaryAi ? (isLight ? '#C4B5FD' : undefined) : 'var(--marketplace-card-border)',
                boxShadow: isLight ? '0 8px 24px rgba(15,23,42,0.07)' : undefined,
              }}
            >
              <div className="space-y-3">
                {/* Header: [Icon + Category/Title] on Left, Status Badge on Right */}
                <div className="flex items-start justify-between gap-3">
                  {/* Icon and Category/Title side by side (display: flex; align-items: center; gap: 14px) */}
                  <div
                    className="min-w-0"
                    style={{ display: 'flex', alignItems: 'center', gap: '14px' }}
                  >
                    {/* Functional Color Icon Box */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 border ${item.functionalColors.containerLight} ${item.functionalColors.iconLight} ${item.functionalColors.borderLight} ${item.functionalColors.containerDark} ${item.functionalColors.iconDark} ${item.functionalColors.borderDark}`}
                    >
                      {renderModuleIcon(item.icon)}
                    </div>

                    {/* Category and Module Title */}
                    <div className="min-w-0">
                      <span
                        className="marketplace-card-category text-[10px] font-semibold uppercase tracking-wider block leading-tight text-[#64748B] dark:text-zinc-400 dark:font-bold"
                        style={{
                          color: isLight ? '#64748B' : undefined,
                          fontWeight: isLight ? 600 : undefined,
                        }}
                      >
                        {item.categoryLabel}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <h3
                          className="marketplace-card-title text-base sm:text-lg font-bold tracking-tight truncate text-[#0F172A] dark:text-white"
                          style={{
                            color: 'var(--marketplace-card-title)',
                            fontWeight: 700,
                          }}
                        >
                          {item.name}
                        </h3>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#F3E8FF] text-[#7C3AED] border border-[#C4B5FD] dark:bg-[#2A1B4E] dark:text-[#DDD6FE] dark:border-[#8B5CF6]/40 shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge: Active vs Inactive (top-right corner) */}
                  <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                    {isActive ? (
                      <div className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide flex items-center gap-1.5 bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] dark:bg-[#064E3B]/40 dark:text-[#34D399] dark:border-[#059669]/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] dark:bg-[#34D399] animate-pulse" />
                        <span>ATIVO</span>
                      </div>
                    ) : (
                      <div className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-[#F8FAFC] text-[#64748B] border border-[#CBD5E1] dark:bg-[#18181B] dark:text-[#A1A1AA] dark:border-zinc-800">
                        <span>INATIVO</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description (2 or 3 lines) */}
                <p
                  className="marketplace-card-desc text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3 text-[#475569] dark:text-zinc-400"
                  style={{
                    color: 'var(--marketplace-card-text)',
                  }}
                >
                  {item.description}
                </p>
              </div>

              {/* Card Footer: Version/Requirement on Left, Action on Right */}
              <div
                className="marketplace-card-divider pt-3 border-t border-[#E2E8F0] dark:border-zinc-800/80 flex items-center justify-between gap-3 text-xs"
                style={{
                  borderColor: isLight ? '#E2E8F0' : undefined,
                }}
              >
                {/* Left Info: Version, Requirement or Usage */}
                <div
                  className="marketplace-card-footer-meta font-mono text-[11px] truncate text-[#64748B] dark:text-zinc-400"
                  style={{
                    color: isLight ? '#64748B' : undefined,
                  }}
                >
                  {item.usageText || item.versionOrRequirement}
                </div>

                {/* Right Action Button */}
                {isActive ? (
                  <button
                    id={`configure-${item.id}-btn`}
                    onClick={() => handleOpenConfig(item)}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-[#F5F3FF] border border-[#CBD5E1] hover:border-[#8B5CF6] text-[#334155] hover:text-[#7C3AED] dark:bg-[#18181B] dark:hover:bg-[#2A1B4E] dark:border-zinc-700 dark:hover:border-[#8B5CF6] dark:text-zinc-200 dark:hover:text-[#DDD6FE] font-semibold text-xs transition-all cursor-pointer shadow-sm"
                  >
                    Configurar
                  </button>
                ) : (
                  <button
                    id={`enable-${item.id}-btn`}
                    onClick={() => handleToggleModuleStatus(item.id)}
                    className="px-4 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs shadow-sm shadow-[#8B5CF6]/30 hover:shadow-[#8B5CF6]/45 transition-all duration-150 cursor-pointer"
                  >
                    Ativar Módulo
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredModules.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#141416] border border-slate-200 dark:border-zinc-800 space-y-3">
          <Info className="w-8 h-8 text-slate-400 dark:text-zinc-500 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-white">Nenhum módulo encontrado</h4>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Ajuste os filtros ou o termo de busca para visualizar os módulos do MotorGrid.
          </p>
          <button
            onClick={() => {
              setStatusFilter('ALL');
              setCategoryFilter('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-[#8B5CF6] text-white text-xs font-semibold hover:bg-[#7C3AED] cursor-pointer"
          >
            Restaurar Filtros
          </button>
        </div>
      )}

      {/* Interactive Module Configuration Modal */}
      {selectedModuleForConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#8B5CF6]/40 shadow-2xl p-6 sm:p-7 space-y-6 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center border ${selectedModuleForConfig.functionalColors.containerLight} ${selectedModuleForConfig.functionalColors.iconLight} ${selectedModuleForConfig.functionalColors.borderLight} ${selectedModuleForConfig.functionalColors.containerDark} ${selectedModuleForConfig.functionalColors.iconDark} ${selectedModuleForConfig.functionalColors.borderDark}`}
                >
                  {renderModuleIcon(selectedModuleForConfig.icon)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Configurar {selectedModuleForConfig.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] dark:bg-[#064E3B]/40 dark:text-[#34D399] dark:border-[#059669]/50">
                      ATIVO
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Ajuste os parâmetros operacionais e permissões deste módulo no MotorGrid.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedModuleForConfig(null)}
                className="p-2 rounded-xl text-slate-400 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with Contextual Settings */}
            <div className="space-y-4 text-xs">
              {/* CRM Principal Settings */}
              {selectedModuleForConfig.id === 'crm-core' && (
                <div className="space-y-3">
                  <label className="font-semibold text-slate-800 dark:text-zinc-300 block">
                    Canais Ativos Conectados:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      'WhatsApp Business Cloud API',
                      'Webmotors Pro Leads',
                      'Instagram Direct Messages',
                      'iCarros / OLX Autos',
                    ].map((chan, i) => (
                      <label
                        key={i}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-zinc-800 flex items-center gap-2.5 text-slate-700 dark:text-zinc-300 cursor-pointer hover:border-[#8B5CF6]/50"
                      >
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded text-[#8B5CF6] focus:ring-0"
                        />
                        <span className="text-xs">{chan}</span>
                      </label>
                    ))}
                  </div>

                  <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-[#8B5CF6]/30 text-purple-900 dark:text-zinc-300">
                    💡 <strong>Sincronização Bidirecional:</strong> Mensagens enviadas pelos vendedores no
                    WhatsApp são arquivadas no card do lead em menos de 500ms com rastreamento completo de SLA.
                  </div>
                </div>
              )}

              {/* Distribuição Settings */}
              {selectedModuleForConfig.id === 'distribuicao-atendimentos' && (
                <div className="space-y-3">
                  <div>
                    <label className="font-semibold text-slate-800 dark:text-zinc-300 block mb-1">
                      Algoritmo de Roteamento de Leads:
                    </label>
                    <select
                      value={editableSettings.routingMode || 'Roleta Inteligente Ponderada (Round-Robin por Desempenho)'}
                      onChange={(e) =>
                        setEditableSettings({ ...editableSettings, routingMode: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white outline-none"
                    >
                      <option>Roleta Inteligente Ponderada (Round-Robin por Desempenho)</option>
                      <option>Roleta Pura Sequencial (Equitativa 1-por-1)</option>
                      <option>Distribuição por Especialidade de Marca (Ex: Porsche, BMW)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-800 dark:text-zinc-300 block mb-1">
                      SLA Máximo de Atendimento (Transbordo em Minutos):
                    </label>
                    <input
                      type="number"
                      value={editableSettings.slaMinutes || 3}
                      onChange={(e) =>
                        setEditableSettings({
                          ...editableSettings,
                          slaMinutes: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white font-mono"
                    />
                    <span className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 block">
                      Se o vendedor não responder no tempo estipulado, o atendimento é transferido para o próximo consultor disponível.
                    </span>
                  </div>
                </div>
              )}

              {/* Sequências Settings */}
              {selectedModuleForConfig.id === 'sequencias' && (
                <div className="space-y-3">
                  <label className="font-semibold text-slate-800 dark:text-zinc-300 block">
                    Canais Habilitados para Follow-up:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {['WhatsApp API', 'E-mail Comercial', 'SMS Transacional'].map((ch, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-zinc-800 flex items-center gap-2 text-slate-700 dark:text-zinc-300"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{ch}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 text-blue-900 dark:text-blue-200 text-xs">
                    Gatilhos inteligentes disparam cadências pós-visita ou quando propostas ficam sem resposta por mais de 24 horas.
                  </div>
                </div>
              )}

              {/* Grid AI Settings */}
              {selectedModuleForConfig.id === 'grid-ai' && (
                <div className="space-y-3">
                  <div>
                    <label className="font-semibold text-slate-800 dark:text-zinc-300 block mb-1">
                      Modelo de Inteligência Artificial:
                    </label>
                    <input
                      type="text"
                      disabled
                      value="Gemini 3.7 Pro (Google DeepMind) + MotorGrid Copilot"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#0A0A0B] border border-slate-200 dark:border-zinc-800 text-purple-700 dark:text-[#C4B5FD] font-mono font-medium"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-[#8B5CF6]/30 space-y-2">
                    <span className="font-bold text-purple-900 dark:text-[#DDD6FE] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" /> Capacidades Ativas da IA:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-zinc-300 text-[11px]">
                      <li>Lead Scoring Preditivo (0 a 100) calibrado para o mercado automotivo brasileiro</li>
                      <li>Detecção de Objeções (Preço, Troca de Usado, Avaliação da FIPE, Taxas)</li>
                      <li>Briefing Matinal Automático para Gerentes e Consultores</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Integração de Estoque Settings */}
              {selectedModuleForConfig.id === 'integracao-estoque' && (
                <div className="space-y-3">
                  <div>
                    <label className="font-semibold text-slate-800 dark:text-zinc-300 block mb-1">
                      Provedor DMS / ERP Conectado:
                    </label>
                    <select
                      value={editableSettings.dmsProvider || 'AutoConexão Webmotors + Linx DMS + NBS'}
                      onChange={(e) =>
                        setEditableSettings({ ...editableSettings, dmsProvider: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white outline-none"
                    >
                      <option>AutoConexão Webmotors + Linx DMS + NBS</option>
                      <option>Linx DMS Automotivo (API Oficial)</option>
                      <option>NBS Informática ERP</option>
                      <option>MegaDMS / Apollo</option>
                    </select>
                  </div>
                  <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/40 text-teal-900 dark:text-teal-200 text-xs">
                    Sincronização bidirecional com atualização instantânea de status de reserva e venda.
                  </div>
                </div>
              )}

              {/* Transcrição de Áudio Settings */}
              {selectedModuleForConfig.id === 'transcricao-audio' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-zinc-400">Consumo de Horas de Áudio (Mensal):</span>
                      <span className="font-bold text-teal-600 dark:text-teal-400 font-mono">45 / 100 horas (45%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                      <div className="w-[45%] h-full bg-teal-500 rounded-full" />
                    </div>
                  </div>

                  <label className="p-3 rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-zinc-800 flex items-center gap-2.5 text-slate-700 dark:text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editableSettings.autoTranscribeAudio !== false}
                      onChange={(e) =>
                        setEditableSettings({
                          ...editableSettings,
                          autoTranscribeAudio: e.target.checked,
                        })
                      }
                      className="rounded text-teal-500"
                    />
                    <span>Transcrever automaticamente notas de voz de clientes no WhatsApp</span>
                  </label>
                </div>
              )}

              {/* Confirmation view for deactivation */}
              {showDeactivateConfirm && (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/60 space-y-2.5 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 font-bold">
                    <AlertCircle className="w-4 h-4" />
                    <span>Confirmar desativação do módulo</span>
                  </div>
                  <p className="text-xs text-amber-700 dark:text-amber-300/90 leading-relaxed">
                    Ao desativar este módulo, recursos automáticos associados serão pausados temporariamente até uma nova ativação. Deseja continuar?
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleDeactivateFromModal}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer transition-colors"
                    >
                      Confirmar Desativação
                    </button>
                    <button
                      onClick={() => setShowDeactivateConfirm(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-medium text-xs cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              {!showDeactivateConfirm && (
                <button
                  type="button"
                  onClick={() => setShowDeactivateConfirm(true)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-zinc-900 dark:hover:bg-rose-950/30 text-slate-600 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-300 border border-slate-200 hover:border-rose-200 dark:border-zinc-800 dark:hover:border-rose-800/40 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Desativar Módulo
                </button>
              )}

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedModuleForConfig(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0A0A0B] dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-zinc-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="px-5 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold shadow-md shadow-[#8B5CF6]/25 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Configurações</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
