import React from 'react';
import { AlertOctagon, AlertTriangle, Info, ArrowRight, ShieldAlert } from 'lucide-react';
import { ExecutiveAlert } from '../../types/dashboard';

interface ManagerAlertsSectionProps {
  alerts: ExecutiveAlert[];
  onAlertClick: (alert: ExecutiveAlert) => void;
}

export const ManagerAlertsSection: React.FC<ManagerAlertsSectionProps> = ({
  alerts,
  onAlertClick,
}) => {
  const getSeverityStyle = (severity: 'high' | 'medium' | 'info') => {
    switch (severity) {
      case 'high':
        return {
          icon: AlertOctagon,
          bgColor: 'bg-rose-500/10',
          textColor: 'text-rose-400',
          borderColor: 'border-rose-500/30 hover:border-rose-500/60',
          badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        };
      case 'medium':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-amber-500/10',
          textColor: 'text-amber-400',
          borderColor: 'border-amber-500/30 hover:border-amber-500/60',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        };
      case 'info':
      default:
        return {
          icon: Info,
          bgColor: 'bg-blue-500/10',
          textColor: 'text-blue-400',
          borderColor: 'border-blue-500/30 hover:border-blue-500/60',
          badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        };
    }
  };

  return (
    <div className="bg-[#1C1C1E] border border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Atenção Necessária • Alertas da Operação
            </h3>
            <p className="text-xs text-neutral-400">
              Notificações automáticas de gargalos, SLAs em risco e oportunidades paradas
            </p>
          </div>
        </div>
        <span className="text-xs text-neutral-400">
          {alerts.length} {alerts.length === 1 ? 'alerta ativo' : 'alertas ativos'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {alerts.length === 0 ? (
          <div className="col-span-2 py-6 text-center text-xs text-emerald-400 bg-neutral-900/60 rounded-xl border border-neutral-800">
            ✓ Nenhum alerta crítico detectado. Toda a esteira está operando dentro dos prazos!
          </div>
        ) : (
          alerts.map((alert) => {
            const style = getSeverityStyle(alert.severity);
            const Icon = style.icon;

            return (
              <div
                key={alert.id}
                id={`alert-card-${alert.id}`}
                onClick={() => onAlertClick(alert)}
                className={`group p-3.5 rounded-xl bg-neutral-900/90 hover:bg-[#25252a] border ${style.borderColor} transition-all cursor-pointer shadow-sm flex items-start justify-between gap-3`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${style.bgColor} ${style.textColor} shrink-0 mt-0.5`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-neutral-200 transition-colors">
                      {alert.title}
                    </h4>
                    <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                      {alert.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${style.badgeColor}`}
                  >
                    {alert.count}
                  </span>
                  <span className="text-[10px] text-neutral-500 group-hover:text-white flex items-center gap-0.5 transition-colors">
                    Agir <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
