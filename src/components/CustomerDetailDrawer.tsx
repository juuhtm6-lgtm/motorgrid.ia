import React, { useState } from 'react';
import {
  X,
  Building2,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Send,
  CreditCard,
  Tag,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  FileText,
} from 'lucide-react';
import { Customer, Invoice } from '../types';

interface CustomerDetailDrawerProps {
  customer: Customer | null;
  onClose: () => void;
  invoices: Invoice[];
  onUpdateNotes?: (customerId: string, notes: string) => void;
}

export const CustomerDetailDrawer: React.FC<CustomerDetailDrawerProps> = ({
  customer,
  onClose,
  invoices,
  onUpdateNotes,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'ai' | 'invoices'>('overview');
  const [notes, setNotes] = useState(customer?.notes || '');
  const [copied, setCopied] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [aiDraft, setAiDraft] = useState<string | null>(null);
  const [draftType, setDraftType] = useState<'upsell' | 'churn' | 'onboarding'>('upsell');

  if (!customer) return null;

  const customerInvoices = invoices.filter((i) => i.customerId === customer.id);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(customer.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateAiAnalysis = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Gere uma análise de retenção e potencial de expansão para este cliente de SaaS:
Empresa: ${customer.company}
Plano Atual: ${customer.plan} (MRR: R$ ${customer.mrr})
Health Score: ${customer.healthScore}/100
Status: ${customer.status}
Segmento: ${customer.segment}
Observações prévias: ${customer.notes || 'Sem observações'}

Forneça:
1. Avaliação do Risco de Churn (Baixo/Médio/Alto) com justificativa.
2. Oportunidade de Upsell ou Cross-sell.
3. Próximo passo recomendado para o Gerente de Sucesso (CS).`,
        }),
      });
      const data = await res.json();
      setAiAnalysis(data.text);
    } catch (e) {
      setAiAnalysis(
        `### Análise da Conta: ${customer.company}
- **Score:** ${customer.healthScore}/100
- **Risco:** ${customer.healthScore < 60 ? 'Alto Risco de Cancelamento' : 'Saudável com tração constante'}
- **Recomendação CS:** Agendar reunião de alinhamento trimestral e apresentar novas features do módulo de relatórios.`
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleGenerateAiEmail = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/gemini/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: draftType,
          customerName: customer.name,
          company: customer.company,
          context: `Plano atual: ${customer.plan}, MRR R$ ${customer.mrr}, Health Score ${customer.healthScore}`,
        }),
      });
      const data = await res.json();
      setAiDraft(data.draft);
    } catch (e) {
      setAiDraft(`**Assunto:** Oportunidade de expansão para a ${customer.company}\n\nOlá ${customer.name}, notamos o crescimento do seu time no plano ${customer.plan}...`);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div
        id="customer-detail-drawer"
        className="w-full max-w-xl h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/70 flex items-start justify-between">
          <div className="flex items-center gap-3.5 min-w-0">
            <img
              src={customer.avatar}
              alt={customer.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/40 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white truncate">{customer.company}</h2>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    customer.status === 'Ativo'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : customer.status === 'Em Risco'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  }`}
                >
                  {customer.status}
                </span>
              </div>
              <div className="text-xs text-slate-400 truncate mt-0.5">
                {customer.name} • {customer.city}
              </div>
              <div className="text-[11px] text-slate-500 truncate">{customer.segment}</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-800 bg-slate-950/40 text-xs">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`pb-3 font-medium transition-colors border-b-2 ${
              activeSubTab === 'overview'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Visão Geral & Contato
          </button>
          <button
            onClick={() => setActiveSubTab('ai')}
            className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
              activeSubTab === 'ai'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            IA & Propensão Gemini
          </button>
          <button
            onClick={() => setActiveSubTab('invoices')}
            className={`pb-3 font-medium transition-colors border-b-2 ${
              activeSubTab === 'invoices'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Faturas ({customerInvoices.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeSubTab === 'overview' && (
            <>
              {/* Financial & Health KPIs */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400">MRR Mensal</span>
                  <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                    R$ {customer.mrr.toLocaleString('pt-BR')}
                  </div>
                  <span className="text-[10px] text-slate-500">Plano {customer.plan}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400">Health Score</span>
                  <div
                    className={`text-sm font-bold font-mono mt-0.5 ${
                      customer.healthScore >= 80
                        ? 'text-emerald-400'
                        : customer.healthScore >= 60
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {customer.healthScore} / 100
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {customer.healthScore >= 80 ? 'Excelente' : 'Atenção CS'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400">Renovação</span>
                  <div className="text-xs font-bold text-white font-mono mt-0.5">
                    {customer.renewalDate}
                  </div>
                  <span className="text-[10px] text-slate-500">Início: {customer.startDate}</span>
                </div>
              </div>

              {/* Contact Card & Quick Actions */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Canais de Contato
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span>{customer.email}</span>
                    </div>
                    <button
                      onClick={handleCopyEmail}
                      className="p-1 rounded text-slate-400 hover:text-white"
                      title="Copiar e-mail"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {customer.contactPhone && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Phone className="w-4 h-4 text-emerald-400" />
                        <span>{customer.contactPhone}</span>
                      </div>
                      <a
                        href={`https://wa.me/${customer.contactPhone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                      >
                        WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" /> Tags da Conta
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {customer.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Notes Editor */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Anotações de Customer Success
                </h3>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    if (onUpdateNotes) onUpdateNotes(customer.id, e.target.value);
                  }}
                  placeholder="Adicione observações sobre a conta, histórico de reuniões ou combinados..."
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </>
          )}

          {activeSubTab === 'ai' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/60 to-slate-950 border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <h3 className="text-xs font-bold text-white">Análise Preditiva da Conta</h3>
                  </div>
                  <button
                    onClick={handleGenerateAiAnalysis}
                    disabled={isAiLoading}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-all disabled:opacity-50"
                  >
                    {isAiLoading ? 'Processando...' : 'Avaliar com IA'}
                  </button>
                </div>

                {aiAnalysis ? (
                  <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed p-3 rounded-lg bg-slate-900 border border-slate-800">
                    {aiAnalysis}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    Clique no botão acima para acionar o Gemini e analisar fatores de retenção, risco de churn e oportunidade de upsell para <strong>{customer.company}</strong>.
                  </p>
                )}
              </div>

              {/* AI Email Drafter */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white">Redator de E-mail Personalizado</h3>
                  <select
                    value={draftType}
                    onChange={(e: any) => setDraftType(e.target.value)}
                    className="bg-slate-900 border border-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-lg"
                  >
                    <option value="upsell">Proposta de Upsell</option>
                    <option value="churn">Resgate / Prevenção de Churn</option>
                    <option value="onboarding">Boas-vindas / Onboarding</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateAiEmail}
                  disabled={isAiLoading}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  Gerar Rascunho de E-mail
                </button>

                {aiDraft && (
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                    <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                      {aiDraft}
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(aiDraft);
                        alert('E-mail copiado para a área de transferência!');
                      }}
                      className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
                    >
                      Copiar E-mail
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSubTab === 'invoices' && (
            <div className="space-y-3">
              {customerInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white">{inv.invoiceNumber}</div>
                    <div className="text-[11px] text-slate-400">
                      Vencimento: {inv.dueDate} • {inv.paymentMethod}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        inv.status === 'Pago'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : inv.status === 'Pendente'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {inv.status}
                    </span>
                    <span className="font-mono font-bold text-white">
                      R$ {inv.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              ))}

              {customerInvoices.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-xs">
                  Nenhuma fatura registrada para este cliente.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
