import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, Building2, Car, DollarSign, Tag } from 'lucide-react';
import { LeadItem, LeadStatus, LeadSource } from '../../types';

interface EditLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadItem | null;
  onSave: (updatedLead: LeadItem) => void;
}

export const EditLeadModal: React.FC<EditLeadModalProps> = ({
  isOpen,
  onClose,
  lead,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [fleetSize, setFleetSize] = useState(1);
  const [estimatedValue, setEstimatedValue] = useState(0);
  const [source, setSource] = useState<LeadSource>('WhatsApp Direto');
  const [status, setStatus] = useState<LeadStatus>('Novo');
  const [assignedTo, setAssignedTo] = useState('Rodrigo Mendes');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (lead) {
      setName(lead.name);
      setEmail(lead.email);
      setPhone(lead.phone);
      setCompany(lead.company);
      setFleetSize(lead.fleetSize);
      setEstimatedValue(lead.estimatedValue);
      setSource(lead.source);
      setStatus(lead.status);
      setAssignedTo(lead.assignedTo);
      setNotes(lead.notes || '');
      setError('');
    }
  }, [lead]);

  if (!isOpen || !lead) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !company.trim()) {
      setError('Por favor preencha nome, telefone e empresa.');
      return;
    }

    onSave({
      ...lead,
      name,
      email,
      phone,
      company,
      fleetSize: Number(fleetSize) || 1,
      estimatedValue: Number(estimatedValue) || 0,
      source,
      status,
      assignedTo,
      notes,
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

        <div>
          <h3 className="text-base font-bold text-white">Editar Dados do Lead</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Atualize as informações comerciais de {lead.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Nome do Contato *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Telefone / WhatsApp *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">E-mail Corporativo</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Empresa / Razão Social *</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Tamanho da Frota (Veículos)</label>
              <input
                type="number"
                min="1"
                value={fleetSize}
                onChange={(e) => setFleetSize(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Valor Estimado (R$/mês)</label>
              <input
                type="number"
                min="0"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Status do Lead</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              >
                <option value="Novo">Novo</option>
                <option value="Em Contato">Em Contato</option>
                <option value="Qualificado">Qualificado</option>
                <option value="Proposta Enviada">Proposta Enviada</option>
                <option value="Ganho">Ganho</option>
                <option value="Perdido">Perdido</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Vendedor Responsável</label>
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

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Canal de Origem</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as LeadSource)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
            >
              <option value="WhatsApp Direto">WhatsApp Direto</option>
              <option value="Site / Landing Page">Site / Landing Page</option>
              <option value="Indicação de Frotista">Indicação de Frotista</option>
              <option value="Tráfego Pago">Tráfego Pago</option>
              <option value="Feira Automotiva">Feira Automotiva</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Observações Comerciais</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
            />
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
              className="px-4 py-2 text-xs font-bold rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-lg shadow-[#8B5CF6]/30 transition-all cursor-pointer"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
