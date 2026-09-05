import React, { useState } from 'react';
import { X, Send, Users, CheckCircle2, MessageSquare } from 'lucide-react';

interface CreateBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (campaign: { name: string; segment: string; message: string; scheduledTime: string }) => void;
}

export const CreateBroadcastModal: React.FC<CreateBroadcastModalProps> = ({
  isOpen,
  onClose,
  onSend,
}) => {
  const [name, setName] = useState('');
  const [segment, setSegment] = useState('Leads Quentes sem Agendamento (42 contatos)');
  const [message, setMessage] = useState(
    'Olá [Nome]! Especialmente nesta semana, nossa concessionária está com condição exclusiva de IPVA 2026 Grátis e taxa reduzida de 0,99% a.m. para o modelo que você consultou. Posso enviar a simulação atualizada?'
  );
  const [scheduledTime, setScheduledTime] = useState('Imediato (Agora)');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setError('Por favor preencha o nome da campanha e a mensagem.');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      onSend({ name, segment, message, scheduledTime });
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl bg-[#141416] border border-zinc-800 p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          disabled={isSending}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Nova Transmissão / Campanha WhatsApp</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Dispare mensagens segmentadas em lote para a base</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Nome da Campanha *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Oferta Relâmpago BMW &amp; Porsche"
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Segmento Alvo *</label>
            <select
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
            >
              <option value="Leads Quentes sem Agendamento (42 contatos)">
                Leads Quentes sem Agendamento (42 contatos)
              </option>
              <option value="Leads com Veículo Usado na Troca (68 contatos)">
                Leads com Veículo Usado na Troca (68 contatos)
              </option>
              <option value="Clientes em Renovação de Frota (19 contatos)">
                Clientes em Renovação de Frota (19 contatos)
              </option>
              <option value="Perdidos por Taxa / Preço nos últimos 60 dias (31 contatos)">
                Perdidos por Taxa / Preço nos últimos 60 dias (31 contatos)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Texto da Mensagem *</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none font-sans"
            />
            <span className="text-[10px] text-zinc-500">Tag disponível: [Nome] será substituído pelo primeiro nome do lead.</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Horário de Disparo</label>
            <select
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
            >
              <option value="Imediato (Agora)">Imediato (Agora)</option>
              <option value="Hoje às 18:00 (Pico de Engajamento)">Hoje às 18:00 (Pico de Engajamento)</option>
              <option value="Amanhã às 09:30">Amanhã às 09:30</option>
            </select>
          </div>

          {error && <div className="text-xs text-rose-400">{error}</div>}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSending}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Processando fila...' : 'Iniciar Disparo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
