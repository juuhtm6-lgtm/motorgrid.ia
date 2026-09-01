import React from 'react';
import { Printer, Download, Calendar, ShieldCheck } from 'lucide-react';
import { DashboardFilters } from '../../types/dashboard';

interface ExecutiveHeaderProps {
  filters: DashboardFilters;
  onOpenNewLead?: () => void;
  onOpenExport: () => void;
  onPrint: () => void;
}

export const ExecutiveHeader: React.FC<ExecutiveHeaderProps> = ({
  filters,
  onOpenExport,
  onPrint,
}) => {
  const getPeriodLabel = () => {
    switch (filters.period) {
      case 'hoje':
        return 'Hoje (30 de Agosto de 2026)';
      case 'ontem':
        return 'Ontem (29 de Agosto de 2026)';
      case '7dias':
        return 'Últimos 7 dias (24 a 30 de Agosto)';
      case '30dias':
        return 'Últimos 30 dias (Agosto de 2026)';
      case 'mes_atual':
        return 'Mês Atual (Agosto 2026)';
      case 'mes_anterior':
        return 'Mês Anterior (Julho 2026)';
      case 'personalizado':
        return `Período Personalizado: ${filters.startDate || 'Início'} até ${filters.endDate || 'Fim'}`;
      default:
        return 'Mês Atual';
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-800/80">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            PAINEL DE CONTROLE EXECUTIVO
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Visão Geral da Operação
          </span>
        </div>
        <p className="text-xs text-neutral-400 mt-1 flex items-center gap-2">
          <span>Acompanhamento estratégico em tempo real</span>
          <span className="text-neutral-600">•</span>
          <span className="text-neutral-300 font-medium flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#8B5CF6]" />
            {getPeriodLabel()}
          </span>
        </p>
      </div>

      <div className="flex items-center flex-wrap gap-2.5">
        <button
          id="btn-dashboard-print"
          onClick={onPrint}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#1C1C1E] hover:bg-neutral-800 text-neutral-200 text-xs font-medium border border-neutral-700/60 transition-colors shadow-sm"
          title="Imprimir relatório executivo"
        >
          <Printer className="w-3.5 h-3.5 text-neutral-400" />
          <span>Imprimir</span>
        </button>

        <button
          id="btn-dashboard-export"
          onClick={onOpenExport}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#1C1C1E] hover:bg-neutral-800 text-neutral-200 text-xs font-medium border border-neutral-700/60 transition-colors shadow-sm"
          title="Exportar dados em PDF ou Excel"
        >
          <Download className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span>Exportar</span>
        </button>
      </div>
    </div>
  );
};
