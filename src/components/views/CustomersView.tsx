import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Building2,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ArrowUpDown,
  Kanban,
  Table as TableIcon,
  ChevronRight,
  TrendingUp,
  Tag,
  Car,
} from 'lucide-react';
import { Customer, Deal, PipelineStage, PlanTier } from '../../types';

interface CustomersViewProps {
  customers: Customer[];
  deals: Deal[];
  onOpenNewCustomer: () => void;
  onOpenCustomerDetail: (customer: Customer) => void;
  onUpdateCustomerStatus: (id: string, newStatus: any) => void;
  onUpdateDealStage: (id: string, newStage: PipelineStage) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  deals,
  onOpenNewCustomer,
  onOpenCustomerDetail,
  onUpdateCustomerStatus,
  onUpdateDealStage,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'pipeline'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCustomers = customers.filter((cust) => {
    const matchesSearch =
      cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.segment.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlan = planFilter === 'all' || cust.plan === planFilter;
    const matchesStatus = statusFilter === 'all' || cust.status === statusFilter;

    return matchesSearch && matchesPlan && matchesStatus;
  });

  const totalMRR = customers.reduce((acc, curr) => acc + (curr.status !== 'Churned' ? curr.mrr : 0), 0);
  const avgHealth = Math.round(customers.reduce((acc, curr) => acc + curr.healthScore, 0) / (customers.length || 1));
  const atRiskCount = customers.filter((c) => c.healthScore < 60).length;

  const handleExportCSV = () => {
    const headers = ['ID,Nome,Empresa,Email,Plano,MRR,Status,HealthScore,Cidade,Segmento\n'];
    const rows = customers.map(
      (c) =>
        `"${c.id}","${c.name}","${c.company}","${c.email}","${c.plan}",${c.mrr},"${c.status}",${c.healthScore},"${c.city}","${c.segment}"`
    );
    const blob = new Blob([headers.join('') + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `motorgrid_clientes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pipelineStages: PipelineStage[] = [
    'Lead',
    'Qualificação',
    'Demonstração',
    'Proposta',
    'Fechado',
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Summary metric banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15 shadow-sm">
          <span className="text-xs text-zinc-400 font-medium">Frotas & Contas Ativas</span>
          <div className="text-xl font-bold text-white mt-1 font-mono">{customers.length} frotas</div>
          <span className="text-[11px] text-[#A78BFA]">Na base conectada</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15 shadow-sm">
          <span className="text-xs text-zinc-400 font-medium">MRR Gerenciado</span>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
            R$ {totalMRR.toLocaleString('pt-BR')}
          </div>
          <span className="text-[11px] text-emerald-500">Recorrência de telemetria</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15 shadow-sm">
          <span className="text-xs text-zinc-400 font-medium">Health Score Médio</span>
          <div className="text-xl font-bold text-[#C4B5FD] mt-1 font-mono">{avgHealth} / 100</div>
          <span className="text-[11px] text-zinc-400">Engajamento satisfatório</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15 shadow-sm">
          <span className="text-xs text-zinc-400 font-medium">Alertas de Telemetria</span>
          <div className="text-xl font-bold text-rose-400 mt-1 font-mono">{atRiskCount} contas</div>
          <span className="text-[11px] text-rose-400 font-medium">Ação prioritária de CS</span>
        </div>
      </div>

      {/* Filter and View Control Bar */}
      <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-md">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 max-w-md bg-[#0A0A0B] px-3.5 py-2 rounded-xl border border-zinc-700/80 focus-within:border-[#8B5CF6]/50 transition-colors">
          <Search className="w-4 h-4 text-[#A78BFA] shrink-0" />
          <input
            type="text"
            placeholder="Buscar por concessionária, frota, contato ou setor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
        </div>

        {/* Filters and buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Plan Filter */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="bg-[#0A0A0B] border border-zinc-700/80 text-zinc-300 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#8B5CF6]/50"
          >
            <option value="all">Todos os Planos</option>
            <option value="Starter">Starter Connected</option>
            <option value="Pro">Pro Telematics</option>
            <option value="Enterprise">Enterprise Fleet</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0A0A0B] border border-zinc-700/80 text-zinc-300 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#8B5CF6]/50"
          >
            <option value="all">Todos os Status</option>
            <option value="Ativo">Ativo</option>
            <option value="Trial">Trial / Homologação</option>
            <option value="Em Risco">Em Risco</option>
            <option value="Churned">Churned</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-[#0A0A0B] p-1 rounded-xl border border-zinc-700/80">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-[#8B5CF6] text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Visualização em Tabela"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('pipeline')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'pipeline' ? 'bg-[#8B5CF6] text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Pipeline / Funil de Vendas"
            >
              <Kanban className="w-4 h-4" />
            </button>
          </div>

          {/* CSV Export */}
          <button
            onClick={handleExportCSV}
            className="p-2 rounded-xl bg-[#0A0A0B] border border-zinc-700/80 text-zinc-300 hover:text-white hover:border-[#8B5CF6]/40 transition-colors cursor-pointer"
            title="Exportar base em CSV"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* New Customer Button */}
          <button
            onClick={onOpenNewCustomer}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold shadow-lg shadow-[#8B5CF6]/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Novo Cliente</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A0A0B]/80 border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Empresa / Frota & Contato</th>
                  <th className="px-4 py-3.5">Plano</th>
                  <th className="px-4 py-3.5">MRR (Recorrência)</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Health Score</th>
                  <th className="px-4 py-3.5">Segmento</th>
                  <th className="px-4 py-3.5">Última Telemetria</th>
                  <th className="px-4 py-3.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    onClick={() => onOpenCustomerDetail(cust)}
                    className="hover:bg-[#8B5CF6]/5 transition-colors cursor-pointer group"
                  >
                    {/* Company & Contact */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={cust.avatar}
                          alt={cust.name}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-[#8B5CF6]/40 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-white text-xs group-hover:text-[#C4B5FD] transition-colors truncate">
                            {cust.company}
                          </div>
                          <div className="text-zinc-400 text-[11px] truncate flex items-center gap-1.5">
                            <span>{cust.name}</span>
                            <span>•</span>
                            <span className="text-zinc-500">{cust.city}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-md font-medium text-[11px] ${
                          cust.plan === 'Enterprise'
                            ? 'bg-[#8B5CF6]/20 text-[#EDE9FE] border border-[#8B5CF6]/40'
                            : cust.plan === 'Pro'
                            ? 'bg-[#6D28D9]/30 text-[#DDD6FE] border border-[#6D28D9]/50'
                            : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                        }`}
                      >
                        {cust.plan}
                      </span>
                    </td>

                    {/* MRR */}
                    <td className="px-4 py-3.5 font-mono font-bold text-zinc-200">
                      R$ {cust.mrr.toLocaleString('pt-BR')}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          cust.status === 'Ativo'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : cust.status === 'Trial'
                            ? 'bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[#8B5CF6]/30'
                            : cust.status === 'Em Risco'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            cust.status === 'Ativo'
                              ? 'bg-emerald-400 shadow-[0_0_6px_#10B981]'
                              : cust.status === 'Trial'
                              ? 'bg-[#8B5CF6] shadow-[0_0_6px_#8B5CF6]'
                              : cust.status === 'Em Risco'
                              ? 'bg-rose-400'
                              : 'bg-zinc-500'
                          }`}
                        />
                        {cust.status}
                      </span>
                    </td>

                    {/* Health Score Gauge */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-[#0A0A0B] rounded-full overflow-hidden border border-zinc-800">
                          <div
                            className={`h-full rounded-full ${
                              cust.healthScore >= 80
                                ? 'bg-emerald-400'
                                : cust.healthScore >= 60
                                ? 'bg-amber-400'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${cust.healthScore}%` }}
                          />
                        </div>
                        <span
                          className={`font-mono text-[11px] font-bold ${
                            cust.healthScore >= 80
                              ? 'text-emerald-400'
                              : cust.healthScore >= 60
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {cust.healthScore}
                        </span>
                      </div>
                    </td>

                    {/* Segment */}
                    <td className="px-4 py-3.5 text-zinc-400 text-xs">
                      {cust.segment}
                    </td>

                    {/* Last Active */}
                    <td className="px-4 py-3.5 text-zinc-400 text-[11px] font-mono">
                      {cust.lastActive}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5 text-right">
                      <button className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#8B5CF6]/20 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCustomers.length === 0 && (
            <div className="p-12 text-center text-zinc-500">
              <Users className="w-10 h-10 mx-auto text-zinc-700 mb-2" />
              <p className="text-sm font-medium text-zinc-400">Nenhuma conta encontrada</p>
              <p className="text-xs text-zinc-600 mt-1">Tente ajustar os filtros ou termo de busca.</p>
            </div>
          )}
        </div>
      ) : (
        /* PIPELINE / DEALS KANBAN VIEW */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto">
          {pipelineStages.map((stage) => {
            const stageDeals = deals.filter((d) => d.stage === stage);
            const stageTotalValue = stageDeals.reduce((acc, curr) => acc + curr.value, 0);

            return (
              <div
                key={stage}
                className="flex flex-col rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15 p-3 min-w-[240px] shadow-sm"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{stage}</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#0A0A0B] text-[#C4B5FD] font-mono border border-zinc-800">
                      {stageDeals.length}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                    R$ {stageTotalValue.toLocaleString('pt-BR')}
                  </span>
                </div>

                {/* Stage Deals List */}
                <div className="flex-1 space-y-2.5 overflow-y-auto min-h-[300px]">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="p-3 rounded-xl bg-[#0A0A0B] border border-zinc-800/90 hover:border-[#8B5CF6]/50 transition-all shadow-sm space-y-2 group"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-zinc-100 group-hover:text-[#C4B5FD] transition-colors">
                          {deal.title}
                        </h4>
                      </div>

                      <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-[#A78BFA]" />
                        <span className="truncate">{deal.company}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80 text-[11px]">
                        <span className="font-mono font-bold text-emerald-400">
                          R$ {deal.value.toLocaleString('pt-BR')}
                        </span>
                        <span className="text-zinc-400">{deal.probability}% prob.</span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-zinc-400">
                        <span>{deal.assignedTo}</span>
                        <span>{deal.expectedClose}</span>
                      </div>

                      {/* Advance Stage Control */}
                      {stage !== 'Fechado' && (
                        <button
                          onClick={() => {
                            const currentIndex = pipelineStages.indexOf(stage);
                            const nextStage = pipelineStages[currentIndex + 1];
                            if (nextStage) onUpdateDealStage(deal.id, nextStage);
                          }}
                          className="w-full mt-1 py-1 rounded-lg bg-zinc-900 hover:bg-[#8B5CF6] text-zinc-300 hover:text-white text-[10px] font-semibold transition-colors cursor-pointer border border-zinc-800 hover:border-transparent"
                        >
                          Avançar Etapa &rarr;
                        </button>
                      )}
                    </div>
                  ))}

                  {stageDeals.length === 0 && (
                    <div className="h-32 border-2 border-dashed border-zinc-800/60 rounded-xl flex items-center justify-center text-[11px] text-zinc-600">
                      Nenhum negócio
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
