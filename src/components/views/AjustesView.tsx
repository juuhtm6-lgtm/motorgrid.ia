import React, { useState } from 'react';
import {
  Building,
  Users,
  ShieldCheck,
  Clock,
  Key,
  Database,
  CheckCircle2,
  Plus,
  Save,
  Lock,
  Layers,
  MapPin,
  Store,
  Sparkles,
  X,
} from 'lucide-react';
import { initialAuthUsers, initialTenants } from '../../data/mockData';
import { AuthUser, TenantUnit, ThemeMode } from '../../types';
import { MarketplaceView } from './MarketplaceView';
import { useToast } from '../../context/ToastContext';

interface AjustesViewProps {
  theme?: ThemeMode;
}

export const AjustesView: React.FC<AjustesViewProps> = ({ theme = 'dark' }) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'marketplace' | 'empresa' | 'unidades' | 'usuarios' | 'sla' | 'auditoria'>('marketplace');
  const [users, setUsers] = useState<AuthUser[]>(initialAuthUsers);
  const [units, setUnits] = useState<TenantUnit[]>(initialTenants[0].units);
  const [tenantName, setTenantName] = useState('MotorGrid Motors Premium');
  const [cnpj, setCnpj] = useState('12.345.678/0001-90');
  const [phone, setPhone] = useState('+55 (11) 3090-9900');
  const [email, setEmail] = useState('contato@motorgridmotors.com.br');
  const [slaTargetMin, setSlaTargetMin] = useState(3);
  const [plan, setPlan] = useState('Enterprise Multi-Store');

  // New Unit Modal
  const [isNewUnitModalOpen, setIsNewUnitModalOpen] = useState(false);
  const [newUnitName, setNewUnitName] = useState('');
  const [newUnitAddress, setNewUnitAddress] = useState('');
  const [newUnitPhone, setNewUnitPhone] = useState('');

  // Invite User Modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Gestor Geral' | 'Vendedor Sênior' | 'SDR de Pré-Vendas'>('Vendedor Sênior');

  const handleSaveEmpresa = () => {
    toast.success('Dados da concessionária atualizados com sucesso!');
  };

  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitName) return;
    const newUnit: TenantUnit = {
      id: `unit-${Date.now()}`,
      name: newUnitName,
      city: 'São Paulo',
      state: 'SP',
      address: newUnitAddress || 'Endereço Comercial',
      phone: newUnitPhone || '+55 (11) 3000-0000',
      vehicleCount: 0,
      sellersCount: 1,
    };
    setUnits((prev) => [...prev, newUnit]);
    setNewUnitName('');
    setNewUnitAddress('');
    setNewUnitPhone('');
    setIsNewUnitModalOpen(false);
    toast.success(`Unidade "${newUnit.name}" cadastrada com sucesso!`);
  };

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;
    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      team: 'Showroom Principal',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      company: 'MotorGrid Auto',
      plan: 'Enterprise',
      lastLogin: 'Nunca',
      createdAt: 'Hoje',
      status: 'Ativo',
    };
    setUsers((prev) => [...prev, newUser]);
    setInviteName('');
    setInviteEmail('');
    setIsInviteModalOpen(false);
    toast.success(`Convite enviado para ${newUser.email} com o perfil ${newUser.role}!`);
  };

  const handleToggleUserRole = (userId: string, currentRole: string) => {
    const roles: ('Gestor Geral' | 'Vendedor Sênior' | 'SDR de Pré-Vendas')[] = [
      'Gestor Geral',
      'Vendedor Sênior',
      'SDR de Pré-Vendas',
    ];
    const currentIndex = roles.indexOf(currentRole as any);
    const nextRole = roles[(currentIndex + 1) % roles.length];

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: nextRole } : u))
    );
    toast.success(`Permissões atualizadas para "${nextRole}".`);
  };

  return (
    <div className="space-y-6">
      {/* Sub-Tabs Selector */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-[#141416] border border-slate-200 dark:border-zinc-800 text-xs overflow-x-auto w-fit shadow-sm">
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'marketplace'
              ? 'bg-[#C4B5FD] text-[#2E1065] shadow-lg shadow-[#8B5CF6]/20 font-["Plus_Jakarta_Sans",sans-serif]'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Marketplace de Módulos</span>
        </button>
        <button
          onClick={() => setActiveTab('empresa')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'empresa' ? 'bg-purple-100 text-[#7C3AED] dark:bg-[#25193A] dark:text-white border border-[#8B5CF6]/50' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Empresa</span>
        </button>
        <button
          onClick={() => setActiveTab('unidades')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'unidades' ? 'bg-purple-100 text-[#7C3AED] dark:bg-[#25193A] dark:text-white border border-[#8B5CF6]/50' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Unidades / Lojas</span>
        </button>
        <button
          onClick={() => setActiveTab('usuarios')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'usuarios' ? 'bg-purple-100 text-[#7C3AED] dark:bg-[#25193A] dark:text-white border border-[#8B5CF6]/50' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Usuários &amp; Equipes</span>
        </button>
        <button
          onClick={() => setActiveTab('sla')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'sla' ? 'bg-purple-100 text-[#7C3AED] dark:bg-[#25193A] dark:text-white border border-[#8B5CF6]/50' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>SLA &amp; Horários</span>
        </button>
        <button
          onClick={() => setActiveTab('auditoria')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'auditoria' ? 'bg-purple-100 text-[#7C3AED] dark:bg-[#25193A] dark:text-white border border-[#8B5CF6]/50' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Logs &amp; Auditoria</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 0. APP MARKETPLACE (DEFAULT VIEW) */}
      {/* ========================================================================= */}
      {activeTab === 'marketplace' && <MarketplaceView theme={theme} />}

      {/* ========================================================================= */}
      {/* 1. EMPRESA */}
      {/* ========================================================================= */}
      {activeTab === 'empresa' && (
        <div className="p-6 rounded-2xl bg-[#1C1C1E] border border-zinc-800 space-y-5 max-w-2xl">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">Dados do Tenant / Concessionária</h3>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
              Plano: {plan}
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Razão Social / Nome Fantasia *</label>
              <input
                type="text"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#0A0A0B] border border-zinc-700 focus:border-[#8B5CF6] text-white outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">CNPJ *</label>
                <input
                  type="text"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white outline-none font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Telefone Comercial / PABX</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">E-mail Principal para Notificações</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex justify-end">
            <button
              onClick={handleSaveEmpresa}
              className="px-5 py-2.5 rounded-xl bg-[#C4B5FD] hover:bg-[#DDD6FE] text-[#2E1065] font-bold text-xs shadow-md shadow-[#8B5CF6]/20 transition-all flex items-center gap-1.5 cursor-pointer font-['Plus_Jakarta_Sans',sans-serif]"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. UNIDADES */}
      {/* ========================================================================= */}
      {activeTab === 'unidades' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">Showrooms &amp; Lojas Conectadas</h3>
            <button
              onClick={() => setIsNewUnitModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#C4B5FD] hover:bg-[#DDD6FE] text-[#2E1065] font-bold text-xs shadow-md shadow-[#8B5CF6]/20 transition-all flex items-center gap-1.5 cursor-pointer font-['Plus_Jakarta_Sans',sans-serif]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Nova Unidade</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {units.map((unit) => (
              <div
                key={unit.id}
                className="p-5 rounded-2xl bg-[#1C1C1E] border border-zinc-800 space-y-3 text-xs"
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-white text-sm">{unit.name}</h4>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                    Ativa
                  </span>
                </div>

                <p className="text-zinc-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#A78BFA] shrink-0" />
                  <span>{unit.address}</span>
                </p>

                <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-300 font-mono">
                  📞 {unit.phone}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. USUÁRIOS & EQUIPES */}
      {/* ========================================================================= */}
      {activeTab === 'usuarios' && (
        <div className="p-6 rounded-2xl bg-[#1C1C1E] border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">Controle de Acesso &amp; Papéis (RBAC)</h3>
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#C4B5FD] hover:bg-[#DDD6FE] text-[#2E1065] font-bold text-xs shadow-md shadow-[#8B5CF6]/20 transition-all flex items-center gap-1.5 cursor-pointer font-['Plus_Jakarta_Sans',sans-serif]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Convidar Usuário</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-[#0A0A0B] text-zinc-400 uppercase font-semibold text-[10px]">
                  <th className="p-3">Membro da Equipe</th>
                  <th className="p-3">Perfil / Permissão</th>
                  <th className="p-3">Equipe Comercial</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="p-3 flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-[#8B5CF6]/40"
                      />
                      <div>
                        <div className="font-bold text-white">{u.name}</div>
                        <div className="text-[10px] text-zinc-400">{u.email}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-md bg-[#8B5CF6]/20 text-[#DDD6FE] border border-[#8B5CF6]/30 font-bold text-[10px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-zinc-300">{u.team}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                        ● Online
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleUserRole(u.id, u.role)}
                        className="px-2.5 py-1 rounded-lg bg-[#0A0A0B] hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-[11px] transition-colors cursor-pointer"
                        title="Clique para alternar papel de acesso"
                      >
                        Alternar Papel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SLA & HORÁRIOS */}
      {/* ========================================================================= */}
      {activeTab === 'sla' && (
        <div className="p-6 rounded-2xl bg-[#1C1C1E] border border-zinc-800 space-y-4 max-w-xl text-xs">
          <h3 className="font-bold text-white text-base">Políticas de SLA &amp; Plantão de Atendimento</h3>

          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Tempo Limite para Primeiro Contato com o Lead (Minutos):
              </label>
              <input
                type="number"
                value={slaTargetMin}
                onChange={(e) => setSlaTargetMin(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white font-mono"
              />
            </div>

            <div className="p-3 rounded-xl bg-purple-950/20 border border-[#8B5CF6]/30 space-y-1">
              <span className="font-bold text-[#DDD6FE] block">🛡️ Transbordo Automático de Segurança:</span>
              <p className="text-zinc-300 text-[11px]">
                Se o vendedor atribuído não enviar nenhuma resposta ao cliente dentro do prazo de{' '}
                <strong>{slaTargetMin} minutos</strong>, o lead é redistribuído automaticamente para o
                gerente ou plantonista geral.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. AUDITORIA */}
      {/* ========================================================================= */}
      {activeTab === 'auditoria' && (
        <div className="p-6 rounded-2xl bg-[#1C1C1E] border border-zinc-800 space-y-4 text-xs">
          <h3 className="font-bold text-white text-base">Trilha de Auditoria &amp; Logs Imutáveis</h3>

          <div className="space-y-2">
            {[
              { time: 'Hoje às 14:32', user: 'Camila Rocha (SDR)', action: 'Transferiu atendimento de Marcelo Albuquerque para Rodrigo Mendes' },
              { time: 'Hoje às 11:15', user: 'Rodrigo Mendes', action: 'Cadastrou agendamento de Test Drive para Dra. Gabriela Vasconcelos' },
              { time: 'Hoje às 09:04', user: 'Sistema MotorGrid', action: 'Recebeu lead do portal Webmotors Pro (BMW 320i)' },
            ].map((log, i) => (
              <div key={i} className="p-3 rounded-xl bg-[#0A0A0B] border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white">{log.action}</span>
                  <span className="text-zinc-400 block text-[11px]">Por: {log.user}</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Nova Unidade */}
      {isNewUnitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#1C1C1E] border border-zinc-800 p-5 space-y-4 text-xs shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-bold text-white text-sm">Cadastrar Nova Unidade</h3>
              <button
                onClick={() => setIsNewUnitModalOpen(false)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddUnit} className="space-y-3">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Nome da Unidade *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: MotorGrid Alphaville"
                  value={newUnitName}
                  onChange={(e) => setNewUnitName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Endereço</label>
                <input
                  type="text"
                  placeholder="Av. das Américas, 5000"
                  value={newUnitAddress}
                  onChange={(e) => setNewUnitAddress(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Telefone da Loja</label>
                <input
                  type="text"
                  placeholder="+55 (11) 3333-4444"
                  value={newUnitPhone}
                  onChange={(e) => setNewUnitPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsNewUnitModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#C4B5FD] hover:bg-[#DDD6FE] text-[#2E1065] font-bold cursor-pointer"
                >
                  Salvar Unidade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Convidar Usuário */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#1C1C1E] border border-zinc-800 p-5 space-y-4 text-xs shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-bold text-white text-sm">Convidar Membro da Equipe</h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleInviteUser} className="space-y-3">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Lucas Ferreira"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">E-mail Corporativo *</label>
                <input
                  type="email"
                  required
                  placeholder="lucas@motorgrid.com.br"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Perfil de Acesso (Papel)</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white outline-none"
                >
                  <option value="Gestor Geral">Gestor Geral</option>
                  <option value="Vendedor Sênior">Vendedor Sênior</option>
                  <option value="SDR de Pré-Vendas">SDR de Pré-Vendas</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#C4B5FD] hover:bg-[#DDD6FE] text-[#2E1065] font-bold cursor-pointer"
                >
                  Enviar Convite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
