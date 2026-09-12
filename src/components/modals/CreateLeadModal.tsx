import React, { useState } from 'react';
import { X, UserPlus, Phone, Mail, Car, DollarSign, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { LeadItem, LeadSource, LeadStatus } from '../../types';

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (lead: Omit<LeadItem, 'id' | 'createdAt' | 'lastContact'>) => void;
  onCreateLead?: (lead: Omit<LeadItem, 'id' | 'createdAt' | 'lastContact'>) => void;
}

export const CreateLeadModal: React.FC<CreateLeadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onCreateLead,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleInterest, setVehicleInterest] = useState('BMW 320i M Sport 2024');
  const [estimatedValue, setEstimatedValue] = useState(289900);
  const [tradeInVehicle, setTradeInVehicle] = useState('Jeep Compass Longitude 2022');
  const [downPayment, setDownPayment] = useState(50000);
  const [purchaseIntent, setPurchaseIntent] = useState<'Alta' | 'Média' | 'Baixa'>('Alta');
  const [source, setSource] = useState<LeadSource>('WhatsApp Direto');
  const [status, setStatus] = useState<LeadStatus>('Novo');
  const [assignedTo, setAssignedTo] = useState('Rodrigo Mendes (Vendas)');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const leadPayload: any = {
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@cliente.com.br`,
      phone: phone.trim() || '(11) 98765-4321',
      company: 'Pessoa Física',
      fleetSize: 1,
      estimatedValue: Number(estimatedValue) || 289900,
      vehicleInterest: vehicleInterest.trim(),
      tradeInVehicle: tradeInVehicle.trim(),
      downPayment: Number(downPayment) || 0,
      purchaseIntent,
      source,
      status,
      assignedTo: assignedTo.replace(/ \(.+\)/, ''),
      notes: notes.trim() || `Interesse em ${vehicleInterest}. Troca: ${tradeInVehicle || 'Sem troca'}. Entrada: R$ ${downPayment}.`,
      tags: ['Showroom', purchaseIntent === 'Alta' ? 'Lead Quente' : 'Lead Morno', vehicleInterest.split(' ')[0]],
    };

    const handler = onCreateLead || onSubmit;
    if (handler) {
      handler(leadPayload);
    }

    onClose();
    // Reset
    setName('');
    setEmail('');
    setPhone('');
    setNotes('');
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
            <div className="p-2 rounded-xl bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/20">
              <UserPlus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">+ Novo Lead de Veículo</h2>
              <p className="text-xs text-zinc-400">Cadastre a oportunidade diretamente no funil de vendas</p>
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
                Nome do Cliente *
              </label>
              <input
                id="lead-name-input"
                type="text"
                required
                placeholder="Ex: Carlos Eduardo Mendes"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] text-white placeholder-zinc-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                WhatsApp / Telefone *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  id="lead-phone-input"
                  type="text"
                  required
                  placeholder="(11) 98765-4321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] text-white placeholder-zinc-500 outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Veículo de Interesse *
              </label>
              <div className="relative">
                <Car className="w-4 h-4 text-[#8B5CF6] absolute left-3 top-2.5" />
                <input
                  id="lead-vehicle-input"
                  type="text"
                  required
                  placeholder="Ex: BMW 320i M Sport 2024"
                  value={vehicleInterest}
                  onChange={(e) => setVehicleInterest(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white placeholder-zinc-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Valor do Veículo (R$)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
                <input
                  id="lead-value-input"
                  type="number"
                  step="1000"
                  value={estimatedValue}
                  onChange={(e) => setEstimatedValue(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Veículo para Troca (Opcional)
              </label>
              <div className="relative">
                <RefreshCw className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  id="lead-tradein-input"
                  type="text"
                  placeholder="Ex: Jeep Compass Longitude 2022"
                  value={tradeInVehicle}
                  onChange={(e) => setTradeInVehicle(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white placeholder-zinc-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Valor de Entrada Pretendido (R$)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  id="lead-downpayment-input"
                  type="number"
                  step="1000"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Canal de Origem
              </label>
              <select
                id="lead-source-select"
                value={source}
                onChange={(e) => setSource(e.target.value as LeadSource)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white outline-none"
              >
                <option value="WhatsApp Direto">WhatsApp Direto</option>
                <option value="Instagram Ads">Instagram Ads</option>
                <option value="Facebook Ads">Facebook Ads</option>
                <option value="Webmotors Pro">Webmotors Pro</option>
                <option value="Site / Landing Page">Site / Landing Page</option>
                <option value="Showroom Presencial">Showroom Presencial</option>
                <option value="Indicação">Indicação de Cliente</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Intenção de Compra
              </label>
              <select
                id="lead-intent-select"
                value={purchaseIntent}
                onChange={(e) => setPurchaseIntent(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white outline-none"
              >
                <option value="Alta">🔥 Alta (Pronto para fechar)</option>
                <option value="Média">⚡ Média (Pesquisando)</option>
                <option value="Baixa">❄️ Baixa (Curioso / Futuro)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Consultor Responsável
              </label>
              <select
                id="lead-assigned-select"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white outline-none"
              >
                <option value="Rodrigo Mendes (Vendas)">Rodrigo Mendes</option>
                <option value="Camila Rocha (SDR)">Camila Rocha</option>
                <option value="Ana Luísa (Gerente)">Ana Luísa</option>
                <option value="Felipe Santos (Showroom)">Felipe Santos</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Observações do Atendimento
            </label>
            <textarea
              id="lead-notes-input"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Preferência de cor, financiamento desejado, melhor horário para visita..."
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
              className="px-5 py-2 text-sm font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] hover:shadow-lg hover:shadow-[#8B5CF6]/25 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Salvar Lead no CRM</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
