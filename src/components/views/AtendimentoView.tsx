import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Car,
  Check,
  CheckCheck,
  Sparkles,
  Paperclip,
  Smile,
  Mic,
  Calendar,
  UserCheck,
  Flame,
  Thermometer,
  Snowflake,
  Play,
  Pause,
  Filter,
  FileText,
  Image as ImageIcon,
  MapPin,
  X,
  Info,
  ChevronDown,
  ArrowLeft,
  DollarSign,
  ShieldCheck,
  Zap,
  Calculator,
  RefreshCw,
  Copy,
  Building2,
  Globe,
  Radio,
  SlidersHorizontal,
} from 'lucide-react';
import { Conversation, LeadTemperature, CommunicationChannel, AttendanceSummary } from '../../types';
import { initialConversations } from '../../data/mockData';
import { TransferChatModal } from '../modals/TransferChatModal';
import { ScheduleAppointmentModal } from '../modals/ScheduleAppointmentModal';
import { AIFinancingSimulatorModal } from '../modals/AIFinancingSimulatorModal';
import { LeadAttendanceSummaryCard } from '../atendimento/LeadAttendanceSummaryCard';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';

interface ChannelConfigItem {
  id: string;
  name: string;
  shortLabel: string;
  iconTag: string;
  pillActiveBg: string;
  pillBorder: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  avatarBg: string;
  avatarText: string;
}

const CHANNELS_CATALOG: ChannelConfigItem[] = [
  {
    id: 'todos',
    name: 'Todos os Canais',
    shortLabel: 'Todos',
    iconTag: 'ALL',
    pillActiveBg: 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30',
    pillBorder: 'border-white/10',
    badgeBg: 'bg-[#8B5CF6]/20',
    badgeText: 'text-[#8B5CF6]',
    badgeBorder: 'border-[#8B5CF6]/30',
    avatarBg: 'bg-[#8B5CF6]',
    avatarText: 'text-white',
  },
  {
    id: 'WhatsApp',
    name: 'WhatsApp',
    shortLabel: 'WhatsApp',
    iconTag: 'W',
    pillActiveBg: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30',
    pillBorder: 'border-emerald-500/30',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-400',
    badgeBorder: 'border-emerald-500/30',
    avatarBg: 'bg-emerald-500',
    avatarText: 'text-white',
  },
  {
    id: 'Instagram',
    name: 'Instagram',
    shortLabel: 'Instagram',
    iconTag: 'IG',
    pillActiveBg: 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-md shadow-pink-600/30',
    pillBorder: 'border-pink-500/30',
    badgeBg: 'bg-pink-500/20',
    badgeText: 'text-pink-400',
    badgeBorder: 'border-pink-500/30',
    avatarBg: 'bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600',
    avatarText: 'text-white',
  },
  {
    id: 'Facebook',
    name: 'Facebook',
    shortLabel: 'Facebook',
    iconTag: 'FB',
    pillActiveBg: 'bg-blue-600 text-white shadow-md shadow-blue-600/30',
    pillBorder: 'border-blue-500/30',
    badgeBg: 'bg-blue-600/20',
    badgeText: 'text-blue-400',
    badgeBorder: 'border-blue-500/30',
    avatarBg: 'bg-[#1877F2]',
    avatarText: 'text-white',
  },
  {
    id: 'TikTok',
    name: 'TikTok',
    shortLabel: 'TikTok',
    iconTag: 'TT',
    pillActiveBg: 'bg-[#111827] border border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20',
    pillBorder: 'border-cyan-500/30',
    badgeBg: 'bg-cyan-500/20',
    badgeText: 'text-cyan-300',
    badgeBorder: 'border-cyan-500/30',
    avatarBg: 'bg-black border border-cyan-400',
    avatarText: 'text-cyan-300',
  },
  {
    id: 'Webmotors',
    name: 'Webmotors',
    shortLabel: 'Webmotors',
    iconTag: 'WM',
    pillActiveBg: 'bg-rose-600 text-white shadow-md shadow-rose-600/30',
    pillBorder: 'border-rose-500/30',
    badgeBg: 'bg-rose-500/20',
    badgeText: 'text-rose-400',
    badgeBorder: 'border-rose-500/30',
    avatarBg: 'bg-[#E11D48]',
    avatarText: 'text-white',
  },
  {
    id: 'OLX',
    name: 'OLX',
    shortLabel: 'OLX',
    iconTag: 'OLX',
    pillActiveBg: 'bg-purple-600 text-white shadow-md shadow-purple-600/30',
    pillBorder: 'border-purple-500/30',
    badgeBg: 'bg-purple-500/20',
    badgeText: 'text-purple-300',
    badgeBorder: 'border-purple-500/30',
    avatarBg: 'bg-[#8B5CF6]',
    avatarText: 'text-white',
  },
  {
    id: 'Mobiauto',
    name: 'Mobiauto',
    shortLabel: 'Mobiauto',
    iconTag: 'MOBI',
    pillActiveBg: 'bg-sky-600 text-white shadow-md shadow-sky-600/30',
    pillBorder: 'border-sky-500/30',
    badgeBg: 'bg-sky-500/20',
    badgeText: 'text-sky-300',
    badgeBorder: 'border-sky-500/30',
    avatarBg: 'bg-sky-500',
    avatarText: 'text-white',
  },
  {
    id: 'Chave na Mão',
    name: 'Chave na Mão',
    shortLabel: 'Chave na Mão',
    iconTag: 'CNM',
    pillActiveBg: 'bg-amber-600 text-white shadow-md shadow-amber-600/30',
    pillBorder: 'border-amber-500/30',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-500/30',
    avatarBg: 'bg-amber-500',
    avatarText: 'text-black font-extrabold',
  },
  {
    id: 'iCarros',
    name: 'iCarros',
    shortLabel: 'iCarros',
    iconTag: 'iC',
    pillActiveBg: 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30',
    pillBorder: 'border-indigo-500/30',
    badgeBg: 'bg-indigo-500/20',
    badgeText: 'text-indigo-300',
    badgeBorder: 'border-indigo-500/30',
    avatarBg: 'bg-indigo-600',
    avatarText: 'text-white',
  },
  {
    id: 'Mercado Livre',
    name: 'Mercado Livre',
    shortLabel: 'Mercado Livre',
    iconTag: 'ML',
    pillActiveBg: 'bg-yellow-500 text-black font-bold shadow-md shadow-yellow-500/30',
    pillBorder: 'border-yellow-500/30',
    badgeBg: 'bg-yellow-500/20',
    badgeText: 'text-yellow-300',
    badgeBorder: 'border-yellow-500/30',
    avatarBg: 'bg-yellow-400',
    avatarText: 'text-black font-extrabold',
  },
  {
    id: 'WebChat',
    name: 'WebChat / Site',
    shortLabel: 'WebChat',
    iconTag: 'WEB',
    pillActiveBg: 'bg-violet-600 text-white shadow-md shadow-violet-600/30',
    pillBorder: 'border-violet-500/30',
    badgeBg: 'bg-violet-500/20',
    badgeText: 'text-violet-300',
    badgeBorder: 'border-violet-500/30',
    avatarBg: 'bg-violet-600',
    avatarText: 'text-white',
  },
];

interface AtendimentoViewProps {
  initialConversationId?: string | null;
  initialLeadPhone?: string | null;
}

export const AtendimentoView: React.FC<AtendimentoViewProps> = ({
  initialConversationId,
  initialLeadPhone,
}) => {
  const toast = useToast();
  const [conversations, setConversations] = useState<Conversation[]>(() => storageService.getConversations());

  // Keep conversations synced with central storageService
  useEffect(() => {
    const unsub = storageService.subscribe(() => {
      setConversations(storageService.getConversations());
    });
    return unsub;
  }, []);
  const [selectedConvId, setSelectedConvId] = useState<string>(() => {
    if (initialConversationId) {
      const match = initialConversations.find(
        (c) =>
          c.id === initialConversationId ||
          c.contactPhone === initialConversationId ||
          (initialLeadPhone && c.contactPhone === initialLeadPhone)
      );
      if (match) return match.id;
    }
    return 'conv-1';
  });

  // Atualiza conversa selecionada se a prop mudar
  useEffect(() => {
    if (initialConversationId || initialLeadPhone) {
      const match = conversations.find(
        (c) =>
          (initialConversationId && c.id === initialConversationId) ||
          (initialConversationId && c.contactPhone === initialConversationId) ||
          (initialLeadPhone && c.contactPhone === initialLeadPhone) ||
          (initialConversationId && c.contactName.toLowerCase().includes(initialConversationId.toLowerCase()))
      );
      if (match) {
        setSelectedConvId(match.id);
        setSelectedChannel('todos');
        setInboxTab('todos');
      }
    }
  }, [initialConversationId, initialLeadPhone, conversations]);
  const [inboxTab, setInboxTab] = useState<'todos' | 'novos' | 'meus'>('todos');
  const [selectedChannel, setSelectedChannel] = useState<string>('todos');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  
  // Right Drawer Tab: 'profile' | 'financing'
  const [rightDrawerTab, setRightDrawerTab] = useState<'profile' | 'financing'>('profile');
  const [showContactInfo, setShowContactInfo] = useState(true);

  // Audio state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioPlaybackSpeed, setAudioPlaybackSpeed] = useState<'1x' | '1.5x' | '2x'>('1x');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // UI state
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [selectedMessageReaction, setSelectedMessageReaction] = useState<Record<string, string>>({});

  // Modals state
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isFinancingModalOpen, setIsFinancingModalOpen] = useState(false);

  // Embedded Mini Financing Simulator State (in right panel)
  const [miniTradeIn, setMiniTradeIn] = useState(true);
  const [miniTradeInVal, setMiniTradeInVal] = useState(132000);
  const [miniCashDown, setMiniCashDown] = useState(30000);
  const [miniBank, setMiniBank] = useState<'itau' | 'santander' | 'bv' | 'pan'>('itau');
  const [isMiniCalculating, setIsMiniCalculating] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConv =
    conversations.find((c) => c.id === selectedConvId) || conversations[0];

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConv?.messages, selectedConvId]);

  // Voice recording timer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecordingAudio) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingAudio]);

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    if (inboxTab === 'novos' && !c.isNewLead && c.status !== 'Novo') return false;
    if (inboxTab === 'meus' && c.assignedTo !== 'Camila Rocha' && c.assignedTo !== 'Rodrigo Mendes') return false;
    if (selectedChannel !== 'todos' && c.channel !== selectedChannel) return false;
    if (unreadOnly && c.unreadCount === 0) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.contactName.toLowerCase().includes(q);
      const matchPhone = c.contactPhone.toLowerCase().includes(q);
      const matchMsg = c.lastMessage.toLowerCase().includes(q);
      const matchCar = c.tracking.vehicleOfInterest?.model.toLowerCase().includes(q);
      const matchChannel = c.channel.toLowerCase().includes(q);
      const matchOrigin = c.tracking.origin?.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchMsg && !matchCar && !matchChannel && !matchOrigin) return false;
    }
    return true;
  });

  const getChannelCount = (channelId: string) => {
    if (channelId === 'todos') return conversations.length;
    return conversations.filter((c) => c.channel === channelId).length;
  };

  const getChannelMeta = (channelName: string): ChannelConfigItem => {
    return (
      CHANNELS_CATALOG.find((ch) => ch.id === channelName) || {
        id: channelName,
        name: channelName,
        shortLabel: channelName,
        iconTag: channelName.slice(0, 2).toUpperCase(),
        pillActiveBg: 'bg-[#8B5CF6] text-white',
        pillBorder: 'border-white/10',
        badgeBg: 'bg-[#1C1C1E]',
        badgeText: 'text-[#A1A1AA]',
        badgeBorder: 'border-white/10',
        avatarBg: 'bg-[#8B5CF6]',
        avatarText: 'text-white',
      }
    );
  };

  const renderChannelAvatarBadge = (channel: string) => {
    const meta = getChannelMeta(channel);
    const badgeClass = `channel-avatar-badge channel-avatar-badge-${channel.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    return (
      <span
        className={`absolute -bottom-1 -right-1 px-1 min-w-[18px] h-4 rounded-full ${meta.avatarBg} ${meta.avatarText} border-2 border-[#141416] flex items-center justify-center text-[8px] font-black tracking-tighter shadow-sm ${badgeClass}`}
        title={`Canal: ${meta.name}`}
      >
        {meta.iconTag}
      </span>
    );
  };

  const renderChannelChip = (channel: string, compact = false) => {
    const meta = getChannelMeta(channel);
    const channelClass = `channel-chip channel-chip-${channel.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    if (compact) {
      return (
        <span
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder} ${channelClass}`}
        >
          <span className="font-mono text-[8px] opacity-80">{meta.iconTag}</span>
          <span>{meta.shortLabel}</span>
        </span>
      );
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-bold border ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder} ${channelClass}`}
      >
        <span className="px-1 py-0.2 rounded bg-black/40 text-[9px] font-mono font-black">{meta.iconTag}</span>
        <span>{meta.name}</span>
      </span>
    );
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    storageService.sendMessage(selectedConvId, text, 'agent', 'Você (Operador MotorGrid)');

    if (!textToSend) {
      setInputText('');
    }
    setShowEmojiPicker(false);
    setShowAttachMenu(false);
  };

  const handleUpdateSummary = (convId: string, updatedSummary: AttendanceSummary) => {
    storageService.updateConversation(convId, { summary: updatedSummary });
    toast.success('Resumo do atendimento atualizado com sucesso!');
  };

  const handleSimulateVoiceRecording = () => {
    if (isRecordingAudio) {
      setIsRecordingAudio(false);
      storageService.sendMessage(
        selectedConvId,
        '🔊 [Mensagem de Voz - 0:18]',
        'agent',
        'Você (Operador MotorGrid)',
        {
          audioUrl: 'https://actions.google.com/sounds/v1/speech/greeting.ogg',
          audioDuration: '0:18',
          audioTranscription: 'Olá! Enviei a ficha técnica da BMW 320i M Sport e a simulação de financiamento no seu WhatsApp.',
        }
      );
      toast.success('Mensagem de voz enviada com sucesso!');
    } else {
      setIsRecordingAudio(true);
      toast.info('Gravando áudio... Clique novamente no ícone de microfone para enviar.');
    }
  };

  const handleSendAttachment = (type: string, name: string) => {
    setShowAttachMenu(false);
    storageService.sendMessage(
      selectedConvId,
      `📎 [Documento Enviado]: ${name}`,
      'agent',
      'Você (Operador MotorGrid)'
    );
    toast.success(`Anexo enviado: ${name}`);
  };

  const getTemperatureBadge = (temp?: LeadTemperature) => {
    switch (temp) {
      case 'Quente':
        return (
          <span className="badge-temp-quente inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-semibold">
            <Flame className="w-3 h-3 text-rose-400 fill-rose-400" />
            <span className="badge-temp-label">Lead Quente</span>
          </span>
        );
      case 'Morno':
        return (
          <span className="badge-temp-morno inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-semibold">
            <Thermometer className="w-3 h-3 text-amber-400" />
            <span className="badge-temp-label">Lead Morno</span>
          </span>
        );
      default:
        return (
          <span className="badge-temp-frio inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-semibold">
            <Snowflake className="w-3 h-3 text-blue-400" />
            <span className="badge-temp-label">Lead Frio</span>
          </span>
        );
    }
  };

  // Mini simulator calculations
  const carPrice = selectedConv.tracking.vehicleOfInterest?.price || 289900;
  const totalMiniDown = (miniTradeIn ? miniTradeInVal : 0) + miniCashDown;
  const miniFinanced = Math.max(0, carPrice - totalMiniDown);
  const miniRate = miniBank === 'itau' ? 0.0099 : miniBank === 'santander' ? 0.0109 : miniBank === 'bv' ? 0.0115 : 0.0122;

  const calcMiniPmt = (p: number, r: number, n: number) => {
    if (p <= 0) return 0;
    return Math.round((p * r) / (1 - Math.pow(1 + r, -n)));
  };

  const miniPmt48 = calcMiniPmt(miniFinanced, miniRate, 48);
  const miniPmt36 = calcMiniPmt(miniFinanced, miniRate, 36);

  const quickEmojis = ['👍', '❤️', '🔥', '🚗', '👏', '🤝', '✅', '🙏'];

  return (
    <div className="space-y-4">
      
      {/* AI Financing Simulator Modal */}
      <AIFinancingSimulatorModal
        isOpen={isFinancingModalOpen}
        onClose={() => setIsFinancingModalOpen(false)}
        leadName={selectedConv?.contactName}
        leadPhone={selectedConv?.contactPhone}
        leadScore={selectedConv?.leadScore || 92}
        vehicle={selectedConv?.tracking.vehicleOfInterest ? {
          brand: selectedConv.tracking.vehicleOfInterest.brand,
          model: selectedConv.tracking.vehicleOfInterest.model,
          version: selectedConv.tracking.vehicleOfInterest.version,
          year: selectedConv.tracking.vehicleOfInterest.year,
          price: selectedConv.tracking.vehicleOfInterest.price,
          photo: selectedConv.tracking.vehicleOfInterest.photo,
          km: selectedConv.tracking.vehicleOfInterest.km,
        } : undefined}
        onSendToChat={(proposal) => handleSendMessage(proposal)}
      />

      {/* Transfer Chat Modal */}
      <TransferChatModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        leadName={selectedConv?.contactName}
        currentAssignedTo={selectedConv?.assignedTo}
        onTransfer={(targetUser, reason) => {
          const conv = storageService.getConversations().find((c) => c.id === selectedConvId);
          if (conv) {
            storageService.updateConversation(selectedConvId, {
              assignedTo: targetUser.name,
              assignedUserRole: targetUser.role,
              events: [
                ...conv.events,
                {
                  id: `ev-${Date.now()}`,
                  type: 'transferred',
                  title: `Atendimento Transferido para ${targetUser.name}`,
                  description: `Motivo: ${reason}`,
                  timestamp: 'Agora mesmo',
                  authorName: 'Você (Operador)',
                },
              ],
            });

            // Synchronize assignedTo with Leads, CRM Cards, and Dashboard
            const leads = storageService.getLeads();
            const matchedLead = leads.find((l) => l.name === conv.contactName || l.phone === conv.contactPhone);
            if (matchedLead) {
              storageService.updateLead(matchedLead.id, { assignedTo: targetUser.name });
            }

            const cards = storageService.getCrmCards();
            const matchedCard = cards.find((c) => c.contactName === conv.contactName || c.contactPhone === conv.contactPhone);
            if (matchedCard) {
              storageService.updateCrmCard(matchedCard.id, { assignedTo: targetUser.name });
            }

            toast.success(`Atendimento transferido com sucesso para ${targetUser.name}!`);
          }
        }}
      />

      {/* Schedule Appointment Modal */}
      <ScheduleAppointmentModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        defaultContactName={selectedConv?.contactName}
        defaultContactPhone={selectedConv?.contactPhone}
        defaultVehicleName={selectedConv?.tracking.vehicleOfInterest?.model}
        onSchedule={(apt) => {
          // Format date for message
          const [year, month, day] = apt.date.split('-');
          const formattedDateBr = `${day}/${month}/${year}`;
          
          const confirmMsg = `📅 *COMPROMISSO CONFIRMADO — MOTORGRID* 🏁

Olá, *${apt.contactName}*!
Seu agendamento foi registrado com sucesso em nossa agenda VIP:

🏎️ *Compromisso:* ${apt.type}
🚘 *Veículo:* ${apt.vehicleName}
🗓 *Data:* ${formattedDateBr}
⏰ *Horário:* ${apt.time}
🏢 *Showroom:* ${apt.storeUnit}
👤 *Consultor:* ${apt.sellerName}
${apt.notes ? `📝 *Observações:* ${apt.notes}` : ''}

🚗 *Recepção Exclusiva:* Estacionamento e manobrista liberados. Aguardamos sua visita!`;

          // Add to central appointments
          storageService.addAppointment(apt);

          // Update conversation
          const conv = storageService.getConversations().find((c) => c.id === selectedConvId);
          if (conv) {
            const newMsg = {
              id: `msg-${Date.now()}`,
              sender: 'agent' as const,
              senderName: 'Você (Operador)',
              text: confirmMsg,
              timestamp: apt.time,
            };

            storageService.updateConversation(selectedConvId, {
              messages: [...conv.messages, newMsg],
              lastMessage: `📅 ${apt.type} agendado para ${formattedDateBr} às ${apt.time}`,
              lastMessageTime: 'Agora',
              events: [
                ...conv.events,
                {
                  id: `ev-${Date.now()}`,
                  type: 'appointment_created',
                  title: `${apt.type} Agendado para ${formattedDateBr} às ${apt.time}`,
                  description: `Showroom: ${apt.storeUnit}. Vendedor: ${apt.sellerName}`,
                  timestamp: 'Agora mesmo',
                  authorName: 'Você (Operador)',
                },
              ],
            });
          }

          toast.success(`Visita/Test Drive para ${apt.contactName} agendada com sucesso!`);
        }}
      />

      {/* ========================================================================= */}
      {/* 1. FILTRAR POR CANAL NO TOPO (BARRA SUPERIOR HORIZONTAL INTEGRADA) */}
      {/* ========================================================================= */}
      <div id="atendimento-channel-bar" className="w-full flex flex-col md:flex-row md:items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-[#141416] border border-white/10 shadow-sm transition-colors">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B5CF6] flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#8B5CF6]" />
            Filtrar por Canal
          </span>
          {selectedChannel !== 'todos' && (
            <button
              onClick={() => setSelectedChannel('todos')}
              className="text-[10px] text-[#A1A1AA] hover:text-white px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer font-medium"
            >
              <X className="w-3 h-3" />
              Limpar Filtro
            </button>
          )}
        </div>

        {/* Scrollable Channel Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none flex-1 min-w-0">
          {CHANNELS_CATALOG.map((ch) => {
            const isActive = selectedChannel === ch.id;
            const count = getChannelCount(ch.id);
            return (
              <button
                key={ch.id}
                id={`filter-channel-${ch.id.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedChannel(ch.id)}
                className={`channel-filter-pill channel-filter-pill-${ch.id.toLowerCase().replace(/\s+/g, '-')} px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 border ${
                  isActive
                    ? 'channel-filter-active bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-md shadow-[#8B5CF6]/30'
                    : 'channel-filter-inactive bg-[#1C1C1E] text-[#A1A1AA] hover:text-white hover:border-[#8B5CF6]/50 border-white/10'
                }`}
              >
                <span
                  className={`channel-filter-tag channel-filter-tag-${ch.id.toLowerCase().replace(/\s+/g, '-')} px-1.5 py-0.5 rounded text-[9px] font-mono font-black ${
                    isActive ? 'bg-black/30 text-white' : `${ch.badgeBg} ${ch.badgeText}`
                  }`}
                >
                  {ch.iconTag}
                </span>
                <span>{ch.shortLabel}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-black/40 text-white' : 'channel-count-badge bg-[#27272A] text-[#A1A1AA]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ÁREA PRINCIPAL: CONVERSAS | CHAT / ATENDIMENTO | PAINEL CONTEXTUAL DIREITO */}
      {/* ========================================================================= */}
      <div id="atendimento-main-container" className="h-[840px] rounded-2xl border border-white/10 bg-[#101012] overflow-hidden shadow-2xl flex flex-col md:flex-row transition-colors">
        
        {/* ========================================================================= */}
        {/* COLUNA 1: WHATSAPP LEFT CONVERSATION LIST (MOTORGRID THEME) */}
        {/* ========================================================================= */}
        <div id="atendimento-conversations-sidebar" className="w-full md:w-[280px] lg:w-[300px] xl:w-[310px] border-r border-white/10 bg-[#141416] flex flex-col shrink-0 h-full transition-colors">
          
          {/* Header do Chat Sidebar */}
          <div id="atendimento-sidebar-header" className="h-[64px] px-4 bg-[#1C1C1E] flex items-center justify-between border-b border-white/10 shrink-0 transition-colors">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Operador"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#8B5CF6]"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#8B5CF6] border-2 border-[#1C1C1E] rounded-full" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block leading-tight">Camila Rocha</span>
                <span className="atendimento-connected-status text-[11px] text-[#8B5CF6] font-medium flex items-center gap-1">
                  ● Conectada (WhatsApp CRM)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[#A1A1AA]">
              <button
                onClick={() => setUnreadOnly(!unreadOnly)}
                id="btn-sidebar-filter"
                className={`p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer ${
                  unreadOnly ? 'text-[#8B5CF6] bg-[#8B5CF6]/20' : ''
                }`}
                title="Filtrar não lidas"
              >
                <Filter className="w-4 h-4" />
              </button>
              <button
                id="btn-sidebar-calc"
                onClick={() => setIsFinancingModalOpen(true)}
                className="btn-calc-action p-2 rounded-lg bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 text-[#8B5CF6] transition-colors cursor-pointer"
                title="Abrir Simulador Financeiro"
              >
                <Calculator className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Bar & Inbox Filter Tabs */}
          <div id="atendimento-search-section" className="p-3 bg-[#141416] border-b border-white/5 space-y-2.5 transition-colors">
            <div id="atendimento-search-box" className="relative flex items-center bg-[#1C1C1E] border border-white/10 rounded-xl px-3 py-2 focus-within:border-[#8B5CF6] transition-all">
              <Search className="w-4 h-4 text-[#A1A1AA] shrink-0 mr-2.5" />
              <input
                id="input-busca-conversas"
                type="text"
                placeholder="Buscar cliente, carro, canal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-white placeholder-[#A1A1AA] outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-[#A1A1AA] hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter Chips */}
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none text-[11px] w-full">
                {[
                  { id: 'todos', label: `Tudo (${conversations.length})` },
                  { id: 'novos', label: `Novos (${conversations.filter((c) => c.isNewLead || c.status === 'Novo').length})` },
                  { id: 'meus', label: 'Meus Leads' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    id={`filter-inbox-${tab.id}`}
                    onClick={() => setInboxTab(tab.id as any)}
                    className={`inbox-filter-tab flex-1 px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer text-center ${
                      inboxTab === tab.id
                        ? 'inbox-filter-active bg-[#8B5CF6] text-white shadow-sm'
                        : 'inbox-filter-inactive bg-[#1C1C1E] text-[#A1A1AA] hover:text-white hover:bg-[#27272A] border border-white/5'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Conversation List */}
          <div id="atendimento-conversations-list" className="flex-1 overflow-y-auto divide-y divide-white/5 scrollbar-thin transition-colors">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center mx-auto text-[#A1A1AA]">
                  <Filter className="w-6 h-6 text-[#8B5CF6]" />
                </div>
                <div className="text-xs text-white font-bold">Nenhum lead encontrado neste filtro</div>
                <p className="text-[11px] text-[#A1A1AA]">
                  Tente trocar o canal selecionado ({selectedChannel}) ou limpar a busca.
                </p>
                <button
                  onClick={() => {
                    setSelectedChannel('todos');
                    setInboxTab('todos');
                    setSearchQuery('');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#8B5CF6]/20 text-[#8B5CF6] hover:bg-[#8B5CF6]/30 text-xs font-bold transition-all cursor-pointer"
                >
                  Ver Todos os Atendimentos
                </button>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === selectedConvId;
                return (
                  <button
                    key={conv.id}
                    id={`conversation-item-${conv.id}`}
                    onClick={() => {
                      setSelectedConvId(conv.id);
                      setConversations((prev) =>
                        prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
                      );
                    }}
                    className={`conversation-item w-full text-left px-3.5 py-3 transition-all flex items-center gap-3 cursor-pointer relative ${
                      isSelected
                        ? 'conversation-item-selected bg-[#8B5CF6]/15 border-l-4 border-[#8B5CF6]'
                        : 'conversation-item-normal hover:bg-[#1C1C1E] bg-transparent'
                    }`}
                  >
                    {/* Avatar with Channel Badge */}
                    <div className="relative shrink-0">
                      <img
                        src={conv.contactAvatar}
                        alt={conv.contactName}
                        className="w-12 h-12 rounded-full object-cover ring-1 ring-white/10"
                      />
                      {renderChannelAvatarBadge(conv.channel)}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="conversation-contact-name text-sm font-semibold text-white truncate">
                          {conv.contactName}
                        </h4>
                        <span
                          className={`conversation-time text-[11px] font-medium shrink-0 ml-2 ${
                            conv.unreadCount > 0 ? 'text-[#8B5CF6] font-bold' : 'text-[#A1A1AA]'
                          }`}
                        >
                          {conv.lastMessageTime}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <p className="conversation-last-msg text-xs text-[#A1A1AA] truncate flex items-center gap-1 max-w-[200px]">
                          {conv.messages[conv.messages.length - 1]?.sender === 'agent' && (
                            <CheckCheck className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0" />
                          )}
                          <span className="truncate">{conv.lastMessage}</span>
                        </p>

                        {conv.unreadCount > 0 && (
                          <span className="conversation-unread-badge ml-2 min-w-[20px] h-5 px-1.5 rounded-full bg-[#8B5CF6] text-white text-[11px] font-bold flex items-center justify-center shrink-0 shadow-sm">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>

                      {/* Channel, Car & Temperature Badges */}
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        {renderChannelChip(conv.channel, true)}

                        {conv.tracking.vehicleOfInterest && (
                          <span className="conversation-car-chip text-[10px] px-2 py-0.5 rounded-md bg-[#1C1C1E] text-[#A1A1AA] border border-white/5 max-w-[150px] inline-flex items-center gap-1 font-medium shrink-0">
                            <Car className="w-3 h-3 text-[#8B5CF6] shrink-0" />
                            <span className="truncate conversation-car-text font-medium">{conv.tracking.vehicleOfInterest.model}</span>
                          </span>
                        )}
                        {conv.temperature && getTemperatureBadge(conv.temperature)}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COLUNA 2: WHATSAPP CHAT WINDOW (MOTORGRID PALETTE & UX) */}
        {/* ========================================================================= */}
        <div id="atendimento-chat-window" className="flex-1 flex flex-col h-full bg-[#0C0C0E] relative overflow-hidden min-w-0 transition-colors">
          
          {/* Header */}
          <div id="atendimento-chat-header" className="h-[64px] px-4 bg-[#1C1C1E] flex items-center justify-between border-b border-white/10 z-10 shrink-0 transition-colors">
            {/* Informações do Cliente */}
            <div
              className="min-w-0 flex-1 pr-4 cursor-pointer group"
              onClick={() => setShowContactInfo(true)}
              title="Clique para ver o Painel de Ação"
            >
              <h3 className="font-bold text-white text-sm truncate leading-tight group-hover:text-[#8B5CF6] transition-colors">
                {selectedConv.contactName}
              </h3>
              <div className="text-[11px] text-[#A1A1AA] flex items-center gap-1.5 truncate mt-0.5">
                <span className="text-[#8B5CF6] font-semibold">online</span>
                <span>•</span>
                <span>{selectedConv.contactPhone}</span>
                <span>•</span>
                <span className="text-white/70">Resp: {selectedConv.assignedTo}</span>
              </div>
            </div>

            {/* Header Action Buttons: Apenas Agendar e Transferir */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                id="btn-atendimento-agendar"
                onClick={() => setIsScheduleModalOpen(true)}
                className="chat-header-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#27272A] hover:bg-[#323236] text-white text-xs font-semibold transition-all cursor-pointer border border-white/10 shadow-sm"
                title="Agendar Test Drive"
              >
                <Calendar className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>Agendar</span>
              </button>

              <button
                type="button"
                id="btn-atendimento-transferir"
                onClick={() => setIsTransferModalOpen(true)}
                className="chat-header-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#27272A] hover:bg-[#323236] text-white text-xs font-medium transition-all cursor-pointer border border-white/10 shadow-sm"
                title="Transferir conversa"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>Transferir</span>
              </button>

              {!showContactInfo && (
                <button
                  type="button"
                  id="btn-abrir-painel-acao"
                  onClick={() => setShowContactInfo(true)}
                  className="btn-painel-acao-action flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#8B5CF6]/15 hover:bg-[#8B5CF6]/25 text-[#8B5CF6] border border-[#8B5CF6]/30 text-xs font-semibold transition-all cursor-pointer shadow-sm"
                  title="Abrir Painel de Ação"
                >
                  <Zap className="w-3.5 h-3.5 text-[#8B5CF6] btn-painel-acao-icon" />
                  <span className="hidden sm:inline btn-painel-acao-text">Painel de Ação</span>
                </button>
              )}
            </div>
          </div>

          {/* Chat Messages Body with Pattern Background */}
          <div
            id="atendimento-chat-canvas"
            className="atendimento-chat-canvas flex-1 p-4 overflow-y-auto space-y-3.5 relative scrollbar-thin transition-colors"
          >
            {/* E2E Security Pill */}
            <div className="flex justify-center my-1.5">
              <div className="chat-system-pill bg-[#1C1C1E] border border-white/10 text-[#A1A1AA] text-[11px] px-3.5 py-1.5 rounded-lg shadow-sm max-w-md text-center flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                <span>Atendimento WhatsApp integrado ao CRM MotorGrid com inteligência financeira.</span>
              </div>
            </div>

            {/* Date Pill */}
            <div className="flex justify-center my-2">
              <span className="chat-date-pill bg-[#1C1C1E] border border-white/10 text-[#A1A1AA] text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-wider shadow-sm">
                Hoje
              </span>
            </div>

            {/* CRM Timeline Events */}
            {selectedConv.events.map((ev) => (
              <div key={ev.id} className="flex justify-center my-1">
                <div className="chat-crm-event max-w-md w-full px-3 py-2 rounded-lg bg-[#1C1C1E] border border-[#8B5CF6]/30 text-xs shadow-sm space-y-0.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#8B5CF6]">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#8B5CF6]" />
                      {ev.title}
                    </span>
                    <span className="chat-event-time text-[10px] text-[#A1A1AA] font-mono">{ev.timestamp}</span>
                  </div>
                  <p className="chat-event-desc text-[11px] text-white/80">{ev.description}</p>
                </div>
              </div>
            ))}

            {/* Chat Messages */}
            {selectedConv.messages.map((m) => {
              const isMe = m.sender === 'agent';
              const reaction = selectedMessageReaction[m.id];

              return (
                <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group relative`}>
                  
                  {/* WhatsApp Message Bubble styled in MotorGrid */}
                  <div
                    className={`max-w-[88%] sm:max-w-lg p-3 rounded-2xl text-sm relative shadow-md transition-all ${
                      isMe
                        ? 'chat-bubble-agent bg-[#2E1065] text-white border border-[#8B5CF6]/40 rounded-tr-none'
                        : 'chat-bubble-customer bg-[#1C1C1E] text-white border border-white/10 rounded-tl-none'
                    }`}
                  >
                    {!isMe && (
                      <div className="chat-bubble-sender-name text-[11px] font-bold text-[#8B5CF6] mb-1">
                        {m.senderName}
                      </div>
                    )}

                    {/* Audio Note Player */}
                    {m.audioTranscription ? (
                      <div className="space-y-2.5 min-w-[260px] sm:min-w-[300px]">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                            className="w-10 h-10 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer shrink-0 shadow-md shadow-[#8B5CF6]/40"
                          >
                            {isPlayingAudio ? (
                              <Pause className="w-4 h-4 fill-current" />
                            ) : (
                              <Play className="w-4 h-4 fill-current ml-0.5" />
                            )}
                          </button>

                          {/* Sound Waveform */}
                          <div className="flex-1 flex flex-col justify-center gap-1">
                            <div className="flex items-center gap-0.5 h-6">
                              {[35, 60, 95, 45, 80, 100, 30, 70, 90, 50, 75, 40, 85, 60, 30, 90, 45].map(
                                (h, idx) => (
                                  <span
                                    key={idx}
                                    style={{ height: `${h}%` }}
                                    className={`flex-1 rounded-full transition-colors ${
                                      isPlayingAudio && idx < 9 ? 'bg-[#8B5CF6]' : 'bg-white/30'
                                    }`}
                                  />
                                )
                              )}
                            </div>
                            <div className="chat-audio-timing flex items-center justify-between text-[10px] text-[#A1A1AA] font-mono">
                              <span>{isPlayingAudio ? '0:09' : '0:00'}</span>
                              <span>{m.audioDuration || '0:18'}</span>
                            </div>
                          </div>

                          {/* Contact Mic Avatar */}
                          <div className="relative shrink-0">
                            <img
                              src={isMe ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' : selectedConv.contactAvatar}
                              alt="Avatar"
                              className="w-8 h-8 rounded-full object-cover ring-1 ring-white/20"
                            />
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#8B5CF6] rounded-full flex items-center justify-center text-white">
                              <Mic className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>

                        {/* Speed Toggle + Transcrição IA */}
                        <div className="chat-audio-controls pt-2 border-t border-white/10 flex items-center justify-between">
                          <button
                            onClick={() =>
                              setAudioPlaybackSpeed((prev) => (prev === '1x' ? '1.5x' : prev === '1.5x' ? '2x' : '1x'))
                            }
                            className="chat-speed-btn text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors"
                          >
                            {audioPlaybackSpeed}
                          </button>

                          <span className="text-[10px] text-[#8B5CF6] font-semibold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Transcrito via Whisper AI
                          </span>
                        </div>

                        <p className="chat-audio-transcription text-xs text-white/90 italic bg-black/30 p-2.5 rounded-lg border border-white/5">
                          "{m.audioTranscription}"
                        </p>
                      </div>
                    ) : (
                      /* Text Message Body */
                      <p className="chat-message-text text-sm leading-relaxed whitespace-pre-wrap pr-12 pb-1 text-white">
                        {m.text}
                      </p>
                    )}

                    {/* Timestamp & Double Checkmarks */}
                    <div className="chat-message-footer flex items-center justify-end gap-1 text-[11px] text-white/60 float-right -mt-2 ml-2 font-normal select-none">
                      <span>{m.timestamp}</span>
                      {isMe && <CheckCheck className="w-4 h-4 text-[#8B5CF6]" />}
                    </div>

                    {/* Reaction Badge */}
                    {reaction && (
                      <div className="chat-reaction-badge absolute -bottom-2 right-2 bg-[#1C1C1E] border border-white/20 rounded-full px-1.5 py-0.5 text-xs shadow-md">
                        {reaction}
                      </div>
                    )}
                  </div>

                  {/* Floating Message Reactions */}
                  <div className="chat-floating-reactions opacity-0 group-hover:opacity-100 transition-opacity absolute -top-4 flex items-center gap-1 bg-[#1C1C1E] border border-white/20 rounded-full px-2 py-0.5 shadow-xl z-20">
                    {['👍', '❤️', '🔥', '🚗'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() =>
                          setSelectedMessageReaction((prev) => ({
                            ...prev,
                            [m.id]: prev[m.id] === emoji ? '' : emoji,
                          }))
                        }
                        className="hover:scale-125 transition-transform text-xs p-0.5 cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* AI Quick Response Bar (Grid AI Suggestions) */}
          <div id="atendimento-ai-suggestions" className="px-3.5 py-2 bg-[#141416] border-t border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none z-10 transition-colors">
            <span className="text-[#8B5CF6] flex items-center gap-1 shrink-0 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Sugestões IA:
            </span>
            <button
              id="btn-ai-suggestion-calc-financing"
              onClick={() => setIsFinancingModalOpen(true)}
              className="btn-calc-financing-ai px-3 py-1 rounded-lg bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 text-xs text-[#8B5CF6] border border-[#8B5CF6]/40 whitespace-nowrap transition-colors cursor-pointer font-semibold flex items-center gap-1"
            >
              <Calculator className="w-3 h-3 text-[#8B5CF6]" />
              <span>"Calcular Financiamento IA..."</span>
            </button>
            <button
              onClick={() =>
                handleSendMessage(
                  'Olá Marcelo! Com certeza, pegamos seu Jeep Compass 2022 na troca com avaliação técnica no showroom de Alphaville. Podemos agendar hoje às 15h?'
                )
              }
              className="chat-ai-suggestion-btn px-3 py-1 rounded-lg bg-[#1C1C1E] hover:bg-[#27272A] text-xs text-white border border-white/10 whitespace-nowrap transition-colors cursor-pointer"
            >
              "Pegamos o Compass 2022 na troca..."
            </button>
            <button
              onClick={() =>
                handleSendMessage(
                  'Consigo segurar a BMW 320i M Sport reservada para você com condição de taxa especial 0,99% a.m. até amanhã.'
                )
              }
              className="chat-ai-suggestion-btn px-3 py-1 rounded-lg bg-[#1C1C1E] hover:bg-[#27272A] text-xs text-white border border-white/10 whitespace-nowrap transition-colors cursor-pointer"
            >
              "Taxa especial 0,99% a.m..."
            </button>
          </div>

          {/* ========================================================================= */}
          {/* CHAT COMPOSER INPUT BAR */}
          {/* ========================================================================= */}
          <div id="atendimento-composer-container" className="p-3.5 bg-[#1C1C1E] border-t border-white/10 relative z-20 transition-colors">
            
            {/* Emoji Picker Popover */}
            {showEmojiPicker && (
              <div id="atendimento-emoji-popover" className="chat-popover absolute bottom-16 left-4 bg-[#1C1C1E] border border-white/15 rounded-2xl p-3 shadow-2xl z-30 grid grid-cols-4 gap-2">
                {quickEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setInputText((prev) => prev + emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="text-xl p-2 hover:bg-[#27272A] rounded-xl transition-colors cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {/* Attachments Menu Popover */}
            {showAttachMenu && (
              <div id="atendimento-attach-popover" className="chat-popover absolute bottom-16 left-12 bg-[#1C1C1E] border border-white/15 rounded-2xl p-3 shadow-2xl z-30 space-y-1.5 w-64">
                <button
                  type="button"
                  id="btn-attach-financing-simulator"
                  onClick={() => {
                    setShowAttachMenu(false);
                    setIsFinancingModalOpen(true);
                  }}
                  className="btn-calc-financing-ai w-full flex items-center gap-3 p-2.5 rounded-xl bg-[#8B5CF6]/15 hover:bg-[#8B5CF6]/25 border border-[#8B5CF6]/30 text-xs text-white transition-colors cursor-pointer"
                >
                  <span className="p-2 rounded-lg bg-[#8B5CF6] text-white">
                    <Calculator className="w-4 h-4" />
                  </span>
                  <div className="text-left">
                    <span className="font-bold block">Simulador de Financiamento IA</span>
                    <span className="text-[10px] text-[#A1A1AA]">Itaú, Santander, BV &amp; PAN</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendAttachment('document', 'Ficha_Tecnica_BMW_320i_M_Sport.pdf')}
                  className="chat-popover-item w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#27272A] text-xs text-white transition-colors cursor-pointer"
                >
                  <span className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <FileText className="w-4 h-4" />
                  </span>
                  <span>Ficha Técnica (PDF)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendAttachment('image', 'Fotos_Showroom_BMW_320i.jpg')}
                  className="chat-popover-item w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#27272A] text-xs text-white transition-colors cursor-pointer"
                >
                  <span className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <ImageIcon className="w-4 h-4" />
                  </span>
                  <span>Fotos e Vídeos HD</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendAttachment('location', 'Localizacao_Showroom_Alphaville.map')}
                  className="chat-popover-item w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#27272A] text-xs text-white transition-colors cursor-pointer"
                >
                  <span className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <span>Localização do Showroom</span>
                </button>
              </div>
            )}

            {/* Input Row */}
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2">
              {/* Emoji Icon */}
              <button
                type="button"
                id="btn-atendimento-emoji"
                onClick={() => {
                  setShowEmojiPicker(!showEmojiPicker);
                  setShowAttachMenu(false);
                }}
                className={`chat-action-icon-btn p-2 rounded-xl text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors cursor-pointer ${
                  showEmojiPicker ? 'text-[#8B5CF6] bg-[#8B5CF6]/20' : ''
                }`}
                title="Emojis"
              >
                <Smile className="w-6 h-6" />
              </button>

              {/* Attachment Clip */}
              <button
                type="button"
                id="btn-atendimento-anexo"
                onClick={() => {
                  setShowAttachMenu(!showAttachMenu);
                  setShowEmojiPicker(false);
                }}
                className={`chat-action-icon-btn p-2 rounded-xl text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors cursor-pointer ${
                  showAttachMenu ? 'text-[#8B5CF6] bg-[#8B5CF6]/20' : ''
                }`}
                title="Anexar arquivos ou Simulação"
              >
                <Paperclip className="w-6 h-6" />
              </button>

              {/* Input or Voice Recording Indicator */}
              {isRecordingAudio ? (
                <div className="flex-1 flex items-center justify-between bg-[#101012] px-4 py-2.5 rounded-xl border border-rose-500/40">
                  <div className="flex items-center gap-2 text-rose-400 animate-pulse text-xs font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span>Gravando áudio: {recordingSeconds}s</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsRecordingAudio(false)}
                    className="text-xs text-[#A1A1AA] hover:text-white"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <input
                  id="atendimento-message-input"
                  type="text"
                  placeholder="Digite uma mensagem ou envie uma proposta..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="chat-composer-input flex-1 px-4 py-2.5 text-sm rounded-xl bg-[#101012] text-white placeholder-[#A1A1AA] border border-white/10 focus:border-[#8B5CF6] focus:outline-none transition-all"
                />
              )}

              {/* Mic / Send Button */}
              {inputText.trim() ? (
                <button
                  type="submit"
                  id="atendimento-send-message-btn"
                  className="p-2.5 rounded-xl bg-[#8B5CF6] text-white hover:bg-[#7C3AED] transition-all cursor-pointer shadow-lg shadow-[#8B5CF6]/30 flex items-center justify-center shrink-0"
                >
                  <Send className="w-5 h-5 ml-0.5" />
                </button>
              ) : (
                <button
                  type="button"
                  id="atendimento-voice-message-btn"
                  onClick={handleSimulateVoiceRecording}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center shrink-0 ${
                    isRecordingAudio
                      ? 'bg-rose-500 text-white animate-bounce'
                      : 'bg-[#8B5CF6] text-white hover:bg-[#7C3AED]'
                  }`}
                  title={isRecordingAudio ? 'Parar e Enviar Áudio' : 'Gravar Mensagem de Voz'}
                >
                  <Mic className="w-5 h-5" />
                </button>
              )}
            </form>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COLUNA 3: PAINEL CONTEXTUAL DO ATENDIMENTO / PAINEL DE AÇÃO DO VENDEDOR */}
        {/* ========================================================================= */}
        {showContactInfo && (
          <div id="atendimento-context-panel" className="w-full md:w-[280px] lg:w-[300px] xl:w-[320px] border-l border-white/10 bg-[#141416] flex flex-col shrink-0 h-full overflow-y-auto scrollbar-thin transition-colors">
            
            {/* Header do Painel Lateral */}
            <div id="atendimento-context-header" className="h-[64px] px-3.5 bg-[#1C1C1E] flex items-center justify-between border-b border-white/10 shrink-0 transition-colors">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  type="button"
                  id="btn-voltar-atendimento"
                  onClick={() => setShowContactInfo(false)}
                  className="btn-retorno-action p-1.5 rounded-lg bg-[#27272A] hover:bg-[#8B5CF6]/20 text-[#A1A1AA] hover:text-[#8B5CF6] border border-white/10 hover:border-[#8B5CF6]/40 transition-all cursor-pointer shadow-sm shrink-0 group"
                  title="Voltar ao atendimento"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                </button>

                <span id="badge-context-painel-acao" className="badge-painel-acao-icon p-1.5 rounded-lg bg-[#8B5CF6]/20 text-[#8B5CF6] shrink-0">
                  <Zap className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block leading-tight truncate">Painel de Ação</span>
                  <span className="text-[10px] text-[#A1A1AA] block truncate">Contexto do Atendimento</span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  id="btn-context-ai-simulator"
                  onClick={() => setIsFinancingModalOpen(true)}
                  className="btn-ai-sparkle-action p-1.5 rounded-lg hover:bg-[#8B5CF6]/20 text-[#8B5CF6] transition-colors cursor-pointer"
                  title="Abrir Simulador IA Completo"
                >
                  <Sparkles className="w-4 h-4 btn-ai-sparkle-icon" />
                </button>
                <button
                  type="button"
                  id="btn-context-close"
                  onClick={() => setShowContactInfo(false)}
                  className="btn-context-close-action p-1.5 rounded-lg hover:bg-white/10 text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
                  title="Ocultar Painel Lateral"
                >
                  <X className="w-4 h-4 btn-context-close-icon" />
                </button>
              </div>
            </div>

            {/* Corpo do Painel Lateral: Hierarquia dos 5 Cards */}
            <div className="p-3 space-y-3">
              
              {/* ------------------------------------------------------------- */}
              {/* 1. FOTO E INFORMAÇÕES DO VEÍCULO DE INTERESSE & CONTATO */}
              {/* ------------------------------------------------------------- */}
              <div id="card-context-vehicle" className="context-card p-3 bg-[#1C1C1E] border border-white/10 rounded-xl space-y-2.5 shadow-sm transition-colors">
                <div className="flex items-center justify-between text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">
                  <span className="flex items-center gap-1 text-white">
                    <Car className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    Veículo de Interesse
                  </span>
                  {renderChannelChip(selectedConv.channel, true)}
                </div>

                {/* Foto do Veículo com Preço em destaque */}
                <div className="relative h-28 w-full rounded-lg overflow-hidden border border-white/10 bg-[#101012]">
                  <img
                    src={selectedConv.tracking.vehicleOfInterest?.photo || 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&auto=format&fit=crop&q=80'}
                    alt={selectedConv.tracking.vehicleOfInterest?.model || 'Veículo'}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <span className="context-car-price-badge absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/85 text-[#8B5CF6] font-extrabold text-xs border border-[#8B5CF6]/40 shadow-md">
                    R$ {carPrice.toLocaleString('pt-BR')}
                  </span>
                </div>

                {/* Dados do Carro */}
                <div className="space-y-1.5">
                  <div>
                    <h4 className="font-bold text-white text-xs leading-tight">
                      {selectedConv.tracking.vehicleOfInterest?.brand || 'Toyota'}{' '}
                      {selectedConv.tracking.vehicleOfInterest?.model || 'Corolla XEi 2.0 DirectShift'}
                    </h4>
                    <p className="text-[10px] text-[#A1A1AA] truncate">
                      {selectedConv.tracking.vehicleOfInterest?.version || '2.0 16V Flex DirectShift'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[10px] text-white">
                    <div className="context-mini-spec p-1.5 rounded-lg bg-[#101012] border border-white/5 flex items-center justify-between">
                      <span className="text-[#A1A1AA]">Ano:</span>
                      <span className="font-bold">{selectedConv.tracking.vehicleOfInterest?.year || '2024'}</span>
                    </div>
                    <div className="context-mini-spec p-1.5 rounded-lg bg-[#101012] border border-white/5 flex items-center justify-between">
                      <span className="text-[#A1A1AA]">Km:</span>
                      <span className="font-bold">
                        {(selectedConv.tracking.vehicleOfInterest?.km || 42000).toLocaleString('pt-BR')} km
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#A1A1AA] pt-1 border-t border-white/5">
                    <span className="truncate">📍 {selectedConv.tracking.vehicleOfInterest?.store || 'Alphaville Matriz'}</span>
                    {selectedConv.temperature && getTemperatureBadge(selectedConv.temperature)}
                  </div>
                </div>

                {/* Mini Contato e Ações Rápidas */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={selectedConv.contactAvatar}
                      alt={selectedConv.contactName}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold text-white block truncate">{selectedConv.contactName}</span>
                      <span className="text-[9px] text-[#A1A1AA] block font-mono">{selectedConv.contactPhone}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      id="btn-context-phone"
                      className="context-quick-btn p-1.5 rounded-lg bg-[#27272A] hover:bg-[#323236] text-white transition-colors cursor-pointer"
                      title="Ligar para Cliente"
                    >
                      <Phone className="w-3 h-3 text-[#A1A1AA]" />
                    </button>
                    <button
                      id="btn-context-calendar"
                      onClick={() => setIsScheduleModalOpen(true)}
                      className="btn-calendar-action p-1.5 rounded-lg bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 text-[#8B5CF6] transition-colors cursor-pointer"
                      title="Agendar Visita / Test Drive"
                    >
                      <Calendar className="w-3 h-3" />
                    </button>
                    <button
                      id="btn-context-calc"
                      onClick={() => setIsFinancingModalOpen(true)}
                      className="btn-calc-action context-quick-btn p-1.5 rounded-lg bg-[#27272A] hover:bg-[#323236] text-white transition-colors cursor-pointer"
                      title="Simular Financiamento"
                    >
                      <Calculator className="w-3 h-3 text-[#8B5CF6]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* 2. RESUMO DO ATENDIMENTO (IA + EDIÇÃO MANUAL + PRÓXIMA AÇÃO) */}
              {/* ------------------------------------------------------------- */}
              <LeadAttendanceSummaryCard
                conversation={selectedConv}
                onUpdateSummary={handleUpdateSummary}
                onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
                onOpenFinancingModal={() => setIsFinancingModalOpen(true)}
                onSendMessage={handleSendMessage}
              />

              {/* ------------------------------------------------------------- */}
              {/* 3. FILA DE ATENDIMENTO */}
              {/* ------------------------------------------------------------- */}
              <div id="card-context-queue" className="context-card p-3 rounded-xl bg-[#1C1C1E] border border-white/10 flex items-center justify-between shadow-sm transition-colors">
                <div>
                  <div className="text-[11px] font-semibold text-[#A1A1AA] flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    Fila de Atendimento
                  </div>
                  <div className="text-base font-bold text-white mt-0.5">8 aguardando</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ● SLA médio: 1.8 min
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30 shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* 3. LEADS QUENTES (ALTA INTENÇÃO) */}
              {/* ------------------------------------------------------------- */}
              <div id="card-context-hotleads" className="context-card p-3 rounded-xl bg-[#1C1C1E] border border-white/10 flex items-center justify-between shadow-sm transition-colors">
                <div>
                  <div className="text-[11px] font-semibold text-[#A1A1AA] flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                    Leads Quentes <span className="text-[9px] text-rose-400 font-bold">(Alta Intenção)</span>
                  </div>
                  <div className="text-base font-bold text-rose-400 mt-0.5">5 oportunidades</div>
                  <div className="text-[10px] text-[#A1A1AA] mt-0.5 flex items-center gap-1">
                    <span>Grid Score &gt; 85 pts</span>
                    <span className="text-[#8B5CF6] font-semibold">({selectedConv.leadScore || 92} pts)</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* 4. TEST DRIVES AGENDADOS HOJE */}
              {/* ------------------------------------------------------------- */}
              <div
                id="card-context-testdrives"
                onClick={() => setIsScheduleModalOpen(true)}
                className="context-card p-3 rounded-xl bg-[#1C1C1E] border border-white/10 hover:border-[#8B5CF6]/40 flex items-center justify-between shadow-sm cursor-pointer transition-all hover:bg-[#232326] group"
              >
                <div>
                  <div className="text-[11px] font-semibold text-[#A1A1AA] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    Test Drives Agendados Hoje
                  </div>
                  <div className="text-base font-bold text-[#8B5CF6] mt-0.5 group-hover:text-purple-300 transition-colors">
                    4 visitas VIP
                  </div>
                  <div className="text-[10px] text-[#A1A1AA] mt-0.5">Lembretes WhatsApp ativos</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30 shrink-0 group-hover:scale-105 transition-transform">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* 5. SIMULADOR FINANCIAMENTO IA */}
              {/* ------------------------------------------------------------- */}
              <div
                id="card-context-simulator-banner"
                onClick={() => setIsFinancingModalOpen(true)}
                className="p-3 rounded-xl bg-gradient-to-br from-[#1C1C1E] via-[#23202E] to-[#1C1C1E] border border-[#8B5CF6]/50 hover:border-[#8B5CF6] flex items-center justify-between shadow-lg cursor-pointer transition-all hover:scale-[1.01] group"
              >
                <div>
                  <div className="text-[11px] font-bold text-[#8B5CF6] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    Simulador Financiamento IA
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5 group-hover:text-[#8B5CF6] transition-colors">
                    Simular em 1 Clique
                  </div>
                  <div className="text-[10px] text-[#A1A1AA] mt-0.5">Itaú, Santander, BV &amp; PAN</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/40 shrink-0 group-hover:rotate-6 transition-transform">
                  <Calculator className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
