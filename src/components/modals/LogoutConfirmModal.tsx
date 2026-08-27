import React from 'react';
import { LogOut, X, AlertTriangle, ShieldAlert } from 'lucide-react';
import { AuthUser } from '../../types';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: AuthUser | null;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  user,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="fixed inset-0 -z-10" onClick={onClose} />
      <div
        id="logout-confirm-modal-container"
        className="w-full max-w-md rounded-3xl bg-[#1C1C1E] border border-rose-500/30 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <LogOut className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Encerrar Sessão
            </h3>
          </div>
          <button
            id="close-logout-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 text-xs text-zinc-300">
          <p>
            Deseja realmente sair da conta corporativa de{' '}
            <strong className="text-white">{user?.name || 'usuário'}</strong> ({user?.email})?
          </p>
          <p className="text-zinc-400 text-[11px]">
            Ao sair, você retornará à tela de autenticação do MotorGrid. Suas configurações e dados de telemetria continuarão salvos com segurança.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-800">
          <button
            id="cancel-logout-btn"
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Permanecer Conectado
          </button>
          <button
            id="confirm-logout-btn"
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sim, Sair Agora</span>
          </button>
        </div>
      </div>
    </div>
  );
};
