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
} from 'lucide-react';
import { initialAuthUsers, initialTenants } from '../../data/mockData';
import { AuthUser, TenantUnit } from '../../types';

export const AjustesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'empresa' | 'unidades' | 'usuarios' | 'sla' | 'auditoria'>('empresa');
  const [users, setUsers] = useState<AuthUser[]>(initialAuthUsers);
  const [tenantName, setTenantName] = useState('MotorGrid Motors Premium');
  const [cnpj, setCnpj] = useState('12.345.678/0001-90');
  const [phone, setPhone] = useState('+55 (11) 3090-9900');
  const [email, setEmail] = useState('contato@motorgridmotors.com.br');
  const [slaTargetMin, setSlaTargetMin] = useState(3);
  const [plan, setPlan] = useState('Enterprise Multi-Store');

  return (
    <div className="space-y-6">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Configurações &amp; Multiempresa</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Gestão de unidades, controle de acesso RBAC, horários de plantão e auditoria
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#1C1C1E] border border-zinc-800 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('empresa')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'empresa' ? 'bg-[#8B5CF6] text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Empresa
          </button>
          <button
            onClick={() => setActiveTab('unidades')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'unidades' ? 'bg-[#8B5CF6] text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Unidades / Lojas
          </button>
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'usuarios' ? 'bg-[#8B5CF6] text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Usuários &amp; Equipes
          </button>
          <button
            onClick={() => setActiveTab('sla')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sla' ? 'bg-[#8B5CF6] text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            SLA &amp; Horários
          </button>
          <button
            onClick={() => setActiveTab('auditoria')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'auditoria' ? 'bg-[#8B5CF6] text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Logs &amp; Auditoria
          </button>
        </div>
      </div>

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
              onClick={() => alert('Dados da concessionária atualizados com sucesso!')}
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
              onClick={() => alert('Cadastrar nova unidade')}
              className="px-3.5 py-2 rounded-xl bg-[#C4B5FD] hover:bg-[#DDD6FE] text-[#2E1065] font-bold text-xs shadow-md shadow-[#8B5CF6]/20 transition-all flex items-center gap-1.5 cursor-pointer font-['Plus_Jakarta_Sans',sans-serif]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Nova Unidade</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {initialTenants[0].units.map((unit) => (
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
              onClick={() => alert('Convidar novo usuário para a equipe')}
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
                        onClick={() => alert(`Editar permissões de ${u.name}`)}
                        className="px-2.5 py-1 rounded-lg bg-[#0A0A0B] hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-[11px] transition-colors cursor-pointer"
                      >
                        Editar
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
    </div>
  );
};
