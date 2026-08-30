import React, { useState } from 'react';
import { X, Search, Download, ExternalLink, Car, User, Phone, Mail, Calendar, DollarSign } from 'lucide-react';
import { ExecutiveLeadRecord } from '../../types/dashboard';

interface DrillDownModalProps {
  isOpen: boolean;
  title: string;
  subtitle: string;
  records: ExecutiveLeadRecord[];
  onClose: () => void;
  onOpenLeadDetail?: (lead: ExecutiveLeadRecord) => void;
}

export const DrillDownModal: React.FC<DrillDownModalProps> = ({
  isOpen,
  title,
  subtitle,
  records,
  onClose,
  onOpenLeadDetail,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredRecords = records.filter(
    (r) =>
      r.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.contactPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.origin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    });
  };

  const exportCsv = () => {
    const headers = 'ID,Nome,Telefone,Email,Veiculo,Preco,Origem,Canal,Vendedor,Loja,Status,CriadoEm\n';
    const rows = filteredRecords
      .map(
        (r) =>
          `"${r.id}","${r.contactName}","${r.contactPhone}","${r.contactEmail}","${r.vehicleName}",${r.vehiclePrice},"${r.origin}","${r.channelType}","${r.assignedTo}","${r.storeName}","${r.status}","${r.createdAt}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `drilldown_${title.replace(/\s+/g, '_').toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'novo':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'em_atendimento':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'qualificado':
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      case 'agendado':
        return 'bg-[#8B5CF6]/15 text-[#A78BFA] border-[#8B5CF6]/30';
      case 'visitou':
        return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
      case 'proposta':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'ganho':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'perdido':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-neutral-800 text-neutral-400 border-neutral-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1C1C1E] border border-neutral-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header do Modal */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30">
                {filteredRecords.length} registros
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>Exportar CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de Busca e Filtro Interno */}
        <div className="p-4 border-b border-neutral-800 bg-[#161618] flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por cliente, telefone, veículo, vendedor ou canal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-[#8B5CF6] transition-colors"
            />
          </div>
        </div>

        {/* Tabela de Leads */}
        <div className="flex-1 overflow-y-auto p-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                <th className="pb-3 pl-2">Cliente</th>
                <th className="pb-3">Veículo de Interesse</th>
                <th className="pb-3 text-right">Valor</th>
                <th className="pb-3">Origem</th>
                <th className="pb-3">Vendedor</th>
                <th className="pb-3">Loja</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-2">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-850 text-neutral-300">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500">
                    Nenhum registro encontrado para esta consulta
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr
                    key={rec.id}
                    onClick={() => onOpenLeadDetail && onOpenLeadDetail(rec)}
                    className="hover:bg-neutral-900/80 transition-colors cursor-pointer group"
                  >
                    {/* Cliente */}
                    <td className="py-3 pl-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                          {rec.contactName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-white group-hover:text-[#8B5CF6] transition-colors block">
                            {rec.contactName}
                          </span>
                          <span className="text-[10px] text-neutral-400">{rec.contactPhone}</span>
                        </div>
                      </div>
                    </td>

                    {/* Veículo */}
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={rec.vehiclePhoto}
                          alt={rec.vehicleName}
                          className="w-8 h-6 rounded object-cover border border-neutral-700"
                        />
                        <span className="font-medium text-neutral-200 truncate max-w-[180px]">
                          {rec.vehicleName}
                        </span>
                      </div>
                    </td>

                    {/* Valor */}
                    <td className="py-3 text-right font-semibold text-white">
                      {formatCurrency(rec.closedRevenue || rec.vehiclePrice)}
                    </td>

                    {/* Origem */}
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 text-neutral-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                        {rec.origin}
                      </span>
                    </td>

                    {/* Vendedor */}
                    <td className="py-3 font-medium text-neutral-300">
                      {rec.assignedTo}
                    </td>

                    {/* Loja */}
                    <td className="py-3 text-neutral-400">
                      {rec.storeName}
                    </td>

                    {/* Status */}
                    <td className="py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border uppercase ${getStatusBadge(
                          rec.status
                        )}`}
                      >
                        {rec.status.replace('_', ' ')}
                      </span>
                      {rec.lossReason && (
                        <span className="block text-[10px] text-rose-400/80 mt-0.5">
                          {rec.lossReason}
                        </span>
                      )}
                    </td>

                    {/* Data */}
                    <td className="py-3 text-right pr-2 text-neutral-400 text-[11px]">
                      {rec.createdAt.split(' ')[0]}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer do Modal */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/60 flex items-center justify-between text-xs text-neutral-400">
          <span>
            Exibindo <strong>{filteredRecords.length}</strong> de <strong>{records.length}</strong> leads
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
