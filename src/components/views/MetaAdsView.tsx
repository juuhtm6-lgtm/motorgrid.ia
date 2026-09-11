import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Upload,
  BarChart3,
  Users,
  Target,
  ExternalLink,
  MessageCircle,
  Phone,
  ShieldCheck,
  Zap,
  Globe,
  Award,
  Layers,
  ArrowRight,
  Info,
  Clock,
  Car,
  FileText,
  DollarSign,
  PieChart as PieIcon,
  HelpCircle,
  Maximize2,
  Eye,
  Sliders,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  MetaCampaign,
  MetaAd,
  MetaLeadTracking,
  MetaPerformanceByVehicle,
  MetaDailyDataPoint,
  MetaAccountConfig,
  MetaPeriodFilter,
} from '../../types';
import {
  initialMetaAccountConfig,
  initialMetaCampaigns,
  initialMetaAds,
  initialMetaLeadsTracking,
  initialMetaPerformanceByVehicle,
  initialMetaDailyTrends,
  initialMetaInsights,
} from '../../data/mockMetaAdsData';
import { initialAuthUsers } from '../../data/mockData';
import { CampaignDetailModal } from '../metaAds/CampaignDetailModal';
import { MetaConnectModal } from '../metaAds/MetaConnectModal';
import { ExecutiveDashboardView } from '../metaAds/ExecutiveDashboardView';
import { GridIALogoFull } from '../brand/GridIALogoFull';
import { useToast } from '../../context/ToastContext';

interface MetaAdsViewProps {
  initialSubTab?:
    | 'visao-geral'
    | 'dashboard-ads'
    | 'relatorio-atendimentos'
    | 'funil-comercial'
    | 'campanhas'
    | 'anuncios'
    | 'relatorio-leads'
    | 'conversoes'
    | 'vendedores'
    | 'veiculos'
    | 'rankings'
    | 'integracao'
    | 'visao-dono';
  onNavigateToChat?: (lead: { id: string; name: string; phone: string }) => void;
}

export const MetaAdsView: React.FC<MetaAdsViewProps> = ({
  initialSubTab = 'visao-geral',
  onNavigateToChat,
}) => {
  const toast = useToast();
  // Navigation tabs
  const [activeTabMode, setActiveTabMode] = useState<
    'dashboard-ads' | 'campanhas' | 'anuncios' | 'relatorio-leads' | 'funil-comercial' | 'rankings' | 'visao-dono'
  >(() => {
    if (initialSubTab === 'relatorio-leads' || initialSubTab === 'relatorio-atendimentos') return 'relatorio-leads';
    if (initialSubTab === 'campanhas') return 'campanhas';
    if (initialSubTab === 'anuncios') return 'anuncios';
    if (initialSubTab === 'conversoes' || initialSubTab === 'funil-comercial') return 'funil-comercial';
    if (initialSubTab === 'vendedores' || initialSubTab === 'rankings') return 'rankings';
    if (initialSubTab === 'visao-dono') return 'visao-dono';
    return 'dashboard-ads';
  });

  // Sync tab mode when initialSubTab changes from sidebar
  useEffect(() => {
    if (initialSubTab === 'relatorio-leads' || initialSubTab === 'relatorio-atendimentos') {
      setActiveTabMode('relatorio-leads');
    } else if (initialSubTab === 'campanhas') {
      setActiveTabMode('campanhas');
    } else if (initialSubTab === 'anuncios') {
      setActiveTabMode('anuncios');
    } else if (initialSubTab === 'conversoes' || initialSubTab === 'funil-comercial') {
      setActiveTabMode('funil-comercial');
    } else if (initialSubTab === 'vendedores' || initialSubTab === 'rankings') {
      setActiveTabMode('rankings');
    } else if (initialSubTab === 'visao-dono') {
      setActiveTabMode('visao-dono');
    } else {
      setActiveTabMode('dashboard-ads');
    }
  }, [initialSubTab]);

  // Period filter states
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '14d' | '30d'>('7d');
  const [isCompareActive, setIsCompareActive] = useState(false);
  const [isTopCreativesExpanded, setIsTopCreativesExpanded] = useState(true);

  // Data states
  const [accountConfig, setAccountConfig] = useState<MetaAccountConfig>(initialMetaAccountConfig);
  const [campaigns, setCampaigns] = useState<MetaCampaign[]>(initialMetaCampaigns);
  const [ads, setAds] = useState<MetaAd[]>(initialMetaAds);
  const [leads, setLeads] = useState<MetaLeadTracking[]>(initialMetaLeadsTracking);
  const [dailyTrends, setDailyTrends] = useState<MetaDailyDataPoint[]>(initialMetaDailyTrends);

  // Lead Report Filters & Search
  const [leadSearchQuery, setLeadSearchQuery] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<'ALL' | 'PENDENTE' | 'EM_ANDAMENTO' | 'QUALIFICADO' | 'VENDA'>('ALL');
  const [leadSellerFilter, setLeadSellerFilter] = useState<string>('ALL');
  const [leadOriginFilter, setLeadOriginFilter] = useState<string>('ALL');

  // Modals
  const [selectedCampaignForModal, setSelectedCampaignForModal] = useState<MetaCampaign | null>(null);
  const [selectedAdForModal, setSelectedAdForModal] = useState<MetaAd | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('19/08/2026 às 09:35');
  const [showPdfDownloadNotice, setShowPdfDownloadNotice] = useState(false);

  // Trigger manual sync
  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      setLastSyncTime(
        `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} às ${now
          .getHours()
          .toString()
          .padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      );
    }, 800);
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = 'Protocolo,Contato,Telefone,Usuario/Equipe,Origem,Veiculo,Inicio,Inatividade,SLA Resposta,Status\n';
    const rows = leads
      .map(
        (l) =>
          `"${l.metaLeadId}","${l.customerName}","${l.customerPhone}","${l.assignedSeller} - ${l.team || 'Vendas'}","${l.origin}","${
            l.vehicleInterest || 'Geral'
          }","${l.createdAt}","${l.inactivityLabel || '-'}","${l.firstResponseLabel || '-'}","${l.statusBadge || l.crmStatus}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio-leads-motorgrid-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (leadStatusFilter !== 'ALL') {
        if (leadStatusFilter === 'PENDENTE' && l.crmStatus !== 'PENDENTE' && l.crmStatus !== 'NOVO') return false;
        if (leadStatusFilter === 'EM_ANDAMENTO' && l.crmStatus !== 'EM_ANDAMENTO' && l.crmStatus !== 'EM_ATENDIMENTO') return false;
        if (leadStatusFilter === 'QUALIFICADO' && l.crmStatus !== 'QUALIFICADO' && l.crmStatus !== 'AGENDADO') return false;
        if (leadStatusFilter === 'VENDA' && l.crmStatus !== 'VENDA') return false;
      }
      if (leadSellerFilter !== 'ALL' && l.assignedSeller !== leadSellerFilter) return false;
      if (leadOriginFilter !== 'ALL') {
        if (leadOriginFilter === 'meta' && !l.hasMetaBadge && !l.origin.toLowerCase().includes('meta') && !l.origin.toLowerCase().includes('instagram')) return false;
        if (leadOriginFilter === 'whatsapp' && !l.origin.toLowerCase().includes('whatsapp')) return false;
        if (leadOriginFilter === 'webmotors' && !l.origin.toLowerCase().includes('webmotors')) return false;
        if (leadOriginFilter === 'google' && !l.origin.toLowerCase().includes('google')) return false;
      }
      if (leadSearchQuery) {
        const q = leadSearchQuery.toLowerCase();
        const matchName = l.customerName.toLowerCase().includes(q);
        const matchPhone = l.customerPhone.toLowerCase().includes(q);
        const matchProtocol = l.metaLeadId.toLowerCase().includes(q);
        const matchSeller = l.assignedSeller.toLowerCase().includes(q);
        const matchOrigin = l.origin.toLowerCase().includes(q);
        const matchVehicle = (l.vehicleInterest || '').toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchProtocol && !matchSeller && !matchOrigin && !matchVehicle) return false;
      }
      return true;
    });
  }, [leads, leadStatusFilter, leadSellerFilter, leadOriginFilter, leadSearchQuery]);

  // Totals for WhatsApp section
  const totalSpend = useMemo(() => campaigns.reduce((acc, c) => acc + c.spend, 0), [campaigns]);
  const totalConversas = 92;
  const cpl = 5.76;
  const ctr = 4.55;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-['Inter',sans-serif] pb-16">
      {/* ========================================================================= */}
      {/* 1. TOP SUBHEADER BAR (MotorGrid - DASHBOARD DE ADS) */}
      {/* ========================================================================= */}
      <div className="bg-[#0A0A0B] border-b border-[rgba(255,255,255,0.06)] px-6 py-3.5 sticky top-0 z-30 font-['Inter',sans-serif]">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Brand & Title - GRID IA Logo & Typography */}
          <div className="flex items-center gap-4">
            <GridIALogoFull theme="dark" size="sm" />
            <div className="hidden sm:block border-l border-[rgba(255,255,255,0.12)] pl-3">
              <p className="text-[10px] font-semibold tracking-[0.14em] text-[#71717A] uppercase">
                DASHBOARD DE ADS • SISTEMA OPERACIONAL AUTOMOTIVO
              </p>
            </div>
          </div>

          {/* Subtabs Switcher */}
          <div className="flex items-center gap-1 bg-[#1C1C1E] p-1 rounded-xl border border-[rgba(255,255,255,0.08)] overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTabMode('dashboard-ads')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTabMode === 'dashboard-ads'
                  ? 'bg-[#27272A] text-white shadow-xs'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              Dashboard de Ads
            </button>
            <button
              onClick={() => setActiveTabMode('campanhas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTabMode === 'campanhas'
                  ? 'bg-[#27272A] text-white shadow-xs'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              Campanhas
            </button>
            <button
              onClick={() => setActiveTabMode('anuncios')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTabMode === 'anuncios'
                  ? 'bg-[#27272A] text-white shadow-xs'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              Anúncios
            </button>
            <button
              onClick={() => setActiveTabMode('relatorio-leads')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTabMode === 'relatorio-leads'
                  ? 'bg-[#27272A] text-white shadow-xs'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              Relatório de Leads
              <span className="bg-[rgba(139,92,246,0.2)] text-[#8B5CF6] text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-[rgba(139,92,246,0.3)]">
                4.336
              </span>
            </button>
            <button
              onClick={() => setActiveTabMode('funil-comercial')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTabMode === 'funil-comercial'
                  ? 'bg-[#27272A] text-white shadow-xs'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              Funil Comercial
            </button>
            <button
              onClick={() => setActiveTabMode('rankings')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTabMode === 'rankings'
                  ? 'bg-[#27272A] text-white shadow-xs'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              Vendedores
            </button>
            <button
              onClick={() => setActiveTabMode('visao-dono')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTabMode === 'visao-dono'
                  ? 'bg-[#27272A] text-white shadow-xs'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              Visão do Dono
            </button>
          </div>

          {/* Right Controls: Comparar, 7d/14d/30d, Baixar PDF */}
          <div className="flex items-center gap-3">
            {/* Compare checkbox */}
            <label className="flex items-center gap-2 text-xs font-medium text-[#A1A1AA] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isCompareActive}
                onChange={(e) => setIsCompareActive(e.target.checked)}
                className="w-4 h-4 rounded accent-[#8B5CF6] border-[rgba(255,255,255,0.15)] bg-[#1C1C1E]"
              />
              <span>Comparar</span>
            </label>

            {/* Period Pills: 7d, 14d, 30d */}
            <div className="flex items-center bg-[#1C1C1E] p-0.5 rounded-lg border border-[rgba(255,255,255,0.08)]">
              <button
                onClick={() => setSelectedPeriod('7d')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  selectedPeriod === '7d'
                    ? 'bg-[#8B5CF6] text-white shadow-xs'
                    : 'text-[#A1A1AA] hover:text-white'
                }`}
              >
                7d
              </button>
              <button
                onClick={() => setSelectedPeriod('14d')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  selectedPeriod === '14d'
                    ? 'bg-[#8B5CF6] text-white shadow-xs'
                    : 'text-[#A1A1AA] hover:text-white'
                }`}
              >
                14d
              </button>
              <button
                onClick={() => setSelectedPeriod('30d')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  selectedPeriod === '30d'
                    ? 'bg-[#8B5CF6] text-white shadow-xs'
                    : 'text-[#A1A1AA] hover:text-white'
                }`}
              >
                30d
              </button>
            </div>

            {/* Baixar PDF button */}
            <button
              onClick={() => {
                window.print();
              }}
              className="bg-[#1C1C1E] hover:bg-[#27272A] border border-[rgba(255,255,255,0.08)] text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>Baixar PDF</span>
            </button>

            {/* Sync Refresh */}
            <button
              onClick={handleSync}
              disabled={isSyncing}
              title={`Última sincronização: ${lastSyncTime}`}
              className="p-1.5 bg-[#1C1C1E] hover:bg-[#27272A] border border-[rgba(255,255,255,0.08)] rounded-lg text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#8B5CF6]' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main View Container */}
      <div className="max-w-[1600px] mx-auto px-6 pt-6 space-y-7">
        {/* ========================================================================= */}
        {/* MODE A: DASHBOARD DE ADS */}
        {/* ========================================================================= */}
        {activeTabMode === 'dashboard-ads' && (
          <div className="space-y-7">
            {/* ------------------------------------------------------------- */}
            {/* SECTION 1: CAMPANHAS DE MENSAGEM (WHATSAPP) */}
            {/* ------------------------------------------------------------- */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3.5 bg-[#8B5CF6] rounded-full" />
                  <h2 className="text-xs font-bold tracking-wider text-[#A1A1AA] uppercase">
                    CAMPANHAS DE MENSAGEM (WHATSAPP)
                  </h2>
                </div>
                <span className="text-xs text-[#71717A] font-medium">
                  últimos {selectedPeriod === '7d' ? '7' : selectedPeriod === '14d' ? '14' : '30'} dias
                </span>
              </div>

              {/* 4 Dark Metric Cards (Manual: #1C1C1E, border rgba(255,255,255,0.06), radius 14px) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Investimento */}
                <div className="bg-[#1C1C1E] rounded-[14px] p-5 border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] transition-all">
                  <span className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                    INVESTIMENTO
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-semibold text-[#71717A]">R$</span>
                    <span className="text-3xl font-extrabold text-white tracking-tight">529,85</span>
                  </div>
                  {/* Purple accent indicator */}
                  <div className="h-1 w-24 bg-[#8B5CF6] rounded-full mt-3" />
                </div>

                {/* 2. Conversas */}
                <div className="bg-[#1C1C1E] rounded-[14px] p-5 border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] transition-all">
                  <span className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                    CONVERSAS
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white tracking-tight">92</span>
                  </div>
                  {/* Purple accent indicator */}
                  <div className="h-1 w-24 bg-[#8B5CF6] rounded-full mt-3" />
                </div>

                {/* 3. CPL */}
                <div className="bg-[#1C1C1E] rounded-[14px] p-5 border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] transition-all">
                  <span className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                    CPL
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-semibold text-[#71717A]">R$</span>
                    <span className="text-3xl font-extrabold text-white tracking-tight">5,76</span>
                  </div>
                  {/* Purple accent indicator */}
                  <div className="h-1 w-24 bg-[#8B5CF6] rounded-full mt-3" />
                </div>

                {/* 4. CTR */}
                <div className="bg-[#1C1C1E] rounded-[14px] p-5 border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] transition-all">
                  <span className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                    CTR
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white tracking-tight">4,55</span>
                    <span className="text-base font-bold text-[#71717A] ml-1">%</span>
                  </div>
                  {/* Purple accent indicator */}
                  <div className="h-1 w-24 bg-[#8B5CF6] rounded-full mt-3" />
                </div>
              </div>
            </section>

            {/* ------------------------------------------------------------- */}
            {/* SECTION 2: CAMPANHAS DE VISITAS AO PERFIL */}
            {/* ------------------------------------------------------------- */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3.5 bg-[#8B5CF6] rounded-full" />
                  <h2 className="text-xs font-bold tracking-wider text-[#A1A1AA] uppercase">
                    CAMPANHAS DE VISITAS AO PERFIL
                  </h2>
                </div>
                <span className="text-xs text-[#71717A] font-medium">
                  últimos {selectedPeriod === '7d' ? '7' : selectedPeriod === '14d' ? '14' : '30'} dias
                </span>
              </div>

              {/* 4 Dark Metric Cards (Profile Visits) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Investimento */}
                <div className="bg-[#1C1C1E] rounded-[14px] p-5 border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] transition-all">
                  <span className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                    INVESTIMENTO
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-semibold text-[#71717A]">R$</span>
                    <span className="text-3xl font-extrabold text-white tracking-tight">0,00</span>
                  </div>
                  <div className="h-1 w-12 bg-[#8B5CF6] rounded-full mt-3" />
                </div>

                {/* 2. Visitas */}
                <div className="bg-[#1C1C1E] rounded-[14px] p-5 border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] transition-all">
                  <span className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                    VISITAS
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white tracking-tight">0</span>
                  </div>
                  <div className="h-1 w-24 bg-[#8B5CF6] rounded-full mt-3" />
                </div>

                {/* 3. Custo / Visita */}
                <div className="bg-[#1C1C1E] rounded-[14px] p-5 border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] transition-all">
                  <span className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                    CUSTO / VISITA
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-semibold text-[#71717A]">R$</span>
                    <span className="text-3xl font-extrabold text-white tracking-tight">0,00</span>
                  </div>
                  <div className="h-1 w-12 bg-[#8B5CF6] rounded-full mt-3" />
                </div>

                {/* 4. Impressões */}
                <div className="bg-[#1C1C1E] rounded-[14px] p-5 border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] transition-all">
                  <span className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                    IMPRESSÕES
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white tracking-tight">0</span>
                  </div>
                  <div className="h-1 w-24 bg-[#8B5CF6] rounded-full mt-3" />
                </div>
              </div>
            </section>

            {/* ------------------------------------------------------------- */}
            {/* SECTION 3: LEITURA DIÁRIA (Bar + Line Chart & Funil de Conversão) */}
            {/* ------------------------------------------------------------- */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-3.5 bg-[#8B5CF6] rounded-full" />
                <h2 className="text-xs font-bold tracking-wider text-[#A1A1AA] uppercase">
                  LEITURA DIÁRIA
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Card: Conversas por dia vs CPL (7 cols) */}
                <div className="lg:col-span-7 bg-[#1C1C1E] rounded-[14px] p-6 border border-[rgba(255,255,255,0.06)] space-y-4">
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      Conversas por dia vs CPL
                    </h3>
                    <p className="text-xs text-[#71717A] mt-0.5">
                      Barras = conversas iniciadas · linha = custo por lead (R$)
                    </p>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-6 text-xs text-[#A1A1AA] font-medium">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-xs bg-[#8B5CF6]" />
                      <span>Conversas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-0.5 bg-white" />
                      <span>CPL (R$)</span>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="h-64 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={dailyTrends} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                          dataKey="date"
                          stroke="#71717A"
                          fontSize={11}
                          tickLine={false}
                          axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                        />
                        <YAxis
                          yAxisId="left"
                          stroke="#71717A"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                          domain={[0, 20]}
                          ticks={[0, 5, 10, 15, 20]}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          stroke="#71717A"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                          domain={[0, 12]}
                          ticks={[0, 3, 6, 9, 12]}
                          tickFormatter={(val) => `R$${val}`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1C1C1E',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#FFFFFF',
                            fontSize: '12px',
                          }}
                          formatter={(value: any, name: string) => {
                            if (name === 'Conversas') return [`${value} conversas`, 'Conversas'];
                            if (name === 'CPL (R$)') return [`R$ ${Number(value).toFixed(2)}`, 'CPL'];
                            return [value, name];
                          }}
                        />
                        <Bar
                          yAxisId="left"
                          dataKey="leads"
                          name="Conversas"
                          fill="#8B5CF6"
                          radius={[4, 4, 0, 0]}
                          barSize={24}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="cpl"
                          name="CPL (R$)"
                          stroke="#FFFFFF"
                          strokeWidth={2}
                          dot={{ fill: '#8B5CF6', r: 3.5 }}
                          activeDot={{ r: 5 }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Right Card: Funil de Conversão (5 cols) */}
                <div className="lg:col-span-5 bg-[#1C1C1E] rounded-[14px] p-6 border border-[rgba(255,255,255,0.06)] flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      Funil de conversão
                    </h3>
                    <p className="text-xs text-[#71717A] mt-0.5">
                      Impressões → cliques no link → conversas
                    </p>

                    {/* Funnel Visual Bars */}
                    <div className="space-y-4 my-6">
                      {/* 1. Impressões (100%) */}
                      <div className="flex items-center gap-3">
                        <div className="w-[72%] bg-[#8B5CF6] text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center shadow-xs">
                          20.933
                        </div>
                        <div className="text-right flex-1">
                          <span className="text-[11px] text-[#A1A1AA] block">Impressões</span>
                          <span className="text-xs font-bold text-white">100%</span>
                        </div>
                      </div>

                      {/* 2. Cliques no link (1,55% das impressões) */}
                      <div className="flex items-center gap-3">
                        <div className="w-[50%] bg-[#6D28D9] text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center shadow-xs">
                          325
                        </div>
                        <div className="text-right flex-1">
                          <span className="text-[11px] text-[#A1A1AA] block">Cliques no link</span>
                          <span className="text-xs font-bold text-white">1,55% das impressões</span>
                        </div>
                      </div>

                      {/* 3. Conversas (28,31% dos cliques) */}
                      <div className="flex items-center gap-3">
                        <div className="w-[28%] bg-[#27272A] text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center border border-[rgba(255,255,255,0.08)]">
                          92
                        </div>
                        <div className="text-right flex-1">
                          <span className="text-[11px] text-[#A1A1AA] block">Conversas</span>
                          <span className="text-xs font-bold text-white">28,31% dos cliques</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Metric Row (5 cols) */}
                  <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] grid grid-cols-5 gap-2 text-center">
                    <div>
                      <span className="text-[10px] font-bold text-[#71717A] uppercase block">CTR</span>
                      <span className="text-xs font-extrabold text-white">4,55%</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#71717A] uppercase block">CPL</span>
                      <span className="text-xs font-extrabold text-white">R$ 5,76</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#71717A] uppercase block">CPM</span>
                      <span className="text-xs font-extrabold text-white">R$ 25,31</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#71717A] uppercase block">CPC</span>
                      <span className="text-xs font-extrabold text-white">R$ 1,63</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#71717A] uppercase block">FREQUÊNCIA</span>
                      <span className="text-xs font-extrabold text-white">1,33</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ------------------------------------------------------------- */}
            {/* SECTION 4: TOP CRIATIVOS */}
            {/* ------------------------------------------------------------- */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3.5 bg-[#8B5CF6] rounded-full" />
                  <h2 className="text-xs font-bold tracking-wider text-white uppercase flex items-center gap-1.5">
                    <span>🏆</span>
                    <span>Top criativos</span>
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#71717A] font-medium">6 ativos · 12 totais</span>
                  <button
                    onClick={() => setIsTopCreativesExpanded(!isTopCreativesExpanded)}
                    className="p-1 text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
                  >
                    {isTopCreativesExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* 10 Vehicle Creative Cards (2 rows of 5) */}
              {isTopCreativesExpanded && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                  {ads.map((ad, idx) => (
                    <div
                      key={ad.id}
                      onClick={() => setSelectedAdForModal(ad)}
                      className="bg-[#1C1C1E] rounded-[14px] border border-[rgba(255,255,255,0.08)] overflow-hidden hover:border-[#8B5CF6] transition-all cursor-pointer group flex flex-col"
                    >
                      {/* Image Thumbnail with Rank Badge */}
                      <div className="h-36 relative bg-[#101012] overflow-hidden">
                        <img
                          src={ad.creativeThumbnail}
                          alt={ad.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Number Badge (1..10) */}
                        <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-black/80 backdrop-blur-xs text-[#8B5CF6] text-[11px] font-bold flex items-center justify-center border border-[rgba(139,92,246,0.3)]">
                          {idx + 1}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-3 bg-[#1C1C1E] flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-white text-xs truncate group-hover:text-[#8B5CF6] transition-colors">
                            {ad.name}
                          </h4>
                          <p className="text-[11px] text-[#A1A1AA] font-medium mt-0.5">
                            {ad.leads} conversas · CPL R$ {ad.cpl.toFixed(2).replace('.', ',')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ------------------------------------------------------------- */}
            {/* SECTION 5: PERFORMANCE POR CAMPANHA */}
            {/* ------------------------------------------------------------- */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-3.5 bg-[#8B5CF6] rounded-full" />
                <h2 className="text-xs font-bold tracking-wider text-[#A1A1AA] uppercase">
                  PERFORMANCE POR CAMPANHA
                </h2>
              </div>

              {/* Table Container (Design System Manual: table bg #101012, header #1C1C1E, text #FFFFFF, text-sec #A1A1AA) */}
              <div className="bg-[#101012] rounded-[14px] border border-[rgba(255,255,255,0.08)] overflow-hidden">
                {/* Table Header Info */}
                <div className="px-5 py-3.5 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between bg-[#1C1C1E]">
                  <span className="font-bold text-white text-sm">Campanhas</span>
                  <span className="text-xs text-[#71717A] font-medium">11 campanhas</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[rgba(255,255,255,0.06)] text-[#A1A1AA] font-bold uppercase text-[10px] tracking-wider bg-[#1C1C1E]">
                        <th className="py-3 px-5">CAMPANHA</th>
                        <th className="py-3 px-4">STATUS</th>
                        <th className="py-3 px-4 text-right">INVESTIMENTO</th>
                        <th className="py-3 px-4 text-right">IMPR.</th>
                        <th className="py-3 px-4 text-right">CLIQUES</th>
                        <th className="py-3 px-4 text-right">CTR</th>
                        <th className="py-3 px-4 text-right">CPC</th>
                        <th className="py-3 px-4 text-right">CONVERSAS</th>
                        <th className="py-3 px-4 text-right">CPL</th>
                        <th className="py-3 px-5 text-right">CONNECT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(255,255,255,0.05)] text-white">
                      {campaigns.map((camp) => (
                        <tr
                          key={camp.id}
                          onClick={() => setSelectedCampaignForModal(camp)}
                          className="hover:bg-[#1C1C1E] transition-colors cursor-pointer group"
                        >
                          {/* Campanha */}
                          <td className="py-3.5 px-5 font-semibold text-white group-hover:text-[#8B5CF6]">
                            {camp.name}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            {camp.status === 'ACTIVE' ? (
                              <span className="inline-flex items-center gap-1 bg-[rgba(16,185,129,0.15)] text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                                ● ATIVA
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-[#27272A] text-[#A1A1AA] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[rgba(255,255,255,0.06)]">
                                ● PAUSADA
                              </span>
                            )}
                          </td>

                          {/* Investimento */}
                          <td className="py-3.5 px-4 text-right font-medium text-[#A1A1AA]">
                            R$ {camp.spend.toFixed(2).replace('.', ',')}
                          </td>

                          {/* Impr. */}
                          <td className="py-3.5 px-4 text-right font-medium text-[#A1A1AA]">
                            {camp.impressions.toLocaleString('pt-BR')}
                          </td>

                          {/* Cliques */}
                          <td className="py-3.5 px-4 text-right font-medium text-[#A1A1AA]">
                            {camp.clicks}
                          </td>

                          {/* CTR */}
                          <td className="py-3.5 px-4 text-right font-medium text-[#A1A1AA]">
                            {camp.ctr.toFixed(2).replace('.', ',')}%
                          </td>

                          {/* CPC */}
                          <td className="py-3.5 px-4 text-right font-medium text-[#A1A1AA]">
                            {camp.cpc > 0 ? `R$ ${camp.cpc.toFixed(2).replace('.', ',')}` : '—'}
                          </td>

                          {/* Conversas */}
                          <td className="py-3.5 px-4 text-right font-semibold text-white">
                            {camp.leads > 0 ? camp.leads : '—'}
                          </td>

                          {/* CPL */}
                          <td className="py-3.5 px-4 text-right font-semibold text-white">
                            {camp.cpl > 0 ? `R$ ${camp.cpl.toFixed(2).replace('.', ',')}` : '—'}
                          </td>

                          {/* Connect */}
                          <td className="py-3.5 px-5 text-right font-medium text-[#8B5CF6]">
                            {camp.clicks > 0 && camp.leads > 0
                              ? `${((camp.leads / camp.clicks) * 100).toFixed(2).replace('.', ',')}%`
                              : camp.clicks > 0
                              ? '0,00%'
                              : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ------------------------------------------------------------- */}
            {/* SECTION 6: TOP ANÚNCIOS */}
            {/* ------------------------------------------------------------- */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-3.5 bg-[#8B5CF6] rounded-full" />
                <h2 className="text-xs font-bold tracking-wider text-[#A1A1AA] uppercase">
                  TOP ANÚNCIOS
                </h2>
              </div>

              <div className="bg-[#101012] rounded-[14px] border border-[rgba(255,255,255,0.08)] overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between bg-[#1C1C1E]">
                  <span className="font-bold text-white text-sm">Anúncios</span>
                  <span className="text-xs text-[#71717A] italic">clique numa linha para ver o criativo</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[rgba(255,255,255,0.06)] text-[#A1A1AA] font-bold uppercase text-[10px] tracking-wider bg-[#1C1C1E]">
                        <th className="py-3 px-5">ANÚNCIO</th>
                        <th className="py-3 px-4">CAMPANHA</th>
                        <th className="py-3 px-4 text-right">INVESTIMENTO</th>
                        <th className="py-3 px-4 text-right">IMPR.</th>
                        <th className="py-3 px-4 text-right">CLIQUES</th>
                        <th className="py-3 px-4 text-right">CTR</th>
                        <th className="py-3 px-4 text-right">CONVERSAS</th>
                        <th className="py-3 px-5 text-right">CPL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(255,255,255,0.05)] text-white">
                      {ads.map((ad) => (
                        <tr
                          key={ad.id}
                          onClick={() => setSelectedAdForModal(ad)}
                          className="hover:bg-[#1C1C1E] transition-colors cursor-pointer group"
                        >
                          <td className="py-3 px-5 font-semibold text-white group-hover:text-[#8B5CF6] flex items-center gap-3">
                            <img
                              src={ad.creativeThumbnail}
                              alt=""
                              className="w-8 h-8 rounded-lg object-cover ring-1 ring-[rgba(255,255,255,0.08)]"
                            />
                            <span>{ad.name}</span>
                          </td>
                          <td className="py-3 px-4 text-[#A1A1AA] truncate max-w-xs">{ad.campaignName}</td>
                          <td className="py-3 px-4 text-right font-medium text-[#A1A1AA]">
                            R$ {ad.spend.toFixed(2).replace('.', ',')}
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-[#A1A1AA]">
                            {ad.impressions.toLocaleString('pt-BR')}
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-[#A1A1AA]">{ad.clicks}</td>
                          <td className="py-3 px-4 text-right font-medium text-[#A1A1AA]">
                            {ad.ctr.toFixed(2).replace('.', ',')}%
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-white">{ad.leads}</td>
                          <td className="py-3 px-5 text-right font-bold text-white">
                            R$ {ad.cpl.toFixed(2).replace('.', ',')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE: CAMPANHAS */}
        {/* ========================================================================= */}
        {activeTabMode === 'campanhas' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Campanhas Meta Ads
                </h1>
                <p className="text-xs text-[#A1A1AA] font-normal mt-0.5">
                  11 campanhas ativas e pausadas com rastreamento direto no CRM automotivo
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCsv}
                  className="bg-[#1C1C1E] hover:bg-[#27272A] border border-[rgba(255,255,255,0.08)] text-[#A1A1AA] hover:text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-[#8B5CF6] rotate-180" />
                  <span>Exportar CSV</span>
                </button>
                <button
                  onClick={handleSync}
                  className="p-2 bg-[#1C1C1E] hover:bg-[#27272A] border border-[rgba(255,255,255,0.08)] rounded-xl text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-[#8B5CF6]' : ''}`} />
                </button>
              </div>
            </div>

            {/* Campaign Summary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#1C1C1E] rounded-[14px] p-5 border border-[rgba(255,255,255,0.06)]">
                <span className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                  INVESTIMENTO TOTAL
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-semibold text-[#71717A]">R$</span>
                  <span className="text-2xl font-extrabold text-white">529,85</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold block mt-2">● 11 campanhas rastreadas</span>
              </div>
              <div className="bg-[#1C1C1E] rounded-[14px] p-5 border border-[rgba(255,255,255,0.06)]">
                <span className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                  LEADS / CONVERSAS
                </span>
                <span className="text-2xl font-extrabold text-white">92</span>
                <span className="text-[11px] text-[#8B5CF6] font-semibold block mt-2">CPL Médio R$ 5,76</span>
              </div>
              <div className="bg-[#1C1C1E] rounded-[14px] p-5 border border-[rgba(255,255,255,0.06)]">
                <span className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                  TAXA DE CLIQUES (CTR)
                </span>
                <span className="text-2xl font-extrabold text-white">4,55%</span>
                <span className="text-[11px] text-emerald-400 font-semibold block mt-2">Acima do benchmark (2.8%)</span>
              </div>
              <div className="bg-[#1C1C1E] rounded-[14px] p-5 border border-[rgba(255,255,255,0.06)]">
                <span className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                  VENDAS CONCRETIZADAS
                </span>
                <span className="text-2xl font-extrabold text-emerald-400">11 carros</span>
                <span className="text-[11px] text-emerald-400/80 font-semibold block mt-2">R$ 700.700 faturados</span>
              </div>
            </div>

            {/* Performance por Campanha Table */}
            <div className="bg-[#101012] rounded-[14px] border border-[rgba(255,255,255,0.08)] overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between bg-[#1C1C1E]">
                <span className="font-bold text-white text-sm">Todas as Campanhas</span>
                <span className="text-xs text-[#71717A] font-medium">Clique em uma linha para ver detalhes e criativos</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[rgba(255,255,255,0.06)] text-[#A1A1AA] font-bold uppercase text-[10px] tracking-wider bg-[#1C1C1E]">
                      <th className="py-3 px-5">CAMPANHA</th>
                      <th className="py-3 px-4">STATUS</th>
                      <th className="py-3 px-4 text-right">INVESTIMENTO</th>
                      <th className="py-3 px-4 text-right">IMPR.</th>
                      <th className="py-3 px-4 text-right">CLIQUES</th>
                      <th className="py-3 px-4 text-right">CTR</th>
                      <th className="py-3 px-4 text-right">CPC</th>
                      <th className="py-3 px-4 text-right">CONVERSAS</th>
                      <th className="py-3 px-4 text-right">CPL</th>
                      <th className="py-3 px-5 text-right">CONNECT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(255,255,255,0.05)] text-white">
                    {campaigns.map((camp) => (
                      <tr
                        key={camp.id}
                        onClick={() => setSelectedCampaignForModal(camp)}
                        className="hover:bg-[#1C1C1E] transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-5 font-semibold text-white group-hover:text-[#8B5CF6]">
                          {camp.name}
                        </td>
                        <td className="py-3.5 px-4">
                          {camp.status === 'ACTIVE' ? (
                            <span className="inline-flex items-center gap-1 bg-[rgba(16,185,129,0.15)] text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                              ● ATIVA
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-[#27272A] text-[#A1A1AA] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[rgba(255,255,255,0.06)]">
                              ● PAUSADA
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right font-medium text-[#A1A1AA]">
                          R$ {camp.spend.toFixed(2).replace('.', ',')}
                        </td>
                        <td className="py-3.5 px-4 text-right font-medium text-[#A1A1AA]">
                          {camp.impressions.toLocaleString('pt-BR')}
                        </td>
                        <td className="py-3.5 px-4 text-right font-medium text-[#A1A1AA]">
                          {camp.clicks}
                        </td>
                        <td className="py-3.5 px-4 text-right font-medium text-[#A1A1AA]">
                          {camp.ctr.toFixed(2).replace('.', ',')}%
                        </td>
                        <td className="py-3.5 px-4 text-right font-medium text-[#A1A1AA]">
                          {camp.cpc > 0 ? `R$ ${camp.cpc.toFixed(2).replace('.', ',')}` : '—'}
                        </td>
                        <td className="py-3.5 px-4 text-right font-semibold text-white">
                          {camp.leads > 0 ? camp.leads : '—'}
                        </td>
                        <td className="py-3.5 px-4 text-right font-semibold text-white">
                          {camp.cpl > 0 ? `R$ ${camp.cpl.toFixed(2).replace('.', ',')}` : '—'}
                        </td>
                        <td className="py-3.5 px-5 text-right font-medium text-[#8B5CF6]">
                          {camp.clicks > 0 && camp.leads > 0
                            ? `${((camp.leads / camp.clicks) * 100).toFixed(2).replace('.', ',')}%`
                            : camp.clicks > 0
                            ? '0,00%'
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE: ANÚNCIOS & CRIATIVOS */}
        {/* ========================================================================= */}
        {activeTabMode === 'anuncios' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Anúncios &amp; Criativos Meta
                </h1>
                <p className="text-xs text-[#A1A1AA] font-normal mt-0.5">
                  Galeria de criativos, vídeos e carrosséis com métricas de conversão e custo por lead
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCsv}
                  className="bg-[#1C1C1E] hover:bg-[#27272A] border border-[rgba(255,255,255,0.08)] text-[#A1A1AA] hover:text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-[#8B5CF6] rotate-180" />
                  <span>Exportar</span>
                </button>
              </div>
            </div>

            {/* Top Creatives Gallery */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {ads.map((ad, idx) => (
                <div
                  key={ad.id}
                  onClick={() => setSelectedAdForModal(ad)}
                  className="bg-[#1C1C1E] rounded-[14px] border border-[rgba(255,255,255,0.08)] overflow-hidden hover:border-[#8B5CF6] transition-all cursor-pointer group flex flex-col"
                >
                  <div className="h-36 relative bg-[#101012] overflow-hidden">
                    <img
                      src={ad.creativeThumbnail}
                      alt={ad.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-black/80 backdrop-blur-xs text-[#8B5CF6] text-[11px] font-bold flex items-center justify-center border border-[rgba(139,92,246,0.3)]">
                      {idx + 1}
                    </div>
                  </div>

                  <div className="p-3 bg-[#1C1C1E] flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs truncate group-hover:text-[#8B5CF6] transition-colors">
                        {ad.name}
                      </h4>
                      <p className="text-[11px] text-[#A1A1AA] font-medium mt-0.5">
                        {ad.leads} conversas · CPL R$ {ad.cpl.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table of Ads */}
            <div className="bg-[#101012] rounded-[14px] border border-[rgba(255,255,255,0.08)] overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between bg-[#1C1C1E]">
                <span className="font-bold text-white text-sm">Tabela de Anúncios</span>
                <span className="text-xs text-[#71717A] italic">clique numa linha para pré-visualizar o criativo</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[rgba(255,255,255,0.06)] text-[#A1A1AA] font-bold uppercase text-[10px] tracking-wider bg-[#1C1C1E]">
                      <th className="py-3 px-5">ANÚNCIO</th>
                      <th className="py-3 px-4">CAMPANHA</th>
                      <th className="py-3 px-4 text-right">INVESTIMENTO</th>
                      <th className="py-3 px-4 text-right">IMPR.</th>
                      <th className="py-3 px-4 text-right">CLIQUES</th>
                      <th className="py-3 px-4 text-right">CTR</th>
                      <th className="py-3 px-4 text-right">CONVERSAS</th>
                      <th className="py-3 px-5 text-right">CPL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(255,255,255,0.05)] text-white">
                    {ads.map((ad) => (
                      <tr
                        key={ad.id}
                        onClick={() => setSelectedAdForModal(ad)}
                        className="hover:bg-[#1C1C1E] transition-colors cursor-pointer group"
                      >
                        <td className="py-3 px-5 font-semibold text-white group-hover:text-[#8B5CF6] flex items-center gap-3">
                          <img
                            src={ad.creativeThumbnail}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover ring-1 ring-[rgba(255,255,255,0.08)]"
                          />
                          <span>{ad.name}</span>
                        </td>
                        <td className="py-3 px-4 text-[#A1A1AA] truncate max-w-xs">{ad.campaignName}</td>
                        <td className="py-3 px-4 text-right font-medium text-[#A1A1AA]">
                          R$ {ad.spend.toFixed(2).replace('.', ',')}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-[#A1A1AA]">
                          {ad.impressions.toLocaleString('pt-BR')}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-[#A1A1AA]">{ad.clicks}</td>
                        <td className="py-3 px-4 text-right font-medium text-[#A1A1AA]">
                          {ad.ctr.toFixed(2).replace('.', ',')}%
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-white">{ad.leads}</td>
                        <td className="py-3 px-5 text-right font-bold text-white">
                          R$ {ad.cpl.toFixed(2).replace('.', ',')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE: RELATÓRIO DE LEADS (META ADS & CRM) */}
        {/* ========================================================================= */}
        {activeTabMode === 'relatorio-leads' && (
          <div className="space-y-6">
            {/* Header: Title & Action Buttons */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                  <span>Relatório de Leads</span>
                  <span className="bg-[#8B5CF6]/20 text-[#C4B5FD] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#8B5CF6]/30">
                    Meta Ads &amp; CRM
                  </span>
                </h1>
                <p className="text-xs text-[#A1A1AA] font-normal mt-0.5">
                  Rastreamento completo de leads captados, origens de tráfego pago, SLA de resposta e conversão
                </p>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Search input */}
                <div className="relative w-64">
                  <input
                    type="text"
                    value={leadSearchQuery}
                    onChange={(e) => setLeadSearchQuery(e.target.value)}
                    placeholder="Buscar por lead, tel, carro, protocolo..."
                    className="w-full bg-[#1C1C1E] border border-[rgba(255,255,255,0.08)] rounded-xl pl-3 pr-8 py-2 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#8B5CF6]"
                  />
                  {leadSearchQuery ? (
                    <button
                      onClick={() => setLeadSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-white text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  ) : (
                    <Search className="w-3.5 h-3.5 text-[#71717A] absolute right-2.5 top-1/2 -translate-y-1/2" />
                  )}
                </div>

                {/* Filtro de Status */}
                <select
                  value={leadStatusFilter}
                  onChange={(e) => setLeadStatusFilter(e.target.value as any)}
                  className="bg-[#1C1C1E] border border-[rgba(255,255,255,0.08)] text-xs text-zinc-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#8B5CF6] cursor-pointer"
                >
                  <option value="ALL">Todos os Status</option>
                  <option value="PENDENTE">Pendentes</option>
                  <option value="EM_ANDAMENTO">Em Atendimento</option>
                  <option value="QUALIFICADO">Qualificados</option>
                  <option value="VENDA">Vendas Concluídas</option>
                </select>

                {/* Filtro de Origem */}
                <select
                  value={leadOriginFilter}
                  onChange={(e) => setLeadOriginFilter(e.target.value)}
                  className="bg-[#1C1C1E] border border-[rgba(255,255,255,0.08)] text-xs text-zinc-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#8B5CF6] cursor-pointer"
                >
                  <option value="ALL">Todos os Canais</option>
                  <option value="meta">Meta Ads / Instagram</option>
                  <option value="whatsapp">WhatsApp Direto</option>
                  <option value="webmotors">Webmotors Pro</option>
                  <option value="google">Google Ads</option>
                </select>

                {/* Exportar */}
                <button
                  onClick={handleExportCsv}
                  className="bg-[#1C1C1E] hover:bg-[#27272A] border border-[rgba(255,255,255,0.08)] text-[#A1A1AA] hover:text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-[#8B5CF6] rotate-180" />
                  <span>Exportar CSV</span>
                </button>

                {/* Refresh */}
                <button
                  onClick={handleSync}
                  className="p-2 bg-[#1C1C1E] hover:bg-[#27272A] border border-[rgba(255,255,255,0.08)] rounded-xl text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-[#8B5CF6]' : ''}`} />
                </button>
              </div>
            </div>

            {/* 5 KPI Top Cards for Leads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              <div className="bg-[#1C1C1E] rounded-[14px] p-4 border border-[rgba(255,255,255,0.06)]">
                <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider block">
                  TOTAL DE LEADS
                </span>
                <div className="text-2xl font-black text-white mt-1">4.336</div>
                <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">+18.4% vs período ant.</span>
              </div>
              <div className="bg-[#1C1C1E] rounded-[14px] p-4 border border-[rgba(255,255,255,0.06)]">
                <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider block">
                  CPL MÉDIO META ADS
                </span>
                <div className="text-2xl font-black text-[#C4B5FD] mt-1">R$ 5,76</div>
                <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">-12.0% mais eficiente</span>
              </div>
              <div className="bg-[#1C1C1E] rounded-[14px] p-4 border border-[rgba(255,255,255,0.06)]">
                <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider block">
                  QUALIFICAÇÃO (SDR/IA)
                </span>
                <div className="text-2xl font-black text-white mt-1">63,0%</div>
                <span className="text-[11px] text-[#A1A1AA] font-medium block mt-0.5">2.731 leads com perfil</span>
              </div>
              <div className="bg-[#1C1C1E] rounded-[14px] p-4 border border-[rgba(255,255,255,0.06)]">
                <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider block">
                  TEMPO SLA 1ª RESPOSTA
                </span>
                <div className="text-2xl font-black text-emerald-400 mt-1">1.8 min</div>
                <span className="text-[11px] text-emerald-400/90 font-medium block mt-0.5">● Meta &lt; 3 min atingida</span>
              </div>
              <div className="bg-[#1C1C1E] rounded-[14px] p-4 border border-[rgba(255,255,255,0.06)]">
                <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider block">
                  VENDAS GERADAS
                </span>
                <div className="text-2xl font-black text-emerald-400 mt-1">18 carros</div>
                <span className="text-[11px] text-emerald-400/90 font-medium block mt-0.5">R$ 6,66M faturados</span>
              </div>
            </div>

            {/* Visual Channel Distribution & Daily Trend Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Channel Distribution */}
              <div className="lg:col-span-5 bg-[#1C1C1E] rounded-[14px] p-5 border border-[rgba(255,255,255,0.06)] space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">Distribuição de Leads por Canal</h3>
                  <p className="text-xs text-[#71717A] mt-0.5">Participação dos canais na captação total</p>

                  <div className="space-y-3 mt-4">
                    {[
                      { channel: 'Instagram & Facebook Ads', pct: '52%', count: '2.254 leads', color: '#8B5CF6' },
                      { channel: 'WhatsApp Direto', pct: '24%', count: '1.040 leads', color: '#22C55E' },
                      { channel: 'Webmotors Pro', pct: '14%', count: '607 leads', color: '#EF4444' },
                      { channel: 'Google Search Ads', pct: '7%', count: '304 leads', color: '#3B82F6' },
                      { channel: 'OLX & iCarros', pct: '3%', count: '131 leads', color: '#F59E0B' },
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white">{item.channel}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[#A1A1AA] text-[11px]">{item.count}</span>
                            <span className="font-bold text-white font-mono">{item.pct}</span>
                          </div>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#0A0A0B] overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: item.pct, backgroundColor: item.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0A0A0B] border border-[rgba(255,255,255,0.06)] text-[11px] text-zinc-300">
                  ⚡ <strong>Insight de Performance:</strong> O canal <strong>Instagram Ads</strong> gerou o menor custo por lead (R$ 5,76) e 61% das conversões em visita.
                </div>
              </div>

              {/* Daily Trend */}
              <div className="lg:col-span-7 bg-[#1C1C1E] rounded-[14px] p-5 border border-[rgba(255,255,255,0.06)] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">Volume Diário de Leads vs CPL</h3>
                    <p className="text-xs text-[#71717A] mt-0.5">Leads diários (barras) e custo unitário em R$ (linha)</p>
                  </div>
                  <span className="text-xs text-[#A1A1AA] font-mono">Últimos 7 dias</span>
                </div>

                <div className="h-56 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={dailyTrends} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" stroke="#71717A" fontSize={11} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.08)' }} />
                      <YAxis yAxisId="left" stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis yAxisId="right" orientation="right" stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1C1C1E', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '12px' }}
                      />
                      <Bar yAxisId="left" dataKey="leads" name="Leads" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={22} />
                      <Line yAxisId="right" type="monotone" dataKey="cpl" name="CPL (R$)" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-[#101012] rounded-[14px] border border-[rgba(255,255,255,0.08)] overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between bg-[#1C1C1E]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">Lista Detalhada de Leads</span>
                  <span className="text-xs text-[#71717A]">({filteredLeads.length} exibidos de 4.336)</span>
                </div>
                <span className="text-xs text-[#A1A1AA]">Sincronização em tempo real</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[rgba(255,255,255,0.06)] bg-[#1C1C1E] text-[#A1A1AA] font-bold text-[11px]">
                      <th className="py-3.5 px-4">Protocolo / Status</th>
                      <th className="py-3.5 px-4">Contato / Telefone</th>
                      <th className="py-3.5 px-4">Canal / Origem</th>
                      <th className="py-3.5 px-4">Veículo de Interesse</th>
                      <th className="py-3.5 px-4">Vendedor Responsável</th>
                      <th className="py-3.5 px-4">Data / Início</th>
                      <th className="py-3.5 px-4">Tempo SLA</th>
                      <th className="py-3.5 px-5 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(255,255,255,0.05)] text-white">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-[#1C1C1E] transition-colors">
                        {/* Protocolo + Status Badge */}
                        <td className="py-3 px-4 align-top">
                          <span className="font-mono font-bold text-white block text-xs">
                            {lead.metaLeadId}
                          </span>
                          {lead.crmStatus === 'VENDA' ? (
                            <span className="inline-block mt-1 bg-emerald-500/20 text-emerald-400 font-bold text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">
                              Venda Fechada
                            </span>
                          ) : lead.crmStatus === 'QUALIFICADO' || lead.crmStatus === 'AGENDADO' ? (
                            <span className="inline-block mt-1 bg-purple-500/20 text-[#DDD6FE] font-bold text-[10px] px-2 py-0.5 rounded-full border border-purple-500/30">
                              Qualificado
                            </span>
                          ) : lead.statusBadge === 'Em andamento' || lead.crmStatus === 'EM_ANDAMENTO' ? (
                            <span className="inline-block mt-1 bg-blue-500/20 text-blue-400 font-bold text-[10px] px-2 py-0.5 rounded-full border border-blue-500/30">
                              Em Atendimento
                            </span>
                          ) : (
                            <span className="inline-block mt-1 bg-amber-500/20 text-amber-400 font-bold text-[10px] px-2 py-0.5 rounded-full border border-amber-500/30">
                              Pendente
                            </span>
                          )}
                        </td>

                        {/* Contato (Nome + Telefone/Handle) */}
                        <td className="py-3 px-4 align-top">
                          <span className="font-bold text-white block text-xs">
                            {lead.customerName}
                          </span>
                          <span className="text-[#A1A1AA] font-mono text-[11px] block mt-0.5">
                            {lead.customerPhone}
                          </span>
                        </td>

                        {/* Origem (WhatsApp/Instagram + Meta badge) */}
                        <td className="py-3 px-4 align-top">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs text-white font-medium">
                              {lead.channelType === 'instagram' ? (
                                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-[10px] text-white">
                                  📸
                                </div>
                              ) : lead.origin.toLowerCase().includes('webmotors') ? (
                                <div className="w-4 h-4 rounded-full bg-rose-600 flex items-center justify-center text-[10px] text-white font-bold">
                                  W
                                </div>
                              ) : (
                                <div className="w-4 h-4 rounded-full bg-[#22C55E] flex items-center justify-center text-[10px] text-white">
                                  💬
                                </div>
                              )}
                              <span>{lead.channelNumber || lead.origin}</span>
                            </div>

                            {/* Meta Badge */}
                            {lead.hasMetaBadge && (
                              <div className="flex items-center gap-1 text-[#8B5CF6] font-bold text-[11px]">
                                <span className="text-sm">∞</span>
                                <span>Meta Ads</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Veículo de Interesse */}
                        <td className="py-3 px-4 align-top">
                          <span className="font-semibold text-white block text-xs">
                            {lead.vehicleInterest || 'Porsche 911 Carrera'}
                          </span>
                          <span className="text-emerald-400 font-mono text-[11px] block mt-0.5">
                            {lead.vehiclePrice ? `R$ ${lead.vehiclePrice.toLocaleString('pt-BR')}` : 'R$ 740.000'}
                          </span>
                        </td>

                        {/* Usuário / Equipe */}
                        <td className="py-3 px-4 align-top">
                          <span className="font-bold text-white block text-xs">
                            {lead.assignedSeller}
                          </span>
                          <span className="text-[#71717A] text-[11px] block mt-0.5">
                            {lead.team || 'Vendas Matriz'}
                          </span>
                        </td>

                        {/* Início */}
                        <td className="py-3 px-4 align-top text-[11px] text-[#A1A1AA]">
                          <span>{lead.createdAt}</span>
                        </td>

                        {/* Tempo de Atendimento */}
                        <td className="py-3 px-4 align-top text-[11px]">
                          <span className="text-emerald-400 font-mono font-bold block">
                            {lead.firstResponseLabel || '1.4 min'}
                          </span>
                          <span className="text-[#71717A] text-[10px]">
                            {lead.inactivityLabel || 'Há 10 min'}
                          </span>
                        </td>

                        {/* Ação: Conversa */}
                        <td className="py-3 px-5 align-top text-right">
                          <button
                            onClick={() => {
                              if (onNavigateToChat) {
                                onNavigateToChat({
                                  id: lead.id,
                                  name: lead.customerName,
                                  phone: lead.customerPhone,
                                });
                              } else {
                                toast.info(`Abrindo conversa com ${lead.customerName} no módulo de Atendimento.`);
                              }
                            }}
                            className="btn-conversa-action px-3 py-1.5 rounded-lg bg-[#8B5CF6]/20 hover:bg-[#8B5CF6] text-[#DDD6FE] hover:text-white border border-[#8B5CF6]/40 text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Conversa</span>
                            <span>→</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination footer */}
              <div className="px-5 py-3 bg-[#1C1C1E] border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs text-[#A1A1AA] font-medium">
                <span>Exibindo 1-{filteredLeads.length} de 4.336 leads</span>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 px-3 rounded-lg bg-[#27272A] text-white disabled:opacity-40" disabled>
                    Anterior
                  </button>
                  <button className="p-1.5 px-3 rounded-lg bg-[#27272A] text-white hover:bg-[#8B5CF6] transition-colors">
                    Próxima
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE: RANKINGS & VENDEDORES */}
        {/* ========================================================================= */}
        {activeTabMode === 'rankings' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Rankings &amp; Produtividade Comercial
                </h1>
                <p className="text-xs text-[#A1A1AA] font-normal mt-0.5">
                  Desempenho individual e da equipe na conversão de leads e tempo de SLA
                </p>
              </div>
            </div>

            {/* Ranking Table */}
            <div className="bg-[#101012] rounded-[14px] border border-[rgba(255,255,255,0.08)] overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between bg-[#1C1C1E]">
                <span className="font-bold text-white text-sm">Ranking de Vendedores</span>
                <span className="text-xs text-[#71717A]">Atualizado em tempo real</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[rgba(255,255,255,0.06)] bg-[#1C1C1E] text-[#A1A1AA] uppercase font-semibold text-[10px]">
                      <th className="p-3.5 px-5">Posição / Vendedor</th>
                      <th className="p-3.5">Unidade</th>
                      <th className="p-3.5 text-center">Vendas Fechadas</th>
                      <th className="p-3.5">Faturamento Total</th>
                      <th className="p-3.5">Tempo Médio SLA</th>
                      <th className="p-3.5 text-right px-5">Nota MotorGrid AI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                    {initialAuthUsers
                      .filter((u) => u.role !== 'Administrador')
                      .map((u, idx) => (
                        <tr key={u.id} className="hover:bg-[#1C1C1E] transition-colors">
                          <td className="p-3.5 px-5 flex items-center gap-3">
                            <span className="font-bold text-zinc-400 font-mono w-4">#{idx + 1}</span>
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-8 h-8 rounded-full object-cover ring-1 ring-[#8B5CF6]/40"
                            />
                            <div>
                              <div className="font-bold text-white text-xs">{u.name}</div>
                              <div className="text-[10px] text-[#A1A1AA]">{u.role}</div>
                            </div>
                          </td>
                          <td className="p-3.5 text-[#A1A1AA]">Matriz Alphaville</td>
                          <td className="p-3.5 text-center font-bold text-white font-mono">
                            {idx === 0 ? 8 : idx === 1 ? 6 : 4} carros
                          </td>
                          <td className="p-3.5 font-bold text-emerald-400 font-mono">
                            R$ {idx === 0 ? '2.980.000' : idx === 1 ? '2.140.000' : '1.540.000'}
                          </td>
                          <td className="p-3.5 font-mono text-zinc-300">{u.avgResponseTimeMin} min</td>
                          <td className="p-3.5 text-right px-5">
                            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-[#DDD6FE] border border-purple-500/30 font-mono font-bold">
                              {u.scoreAi || 94} pts
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE C: FUNIL COMERCIAL + CRM */}
        {/* ========================================================================= */}
        {activeTabMode === 'funil-comercial' && (
          <div className="space-y-6">
            <div className="bg-[#1C1C1E] rounded-[14px] p-6 border border-[rgba(255,255,255,0.06)]">
              <h2 className="font-bold text-white text-base mb-1">
                Funil Comercial Integrado: Meta Ads → Vendas Concretizadas
              </h2>
              <p className="text-xs text-[#A1A1AA] mb-6">
                Acompanhamento completo de cada etapa do lead desde a visualização no Facebook/Instagram até a assinatura do contrato e faturamento.
              </p>

              {/* Stage Flow */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                {[
                  { label: 'Impressões', value: '20.933', sub: 'Alcance 14.2k', color: 'bg-[#27272A] border-[rgba(255,255,255,0.08)] text-white' },
                  { label: 'Cliques', value: '325', sub: 'CTR 4,55%', color: 'bg-[#27272A] border-[rgba(255,255,255,0.08)] text-white' },
                  { label: 'Conversas', value: '92', sub: 'CPL R$ 5,76', color: 'bg-[rgba(139,92,246,0.15)] border-[rgba(139,92,246,0.3)] text-white' },
                  { label: 'Atendidos', value: '90', sub: '97.8% SLA', color: 'bg-[rgba(139,92,246,0.15)] border-[rgba(139,92,246,0.3)] text-white' },
                  { label: 'Qualificados', value: '58', sub: '63.0% fit', color: 'bg-[#27272A] border-[rgba(255,255,255,0.08)] text-white' },
                  { label: 'Agendados', value: '31', sub: '33.6% taxa', color: 'bg-[#27272A] border-[rgba(255,255,255,0.08)] text-white' },
                  { label: 'Visitas Loja', value: '22', sub: '23.9% visitas', color: 'bg-[#27272A] border-[rgba(255,255,255,0.08)] text-white' },
                  { label: 'Vendas', value: '11', sub: 'CAC R$ 48,16', color: 'bg-[rgba(16,185,129,0.15)] border-emerald-500/30 text-white' },
                ].map((stg, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${stg.color} text-center`}>
                    <span className="text-[11px] font-bold uppercase block text-[#A1A1AA]">{stg.label}</span>
                    <span className="text-xl font-black block my-1">{stg.value}</span>
                    <span className="text-[10px] font-medium text-[#71717A]">{stg.sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#1C1C1E] p-5 rounded-[14px] border border-[rgba(255,255,255,0.06)]">
                <span className="text-xs font-bold text-[#A1A1AA] uppercase">Investimento Total</span>
                <p className="text-2xl font-extrabold text-white mt-1">R$ 529,85</p>
                <span className="text-[11px] text-[#71717A] mt-1 block">Mídia paga Meta</span>
              </div>
              <div className="bg-[#1C1C1E] p-5 rounded-[14px] border border-[rgba(255,255,255,0.06)]">
                <span className="text-xs font-bold text-[#A1A1AA] uppercase">Faturamento Gerado</span>
                <p className="text-2xl font-extrabold text-emerald-400 mt-1">R$ 700.700,00</p>
                <span className="text-[11px] text-emerald-400/80 font-semibold mt-1 block">11 veículos vendidos</span>
              </div>
              <div className="bg-[#1C1C1E] p-5 rounded-[14px] border border-[rgba(255,255,255,0.06)]">
                <span className="text-xs font-bold text-[#A1A1AA] uppercase">CAC Médio (Custo/Venda)</span>
                <p className="text-2xl font-extrabold text-[#8B5CF6] mt-1">R$ 48,16</p>
                <span className="text-[11px] text-[#71717A] mt-1 block">Por carro vendido</span>
              </div>
              <div className="bg-[#1C1C1E] p-5 rounded-[14px] border border-[rgba(255,255,255,0.06)]">
                <span className="text-xs font-bold text-[#A1A1AA] uppercase">ROAS Comercial</span>
                <p className="text-2xl font-extrabold text-[#8B5CF6] mt-1">1.322,4x</p>
                <span className="text-[11px] text-[#8B5CF6]/80 font-semibold mt-1 block">Retorno bruto sobre anúncio</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE D: VISÃO DO DONO */}
        {/* ========================================================================= */}
        {activeTabMode === 'visao-dono' && (
          <ExecutiveDashboardView
            campaigns={campaigns}
            vehicles={initialMetaPerformanceByVehicle}
            dailyTrends={dailyTrends}
            period={selectedPeriod === '7d' ? 'Últimos 7 dias' : selectedPeriod === '14d' ? 'Últimos 14 dias' : 'Últimos 30 dias'}
            onOpenCampaignDetail={(camp) => setSelectedCampaignForModal(camp)}
          />
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODALS: Campaign Detail, Ad Creative Preview & Meta Connect */}
      {/* ========================================================================= */}
      {selectedCampaignForModal && (
        <CampaignDetailModal
          campaign={selectedCampaignForModal}
          allAds={ads}
          allLeads={leads}
          onClose={() => setSelectedCampaignForModal(null)}
        />
      )}

      {/* Ad Creative Video / Image Detail Modal */}
      {selectedAdForModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[rgba(255,255,255,0.08)] animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between bg-[#101012]">
              <div>
                <h3 className="font-bold text-white text-base">{selectedAdForModal.name}</h3>
                <p className="text-xs text-[#A1A1AA]">{selectedAdForModal.campaignName}</p>
              </div>
              <button
                onClick={() => setSelectedAdForModal(null)}
                className="w-8 h-8 rounded-full bg-[#27272A] hover:bg-[#8B5CF6] text-white flex items-center justify-center text-sm font-bold cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="w-full h-64 bg-black rounded-xl overflow-hidden relative border border-[rgba(255,255,255,0.06)]">
                <img
                  src={selectedAdForModal.creativeThumbnail}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-xs text-white text-xs px-3 py-1 rounded-md font-semibold border border-[rgba(255,255,255,0.1)]">
                  {selectedAdForModal.creativeType === 'VIDEO' ? '🎥 Vídeo / Reels' : '📸 Foto Estúdio'}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm">Texto do Anúncio (Copy)</h4>
                <p className="text-xs text-[#A1A1AA] bg-[#101012] p-3 rounded-xl border border-[rgba(255,255,255,0.06)]">
                  {selectedAdForModal.headline}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-4 gap-3 text-center pt-2">
                <div className="p-3 bg-[#101012] rounded-xl border border-[rgba(255,255,255,0.06)]">
                  <span className="text-[10px] font-bold text-[#71717A] uppercase block">Conversas</span>
                  <span className="text-lg font-extrabold text-white">{selectedAdForModal.leads}</span>
                </div>
                <div className="p-3 bg-[#101012] rounded-xl border border-[rgba(255,255,255,0.06)]">
                  <span className="text-[10px] font-bold text-[#71717A] uppercase block">CPL</span>
                  <span className="text-lg font-extrabold text-white">
                    R$ {selectedAdForModal.cpl.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="p-3 bg-[#101012] rounded-xl border border-[rgba(255,255,255,0.06)]">
                  <span className="text-[10px] font-bold text-[#71717A] uppercase block">CTR</span>
                  <span className="text-lg font-extrabold text-white">
                    {selectedAdForModal.ctr.toFixed(2).replace('.', ',')}%
                  </span>
                </div>
                <div className="p-3 bg-[#101012] rounded-xl border border-[rgba(255,255,255,0.06)]">
                  <span className="text-[10px] font-bold text-[#71717A] uppercase block">Investimento</span>
                  <span className="text-lg font-extrabold text-white">
                    R$ {selectedAdForModal.spend.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-[#101012] border-t border-[rgba(255,255,255,0.06)] flex justify-end">
              <button
                onClick={() => setSelectedAdForModal(null)}
                className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connect Meta Modal */}
      {isConnectModalOpen && (
        <MetaConnectModal
          config={accountConfig}
          onSaveConfig={(updated) => {
            setAccountConfig(updated);
            setIsConnectModalOpen(false);
          }}
          onClose={() => setIsConnectModalOpen(false)}
        />
      )}
    </div>
  );
};
