import React, { useState } from 'react';
import { X, UserPlus, Building2, Phone, Mail, Car, DollarSign, Tag, Sparkles, CheckCircle2 } from 'lucide-react';
import { LeadItem, LeadSource, LeadStatus } from '../../types';

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (lead: Omit<LeadItem, 'id' | 'createdAt' | 'lastContact'>) => void;
}

export const CreateLeadModal: React.FC<CreateLeadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [fleetSize, setFleetSize] = useState(15);
  const [estimatedValue, setEstimatedValue] = useState(1500);
  const [source, setSource] = useState<LeadSource>('Site / Landing Page');
  const [status, setStatus] = useState<LeadStatus>('Novo');
  const [assignedTo, setAssignedTo] = useState('Ana Luísa (Head Ops)');
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('Frota Pesada, Telemetria CAN-Bus');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onSubmit({
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@${company.toLowerCase().replace(/\s+/g, '')}.com.br`,
      phone: phone || '(11) 98765-4321',
      company,
      fleetSize: Number(fleetSize) || 10,
      estimatedValue: Number(estimatedValue) || 1200,
      source,
      status,
      assignedTo,
      notes: notes || 'Lead interessado em redução de combustível e bloqueio preventivo via MotorGrid.',
      tags,
    });

    onClose();
    // Reset
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#141416] border border-[#8B5CF6]/30 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 bg-[#1C1C1E] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#C4B5FD] text-[#2E1065] shadow-md shadow-[#8B5CF6]/20">
              <UserPlus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">+ Novo Lead Comercial</h2>
              <p className="text-xs text-zinc-400">Cadastre um novo lead e direcione para o funil MotorGrid</p>
            </div>
          </div>
          <button
            id="close-lead-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Nome do Contato / Decisor *
              </label>
              <input
                id="lead-name-input"
                type="text"
                required
                placeholder="Ex: Carlos Mendes"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] text-white placeholder-zinc-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Empresa / Concessionária *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  id="lead-company-input"
                  type="text"
                  required
                  placeholder="Ex: Transportadora Rota Sul"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] text-white placeholder-zinc-500 outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                WhatsApp / Telefone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  id="lead-phone-input"
                  type="text"
                  placeholder="(11) 98765-4321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] text-white placeholder-zinc-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Email Corporativo
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  id="lead-email-input"
                  type="email"
                  placeholder="carlos@rotasul.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] text-white placeholder-zinc-500 outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Tamanho da Frota (Veículos)
              </label>
              <div className="relative">
                <Car className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  id="lead-fleet-input"
                  type="number"
                  min="1"
                  value={fleetSize}
                  onChange={(e) => {
                    const size = Number(e.target.value);
                    setFleetSize(size);
                    setEstimatedValue(size * 89);
                  }}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] text-white placeholder-zinc-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Valor Estimado da Proposta (R$/mês)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  id="lead-value-input"
                  type="number"
                  min="100"
                  step="50"
                  value={estimatedValue}
                  onChange={(e) => setEstimatedValue(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] text-white placeholder-zinc-500 outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Canal de Origem
              </label>
              <select
                id="lead-source-select"
                value={source}
                onChange={(e) => setSource(e.target.value as LeadSource)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white outline-none"
              >
                <option value="Site / Landing Page">Site / Landing Page</option>
                <option value="WhatsApp Direto">WhatsApp Direto</option>
                <option value="Indicação de Frotista">Indicação de Frotista</option>
                <option value="Tráfego Pago">Tráfego Pago (Google / Meta)</option>
                <option value="Feira Automotiva">Feira / Evento Automotivo</option>
                <option value="Outbound">Prospecção Ativa (Outbound)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Responsável Comercial
              </label>
              <select
                id="lead-assigned-select"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white outline-none"
              >
                <option value="Ana Luísa (Head Ops)">Ana Luísa (Head Ops)</option>
                <option value="Rodrigo Mendes (Vendas)">Rodrigo Mendes (Vendas)</option>
                <option value="Felipe Santos (Engenharia)">Felipe Santos (Engenharia)</option>
                <option value="Camila Rocha (Enterprise)">Camila Rocha (Enterprise)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Tags / Interesse Técnico
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              <input
                id="lead-tags-input"
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Ex: Frota Pesada, CAN-Bus, Rastreamento Satelital"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white placeholder-zinc-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Observações & Contexto Inicial
            </label>
            <textarea
              id="lead-notes-input"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Necessidade do cliente, modelos de veículos, metas de redução de combustível..."
              className="w-full px-3 py-2 text-sm rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white placeholder-zinc-500 outline-none resize-none"
            />
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              id="cancel-create-lead-btn"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="submit-create-lead-btn"
              className="px-5 py-2 text-sm font-bold text-[#2E1065] bg-[#C4B5FD] hover:bg-[#DDD6FE] hover:shadow-lg hover:shadow-[#8B5CF6]/25 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Salvar Lead no Funil</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
