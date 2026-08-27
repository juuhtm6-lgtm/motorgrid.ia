import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Users,
  Key,
  Shield,
  Bell,
  Plus,
  Trash2,
  Copy,
  Check,
  CheckCircle2,
  Play,
  RotateCw,
  X,
  Lock,
  Car,
} from 'lucide-react';
import { TeamMember, WebhookEndpoint } from '../../types';

interface SettingsViewProps {
  teamMembers: TeamMember[];
  webhooks: WebhookEndpoint[];
  onAddTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  onAddWebhook: (webhook: Omit<WebhookEndpoint, 'id'>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  teamMembers,
  webhooks,
  onAddTeamMember,
  onAddWebhook,
}) => {
  const [activeTab, setActiveTab] = useState<'company' | 'team' | 'api' | 'security'>('company');

  // Company State
  const [companyName, setCompanyName] = useState('MotorGrid Automotive Technology Ltda.');
  const [cnpj, setCnpj] = useState('44.921.830/0001-95');
  const [timezone, setTimezone] = useState('America/Sao_Paulo (GMT-3)');
  const [currency, setCurrency] = useState('BRL (R$)');
  const [savedCompany, setSavedCompany] = useState(false);

  // Team Invite Modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamMember['role']>('Customer Success');

  // Webhook Modal
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookEvents, setWebhookEvents] = useState('telemetry.alert, vehicle.connected, invoice.paid');

  // API Key State
  const [apiKey, setApiKey] = useState('mg_live_9f82a184b29c4819e99a8174_motorgrid');
  const [copiedKey, setCopiedKey] = useState(false);
  const [webhookTestStatus, setWebhookTestStatus] = useState<string | null>(null);

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedCompany(true);
    setTimeout(() => setSavedCompany(false), 2500);
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;

    onAddTeamMember({
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      status: 'Ativo',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      lastLogin: 'Nunca',
    });

    setInviteName('');
    setInviteEmail('');
    setIsInviteModalOpen(false);
  };

  const handleWebhookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookUrl) return;

    onAddWebhook({
      url: webhookUrl,
      events: webhookEvents.split(',').map((s) => s.trim()),
      status: 'Ativo',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      lastTriggered: 'Aguardando primeiro evento',
    });

    setWebhookUrl('');
    setIsWebhookModalOpen(false);
  };

  const handleTestWebhook = (url: string) => {
    setWebhookTestStatus('Enviando telemetria de teste...');
    setTimeout(() => {
      setWebhookTestStatus(`Telemetria de teste enviada com sucesso para ${url} (HTTP 200 OK)`);
      setTimeout(() => setWebhookTestStatus(null), 3500);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15">
        <button
          onClick={() => setActiveTab('company')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'company'
              ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/25'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Empresa & Dados Cadastrais
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'team'
              ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/25'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Membros da Equipe ({teamMembers.length})
        </button>

        <button
          onClick={() => setActiveTab('api')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'api'
              ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/25'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Key className="w-4 h-4" />
          Chaves de API & Webhooks MotorGrid
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'security'
              ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/25'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Shield className="w-4 h-4" />
          Segurança Automotiva & LGPD
        </button>
      </div>

      {/* TAB 1: COMPANY */}
      {activeTab === 'company' && (
        <div className="p-6 rounded-3xl bg-[#1C1C1E] border border-[#8B5CF6]/15 shadow-xl max-w-2xl">
          <h3 className="text-sm font-bold text-white mb-4">Informações do Workspace MotorGrid</h3>
          <form onSubmit={handleSaveCompany} className="space-y-4 text-xs">
            <div>
              <label className="text-zinc-300 font-semibold">Razão Social / Nome da Concessionária ou Operadora</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-200 focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-300 font-semibold">CNPJ</label>
                <input
                  type="text"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-200 focus:outline-none focus:border-[#8B5CF6] font-mono"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-semibold">Moeda Base</label>
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-200 focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-300 font-semibold">Fuso Horário Padrão</label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-200 focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold transition-all shadow-lg shadow-[#8B5CF6]/25 cursor-pointer"
              >
                Salvar Alterações
              </button>
              {savedCompany && (
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Dados cadastrais atualizados com sucesso!
                </span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: TEAM MEMBERS */}
      {activeTab === 'team' && (
        <div className="p-6 rounded-3xl bg-[#1C1C1E] border border-[#8B5CF6]/15 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Membros da Equipe & Permissões MotorGrid</h3>
              <p className="text-xs text-zinc-400">Gerencie acessos por perfil de telemetria e frotas</p>
            </div>
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold transition-all shadow-lg shadow-[#8B5CF6]/25 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Convidar Membro</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A0A0B]/80 border-b border-zinc-800 text-zinc-400 font-semibold uppercase">
                <tr>
                  <th className="px-4 py-3">Membro</th>
                  <th className="px-4 py-3">Cargo / Função</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Último Acesso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-[#8B5CF6]/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-700"
                        />
                        <div>
                          <div className="font-bold text-white">{member.name}</div>
                          <div className="text-[11px] text-zinc-400">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-[#0A0A0B] text-zinc-200 border border-zinc-800">
                        {member.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                        {member.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-400 font-mono">{member.lastLogin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: API & WEBHOOKS */}
      {activeTab === 'api' && (
        <div className="space-y-6">
          {/* API Key Box */}
          <div className="p-6 rounded-3xl bg-[#1C1C1E] border border-[#8B5CF6]/15 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-[#A78BFA]" />
              Chave de API do Workspace MotorGrid
            </h3>
            <p className="text-xs text-zinc-400">
              Utilize esta chave para integrar com seus servidores de telemetria OBD-II / CAN-Bus ou ERPs automotivos (SAP, Protheus).
            </p>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#0A0A0B] border border-zinc-800 max-w-xl">
              <span className="font-mono text-xs text-zinc-300 flex-1 truncate">{apiKey}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(apiKey);
                  setCopiedKey(true);
                  setTimeout(() => setCopiedKey(false), 2000);
                }}
                className="px-3 py-1 rounded-lg bg-[#1C1C1E] hover:bg-zinc-800 text-zinc-200 text-xs font-semibold transition-colors flex items-center gap-1 shrink-0 cursor-pointer border border-zinc-700"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>

          {/* Webhooks Box */}
          <div className="p-6 rounded-3xl bg-[#1C1C1E] border border-[#8B5CF6]/15 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Endpoints de Webhook de Telemetria</h3>
                <p className="text-xs text-zinc-400">Receba notificações HTTP em tempo real de diagnósticos e faturas</p>
              </div>
              <button
                onClick={() => setIsWebhookModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold transition-all shadow-lg shadow-[#8B5CF6]/25 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Webhook</span>
              </button>
            </div>

            {webhookTestStatus && (
              <div className="p-3 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-xs text-[#DDD6FE] flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{webhookTestStatus}</span>
              </div>
            )}

            <div className="space-y-3">
              {webhooks.map((wh) => (
                <div
                  key={wh.id}
                  className="p-4 rounded-2xl bg-[#0A0A0B] border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="font-mono font-bold text-white truncate max-w-md">{wh.url}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {wh.events.map((ev, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-[#1C1C1E] text-[#C4B5FD] border border-[#8B5CF6]/30">
                          {ev}
                        </span>
                      ))}
                    </div>
                    <div className="text-[11px] text-zinc-500 font-mono">Último disparo: {wh.lastTriggered}</div>
                  </div>

                  <button
                    onClick={() => handleTestWebhook(wh.url)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C1C1E] hover:bg-zinc-800 text-zinc-300 text-xs font-semibold shrink-0 cursor-pointer border border-zinc-700"
                  >
                    <Play className="w-3 h-3 text-emerald-400" />
                    Testar Disparo
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY & LGPD */}
      {activeTab === 'security' && (
        <div className="p-6 rounded-3xl bg-[#1C1C1E] border border-[#8B5CF6]/15 shadow-xl space-y-4 max-w-2xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            Políticas de Segurança Automotiva (ISO/SAE 21434) e Conformidade LGPD
          </h3>
          <p className="text-xs text-zinc-400">
            Ambiente com criptografia AES-256 de dados CAN-Bus em repouso e TLS 1.3 em trânsito com certificação automotiva e conformidade LGPD.
          </p>

          <div className="space-y-3 pt-2 text-xs">
            <div className="p-4 rounded-xl bg-[#0A0A0B] border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Autenticação de Dois Fatores (2FA) Obrigatória</div>
                <div className="text-[11px] text-zinc-400">Exigir 2FA para todos os administradores e engenheiros</div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                Ativo
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0A0B] border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Exportação de Relatório de Auditoria LGPD & Telemetria</div>
                <div className="text-[11px] text-zinc-400">Download dos logs de acesso a dados veiculares e clientes</div>
              </div>
              <button
                onClick={() => alert('Download do arquivo de auditoria MotorGrid_LGPD_logs_2026.json concluído.')}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold cursor-pointer"
              >
                Exportar Logs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="fixed inset-0 -z-10" onClick={() => setIsInviteModalOpen(false)} />
          <div className="w-full max-w-md rounded-3xl bg-[#1C1C1E] border border-[#8B5CF6]/30 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white">Convidar Novo Membro da Equipe</h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 font-semibold">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Ex: Gabriel Barbosa"
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-200 focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-semibold">E-mail Corporativo</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Ex: gabriel@motorgrid.com"
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-200 focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-semibold">Função / Perfil de Acesso</label>
                <select
                  value={inviteRole}
                  onChange={(e: any) => setInviteRole(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-200 focus:outline-none focus:border-[#8B5CF6]"
                >
                  <option value="Administrador">Administrador</option>
                  <option value="Gestor de Vendas">Gestor de Vendas</option>
                  <option value="Customer Success">Customer Success</option>
                  <option value="Desenvolvedor">Engenheiro de Telemetria</option>
                  <option value="Analista">Analista de Dados</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-3 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold shadow-lg shadow-[#8B5CF6]/25 cursor-pointer"
                >
                  Enviar Convite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Webhook Modal */}
      {isWebhookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="fixed inset-0 -z-10" onClick={() => setIsWebhookModalOpen(false)} />
          <div className="w-full max-w-md rounded-3xl bg-[#1C1C1E] border border-[#8B5CF6]/30 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white">Cadastrar Novo Webhook de Telemetria</h3>
              <button onClick={() => setIsWebhookModalOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleWebhookSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 font-semibold">URL de Destino (HTTPS)</label>
                <input
                  type="url"
                  required
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://api.empresa.com.br/motorgrid/telemetry-events"
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-200 focus:outline-none focus:border-[#8B5CF6] font-mono"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-semibold">Eventos para Escutar (separados por vírgula)</label>
                <input
                  type="text"
                  value={webhookEvents}
                  onChange={(e) => setWebhookEvents(e.target.value)}
                  placeholder="telemetry.alert, vehicle.connected, invoice.paid"
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-200 focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsWebhookModalOpen(false)}
                  className="px-3 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold shadow-lg shadow-[#8B5CF6]/25 cursor-pointer"
                >
                  Salvar Webhook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
