import React, { useState } from 'react';
import { X, UserCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import { initialAuthUsers } from '../../data/mockData';
import { AuthUser } from '../../types';

interface TransferChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (targetUser: AuthUser, reason: string) => void;
  currentAssignedTo?: string;
  leadName?: string;
}

export const TransferChatModal: React.FC<TransferChatModalProps> = ({
  isOpen,
  onClose,
  onTransfer,
  currentAssignedTo,
  leadName = 'Lead',
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string>('usr-2');
  const [reason, setReason] = useState<string>('Lead qualificado e pronto para visita ao showroom.');
  const [notifyWhatsApp, setNotifyWhatsApp] = useState<boolean>(true);

  if (!isOpen) return null;

  const targetUser = initialAuthUsers.find((u) => u.id === selectedUserId) || initialAuthUsers[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetUser) {
      onTransfer(targetUser, reason);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div role="dialog" className="modal-container modal-card w-full max-w-lg bg-[#141416] border border-[#8B5CF6]/30 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 bg-[#1C1C1E] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/30">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Transferir Atendimento</h3>
              <p className="text-xs text-zinc-400">Transbordo de {leadName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 rounded-xl bg-[#1C1C1E] border border-zinc-800/80 text-xs text-zinc-300 flex items-center justify-between">
            <div>
              <span className="text-zinc-400 block text-[11px]">Responsável Atual:</span>
              <span className="font-bold text-white">{currentAssignedTo || 'Camila Rocha (SDR)'}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#A78BFA]" />
            <div className="text-right">
              <span className="text-zinc-400 block text-[11px]">Novo Destinatário:</span>
              <span className="font-bold text-[#C4B5FD]">{targetUser.name}</span>
            </div>
          </div>

          {/* Select User */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Selecione o Vendedor ou Equipe de Destino *
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {initialAuthUsers.map((user) => {
                const isSelected = user.id === selectedUserId;
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setSelectedUserId(user.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#25193A] border-[#8B5CF6] text-white shadow-md'
                        : 'bg-[#1C1C1E] border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-[#8B5CF6]/40"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs truncate">{user.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-[#C4B5FD] font-mono">
                          {user.role}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-2">
                        <span>{user.team}</span>
                        <span>•</span>
                        <span className="text-emerald-400">Tempo méd: {user.avgResponseTimeMin || '2.1'} min</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Motivo da Transferência / Observação Comercial *
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Lead quer avaliar Compass 2022 na troca pelo BMW 320i hoje à tarde."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white placeholder-zinc-500 outline-none transition-colors"
            />
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              id="notify-whatsapp"
              checked={notifyWhatsApp}
              onChange={(e) => setNotifyWhatsApp(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-[#8B5CF6] focus:ring-[#8B5CF6]"
            />
            <label htmlFor="notify-whatsapp" className="text-xs text-zinc-300 cursor-pointer">
              Disparar notificação push imediata e alerta sonoro no painel do destinatário
            </label>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-[#2E1065] bg-[#C4B5FD] hover:bg-[#DDD6FE] active:scale-[0.98] rounded-xl shadow-lg shadow-[#8B5CF6]/20 transition-all flex items-center gap-1.5 cursor-pointer font-['Plus_Jakarta_Sans',sans-serif]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Confirmar Transferência</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
