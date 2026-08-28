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
  ShieldAlert,
  Radio,
  SlidersHorizontal,
} from 'lucide-react';
import { ChatConversation, ChatMessage } from '../../types';

interface AtendimentoViewProps {
  onOpenNewLead?: () => void;
}

const initialConversations: ChatConversation[] = [
  {
    id: 'chat-1',
    clientName: 'Marcos Vinícius',
    clientCompany: 'Logística TransBrasil',
    clientPhone: '(11) 99882-1144',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    channel: 'WhatsApp',
    status: 'Em Atendimento',
    assignedTo: 'Ana Luísa',
    lastMessage: 'Recebemos o alerta de temperatura do motor no Scania R450 (Placa BRA2E19). Já acionamos o motorista.',
    lastMessageTime: '10:42',
    unreadCount: 2,
    vehiclePlate: 'BRA-2E19 (Scania R450)',
    telemetryAlert: 'Temperatura Alta: 103°C no motor',
    messages: [
      {
        id: 'm1',
        sender: 'bot',
        senderName: 'MotorGrid Alert Bot',
        text: '🚨 [ALERTA DE TELEMETRIA] O caminhão Scania R450 (BRA-2E19) registrou 103°C no líquido de arrefecimento na BR-116 KM 240.',
        timestamp: '10:38',
      },
      {
        id: 'm2',
        sender: 'client',
        senderName: 'Marcos Vinícius',
        text: 'Bom dia equipe MotorGrid! Conseguem verificar se a rotação do motor também subiu antes desse alerta?',
        timestamp: '10:40',
      },
      {
        id: 'm3',
        sender: 'agent',
        senderName: 'Ana Luísa (MotorGrid)',
        text: 'Olá Marcos! Analisando o barramento CAN agora. O veículo esteve a 2.400 RPM em subida de serra por 8 minutos contínuos. A velocidade média foi de 78 km/h. Sugerimos orientar o condutor a reduzir a marcha.',
        timestamp: '10:41',
      },
      {
        id: 'm4',
        sender: 'client',
        senderName: 'Marcos Vinícius',
        text: 'Recebemos o alerta de temperatura do motor no Scania R450 (Placa BRA2E19). Já acionamos o motorista.',
        timestamp: '10:42',
      },
    ],
  },
  {
    id: 'chat-2',
    clientName: 'Dra. Vanessa Meireles',
    clientCompany: 'Ambulâncias & Resgate Vida',
    clientPhone: '(21) 98711-4500',
    clientAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    channel: 'Telemetria SOS',
    status: 'Em Atendimento',
    assignedTo: 'Rodrigo Mendes',
    lastMessage: 'Gostaria de homologar mais 12 ambulâncias Mercedes Sprinter no plano Enterprise.',
    lastMessageTime: '09:15',
    unreadCount: 1,
    vehiclePlate: 'RIO-9912 (Mercedes Sprinter)',
    messages: [
      {
        id: 'm21',
        sender: 'client',
        senderName: 'Dra. Vanessa',
        text: 'Bom dia! O sistema de cercas virtuais dos hospitais funcionou perfeitamente no plantão noturno.',
        timestamp: '09:10',
      },
      {
        id: 'm22',
        sender: 'client',
        senderName: 'Dra. Vanessa',
        text: 'Gostaria de homologar mais 12 ambulâncias Mercedes Sprinter no plano Enterprise.',
        timestamp: '09:15',
      },
    ],
  },
  {
    id: 'chat-3',
    clientName: 'Eduardo Faria',
    clientCompany: 'Locadora MovPrime Car',
    clientPhone: '(31) 99123-7788',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    channel: 'WhatsApp',
    status: 'Aberto',
    assignedTo: 'Não atribuído',
    lastMessage: 'Como faço para configurar o corte de ignição via app em caso de quebra de geofence?',
    lastMessageTime: '08:50',
    unreadCount: 3,
    vehiclePlate: 'FROTA-104 (Jeep Renegade)',
    messages: [
      {
        id: 'm31',
        sender: 'client',
        senderName: 'Eduardo Faria',
        text: 'Como faço para configurar o corte de ignição via app em caso de quebra de geofence?',
        timestamp: '08:50',
      },
    ],
  },
  {
    id: 'chat-4',
    clientName: 'Cláudio Albuquerque',
    clientCompany: 'AgroSafra Grãos do Cerrado',
    clientPhone: '(65) 99933-2211',
    clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    channel: 'WebChat',
    status: 'Resolvido',
    assignedTo: 'Felipe Santos',
    lastMessage: 'Perfeito, os sensores de colheitadeira John Deere já estão sincronizados.',
    lastMessageTime: 'Ontem',
    unreadCount: 0,
    vehiclePlate: 'MAQ-4490 (John Deere S790)',
    messages: [
      {
        id: 'm41',
        sender: 'client',
        senderName: 'Cláudio Albuquerque',
        text: 'Perfeito, os sensores de colheitadeira John Deere já estão sincronizados.',
        timestamp: 'Ontem 16:30',
      },
    ],
  },
];

export const AtendimentoView: React.FC<AtendimentoViewProps> = () => {
  const [conversations, setConversations] = useState<ChatConversation[]>(initialConversations);
  const [selectedChatId, setSelectedChatId] = useState<string>('chat-1');
  const [inputText, setInputText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [channelFilter, setChannelFilter] = useState<string>('all');

  const selectedChat = conversations.find((c) => c.id === selectedChatId) || conversations[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'agent',
      senderName: 'Você (MotorGrid Operator)',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedChatId) {
          return {
            ...c,
            lastMessage: inputText,
            lastMessageTime: 'Agora',
            status: 'Em Atendimento',
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

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.clientName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.clientCompany.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesChannel = channelFilter === 'all' || c.channel === channelFilter;
    return matchesSearch && matchesChannel;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-400">Atendimentos Ativos</div>
            <div className="text-2xl font-bold text-white mt-1">14 conversas</div>
            <div className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1">
              <span>● Tempo de resposta: 42s</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[#8B5CF6]/30">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-400">Alertas de Telemetria SOS</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">3 em curso</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Disparo automático CAN-Bus</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-400">Canal WhatsApp Oficial</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">Conectado</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Webhook Meta API v21.0</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Phone className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-400">Satisfação CSAT</div>
            <div className="text-2xl font-bold text-white mt-1">98.4%</div>
            <div className="text-[11px] text-[#A78BFA] mt-0.5">+4.2% este mês</div>
          </div>
          <div className="p-3 rounded-xl bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[#8B5CF6]/30">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Chat Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px] rounded-2xl border border-zinc-800/80 bg-[#141416] overflow-hidden shadow-2xl">
        {/* Left Side: Conversations List */}
        <div className="lg:col-span-4 border-r border-zinc-800 bg-[#1C1C1E]/60 flex flex-col h-full">
          {/* Header & Search */}
          <div className="p-4 border-b border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#A78BFA]" />
                <span>Central de Atendimento</span>
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#DDD6FE] border border-[#8B5CF6]/30 font-semibold font-mono">
                {conversations.length} canais
              </span>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar cliente, placa ou mensagem..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white placeholder-zinc-500 outline-none transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              {['all', 'WhatsApp', 'Telemetria SOS', 'WebChat'].map((channel) => (
                <button
                  key={channel}
                  onClick={() => setChannelFilter(channel)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                    channelFilter === channel
                      ? 'bg-[#8B5CF6] text-white font-semibold shadow-sm shadow-[#8B5CF6]/30'
                      : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
                  }`}
                >
                  {channel === 'all' ? 'Todos' : channel}
                </button>
              ))}
            </div>
          </div>

          {/* List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/50">
            {filteredConversations.map((c) => {
              const isSelected = c.id === selectedChatId;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedChatId(c.id)}
                  className={`w-full text-left p-3.5 transition-colors flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-[#241A35] border-l-4 border-[#C4B5FD]'
                      : 'hover:bg-zinc-800/40'
                  }`}
                >
                  {c.clientAvatar ? (
                    <img
                      src={c.clientAvatar}
                      alt={c.clientName}
                      className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-[#8B5CF6]/30"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/20 text-[#C4B5FD] flex items-center justify-center font-bold text-sm shrink-0">
                      {c.clientName.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate">{c.clientName}</h4>
                      <span className="text-[10px] text-zinc-400">{c.lastMessageTime}</span>
                    </div>

                    <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {c.clientCompany}
                    </div>

                    <p className="text-[11px] text-zinc-300 truncate mt-1">
                      {c.lastMessage}
                    </p>

                    <div className="flex items-center gap-1.5 mt-2">
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-semibold border ${
                          c.channel === 'WhatsApp'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : c.channel === 'Telemetria SOS'
                            ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                            : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                        }`}
                      >
                        {c.channel}
                      </span>

                      {c.vehiclePlate && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 font-mono truncate max-w-[120px]">
                          {c.vehiclePlate.split(' ')[0]}
                        </span>
                      )}

                      {c.unreadCount > 0 && (
                        <span className="ml-auto text-[10px] px-1.5 py-0.2 rounded-full bg-[#8B5CF6] text-white font-bold">
                          {c.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Chat Window */}
        <div className="lg:col-span-8 flex flex-col h-full bg-[#0D0D0E]">
          {/* Active Chat Header */}
          <div className="px-6 py-3.5 border-b border-zinc-800 bg-[#1C1C1E] flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedChat.clientAvatar ? (
                <img
                  src={selectedChat.clientAvatar}
                  alt={selectedChat.clientName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#8B5CF6]/40"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/20 text-[#C4B5FD] flex items-center justify-center font-bold text-sm">
                  {selectedChat.clientName.slice(0, 2).toUpperCase()}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm">{selectedChat.clientName}</h3>
                  <span className="text-[10px] px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                    {selectedChat.status}
                  </span>
                </div>
                <div className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5">
                  <span>{selectedChat.clientCompany}</span>
                  <span>•</span>
                  <span>{selectedChat.clientPhone}</span>
                </div>
              </div>
            </div>

            {selectedChat.vehiclePlate && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0A0A0B] border border-[#8B5CF6]/30">
                <Car className="w-4 h-4 text-[#A78BFA]" />
                <span className="text-xs font-mono text-white">{selectedChat.vehiclePlate}</span>
              </div>
            )}
          </div>

          {/* Telemetry Alert Banner if present */}
          {selectedChat.telemetryAlert && (
            <div className="px-6 py-2 bg-amber-500/10 border-b border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="font-semibold">{selectedChat.telemetryAlert}</span>
              </div>
              <span className="text-[10px] font-mono text-amber-200/80">Código OBD: P0118 Engine Coolant</span>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {selectedChat.messages.map((m) => {
              const isMe = m.sender === 'agent';
              const isBot = m.sender === 'bot';

              if (isBot) {
                return (
                  <div key={m.id} className="flex justify-center my-2">
                    <div className="max-w-md p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs shadow-md space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-300">
                        <Bot className="w-3.5 h-3.5" />
                        <span>{m.senderName}</span>
                        <span className="text-[10px] text-amber-400/70 ml-auto font-mono">{m.timestamp}</span>
                      </div>
                      <p className="leading-relaxed">{m.text}</p>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={m.id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-lg p-3.5 rounded-2xl text-xs space-y-1 ${
                      isMe
                        ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white rounded-br-none shadow-lg shadow-[#8B5CF6]/20'
                        : 'bg-[#1C1C1E] border border-zinc-700/80 text-zinc-200 rounded-bl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 font-semibold text-[11px] opacity-80">
                      <span>{m.senderName}</span>
                      <span className="font-mono text-[10px]">{m.timestamp}</span>
                    </div>
                    <p className="leading-relaxed text-sm">{m.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Quick Response Suggestions */}
          <div className="px-6 py-2 bg-[#141416] border-t border-zinc-800/80 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-zinc-400 flex items-center gap-1 shrink-0 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#C4B5FD]" />
              Sugestões IA:
            </span>
            <button
              onClick={() =>
                handleSendAiSuggestion(
                  'Verifiquei na telemetria: a pressão dos pneus e rotação do motor normalizaram nos últimos 5 minutos.'
                )
              }
              className="px-2.5 py-1 rounded-lg bg-[#8B5CF6]/15 hover:bg-[#8B5CF6]/30 text-[#DDD6FE] border border-[#8B5CF6]/30 truncate cursor-pointer transition-colors"
            >
              "Telemetria normalizada nos últimos 5 min"
            </button>
            <button
              onClick={() =>
                handleSendAiSuggestion(
                  'Vou emitir a proposta comercial com os 12 novos rastreadores OBD-II com instalação inclusa.'
                )
              }
              className="px-2.5 py-1 rounded-lg bg-[#8B5CF6]/15 hover:bg-[#8B5CF6]/30 text-[#DDD6FE] border border-[#8B5CF6]/30 truncate cursor-pointer transition-colors"
            >
              "Emitir proposta para 12 rastreadores"
            </button>
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-800 bg-[#1C1C1E] flex items-center gap-3">
            <input
              id="atendimento-chat-input"
              type="text"
              placeholder="Digite sua resposta técnica ou orientação ao frotista..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 text-sm rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white placeholder-zinc-500 outline-none transition-colors"
            />
            <button
              type="submit"
              id="atendimento-send-btn"
              className="p-2.5 rounded-xl bg-[#C4B5FD] hover:bg-[#DDD6FE] text-[#2E1065] font-bold shadow-md shadow-[#8B5CF6]/20 transition-all cursor-pointer flex items-center justify-center shrink-0"
              title="Enviar mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
