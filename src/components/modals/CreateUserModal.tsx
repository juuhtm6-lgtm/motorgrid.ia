import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Building2,
  Lock,
  Shield,
  CheckCircle2,
  Sparkles,
  Car,
  KeyRound,
} from 'lucide-react';
import { AuthUser, UserRole, PlanTier } from '../../types';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateUser: (newUser: Omit<AuthUser, 'id' | 'createdAt' | 'lastLogin'>) => void;
  currentCompany?: string;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onCreateUser,
  currentCompany = 'MotorGrid Automotive Technology',
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Gestor de Frotas');
  const [company, setCompany] = useState(currentCompany);
  const [plan, setPlan] = useState<PlanTier>('Pro');
  const [phone, setPhone] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  );
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);

  if (!isOpen) return null;

  const predefinedAvatars = [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onCreateUser({
      name,
      email,
      role,
      company: company || currentCompany,
      avatar: selectedAvatar,
      plan,
      phone,
      twoFactorEnabled: false,
      status: 'Ativo',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="fixed inset-0 -z-10" onClick={onClose} />
      <div
        id="create-user-modal-container"
        className="w-full max-w-lg rounded-3xl bg-[#1C1C1E] border border-[#8B5CF6]/30 shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 flex items-center justify-center text-[#DDD6FE]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Criar Novo Usuário no MotorGrid
              </h3>
              <p className="text-xs text-zinc-400">
                Cadastro imediato de operador, engenheiro ou gestor de concessionária
              </p>
            </div>
          </div>
          <button
            id="close-create-user-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Nome Completo</label>
              <input
                id="create-user-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Roberto Alcantara"
                className="w-full px-3 py-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">E-mail Corporativo</label>
              <input
                id="create-user-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="roberto@concessionaria.com"
                className="w-full px-3 py-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Função / Cargo</label>
              <select
                id="create-user-role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-100 focus:outline-none focus:border-[#8B5CF6]"
              >
                <option value="Administrador">Administrador</option>
                <option value="Gestor de Frotas">Gestor de Frotas</option>
                <option value="Engenheiro de Telemetria">Engenheiro de Telemetria</option>
                <option value="Customer Success">Customer Success</option>
                <option value="Analista de Operações">Analista de Operações</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Empresa / Concessionária</label>
              <input
                id="create-user-company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Ex: MotorGrid Automotive"
                className="w-full px-3 py-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Telefone / WhatsApp</label>
              <input
                id="create-user-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+55 (11) 98888-7777"
                className="w-full px-3 py-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Plano Vinculado</label>
              <select
                id="create-user-plan"
                value={plan}
                onChange={(e) => setPlan(e.target.value as PlanTier)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-100 focus:outline-none focus:border-[#8B5CF6]"
              >
                <option value="Starter">Starter Connected</option>
                <option value="Pro">Pro Telematics</option>
                <option value="Enterprise">Enterprise Fleet</option>
              </select>
            </div>
          </div>

          {/* Avatar selection */}
          <div>
            <label className="text-zinc-300 font-semibold block mb-1.5">Foto de Perfil</label>
            <div className="flex items-center gap-2">
              {predefinedAvatars.map((av, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={`rounded-full p-0.5 transition-all cursor-pointer ${
                    selectedAvatar === av ? 'ring-2 ring-[#8B5CF6] scale-110' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={av} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Send invite checkbox */}
          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sendWelcomeEmail}
                onChange={(e) => setSendWelcomeEmail(e.target.checked)}
                className="rounded bg-[#0A0A0B] border-zinc-700 text-[#8B5CF6] focus:ring-[#8B5CF6] accent-[#8B5CF6]"
              />
              <span className="text-xs text-zinc-400">
                Enviar e-mail com credenciais provisórias e chave de acesso à telemetria
              </span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              id="cancel-create-user-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              id="submit-create-user-btn"
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white text-xs font-bold shadow-lg shadow-[#8B5CF6]/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Salvar & Criar Usuário</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
