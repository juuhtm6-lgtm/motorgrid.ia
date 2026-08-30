import React, { useState } from 'react';
import { Sparkles, RefreshCw, CheckCircle2, Zap } from 'lucide-react';

interface AiInsightsSectionProps {
  insights: string[];
  onRefresh?: () => void;
}

export const AiInsightsSection: React.FC<AiInsightsSectionProps> = ({ insights, onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="bg-[#1C1C1E] border border-[#8B5CF6]/30 rounded-xl p-5 shadow-sm space-y-4 relative overflow-hidden">
      {/* Detalhe de fundo com brilho sutil */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B5CF6]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between pb-2 border-b border-neutral-800 relative">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30">
            <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Grid AI • Insights Executivos</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8B5CF6] text-white">
                MOTORGRID INTELLIGENCE
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Análise preditiva e diagnósticos calculados sobre os dados do seu sistema
            </p>
          </div>
        </div>

        <button
          id="btn-refresh-ai-insights"
          onClick={handleRefresh}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#A78BFA] hover:text-white bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 rounded-lg border border-[#8B5CF6]/30 transition-all"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Atualizar Insights</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1 relative">
        {insights.map((insight, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 hover:border-[#8B5CF6]/40 transition-all flex items-start gap-2.5 shadow-sm"
          >
            <div className="p-1 rounded-md bg-[#8B5CF6]/15 text-[#8B5CF6] shrink-0 mt-0.5">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs text-neutral-200 leading-relaxed">
              {insight}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
