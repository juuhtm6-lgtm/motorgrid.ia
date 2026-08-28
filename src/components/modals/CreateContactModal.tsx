import React, { useState } from 'react';
import { X, UserPlus, Phone, Mail, MapPin, Tag, ShieldCheck, Car } from 'lucide-react';
import { Contact } from '../../types';
import { initialAuthUsers } from '../../data/mockData';

interface CreateContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'status' | 'totalPurchases' | 'vehiclesConsulted'>) => void;
}

export const CreateContactModal: React.FC<CreateContactModalProps> = ({
  isOpen,
  onClose,
  onCreateContact,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+55 (11) 9');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [city, setCity] = useState('São Paulo');
  const [state, setState] = useState('SP');
  const [origin, setOrigin] = useState('Instagram Ads');
  const [assignedTo, setAssignedTo] = useState(initialAuthUsers[1]?.name || 'Rodrigo Mendes');
  const [tagsStr, setTagsStr] = useState('Novo Lead, Lead Quente');
  const [tradeInHistory, setTradeInHistory] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateContact({
      name,
      phone,
      whatsapp: phone,
      email,
      cpf,
      city,
      state,
      origin,
      assignedTo,
      lastContact: 'Criado agora',
      tags: tagsStr.split(',').map((s) => s.trim()).filter(Boolean),
      tradeInHistory,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#141416] border border-[#8B5CF6]/30 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 bg-[#1C1C1E] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Novo Contato 360º</h3>
              <p className="text-xs text-zinc-400">Cadastro de Cliente & Carteirização Permanente</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Nome Completo do Cliente *</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Dra. Gabriela Vasconcelos"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">WhatsApp / Telefone *</label>
              <input
                required
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+55 (11) 98765-4321"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cliente@email.com"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">CPF</label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Cidade</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Estado</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Origem do Lead</label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 text-white outline-none cursor-pointer"
              >
                <option value="Instagram Ads">Instagram Ads</option>
                <option value="Facebook Ads">Facebook Ads</option>
                <option value="Webmotors Pro">Webmotors Pro</option>
                <option value="iCarros">iCarros</option>
                <option value="OLX Autos">OLX Autos</option>
                <option value="Google Search Ads">Google Search Ads</option>
                <option value="Indicação / Base">Indicação / Base Antiga</option>
                <option value="Visita Espontânea">Visita Espontânea (Showroom)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Vendedor Responsável (Carteirização) *
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 text-white outline-none cursor-pointer"
              >
                {initialAuthUsers.map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Etiquetas (separadas por vírgula)</label>
            <input
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Veículo Usado para Avaliação na Troca</label>
            <input
              type="text"
              value={tradeInHistory}
              onChange={(e) => setTradeInHistory(e.target.value)}
              placeholder="Ex: Jeep Compass Longitude 2022 (35.000 km)"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Observações Comerciais</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Cliente tem interesse em SUV alemão com teto solar panorâmico."
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 text-white outline-none"
            />
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
              <span>Salvar Contato 360º</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
