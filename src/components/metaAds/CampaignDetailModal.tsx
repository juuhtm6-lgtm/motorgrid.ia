import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Car,
  Clock,
  Eye,
  MousePointer,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  MessageSquare,
  Phone,
  Mail,
} from 'lucide-react';
import { MetaCampaign, MetaLeadTracking, MetaAd } from '../../types';

interface CampaignDetailModalProps {
  campaign: MetaCampaign | null;
  leads: MetaLeadTracking[];
  ads: MetaAd[];
  onClose: () => void;
  onOpenLeadDetail?: (lead: MetaLeadTracking) => void;
}

export const CampaignDetailModal: React.FC<CampaignDetailModalProps> = ({
  campaign,
  leads,
  ads,
  onClose,
  onOpenLeadDetail,
}) => {
  const [activeTab, setActiveTab] = useState<'kpis' | 'leads' | 'ads'>('kpis');

  if (!campaign) return null;

  const campaignLeads = leads.filter(
    (l) => l.campaignId === campaign.id || l.campaignName === campaign.name
  );
  const campaignAds = ads.filter(
    (a) => a.campaignId === campaign.id || a.campaignName === campaign.name
  );

  return (
    <div
      id="campaign-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#161618] border border-[#8B5CF6]/30 rounded-2xl shadow-2xl overflow-hidden text-zinc-200 font-['Plus_Jakarta_Sans',sans-serif]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-[#121214]">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-zinc-700 shrink-0">
              <img
                src={campaign.vehicleThumbnail}
                alt={campaign.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    campaign.status === 'ACTIVE'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-zinc-700/50 text-zinc-400'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {campaign.status === 'ACTIVE' ? 'Ativa na Meta' : 'Pausada'}
                </span>
                <span className="text-xs text-zinc-400">ID: {campaign.id}</span>
                <span className="text-xs text-zinc-500">•</span>
                <span className="text-xs text-zinc-400">Início: {campaign.startDate}</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5 leading-snug">
                {campaign.name}
              </h2>
            </div>
          </div>

          <button
            id="close-campaign-modal-btn"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tabs Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-zinc-800 bg-[#141416]">
          <button
            onClick={() => setActiveTab('kpis')}
            className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'kpis'
                ? 'border-[#8B5CF6] text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Métricas de Mídia &amp; CRM
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'leads'
                ? 'border-[#8B5CF6] text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Leads Gerados ({campaignLeads.length})
          </button>
          <button
            onClick={() => setActiveTab('ads')}
            className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ads'
                ? 'border-[#8B5CF6] text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Anúncios / Criativos ({campaignAds.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'kpis' && (
            <>
              {/* Top Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-[#1C1C1E] border border-zinc-800/80">
                  <div className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">
                    Investimento
                  </div>
                  <div className="text-xl font-bold text-white mt-1">
                    R$ {campaign.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">
                    Orçamento: R$ {campaign.budget.toFixed(2)}/dia
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#1C1C1E] border border-zinc-800/80">
                  <div className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">
                    Leads Meta
                  </div>
                  <div className="text-xl font-bold text-[#C4B5FD] mt-1">
                    {campaign.leads}
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">
                    CPL: R$ {campaign.cpl.toFixed(2)}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#1C1C1E] border border-zinc-800/80">
                  <div className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">
                    Vendas Fechadas
                  </div>
                  <div className="text-xl font-bold text-emerald-400 mt-1">
                    {campaign.crmVendas}
                  </div>
                  <div className="text-[10px] text-emerald-400/80 mt-0.5">
                    CAC: R$ {campaign.costPerSale.toFixed(2)}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#1C1C1E] border border-zinc-800/80">
                  <div className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">
                    Receita / ROAS
                  </div>
                  <div className="text-xl font-bold text-emerald-400 mt-1">
                    R$ {(campaign.crmReceita / 1000).toFixed(0)}k
                  </div>
                  <div className="text-[10px] text-[#C4B5FD] font-semibold mt-0.5">
                    ROAS: {campaign.roas.toFixed(1)}x
                  </div>
                </div>
              </div>

              {/* Traffic Metrics Section */}
              <div className="p-4 rounded-xl bg-[#1C1C1E] border border-zinc-800">
                <h3 className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-3 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-[#8B5CF6]" />
                  Métricas de Tráfego &amp; Entrega (Meta Ads)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-zinc-400">Impressões:</span>
                    <p className="text-sm font-bold text-white mt-0.5">
                      {campaign.impressions.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-400">Alcance Único:</span>
                    <p className="text-sm font-bold text-white mt-0.5">
                      {campaign.reach.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-400">Frequência:</span>
                    <p className="text-sm font-bold text-white mt-0.5">
                      {campaign.frequency.toFixed(2)}x
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-400">CPM Médio:</span>
                    <p className="text-sm font-bold text-white mt-0.5">
                      R$ {campaign.cpm.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-400">Cliques no Link:</span>
                    <p className="text-sm font-bold text-white mt-0.5">
                      {campaign.clicks.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-400">CTR (Taxa de Clique):</span>
                    <p className="text-sm font-bold text-emerald-400 mt-0.5">
                      {campaign.ctr.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-400">CPC (Custo por Clique):</span>
                    <p className="text-sm font-bold text-white mt-0.5">
                      R$ {campaign.cpc.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-400">Conjuntos / Anúncios:</span>
                    <p className="text-sm font-bold text-white mt-0.5">
                      {campaign.adsetsCount} conjuntos / {campaign.adsCount} criativos
                    </p>
                  </div>
                </div>
              </div>

              {/* Commercial CRM Funnel for this Campaign */}
              <div className="p-4 rounded-xl bg-[#1C1C1E] border border-zinc-800">
                <h3 className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-3 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-[#8B5CF6]" />
                  Cruzamento Comercial CRM &amp; Fechamentos da Campanha
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center">
                  <div className="p-2.5 rounded-lg bg-[#141416] border border-zinc-800">
                    <span className="text-[10px] text-zinc-400">Leads</span>
                    <p className="text-base font-bold text-white">{campaign.leads}</p>
                    <span className="text-[9px] text-zinc-400">100%</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#141416] border border-zinc-800">
                    <span className="text-[10px] text-zinc-400">Atendidos</span>
                    <p className="text-base font-bold text-white">
                      {campaign.crmAtendimentos}
                    </p>
                    <span className="text-[9px] text-emerald-400">
                      {((campaign.crmAtendimentos / (campaign.leads || 1)) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#141416] border border-zinc-800">
                    <span className="text-[10px] text-zinc-400">Qualificados</span>
                    <p className="text-base font-bold text-white">
                      {campaign.crmQualificados}
                    </p>
                    <span className="text-[9px] text-zinc-400">
                      {((campaign.crmQualificados / (campaign.crmAtendimentos || 1)) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#141416] border border-zinc-800">
                    <span className="text-[10px] text-zinc-400">Agendamentos</span>
                    <p className="text-base font-bold text-[#C4B5FD]">
                      {campaign.crmAgendamentos}
                    </p>
                    <span className="text-[9px] text-zinc-400">
                      R$ {campaign.cpaAgendamento.toFixed(0)}/agend
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#141416] border border-zinc-800">
                    <span className="text-[10px] text-zinc-400">Visitas Loja</span>
                    <p className="text-base font-bold text-[#C4B5FD]">
                      {campaign.crmVisitas}
                    </p>
                    <span className="text-[9px] text-zinc-400">
                      R$ {campaign.costPerVisita.toFixed(0)}/visita
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#25193A] border border-[#8B5CF6]/50">
                    <span className="text-[10px] text-[#C4B5FD] font-semibold">Vendas</span>
                    <p className="text-base font-bold text-emerald-400">
                      {campaign.crmVendas}
                    </p>
                    <span className="text-[9px] text-emerald-400 font-bold">
                      {campaign.conversionLeadToSale.toFixed(1)}% conv.
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    <span>
                      Tempo Médio de 1ª Resposta (SLA):{' '}
                      <strong className="text-white">
                        {campaign.avgResponseTimeMin} minutos
                      </strong>
                    </span>
                  </div>
                  <div>
                    Lucro Bruto Estimado Gerado:{' '}
                    <strong className="text-emerald-400">
                      R$ {campaign.crmLucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </strong>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'leads' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">
                  Lista de Leads Desta Campanha ({campaignLeads.length})
                </h4>
                <span className="text-xs text-zinc-400">
                  Rastreamento direto via Facebook Lead Ads &amp; WhatsApp
                </span>
              </div>

              {campaignLeads.length === 0 ? (
                <div className="p-8 text-center bg-[#1C1C1E] rounded-xl border border-zinc-800 text-zinc-400 text-xs">
                  Nenhum lead com este ID específico nesta amostra.
                </div>
              ) : (
                <div className="space-y-2">
                  {campaignLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => onOpenLeadDetail && onOpenLeadDetail(lead)}
                      className="p-3.5 rounded-xl bg-[#1C1C1E] hover:bg-zinc-800/80 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 flex items-center justify-center text-xs font-bold text-[#C4B5FD] shrink-0">
                          {lead.customerName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm flex items-center gap-2">
                            <span>{lead.customerName}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                lead.crmStatus === 'VENDA'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : lead.crmStatus === 'AGENDADO'
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  : lead.crmStatus === 'VISITOU'
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  : 'bg-zinc-700/50 text-zinc-300'
                              }`}
                            >
                              {lead.crmStatus}
                            </span>
                          </div>
                          <div className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5">
                            <span>{lead.customerPhone}</span>
                            <span>•</span>
                            <span>{lead.origin}</span>
                            <span>•</span>
                            <span>{lead.createdAt}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-right">
                        <div className="text-xs">
                          <span className="text-zinc-400 text-[10px] block">Vendedor</span>
                          <span className="font-medium text-zinc-200">
                            {lead.assignedSeller}
                          </span>
                        </div>
                        {lead.saleValue && (
                          <div className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                            R$ {(lead.saleValue / 1000).toFixed(0)}k
                          </div>
                        )}
                        <ChevronRight className="w-4 h-4 text-zinc-500" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'ads' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">
                Criativos Vinculados a esta Campanha
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {campaignAds.map((ad) => (
                  <div
                    key={ad.id}
                    className="p-4 rounded-xl bg-[#1C1C1E] border border-zinc-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {ad.creativeType}
                        </span>
                        <span className="text-xs font-semibold text-emerald-400">
                          CTR {ad.ctr.toFixed(2)}%
                        </span>
                      </div>
                      <div className="h-32 rounded-lg overflow-hidden border border-zinc-700/80 mb-3">
                        <img
                          src={ad.creativeThumbnail}
                          alt={ad.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <h5 className="font-bold text-white text-sm line-clamp-1">
                        {ad.name}
                      </h5>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                        {ad.headline}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800 grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-zinc-400">Investido</span>
                        <p className="font-bold text-white">R$ {ad.spend.toFixed(0)}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400">Leads</span>
                        <p className="font-bold text-[#C4B5FD]">{ad.leads}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400">Vendas</span>
                        <p className="font-bold text-emerald-400">{ad.crmVendas}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-[#121214]">
          <div className="text-xs text-zinc-400">
            Sincronizado diretamente com a Meta Marketing API v19.0
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
