import React, { useState } from 'react';
import { X, AlertCircle, Check } from 'lucide-react';

interface LossReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, notes: string) => void;
  leadName?: string;
  vehicleName?: string;
}

const LOSS_REASONS = [
  'Preço / Condição Financeira',
  'Taxa de Financiamento Elevada',
  'Sem Veículo em Estoque',
  'Comprou na Concorrência',
  'Sem Retorno / Lead Sumiu',
  'Desistiu da Compra',
  'Outro Motivo',
];

export const LossReasonModal: React.FC<LossReasonModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  leadName,
  vehicleName,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>(LOSS_REASONS[0]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) {
      setError('Por favor, selecione o motivo da perda.');
      return;
    }
    onConfirm(selectedReason, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-[#141416] border border-zinc-800 p-6 shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Registrar Perda da Oportunidade</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              {leadName ? `${leadName} • ` : ''}
              {vehicleName || 'Negociação automotiva'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Motivo Principal da Perda <span className="text-rose-400">*</span>
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {LOSS_REASONS.map((r) => {
                const isSelected = selectedReason === r;
                return (
                  <label
                    key={r}
                    onClick={() => setSelectedReason(r)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-rose-500/10 border-rose-500/50 text-white font-semibold'
                        : 'bg-[#0A0A0B] border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    <span>{r}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-rose-400" />}
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Detalhes / Feedback do Cliente (Opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: O cliente achou a parcela acima do orçamento e optou por aguardar taxa zero da montadora..."
              rows={3}
              className="w-full p-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:border-rose-500 outline-none"
            />
          </div>

          {error && <div className="text-xs text-rose-400">{error}</div>}

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/30 transition-all cursor-pointer"
            >
              Confirmar Perda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
