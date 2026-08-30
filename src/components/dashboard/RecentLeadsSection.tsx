import React from 'react';
import { Clock, User, Phone, Car, ArrowRight } from 'lucide-react';
import { ExecutiveLeadRecord } from '../../types/dashboard';

interface RecentLeadsSectionProps {
  leads: ExecutiveLeadRecord[];
  onSelectLead: (lead: ExecutiveLeadRecord) => void;
  onViewAllLeads: () => void;
}

export const RecentLeadsSection: React.FC<RecentLeadsSectionProps> = ({
  leads,
  onSelectLead,
  onViewAllLeads,
}) => {
  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    });
  };

  const formatIdleTime = (mins: number) => {
    if (mins < 60) return `${mins}m sem contato`;
    const hours = Math.floor(mins / 60);
    return `${hours}h sem contato`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'novo':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'em_atendimento':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'qualificado':
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      case 'agendado':
        return 'bg-[#8B5CF6]/15 text-[#A78BFA] border-[#8B5CF6]/30';
      case 'visitou':
        return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
      case 'proposta':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'ganho':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'perdido':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-neutral-800 text-neutral-400 border-neutral-700';
    }
  };

  return (
    <div className="bg-[#1C1C1E] border border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6]">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Leads Recentes da Operação</h3>
            <p className="text-xs text-neutral-400">
              Últimas entradas e status em tempo real com tempo sem interação
            </p>
          </div>
        </div>

        <button
          id="btn-recent-leads-view-all"
          onClick={onViewAllLeads}
          className="text-xs text-[#8B5CF6] hover:text-[#A78BFA] font-semibold flex items-center gap-1 transition-colors"
        >
          <span>Ver todos ({leads.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
        {leads.slice(0, 6).map((lead) => (
          <div
            key={lead.id}
            onClick={() => onSelectLead(lead)}
            className="group bg-neutral-900/80 hover:bg-[#25252a] border border-neutral-800 hover:border-[#8B5CF6]/40 rounded-xl p-3.5 transition-all cursor-pointer shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase ${getStatusBadge(
                    lead.status
                  )}`}
                >
                  {lead.status.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-neutral-500" />
                  {formatIdleTime(lead.lastInteractionMinutesAgo)}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {lead.contactName.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white group-hover:text-[#8B5CF6] transition-colors truncate">
                    {lead.contactName}
                  </h4>
                  <p className="text-[11px] text-neutral-400 truncate">{lead.contactPhone}</p>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-neutral-800/80 space-y-1 text-xs">
              <div className="flex items-center justify-between text-neutral-300">
                <span className="text-neutral-400 flex items-center gap-1 text-[11px] truncate">
                  <Car className="w-3 h-3 text-[#8B5CF6] shrink-0" />
                  {lead.vehicleName}
                </span>
                <span className="font-semibold text-white text-[11px] shrink-0">
                  {formatCurrency(lead.vehiclePrice)}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-0.5">
                <span>Vendedor: {lead.assignedTo.split(' ')[0]}</span>
                <span className="text-neutral-500">Origem: {lead.origin}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
