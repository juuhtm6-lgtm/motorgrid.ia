import React, { useState } from 'react';
import { X, CheckSquare, Calendar, User, Phone, Car, Plus } from 'lucide-react';
import { CrmTask } from '../../types';

interface CreateCrmTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<CrmTask, 'id'>) => void;
}

export const CreateCrmTaskModal: React.FC<CreateCrmTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [contactName, setContactName] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [assignedTo, setAssignedTo] = useState('Rodrigo Mendes');
  const [dueDate, setDueDate] = useState('Hoje às 17:00');
  const [priority, setPriority] = useState<'Alta' | 'Média' | 'Baixa'>('Alta');
  const [type, setType] = useState<CrmTask['type']>('Ligação');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !contactName.trim()) {
      setError('Por favor preencha o título da tarefa e o contato.');
      return;
    }

    onSave({
      title,
      contactName,
      vehicle: vehicle || 'Veículo em negociação',
      assignedTo,
      dueDate,
      status: 'Hoje',
      priority,
      type,
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
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Nova Tarefa Comercial</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Agende follow-ups, contatos e vistorias</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Título da Tarefa *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Ligar para confirmar taxa e aprovação BV"
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Nome do Contato / Cliente *</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Ex: Dr. Roberto Silveira"
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Veículo de Interesse</label>
              <input
                type="text"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                placeholder="Ex: Porsche Macan GTS"
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Tipo de Ação</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              >
                <option value="Ligação">Ligação Telefônica</option>
                <option value="WhatsApp">Mensagem WhatsApp</option>
                <option value="Visita">Visita / Showroom</option>
                <option value="Documentação">Documentação / F&amp;I</option>
                <option value="Proposta">Envio de Proposta</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Prioridade</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              >
                <option value="Alta">Alta (Urgente)</option>
                <option value="Média">Média</option>
                <option value="Baixa">Baixa</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Prazo / Horário</label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="Ex: Hoje às 16:30 ou Amanhã"
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Responsável</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              >
                <option value="Rodrigo Mendes">Rodrigo Mendes</option>
                <option value="Camila Rocha">Camila Rocha</option>
                <option value="Lucas Silveira">Lucas Silveira</option>
                <option value="Ana Beatriz">Ana Beatriz</option>
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
              <span>Salvar Tarefa</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
