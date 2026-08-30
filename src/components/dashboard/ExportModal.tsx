import React, { useState } from 'react';
import { X, FileText, Table, Check, Download, Printer } from 'lucide-react';
import { ExecutiveKpis, DashboardFilters, ExecutiveLeadRecord } from '../../types/dashboard';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: DashboardFilters;
  kpis: ExecutiveKpis;
  records: ExecutiveLeadRecord[];
  onPrint: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  filters,
  kpis,
  records,
  onPrint,
}) => {
  const [exportType, setExportType] = useState<'excel' | 'pdf'>('excel');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);

    if (exportType === 'pdf') {
      setTimeout(() => {
        setIsExporting(false);
        onClose();
        onPrint();
      }, 500);
      return;
    }

    // Exportação Excel / CSV
    const headers = 'ID,Nome,Telefone,Email,Veiculo,Preco_BRL,Origem,Canal,Vendedor,Equipe,Loja,Status,CriadoEm,ReceitaFechada_BRL\n';
    const rows = records
      .map(
        (r) =>
          `"${r.id}","${r.contactName}","${r.contactPhone}","${r.contactEmail}","${r.vehicleName}",${r.vehiclePrice},"${r.origin}","${r.channelType}","${r.assignedTo}","${r.team}","${r.storeName}","${r.status}","${r.createdAt}",${r.closedRevenue || 0}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_executivo_motorgrid_${filters.period}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setIsExporting(false);
      onClose();
    }, 400);
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1C1C1E] border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
          <div>
            <h2 className="text-base font-bold text-white">Exportar Relatório Executivo</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Faça o download consolidado dos dados do período selecionado
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo com opções */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Opção Excel/CSV */}
            <div
              onClick={() => setExportType('excel')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                exportType === 'excel'
                  ? 'border-[#8B5CF6] bg-[#8B5CF6]/10'
                  : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Table className="w-6 h-6 text-emerald-400" />
                {exportType === 'excel' && <Check className="w-4 h-4 text-[#8B5CF6]" />}
              </div>
              <h4 className="text-sm font-bold text-white mt-3">Excel / CSV</h4>
              <p className="text-[11px] text-neutral-400 mt-1">
                Tabela com todos os {records.length} leads detalhados para análise em planilhas
              </p>
            </div>

            {/* Opção PDF / Impressão */}
            <div
              onClick={() => setExportType('pdf')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                exportType === 'pdf'
                  ? 'border-[#8B5CF6] bg-[#8B5CF6]/10'
                  : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <FileText className="w-6 h-6 text-[#8B5CF6]" />
                {exportType === 'pdf' && <Check className="w-4 h-4 text-[#8B5CF6]" />}
              </div>
              <h4 className="text-sm font-bold text-white mt-3">PDF Executivo</h4>
              <p className="text-[11px] text-neutral-400 mt-1">
                Layout pronto para impressão ou envio à diretoria e investidores
              </p>
            </div>
          </div>

          {/* Resumo do período que será exportado */}
          <div className="p-3.5 bg-neutral-900 rounded-xl border border-neutral-800 text-xs space-y-2">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
              Resumo dos dados exportados:
            </span>
            <div className="grid grid-cols-2 gap-2 text-neutral-300">
              <div>• Leads no filtro: <strong className="text-white">{kpis.totalLeads}</strong></div>
              <div>• Vendas no filtro: <strong className="text-emerald-400">{kpis.totalSales}</strong></div>
              <div>• Receita total: <strong className="text-white">{formatCurrency(kpis.totalRevenue)}</strong></div>
              <div>• Taxa conversão: <strong className="text-[#A78BFA]">{kpis.conversionRate.toFixed(1)}%</strong></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/60 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold shadow-lg shadow-[#8B5CF6]/20 transition-all"
          >
            {exportType === 'pdf' ? (
              <>
                <Printer className="w-3.5 h-3.5" />
                <span>Gerar Impressão / PDF</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting ? 'Exportando...' : 'Baixar Arquivo'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
