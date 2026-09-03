import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Calculator,
  Car,
  DollarSign,
  Send,
  CheckCircle2,
  TrendingDown,
  ShieldCheck,
  Building2,
  Copy,
  Check,
  RefreshCw,
  Zap,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Vehicle } from '../../types';

interface AIFinancingSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadName?: string;
  leadPhone?: string;
  leadScore?: number;
  vehicle?: {
    brand: string;
    model: string;
    version?: string;
    year: number;
    price: number;
    photo?: string;
    km?: number;
  };
  onSendToChat?: (proposalText: string) => void;
}

export const AIFinancingSimulatorModal: React.FC<AIFinancingSimulatorModalProps> = ({
  isOpen,
  onClose,
  leadName = 'Marcelo Augusto Ferraz',
  leadPhone = '+55 (11) 98455-9012',
  leadScore = 92,
  vehicle = {
    brand: 'BMW',
    model: '320i M Sport',
    version: '2.0 Turbo ActiveFlex Aut.',
    year: 2023,
    price: 289900,
    photo: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=80',
    km: 18400,
  },
  onSendToChat,
}) => {
  // Financing state
  const [vehiclePrice, setVehiclePrice] = useState(vehicle.price);
  const [hasTradeIn, setHasTradeIn] = useState(true);
  const [tradeInModel, setTradeInModel] = useState('Jeep Compass Longitude 2022 (35.000 km)');
  const [tradeInFipe, setTradeInFipe] = useState(138000);
  const [tradeInEvaluation, setTradeInEvaluation] = useState(132000);
  const [cashDownPayment, setCashDownPayment] = useState(30000);
  
  // Bank selection & Rates
  const [selectedBank, setSelectedBank] = useState<'itau' | 'santander' | 'bv' | 'pan'>('itau');
  const [selectedTerm, setSelectedTerm] = useState<number>(48);
  const [includeBalloonPlan, setIncludeBalloonPlan] = useState(false);

  // AI Loading & copied state
  const [isCalculatingAI, setIsCalculatingAI] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [aiAnalysisNotes, setAiAnalysisNotes] = useState(
    'Lead com Grid Score 92/100 (Score A+). Perfil com excelente liquidez, entrada superior a 50% somando a troca e probabilidade de aprovação automática de 96% no Itaú Auto e Santander.'
  );

  useEffect(() => {
    setVehiclePrice(vehicle.price);
  }, [vehicle.price]);

  if (!isOpen) return null;

  // Financial calculations
  const totalDownPayment = (hasTradeIn ? tradeInEvaluation : 0) + cashDownPayment;
  const amountToFinance = Math.max(0, vehiclePrice - totalDownPayment);

  // Bank interest rates monthly
  const bankRates = {
    itau: { name: 'Itaú Veículos', monthlyRate: 0.0099, tag: 'Taxa VIP MotorGrid 0,99%', badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    santander: { name: 'Santander Auto', monthlyRate: 0.0109, tag: 'Aprovação em 2 min', badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
    bv: { name: 'BV Financeira', monthlyRate: 0.0115, tag: 'Entrada Flexível', badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    pan: { name: 'Banco PAN', monthlyRate: 0.0122, tag: 'Score Adaptativo', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  };

  const currentRate = bankRates[selectedBank].monthlyRate;

  // Price Calculation function (Price system / French amortization formula)
  const calculateInstallment = (principal: number, rate: number, months: number, residualPercent = 0) => {
    if (principal <= 0) return 0;
    if (residualPercent > 0) {
      const residualValue = principal * (residualPercent / 100);
      const financedAmount = principal - residualValue / Math.pow(1 + rate, months);
      return Math.round((financedAmount * rate) / (1 - Math.pow(1 + rate, -months)));
    }
    return Math.round((principal * rate) / (1 - Math.pow(1 + rate, -months)));
  };

  const installments = {
    24: calculateInstallment(amountToFinance, currentRate, 24),
    36: calculateInstallment(amountToFinance, currentRate, 36),
    48: calculateInstallment(amountToFinance, currentRate, 48),
    60: calculateInstallment(amountToFinance, currentRate, 60),
    balloon36: calculateInstallment(amountToFinance, currentRate, 36, 30), // 30% residual balloon
  };

  const handleRunAiRecalculation = () => {
    setIsCalculatingAI(true);
    setTimeout(() => {
      setIsCalculatingAI(false);
      setAiAnalysisNotes(
        `Inteligência Artificial MotorGrid atualizou as taxas com os birôs de crédito. O veículo ${vehicle.brand} ${vehicle.model} conta com subsídio de taxa no plano de 48x. Margem de negociação da troca otimizada para até 95,6% da FIPE.`
      );
    }, 600);
  };

  const generateProposalText = () => {
    const formattedPrice = vehiclePrice.toLocaleString('pt-BR');
    const formattedDownPayment = totalDownPayment.toLocaleString('pt-BR');
    const formattedFinanced = amountToFinance.toLocaleString('pt-BR');
    const selectedMonthValue = installments[selectedTerm as keyof typeof installments]?.toLocaleString('pt-BR');
    const tradeInText = hasTradeIn
      ? `🚗 *Veículo na Troca:* ${tradeInModel}\n   • Avaliação MotorGrid: R$ ${tradeInEvaluation.toLocaleString('pt-BR')} (95.6% FIPE)\n   • Entrada em Dinheiro: R$ ${cashDownPayment.toLocaleString('pt-BR')}\n`
      : `💵 *Entrada em Dinheiro:* R$ ${cashDownPayment.toLocaleString('pt-BR')}\n`;

    return `🏁 *MOTORGRID — SIMULAÇÃO EXCLUSIVA DE FINANCIAMENTO* 🏁

Olá, *${leadName}*!
Preparamos a condição personalizada com taxa especial pré-aprovada pelo nosso sistema de IA para a sua *${vehicle.brand} ${vehicle.model}*:

🚘 *Veículo Selecionado:*
• ${vehicle.brand} ${vehicle.model} ${vehicle.version || ''} (${vehicle.year})
• Valor Especial Showroom: *R$ ${formattedPrice}*

${tradeInText}
💰 *Entrada Total:* R$ ${formattedDownPayment}
📊 *Saldo a Financiar:* R$ ${formattedFinanced}
🏦 *Instituição Financeira:* ${bankRates[selectedBank].name} (Taxa Especial: ${(currentRate * 100).toFixed(2)}% a.m.)

━━━━━━━━━━━━━━━━━━━━━
🌟 *OPÇÕES DE PLANOS GERADOS PELA IA:*
• *24x* de R$ ${installments[24].toLocaleString('pt-BR')}
• *36x* de R$ ${installments[36].toLocaleString('pt-BR')}
• *48x* de R$ ${installments[48].toLocaleString('pt-BR')} ⭐ *(Plano Mais Recomendado)*
• *60x* de R$ ${installments[60].toLocaleString('pt-BR')}
• *Plano Balão VIP (36x):* R$ ${installments.balloon36.toLocaleString('pt-BR')} + residual final de 30%
━━━━━━━━━━━━━━━━━━━━━

✅ *Status do Crédito:* Pré-aprovado com score ${leadScore}/100
🛡️ *Garantia MotorGrid:* 1 Ano Certificada + Laudo Cautelar 100% Aprovado.

Podemos formalizar a reserva do veículo ou agendar seu Test Drive para hoje?`;
  };

  const handleCopyProposal = () => {
    const text = generateProposalText();
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSendToWhatsAppChat = () => {
    const text = generateProposalText();
    if (onSendToChat) {
      onSendToChat(text);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div role="dialog" className="modal-container modal-card w-full max-w-4xl bg-[#101012] border border-[#8B5CF6]/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#1C1C1E] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/40 shadow-inner">
              <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Simulação de Financiamento por IA</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30 text-[10px] font-bold">
                  Grid AI Engine
                </span>
              </div>
              <p className="text-xs text-[#A1A1AA]">
                Cálculo instantâneo de crédito, avaliação de troca e envio automático ao WhatsApp de <strong className="text-white">{leadName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          
          {/* Top Vehicle & Customer Quick Info Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Vehicle Info Card */}
            <div className="md:col-span-2 p-4 rounded-xl bg-[#1C1C1E] border border-white/10 flex items-center gap-4">
              {vehicle.photo && (
                <img
                  src={vehicle.photo}
                  alt={vehicle.model}
                  className="w-24 h-20 rounded-lg object-cover ring-1 ring-white/10 shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-[#8B5CF6] tracking-wider">
                  Veículo do Showroom
                </span>
                <h4 className="text-sm font-bold text-white truncate">
                  {vehicle.brand} {vehicle.model}
                </h4>
                <p className="text-xs text-[#A1A1AA] truncate">{vehicle.version}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-white/80">
                  <span>Ano: <strong>{vehicle.year}</strong></span>
                  <span>•</span>
                  <span>Km: <strong>{vehicle.km ? vehicle.km.toLocaleString('pt-BR') : '18.400'} km</strong></span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] text-[#A1A1AA] block">Valor à Vista</span>
                <span className="text-lg font-extrabold text-[#8B5CF6]">
                  R$ {vehiclePrice.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>

            {/* Lead Scoring Badge Card */}
            <div className="p-4 rounded-xl bg-[#1C1C1E] border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#A1A1AA]">Score do Cliente</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  Score A+
                </span>
              </div>
              <div className="my-1">
                <div className="text-2xl font-black text-white font-mono">{leadScore} <span className="text-xs text-[#A1A1AA] font-normal">/ 100 pts</span></div>
                <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> 96% chance de aprovação
                </div>
              </div>
              <span className="text-[10px] text-[#A1A1AA] truncate">{leadPhone}</span>
            </div>
          </div>

          {/* Trade-In Vehicle (Veículo na Troca) & Cash Down Payment */}
          <div className="p-4 rounded-xl bg-[#1C1C1E] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-[#8B5CF6]" />
                <h4 className="text-sm font-bold text-white">Veículo na Troca (Trade-In Avaliado por IA)</h4>
              </div>
              <label className="flex items-center gap-2 text-xs text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasTradeIn}
                  onChange={(e) => setHasTradeIn(e.target.checked)}
                  className="rounded border-white/20 text-[#8B5CF6] focus:ring-[#8B5CF6] bg-[#27272A]"
                />
                <span>Incluir Carro na Troca</span>
              </label>
            </div>

            {hasTradeIn && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/5">
                <div>
                  <label className="text-[11px] text-[#A1A1AA] block mb-1">Modelo & Ano da Troca</label>
                  <input
                    type="text"
                    value={tradeInModel}
                    onChange={(e) => setTradeInModel(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#101012] border border-white/10 text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#A1A1AA] block mb-1">Tabela FIPE Referência (R$)</label>
                  <input
                    type="number"
                    value={tradeInFipe}
                    onChange={(e) => setTradeInFipe(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#101012] border border-white/10 text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#A1A1AA] block mb-1 flex items-center justify-between">
                    <span>Avaliação MotorGrid IA (R$)</span>
                    <span className="text-[#8B5CF6] font-bold">95.6% FIPE</span>
                  </label>
                  <input
                    type="number"
                    value={tradeInEvaluation}
                    onChange={(e) => setTradeInEvaluation(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#101012] border border-[#8B5CF6]/40 text-[#8B5CF6] font-bold focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
              </div>
            )}

            {/* Cash Down Payment & Sliders */}
            <div className="pt-3 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#A1A1AA]">Entrada Complementar em Dinheiro/Pix</label>
                  <span className="text-sm font-bold text-white">R$ {cashDownPayment.toLocaleString('pt-BR')}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150000"
                  step="5000"
                  value={cashDownPayment}
                  onChange={(e) => setCashDownPayment(Number(e.target.value))}
                  className="w-full accent-[#8B5CF6] cursor-pointer"
                />
                <div className="flex items-center gap-2 mt-2">
                  {[0, 20000, 30000, 50000, 80000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setCashDownPayment(val)}
                      className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                        cashDownPayment === val
                          ? 'bg-[#8B5CF6] text-white font-bold'
                          : 'bg-[#27272A] text-[#A1A1AA] hover:text-white'
                      }`}
                    >
                      {val === 0 ? 'Sem entrada adicional' : `+R$ ${(val / 1000).toFixed(0)}k`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Entry vs Amount Financed Summary */}
              <div className="p-3 rounded-lg bg-[#101012] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#A1A1AA] block uppercase">Entrada Total Acumulada</span>
                  <span className="text-base font-extrabold text-emerald-400">
                    R$ {totalDownPayment.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-[10px] text-[#A1A1AA] block">
                    ({((totalDownPayment / vehiclePrice) * 100).toFixed(1)}% do valor do carro)
                  </span>
                </div>
                
                <div className="h-8 w-px bg-white/10" />

                <div>
                  <span className="text-[10px] text-[#A1A1AA] block uppercase">Saldo a Financiar</span>
                  <span className="text-base font-extrabold text-white">
                    R$ {amountToFinance.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Selection & AI Interest Optimization */}
          <div className="p-4 rounded-xl bg-[#1C1C1E] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#8B5CF6]" />
                <h4 className="text-sm font-bold text-white">Instituição Financeira &amp; Taxas Parceiras</h4>
              </div>
              <button
                type="button"
                onClick={handleRunAiRecalculation}
                disabled={isCalculatingAI}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 text-[#8B5CF6] border border-[#8B5CF6]/40 text-xs font-semibold transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCalculatingAI ? 'animate-spin' : ''}`} />
                <span>{isCalculatingAI ? 'Otimizando Taxas...' : 'Reavaliar com IA'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(Object.keys(bankRates) as Array<keyof typeof bankRates>).map((bankKey) => {
                const b = bankRates[bankKey];
                const isSelected = selectedBank === bankKey;
                return (
                  <button
                    key={bankKey}
                    type="button"
                    onClick={() => setSelectedBank(bankKey)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] shadow-lg ring-1 ring-[#8B5CF6]'
                        : 'bg-[#101012] border-white/10 hover:border-white/20 text-[#A1A1AA]'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#8B5CF6]" />
                    )}
                    <span className="text-xs font-bold text-white block">{b.name}</span>
                    <span className="text-sm font-extrabold text-[#8B5CF6] block mt-0.5">
                      {(b.monthlyRate * 100).toFixed(2)}% <span className="text-[10px] text-[#A1A1AA] font-normal">a.m.</span>
                    </span>
                    <span className="text-[9px] mt-1.5 inline-block px-1.5 py-0.5 rounded bg-white/5 text-white/80 font-medium">
                      {b.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Calculation Results & Installment Plans Table */}
          <div className="p-4 rounded-xl bg-[#1C1C1E] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#8B5CF6]" />
                <h4 className="text-sm font-bold text-white">Planos de Parcelamento Gerados pela IA</h4>
              </div>
              <span className="text-xs text-[#A1A1AA]">
                Simulação baseada no saldo de <strong>R$ {amountToFinance.toLocaleString('pt-BR')}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { term: 24, label: '24x Meses', val: installments[24], tag: 'Menor Juros Total' },
                { term: 36, label: '36x Meses', val: installments[36], tag: 'Equilíbrio Ideal' },
                { term: 48, label: '48x Meses', val: installments[48], tag: '⭐ Mais Escolhido', highlight: true },
                { term: 60, label: '60x Meses', val: installments[60], tag: 'Menor Parcela' },
                { term: 36, isBalloon: true, label: 'Plano Balão 36x', val: installments.balloon36, tag: '+ 30% no Final' },
              ].map((item, idx) => {
                const isSelected = selectedTerm === item.term && !item.isBalloon;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedTerm(item.term)}
                    className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-between ${
                      item.highlight
                        ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] shadow-md ring-1 ring-[#8B5CF6]/50'
                        : isSelected
                        ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/60'
                        : 'bg-[#101012] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-white block">{item.label}</span>
                      <span className="text-base font-black text-[#8B5CF6] block mt-1">
                        R$ {item.val.toLocaleString('pt-BR')}
                      </span>
                    </div>

                    <span className="text-[10px] mt-2 py-0.5 px-1.5 rounded-md bg-white/5 text-[#A1A1AA] font-semibold block">
                      {item.tag}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* AI Insights Bar */}
            <div className="p-3 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-xs text-white/90 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#8B5CF6] font-semibold">Análise de Crédito Grid AI: </strong>
                <span>{aiAnalysisNotes}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-[#1C1C1E] border-t border-white/10 flex items-center justify-between shrink-0 gap-3">
          <button
            type="button"
            onClick={handleCopyProposal}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer border border-white/10"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#A1A1AA]" />}
            <span>{isCopied ? 'Proposta Copiada!' : 'Copiar Texto da Proposta'}</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white text-xs font-semibold transition-all cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              id="send-ai-simulation-whatsapp-btn"
              onClick={handleSendToWhatsAppChat}
              className="px-5 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold shadow-lg shadow-[#8B5CF6]/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Proposta ao WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
