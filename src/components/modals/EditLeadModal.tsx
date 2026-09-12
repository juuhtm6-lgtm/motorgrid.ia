import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, Car, DollarSign, Tag, RefreshCw, AlertCircle } from 'lucide-react';
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
  const [company, setCompany] = useState('Pessoa Física');
  const [vehicleInterest, setVehicleInterest] = useState('');
  const [tradeInVehicle, setTradeInVehicle] = useState('');
  const [downPayment, setDownPayment] = useState<number>(0);
  const [estimatedValue, setEstimatedValue] = useState<number>(0);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [lossReason, setLossReason] = useState('Preço / Condição de Pagamento');
  const [source, setSource] = useState<LeadSource>('WhatsApp Direto');
  const [status, setStatus] = useState<LeadStatus>('Novo');
  const [assignedTo, setAssignedTo] = useState('Rodrigo Mendes');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (lead) {
      setName(lead.name || '');
      setEmail(lead.email || '');
      setPhone(lead.phone || '');
      setCompany(lead.company || 'Pessoa Física');
      setVehicleInterest((lead as any).vehicleInterest || lead.notes || '');
      setTradeInVehicle((lead as any).tradeInVehicle || '');
      setDownPayment((lead as any).downPayment || 0);
      setEstimatedValue(lead.estimatedValue || 0);
      setFinalPrice((lead as any).finalPrice || lead.estimatedValue || 0);
      setLossReason((lead as any).lossReason || 'Preço / Condição de Pagamento');
      setSource(lead.source || 'WhatsApp Direto');
      setStatus(lead.status || 'Novo');
      setAssignedTo(lead.assignedTo || 'Rodrigo Mendes');
      setNotes(lead.notes || '');
      setError('');
    }
  }, [lead]);

  if (!isOpen || !lead) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Por favor preencha nome e telefone do cliente.');
      return;
    }

    const updatedLeadData: LeadItem = {
      ...lead,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company: company.trim() || 'Pessoa Física',
      fleetSize: lead.fleetSize || 1,
      estimatedValue: Number(estimatedValue) || 0,
      source,
      status,
      assignedTo,
      notes,
    };

    (updatedLeadData as any).vehicleInterest = vehicleInterest;
    (updatedLeadData as any).tradeInVehicle = tradeInVehicle;
    (updatedLeadData as any).downPayment = Number(downPayment) || 0;
    if (status === 'Ganho') {
      (updatedLeadData as any).finalPrice = Number(finalPrice) || estimatedValue;
    }
    if (status === 'Perdido') {
      (updatedLeadData as any).lossReason = lossReason;
    }

    onSave(updatedLeadData);
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
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Nome do Cliente *</label>
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
              <label className="block text-xs font-semibold text-zinc-300 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Veículo de Interesse</label>
              <input
                type="text"
                value={vehicleInterest}
                onChange={(e) => setVehicleInterest(e.target.value)}
                placeholder="Ex: BMW 320i M Sport"
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Veículo para Troca</label>
              <input
                type="text"
                value={tradeInVehicle}
                onChange={(e) => setTradeInVehicle(e.target.value)}
                placeholder="Ex: Jeep Compass 2022"
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Valor do Negócio (R$)</label>
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
                <option value="Agendado">Agendado (Test Drive)</option>
                <option value="Em Atendimento">Em Atendimento</option>
                <option value="Proposta Enviada">Proposta Enviada</option>
                <option value="Ganho">Ganho (Venda Fechada)</option>
                <option value="Perdido">Perdido</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Consultor Responsável</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              >
                <option value="Rodrigo Mendes">Rodrigo Mendes</option>
                <option value="Camila Rocha">Camila Rocha</option>
                <option value="Lucas Silveira">Lucas Silveira</option>
                <option value="Ana Luísa">Ana Luísa</option>
                <option value="Felipe Santos">Felipe Santos</option>
              </select>
            </div>
          </div>

          {/* Conditional Fields: Motivo de Perda */}
          {status === 'Perdido' && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1.5">
              <label className="block text-xs font-semibold text-rose-300">Motivo da Perda *</label>
              <select
                value={lossReason}
                onChange={(e) => setLossReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-rose-500/40 text-white focus:border-rose-400 outline-none"
              >
                <option value="Preço / Condição de Pagamento">Preço / Condição de Pagamento</option>
                <option value="Comprou na Concorrência">Comprou na Concorrência</option>
                <option value="Desistiu da Compra">Desistiu da Compra</option>
                <option value="Avaliação do Usado Baixa">Avaliação do Usado Baixa</option>
                <option value="Financiamento Reprovado">Financiamento Reprovado</option>
                <option value="Sem Contato / Parou de Responder">Sem Contato / Parou de Responder</option>
              </select>
            </div>
          )}

          {/* Conditional Fields: Valor Final de Venda */}
          {status === 'Ganho' && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
              <label className="block text-xs font-semibold text-emerald-300">Valor Final Fechado (R$) *</label>
              <input
                type="number"
                value={finalPrice}
                onChange={(e) => setFinalPrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-emerald-500/40 text-white focus:border-emerald-400 outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Canal de Origem</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as LeadSource)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
            >
              <option value="WhatsApp Direto">WhatsApp Direto</option>
              <option value="Instagram Ads">Instagram Ads</option>
              <option value="Facebook Ads">Facebook Ads</option>
              <option value="Webmotors Pro">Webmotors Pro</option>
              <option value="Site / Landing Page">Site / Landing Page</option>
              <option value="Showroom Presencial">Showroom Presencial</option>
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
