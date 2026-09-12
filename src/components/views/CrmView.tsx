import React, { useState, useEffect } from 'react';
import {
  Kanban,
  Users,
  CheckSquare,
  Calendar,
  Plus,
  Search,
  Filter,
  Car,
  Phone,
  Flame,
  Thermometer,
  Snowflake,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Tag,
  Mail,
  UserCheck,
  Building,
  Trash2,
  Edit3,
  Check,
  X,
  DollarSign,
} from 'lucide-react';
import {
  CrmCard,
  Contact,
  CrmTask,
  Appointment,
  PipelineConfig,
  LeadTemperature,
} from '../../types';
import { initialPipelines } from '../../data/mockData';
import { CreateContactModal } from '../modals/CreateContactModal';
import { ScheduleAppointmentModal } from '../modals/ScheduleAppointmentModal';
import { CreateCrmTaskModal } from '../modals/CreateCrmTaskModal';
import { LossReasonModal } from '../modals/LossReasonModal';
import { ConfirmActionModal } from '../modals/ConfirmActionModal';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';

export const CrmView: React.FC = () => {
  const toast = useToast();
  const [activeSubTab, setActiveSubTab] = useState<'pipelines' | 'contatos' | 'tarefas' | 'agenda'>('pipelines');
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>('vendas');

  // Datasets from central storage
  const [cards, setCards] = useState<CrmCard[]>(() => storageService.getCrmCards());
  const [contacts, setContacts] = useState<Contact[]>(() => storageService.getContacts());
  const [tasks, setTasks] = useState<CrmTask[]>(() => storageService.getCrmTasks());
  const [appointments, setAppointments] = useState<Appointment[]>(() => storageService.getAppointments());

  // Filters & State
  const [taskFilter, setTaskFilter] = useState<'Hoje' | 'Atrasada' | 'Próxima' | 'Concluída' | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Modals state
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Loss Reason modal
  const [cardToMarkLost, setCardToMarkLost] = useState<CrmCard | null>(null);

  // Drag-and-drop state
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [dragOverStageId, setDragOverStageId] = useState<string | null>(null);

  // Lead inspection modal
  const [selectedLeadModalCard, setSelectedLeadModalCard] = useState<CrmCard | null>(null);

  // Confirm delete modals
  const [cardToDelete, setCardToDelete] = useState<CrmCard | null>(null);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<CrmTask | null>(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);

  // Subscribe to storageService
  useEffect(() => {
    const unsub = storageService.subscribe(() => {
      setCards(storageService.getCrmCards());
      setContacts(storageService.getContacts());
      setTasks(storageService.getCrmTasks());
      setAppointments(storageService.getAppointments());
    });
    return unsub;
  }, []);

  const currentPipeline = initialPipelines.find((p) => p.id === selectedPipelineId) || initialPipelines[0];

  const handleStageChange = (card: CrmCard, targetStageId: string) => {
    if (targetStageId === 'perdido' || targetStageId === 'vd-10' || targetStageId === 'pa-7') {
      setCardToMarkLost(card);
      return;
    }

    if (targetStageId === 'fechamento' || targetStageId === 'vd-9') {
      storageService.markCardWon(card.id, card.vehiclePrice);
      toast.success(`Parabéns! Venda de ${card.contactName} concretizada com sucesso!`, 'Venda Concluída');
      return;
    }

    storageService.moveCardStage(card.id, targetStageId);
    const targetStage = currentPipeline.stages.find((s) => s.id === targetStageId);
    toast.success(`Oportunidade movida para "${targetStage?.name || targetStageId}".`);
  };

  const handleConfirmLoss = (reason: string, notes: string) => {
    if (!cardToMarkLost) return;
    storageService.markCardLost(cardToMarkLost.id, `${reason} - ${notes}`);
    toast.info(`Oportunidade de ${cardToMarkLost.contactName} arquivada como perdida: ${reason}.`);
    setCardToMarkLost(null);
  };

  const handleToggleTaskStatus = (taskId: string) => {
    storageService.toggleCrmTaskStatus(taskId);
    toast.success('Status da tarefa comercial atualizado!');
  };

  const getTemperatureBadge = (temp?: LeadTemperature) => {
    switch (temp) {
      case 'Quente':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] font-bold">
            <Flame className="w-2.5 h-2.5 text-rose-400 fill-rose-400" />
            Quente
          </span>
        );
      case 'Morno':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold">
            <Thermometer className="w-2.5 h-2.5 text-amber-400" />
            Morno
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[9px] font-bold">
            <Snowflake className="w-2.5 h-2.5 text-blue-400" />
            Frio
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Modals */}
      <CreateContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onCreateContact={(newContactData) => {
          const created = storageService.addContact(newContactData);
          toast.success(`Contato "${created.name}" cadastrado com sucesso!`);
        }}
      />

      <ScheduleAppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        onSchedule={(newApt) => {
          const created = storageService.addAppointment(newApt);
          toast.success(`Visita/Test Drive para ${created.contactName} agendado para ${created.date} às ${created.time}!`);
        }}
      />

      <CreateCrmTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={(taskData) => {
          const created = storageService.addCrmTask(taskData);
          toast.success(`Tarefa "${created.title}" criada com sucesso!`);
        }}
      />

      <LossReasonModal
        isOpen={!!cardToMarkLost}
        onClose={() => setCardToMarkLost(null)}
        onConfirm={handleConfirmLoss}
        leadName={cardToMarkLost?.contactName}
        vehicleName={cardToMarkLost?.vehicleName}
      />

      {/* Confirm Delete Modals */}
      <ConfirmActionModal
        isOpen={!!cardToDelete}
        onClose={() => setCardToDelete(null)}
        onConfirm={() => {
          if (!cardToDelete) return;
          storageService.deleteCrmCard(cardToDelete.id);
          toast.success(`Oportunidade de ${cardToDelete.contactName} excluída com sucesso.`);
          setCardToDelete(null);
        }}
        title="Excluir Oportunidade do Pipeline"
        description={`Tem certeza que deseja excluir o card de ${cardToDelete?.contactName} (${cardToDelete?.vehicleName})? Esta ação removerá a negociação do funil.`}
        confirmText="Excluir Card"
        variant="danger"
      />

      <ConfirmActionModal
        isOpen={!!contactToDelete}
        onClose={() => setContactToDelete(null)}
        onConfirm={() => {
          if (!contactToDelete) return;
          storageService.deleteContact(contactToDelete.id);
          toast.success(`Contato ${contactToDelete.name} excluído.`);
          setContactToDelete(null);
          if (selectedContact?.id === contactToDelete.id) setSelectedContact(null);
        }}
        title="Excluir Contato 360º"
        description={`Deseja excluir o cadastro de ${contactToDelete?.name}?`}
        confirmText="Excluir Contato"
        variant="danger"
      />

      <ConfirmActionModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={() => {
          if (!taskToDelete) return;
          storageService.deleteCrmTask(taskToDelete.id);
          toast.success(`Tarefa "${taskToDelete.title}" excluída.`);
          setTaskToDelete(null);
        }}
        title="Excluir Tarefa Comercial"
        description={`Excluir a tarefa "${taskToDelete?.title}" permanentemente?`}
        confirmText="Excluir Tarefa"
        variant="danger"
      />

      <ConfirmActionModal
        isOpen={!!appointmentToDelete}
        onClose={() => setAppointmentToDelete(null)}
        onConfirm={() => {
          if (!appointmentToDelete) return;
          storageService.deleteAppointment(appointmentToDelete.id);
          toast.success(`Agendamento de ${appointmentToDelete.contactName} cancelado.`);
          setAppointmentToDelete(null);
        }}
        title="Cancelar Agendamento VIP"
        description={`Tem certeza que deseja cancelar o agendamento de ${appointmentToDelete?.contactName} em ${appointmentToDelete?.date} às ${appointmentToDelete?.time}?`}
        confirmText="Cancelar Agendamento"
        variant="danger"
      />

      {/* Sub Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2 p-1 rounded-xl bg-[#1C1C1E] border border-zinc-800 flex-wrap">
          <button
            onClick={() => setActiveSubTab('pipelines')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'pipelines'
                ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Kanban className="w-4 h-4" />
            <span>Pipelines / Funis ({cards.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('contatos')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'contatos'
                ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Contatos 360º ({contacts.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('tarefas')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'tarefas'
                ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Tarefas Comerciais ({tasks.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('agenda')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'agenda'
                ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Agendamentos VIP ({appointments.length})</span>
          </button>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          {activeSubTab === 'contatos' && (
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#C4B5FD] hover:bg-[#DDD6FE] text-[#2E1065] font-bold text-xs shadow-md shadow-[#8B5CF6]/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Novo Contato 360º</span>
            </button>
          )}

          {activeSubTab === 'tarefas' && (
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#C4B5FD] hover:bg-[#DDD6FE] text-[#2E1065] font-bold text-xs shadow-md shadow-[#8B5CF6]/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Nova Tarefa</span>
            </button>
          )}

          {activeSubTab === 'agenda' && (
            <button
              onClick={() => setIsAppointmentModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#C4B5FD] hover:bg-[#DDD6FE] text-[#2E1065] font-bold text-xs shadow-md shadow-[#8B5CF6]/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Agendar Visita / Test Drive</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. PIPELINES / KANBAN VIEW */}
      {/* ========================================================================= */}
      {activeSubTab === 'pipelines' && (
        <div className="space-y-4">
          {/* Seletor dos 5 Pipelines Automotivos */}
          <div className="p-3.5 rounded-2xl bg-[#1C1C1E] border border-zinc-800 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {initialPipelines.map((pipe) => {
                const isSelected = pipe.id === selectedPipelineId;
                return (
                  <button
                    key={pipe.id}
                    onClick={() => setSelectedPipelineId(pipe.id)}
                    className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'bg-[#25193A] text-white border border-[#8B5CF6]/60 shadow-inner'
                        : 'bg-[#0A0A0B] text-zinc-400 border border-zinc-800 hover:text-white'
                    }`}
                  >
                    <span>{pipe.name}</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-[#8B5CF6]/20 text-[#DDD6FE] text-[10px] font-mono">
                      {pipe.stages.length} etapas
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-zinc-400 hidden lg:block">
              {currentPipeline.description}
            </div>
          </div>

          {/* Kanban Board Columns */}
          <div className="flex gap-4 overflow-x-auto pb-6 min-h-[580px]">
            {currentPipeline.stages.map((stage, stageIndex) => {
              const stageCards = cards.filter(
                (c) => c.pipelineId === selectedPipelineId && c.stageId === stage.id
              );
              const totalValue = stageCards.reduce((acc, c) => acc + (c.vehiclePrice || 0), 0);

              const prevStage = stageIndex > 0 ? currentPipeline.stages[stageIndex - 1] : null;
              const nextStage = stageIndex < currentPipeline.stages.length - 1 ? currentPipeline.stages[stageIndex + 1] : null;

              return (
                <div
                  key={stage.id}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    if (dragOverStageId !== stage.id) {
                      setDragOverStageId(stage.id);
                    }
                  }}
                  onDragLeave={() => {
                    if (dragOverStageId === stage.id) {
                      setDragOverStageId(null);
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const cardId = e.dataTransfer.getData('text/plain');
                    setDragOverStageId(null);
                    setDraggedCardId(null);
                    if (cardId) {
                      const card = cards.find((c) => c.id === cardId);
                      if (card && card.stageId !== stage.id) {
                        handleStageChange(card, stage.id);
                      }
                    }
                  }}
                  className={`w-80 shrink-0 flex flex-col rounded-2xl border transition-all duration-200 overflow-hidden shadow-lg ${
                    dragOverStageId === stage.id
                      ? 'border-[#8B5CF6] bg-[#8B5CF6]/10 ring-2 ring-[#8B5CF6]/40 scale-[1.01]'
                      : 'border-zinc-800/80 bg-[#141416]'
                  }`}
                >
                  {/* Stage Header */}
                  <div className="p-3.5 border-b border-zinc-800/80 bg-[#1C1C1E] flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: stage.color }}
                      />
                      <h4 className="font-bold text-white text-xs truncate">{stage.name}</h4>
                    </div>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#0A0A0B] border border-zinc-800 text-zinc-300">
                      {stageCards.length}
                    </span>
                  </div>

                  {/* Stage Subtitle (Total em R$) */}
                  {totalValue > 0 && (
                    <div className="px-3.5 py-1.5 bg-[#0D0D0E] border-b border-zinc-800/50 text-[10px] text-zinc-400 font-mono flex items-center justify-between">
                      <span>Valor em Negociação:</span>
                      <span className="font-bold text-emerald-400">
                        R$ {totalValue.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  )}

                  {/* Cards Container */}
                  <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[500px]">
                    {stageCards.map((card) => (
                      <div
                        key={card.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', card.id);
                          setDraggedCardId(card.id);
                        }}
                        onDragEnd={() => {
                          setDraggedCardId(null);
                          setDragOverStageId(null);
                        }}
                        onClick={() => setSelectedLeadModalCard(card)}
                        className={`p-3.5 rounded-xl bg-[#1C1C1E] border hover:border-[#8B5CF6]/50 shadow-md transition-all space-y-2.5 text-xs group cursor-grab active:cursor-grabbing ${
                          draggedCardId === card.id ? 'opacity-40 border-dashed border-[#8B5CF6]' : 'border-zinc-800'
                        }`}
                      >
                        {/* Vehicle Photo & Price Tag */}
                        {card.vehiclePhoto && (
                          <div className="relative h-24 w-full rounded-lg overflow-hidden">
                            <img
                              src={card.vehiclePhoto}
                              alt={card.vehicleName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                              R$ {card.vehiclePrice?.toLocaleString('pt-BR')}
                            </span>
                          </div>
                        )}

                        <div>
                          <div className="flex items-center justify-between">
                            <h5 className="font-bold text-white text-xs truncate">{card.contactName}</h5>
                            {card.temperature && getTemperatureBadge(card.temperature)}
                          </div>
                          <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-zinc-500" />
                            {card.contactPhone}
                          </p>
                        </div>

                        {card.vehicleName && (
                          <div className="p-1.5 rounded-lg bg-[#0A0A0B] border border-zinc-800 text-[11px] font-mono text-zinc-300 flex items-center gap-1.5">
                            <Car className="w-3.5 h-3.5 text-[#A78BFA]" />
                            <span className="truncate">{card.vehicleName}</span>
                          </div>
                        )}

                        {/* Trade in or Financing status */}
                        {card.tradeInVehicle && (
                          <div className="text-[10px] text-zinc-400 bg-purple-950/20 border border-[#8B5CF6]/20 p-1.5 rounded-md">
                            🚗 <strong className="text-zinc-200">Troca:</strong> {card.tradeInVehicle}
                          </div>
                        )}

                        {/* Next Task */}
                        {card.nextTask && (
                          <div className="text-[10px] text-amber-300/90 flex items-start gap-1">
                            <Clock className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                            <span className="truncate">{card.nextTask}</span>
                          </div>
                        )}

                        {/* Card Footer: Responsible & Score */}
                        <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[10px]">
                          <span className="text-zinc-400 truncate">Resp: {card.assignedTo}</span>
                          <span className="text-[#DDD6FE] font-mono font-bold">
                            Score: {card.gridScore} pts
                          </span>
                        </div>

                        {/* Interactive Stage Actions & Quick Move */}
                        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-1" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            {prevStage && (
                              <button
                                onClick={() => handleStageChange(card, prevStage.id)}
                                className="p-1 rounded-md bg-[#0A0A0B] hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
                                title={`Voltar para: ${prevStage.name}`}
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}

                            <select
                              value={card.stageId}
                              onChange={(e) => handleStageChange(card, e.target.value)}
                              className="text-[10px] px-1.5 py-1 rounded bg-[#0A0A0B] border border-zinc-800 text-zinc-300 focus:border-[#8B5CF6] outline-none max-w-[130px]"
                            >
                              {currentPipeline.stages.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.name}
                                </option>
                              ))}
                            </select>

                            {nextStage && (
                              <button
                                onClick={() => handleStageChange(card, nextStage.id)}
                                className="p-1 rounded-md bg-[#8B5CF6]/20 hover:bg-[#8B5CF6] text-[#DDD6FE] hover:text-white border border-[#8B5CF6]/40 transition-colors cursor-pointer"
                                title={`Avançar para: ${nextStage.name}`}
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <button
                            onClick={() => setCardToDelete(card)}
                            className="p-1 rounded-md text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer ml-auto"
                            title="Excluir Oportunidade"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {stageCards.length === 0 && (
                      <div className="h-32 border-2 border-dashed border-zinc-800 rounded-xl flex items-center justify-center text-xs text-zinc-500">
                        Nenhum card nesta etapa
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CONTATOS 360º TABLE */}
      {/* ========================================================================= */}
      {activeSubTab === 'contatos' && (
        <div className="rounded-2xl bg-[#141416] border border-zinc-800/80 overflow-hidden shadow-xl space-y-4 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por nome, telefone, CPF ou cidade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 focus:border-[#8B5CF6] text-white placeholder-zinc-500 outline-none"
              />
            </div>
            <div className="text-xs text-zinc-400">
              Total de {contacts.length} contatos registrados
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-[#1C1C1E] text-zinc-400 uppercase font-semibold text-[10px]">
                  <th className="p-3">Cliente / Contato</th>
                  <th className="p-3">WhatsApp / Telefone</th>
                  <th className="p-3">Cidade / UF</th>
                  <th className="p-3">Origem</th>
                  <th className="p-3">Vendedor (Carteira)</th>
                  <th className="p-3">Histórico / Veículo</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {contacts
                  .filter((c) =>
                    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.phone.includes(searchQuery) ||
                    (c.city || '').toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((c) => (
                    <tr key={c.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-white text-xs">{c.name}</div>
                        <div className="text-[10px] text-zinc-400">{c.email || 'Sem e-mail'}</div>
                      </td>
                      <td className="p-3 font-mono text-zinc-300">{c.phone}</td>
                      <td className="p-3 text-zinc-300">
                        {c.city}, {c.state}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] font-mono">
                          {c.origin}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-[#8B5CF6]/20 text-[#DDD6FE] border border-[#8B5CF6]/30 text-[10px] font-semibold">
                          {c.assignedTo}
                        </span>
                      </td>
                      <td className="p-3 max-w-[200px] truncate text-zinc-300">
                        {c.tradeInHistory || c.notes || 'Interesse em Sedans/SUVs'}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedContact(c)}
                            className="px-2.5 py-1 rounded-lg bg-[#0A0A0B] hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-[11px] transition-colors cursor-pointer"
                          >
                            Ver 360º
                          </button>
                          <button
                            onClick={() => setContactToDelete(c)}
                            className="p-1 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Excluir Contato"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAREFAS COMERCIAIS */}
      {/* ========================================================================= */}
      {activeSubTab === 'tarefas' && (
        <div className="space-y-4">
          {/* Filter tabs */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              {(['all', 'Hoje', 'Atrasada', 'Próxima', 'Concluída'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTaskFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    taskFilter === filter
                      ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30'
                      : 'bg-[#1C1C1E] text-zinc-400 border border-zinc-800 hover:text-white'
                  }`}
                >
                  {filter === 'all' ? 'Todas Tarefas' : filter}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Nova Tarefa</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks
              .filter((t) => taskFilter === 'all' || t.status === taskFilter)
              .map((t) => {
                const isDone = t.status === 'Concluída';
                return (
                  <div
                    key={t.id}
                    className={`p-4 rounded-2xl border transition-all flex items-start gap-3 relative group ${
                      isDone
                        ? 'bg-[#141416]/60 border-zinc-800/40 opacity-70'
                        : t.status === 'Atrasada'
                        ? 'bg-[#1C1417] border-rose-500/30 shadow-md'
                        : 'bg-[#1C1C1E] border-zinc-800 shadow-md'
                    }`}
                  >
                    <button
                      onClick={() => handleToggleTaskStatus(t.id)}
                      className={`p-1.5 rounded-lg border mt-0.5 transition-colors cursor-pointer ${
                        isDone
                          ? 'bg-emerald-500 text-white border-emerald-400'
                          : 'bg-[#0A0A0B] border-zinc-700 text-transparent hover:border-[#8B5CF6]'
                      }`}
                      title={isDone ? 'Marcar como pendente' : 'Marcar como concluída'}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4
                          className={`text-xs font-bold truncate ${
                            isDone ? 'line-through text-zinc-500' : 'text-white'
                          }`}
                        >
                          {t.title}
                        </h4>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                              t.priority === 'Urgente'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : t.priority === 'Alta'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-zinc-800 text-zinc-300'
                            }`}
                          >
                            {t.priority}
                          </span>
                          <button
                            onClick={() => setTaskToDelete(t)}
                            className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Excluir Tarefa"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-2">
                        <span>👤 {t.contactName}</span>
                        <span>•</span>
                        <span className="font-mono text-zinc-300">📅 {t.dueDate} {t.dueTime ? `às ${t.dueTime}` : ''}</span>
                      </div>

                      {t.vehicle && (
                        <div className="text-[11px] text-[#DDD6FE] mt-1 flex items-center gap-1 font-mono">
                          <Car className="w-3 h-3 text-[#A78BFA]" />
                          <span>{t.vehicle}</span>
                        </div>
                      )}

                      {t.notes && (
                        <p className="text-[11px] text-zinc-300 mt-1.5 bg-[#0A0A0B] p-2 rounded-lg border border-zinc-800">
                          {t.notes}
                        </p>
                      )}

                      <div className="mt-2 text-[10px] text-[#C4B5FD] flex items-center justify-between">
                        <span>Responsável: {t.assignedTo}</span>
                        <span className="font-mono">Tipo: {t.type}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. AGENDAMENTOS VIP (AGENDA) */}
      {/* ========================================================================= */}
      {activeSubTab === 'agenda' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">{appointments.length} agendamentos confirmados</span>
            <button
              onClick={() => setIsAppointmentModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Agendar Novo Test Drive</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800 hover:border-[#8B5CF6]/40 shadow-xl transition-all space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-[#8B5CF6]/20 text-[#DDD6FE] border border-[#8B5CF6]/30 text-[10px] font-bold">
                    {apt.type}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                      {apt.status}
                    </span>
                    <button
                      onClick={() => setAppointmentToDelete(apt)}
                      className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Cancelar / Excluir Agendamento"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">{apt.contactName}</h4>
                  <p className="text-xs font-mono text-zinc-400">{apt.contactPhone}</p>
                </div>

                <div className="p-2 rounded-xl bg-[#0A0A0B] border border-zinc-800 text-xs space-y-1">
                  <div className="text-zinc-300 font-bold flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-[#A78BFA]" />
                    <span>{apt.vehicleName}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    <span>
                      {apt.date} às {apt.time}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-400">
                  📍 <strong>Showroom:</strong> {apt.storeUnit}
                  <br />👤 <strong>Vendedor:</strong> {apt.sellerName}
                </div>

                {apt.notes && (
                  <p className="text-[10px] text-zinc-400 italic bg-[#0A0A0B]/60 p-2 rounded-lg border border-zinc-800">
                    "{apt.notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lead Details Inspection Modal */}
      {selectedLeadModalCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-xl bg-[#141416] border border-[#8B5CF6]/40 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-zinc-800 bg-[#1C1C1E] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#DDD6FE] font-bold">
                  {selectedLeadModalCard.contactName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {selectedLeadModalCard.contactName}
                    {selectedLeadModalCard.temperature && getTemperatureBadge(selectedLeadModalCard.temperature)}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Origem: <span className="text-zinc-200">{selectedLeadModalCard.origin}</span> • Score:{' '}
                    <span className="text-[#DDD6FE] font-bold font-mono">{selectedLeadModalCard.gridScore} pts</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLeadModalCard(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Vehicle Banner */}
              {selectedLeadModalCard.vehiclePhoto && (
                <div className="relative h-44 w-full rounded-xl overflow-hidden border border-zinc-800">
                  <img
                    src={selectedLeadModalCard.vehiclePhoto}
                    alt={selectedLeadModalCard.vehicleName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                    <div>
                      <span className="text-xs text-purple-300 font-semibold uppercase tracking-wider">Veículo de Interesse</span>
                      <h4 className="text-lg font-bold text-white">{selectedLeadModalCard.vehicleName}</h4>
                      <p className="text-sm font-bold text-emerald-400 font-mono">
                        R$ {selectedLeadModalCard.vehiclePrice?.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Contacts & Consultor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#0A0A0B] border border-zinc-800 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold">Contato Direto</span>
                  <p className="text-xs text-zinc-200 font-mono flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-zinc-400" />
                    {selectedLeadModalCard.contactPhone}
                  </p>
                  {selectedLeadModalCard.contactEmail && (
                    <p className="text-xs text-zinc-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-zinc-400" />
                      {selectedLeadModalCard.contactEmail}
                    </p>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-[#0A0A0B] border border-zinc-800 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold">Atendimento Comercial</span>
                  <p className="text-xs text-zinc-200 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    Resp: <strong>{selectedLeadModalCard.assignedTo}</strong>
                  </p>
                  <p className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    Tempo na etapa: {selectedLeadModalCard.timeInStage}
                  </p>
                </div>
              </div>

              {/* Trade in & Downpayment */}
              {selectedLeadModalCard.tradeInVehicle && (
                <div className="p-3 rounded-xl bg-purple-950/20 border border-[#8B5CF6]/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-[#A78BFA]" />
                    <div>
                      <span className="text-[10px] text-purple-300 font-semibold block">Veículo Dado na Troca</span>
                      <span className="text-xs font-bold text-white">{selectedLeadModalCard.tradeInVehicle}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#8B5CF6]/20 text-[#DDD6FE] border border-[#8B5CF6]/40">
                    Avaliação Pendente
                  </span>
                </div>
              )}

              {/* Stage Transition Quick Buttons */}
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <label className="block text-xs font-bold text-zinc-300">
                  Mover Etapa no Funil ({currentPipeline.name})
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentPipeline.stages.map((stage) => {
                    const isCurrent = stage.id === selectedLeadModalCard.stageId;
                    return (
                      <button
                        key={stage.id}
                        type="button"
                        onClick={() => {
                          handleStageChange(selectedLeadModalCard, stage.id);
                          setSelectedLeadModalCard((prev) => (prev ? { ...prev, stageId: stage.id } : null));
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                          isCurrent
                            ? 'bg-[#8B5CF6] text-white font-bold shadow-md shadow-[#8B5CF6]/30 ring-2 ring-[#8B5CF6]/50'
                            : 'bg-[#0A0A0B] hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                        <span>{stage.name}</span>
                        {isCurrent && <Check className="w-3 h-3 ml-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleStageChange(selectedLeadModalCard, 'vd-10');
                    setSelectedLeadModalCard(null);
                  }}
                  className="px-3 py-2 text-xs font-bold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/30 border border-rose-500/30 rounded-xl transition-colors cursor-pointer"
                >
                  Marcar Venda Perdida
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleStageChange(selectedLeadModalCard, 'vd-9');
                      setSelectedLeadModalCard(null);
                    }}
                    className="px-4 py-2 text-xs font-bold text-emerald-300 hover:text-white bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-500/40 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Concretizar Venda Fechada</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
