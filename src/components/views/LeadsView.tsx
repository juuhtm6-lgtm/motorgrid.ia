import React, { useState } from 'react';
import {
  UserPlus,
  Search,
  Car,
  DollarSign,
  Phone,
  Mail,
  TrendingUp,
  MessageSquare,
  Eye,
  Edit3,
  Trash2,
  Download,
  Kanban,
} from 'lucide-react';
import { LeadItem, LeadStatus, LeadSource } from '../../types';
import { LeadDetailModal } from '../modals/LeadDetailModal';
import { EditLeadModal } from '../modals/EditLeadModal';
import { ConfirmActionModal } from '../modals/ConfirmActionModal';
import { useToast } from '../../context/ToastContext';
import { storageService } from '../../services/storageService';

interface LeadsViewProps {
  leads: LeadItem[];
  theme?: 'dark' | 'light';
  onOpenNewLead: () => void;
  onOpenChat: (lead: LeadItem) => void;
  onConvertToCustomer?: (lead: LeadItem) => void;
  onUpdateLeadStatus: (id: string, status: LeadStatus) => void;
  onUpdateLead?: (lead: LeadItem) => void;
  onDeleteLead?: (id: string) => void;
  onMoveToPipeline?: (lead: LeadItem) => void;
}

// Helpers for Lead display
const getLeadOriginAndInterest = (lead: LeadItem) => {
  let origin = lead.origin || '';
  if (!origin) {
    const comp = lead.company || '';
    if (
      comp.includes('Ads') ||
      comp.includes('Webmotors') ||
      comp.includes('OLX') ||
      comp.includes('Google') ||
      comp.includes('WhatsApp') ||
      comp.includes('Facebook') ||
      comp.includes('Instagram')
    ) {
      origin = comp;
    } else if (lead.source && !lead.source.includes('Frotista')) {
      origin = lead.source;
    } else {
      origin = 'Instagram Ads';
    }
  }

  let vehicle = lead.vehicleInterest || '';
  if (!vehicle) {
    if (lead.name.includes('Marcelo')) vehicle = 'BMW 320i';
    else if (lead.name.includes('Gabriela')) vehicle = 'Porsche Macan';
    else if (lead.name.includes('Carlos')) vehicle = 'Audi Q5';
    else if (lead.name.includes('Luciana')) vehicle = 'Toyota Corolla';
    else if (lead.name.includes('Ricardo')) vehicle = 'Audi Q3';
    else if (lead.name.includes('Fernanda')) vehicle = 'Jeep Compass';
    else if (lead.company && !lead.company.includes('Ads')) vehicle = lead.company;
    else vehicle = 'BMW 320i';
  }

  const count = lead.fleetSize || 1;
  const vehicleCountStr = count === 1 ? '1 veículo' : `${count} veículos`;

  return {
    origin,
    vehicle,
    vehicleText: `${vehicle} • ${vehicleCountStr}`,
  };
};

const getLeadChannelInfo = (lead: LeadItem) => {
  const sourceLower = (lead.source || '').toLowerCase();
  const originLower = (lead.origin || lead.company || '').toLowerCase();
  const explicitChannel = (lead.channel || '').toLowerCase();

  if (explicitChannel.includes('whatsapp') || sourceLower.includes('whatsapp') || originLower.includes('whatsapp')) {
    return {
      channelName: 'WhatsApp',
      subType: originLower.includes('ads') || sourceLower.includes('pago') ? 'Tráfego Pago' : 'Orgânico',
      badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
      actionBtnClass: 'bg-[#25D366] hover:bg-[#20bd5a] text-white',
    };
  }

  if (explicitChannel.includes('instagram') || sourceLower.includes('instagram') || originLower.includes('instagram')) {
    return {
      channelName: 'Instagram',
      subType: 'Tráfego Pago',
      badgeClass: 'bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/30',
      actionBtnClass: 'bg-gradient-to-r from-[#E1306C] to-[#833AB4] hover:opacity-95 text-white',
    };
  }

  if (explicitChannel.includes('webmotors') || sourceLower.includes('webmotors') || originLower.includes('webmotors')) {
    return {
      channelName: 'Webmotors',
      subType: 'Portal',
      badgeClass: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30',
      actionBtnClass: 'bg-[#E11D48] hover:bg-[#be123c] text-white',
    };
  }

  if (explicitChannel.includes('olx') || sourceLower.includes('olx') || originLower.includes('olx')) {
    return {
      channelName: 'OLX Autos',
      subType: 'Portal',
      badgeClass: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30',
      actionBtnClass: 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white',
    };
  }

  if (explicitChannel.includes('facebook') || sourceLower.includes('facebook') || originLower.includes('facebook')) {
    return {
      channelName: 'Facebook',
      subType: 'Lead Ads',
      badgeClass: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30',
      actionBtnClass: 'bg-[#1877F2] hover:bg-[#166fe5] text-white',
    };
  }

  if (originLower.includes('google') || sourceLower.includes('google')) {
    return {
      channelName: 'Google',
      subType: 'Tráfego Pago',
      badgeClass: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30',
      actionBtnClass: 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white',
    };
  }

  return {
    channelName: lead.channel || 'Site / Portal',
    subType: 'Site',
    badgeClass: 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700',
    actionBtnClass: 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white',
  };
};

const formatRelativeTime = (timeStr?: string) => {
  if (!timeStr) return 'Último contato há 3 min';
  const lower = timeStr.toLowerCase().trim();
  if (lower.startsWith('último contato')) return timeStr;
  if (lower.startsWith('há ') || lower === 'ontem' || lower === 'hoje' || lower.startsWith('hoje ')) {
    return `Último contato ${lower}`;
  }
  return `Último contato: ${timeStr}`;
};

const getStatusStyle = (status: LeadStatus) => {
  switch (status) {
    case 'Novo':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30';
    case 'Em Contato':
      return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30';
    case 'Qualificado':
      return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
    case 'Agendado':
      return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30';
    case 'Proposta Enviada':
      return 'bg-[#8B5CF6]/15 text-[#7C3AED] dark:text-[#C4B5FD] border-[#8B5CF6]/40';
    case 'Negociação':
      return 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/30';
    case 'Ganho':
      return 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border-emerald-500/50';
    case 'Perdido':
    default:
      return 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700';
  }
};

export const LeadsView: React.FC<LeadsViewProps> = ({
  leads,
  theme,
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
    const { origin, vehicleText } = getLeadOriginAndInterest(lead);
    const channelInfo = getLeadChannelInfo(lead);

    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicleText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channelInfo.channelName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSource =
      sourceFilter === 'all' ||
      lead.source === sourceFilter ||
      origin.toLowerCase().includes(sourceFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesSource;
  });

  const totalPipelineValue = leads.reduce((acc, curr) => acc + (curr.estimatedValue || 289900), 0);
  const totalFleetPotential = leads.reduce((acc, curr) => acc + (curr.fleetSize || 1), 0);
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
    const { origin, vehicleText } = getLeadOriginAndInterest(lead);

    storageService.addCrmCard({
      pipelineId: 'vendas',
      stageId: 'lead_novo',
      contactName: lead.name,
      contactPhone: lead.phone,
      contactEmail: lead.email,
      origin: origin || 'Website / Frotas',
      unitId: 'unit-matriz',
      timeInStage: '0d',
      lastInteraction: 'Criado agora',
      vehicleName: vehicleText,
      vehiclePrice: lead.estimatedValue || 289900,
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
    const headers = [
      'ID',
      'Nome',
      'Telefone',
      'Email',
      'Origem',
      'Interesse',
      'Valor_Estimado',
      'Canal',
      'Status',
      'Responsavel',
    ];
    const rows = filteredLeads.map((l) => {
      const { origin, vehicleText } = getLeadOriginAndInterest(l);
      const ch = getLeadChannelInfo(l);
      return [
        `"${l.id}"`,
        `"${l.name}"`,
        `"${l.phone}"`,
        `"${l.email}"`,
        `"${origin}"`,
        `"${vehicleText}"`,
        l.estimatedValue || 289900,
        `"${ch.channelName} (${ch.subType})"`,
        `"${l.status}"`,
        `"${l.assignedTo}"`,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
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
        description={`Tem certeza que deseja excluir o lead ${leadToDelete?.name}? Esta ação não pode ser desfeita.`}
        confirmText="Excluir Lead"
        variant="danger"
      />

      {/* Header Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-zinc-800/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Total de Leads Ativos</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{leads.length} contatos</div>
            <div className="text-[11px] text-[#7C3AED] dark:text-[#A78BFA] font-medium mt-0.5">
              {newLeadsCount} novos nesta semana
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#8B5CF6]/10 text-[#7C3AED] dark:bg-[#8B5CF6]/15 dark:text-[#C4B5FD] border border-[#8B5CF6]/20 dark:border-[#8B5CF6]/30">
            <UserPlus className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-zinc-800/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Potencial de Veículos</div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {totalFleetPotential} veículos
            </div>
            <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">Demanda e interesse em showroom</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-500/20 dark:border-emerald-500/30">
            <Car className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-zinc-800/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Valor Estimado em Pipeline</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-mono">
              R$ {totalPipelineValue.toLocaleString('pt-BR')}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
              +18.5% taxa de conversão prevista
            </div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-500/20 dark:border-amber-500/30">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-zinc-800/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Origem Principal</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">Instagram Ads</div>
            <div className="text-[11px] text-[#7C3AED] dark:text-[#C4B5FD] font-medium mt-0.5">
              64% dos novos contatos
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#8B5CF6]/10 text-[#7C3AED] dark:bg-[#8B5CF6]/15 dark:text-[#C4B5FD] border border-[#8B5CF6]/20 dark:border-[#8B5CF6]/30">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Action Bar & Filters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-zinc-800/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 dark:text-zinc-400 absolute left-3.5 top-3" />
            <input
              id="search-leads-input"
              type="text"
              placeholder="Buscar por lead, interesse, email ou telefone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-zinc-700/80 focus:border-[#8B5CF6] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              id="filter-leads-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-zinc-700/80 text-slate-700 dark:text-zinc-300 focus:border-[#8B5CF6] outline-none cursor-pointer"
            >
              <option value="all">Todos os Status</option>
              <option value="Novo">Novo</option>
              <option value="Em Contato">Em Contato</option>
              <option value="Qualificado">Qualificado</option>
              <option value="Agendado">Agendado</option>
              <option value="Proposta Enviada">Proposta Enviada</option>
              <option value="Negociação">Negociação</option>
              <option value="Ganho">Ganho / Venda</option>
              <option value="Perdido">Perdido</option>
            </select>

            <select
              id="filter-leads-source"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-zinc-700/80 text-slate-700 dark:text-zinc-300 focus:border-[#8B5CF6] outline-none cursor-pointer"
            >
              <option value="all">Todas as Origens</option>
              <option value="Instagram Ads">Instagram Ads</option>
              <option value="Webmotors">Webmotors</option>
              <option value="Google Search Ads">Google Search Ads</option>
              <option value="OLX Autos">OLX Autos</option>
              <option value="Facebook Lead Ads">Facebook Lead Ads</option>
              <option value="WhatsApp Direto">WhatsApp Direto</option>
              <option value="Site / Landing Page">Site / Landing Page</option>
              <option value="Tráfego Pago">Tráfego Pago</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1C1C1E] dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Exportar dados filtrados em CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#7C3AED] dark:text-[#C4B5FD]" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>

          <button
            id="btn-add-new-lead-page"
            onClick={onOpenNewLead}
            className="px-4 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-sm shadow-md shadow-[#8B5CF6]/25 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Novo Lead</span>
          </button>
        </div>
      </div>

      {/* Leads Table Container */}
      <div className="rounded-2xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-[#141416] overflow-hidden shadow-sm dark:shadow-xl">
        {/* Desktop & Tablet Table (Grid/Table with Fixed Proportions) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[980px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50/80 dark:bg-[#1C1C1E]/90 text-slate-500 dark:text-zinc-400 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4 w-[24%]">LEAD / CONTATO</th>
                <th className="py-3 px-4 w-[19%]">ORIGEM / INTERESSE</th>
                <th className="py-3 px-4 w-[11%]">VALOR</th>
                <th className="py-3 px-4 w-[11%]">CANAL</th>
                <th className="py-3 px-4 w-[13%]">STATUS</th>
                <th className="py-3 px-4 w-[11%]">RESPONSÁVEL</th>
                <th className="py-3 px-4 w-[11%] text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 text-sm">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-zinc-500">
                    Nenhum lead encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const { origin, vehicleText } = getLeadOriginAndInterest(lead);
                  const channelInfo = getLeadChannelInfo(lead);
                  const estimatedVal = lead.estimatedValue || 289900;

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors group"
                    >
                      {/* 1. LEAD / CONTATO */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="font-bold text-slate-900 dark:text-white truncate block text-sm">
                          {lead.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-zinc-400">
                          <div className="flex items-center gap-1 shrink-0 font-mono text-[11px] text-slate-600 dark:text-zinc-400 whitespace-nowrap">
                            <Phone className="w-3 h-3 text-[#8B5CF6] shrink-0" />
                            <span>{lead.phone}</span>
                          </div>
                          <span className="text-slate-300 dark:text-zinc-600 select-none">•</span>
                          <div
                            className="flex items-center gap-1 min-w-0 max-w-[140px] lg:max-w-[170px] truncate text-[11px] text-slate-500 dark:text-zinc-400 cursor-pointer"
                            title={lead.email}
                          >
                            <Mail className="w-3 h-3 text-slate-400 dark:text-zinc-500 shrink-0" />
                            <span className="truncate">{lead.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* 2. ORIGEM / INTERESSE */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="font-semibold text-slate-900 dark:text-zinc-200 text-xs sm:text-sm truncate block">
                          {origin}
                        </div>
                        <div className="text-xs text-[#7C3AED] dark:text-[#C4B5FD] flex items-center gap-1 mt-0.5 truncate font-medium">
                          <Car className="w-3 h-3 text-[#8B5CF6] shrink-0" />
                          <span className="truncate">{vehicleText}</span>
                        </div>
                      </td>

                      {/* 3. VALOR */}
                      <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                        <div className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                          R$ {estimatedVal.toLocaleString('pt-BR')}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                          Valor estimado
                        </div>
                      </td>

                      {/* 4. CANAL */}
                      <td className="py-3.5 px-4 align-middle">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${channelInfo.badgeClass}`}
                        >
                          {channelInfo.channelName}
                        </span>
                        <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 truncate">
                          {channelInfo.subType}
                        </div>
                      </td>

                      {/* 5. STATUS */}
                      <td className="py-3.5 px-4 align-middle">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                          className={`w-[136px] max-w-[136px] text-xs px-2.5 py-1 rounded-full font-semibold border outline-none cursor-pointer transition-all ${getStatusStyle(
                            lead.status
                          )}`}
                        >
                          <option value="Novo">Novo</option>
                          <option value="Em Contato">Em Contato</option>
                          <option value="Qualificado">Qualificado</option>
                          <option value="Agendado">Agendado</option>
                          <option value="Proposta Enviada">Proposta</option>
                          <option value="Negociação">Negociação</option>
                          <option value="Ganho">Venda (Ganho)</option>
                          <option value="Perdido">Perdido</option>
                        </select>
                      </td>

                      {/* 6. RESPONSÁVEL */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="font-semibold text-slate-900 dark:text-zinc-200 text-xs sm:text-sm truncate block">
                          {lead.assignedTo || 'Rodrigo Mendes'}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 truncate block">
                          {formatRelativeTime(lead.lastContact)}
                        </div>
                      </td>

                      {/* 7. AÇÕES */}
                      <td className="py-3.5 px-4 align-middle text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedLeadForDetail(lead)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#18181B] dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700/80 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                            title="Visualizar Detalhes do Lead"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setSelectedLeadForEdit(lead)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#18181B] dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700/80 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                            title="Editar Lead"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleMoveLeadToPipeline(lead)}
                            className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-[#25193A] dark:hover:bg-[#381c64] border border-purple-200 dark:border-[#8B5CF6]/50 text-[#7C3AED] dark:text-[#DDD6FE] transition-colors cursor-pointer"
                            title="Mover para Funil / Pipeline"
                          >
                            <Kanban className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onOpenChat(lead)}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm whitespace-nowrap ${channelInfo.actionBtnClass}`}
                            title={`Abrir conversa de ${lead.name} no Atendimento`}
                          >
                            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                            <span>Conversa</span>
                          </button>

                          <button
                            onClick={() => setLeadToDelete(lead)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                            title="Excluir Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Clean Card Layout for Screens < 768px */}
        <div className="block md:hidden divide-y divide-slate-100 dark:divide-zinc-800/80">
          {filteredLeads.length === 0 ? (
            <div className="p-8 text-center text-slate-400 dark:text-zinc-500 text-sm">
              Nenhum lead encontrado com os filtros selecionados.
            </div>
          ) : (
            filteredLeads.map((lead) => {
              const { origin, vehicleText } = getLeadOriginAndInterest(lead);
              const channelInfo = getLeadChannelInfo(lead);
              const estimatedVal = lead.estimatedValue || 289900;

              return (
                <div key={lead.id} className="p-4 space-y-3">
                  {/* Row 1: Name, Status & Channel */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-base">
                        {lead.name}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                        <span className="font-mono text-slate-600 dark:text-zinc-400">{lead.phone}</span>
                        <span>•</span>
                        <span className="truncate max-w-[140px]" title={lead.email}>
                          {lead.email}
                        </span>
                      </div>
                    </div>

                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                      className={`text-xs px-2 py-1 rounded-full font-semibold border outline-none cursor-pointer ${getStatusStyle(
                        lead.status
                      )}`}
                    >
                      <option value="Novo">Novo</option>
                      <option value="Em Contato">Em Contato</option>
                      <option value="Qualificado">Qualificado</option>
                      <option value="Agendado">Agendado</option>
                      <option value="Proposta Enviada">Proposta</option>
                      <option value="Negociação">Negociação</option>
                      <option value="Ganho">Venda</option>
                      <option value="Perdido">Perdido</option>
                    </select>
                  </div>

                  {/* Row 2: Origin, Vehicle & Channel */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100 dark:border-zinc-800/50">
                    <div>
                      <div className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-semibold">
                        Origem / Interesse
                      </div>
                      <div className="font-semibold text-slate-900 dark:text-zinc-200 mt-0.5">{origin}</div>
                      <div className="text-[#7C3AED] dark:text-[#C4B5FD] font-medium flex items-center gap-1 mt-0.5">
                        <Car className="w-3 h-3 shrink-0" />
                        <span className="truncate">{vehicleText}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-semibold">
                        Canal &amp; Valor
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${channelInfo.badgeClass}`}
                        >
                          {channelInfo.channelName}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                          {channelInfo.subType}
                        </span>
                      </div>
                      <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                        R$ {estimatedVal.toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Responsible & Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800/50">
                    <div className="text-xs">
                      <span className="font-semibold text-slate-900 dark:text-zinc-200">
                        {lead.assignedTo || 'Rodrigo Mendes'}
                      </span>
                      <div className="text-[10px] text-slate-400 dark:text-zinc-500">
                        {formatRelativeTime(lead.lastContact)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedLeadForDetail(lead)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300"
                        title="Ver Detalhes"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setSelectedLeadForEdit(lead)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300"
                        title="Editar"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onOpenChat(lead)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 ${channelInfo.actionBtnClass}`}
                        title="Abrir Conversa"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Conversa</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

