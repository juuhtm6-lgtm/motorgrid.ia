import React, { useState } from 'react';
import {
  GitPullRequest,
  Search,
  Plus,
  Building2,
  DollarSign,
  User,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { Deal, PipelineStage } from '../../types';

interface PipelineViewProps {
  deals: Deal[];
  onUpdateDealStage: (id: string, newStage: PipelineStage) => void;
  onOpenNewDeal?: () => void;
}

const stages: { stage: PipelineStage; label: string; color: string; bg: string }[] = [
  { stage: 'Lead', label: '1. Novos Leads', color: 'text-blue-300', bg: 'border-blue-500/30 bg-blue-500/10' },
  { stage: 'Qualificação', label: '2. Qualificação Técnica', color: 'text-amber-300', bg: 'border-amber-500/30 bg-amber-500/10' },
  { stage: 'Demonstração', label: '3. Demo / PoC Telemetria', color: 'text-purple-300', bg: 'border-purple-500/30 bg-purple-500/10' },
  { stage: 'Proposta', label: '4. Proposta & Contrato', color: 'text-indigo-300', bg: 'border-indigo-500/30 bg-indigo-500/10' },
  { stage: 'Fechado', label: '5. Fechado / Ganho', color: 'text-emerald-300', bg: 'border-emerald-500/30 bg-emerald-500/10' },
];

export const PipelineView: React.FC<PipelineViewProps> = ({
  deals,
  onUpdateDealStage,
  onOpenNewDeal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDeals = deals.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.contactName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalValue = deals.reduce((acc, curr) => acc + curr.value, 0);
  const weightedValue = deals.reduce((acc, curr) => acc + curr.value * (curr.probability / 100), 0);

  return (
    <div className="space-y-6">
      {/* Header Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-400">Total no Pipeline</div>
            <div className="text-2xl font-bold text-white mt-1">
              R$ {totalValue.toLocaleString('pt-BR')}
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">{deals.length} propostas ativas</div>
          </div>
          <div className="p-3 rounded-xl bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[#8B5CF6]/30">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-400">Pipeline Ponderado</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              R$ {Math.round(weightedValue).toLocaleString('pt-BR')}
            </div>
            <div className="text-[11px] text-emerald-400/80 mt-0.5">Probabilidade ajustada</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <Percent className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-400">Taxa de Fechamento</div>
            <div className="text-2xl font-bold text-white mt-1">68.2%</div>
            <div className="text-[11px] text-[#A78BFA] mt-0.5">+5.4% vs mês anterior</div>
          </div>
          <div className="p-3 rounded-xl bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[#8B5CF6]/30">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-400">Ciclo Médio de Venda</div>
            <div className="text-2xl font-bold text-white mt-1">11 dias</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Implantação rápida OBD-II</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/15 text-blue-300 border border-blue-500/30">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Filtrar negócios por empresa, título ou decisor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white placeholder-zinc-500 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Kanban Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {stages.map(({ stage, label, color, bg }) => {
          const stageDeals = filteredDeals.filter((d) => d.stage === stage);
          const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div
              key={stage}
              className="flex flex-col rounded-2xl bg-[#141416] border border-zinc-800/80 p-3 min-w-[260px] shadow-lg"
            >
              {/* Stage Header */}
              <div className="pb-3 border-b border-zinc-800 mb-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${color}`}>{label}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono font-bold">
                    {stageDeals.length}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 font-mono mt-1">
                  R$ {stageTotal.toLocaleString('pt-BR')}
                </div>
              </div>

              {/* Stage Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                {stageDeals.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-zinc-800 text-center text-xs text-zinc-500">
                    Nenhum negócio nesta etapa
                  </div>
                ) : (
                  stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="p-3.5 rounded-xl bg-[#1C1C1E] border border-zinc-700/60 hover:border-[#8B5CF6]/50 transition-all shadow-md space-y-2.5 group"
                    >
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#C4B5FD] transition-colors">
                          {deal.title}
                        </div>
                        <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-zinc-500" />
                          <span className="truncate">{deal.company}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-800/80">
                        <div className="font-bold text-white font-mono">
                          R$ {deal.value.toLocaleString('pt-BR')}
                        </div>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[#8B5CF6]/30 font-semibold font-mono">
                          {deal.probability}% prob.
                        </span>
                      </div>

                      <div className="text-[10px] text-zinc-400 flex items-center justify-between">
                        <span className="truncate">{deal.contactName}</span>
                        <span className="text-zinc-500">{deal.expectedClose}</span>
                      </div>

                      {/* Move Stage Selector */}
                      <div className="pt-2 border-t border-zinc-800/60 flex items-center gap-1 text-[10px]">
                        <span className="text-zinc-500">Mover:</span>
                        <select
                          value={deal.stage}
                          onChange={(e) =>
                            onUpdateDealStage(deal.id, e.target.value as PipelineStage)
                          }
                          className="flex-1 px-1.5 py-0.5 rounded bg-[#0A0A0B] border border-zinc-700 text-zinc-300 text-[10px] outline-none"
                        >
                          <option value="Lead">Lead</option>
                          <option value="Qualificação">Qualificação</option>
                          <option value="Demonstração">Demonstração</option>
                          <option value="Proposta">Proposta</option>
                          <option value="Fechado">Fechado</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
