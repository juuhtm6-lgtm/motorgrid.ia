import React, { useState } from 'react';
import {
  UserPlus,
  Search,
  Filter,
  Car,
  DollarSign,
  Phone,
  Mail,
  Building2,
  Calendar,
  Sparkles,
  ArrowUpDown,
  Tag,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Eye,
  Edit3,
  Trash2,
  Download,
  Kanban,
  Check,
} from 'lucide-react';
import { LeadItem, LeadStatus, LeadSource, Customer } from '../../types';
import { LeadDetailModal } from '../modals/LeadDetailModal';
import { EditLeadModal } from '../modals/EditLeadModal';
import { ConfirmActionModal } from '../modals/ConfirmActionModal';
import { useToast } from '../../context/ToastContext';
import { storageService } from '../../services/storageService';

interface LeadsViewProps {
  leads: LeadItem[];
  onOpenNewLead: () => void;
  onOpenChat: (lead: LeadItem) => void;
  onConvertToCustomer?: (lead: LeadItem) => void;
  onUpdateLeadStatus: (id: string, status: LeadStatus) => void;
  onUpdateLead?: (lead: LeadItem) => void;
  onDeleteLead?: (id: string) => void;
  onMoveToPipeline?: (lead: LeadItem) => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  leads,
  onOpenNewLead,
  onOpenChat,
  onConvertToCustomer,
  onUpdateLeadStatus,
  onUpdateLead,
  onDeleteLead,
  onMoveToPipeline,
}) => {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  // Modal states
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<LeadItem | null>(null);
  const [selectedLeadForEdit, setSelectedLeadForEdit] = useState<LeadItem | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<LeadItem | null>(null);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const totalPipelineValue = leads.reduce((acc, curr) => acc + curr.estimatedValue, 0);
  const totalFleetPotential = leads.reduce((acc, curr) => acc + curr.fleetSize, 0);
  const newLeadsCount = leads.filter((l) => l.status === 'Novo').length;

  const handleStatusChange = (id: string, newStatus: LeadStatus) => {
    onUpdateLeadStatus(id, newStatus);
    toast.success(`Status do lead alterado para "${newStatus}".`);
  };

  const handleConfirmDelete = () => {
    if (!leadToDelete) return;
    const name = leadToDelete.name;
    if (onDeleteLead) {
      onDeleteLead(leadToDelete.id);
    } else {
      storageService.deleteLead(leadToDelete.id);
    }
    toast.success(`Lead ${name} excluído com sucesso.`);
    setLeadToDelete(null);
    if (selectedLeadForDetail?.id === leadToDelete.id) {
      setSelectedLeadForDetail(null);
    }
  };

  const handleSaveEdit = (updatedLead: LeadItem) => {
    if (onUpdateLead) {
      onUpdateLead(updatedLead);
    } else {
      storageService.updateLead(updatedLead.id, updatedLead);
    }
    toast.success(`Lead ${updatedLead.name} atualizado com sucesso!`);
    setSelectedLeadForEdit(null);
    if (selectedLeadForDetail?.id === updatedLead.id) {
      setSelectedLeadForDetail(updatedLead);
    }
  };

  const handleMoveLeadToPipeline = (lead: LeadItem) => {
    // Generate CRM Card
    storageService.addCrmCard({
      pipelineId: 'vendas',
      stageId: 'lead_novo',
      contactName: lead.name,
      contactPhone: lead.phone,
      contactEmail: lead.email,
      origin: lead.source || 'Website / Frotas',
      unitId: 'unit-matriz',
      timeInStage: '0d',
      lastInteraction: 'Criado agora',
      vehicleName: `Frota ${lead.company} (${lead.fleetSize} un)`,
      vehiclePrice: lead.estimatedValue,
      assignedTo: lead.assignedTo || 'Rodrigo Mendes',
      temperature: 'Quente',
      gridScore: 88,
      notes: `Importado de Leads: ${lead.notes || ''}`,
      nextTask: 'Realizar primeiro contato e qualificação',
    });

    if (onMoveToPipeline) {
      onMoveToPipeline(lead);
    }
    toast.success(`Lead ${lead.name} movido para o Pipeline de Vendas!`);
    setSelectedLeadForDetail(null);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Nome', 'Telefone', 'Email', 'Empresa', 'Frota', 'Valor_Mensal', 'Origem', 'Status', 'Responsavel'];
    const rows = filteredLeads.map((l) => [
      `"${l.id}"`,
      `"${l.name}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.company}"`,
      l.fleetSize,
      l.estimatedValue,
      `"${l.source}"`,
      `"${l.status}"`,
      `"${l.assignedTo}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `motorgrid_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${filteredLeads.length} leads exportados em arquivo CSV com sucesso!`);
  };

  return (
    <div className="space-y-6">
      {/* Modals */}
      <LeadDetailModal
        isOpen={!!selectedLeadForDetail}
        onClose={() => setSelectedLeadForDetail(null)}
        lead={selectedLeadForDetail}
        onEdit={(lead) => setSelectedLeadForEdit(lead)}
        onDelete={(lead) => setLeadToDelete(lead)}
        onOpenChat={(lead) => {
          setSelectedLeadForDetail(null);
          onOpenChat(lead);
        }}
        onMoveToPipeline={handleMoveLeadToPipeline}
      />

      <EditLeadModal
        isOpen={!!selectedLeadForEdit}
        onClose={() => setSelectedLeadForEdit(null)}
        lead={selectedLeadForEdit}
        onSave={handleSaveEdit}
      />

      <ConfirmActionModal
        isOpen={!!leadToDelete}
        onClose={() => setLeadToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir Lead Permanentemente"
        description={`Tem certeza que deseja excluir o lead ${leadToDelete?.name} (${leadToDelete?.company})? Esta ação não pode ser desfeita.`}
        confirmText="Excluir Lead"
        variant="danger"
      />

      {/* Header Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-400">Total de Leads Ativos</div>
            <div className="text-2xl font-bold text-white mt-1">{leads.length} contas</div>
            <div className="text-[11px] text-[#A78BFA] mt-0.5">{newLeadsCount} novos nesta semana</div>
          </div>
          <div className="p-3 rounded-xl bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[#8B5CF6]/30">
            <UserPlus className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-400">Potencial de Veículos</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{totalFleetPotential} veículos</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Demanda de instalação rastreador</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <Car className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-400">Valor Estimado do Pipeline</div>
            <div className="text-2xl font-bold text-white mt-1">
              R$ {totalPipelineValue.toLocaleString('pt-BR')} /mês
            </div>
            <div className="text-[11px] text-emerald-400 mt-0.5">+18.5% taxa de conversão prevista</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-400">Origem Principal</div>
            <div className="text-2xl font-bold text-white mt-1">Site / WhatsApp</div>
            <div className="text-[11px] text-[#C4B5FD] mt-0.5">64% dos novos contatos</div>
          </div>
          <div className="p-3 rounded-xl bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[#8B5CF6]/30">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Action Bar & Filter */}
      <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
            <input
              id="search-leads-input"
              type="text"
              placeholder="Buscar por lead, empresa, email ou telefone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white placeholder-zinc-500 outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              id="filter-leads-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 text-zinc-300 focus:border-[#8B5CF6] outline-none"
            >
              <option value="all">Todos os Status</option>
              <option value="Novo">Novo</option>
              <option value="Em Contato">Em Contato</option>
              <option value="Qualificado">Qualificado</option>
              <option value="Proposta Enviada">Proposta Enviada</option>
              <option value="Ganho">Ganho</option>
              <option value="Perdido">Perdido</option>
            </select>

            <select
              id="filter-leads-source"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 text-zinc-300 focus:border-[#8B5CF6] outline-none"
            >
              <option value="all">Todas as Origens</option>
              <option value="Site / Landing Page">Site / Landing Page</option>
              <option value="WhatsApp Direto">WhatsApp Direto</option>
              <option value="Indicação de Frotista">Indicação de Frotista</option>
              <option value="Tráfego Pago">Tráfego Pago</option>
              <option value="Feira Automotiva">Feira Automotiva</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl bg-[#1C1C1E] hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Exportar dados filtrados em CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#C4B5FD]" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>

          <button
            id="btn-add-new-lead-page"
            onClick={onOpenNewLead}
            className="px-4 py-2.5 rounded-xl bg-[#C4B5FD] hover:bg-[#DDD6FE] text-[#2E1065] font-bold text-sm shadow-lg shadow-[#8B5CF6]/20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Novo Lead</span>
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl border border-zinc-800/80 bg-[#141416] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-[#1C1C1E]/80 text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Lead / Contato</th>
                <th className="py-3.5 px-4">Empresa &amp; Frota</th>
                <th className="py-3.5 px-4">Valor Estimado</th>
                <th className="py-3.5 px-4">Canal / Origem</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Responsável</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-sm">
              {filteredLeads.map((lead) => {
                return (
                  <tr key={lead.id} className="hover:bg-zinc-800/30 transition-colors group">
                    <td className="py-4 px-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{lead.name}</span>
                      </div>
                      <div className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5">
                        <Phone className="w-3 h-3 text-[#A78BFA]" />
                        <span>{lead.phone}</span>
                        <span>•</span>
                        <Mail className="w-3 h-3 text-zinc-500" />
                        <span className="truncate max-w-[150px]">{lead.email}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-medium text-zinc-200 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{lead.company}</span>
                      </div>
                      <div className="text-xs text-[#C4B5FD] font-mono mt-0.5 flex items-center gap-1">
                        <Car className="w-3 h-3" />
                        <span>{lead.fleetSize} veículos previstos</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-white font-mono">
                        R$ {lead.estimatedValue.toLocaleString('pt-BR')} /mês
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        {Math.round(lead.estimatedValue / (lead.fleetSize || 1))} R$/veículo
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-xs px-2 py-0.5 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {lead.source}
                      </span>
                      <div className="text-[10px] text-zinc-500 mt-1">{lead.createdAt}</div>
                    </td>

                    <td className="py-4 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold border outline-none cursor-pointer ${
                          lead.status === 'Novo'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            : lead.status === 'Qualificado'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : lead.status === 'Proposta Enviada'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            : lead.status === 'Ganho'
                            ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}
                      >
                        <option value="Novo">Novo</option>
                        <option value="Em Contato">Em Contato</option>
                        <option value="Qualificado">Qualificado</option>
                        <option value="Proposta Enviada">Proposta Enviada</option>
                        <option value="Ganho">Ganho (Assinado)</option>
                        <option value="Perdido">Perdido</option>
                      </select>
                    </td>

                    <td className="py-4 px-4 text-xs text-zinc-300">
                      <div className="font-medium">{lead.assignedTo}</div>
                      <div className="text-[10px] text-zinc-500">Último contato: {lead.lastContact}</div>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedLeadForDetail(lead)}
                          className="p-1.5 rounded-lg bg-[#18181B] hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                          title="Visualizar Detalhes do Lead"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setSelectedLeadForEdit(lead)}
                          className="p-1.5 rounded-lg bg-[#18181B] hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                          title="Editar Lead"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleMoveLeadToPipeline(lead)}
                          className="p-1.5 rounded-lg bg-[#25193A] hover:bg-[#381c64] border border-[#8B5CF6]/50 text-[#DDD6FE] transition-colors cursor-pointer"
                          title="Mover para Funil / Pipeline"
                        >
                          <Kanban className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onOpenChat(lead)}
                          className="btn-conversa-action px-2.5 py-1.5 rounded-xl bg-[#8B5CF6]/20 hover:bg-[#8B5CF6] text-[#DDD6FE] hover:text-white border border-[#8B5CF6]/40 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm hover:shadow-md hover:shadow-[#8B5CF6]/25 group"
                          title={`Abrir conversa de ${lead.name} no Atendimento`}
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#A78BFA] group-hover:text-white transition-colors" />
                          <span className="hidden sm:inline">Conversa</span>
                        </button>

                        <button
                          onClick={() => setLeadToDelete(lead)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition-colors cursor-pointer"
                          title="Excluir Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
