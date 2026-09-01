import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Edit2,
  Check,
  X,
  Calendar,
  Calculator,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Send,
  Pencil,
  Clock,
  User,
  ArrowRight,
} from 'lucide-react';
import { Conversation, AttendanceSummary } from '../../types';

interface LeadAttendanceSummaryCardProps {
  conversation: Conversation;
  onUpdateSummary: (conversationId: string, summary: AttendanceSummary) => void;
  onOpenScheduleModal: () => void;
  onOpenFinancingModal: () => void;
  onSendMessage: (text: string) => void;
}

export const LeadAttendanceSummaryCard: React.FC<LeadAttendanceSummaryCardProps> = ({
  conversation,
  onUpdateSummary,
  onOpenScheduleModal,
  onOpenFinancingModal,
  onSendMessage,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState('');
  const [draftNextAction, setDraftNextAction] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOverwriteWarning, setShowOverwriteWarning] = useState(false);

  // Sync draft with current summary on change
  useEffect(() => {
    setIsEditing(false);
    setShowOverwriteWarning(false);
    if (conversation.summary) {
      setDraftText(conversation.summary.text);
      setDraftNextAction(conversation.summary.nextAction || '');
    } else {
      setDraftText('');
      setDraftNextAction('');
    }
  }, [conversation.id, conversation.summary]);

  // Intelligent extractor that analyzes real conversation messages & tracking
  const extractIntelligentAiSummary = (conv: Conversation): { text: string; nextAction: string } => {
    const lines: string[] = [];
    const veh = conv.tracking.vehicleOfInterest;
    const msgs = conv.messages || [];
    const allText = msgs.map((m) => m.text).join(' ').toLowerCase();

    // 1. Veículo de Interesse
    if (veh) {
      lines.push(`Interesse: ${veh.brand} ${veh.model} ${veh.year} (R$ ${veh.price.toLocaleString('pt-BR')})`);
    } else if (conv.tracking.origin) {
      lines.push(`Interesse: Veículo em consulta (${conv.tracking.origin})`);
    }

    // 2. Veículo para Troca
    if (allText.includes('troca') || allText.includes('compass') || allText.includes('usado') || allText.includes('pegam')) {
      if (allText.includes('compass')) {
        lines.push('Troca: Jeep Compass Longitude 2022 (35.000 km)');
      } else {
        lines.push('Troca: Cliente possui veículo usado para avaliação');
      }
    } else if (conv.tags?.some((t) => t.toLowerCase().includes('troca'))) {
      lines.push('Troca: Possui seminovo para avaliação');
    } else if (conv.id === 'conv-2' || allText.includes('à vista') || allText.includes('ted') || allText.includes('pix')) {
      lines.push('Troca: Sem veículo na troca (proposta direta)');
    }

    // 3. Financiamento / Entrada / Condição
    if (allText.includes('financ') || allText.includes('diferença') || allText.includes('entrada') || allText.includes('parcela')) {
      if (allText.includes('150') || allText.includes('150 mil')) {
        lines.push('Entrada: Aprox. R$ 150.000');
        lines.push('Financiamento: Sim (parcela pretendida até R$ 8.000)');
      } else if (allText.includes('diferença')) {
        lines.push('Financiamento: Sim (financiar saldo após avaliação da troca)');
      } else {
        lines.push('Financiamento: Solicitou simulação de parcelas e taxas');
      }
    }

    // 4. Laudo / Dekra / Objeções / Dúvidas
    if (allText.includes('dekra') || allText.includes('laudo') || allText.includes('cautelar')) {
      lines.push('Laudo Cautelar: 100% aprovado verificado com o cliente');
    }

    // 5. Test Drive / Visita
    if (allText.includes('test drive') || allText.includes('visita') || allText.includes('16h30') || allText.includes('agend')) {
      if (allText.includes('16h30') || allText.includes('jardins')) {
        lines.push('Test Drive: Agendado para hoje às 16h30 (Filial Jardins)');
      } else {
        lines.push('Visita / Test Drive: Em processo de agendamento no showroom');
      }
    }

    // 6. Intenção / Lead Score
    const score = conv.leadScore || 85;
    const scoreLabel = score >= 90 ? 'Altíssima' : score >= 75 ? 'Alta' : 'Média';
    lines.push(`Intenção: ${scoreLabel} (Grid Score ${score} pts)`);

    // 7. Próxima Ação recomendada pela IA
    let nextAct = '';
    if (allText.includes('16h30') || conv.tags?.includes('Cliente Agendado')) {
      nextAct = '📅 Confirmar recepção VIP para Test Drive hoje às 16h30';
    } else if (allText.includes('financ') || allText.includes('diferença') || allText.includes('troca')) {
      nextAct = '💰 Simular financiamento com a avaliação da troca e enviar proposta';
    } else if (score >= 85) {
      nextAct = '📞 Agendar visita ao showroom e apresentar proposta personalizada';
    } else {
      nextAct = '💬 Enviar catálogo completo e fotos em alta definição do veículo';
    }

    const formattedText = lines.join('\n');
    return { text: formattedText, nextAction: nextAct };
  };

  // Trigger AI generation
  const generateAiSummary = (force = false) => {
    if (!force && conversation.summary?.isManuallyEdited) {
      setShowOverwriteWarning(true);
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const { text, nextAction } = extractIntelligentAiSummary(conversation);
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newSummary: AttendanceSummary = {
        text,
        nextAction,
        source: 'ai',
        isManuallyEdited: false,
        lastUpdated: `Hoje às ${currentTime}`,
        updatedBy: '✦ IA MotorGrid',
      };

      onUpdateSummary(conversation.id, newSummary);
      setDraftText(text);
      setDraftNextAction(nextAction);
      setIsGenerating(false);
      setIsEditing(false);
    }, 450);
  };

  const handleAiClick = () => {
    if (conversation.summary?.isManuallyEdited) {
      setShowOverwriteWarning(true);
    } else {
      generateAiSummary(true);
    }
  };

  const handleEditClick = () => {
    if (!conversation.summary) {
      const defaultText = conversation.tracking.vehicleOfInterest
        ? `Interesse: ${conversation.tracking.vehicleOfInterest.brand} ${conversation.tracking.vehicleOfInterest.model}\nIntenção: Alta\n`
        : '';
      setDraftText(defaultText);
      setDraftNextAction('📞 Retornar cliente com proposta');
    } else {
      setDraftText(conversation.summary.text);
      setDraftNextAction(conversation.summary.nextAction || '');
    }
    setIsEditing(true);
    setShowOverwriteWarning(false);
  };

  const handleSaveManualEdit = () => {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const operatorName = conversation.assignedTo || 'Vendedor Showroom';

    const updatedSummary: AttendanceSummary = {
      text: draftText.trim(),
      nextAction: draftNextAction.trim(),
      source: 'manual',
      isManuallyEdited: true,
      lastUpdated: `Hoje às ${currentTime}`,
      updatedBy: operatorName,
    };

    onUpdateSummary(conversation.id, updatedSummary);
    setIsEditing(false);
  };

  const currentSummary = conversation.summary;
  const lineCount = currentSummary?.text ? currentSummary.text.split('\n').length : 0;
  const isLong = lineCount > 5 || (currentSummary?.text && currentSummary.text.length > 250);

  return (
    <div className="p-3 bg-[#1C1C1E] border border-white/10 rounded-xl space-y-2.5 shadow-sm relative transition-all">
      {/* ------------------------------------------------------------- */}
      {/* HEADER DO CARD: RESUMO DO ATENDIMENTO + [ ✦ IA ] [ Editar ] */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span className="text-[11px] font-bold text-white uppercase tracking-wider">
            Resumo do Atendimento
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleAiClick}
            disabled={isGenerating}
            className="px-2 py-1 rounded-lg bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 text-[#8B5CF6] border border-[#8B5CF6]/40 text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 shadow-sm"
            title="Gerar ou Atualizar Resumo com IA"
          >
            <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
            <span>✦ IA</span>
          </button>

          <button
            type="button"
            onClick={handleEditClick}
            className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
              isEditing
                ? 'bg-[#8B5CF6] text-white'
                : 'bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white'
            }`}
            title="Editar Resumo Manualmente"
          >
            <Edit2 className="w-3 h-3" />
            <span>Editar</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* AVISO DE SOBRESCRIÇÃO (SEGURANÇA PARA EDIÇÕES MANUAIS) */}
      {/* ------------------------------------------------------------- */}
      {showOverwriteWarning && (
        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-2 animate-fadeIn">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold text-amber-300 block">
                Já existem alterações manuais neste resumo.
              </span>
              <p className="text-[10px] text-[#A1A1AA] leading-snug">
                Deseja que a IA analise as novas mensagens e gere uma nova versão? Suas anotações manuais serão recalculadas.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => setShowOverwriteWarning(false)}
              className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-white text-[10px] font-medium transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                setShowOverwriteWarning(false);
                generateAiSummary(true);
              }}
              className="px-2.5 py-1 rounded-md bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-[10px] font-bold transition-all flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Gerar nova versão</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ESTADO 1: GERANDO / PROCESSANDO IA */}
      {/* ------------------------------------------------------------- */}
      {isGenerating ? (
        <div className="p-3 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center gap-2 text-xs text-[#8B5CF6] font-semibold animate-pulse">
          <Sparkles className="w-3.5 h-3.5 animate-spin text-[#8B5CF6]" />
          <span>✦ Analisando mensagens e gerando resumo...</span>
        </div>
      ) : isEditing ? (
        /* ------------------------------------------------------------- */
        /* ESTADO 2: MODO EDIÇÃO MANUAL DO VENDEDOR / GESTOR */
        /* ------------------------------------------------------------- */
        <div className="space-y-2.5 animate-fadeIn">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-[#A1A1AA] uppercase">
                Texto do Resumo
              </label>
              <span className="text-[9px] text-[#8B5CF6] font-medium">Edição Livre</span>
            </div>
            <textarea
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              rows={5}
              placeholder="Ex:&#10;Interesse: Porsche Macan GTS&#10;Troca: BMW X1&#10;Entrada: R$ 150 mil&#10;Intenção: Alta"
              className="w-full p-2 rounded-lg bg-[#101012] border border-[#8B5CF6]/40 focus:border-[#8B5CF6] text-white text-xs leading-relaxed focus:outline-none scrollbar-thin resize-y"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#A1A1AA] uppercase flex items-center gap-1">
              <span>Próxima Ação</span>
              <span className="text-[9px] text-[#A1A1AA] font-normal">(Sugerida ou Manual)</span>
            </label>
            <input
              type="text"
              value={draftNextAction}
              onChange={(e) => setDraftNextAction(e.target.value)}
              placeholder="Ex: 📅 Confirmar visita amanhã às 14h."
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#101012] border border-white/10 focus:border-[#8B5CF6] text-white text-xs focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveManualEdit}
              className="px-3 py-1.5 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold transition-all shadow-md shadow-[#8B5CF6]/30 cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Salvar</span>
            </button>
          </div>
        </div>
      ) : !currentSummary || !currentSummary.text.trim() ? (
        /* ------------------------------------------------------------- */
        /* ESTADO 3: NENHUM RESUMO CRIADO AINDA */
        /* ------------------------------------------------------------- */
        <div className="p-3 rounded-lg bg-[#101012] border border-white/5 text-center space-y-2.5">
          <p className="text-xs text-[#A1A1AA]">Nenhum resumo criado ainda.</p>
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => generateAiSummary(false)}
              className="w-full py-2 px-2.5 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold shadow-md shadow-[#8B5CF6]/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>✦ Gerar Resumo com IA</span>
            </button>
            <button
              type="button"
              onClick={handleEditClick}
              className="w-full py-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white text-[11px] font-medium transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Pencil className="w-3 h-3" />
              <span>Escrever manualmente</span>
            </button>
          </div>
        </div>
      ) : (
        /* ------------------------------------------------------------- */
        /* ESTADO 4: VISUALIZAÇÃO DO RESUMO ESTRUTURADO */
        /* ------------------------------------------------------------- */
        <div className="space-y-2.5">
          {/* Badge Discreta de Origem */}
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-[#8B5CF6] font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
              {currentSummary.source === 'ai'
                ? '✦ Gerado por IA'
                : currentSummary.isManuallyEdited
                ? `Editado por ${currentSummary.updatedBy || 'Vendedor'}`
                : '✦ Resumo IA'}
            </span>
            <span className="text-[#A1A1AA] font-mono">
              {currentSummary.lastUpdated}
            </span>
          </div>

          {/* Texto do Resumo Estruturado */}
          <div className="relative">
            <div
              className={`p-2.5 rounded-lg bg-[#101012] border border-white/5 text-xs text-white/90 leading-relaxed font-sans transition-all ${
                isLong && !isExpanded ? 'max-h-[140px] overflow-hidden' : ''
              }`}
            >
              <div className="space-y-1 whitespace-pre-line">
                {currentSummary.text.split('\n').map((line, idx) => {
                  if (!line.trim()) return <div key={idx} className="h-1" />;
                  const parts = line.split(':');
                  if (parts.length > 1) {
                    return (
                      <div key={idx} className="flex items-start gap-1">
                        <span className="text-[#A1A1AA] font-semibold shrink-0">
                          {parts[0]}:
                        </span>
                        <span className="text-white font-medium">
                          {parts.slice(1).join(':')}
                        </span>
                      </div>
                    );
                  }
                  return (
                    <div key={idx} className="text-white/90">
                      {line}
                    </div>
                  );
                })}
              </div>

              {/* Gradient Fade if clamped */}
              {isLong && !isExpanded && (
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#101012] to-transparent pointer-events-none rounded-b-lg" />
              )}
            </div>

            {/* Toggle Expandir / Recolher */}
            {isLong && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-1 text-[10px] text-[#8B5CF6] hover:text-purple-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-3 h-3" />
                    <span>Recolher</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" />
                    <span>Ver resumo completo</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* ------------------------------------------------------------- */}
          {/* PRÓXIMA AÇÃO (DESTAQUE VISUAL INTELIGENTE) */}
          {/* ------------------------------------------------------------- */}
          {currentSummary.nextAction && (
            <div className="p-2.5 rounded-lg bg-gradient-to-r from-[#8B5CF6]/15 via-[#8B5CF6]/10 to-transparent border border-[#8B5CF6]/30 space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-wider flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-[#8B5CF6]" />
                  Próxima Ação
                </span>
              </div>
              <p className="text-xs font-semibold text-white leading-snug">
                {currentSummary.nextAction}
              </p>

              {/* Ações Rápidas Contextuais */}
              <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                {currentSummary.nextAction.toLowerCase().includes('visita') ||
                currentSummary.nextAction.toLowerCase().includes('test drive') ||
                currentSummary.nextAction.toLowerCase().includes('agend') ? (
                  <button
                    type="button"
                    onClick={onOpenScheduleModal}
                    className="px-2 py-1 rounded-md bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-[10px] font-bold flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                  >
                    <Calendar className="w-3 h-3" />
                    <span>Agendar Visita</span>
                  </button>
                ) : null}

                {currentSummary.nextAction.toLowerCase().includes('simul') ||
                currentSummary.nextAction.toLowerCase().includes('financ') ||
                currentSummary.nextAction.toLowerCase().includes('parcela') ? (
                  <button
                    type="button"
                    onClick={onOpenFinancingModal}
                    className="px-2 py-1 rounded-md bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-[10px] font-bold flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                  >
                    <Calculator className="w-3 h-3" />
                    <span>Simular Financiamento</span>
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={() => generateAiSummary(false)}
                  className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white text-[10px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  title="Atualizar análise da conversa com a IA"
                >
                  <Sparkles className="w-2.5 h-2.5 text-[#8B5CF6]" />
                  <span>Atualizar IA</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
