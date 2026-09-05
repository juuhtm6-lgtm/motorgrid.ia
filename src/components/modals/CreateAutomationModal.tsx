import React, { useState } from 'react';
import { X, Zap, Sparkles, Plus } from 'lucide-react';
import { AutomationRule } from '../../types';

interface CreateAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: Omit<AutomationRule, 'id' | 'executionsCount' | 'lastExecuted'>) => void;
}

const TRIGGERS = [
  'Novo Lead Recebido (Qualquer Canal)',
  'Lead Sem Resposta após 2 horas',
  'Lead Qualificado pelo SDR',
  'Agendamento de Test Drive Confirmado',
  'Proposta Comercial Enviada',
  'Lead Frio sem Interação há 5 dias',
];

const CONDITIONS = [
  'Temperatura = Quente (Lead com Alta Intenção)',
  'Origem = WhatsApp Direto ou Portais',
  'Veículo de Interesse com Valor > R$ 250.000',
  'Cliente com Veículo Usado para Troca',
  'Horário Comercial (08:00 às 19:00)',
];

const ACTIONS = [
  'Disparar WhatsApp Personalizado com Ficha Técnica',
  'Enviar Mensagem de Áudio Humanizado IA',
  'Criar Tarefa de Ligação Prioritária para o Consultor',
  'Notificar Gerente de Vendas via Push / Alerta',
  'Aplicar Tag VIP e Elevar Score do Lead',
];

export const CreateAutomationModal: React.FC<CreateAutomationModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [trigger, setTrigger] = useState(TRIGGERS[0]);
  const [condition, setCondition] = useState(CONDITIONS[0]);
  const [action, setAction] = useState(ACTIONS[0]);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor digite um nome para a regra.');
      return;
    }

    onSave({
      name,
      description: description || `Gatilho: ${trigger} -> Ação: ${action}`,
      trigger,
      condition,
      action,
      enabled: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl bg-[#141416] border border-zinc-800 p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/30">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Nova Regra de Automação Comercial</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Configure gatilhos, condições e ações inteligentes</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Nome da Regra *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Resposta Automática para BMW / Porsche"
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Descrição</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Objetivo desta regra comercial"
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-[#0A0A0B] border border-zinc-800 space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-[#A78BFA] uppercase tracking-wider mb-1 font-mono">
                1. SE (Gatilho)
              </label>
              <select
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#141416] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              >
                {TRIGGERS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1 font-mono">
                2. E SE (Condição Opcional)
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#141416] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1 font-mono">
                3. ENTÃO (Ação Comercial)
              </label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#141416] border border-[#8B5CF6]/40 text-[#DDD6FE] focus:border-[#8B5CF6] outline-none font-semibold"
              >
                {ACTIONS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <div className="text-xs text-rose-400">{error}</div>}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-lg shadow-[#8B5CF6]/30 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Criar Regra</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
