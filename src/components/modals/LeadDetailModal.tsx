import React from 'react';
import {
  X,
  Phone,
  Mail,
  Building2,
  Car,
  DollarSign,
  User,
  Calendar,
  Tag,
  MessageSquare,
  Edit3,
  Trash2,
  ArrowRight,
  Flame,
  Thermometer,
  Snowflake,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { LeadItem, LeadStatus } from '../../types';

interface LeadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadItem | null;
  onEdit: (lead: LeadItem) => void;
  onDelete: (lead: LeadItem) => void;
  onOpenChat: (lead: LeadItem) => void;
  onMoveToPipeline: (lead: LeadItem) => void;
  onScheduleContact?: (lead: LeadItem) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  isOpen,
  onClose,
  lead,
  onEdit,
  onDelete,
  onOpenChat,
  onMoveToPipeline,
  onScheduleContact,
}) => {
  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl rounded-2xl bg-[#141416] border border-zinc-800 p-6 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">{lead.name}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#8B5CF6]/20 text-[#DDD6FE] border border-[#8B5CF6]/30">
                {lead.status}
              </span>
            </div>
            <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-1">
              <Building2 className="w-3.5 h-3.5 text-zinc-500" />
              <span>{lead.company}</span>
              <span>•</span>
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              <span>Criado: {lead.createdAt}</span>
            </p>
          </div>
        </div>

        {/* Quick Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-[#1C1C1E] border border-zinc-800/80">
            <span className="text-[10px] text-zinc-400 font-semibold block">TELEFONE / WHATSAPP</span>
            <span className="text-xs font-bold text-white flex items-center gap-1.5 mt-1">
              <Phone className="w-3.5 h-3.5 text-[#A78BFA]" />
              {lead.phone}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#1C1C1E] border border-zinc-800/80">
            <span className="text-[10px] text-zinc-400 font-semibold block">E-MAIL CORPORATIVO</span>
            <span className="text-xs font-bold text-white flex items-center gap-1.5 mt-1 truncate">
              <Mail className="w-3.5 h-3.5 text-[#A78BFA]" />
              {lead.email}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#1C1C1E] border border-zinc-800/80">
            <span className="text-[10px] text-zinc-400 font-semibold block">VALOR ESTIMADO</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-1 font-mono">
              <DollarSign className="w-3.5 h-3.5" />
              R$ {lead.estimatedValue.toLocaleString('pt-BR')} /mês
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#1C1C1E] border border-zinc-800/80">
            <span className="text-[10px] text-zinc-400 font-semibold block">POTENCIAL DE FROTA</span>
            <span className="text-xs font-bold text-white flex items-center gap-1.5 mt-1">
              <Car className="w-3.5 h-3.5 text-[#A78BFA]" />
              {lead.fleetSize} veículos previstos
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#1C1C1E] border border-zinc-800/80">
            <span className="text-[10px] text-zinc-400 font-semibold block">RESPONSÁVEL COMERCIAL</span>
            <span className="text-xs font-bold text-white flex items-center gap-1.5 mt-1">
              <User className="w-3.5 h-3.5 text-[#A78BFA]" />
              {lead.assignedTo}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#1C1C1E] border border-zinc-800/80">
            <span className="text-[10px] text-zinc-400 font-semibold block">CANAL DE ORIGEM</span>
            <span className="text-xs font-bold text-white flex items-center gap-1.5 mt-1">
              <Tag className="w-3.5 h-3.5 text-[#A78BFA]" />
              {lead.source}
            </span>
          </div>
        </div>

        {/* Notes & Description */}
        <div className="p-4 rounded-xl bg-[#1C1C1E] border border-zinc-800/80 space-y-2">
          <h4 className="text-xs font-bold text-zinc-300">Observações &amp; Histórico Inicial</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {lead.notes ||
              'Lead qualificado pelo pré-atendimento com interesse na frota corporativa. Demonstrou urgência na instalação e solicitou proposta detalhada.'}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800/80">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDelete(lead)}
              className="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Excluir</span>
            </button>
            <button
              onClick={() => onEdit(lead)}
              className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editar Lead</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onMoveToPipeline(lead)}
              className="px-3.5 py-2 rounded-xl bg-[#25193A] hover:bg-[#341d57] border border-[#8B5CF6]/50 text-[#DDD6FE] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Mover para Funil</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onOpenChat(lead)}
              className="px-4 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold transition-all shadow-md shadow-[#8B5CF6]/30 flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Abrir Conversa</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
