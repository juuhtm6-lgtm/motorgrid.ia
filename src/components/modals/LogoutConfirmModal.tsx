import React from 'react';
import { LogOut, X, AlertTriangle, ShieldAlert } from 'lucide-react';
import { AuthUser, ThemeMode } from '../../types';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onConfirmLogout?: () => void;
  user: AuthUser | null;
  theme?: ThemeMode;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onConfirmLogout,
  user,
  theme = 'dark',
}) => {
  if (!isOpen) return null;

  const handleExecuteLogout = () => {
    if (onConfirm) onConfirm();
    if (onConfirmLogout) onConfirmLogout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="fixed inset-0 -z-10" onClick={onClose} />
      <div
        id="logout-confirm-modal-container"
        className={`w-full max-w-md rounded-3xl border shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150 ${
          theme === 'dark'
            ? 'bg-[#1C1C1E] border-rose-500/30 shadow-black/80 text-white'
            : 'bg-white border-rose-200 shadow-slate-300 text-[#111827]'
        }`}
      >
        <div className={`flex items-center justify-between border-b pb-3 ${
          theme === 'dark' ? 'border-zinc-800' : 'border-slate-100'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-500 border border-rose-500/30 flex items-center justify-center">
              <LogOut className="w-4 h-4" />
            </div>
            <h3 className={`text-base font-bold tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-[#111827]'
            }`}>
              Encerrar Sessão
            </h3>
          </div>
          <button
            id="close-logout-modal-btn"
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <p className={theme === 'dark' ? 'text-zinc-300' : 'text-[#334155]'}>
            Deseja realmente sair da conta corporativa de{' '}
            <strong className={theme === 'dark' ? 'text-white font-bold' : 'text-[#111827] font-bold'}>
              {user?.name || 'usuário'}
            </strong>{' '}
            ({user?.email})?
          </p>
          <p className={`text-[11px] leading-relaxed ${
            theme === 'dark' ? 'text-zinc-400' : 'text-[#64748B]'
          }`}>
            Ao sair, você retornará imediatamente à tela de login do MotorGrid. Suas configurações e dados de telemetria continuarão salvos com segurança.
          </p>
        </div>

        <div className={`flex items-center justify-end gap-2.5 pt-3 border-t ${
          theme === 'dark' ? 'border-zinc-800' : 'border-slate-100'
        }`}>
          <button
            id="cancel-logout-btn"
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                : 'bg-slate-100 hover:bg-slate-200 text-[#475569]'
            }`}
          >
            Permanecer Conectado
          </button>
          <button
            id="confirm-logout-btn"
            type="button"
            onClick={handleExecuteLogout}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sim, Sair do Sistema</span>
          </button>
        </div>
      </div>
    </div>
  );
};
