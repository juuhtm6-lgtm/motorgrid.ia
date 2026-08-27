import React, { useState } from 'react';
import { X, Building2, User, Mail, Phone, DollarSign, MapPin, Tag } from 'lucide-react';
import { Customer, PlanTier } from '../../types';

interface NewCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomer: (customer: Omit<Customer, 'id' | 'healthScore'>) => void;
}

export const NewCustomerModal: React.FC<NewCustomerModalProps> = ({
  isOpen,
  onClose,
  onAddCustomer,
}) => {
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [plan, setPlan] = useState<PlanTier>('Pro');
  const [mrr, setMrr] = useState('1290');
  const [segment, setSegment] = useState('Fintech');
  const [city, setCity] = useState('São Paulo, SP');
  const [tags, setTags] = useState('B2B, Expansão');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !name || !email) return;

    onAddCustomer({
      company,
      name,
      email,
      contactPhone: phone || '+55 (11) 98765-4321',
      plan,
      mrr: Number(mrr) || 1290,
      status: 'Ativo',
      segment,
      city,
      startDate: new Date().toLocaleDateString('pt-BR'),
      renewalDate: '15/06/2027',
      lastActive: 'Agora',
      tags: tags.split(',').map((t) => t.trim()),
      avatar: `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 100000)}?w=150&auto=format&fit=crop&q=80`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="fixed inset-0 -z-10" onClick={onClose} />
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Cadastrar Novo Cliente B2B</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold">Empresa / Razão Social</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Ex: Nexus Logística S/A"
                className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold">Contato Principal</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Juliana Prado (Diretora)"
                className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold">E-mail Corporativo</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juliana@nexus.com.br"
                className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold">WhatsApp / Telefone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+55 (11) 98765-4321"
                className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold">Plano Contratado</label>
              <select
                value={plan}
                onChange={(e: any) => {
                  setPlan(e.target.value);
                  if (e.target.value === 'Starter') setMrr('490');
                  if (e.target.value === 'Pro') setMrr('1290');
                  if (e.target.value === 'Enterprise') setMrr('3490');
                }}
                className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
              >
                <option value="Starter">Starter (R$ 490/mês)</option>
                <option value="Pro">Pro (R$ 1.290/mês)</option>
                <option value="Enterprise">Enterprise (R$ 3.490/mês)</option>
              </select>
            </div>
            <div>
              <label className="text-slate-300 font-semibold">MRR (Recorrência R$)</label>
              <input
                type="number"
                value={mrr}
                onChange={(e) => setMrr(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold">Segmento de Atuação</label>
              <input
                type="text"
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                placeholder="Ex: Varejo, Finanças, Saúde..."
                className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold">Localização</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="São Paulo, SP"
                className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              Criar Conta de Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
