import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Download,
  QrCode,
  Sparkles,
  ArrowRight,
  Receipt,
  FileText,
  Copy,
  Check,
  Clock,
  X,
  Car,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Invoice, PlanTier } from '../../types';

interface BillingViewProps {
  invoices: Invoice[];
  activePlan: PlanTier;
  onUpgradePlan: (newPlan: PlanTier) => void;
}

export const BillingView: React.FC<BillingViewProps> = ({
  invoices,
  activePlan,
  onUpgradePlan,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [checkoutPlan, setCheckoutPlan] = useState<PlanTier | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);
  const [selectedInvoicePreview, setSelectedInvoicePreview] = useState<Invoice | null>(null);

  const plans = [
    {
      id: 'Starter' as PlanTier,
      name: 'Starter Connected',
      description: 'Ideal para frotas em validação e pequenas concessionárias conectadas.',
      monthlyPrice: 490,
      annualPrice: 390,
      features: [
        'Até 50 veículos conectados',
        'Telemetria básica e localização GPS',
        'Gestão de Tarefas & Checklist',
        'Até 5.000 requisições de API/mês',
        'Suporte por e-mail em até 24h',
      ],
      popular: false,
    },
    {
      id: 'Pro' as PlanTier,
      name: 'Pro Telematics',
      description: 'Perfeito para frotas em escala, telemetria OBD-II / CAN-Bus avançada.',
      monthlyPrice: 1290,
      annualPrice: 990,
      features: [
        'Até 500 veículos conectados',
        'Diagnóstico CAN-Bus & Alertas em tempo real',
        'Copilot IA Gemini 3.7 para diagnóstico de frotas',
        'Até 50.000 requisições de API/mês',
        'Exportação de Relatórios de Telemetria e SLA',
        'Suporte prioritário via WhatsApp',
      ],
      popular: true,
    },
    {
      id: 'Enterprise' as PlanTier,
      name: 'Enterprise Fleet',
      description: 'Para montadoras e grandes operadoras com SLA rígido de missão crítica.',
      monthlyPrice: 3490,
      annualPrice: 2790,
      features: [
        'Veículos & dispositivos ilimitados',
        'SLA garantido de 99.98%',
        'Firmware IoT Over-The-Air (FOTA)',
        'Consultoria mensal de Telemetria & CS',
        'Integração com ERP Protheus / SAP / Totvs',
        'Segurança automotiva ISO/SAE 21434 & LGPD',
      ],
      popular: false,
    },
  ];

  const handleStartCheckout = (plan: PlanTier) => {
    setCheckoutPlan(plan);
  };

  const handleConfirmUpgrade = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (checkoutPlan) {
        onUpgradePlan(checkoutPlan);
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
      setCheckoutPlan(null);
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Current Subscription Telemetry Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#1C1C1E] via-[#2A1B4E] to-[#1C1C1E] border border-[#8B5CF6]/30 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#C4B5FD] font-semibold uppercase tracking-wider">
              Assinatura MotorGrid Ativa
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#8B5CF6]/20 text-[#EDE9FE] border border-[#8B5CF6]/40 font-mono">
              Plano {activePlan}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Hub Central Automotivo • Renovação em 15/06/2026
          </h2>
          <p className="text-xs text-zinc-400">
            Faturamento automático via PIX / Cartão com nota fiscal eletrônica vinculada ao CNPJ cadastrado.
          </p>
        </div>

        {/* Resource Telemetry */}
        <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
          <div className="p-3 rounded-xl bg-[#0A0A0B] border border-zinc-800 text-center min-w-[100px]">
            <span className="text-[10px] text-zinc-400">Assentos Ativos</span>
            <div className="text-xs font-bold text-white font-mono mt-0.5">18 / 25</div>
            <span className="text-[9px] text-emerald-400 font-medium">72% em uso</span>
          </div>

          <div className="p-3 rounded-xl bg-[#0A0A0B] border border-zinc-800 text-center min-w-[100px]">
            <span className="text-[10px] text-zinc-400">API Calls Telemetria</span>
            <div className="text-xs font-bold text-white font-mono mt-0.5">38.4k / 50k</div>
            <span className="text-[9px] text-[#A78BFA] font-medium">Gemini 3.7</span>
          </div>

          <div className="p-3 rounded-xl bg-[#0A0A0B] border border-zinc-800 text-center min-w-[100px]">
            <span className="text-[10px] text-zinc-400">Dados Conectados</span>
            <div className="text-xs font-bold text-white font-mono mt-0.5">4.2 GB / 20 GB</div>
            <span className="text-[9px] text-[#C4B5FD] font-medium">21% seguro</span>
          </div>
        </div>
      </div>

      {/* Pricing Header & Billing Toggle */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <h3 className="text-xl font-extrabold text-white tracking-tight">
          Planos MotorGrid para a Escala da sua Frota
        </h3>
        <p className="text-xs text-zinc-400">
          Transparência total, sem fidelidade forçada. Cancele ou altere seu plano de tecnologia quando desejar.
        </p>

        {/* Toggle Monthly / Annual */}
        <div className="inline-flex items-center p-1 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/20 mt-2">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-[#8B5CF6] text-white shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Faturamento Mensal
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              billingCycle === 'annual'
                ? 'bg-[#8B5CF6] text-white shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Faturamento Anual</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              -20% OFF
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan) => {
          const isCurrent = activePlan === plan.id;
          const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col justify-between p-6 rounded-3xl border transition-all ${
                plan.popular
                  ? 'bg-gradient-to-b from-[#1C1C1E] via-[#2A1B4E]/50 to-[#1C1C1E] border-[#8B5CF6] shadow-2xl shadow-[#8B5CF6]/20 ring-1 ring-[#8B5CF6]'
                  : 'bg-[#1C1C1E] border-zinc-800 hover:border-[#8B5CF6]/40'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#8B5CF6] text-white shadow-lg tracking-wider">
                  MAIS ESCOLHIDO
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-white">{plan.name}</h4>
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                      Plano Atual
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 mt-1">{plan.description}</p>

                {/* Price Display */}
                <div className="my-5 flex items-baseline gap-1">
                  <span className="text-xs font-semibold text-zinc-400">R$</span>
                  <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
                    {price.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-xs text-zinc-400">/mês</span>
                </div>

                {/* Features List */}
                <div className="space-y-2.5 pt-4 border-t border-zinc-800 text-xs text-zinc-300">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleStartCheckout(plan.id)}
                  disabled={isCurrent}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    isCurrent
                      ? 'bg-zinc-800 text-zinc-400 cursor-default'
                      : plan.popular
                      ? 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-lg shadow-[#8B5CF6]/30 cursor-pointer'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 hover:border-[#8B5CF6]/40 cursor-pointer'
                  }`}
                >
                  {isCurrent ? (
                    'Plano Atual'
                  ) : (
                    <>
                      <span>Fazer Upgrade</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invoice History Section */}
      <div className="p-6 rounded-3xl bg-[#1C1C1E] border border-[#8B5CF6]/15 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#A78BFA]" />
              Histórico de Faturas & Recibos
            </h3>
            <p className="text-xs text-zinc-400">Download de comprovantes e notas fiscais para compliance fiscal</p>
          </div>
          <span className="text-xs text-zinc-400 font-mono">{invoices.length} faturas emitidas</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0A0A0B]/80 border-b border-zinc-800 text-zinc-400 font-semibold uppercase">
              <tr>
                <th className="px-4 py-3">Número</th>
                <th className="px-4 py-3">Cliente / Concessionária</th>
                <th className="px-4 py-3">Plano</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Vencimento</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Método</th>
                <th className="px-4 py-3 text-right">Comprovante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#8B5CF6]/5 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3 text-zinc-300 font-medium">{inv.company}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-300 font-mono">
                      {inv.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-zinc-200">
                    R$ {inv.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-zinc-400 font-mono">{inv.dueDate}</td>
                  <td className="px-4 py-3">
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
                  </td>
                  <td className="px-4 py-3 text-zinc-400 font-mono">{inv.paymentMethod}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedInvoicePreview(inv)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#8B5CF6]/20 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      title="Ver Comprovante / PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="text-[11px]">PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Checkout / Upgrade Modal */}
      {checkoutPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="fixed inset-0 -z-10"
            onClick={() => setCheckoutPlan(null)}
          />
          <div
            id="checkout-modal"
            className="w-full max-w-lg rounded-3xl bg-[#1C1C1E] border border-[#8B5CF6]/30 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Upgrade para Plano {checkoutPlan}</h3>
                <p className="text-xs text-zinc-400">Ativação instantânea das capacidades MotorGrid</p>
              </div>
              <button
                onClick={() => setCheckoutPlan(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">Método de Pagamento</label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                    paymentMethod === 'pix'
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-[#0A0A0B] border-zinc-800 text-zinc-400'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  PIX Instantâneo
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-[#8B5CF6]/15 border-[#8B5CF6]/40 text-[#DDD6FE]'
                      : 'bg-[#0A0A0B] border-zinc-800 text-zinc-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Cartão de Crédito
                </button>
              </div>
            </div>

            {paymentMethod === 'pix' ? (
              <div className="p-4 rounded-2xl bg-[#0A0A0B] border border-zinc-800 flex flex-col items-center text-center space-y-3">
                <div className="w-32 h-32 bg-white p-2 rounded-xl flex items-center justify-center">
                  <div className="w-full h-full border-4 border-zinc-950 border-dashed flex items-center justify-center text-zinc-950 font-mono font-bold text-xs">
                    [QR MOTORGRID]
                  </div>
                </div>
                <div className="text-xs text-zinc-400">
                  Escaneie com o app do seu banco ou use a chave copia-e-cola abaixo:
                </div>
                <div className="w-full flex items-center gap-2 p-2 rounded-lg bg-[#1C1C1E] border border-zinc-800 text-xs">
                  <span className="truncate font-mono text-[11px] text-zinc-300">
                    00020126580014br.gov.bcb.pix0136motorgrid-telematics-upgrade-f921...
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('00020126580014br.gov.bcb.pix0136motorgrid-telematics-upgrade-f921');
                      setCopiedPix(true);
                      setTimeout(() => setCopiedPix(false), 2000);
                    }}
                    className="px-2 py-1 rounded bg-[#8B5CF6] text-white text-[10px] font-semibold shrink-0 cursor-pointer"
                  >
                    {copiedPix ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-zinc-400">Número do Cartão Corporativo</label>
                  <input
                    type="text"
                    defaultValue="•••• •••• •••• 4242"
                    className="w-full mt-1 p-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-800 text-zinc-200 focus:outline-none focus:border-[#8B5CF6]/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-zinc-400">Validade</label>
                    <input
                      type="text"
                      defaultValue="12/28"
                      className="w-full mt-1 p-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-800 text-zinc-200 focus:outline-none focus:border-[#8B5CF6]/50"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400">CVV</label>
                    <input
                      type="text"
                      defaultValue="888"
                      className="w-full mt-1 p-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-800 text-zinc-200 focus:outline-none focus:border-[#8B5CF6]/50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Confirm Button */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setCheckoutPlan(null)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmUpgrade}
                disabled={isProcessing}
                className="flex-1 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold shadow-lg shadow-[#8B5CF6]/25 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? 'Processando...' : 'Confirmar Upgrade'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice PDF Preview Modal */}
      {selectedInvoicePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="fixed inset-0 -z-10"
            onClick={() => setSelectedInvoicePreview(null)}
          />
          <div className="w-full max-w-lg rounded-3xl bg-[#1C1C1E] border border-[#8B5CF6]/30 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#A78BFA]" />
                <h3 className="text-sm font-bold text-white">
                  Comprovante de Fatura {selectedInvoicePreview.invoiceNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInvoicePreview(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#0A0A0B] border border-zinc-800 space-y-3 text-xs">
              <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-400">Emitente:</span>
                <span className="text-white font-semibold">MotorGrid Automotive Technology Ltda.</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-400">Tomador:</span>
                <span className="text-white font-semibold">{selectedInvoicePreview.company}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-400">Plano Contratado:</span>
                <span className="text-white font-semibold">Plano {selectedInvoicePreview.plan}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-400">Método de Pagamento:</span>
                <span className="text-white font-semibold font-mono">{selectedInvoicePreview.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-zinc-400 font-bold">Valor Total:</span>
                <span className="text-emerald-400 font-mono font-bold text-sm">
                  R$ {selectedInvoicePreview.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                alert(`Download do arquivo ${selectedInvoicePreview.invoiceNumber}.pdf iniciado!`);
                setSelectedInvoicePreview(null);
              }}
              className="w-full py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#8B5CF6]/25"
            >
              <Download className="w-4 h-4" />
              Baixar Arquivo PDF Oficial
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
