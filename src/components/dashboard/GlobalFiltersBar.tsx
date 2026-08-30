import React from 'react';
import { Filter, RotateCcw, Calendar, Building2, Users, User, Share2, Sparkles } from 'lucide-react';
import { DashboardFilters, PeriodPreset } from '../../types/dashboard';

interface GlobalFiltersBarProps {
  filters: DashboardFilters;
  onFilterChange: (newFilters: DashboardFilters) => void;
  onResetFilters: () => void;
}

export const GlobalFiltersBar: React.FC<GlobalFiltersBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const periodPresets: { id: PeriodPreset; label: string }[] = [
    { id: 'hoje', label: 'Hoje' },
    { id: 'ontem', label: 'Ontem' },
    { id: '7dias', label: '7 dias' },
    { id: '30dias', label: '30 dias' },
    { id: 'mes_atual', label: 'Mês Atual' },
    { id: 'mes_anterior', label: 'Mês Anterior' },
    { id: 'personalizado', label: 'Personalizado' },
  ];

  const handlePeriodChange = (period: PeriodPreset) => {
    onFilterChange({
      ...filters,
      period,
      startDate: period === 'personalizado' ? filters.startDate || '2026-08-01' : undefined,
      endDate: period === 'personalizado' ? filters.endDate || '2026-08-30' : undefined,
    });
  };

  const isFiltered =
    filters.period !== 'mes_atual' ||
    filters.store !== 'all' ||
    filters.team !== 'all' ||
    filters.seller !== 'all' ||
    filters.origin !== 'all' ||
    filters.channelType !== 'all' ||
    filters.status !== 'all';

  return (
    <div className="bg-[#1C1C1E] border border-neutral-800 rounded-xl p-4 space-y-4 shadow-sm">
      {/* Linha 1: Seletores Rápidos de Período */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#8B5CF6]" />
            Período:
          </span>
          <div className="flex items-center flex-wrap gap-1.5">
            {periodPresets.map((p) => {
              const isActive = filters.period === p.id;
              return (
                <button
                  key={p.id}
                  id={`filter-period-${p.id}`}
                  onClick={() => handlePeriodChange(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#8B5CF6] text-white shadow-sm font-semibold'
                      : 'bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/40'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Campos de data caso seja período personalizado */}
        {filters.period === 'personalizado' && (
          <div className="flex items-center gap-2 bg-neutral-900/90 border border-neutral-700/60 p-1.5 rounded-lg">
            <span className="text-xs text-neutral-400 pl-1">De:</span>
            <input
              id="filter-custom-start-date"
              type="date"
              value={filters.startDate || '2026-08-01'}
              onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
              className="bg-neutral-800 text-neutral-200 text-xs px-2 py-1 rounded border border-neutral-700 focus:outline-none focus:border-[#8B5CF6]"
            />
            <span className="text-xs text-neutral-400">Até:</span>
            <input
              id="filter-custom-end-date"
              type="date"
              value={filters.endDate || '2026-08-30'}
              onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
              className="bg-neutral-800 text-neutral-200 text-xs px-2 py-1 rounded border border-neutral-700 focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>
        )}

        {/* Botão de Limpar Filtros */}
        {isFiltered && (
          <button
            id="btn-reset-filters"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 hover:text-white bg-neutral-800/60 hover:bg-neutral-800 rounded-lg border border-neutral-700/50 transition-colors ml-auto lg:ml-0"
          >
            <RotateCcw className="w-3 h-3 text-[#8B5CF6]" />
            <span>Limpar Filtros</span>
          </button>
        )}
      </div>

      {/* Linha 2: Dropdowns de Filtros Operacionais */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-neutral-800/60">
        {/* Loja / Unidade */}
        <div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-1 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-[#8B5CF6]" />
            Loja / Unidade
          </label>
          <select
            id="filter-select-store"
            value={filters.store}
            onChange={(e) => onFilterChange({ ...filters, store: e.target.value })}
            className="w-full bg-neutral-900 border border-neutral-750 text-neutral-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#8B5CF6] transition-colors"
          >
            <option value="all">Todas as Lojas</option>
            <option value="unit-1">Matriz Alphaville</option>
            <option value="unit-2">Filial Jardins</option>
            <option value="unit-3">Filial Barra da Tijuca</option>
          </select>
        </div>

        {/* Equipe */}
        <div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-1 flex items-center gap-1">
            <Users className="w-3 h-3 text-[#8B5CF6]" />
            Equipe
          </label>
          <select
            id="filter-select-team"
            value={filters.team}
            onChange={(e) => onFilterChange({ ...filters, team: e.target.value })}
            className="w-full bg-neutral-900 border border-neutral-750 text-neutral-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#8B5CF6] transition-colors"
          >
            <option value="all">Todas as Equipes</option>
            <option value="Pré-Atendimento">Pré-Atendimento (SDR)</option>
            <option value="Vendas Matriz">Vendas Matriz</option>
            <option value="Vendas Filial Jardins">Vendas Filial Jardins</option>
            <option value="Vendas Barra">Vendas Barra</option>
            <option value="Recuperação">Recuperação</option>
          </select>
        </div>

        {/* Vendedor */}
        <div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-1 flex items-center gap-1">
            <User className="w-3 h-3 text-[#8B5CF6]" />
            Vendedor
          </label>
          <select
            id="filter-select-seller"
            value={filters.seller}
            onChange={(e) => onFilterChange({ ...filters, seller: e.target.value })}
            className="w-full bg-neutral-900 border border-neutral-750 text-neutral-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#8B5CF6] transition-colors"
          >
            <option value="all">Todos os Vendedores</option>
            <option value="Ana Luísa Castilho">Ana Luísa Castilho</option>
            <option value="Rodrigo Mendes">Rodrigo Mendes</option>
            <option value="Lucas Nogueira">Lucas Nogueira</option>
            <option value="Camila Rocha">Camila Rocha</option>
            <option value="Felipe Fontana">Felipe Fontana</option>
            <option value="Beatriz Fagundes">Beatriz Fagundes</option>
          </select>
        </div>

        {/* Origem do Lead */}
        <div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-1 flex items-center gap-1">
            <Share2 className="w-3 h-3 text-[#8B5CF6]" />
            Origem do Lead
          </label>
          <select
            id="filter-select-origin"
            value={filters.origin}
            onChange={(e) => onFilterChange({ ...filters, origin: e.target.value })}
            className="w-full bg-neutral-900 border border-neutral-750 text-neutral-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#8B5CF6] transition-colors"
          >
            <option value="all">Todas as Origens</option>
            <option value="Meta Ads">Meta Ads</option>
            <option value="Instagram">Instagram</option>
            <option value="Facebook">Facebook</option>
            <option value="Google">Google Search Ads</option>
            <option value="Webmotors">Webmotors</option>
            <option value="iCarros">iCarros</option>
            <option value="OLX">OLX</option>
            <option value="Site">Site MotorGrid</option>
            <option value="Presencial">Presencial (Showroom)</option>
            <option value="Indicação">Indicação</option>
            <option value="WhatsApp">WhatsApp Direto</option>
          </select>
        </div>

        {/* Tipo de Atendimento */}
        <div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#8B5CF6]" />
            Atendimento
          </label>
          <select
            id="filter-select-channel-type"
            value={filters.channelType}
            onChange={(e) => onFilterChange({ ...filters, channelType: e.target.value as any })}
            className="w-full bg-neutral-900 border border-neutral-750 text-neutral-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#8B5CF6] transition-colors"
          >
            <option value="all">Todos os Tipos</option>
            <option value="online">Online (WhatsApp / Portais)</option>
            <option value="presencial">Presencial (Showroom)</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
            Status
          </label>
          <select
            id="filter-select-status"
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value as any })}
            className="w-full bg-neutral-900 border border-neutral-750 text-neutral-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#8B5CF6] transition-colors"
          >
            <option value="all">Todos os Status</option>
            <option value="novo">Novo</option>
            <option value="em_atendimento">Em Atendimento</option>
            <option value="qualificado">Qualificado</option>
            <option value="agendado">Agendado</option>
            <option value="visitou">Visitou</option>
            <option value="proposta">Proposta</option>
            <option value="ganho">Vendido (Ganho)</option>
            <option value="perdido">Perdido</option>
          </select>
        </div>
      </div>
    </div>
  );
};
