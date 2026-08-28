import React, { useState } from 'react';
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
} from 'lucide-react';

export interface MarketplaceModule {
  id: string;
  name: string;
  badge?: string;
  category: 'crm' | 'routing' | 'automation' | 'ai' | 'inventory' | 'audio';
  status: 'ACTIVE' | 'INACTIVE';
  icon: 'users' | 'routing' | 'sequences' | 'grid-ai' | 'inventory' | 'audio';
  iconColor: string;
  description: string;
  versionOrRequirement: string;
  usageText?: string;
  settings: {
    enabledChannels?: string[];
    routingMode?: string;
    aiModel?: string;
    dmsProvider?: string;
    maxHours?: number;
    hoursUsed?: number;
    roundRobinTeams?: string[];
  };
}

const initialModules: MarketplaceModule[] = [
  {
    id: 'crm-core',
    name: 'CRM Core',
    category: 'crm',
    status: 'ACTIVE',
    icon: 'users',
    iconColor: 'bg-[#2A1B4E]/80 text-[#C4B5FD] border border-[#8B5CF6]/30',
    description: 'Centralized customer relationship management tailored for high-volume automotive sales cycles.',
    versionOrRequirement: 'v2.4.1',
    settings: {
      enabledChannels: ['WhatsApp Cloud API', 'Webmotors Pro', 'Instagram Direct', 'Showroom Presencial'],
      routingMode: 'Pipeline Multicanal Ativo',
    },
  },
  {
    id: 'distribuicao-atendimentos',
    name: 'Distribuição de Atendimentos',
    category: 'routing',
    status: 'ACTIVE',
    icon: 'routing',
    iconColor: 'bg-[#2A1B4E]/80 text-[#C4B5FD] border border-[#8B5CF6]/30',
    description: 'Intelligent round-robin and performance-based lead routing system for sales floors.',
    versionOrRequirement: 'v1.8.0',
    settings: {
      routingMode: 'Roleta Ponderada por Performance de Vendas (Round-Robin)',
      roundRobinTeams: ['Equipe Showroom Matriz', 'Equipe Digital / SDR', 'Equipe Seminovos VIP'],
    },
  },
  {
    id: 'sequencias',
    name: 'Sequências',
    category: 'automation',
    status: 'INACTIVE',
    icon: 'sequences',
    iconColor: 'bg-[#1C1C1E] text-zinc-400 border border-zinc-700/50',
    description: 'Automated multi-channel follow-up cadences via WhatsApp, Email, and SMS.',
    versionOrRequirement: 'Requires WhatsApp API',
    settings: {
      enabledChannels: ['WhatsApp API', 'E-mail Comercial', 'SMS Transacional'],
    },
  },
  {
    id: 'grid-ai',
    name: 'Grid AI',
    badge: 'BETA',
    category: 'ai',
    status: 'ACTIVE',
    icon: 'grid-ai',
    iconColor: 'bg-[#2A1B4E]/80 text-[#C4B5FD] border border-[#8B5CF6]/30',
    description: 'Predictive lead scoring and automated sentiment analysis powered by advanced machine learning models.',
    versionOrRequirement: 'v0.9.4-beta',
    settings: {
      aiModel: 'Gemini 3.7 Pro + MotorGrid Automotive Engine',
    },
  },
  {
    id: 'integracao-estoque',
    name: 'Integração de Estoque',
    category: 'inventory',
    status: 'INACTIVE',
    icon: 'inventory',
    iconColor: 'bg-[#1C1C1E] text-zinc-400 border border-zinc-700/50',
    description: 'Real-time inventory synchronization with DMS and external marketplace platforms.',
    versionOrRequirement: 'DMS Connection Req.',
    settings: {
      dmsProvider: 'AutoConexão Webmotors + Linx DMS + NBS',
    },
  },
  {
    id: 'transcricao-audio',
    name: 'Transcrição de Áudio',
    category: 'audio',
    status: 'ACTIVE',
    icon: 'audio',
    iconColor: 'bg-[#042F2E]/90 text-teal-300 border border-teal-600/40',
    description: 'Automatic transcription of sales calls and WhatsApp voice notes with keyword tagging.',
    versionOrRequirement: '',
    usageText: 'Usage: 45/100 hrs',
    settings: {
      maxHours: 100,
      hoursUsed: 45,
    },
  },
];

interface MarketplaceViewProps {
  onNavigateTab?: (tab: any) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ onNavigateTab }) => {
  const [modules, setModules] = useState<MarketplaceModule[]>(initialModules);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [selectedModuleForConfig, setSelectedModuleForConfig] = useState<MarketplaceModule | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleModuleStatus = (moduleId: string) => {
    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id === moduleId) {
          const newStatus = mod.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          showToast(
            newStatus === 'ACTIVE'
              ? `Módulo "${mod.name}" ativado com sucesso!`
              : `Módulo "${mod.name}" desativado.`
          );
          return {
            ...mod,
            status: newStatus,
            iconColor:
              newStatus === 'ACTIVE'
                ? mod.icon === 'audio'
                  ? 'bg-[#042F2E]/90 text-teal-300 border border-teal-600/40'
                  : 'bg-[#2A1B4E]/80 text-[#C4B5FD] border border-[#8B5CF6]/30'
                : 'bg-[#1C1C1E] text-zinc-400 border border-zinc-700/50',
          };
        }
        return mod;
      })
    );
  };

  const handleSaveConfig = (updatedModule: MarketplaceModule) => {
    setModules((prev) => prev.map((m) => (m.id === updatedModule.id ? updatedModule : m)));
    setSelectedModuleForConfig(null);
    showToast(`Configurações de "${updatedModule.name}" atualizadas!`);
  };

  const filteredModules = modules.filter((mod) => {
    const matchesSearch =
      mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || mod.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || mod.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const renderModuleIcon = (iconType: string) => {
    switch (iconType) {
      case 'users':
        return <Users className="w-5 h-5" />;
      case 'routing':
        return <GitFork className="w-5 h-5" />;
      case 'sequences':
        return <ListOrdered className="w-5 h-5" />;
      case 'grid-ai':
        return <Cpu className="w-5 h-5" />;
      case 'inventory':
        return <Warehouse className="w-5 h-5" />;
      case 'audio':
        return <Waves className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6] text-white text-xs font-semibold shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Section (Exact Layout & Typography from Image) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            App Marketplace
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed">
            Discover, integrate, and configure modular applications to command every aspect of your
            dealership operations.
          </p>
        </div>

        {/* Filter Apps Button with Dropdown */}
        <div className="relative shrink-0">
          <button
            id="filter-apps-btn"
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isFilterDropdownOpen || statusFilter !== 'ALL' || categoryFilter !== 'ALL' || searchQuery
                ? 'bg-[#2A1B4E] border-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/20'
                : 'bg-[#18181B] hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Apps</span>
            {(statusFilter !== 'ALL' || categoryFilter !== 'ALL' || searchQuery) && (
              <span className="w-2 h-2 rounded-full bg-[#C4B5FD] animate-pulse" />
            )}
          </button>

          {/* Filter Popover */}
          {isFilterDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsFilterDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#1C1C1E] border border-zinc-800 shadow-2xl p-4 z-40 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Filtrar Aplicativos
                  </span>
                  <button
                    onClick={() => {
                      setStatusFilter('ALL');
                      setCategoryFilter('ALL');
                      setSearchQuery('');
                    }}
                    className="text-[11px] text-zinc-400 hover:text-[#C4B5FD] cursor-pointer"
                  >
                    Limpar Filtros
                  </button>
                </div>

                {/* Search in filter */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Buscar módulo..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#0A0A0B] border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:border-[#8B5CF6] outline-none"
                  />
                </div>

                {/* Status Filter */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-zinc-400 block">Status do Módulo</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                          statusFilter === st
                            ? 'bg-[#8B5CF6] text-white'
                            : 'bg-[#0A0A0B] hover:bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {st === 'ALL' ? 'Todos' : st === 'ACTIVE' ? 'Ativos' : 'Inativos'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-zinc-400 block">Categoria</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'ALL', label: 'Todas' },
                      { id: 'crm', label: 'CRM Core' },
                      { id: 'routing', label: 'Distribuição' },
                      { id: 'ai', label: 'Inteligência (IA)' },
                      { id: 'automation', label: 'Automação' },
                      { id: 'inventory', label: 'Estoque' },
                      { id: 'audio', label: 'Voz & Áudio' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setCategoryFilter(cat.id)}
                        className={`py-1 px-2 rounded-lg text-[10px] font-medium transition-all text-left truncate cursor-pointer ${
                          categoryFilter === cat.id
                            ? 'bg-[#8B5CF6]/30 text-[#DDD6FE] border border-[#8B5CF6]/50'
                            : 'bg-[#0A0A0B] hover:bg-zinc-800 text-zinc-400'
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

      {/* Grid of 6 Cards (Exact Design System & Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((item) => {
          const isActive = item.status === 'ACTIVE';

          return (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-[#141416] border border-zinc-800/80 hover:border-zinc-700/90 transition-all flex flex-col justify-between space-y-6 group shadow-lg"
            >
              <div className="space-y-4">
                {/* Top Row: Icon Container & Status Badge */}
                <div className="flex items-center justify-between">
                  {/* Icon Box */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${item.iconColor}`}
                  >
                    {renderModuleIcon(item.icon)}
                  </div>

                  {/* Status Badge (Exact active / inactive pill style) */}
                  <div
                    className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide flex items-center gap-1.5 uppercase ${
                      isActive
                        ? 'bg-[#1E1B2E] text-zinc-200 border border-zinc-700/60'
                        : 'bg-[#18181B] text-zinc-400 border border-zinc-800'
                    }`}
                  >
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                    <span>{item.status}</span>
                  </div>
                </div>

                {/* Module Title with optional BETA badge */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {item.name}
                    </h3>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#2A1B4E] text-[#DDD6FE] border border-[#8B5CF6]/40 tracking-wider">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Card Footer: Version/Requirement on Left, Action on Right */}
              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-3 text-xs">
                {/* Left Info: Version, Requirement or Usage */}
                <div className="text-zinc-500 font-mono text-[11px] truncate">
                  {item.usageText || item.versionOrRequirement}
                </div>

                {/* Right Action Button */}
                {isActive ? (
                  <button
                    id={`configure-${item.id}-btn`}
                    onClick={() => setSelectedModuleForConfig(item)}
                    className="px-4 py-1.5 rounded-lg bg-[#18181B] hover:bg-zinc-800 border border-zinc-700/80 hover:border-zinc-600 text-zinc-200 hover:text-white font-semibold text-xs transition-all cursor-pointer font-['Plus_Jakarta_Sans',sans-serif]"
                  >
                    Configure
                  </button>
                ) : (
                  <button
                    id={`enable-${item.id}-btn`}
                    onClick={() => handleToggleModuleStatus(item.id)}
                    className="px-4 py-1.5 rounded-lg bg-[#C4B5FD] hover:bg-[#DDD6FE] text-[#2E1065] font-bold text-xs shadow-md shadow-[#8B5CF6]/20 transition-all cursor-pointer font-['Plus_Jakarta_Sans',sans-serif]"
                  >
                    Enable Module
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Module Configuration Modal */}
      {selectedModuleForConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#18181B] border border-[#8B5CF6]/40 shadow-2xl p-6 space-y-6 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedModuleForConfig.iconColor}`}
                >
                  {renderModuleIcon(selectedModuleForConfig.icon)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">
                      Configurar {selectedModuleForConfig.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {selectedModuleForConfig.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Ajuste os parâmetros operacionais e permissões deste módulo
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedModuleForConfig(null)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with Contextual Settings */}
            <div className="space-y-4 text-xs">
              {/* CRM Core Settings */}
              {selectedModuleForConfig.id === 'crm-core' && (
                <div className="space-y-3">
                  <label className="font-semibold text-zinc-300 block">Canais Ativos Conectados:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'WhatsApp Business Cloud API',
                      'Webmotors Pro Leads',
                      'Instagram Direct Messages',
                      'iCarros / OLX Autos',
                    ].map((chan, i) => (
                      <label
                        key={i}
                        className="p-3 rounded-xl bg-[#0A0A0B] border border-zinc-800 flex items-center gap-2.5 text-zinc-300 cursor-pointer hover:border-[#8B5CF6]/40"
                      >
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded text-[#8B5CF6] focus:ring-0"
                        />
                        <span>{chan}</span>
                      </label>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-purple-950/20 border border-[#8B5CF6]/30 text-zinc-300">
                    💡 <strong>Sincronização Bidirecional:</strong> Mensagens enviadas pelos vendedores no
                    WhatsApp são arquivadas no card do lead em menos de 500ms.
                  </div>
                </div>
              )}

              {/* Distribuição Settings */}
              {selectedModuleForConfig.id === 'distribuicao-atendimentos' && (
                <div className="space-y-3">
                  <div>
                    <label className="font-semibold text-zinc-300 block mb-1">
                      Algoritmo de Roteamento de Leads:
                    </label>
                    <select className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white outline-none">
                      <option>Roleta Inteligente Ponderada (Round-Robin por Performance)</option>
                      <option>Roleta Pura Sequencial (Equitativa 1-por-1)</option>
                      <option>Distribuição por Especialidade de Marca (Ex: Porsche, BMW)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-zinc-300 block mb-1">
                      SLA Máximo de Atendimento (Transbordo):
                    </label>
                    <input
                      type="number"
                      defaultValue={3}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white font-mono"
                    />
                    <span className="text-[11px] text-zinc-400 mt-1 block">
                      Se o vendedor não responder em 3 minutos, o lead transborda para o próximo online.
                    </span>
                  </div>
                </div>
              )}

              {/* Grid AI Settings */}
              {selectedModuleForConfig.id === 'grid-ai' && (
                <div className="space-y-3">
                  <div>
                    <label className="font-semibold text-zinc-300 block mb-1">Modelo de IA:</label>
                    <input
                      type="text"
                      disabled
                      value="Gemini 3.7 Pro (Google DeepMind) + MotorGrid Copilot"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0A0A0B] border border-zinc-800 text-[#C4B5FD] font-mono"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-purple-950/20 border border-[#8B5CF6]/30 space-y-2">
                    <span className="font-bold text-[#DDD6FE] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Recursos Ativos:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-zinc-300 text-[11px]">
                      <li>Lead Scoring Preditivo de 0 a 100 em tempo real</li>
                      <li>Detecção de Objeções (Preço, Troca de Usado, Taxa de Financiamento)</li>
                      <li>Briefing Matinal Executivo e Auditoria de Abordagem</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Transcrição de Áudio Settings */}
              {selectedModuleForConfig.id === 'transcricao-audio' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-[#0A0A0B] border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Consumo de Horas de Áudio (Mensal):</span>
                      <span className="font-bold text-teal-400 font-mono">45 / 100 horas (45%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div className="w-[45%] h-full bg-teal-400 rounded-full" />
                    </div>
                  </div>

                  <label className="p-3 rounded-xl bg-[#0A0A0B] border border-zinc-800 flex items-center gap-2.5 text-zinc-300 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-teal-400" />
                    <span>Transcrever automaticamente notas de voz de clientes no WhatsApp</span>
                  </label>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
              <button
                onClick={() => {
                  handleToggleModuleStatus(selectedModuleForConfig.id);
                  setSelectedModuleForConfig(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 border border-rose-800/40 text-xs font-semibold transition-colors cursor-pointer"
              >
                Desativar Módulo
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedModuleForConfig(null)}
                  className="px-4 py-2 rounded-xl bg-[#0A0A0B] hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleSaveConfig(selectedModuleForConfig)}
                  className="px-5 py-2 rounded-xl bg-[#C4B5FD] hover:bg-[#DDD6FE] text-[#2E1065] text-xs font-bold shadow-md shadow-[#8B5CF6]/20 transition-all flex items-center gap-1.5 cursor-pointer font-['Plus_Jakarta_Sans',sans-serif]"
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
