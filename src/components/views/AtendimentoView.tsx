import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  Phone,
  Car,
  Bot,
  User,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Paperclip,
  Smile,
  Mic,
  Calendar,
  UserCheck,
  Tag,
  ExternalLink,
  Flame,
  Thermometer,
  Snowflake,
  Play,
  Volume2,
  ChevronRight,
  TrendingUp,
  Share2,
  Filter,
  Check,
  XCircle,
  PlusCircle,
} from 'lucide-react';
import { Conversation, LeadTemperature, Vehicle } from '../../types';
import { initialConversations, initialVehicles, initialAuthUsers } from '../../data/mockData';
import { TransferChatModal } from '../modals/TransferChatModal';
import { ScheduleAppointmentModal } from '../modals/ScheduleAppointmentModal';

export const AtendimentoView: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConvId, setSelectedConvId] = useState<string>('conv-1');
  const [inboxTab, setInboxTab] = useState<'novos' | 'meus' | 'outros'>('novos');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);

  // Modals state
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const selectedConv =
    conversations.find((c) => c.id === selectedConvId) || conversations[0];

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    // Tab filter
    if (inboxTab === 'novos' && !c.isNewLead && c.status !== 'Novo') {
      // allow fallback if empty
    }
    if (inboxTab === 'meus' && c.assignedTo !== 'Camila Rocha' && c.assignedTo !== 'Rodrigo Mendes') {
      //
    }
    if (unreadOnly && c.unreadCount === 0) return false;
    if (selectedChannel !== 'all' && c.channel !== selectedChannel) return false;
    if (selectedTag !== 'all' && !c.tags.includes(selectedTag)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.contactName.toLowerCase().includes(q);
      const matchPhone = c.contactPhone.toLowerCase().includes(q);
      const matchMsg = c.lastMessage.toLowerCase().includes(q);
      const matchCar = c.tracking.vehicleOfInterest?.model.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchMsg && !matchCar) return false;
    }
    return true;
  });

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'agent' as const,
      senderName: 'Você (Operador MotorGrid)',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedConvId) {
          return {
            ...c,
            status: 'Em Atendimento',
            lastMessage: inputText,
            lastMessageTime: 'Agora mesmo',
            unreadCount: 0,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    setInputText('');
  };

  const handleSendAiSuggestion = (suggestion: string) => {
    setInputText(suggestion);
  };

  const handleSimulateVoiceRecording = () => {
    setIsRecordingAudio(true);
    setTimeout(() => {
      setIsRecordingAudio(false);
      const voiceMsg = {
        id: `msg-${Date.now()}`,
        sender: 'agent' as const,
        senderName: 'Você (Operador MotorGrid)',
        text: '🔊 [Mensagem de Voz Gravada - 0:18]',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        audioUrl: 'https://actions.google.com/sounds/v1/speech/greeting.ogg',
        audioDuration: '0:18',
        audioTranscription: 'Olá! Enviei a ficha técnica completa do carro no seu WhatsApp.',
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === selectedConvId) {
            return {
              ...c,
              lastMessage: '🔊 Áudio enviado (0:18)',
              lastMessageTime: 'Agora mesmo',
              messages: [...c.messages, voiceMsg],
            };
          }
          return c;
        })
      );
    }, 2500);
  };

  const getTemperatureBadge = (temp?: LeadTemperature) => {
    switch (temp) {
      case 'Quente':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
            <Flame className="w-3 h-3 text-rose-400 fill-rose-400" />
            Lead Quente
          </span>
        );
      case 'Morno':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
            <Thermometer className="w-3 h-3 text-amber-400" />
            Lead Morno
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-bold">
            <Snowflake className="w-3 h-3 text-blue-400" />
            Lead Frio
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Modals */}
      <TransferChatModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        leadName={selectedConv?.contactName}
        currentAssignedTo={selectedConv?.assignedTo}
        onTransfer={(targetUser, reason) => {
          setConversations((prev) =>
            prev.map((c) =>
              c.id === selectedConvId
                ? {
                    ...c,
                    assignedTo: targetUser.name,
                    assignedUserRole: targetUser.role,
                    events: [
                      ...c.events,
                      {
                        id: `ev-${Date.now()}`,
                        type: 'transferred',
                        title: `Atendimento Transferido para ${targetUser.name}`,
                        description: `Motivo: ${reason}`,
                        timestamp: 'Agora mesmo',
                        authorName: 'Você (Operador)',
                      },
                    ],
                  }
                : c
            )
          );
        }}
      />

      <ScheduleAppointmentModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        defaultContactName={selectedConv?.contactName}
        defaultContactPhone={selectedConv?.contactPhone}
        defaultVehicleName={selectedConv?.tracking.vehicleOfInterest?.model}
        onSchedule={(apt) => {
          setConversations((prev) =>
            prev.map((c) =>
              c.id === selectedConvId
                ? {
                    ...c,
                    events: [
                      ...c.events,
                      {
                        id: `ev-${Date.now()}`,
                        type: 'appointment_created',
                        title: `${apt.type} Agendado para ${apt.date} às ${apt.time}`,
                        description: `Showroom: ${apt.storeUnit}. Vendedor: ${apt.sellerName}`,
                        timestamp: 'Agora mesmo',
                        authorName: 'Você (Operador)',
                      },
                    ],
                  }
                : c
            )
          );
        }}
      />

      {/* Top Banner KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-zinc-400">Fila de Atendimento</div>
            <div className="text-xl font-bold text-white mt-0.5">8 aguardando</div>
            <div className="text-[10px] text-emerald-400 mt-0.5 font-medium">● SLA médio: 1.8 min</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/30">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-zinc-400">Leads Quentes (Alta Intenção)</div>
            <div className="text-xl font-bold text-rose-400 mt-0.5">5 oportunidades</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Grid Score &gt; 85 pts</div>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-zinc-400">Test Drives Agendados Hoje</div>
            <div className="text-xl font-bold text-[#C4B5FD] mt-0.5">4 visitas VIP</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Lembretes WhatsApp ativos</div>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/15 text-[#DDD6FE] border border-purple-500/30">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-zinc-400">Canais Conectados</div>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">100% Online</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">WhatsApp, Insta &amp; Portais</div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main 3-Column Omnichannel Inbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[760px] rounded-2xl border border-zinc-800/80 bg-[#121214] overflow-hidden shadow-2xl">
        {/* ========================================================================= */}
        {/* COLUNA 1: CAIXA DE ENTRADA & FILTROS (3.5 colunas) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 border-r border-zinc-800 bg-[#161618] flex flex-col h-full">
          {/* Header das Abas: Novos | Meus | Outros */}
          <div className="p-3 border-b border-zinc-800/80 space-y-2.5 bg-[#1C1C1E]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0A0A0B] border border-zinc-800 w-full">
                <button
                  onClick={() => setInboxTab('novos')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    inboxTab === 'novos'
                      ? 'bg-[#8B5CF6] text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>Novos</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-mono animate-pulse">
                    3
                  </span>
                </button>
                <button
                  onClick={() => setInboxTab('meus')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    inboxTab === 'meus'
                      ? 'bg-[#8B5CF6] text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Meus
                </button>
                <button
                  onClick={() => setInboxTab('outros')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    inboxTab === 'outros'
                      ? 'bg-[#8B5CF6] text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Todos
                </button>
              </div>
            </div>

            {/* Busca & Filtro de Não Lidas */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar contato, fone ou carro..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white placeholder-zinc-500 outline-none transition-colors"
                />
              </div>
              <button
                onClick={() => setUnreadOnly(!unreadOnly)}
                className={`p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  unreadOnly
                    ? 'bg-[#8B5CF6]/30 text-[#DDD6FE] border-[#8B5CF6]'
                    : 'bg-[#0A0A0B] text-zinc-400 border-zinc-800 hover:text-white'
                }`}
                title="Apenas não lidas"
              >
                <Filter className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Filtros rápidos por Canal */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
              {['all', 'WhatsApp', 'Instagram', 'Webmotors', 'OLX'].map((ch) => (
                <button
                  key={ch}
                  onClick={() => setSelectedChannel(ch)}
                  className={`px-2 py-0.5 rounded-md font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedChannel === ch
                      ? 'bg-[#C4B5FD] text-[#2E1065] font-bold'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {ch === 'all' ? 'Todos Canais' : ch}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de Conversas */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/40">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === selectedConvId;
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`w-full text-left p-3.5 transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-[#25193A] border-l-4 border-[#C4B5FD]'
                      : 'hover:bg-zinc-800/40'
                  }`}
                >
                  {/* Avatar com badge do canal */}
                  <div className="relative shrink-0">
                    <img
                      src={conv.contactAvatar}
                      alt={conv.contactName}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-[#8B5CF6]/40"
                    />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 px-1 py-0.2 rounded-full text-[8px] font-bold text-white border border-[#141416] ${
                        conv.channel === 'WhatsApp'
                          ? 'bg-emerald-500'
                          : conv.channel === 'Instagram'
                          ? 'bg-gradient-to-tr from-amber-500 to-pink-500'
                          : conv.channel === 'Webmotors'
                          ? 'bg-red-600'
                          : 'bg-blue-600'
                      }`}
                    >
                      {conv.channel.slice(0, 2)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate">{conv.contactName}</h4>
                      <span className="text-[10px] text-zinc-400 font-mono">{conv.lastMessageTime}</span>
                    </div>

                    <p className="text-[11px] text-zinc-300 truncate mt-0.5 font-medium">
                      {conv.lastMessage}
                    </p>

                    {/* Tags e Veículo de Interesse */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {conv.tracking.vehicleOfInterest && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#0A0A0B] border border-zinc-800 text-zinc-300 font-mono truncate max-w-[130px] flex items-center gap-1">
                          <Car className="w-2.5 h-2.5 text-[#A78BFA]" />
                          {conv.tracking.vehicleOfInterest.model}
                        </span>
                      )}

                      {conv.temperature && getTemperatureBadge(conv.temperature)}

                      {conv.unreadCount > 0 && (
                        <span className="ml-auto text-[10px] px-1.5 py-0.2 rounded-full bg-[#8B5CF6] text-white font-bold animate-bounce">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COLUNA 2: JANELA DA CONVERSA & HISTÓRICO COM EVENTOS (5 colunas) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col h-full bg-[#0D0D0E]">
          {/* Cabeçalho da Conversa */}
          <div className="px-5 py-3 border-b border-zinc-800 bg-[#1C1C1E] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={selectedConv.contactAvatar}
                alt={selectedConv.contactName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#8B5CF6]/50"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm">{selectedConv.contactName}</h3>
                  {selectedConv.temperature && getTemperatureBadge(selectedConv.temperature)}
                </div>
                <div className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5">
                  <span>{selectedConv.contactPhone}</span>
                  <span>•</span>
                  <span className="text-[#DDD6FE]">Resp: {selectedConv.assignedTo}</span>
                </div>
              </div>
            </div>

            {/* Quick action: Transfer & Schedule */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsScheduleModalOpen(true)}
                className="p-2 rounded-xl bg-[#0A0A0B] hover:bg-zinc-800 border border-zinc-700/80 text-[#C4B5FD] hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5 font-semibold"
                title="Agendar Test Drive ou Visita"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Agendar</span>
              </button>
              <button
                onClick={() => setIsTransferModalOpen(true)}
                className="p-2 rounded-xl bg-[#0A0A0B] hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5 font-semibold"
                title="Transferir para outro vendedor"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#A78BFA]" />
                <span className="hidden sm:inline">Transferir</span>
              </button>
            </div>
          </div>

          {/* Histórico Cronológico com Eventos do Sistema Destacados */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-gradient-to-b from-[#0D0D0E] to-[#121214]">
            {/* Eventos da Linha do Tempo */}
            {selectedConv.events.map((ev) => (
              <div key={ev.id} className="flex justify-center my-2">
                <div className="max-w-md w-full p-2.5 rounded-xl bg-[#1C1C1E]/90 border border-[#8B5CF6]/30 text-xs shadow-md space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#DDD6FE]">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
                      {ev.title}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">{ev.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-snug">{ev.description}</p>
                </div>
              </div>
            ))}

            {/* Mensagens da Conversa */}
            {selectedConv.messages.map((m) => {
              const isMe = m.sender === 'agent';

              return (
                <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1.5 shadow-md ${
                      isMe
                        ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white rounded-br-none'
                        : 'bg-[#1C1C1E] border border-zinc-700/80 text-zinc-200 rounded-bl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 font-semibold text-[10px] opacity-80">
                      <span>{m.senderName}</span>
                      <span className="font-mono">{m.timestamp}</span>
                    </div>

                    {/* Audio Player Component if voice note */}
                    {m.audioTranscription && (
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 space-y-2 mt-1">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                            className="p-1.5 rounded-full bg-[#C4B5FD] text-[#2E1065] hover:scale-105 transition-transform cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>
                          <div className="flex-1 flex items-center gap-0.5 h-4">
                            {[40, 70, 90, 60, 30, 80, 100, 50, 75, 45, 95, 60, 35, 85].map(
                              (h, idx) => (
                                <span
                                  key={idx}
                                  style={{ height: `${h}%` }}
                                  className="flex-1 bg-[#C4B5FD] rounded-full opacity-80"
                                />
                              )
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-zinc-300">
                            {m.audioDuration || '0:38'}
                          </span>
                        </div>
                        <div className="pt-1.5 border-t border-white/10 text-[11px] text-zinc-200">
                          <span className="font-bold text-[#C4B5FD] flex items-center gap-1 mb-0.5 text-[10px]">
                            <Sparkles className="w-3 h-3" /> Transcrição IA (Whisper):
                          </span>
                          "{m.audioTranscription}"
                        </div>
                      </div>
                    )}

                    {!m.audioTranscription && <p className="leading-relaxed text-sm">{m.text}</p>}
                  </div>
                </div>
              );
            })}
          </div>

            {/* Sugestões do Grid AI */}
          <div className="px-4 py-2 bg-[#141416] border-t border-zinc-800 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-zinc-400 flex items-center gap-1 shrink-0 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#C4B5FD]" />
              Grid AI:
            </span>
            <button
              onClick={() =>
                handleSendAiSuggestion(
                  'Olá Marcelo! Com certeza, pegamos seu Jeep Compass 2022 na troca. Podemos agendar uma avaliação técnica hoje no showroom?'
                )
              }
              className="px-2.5 py-1 rounded-lg bg-[#8B5CF6]/15 hover:bg-[#8B5CF6]/30 text-[#DDD6FE] border border-[#8B5CF6]/30 truncate cursor-pointer transition-colors"
            >
              "Pegamos o Compass 2022 na troca..."
            </button>
            <button
              onClick={() =>
                handleSendAiSuggestion(
                  'Consigo segurar a BMW reservada para você até quinta-feira mediante sinal de reserva de 5%.'
                )
              }
              className="px-2.5 py-1 rounded-lg bg-[#8B5CF6]/15 hover:bg-[#8B5CF6]/30 text-[#DDD6FE] border border-[#8B5CF6]/30 truncate cursor-pointer transition-colors"
            >
              "Segurar reserva até quinta-feira..."
            </button>
          </div>

          {/* Composer & Input Box */}
          <form onSubmit={handleSendMessage} className="p-3.5 border-t border-zinc-800 bg-[#1C1C1E] space-y-2">
            <div className="flex items-center gap-2">
              <input
                id="atendimento-message-input"
                type="text"
                placeholder="Digite sua resposta comercial, proposta ou envie fotos..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white placeholder-zinc-500 outline-none transition-colors"
              />

              {/* Botão Gravar Áudio Simulado */}
              <button
                type="button"
                onClick={handleSimulateVoiceRecording}
                disabled={isRecordingAudio}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isRecordingAudio
                    ? 'bg-rose-500 text-white animate-pulse border-rose-400'
                    : 'bg-[#0A0A0B] text-zinc-300 border-zinc-700 hover:text-white'
                }`}
                title="Gravar áudio com transcrição IA"
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Botão Enviar */}
              <button
                type="submit"
                id="atendimento-send-message-btn"
                className="px-4 py-2.5 rounded-xl bg-[#C4B5FD] hover:bg-[#DDD6FE] text-[#2E1065] font-bold text-xs shadow-md shadow-[#8B5CF6]/20 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 font-['Plus_Jakarta_Sans',sans-serif]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </div>
          </form>
        </div>

        {/* ========================================================================= */}
        {/* COLUNA 3: RASTREAMENTO DO LEAD & FICHA 360º (3.5 colunas) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 border-l border-zinc-800 bg-[#161618] flex flex-col h-full overflow-y-auto p-4 space-y-4">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider text-zinc-400 flex items-center justify-between">
            <span>Rastreamento &amp; Ficha 360º</span>
            <span className="text-[10px] text-[#A78BFA] font-mono">ID: {selectedConv.contactId}</span>
          </h3>

          {/* Grid Score Gauge Card */}
          <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#C4B5FD]" />
                Grid Score Automotivo
              </span>
              <span className="text-lg font-extrabold text-emerald-400 font-mono">
                {selectedConv.leadScore || 92} / 100
              </span>
            </div>

            {/* Barra de Progresso */}
            <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#8B5CF6] via-indigo-500 to-emerald-400 rounded-full"
                style={{ width: `${selectedConv.leadScore || 92}%` }}
              />
            </div>

            <p className="text-[11px] text-zinc-300">
              ⚡ <strong>Alta Intenção de Compra:</strong> Cliente possui valor de entrada pré-aprovado e veículo na troca com laudo em dia.
            </p>
          </div>

          {/* Veículo de Interesse com Foto Grande & Dados do Estoque */}
          {selectedConv.tracking.vehicleOfInterest && (
            <div className="rounded-2xl bg-[#1C1C1E] border border-zinc-800 overflow-hidden space-y-2.5">
              <div className="relative h-32 w-full overflow-hidden">
                <img
                  src={selectedConv.tracking.vehicleOfInterest.photo}
                  alt={selectedConv.tracking.vehicleOfInterest.model}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-sm text-emerald-400 font-bold text-xs border border-emerald-500/40">
                  R$ {selectedConv.tracking.vehicleOfInterest.price.toLocaleString('pt-BR')}
                </span>
              </div>

              <div className="p-3.5 space-y-2">
                <div>
                  <h4 className="font-bold text-white text-xs">
                    {selectedConv.tracking.vehicleOfInterest.brand}{' '}
                    {selectedConv.tracking.vehicleOfInterest.model}
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    {selectedConv.tracking.vehicleOfInterest.version}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[10px] text-zinc-300">
                  <div className="p-1.5 rounded-lg bg-[#0A0A0B] border border-zinc-800">
                    <span className="text-zinc-500 block">Ano:</span>
                    <span className="font-bold">{selectedConv.tracking.vehicleOfInterest.year}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-[#0A0A0B] border border-zinc-800">
                    <span className="text-zinc-500 block">Quilometragem:</span>
                    <span className="font-bold">
                      {selectedConv.tracking.vehicleOfInterest.km.toLocaleString('pt-BR')} km
                    </span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-[#0A0A0B] border border-zinc-800">
                    <span className="text-zinc-500 block">Câmbio:</span>
                    <span className="font-bold">{selectedConv.tracking.vehicleOfInterest.gearbox}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-[#0A0A0B] border border-zinc-800">
                    <span className="text-zinc-500 block">Cor:</span>
                    <span className="font-bold">{selectedConv.tracking.vehicleOfInterest.color}</span>
                  </div>
                </div>

                <div className="text-[10px] text-zinc-400 pt-1 border-t border-zinc-800">
                  📍 {selectedConv.tracking.vehicleOfInterest.store}
                </div>
              </div>
            </div>
          )}

          {/* Dados de Tráfego Pago & Rastreamento UTM */}
          <div className="p-3.5 rounded-2xl bg-[#1C1C1E] border border-zinc-800 space-y-2.5 text-xs">
            <h4 className="font-bold text-white text-[11px] flex items-center justify-between">
              <span>Origem da Conversão</span>
              <span className="text-[#C4B5FD] font-mono">{selectedConv.tracking.origin}</span>
            </h4>

            <div className="space-y-1.5 text-[11px] text-zinc-300 font-mono">
              {selectedConv.tracking.campaign && (
                <div className="p-1.5 rounded-lg bg-[#0A0A0B] border border-zinc-800 truncate">
                  <span className="text-zinc-500">Campanha: </span>
                  <span className="text-zinc-200">{selectedConv.tracking.campaign}</span>
                </div>
              )}
              {selectedConv.tracking.utmSource && (
                <div className="p-1.5 rounded-lg bg-[#0A0A0B] border border-zinc-800 truncate">
                  <span className="text-zinc-500">UTM: </span>
                  <span className="text-[#DDD6FE]">
                    source={selectedConv.tracking.utmSource}&medium={selectedConv.tracking.utmMedium}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Ações Rápidas de Fechamento */}
          <div className="space-y-2 pt-1">
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold shadow-md shadow-[#8B5CF6]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Visita / Test Drive</span>
            </button>
            <button
              onClick={() => setIsTransferModalOpen(true)}
              className="w-full py-2 px-3 rounded-xl bg-[#1C1C1E] hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-[#C4B5FD]" />
              <span>Transferir para Vendedor</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
