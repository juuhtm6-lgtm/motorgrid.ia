import React, { useState, useEffect } from 'react';
import {
  Share2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Copy,
  ExternalLink,
  ShieldCheck,
  Zap,
  Radio,
  Sliders,
  Play,
  ArrowUpRight,
  MessageSquare,
  Lock,
  Building2,
  HelpCircle,
  Clock,
  Eye,
  EyeOff,
  Filter,
  Layers,
  ArrowRight,
  Smartphone,
  Info,
  Check,
  SlidersHorizontal,
} from 'lucide-react';
import {
  MetaConnection,
  MetaWebhookLog,
  MetaHealthCheckResult,
  AuthUser,
} from '../../types';
import { storageService } from '../../services/storageService';
import { META_TEST_SUITE_SCENARIOS, MetaTestScenario } from '../../data/metaData';
import { useToast } from '../../context/ToastContext';

interface MetaApiViewProps {
  currentUser?: AuthUser | null;
  theme?: 'light' | 'dark';
  onNavigateToAtendimento?: (conversationId?: string) => void;
}

export const MetaApiView: React.FC<MetaApiViewProps> = ({
  currentUser,
  theme = 'dark',
  onNavigateToAtendimento,
}) => {
  const toast = useToast();

  // Multi-tenant state
  const [selectedTenantId, setSelectedTenantId] = useState<string>('tenant-1');
  const [connection, setConnection] = useState<MetaConnection>(() =>
    storageService.getMetaConnection('tenant-1')
  );
  const [logs, setLogs] = useState<MetaWebhookLog[]>(() =>
    storageService.getMetaLogs('tenant-1')
  );

  // Active view tab
  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'whatsapp' | 'instagram' | 'facebook' | 'coexistence' | 'webhooks' | 'testsuite'
  >('overview');

  // UI state
  const [isHealthCheckOpen, setIsHealthCheckOpen] = useState(false);
  const [healthCheckResult, setHealthCheckResult] = useState<MetaHealthCheckResult | null>(null);
  const [isHealthChecking, setIsHealthChecking] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);
  const [showVerifyToken, setShowVerifyToken] = useState(false);
  const [showAppSecret, setShowAppSecret] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Logs filter
  const [logStatusFilter, setLogStatusFilter] = useState<'ALL' | 'PROCESSADO' | 'RECEBIDO' | 'ERRO'>('ALL');
  const [logChannelFilter, setLogChannelFilter] = useState<'ALL' | 'WhatsApp' | 'Instagram' | 'Facebook'>('ALL');

  // Test suite execution states
  const [executingTestId, setExecutingTestId] = useState<string | null>(null);
  const [lastTestResult, setLastTestResult] = useState<{
    testId: string;
    success: boolean;
    message: string;
    conversationId?: string;
  } | null>(null);

  // Sync listener with storageService
  useEffect(() => {
    const updateData = () => {
      setConnection(storageService.getMetaConnection(selectedTenantId));
      setLogs(storageService.getMetaLogs(selectedTenantId));
    };

    updateData();
    const unsubscribe = storageService.subscribe(updateData);
    return () => unsubscribe();
  }, [selectedTenantId]);

  // Handle Tenant Switch (Multi-empresa)
  const handleTenantChange = (tenantId: string) => {
    setSelectedTenantId(tenantId);
    const conn = storageService.getMetaConnection(tenantId);
    setConnection(conn);
    setLogs(storageService.getMetaLogs(tenantId));
    toast.info(`Empresa selecionada: ${conn.tenant_name}`);
  };

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    toast.success(`${label} copiado para a área de transferência!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Health check runner
  const handleRunHealthCheck = () => {
    setIsHealthChecking(true);
    setIsHealthCheckOpen(true);
    setTimeout(() => {
      const result = storageService.runMetaHealthCheck(selectedTenantId);
      setHealthCheckResult(result);
      setIsHealthChecking(false);
      toast.success('Diagnóstico de conexão Meta concluído com sucesso!');
    }, 700);
  };

  // Coexistence toggle
  const handleToggleCoexistence = (enabled: boolean) => {
    storageService.updateMetaConnection(selectedTenantId, {
      coexistence_enabled: enabled,
      coexistence_status: enabled ? 'Ativo' : 'Disponível',
    });

    storageService.addMetaLog({
      tenant_id: selectedTenantId,
      channel: 'WhatsApp',
      event_type: 'coexistence_sync',
      external_id: `coex.toggle.${Date.now()}`,
      sender_id: 'system',
      sender_name: 'Configuração Coexistência',
      content: enabled
        ? 'Modo de coexistência ativado com suporte ao app oficial WhatsApp Business.'
        : 'Modo de coexistência desativado.',
      status: 'PROCESSADO',
      result: enabled
        ? 'OK • Sincronização bidirecional configurada • Deduplicação de atendimentos ativa'
        : 'OK • Coexistência desativada',
    });

    toast.success(
      enabled
        ? 'Modo de Coexistência ativado com sucesso! Mensagens do app nativo serão sincronizadas sem duplicação.'
        : 'Modo de Coexistência desativado.'
    );
  };

  // Run a test scenario
  const handleRunTest = (scenarioId: string) => {
    setExecutingTestId(scenarioId);
    setTimeout(() => {
      const res = storageService.runMetaTestScenario(scenarioId, selectedTenantId);
      setLastTestResult({
        testId: scenarioId,
        success: res.success,
        message: res.resultMessage,
        conversationId: res.conversationId,
      });
      setExecutingTestId(null);
      toast.success(`Teste executado: ${res.scenario.name}`);
    }, 600);
  };

  // Disconnect channel confirmation
  const handleDisconnectChannel = (channel: 'whatsapp' | 'instagram' | 'facebook') => {
    const channelName =
      channel === 'whatsapp' ? 'WhatsApp' : channel === 'instagram' ? 'Instagram' : 'Facebook';
    if (confirm(`Tem certeza que deseja desconectar o canal ${channelName} para ${connection.tenant_name}?`)) {
      const updates: Partial<MetaConnection> = {};
      if (channel === 'whatsapp') updates.whatsapp_status = 'Desconectado';
      if (channel === 'instagram') updates.instagram_status = 'Desconectado';
      if (channel === 'facebook') updates.facebook_status = 'Desconectado';

      storageService.updateMetaConnection(selectedTenantId, updates);
      storageService.addMetaLog({
        tenant_id: selectedTenantId,
        channel: channel === 'whatsapp' ? 'WhatsApp' : channel === 'instagram' ? 'Instagram' : 'Facebook',
        event_type: 'message_received',
        external_id: `disconnect.${Date.now()}`,
        sender_id: 'admin',
        sender_name: currentUser?.name || 'Administrador',
        content: `Canal ${channelName} desconectado manualmente da central Meta.`,
        status: 'PROCESSADO',
        result: 'Canal desativado temporariamente pelo operador',
      });
      toast.info(`Canal ${channelName} desconectado.`);
    }
  };

  // Filtered logs
  const filteredLogs = logs.filter((log) => {
    if (logStatusFilter !== 'ALL' && log.status !== logStatusFilter) return false;
    if (logChannelFilter !== 'ALL' && log.channel !== logChannelFilter) return false;
    return true;
  });

  return (
    <div
      id="meta-api-view"
      className={`min-h-screen p-4 md:p-6 lg:p-8 space-y-6 transition-colors ${
        theme === 'light' ? 'bg-[#F8FAFC] text-slate-900' : 'bg-[#0B0B0E] text-zinc-100'
      }`}
    >
      {/* ========================================================================= */}
      {/* 1. HEADER & MULTIEMPRESA SELECTOR */}
      {/* ========================================================================= */}
      <div
        id="meta-header-card"
        className={`p-5 md:p-6 rounded-2xl border transition-all ${
          theme === 'light'
            ? 'bg-white border-slate-200/90 shadow-sm'
            : 'bg-[#141418] border-white/10 shadow-lg'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title and breadcrumbs */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md">
                <Share2 className="w-5 h-5" />
              </span>
              <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
                CONEXÕES META
              </h1>

              {/* Status Badge */}
              <div
                id="badge-meta-status"
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  connection.status === 'Operacional'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : connection.status === 'Atenção'
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                <span>META API: {connection.status.toUpperCase()}</span>
              </div>

              {/* Environment tag */}
              <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {connection.environment}
              </span>
            </div>

            <p className="text-xs md:text-sm text-[#A1A1AA]">
              “Conecte seus canais Meta ao MotorGrid e centralize seus atendimentos em uma única operação.”
            </p>
          </div>

          {/* Controls: Multi-empresa & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Multiempresa selector */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/20 border border-white/10">
              <Building2 className="w-4 h-4 text-[#8B5CF6] shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[#A1A1AA]">
                  Empresa / Tenant
                </span>
                <select
                  id="select-tenant-meta"
                  value={selectedTenantId}
                  onChange={(e) => handleTenantChange(e.target.value)}
                  className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer text-white pr-2"
                >
                  <option value="tenant-1" className="bg-[#1C1C20] text-white">
                    Grupo MotorGrid Motors (Tenant 1)
                  </option>
                  <option value="tenant-2" className="bg-[#1C1C20] text-white">
                    AutoPrime Veículos (Tenant 2)
                  </option>
                </select>
              </div>
            </div>

            {/* Test Connection Button */}
            <button
              id="btn-test-connection"
              onClick={handleRunHealthCheck}
              disabled={isHealthChecking}
              className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#8B5CF6] ${isHealthChecking ? 'animate-spin' : ''}`} />
              <span>{isHealthChecking ? 'Testando...' : 'TESTAR CONEXÃO'}</span>
            </button>

            {/* Connect Account Button */}
            <button
              id="btn-connect-meta"
              onClick={() => setIsConnectModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md hover:shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>+ CONECTAR CONTA META</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CARDS DE STATUS NO TOPO (WHATSAPP, INSTAGRAM, FACEBOOK) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: WhatsApp */}
        <div
          id="card-status-whatsapp"
          className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${
            theme === 'light'
              ? 'bg-white border-slate-200/90 shadow-sm'
              : 'bg-[#141418] border-white/10 shadow-lg'
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-base shadow-sm">
                WA
              </div>
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  WhatsApp Cloud API
                </h3>
                <span className="text-[11px] text-[#A1A1AA] truncate block max-w-[170px]">
                  {connection.phone_display_name}
                </span>
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                connection.whatsapp_status === 'Conectado'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {connection.whatsapp_status.toUpperCase()}
            </span>
          </div>

          <div className="space-y-2 py-2 border-y border-white/5 text-xs text-[#A1A1AA]">
            <div className="flex justify-between items-center">
              <span>Número conectado:</span>
              <span className="font-mono font-bold text-white">{connection.phone_number}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Qualidade do número:</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {connection.whatsapp_quality}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Mensagens recebidas hoje:</span>
              <span className="font-bold text-white bg-white/5 px-2 py-0.5 rounded-md">
                {connection.messages_today_whatsapp} msgs
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Última sincronização:</span>
              <span className="text-[11px] text-zinc-300">{connection.last_sync_whatsapp}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 text-[11px]">
            <span className="text-[#A1A1AA] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Webhook: {connection.last_webhook_whatsapp}
            </span>
            <button
              id="btn-configure-whatsapp"
              onClick={() => setActiveSubTab('whatsapp')}
              className="text-[#8B5CF6] hover:text-[#A78BFA] font-bold transition-colors cursor-pointer"
            >
              Configurar →
            </button>
          </div>
        </div>

        {/* Card 2: Instagram */}
        <div
          id="card-status-instagram"
          className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${
            theme === 'light'
              ? 'bg-white border-slate-200/90 shadow-sm'
              : 'bg-[#141418] border-white/10 shadow-lg'
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                IG
              </div>
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  Instagram Direct
                </h3>
                <span className="text-[11px] text-[#A1A1AA] truncate block max-w-[170px]">
                  @{connection.instagram_username}
                </span>
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                connection.instagram_status === 'Conectado'
                  ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border-pink-500/30'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {connection.instagram_status.toUpperCase()}
            </span>
          </div>

          <div className="space-y-2 py-2 border-y border-white/5 text-xs text-[#A1A1AA]">
            <div className="flex justify-between items-center">
              <span>Conta Comercial:</span>
              <span className="font-bold text-white">@{connection.instagram_username}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Instagram ID:</span>
              <span className="font-mono text-[11px] text-zinc-300">{connection.instagram_account_id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Mensagens recebidas hoje:</span>
              <span className="font-bold text-white bg-white/5 px-2 py-0.5 rounded-md">
                {connection.messages_today_instagram} msgs
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Última sincronização:</span>
              <span className="text-[11px] text-zinc-300">{connection.last_sync_instagram}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 text-[11px]">
            <span className="text-[#A1A1AA] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-pink-400" />
              Webhook: {connection.last_webhook_instagram}
            </span>
            <button
              id="btn-configure-instagram"
              onClick={() => setActiveSubTab('instagram')}
              className="text-[#8B5CF6] hover:text-[#A78BFA] font-bold transition-colors cursor-pointer"
            >
              Configurar →
            </button>
          </div>
        </div>

        {/* Card 3: Facebook */}
        <div
          id="card-status-facebook"
          className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${
            theme === 'light'
              ? 'bg-white border-slate-200/90 shadow-sm'
              : 'bg-[#141418] border-white/10 shadow-lg'
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-base shadow-sm">
                FB
              </div>
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  Facebook Messenger
                </h3>
                <span className="text-[11px] text-[#A1A1AA] truncate block max-w-[170px]">
                  {connection.facebook_page_name}
                </span>
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                connection.facebook_status === 'Conectado'
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {connection.facebook_status.toUpperCase()}
            </span>
          </div>

          <div className="space-y-2 py-2 border-y border-white/5 text-xs text-[#A1A1AA]">
            <div className="flex justify-between items-center">
              <span>Página vinculada:</span>
              <span className="font-bold text-white truncate max-w-[150px]">{connection.facebook_page_name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Page ID:</span>
              <span className="font-mono text-[11px] text-zinc-300">{connection.facebook_page_id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Mensagens recebidas hoje:</span>
              <span className="font-bold text-white bg-white/5 px-2 py-0.5 rounded-md">
                {connection.messages_today_facebook} msgs
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Última sincronização:</span>
              <span className="text-[11px] text-zinc-300">{connection.last_sync_facebook}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 text-[11px]">
            <span className="text-[#A1A1AA] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-blue-400" />
              Webhook: {connection.last_webhook_facebook}
            </span>
            <button
              id="btn-configure-facebook"
              onClick={() => setActiveSubTab('facebook')}
              className="text-[#8B5CF6] hover:text-[#A78BFA] font-bold transition-colors cursor-pointer"
            >
              Configurar →
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. TABS DE NAVEGAÇÃO INTERNA DO MÓDULO */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-white/10">
        {[
          { id: 'overview', label: 'Visão Geral & App Meta', icon: Sliders },
          { id: 'whatsapp', label: 'WhatsApp Cloud API', icon: Smartphone },
          { id: 'instagram', label: 'Instagram Direct', icon: Share2 },
          { id: 'facebook', label: 'Facebook Messenger', icon: MessageSquare },
          { id: 'coexistence', label: 'Modo de Coexistência', icon: Radio },
          { id: 'webhooks', label: 'Webhooks & Logs Técnicos', icon: Layers },
          { id: 'testsuite', label: 'Suíte de Testes (8 Cenários)', icon: Play },
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`meta-subtab-${tab.id}`}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#8B5CF6] text-white shadow-md'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 4. CONTEÚDO DAS ABAS */}
      {/* ========================================================================= */}

      {/* ----------------- ABA 1: VISÃO GERAL & APP META ----------------- */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Card: Dados do Aplicativo Meta */}
          <div
            className={`p-6 rounded-2xl border ${
              theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#141418] border-white/10'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-5">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#8B5CF6]" />
                  Configuração do Aplicativo Meta
                </h3>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  Parâmetros de autenticação oficial e chaves de integração do Business Manager.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#A1A1AA]">Ambiente:</span>
                <button
                  onClick={() => {
                    const nextEnv = connection.environment === 'Produção' ? 'Teste' : 'Produção';
                    storageService.updateMetaConnection(selectedTenantId, { environment: nextEnv });
                    toast.info(`Ambiente alterado para: ${nextEnv}`);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    connection.environment === 'Produção'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {connection.environment} (Alternar)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* App ID */}
              <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                <span className="text-[11px] text-[#A1A1AA] block font-medium">App ID (Meta for Developers)</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-xs font-bold text-white">{connection.app_id}</span>
                  <button
                    onClick={() => handleCopy(connection.app_id, 'App ID')}
                    className="p-1 hover:bg-white/10 rounded transition-colors text-[#A1A1AA] hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Business Account ID */}
              <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                <span className="text-[11px] text-[#A1A1AA] block font-medium">Business Account ID</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-xs font-bold text-white">{connection.business_id}</span>
                  <button
                    onClick={() => handleCopy(connection.business_id, 'Business ID')}
                    className="p-1 hover:bg-white/10 rounded transition-colors text-[#A1A1AA] hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* WABA ID */}
              <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                <span className="text-[11px] text-[#A1A1AA] block font-medium">WhatsApp Business Account (WABA) ID</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-xs font-bold text-white">{connection.waba_id}</span>
                  <button
                    onClick={() => handleCopy(connection.waba_id, 'WABA ID')}
                    className="p-1 hover:bg-white/10 rounded transition-colors text-[#A1A1AA] hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Phone Number ID */}
              <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                <span className="text-[11px] text-[#A1A1AA] block font-medium">Phone Number ID</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-xs font-bold text-white">{connection.phone_number_id}</span>
                  <button
                    onClick={() => handleCopy(connection.phone_number_id, 'Phone Number ID')}
                    className="p-1 hover:bg-white/10 rounded transition-colors text-[#A1A1AA] hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Page ID */}
              <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                <span className="text-[11px] text-[#A1A1AA] block font-medium">Facebook Page ID</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-xs font-bold text-white">{connection.facebook_page_id}</span>
                  <button
                    onClick={() => handleCopy(connection.facebook_page_id, 'Page ID')}
                    className="p-1 hover:bg-white/10 rounded transition-colors text-[#A1A1AA] hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Instagram Account ID */}
              <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                <span className="text-[11px] text-[#A1A1AA] block font-medium">Instagram Business ID</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-xs font-bold text-white">{connection.instagram_account_id}</span>
                  <button
                    onClick={() => handleCopy(connection.instagram_account_id, 'Instagram ID')}
                    className="p-1 hover:bg-white/10 rounded transition-colors text-[#A1A1AA] hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Webhook Endpoint & Verify Token Bar */}
            <div className="mt-5 p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex-1">
                  <span className="text-[11px] uppercase font-bold text-[#8B5CF6] block">
                    URL de Callback do Webhook (Endpoint Seguro)
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="px-2.5 py-1.5 rounded-lg bg-black/40 text-xs font-mono text-emerald-400 select-all border border-emerald-500/20">
                      {connection.webhook_url}
                    </code>
                    <button
                      onClick={() => handleCopy(connection.webhook_url, 'Webhook URL')}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/10 text-white flex items-center gap-1 border border-white/10 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </button>
                  </div>
                </div>

                <div className="flex-1">
                  <span className="text-[11px] uppercase font-bold text-[#8B5CF6] block">
                    Verify Token (Meta Webhook Handshake)
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="px-2.5 py-1.5 rounded-lg bg-black/40 text-xs font-mono text-zinc-300 border border-white/10">
                      {showVerifyToken ? 'motorgrid_meta_secure_token_2025' : connection.verify_token_masked}
                    </code>
                    <button
                      onClick={() => setShowVerifyToken(!showVerifyToken)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white transition-colors"
                      title={showVerifyToken ? 'Ocultar' : 'Visualizar'}
                    >
                      {showVerifyToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleCopy('motorgrid_meta_secure_token_2025', 'Verify Token')}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/10 text-white flex items-center gap-1 border border-white/10 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Banner Requirement */}
              <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-xs text-[#A1A1AA]">
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  <strong>Segurança Criptográfica:</strong> App Secret e Access Tokens permanentes são mantidos exclusivamente no backend seguro. O frontend opera apenas com chaves mascaradas.
                </span>
              </div>
            </div>
          </div>

          {/* Quick Flow to Atendimento Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#8B5CF6]" />
                Integração Ativa com a Tela de Atendimento
              </h4>
              <p className="text-xs text-zinc-300">
                Todas as mensagens recebidas via WhatsApp, Instagram Direct ou Facebook Messenger são direcionadas automaticamente para a tela de Atendimento do CRM sem alteração de layout.
              </p>
            </div>
            <button
              onClick={() => onNavigateToAtendimento?.()}
              className="px-4 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-md"
            >
              <span>Abrir Central de Atendimento</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ----------------- ABA 2: WHATSAPP CLOUD API ----------------- */}
      {activeSubTab === 'whatsapp' && (
        <div className="space-y-6">
          <div
            className={`p-6 rounded-2xl border ${
              theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#141418] border-white/10'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5 mb-5">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2 text-emerald-400">
                  <Smartphone className="w-5 h-5" />
                  Configuração WhatsApp Business Cloud API
                </h3>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  Conexão oficial da Meta para tráfego de mensagens, disparo de templates e atendimento ao vivo.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRunTest('test-1')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Testar Mensagem Inbound</span>
                </button>
                <button
                  onClick={() => handleDisconnectChannel('whatsapp')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                >
                  Desconectar Canal
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3 p-4 rounded-xl bg-black/20 border border-white/5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Status da Conexão:</span>
                  <span className="font-bold text-emerald-400">{connection.whatsapp_status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Número Conectado:</span>
                  <span className="font-mono font-bold text-white">{connection.phone_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Nome de Exibição:</span>
                  <span className="font-bold text-white">{connection.phone_display_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Qualidade do Número:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {connection.whatsapp_quality}
                  </span>
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-xl bg-black/20 border border-white/5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Phone Number ID:</span>
                  <span className="font-mono text-zinc-300">{connection.phone_number_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">WABA ID:</span>
                  <span className="font-mono text-zinc-300">{connection.waba_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Status do Webhook:</span>
                  <span className="font-bold text-emerald-400">{connection.webhook_status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Último evento recebido:</span>
                  <span className="font-mono text-zinc-300">{connection.last_webhook_whatsapp}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- ABA 3: INSTAGRAM DIRECT ----------------- */}
      {activeSubTab === 'instagram' && (
        <div className="space-y-6">
          <div
            className={`p-6 rounded-2xl border ${
              theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#141418] border-white/10'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5 mb-5">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2 text-pink-400">
                  <Share2 className="w-5 h-5" />
                  Configuração Instagram Messaging
                </h3>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  Conexão direta com a caixa de entrada do Instagram para responder Direct Messages pelo CRM.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRunTest('test-5')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Testar Mensagem Direct</span>
                </button>
                <button
                  onClick={() => handleDisconnectChannel('instagram')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                >
                  Desconectar Canal
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3 p-4 rounded-xl bg-black/20 border border-white/5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Status:</span>
                  <span className="font-bold text-pink-400">{connection.instagram_status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Nome de Usuário:</span>
                  <span className="font-bold text-white">@{connection.instagram_username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">ID da Conta Comercial:</span>
                  <span className="font-mono text-zinc-300">{connection.instagram_account_id}</span>
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-xl bg-black/20 border border-white/5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Página do Facebook Vinculada:</span>
                  <span className="font-bold text-white truncate max-w-[200px]">{connection.facebook_page_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Mensagens Hoje:</span>
                  <span className="font-bold text-white">{connection.messages_today_instagram} msgs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Último Webhook:</span>
                  <span className="font-mono text-zinc-300">{connection.last_webhook_instagram}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- ABA 4: FACEBOOK MESSENGER ----------------- */}
      {activeSubTab === 'facebook' && (
        <div className="space-y-6">
          <div
            className={`p-6 rounded-2xl border ${
              theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#141418] border-white/10'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5 mb-5">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
                  <MessageSquare className="w-5 h-5" />
                  Configuração Facebook Messenger
                </h3>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  Recepção e envio de mensagens para páginas oficiais e anúncios com objetivo de engajamento no Messenger.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRunTest('test-6')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Testar Mensagem Messenger</span>
                </button>
                <button
                  onClick={() => handleDisconnectChannel('facebook')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                >
                  Desconectar Canal
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3 p-4 rounded-xl bg-black/20 border border-white/5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Status:</span>
                  <span className="font-bold text-blue-400">{connection.facebook_status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Página Conectada:</span>
                  <span className="font-bold text-white">{connection.facebook_page_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Page ID:</span>
                  <span className="font-mono text-zinc-300">{connection.facebook_page_id}</span>
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-xl bg-black/20 border border-white/5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Mensagens Hoje:</span>
                  <span className="font-bold text-white">{connection.messages_today_facebook} msgs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Último Webhook:</span>
                  <span className="font-mono text-zinc-300">{connection.last_webhook_facebook}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- ABA 5: MODO DE COEXISTÊNCIA ----------------- */}
      {activeSubTab === 'coexistence' && (
        <div className="space-y-6">
          <div
            className={`p-6 rounded-2xl border ${
              theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#141418] border-white/10'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5 mb-5">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Radio className="w-5 h-5 text-[#8B5CF6]" />
                  Modo de Coexistência (WhatsApp Business App + MotorGrid)
                </h3>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  “Defina como o canal será utilizado entre o aplicativo nativo e o MotorGrid.”
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#A1A1AA]">
                  Status: <strong className="text-white">{connection.coexistence_status}</strong>
                </span>
                <button
                  id="btn-toggle-coexistence"
                  onClick={() => handleToggleCoexistence(!connection.coexistence_enabled)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    connection.coexistence_enabled
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      connection.coexistence_enabled ? 'bg-white' : 'bg-zinc-400'
                    }`}
                  />
                  <span>{connection.coexistence_enabled ? 'COEXISTÊNCIA ATIVA' : 'ATIVAR COEXISTÊNCIA'}</span>
                </button>
              </div>
            </div>

            {/* Informações detalhadas do modo de coexistência */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-2.5">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Sincronização Bidirecional sem Duplicação
                </h4>
                <p className="text-[#A1A1AA] leading-relaxed">
                  Quando ativado, os vendedores podem continuar enviando mensagens pelo aplicativo WhatsApp Business no celular. O MotorGrid captura todas as respostas, sincroniza o histórico na conversa correta e não gera atendimentos duplicados nem notificações falsas de novos leads.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-2.5">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#8B5CF6]" />
                  Validação de Suporte da Conta
                </h4>
                <div className="space-y-1.5 text-[#A1A1AA]">
                  <div className="flex justify-between">
                    <span>Compatibilidade com WABA Oficial:</span>
                    <span className="font-bold text-emerald-400">Compatível</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deduplicação por Checksum:</span>
                    <span className="font-bold text-emerald-400">Ativa</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Controle de SLA Integrado:</span>
                    <span className="font-bold text-emerald-400">Mantido</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- ABA 6: WEBHOOKS & LOGS TÉCNICOS ----------------- */}
      {activeSubTab === 'webhooks' && (
        <div className="space-y-6">
          <div
            className={`p-6 rounded-2xl border ${
              theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#141418] border-white/10'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5 mb-5">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#8B5CF6]" />
                  Logs Técnicos de Webhooks & Diagnósticos
                </h3>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  Registro em tempo real de payloads recebidos, status de processamento e roteamento para o CRM.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Filter status */}
                <select
                  value={logStatusFilter}
                  onChange={(e) => setLogStatusFilter(e.target.value as any)}
                  className="px-3 py-1.5 rounded-lg text-xs bg-black/40 border border-white/10 text-white font-semibold"
                >
                  <option value="ALL">Todos os Status</option>
                  <option value="PROCESSADO">Processados (200 OK)</option>
                  <option value="RECEBIDO">Recebidos</option>
                  <option value="ERRO">Erros</option>
                </select>

                {/* Filter channel */}
                <select
                  value={logChannelFilter}
                  onChange={(e) => setLogChannelFilter(e.target.value as any)}
                  className="px-3 py-1.5 rounded-lg text-xs bg-black/40 border border-white/10 text-white font-semibold"
                >
                  <option value="ALL">Todos os Canais</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                </select>

                <button
                  onClick={() => storageService.clearMetaLogs(selectedTenantId)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#A1A1AA] hover:text-rose-400 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Limpar Logs
                </button>
              </div>
            </div>

            {/* Tabela de logs */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-[#A1A1AA] text-[11px] uppercase font-bold">
                    <th className="pb-3 px-3">Data / Hora</th>
                    <th className="pb-3 px-3">Canal</th>
                    <th className="pb-3 px-3">Evento</th>
                    <th className="pb-3 px-3">Remetente</th>
                    <th className="pb-3 px-3">Conteúdo / Mensagem</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3">Resultado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-[#A1A1AA]">
                        Nenhum log encontrado para os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-3 font-mono text-zinc-400 whitespace-nowrap">
                          {log.received_at}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              log.channel === 'WhatsApp'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : log.channel === 'Instagram'
                                ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            }`}
                          >
                            {log.channel}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-zinc-300">
                          {log.event_type}
                        </td>
                        <td className="py-3 px-3 text-white font-semibold whitespace-nowrap">
                          {log.sender_name}
                          {log.sender_phone && (
                            <span className="block text-[10px] text-[#A1A1AA] font-mono">
                              {log.sender_phone}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-zinc-300 max-w-xs truncate" title={log.content}>
                          {log.content}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              log.status === 'PROCESSADO'
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : log.status === 'ERRO'
                                ? 'bg-rose-500/15 text-rose-400'
                                : 'bg-blue-500/15 text-blue-400'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-[11px] text-[#A1A1AA] max-w-sm truncate" title={log.result}>
                          {log.result}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- ABA 7: SUÍTE DE TESTES OBRIGATÓRIOS (8 CENÁRIOS) ----------------- */}
      {activeSubTab === 'testsuite' && (
        <div className="space-y-6">
          <div
            className={`p-6 rounded-2xl border ${
              theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#141418] border-white/10'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5 mb-5">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2 text-indigo-400">
                  <Play className="w-5 h-5" />
                  Suíte de Testes Automatizados (8 Cenários Obrigatórios)
                </h3>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  Execute cada cenário em 1 clique para simular o comportamento de ponta a ponta e validar a chegada no Atendimento.
                </p>
              </div>

              {lastTestResult && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-white">Último teste: {lastTestResult.message}</span>
                  {lastTestResult.conversationId && (
                    <button
                      onClick={() => onNavigateToAtendimento?.(lastTestResult.conversationId)}
                      className="ml-2 px-2.5 py-1 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-[11px] transition-colors"
                    >
                      Ver no Atendimento →
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Grid dos 8 Testes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {META_TEST_SUITE_SCENARIOS.map((scenario, index) => {
                const isRunning = executingTestId === scenario.id;
                return (
                  <div
                    key={scenario.id}
                    id={`test-card-${scenario.id}`}
                    className="p-4 rounded-xl bg-black/20 border border-white/10 hover:border-white/20 transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-black text-white">{scenario.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            scenario.channel === 'WhatsApp'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : scenario.channel === 'Instagram'
                              ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {scenario.channel}
                        </span>
                      </div>

                      <p className="text-xs text-[#A1A1AA] leading-relaxed">
                        {scenario.description}
                      </p>

                      <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-[11px] space-y-1">
                        <span className="text-zinc-400 font-bold block">Regra testada: {scenario.ruleTested}</span>
                        <span className="text-zinc-500 block truncate">
                          Remetente: {scenario.samplePayload.senderName}
                        </span>
                        <span className="text-zinc-300 italic block truncate">
                          "{scenario.samplePayload.text}"
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-white/5">
                      <span className="text-[10px] text-[#A1A1AA]">
                        Valida fluxo: Webhook → CRM Atendimento
                      </span>
                      <button
                        id={`btn-run-${scenario.id}`}
                        onClick={() => handleRunTest(scenario.id)}
                        disabled={isRunning}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#8B5CF6] hover:bg-[#7C3AED] text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                      >
                        {isRunning ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Executando...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3" />
                            <span>Executar Teste</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: HEALTH CHECK DIAGNÓSTICO EM TEMPO REAL */}
      {/* ========================================================================= */}
      {isHealthCheckOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div
            id="modal-health-check"
            className="w-full max-w-lg rounded-2xl bg-[#141418] border border-white/10 p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  Diagnóstico da Conexão Meta API
                </h3>
              </div>
              <button
                onClick={() => setIsHealthCheckOpen(false)}
                className="p-1 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>

            {isHealthChecking ? (
              <div className="py-8 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-[#8B5CF6] animate-spin mx-auto" />
                <p className="text-xs text-zinc-300">Pingando servidores Meta Graph API e validando Webhooks...</p>
              </div>
            ) : healthCheckResult ? (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-300">
                      Todos os canais Meta estão 100% operacionais
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {healthCheckResult.latencyMs} ms
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/20 border border-white/5">
                    <span className="text-zinc-300">WhatsApp Cloud API (WABA):</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Conectado (200 OK)
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/20 border border-white/5">
                    <span className="text-zinc-300">Instagram Direct Messaging API:</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Conectado (200 OK)
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/20 border border-white/5">
                    <span className="text-zinc-300">Facebook Messenger API:</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Conectado (200 OK)
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/20 border border-white/5">
                    <span className="text-zinc-300">Endpoint de Webhook (SSL/TLS):</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Ativo & Ouvindo
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <button
                    onClick={() => setIsHealthCheckOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    Fechar Diagnóstico
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: CONECTAR CONTA META */}
      {/* ========================================================================= */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div
            id="modal-connect-meta"
            className="w-full max-w-md rounded-2xl bg-[#141418] border border-white/10 p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">
                  Conectar Canais Meta
                </h3>
              </div>
              <button
                onClick={() => setIsConnectModalOpen(false)}
                className="p-1 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#A1A1AA]">
              Vincule sua conta do Meta Business Suite para habilitar o recebimento automático de mensagens na central de Atendimento do CRM.
            </p>

            <div className="space-y-3 text-xs">
              <label className="flex items-center gap-2 p-3 rounded-xl bg-black/20 border border-white/10 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded accent-[#8B5CF6]" />
                <div>
                  <strong className="block text-white">WhatsApp Business Cloud API</strong>
                  <span className="text-[11px] text-[#A1A1AA]">Número corporativo oficial (+55 11 98900-5544)</span>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl bg-black/20 border border-white/10 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded accent-[#8B5CF6]" />
                <div>
                  <strong className="block text-white">Instagram Direct Messaging</strong>
                  <span className="text-[11px] text-[#A1A1AA]">Perfil oficial @motorgrid.oficial</span>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl bg-black/20 border border-white/10 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded accent-[#8B5CF6]" />
                <div>
                  <strong className="block text-white">Facebook Messenger</strong>
                  <span className="text-[11px] text-[#A1A1AA]">Página Grupo MotorGrid Motors</span>
                </div>
              </label>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsConnectModalOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#A1A1AA] hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  storageService.updateMetaConnection(selectedTenantId, {
                    whatsapp_status: 'Conectado',
                    instagram_status: 'Conectado',
                    facebook_status: 'Conectado',
                    status: 'Operacional',
                  });
                  toast.success('Canais Meta sincronizados e conectados com sucesso!');
                  setIsConnectModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md"
              >
                Concluir Conexão Meta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
