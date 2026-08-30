import React from 'react';
import { UserCheck, Calendar, Car, FileText, XCircle, Clock } from 'lucide-react';
import { OperationalStatusCounts } from '../../types/dashboard';

interface CommercialOperationRowProps {
  counts: OperationalStatusCounts;
  onDrillDown: (
    statusKey: 'open' | 'qualified' | 'scheduled' | 'visited' | 'proposals' | 'lost'
  ) => void;
}

export const CommercialOperationRow: React.FC<CommercialOperationRowProps> = ({
  counts,
  onDrillDown,
}) => {
  const cards = [
    {
      id: 'open',
      title: 'Leads em Aberto',
      count: counts.open,
      icon: Clock,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      desc: 'Em negociação ativa',
    },
    {
      id: 'qualified',
      title: 'Leads Qualificados',
      count: counts.qualified,
      icon: UserCheck,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      desc: 'Perfil validado pelo SDR',
    },
    {
      id: 'scheduled',
      title: 'Agendamentos',
      count: counts.scheduled,
      icon: Calendar,
      color: 'text-[#A78BFA]',
      bgColor: 'bg-[#8B5CF6]/10',
      borderColor: 'border-[#8B5CF6]/20',
      desc: 'Visitas marcadas',
    },
    {
      id: 'visited',
      title: 'Visitas / Test Drives',
      count: counts.visited,
      icon: Car,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
      desc: 'Presença no showroom',
    },
    {
      id: 'proposals',
      title: 'Propostas Enviadas',
      count: counts.proposals,
      icon: FileText,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      desc: 'Fichas e minutas em mesa',
    },
    {
      id: 'lost',
      title: 'Leads Perdidos',
      count: counts.lost,
      icon: XCircle,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/20',
      desc: 'Motivos catalogados',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            id={`op-card-${card.id}`}
            onClick={() => onDrillDown(card.id as any)}
            className="group bg-[#1C1C1E] hover:bg-[#25252a] border border-neutral-800 hover:border-neutral-700 rounded-xl p-3.5 transition-all cursor-pointer shadow-sm hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-neutral-400 truncate">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-lg ${card.bgColor} ${card.color} border ${card.borderColor}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-white tracking-tight">
                {card.count}
              </span>
              <span className="text-[10px] text-neutral-500 group-hover:text-neutral-300 transition-colors">
                Ver lista →
              </span>
            </div>

            <p className="text-[10px] text-neutral-500 mt-1 truncate">
              {card.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
};
