import React from 'react';
import { Zap, Clock, AlertCircle, CalendarCheck } from 'lucide-react';
import { AttendancePerformance } from '../../types/dashboard';

interface ServicePerformanceSectionProps {
  data: AttendancePerformance;
  onDrillDownUnattended?: () => void;
}

export const ServicePerformanceSection: React.FC<ServicePerformanceSectionProps> = ({
  data,
  onDrillDownUnattended,
}) => {
  return (
    <div className="bg-[#1C1C1E] border border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6]">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Performance de Atendimento & SLA</h3>
            <p className="text-xs text-neutral-400">
              Velocidade e eficiência de resposta da equipe comercial
            </p>
          </div>
        </div>
        <span className="text-xs text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded-md border border-neutral-800">
          Meta SLA: &lt; 5 min
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        {/* 1. Tempo Médio de 1º Atendimento */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Tempo Médio 1º Contato</span>
            <Clock className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-white tracking-tight">
              {data.avgFirstResponseTimeMin}
            </span>
            <span className="text-xs text-neutral-400 font-medium">minutos</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <span>●</span> Alta agilidade comercial
          </p>
        </div>

        {/* 2. % Atendidos em menos de 5 min */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Atendidos &lt; 5 minutos</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-emerald-400 tracking-tight">
              {data.percentAnsweredUnder5Min}%
            </span>
            <span className="text-xs text-neutral-400 font-medium">dos leads</span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-1.5 mt-2">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${data.percentAnsweredUnder5Min}%` }}
            />
          </div>
        </div>

        {/* 3. Leads Sem Atendimento */}
        <div
          onClick={onDrillDownUnattended}
          className={`bg-neutral-900/90 border ${
            data.unattendedLeadsCount > 0
              ? 'border-amber-500/40 cursor-pointer hover:bg-neutral-850'
              : 'border-neutral-800'
          } rounded-xl p-4 transition-all`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Leads Sem Atendimento</span>
            <AlertCircle
              className={`w-4 h-4 ${
                data.unattendedLeadsCount > 0 ? 'text-amber-400' : 'text-neutral-500'
              }`}
            />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-2xl font-bold tracking-tight ${
                  data.unattendedLeadsCount > 0 ? 'text-amber-400' : 'text-white'
                }`}
              >
                {data.unattendedLeadsCount}
              </span>
              <span className="text-xs text-neutral-400 font-medium">na fila</span>
            </div>
            {data.unattendedLeadsCount > 0 && (
              <span className="text-[10px] text-amber-400 font-medium">Ver fila →</span>
            )}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">
            {data.unattendedLeadsCount > 0
              ? 'Aguardando primeiro contato'
              : 'Nenhum lead pendente na fila'}
          </p>
        </div>

        {/* 4. Tempo Médio até Fechamento */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Ciclo Médio de Venda</span>
            <CalendarCheck className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-white tracking-tight">
              {data.avgDaysToSale}
            </span>
            <span className="text-xs text-neutral-400 font-medium">dias até fechamento</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">
            Entrada do lead até assinatura
          </p>
        </div>
      </div>
    </div>
  );
};
