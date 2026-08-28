import React, { useState } from 'react';
import { X, Calendar, Clock, Car, User, CheckCircle2, Bell } from 'lucide-react';
import { Appointment } from '../../types';
import { initialVehicles, initialAuthUsers } from '../../data/mockData';

interface ScheduleAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (appointment: Omit<Appointment, 'id'>) => void;
  defaultContactName?: string;
  defaultContactPhone?: string;
  defaultVehicleName?: string;
}

export const ScheduleAppointmentModal: React.FC<ScheduleAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSchedule,
  defaultContactName = '',
  defaultContactPhone = '',
  defaultVehicleName = '',
}) => {
  const [contactName, setContactName] = useState(defaultContactName);
  const [contactPhone, setContactPhone] = useState(defaultContactPhone);
  const [sellerName, setSellerName] = useState(initialAuthUsers[1]?.name || 'Rodrigo Mendes');
  const [vehicleName, setVehicleName] = useState(defaultVehicleName || initialVehicles[0]?.brand + ' ' + initialVehicles[0]?.model);
  const [date, setDate] = useState('2026-08-28');
  const [time, setTime] = useState('16:30');
  const [type, setType] = useState<Appointment['type']>('Test Drive');
  const [storeUnit, setStoreUnit] = useState('Matriz Alphaville - Showroom Premium');
  const [notes, setNotes] = useState('Cliente solicitou recepção na baia VIP com café premium.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim()) return;

    onSchedule({
      contactName,
      contactPhone,
      sellerName,
      vehicleName,
      date,
      time,
      type,
      storeUnit,
      status: 'Confirmado (24h)',
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#141416] border border-[#8B5CF6]/30 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 bg-[#1C1C1E] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Agendar Visita / Test Drive</h3>
              <p className="text-xs text-zinc-400">Compromisso Comercial com Lembretes Automáticos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Nome do Cliente *
              </label>
              <input
                required
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Ex: Dra. Gabriela Vasconcelos"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white placeholder-zinc-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                WhatsApp do Cliente *
              </label>
              <input
                required
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+55 (11) 99120-4455"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white placeholder-zinc-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Tipo de Agendamento *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Appointment['type'])}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white outline-none transition-colors cursor-pointer"
              >
                <option value="Test Drive">Test Drive VIP</option>
                <option value="Visita à Loja">Visita ao Showroom</option>
                <option value="Avaliação de Usado">Avaliação Técnica de Troca</option>
                <option value="Entrega de Veículo">Cerimônia de Entrega</option>
                <option value="Revisão Pós-venda">Revisão de 30 Dias</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Veículo de Interesse *
              </label>
              <select
                value={vehicleName}
                onChange={(e) => setVehicleName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white outline-none transition-colors cursor-pointer"
              >
                {initialVehicles.map((v) => (
                  <option key={v.id} value={`${v.brand} ${v.model} ${v.fabYear}`}>
                    {v.brand} {v.model} ({v.fabYear}) - R$ {v.price.toLocaleString('pt-BR')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Data do Agendamento *
              </label>
              <input
                required
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Horário *
              </label>
              <input
                required
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Vendedor Responsável *
              </label>
              <select
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white outline-none transition-colors"
              >
                {initialAuthUsers.map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Loja / Unidade do Showroom *
            </label>
            <select
              value={storeUnit}
              onChange={(e) => setStoreUnit(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white outline-none transition-colors"
            >
              <option value="Matriz Alphaville - Showroom Premium">Matriz Alphaville - Showroom Premium</option>
              <option value="Filial Jardins - Seminovos Selecionados">Filial Jardins - Seminovos Selecionados</option>
              <option value="Filial Barra da Tijuca - Autos & Pickups">Filial Barra da Tijuca - Autos & Pickups</option>
            </select>
          </div>

          {/* Automated Reminders Box */}
          <div className="p-3 rounded-xl bg-purple-950/20 border border-[#8B5CF6]/30 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#C4B5FD]">
              <Bell className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>Automação MotorGrid de Confirmação:</span>
            </div>
            <p className="text-[11px] text-zinc-300">
              ✓ Disparo de WhatsApp 24 horas antes com mapa interativo da loja.
              <br />✓ Disparo de WhatsApp 2 horas antes com lembrete e manobrista liberado.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-[#2E1065] bg-[#C4B5FD] hover:bg-[#DDD6FE] active:scale-[0.98] rounded-xl shadow-lg shadow-[#8B5CF6]/20 transition-all flex items-center gap-1.5 cursor-pointer font-['Plus_Jakarta_Sans',sans-serif]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmar Agendamento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
