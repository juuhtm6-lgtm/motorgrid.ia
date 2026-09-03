import React, { useState, useMemo } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  Car,
  User,
  CheckCircle2,
  Bell,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  FileText,
  CalendarCheck,
} from 'lucide-react';
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

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const QUICK_TIME_SLOTS = [
  '09:00',
  '10:00',
  '11:30',
  '14:00',
  '15:00',
  '16:30',
  '17:30',
  '18:30',
];

export const ScheduleAppointmentModal: React.FC<ScheduleAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSchedule,
  defaultContactName = '',
  defaultContactPhone = '',
  defaultVehicleName = '',
}) => {
  // Current view date in calendar (Month & Year)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(7); // 0-indexed (7 = Agosto)

  // Selected date & time
  const [selectedDay, setSelectedDay] = useState<number>(28);
  const [selectedMonth, setSelectedMonth] = useState<number>(7);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [time, setTime] = useState('16:30');

  // Form details
  const [contactName, setContactName] = useState(defaultContactName);
  const [contactPhone, setContactPhone] = useState(defaultContactPhone);
  const [sellerName, setSellerName] = useState(initialAuthUsers[1]?.name || 'Rodrigo Mendes');
  const [vehicleName, setVehicleName] = useState(
    defaultVehicleName || (initialVehicles[0]?.brand + ' ' + initialVehicles[0]?.model)
  );
  const [type, setType] = useState<Appointment['type']>('Test Drive');
  const [storeUnit, setStoreUnit] = useState('Matriz Alphaville - Showroom Premium');
  const [notes, setNotes] = useState('Cliente solicitou recepção na baia VIP com café premium.');

  // Keep form synced when props change
  React.useEffect(() => {
    if (defaultContactName) setContactName(defaultContactName);
    if (defaultContactPhone) setContactPhone(defaultContactPhone);
    if (defaultVehicleName) setVehicleName(defaultVehicleName);
  }, [defaultContactName, defaultContactPhone, defaultVehicleName, isOpen]);

  // Calendar math for generating current month's matrix
  const calendarDays = useMemo(() => {
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days: {
      day: number;
      month: number;
      year: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      isSelected: boolean;
      slotsAvailable: number;
    }[] = [];

    // Days from previous month
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      days.push({
        day: dayNum,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false,
        isToday: false,
        isSelected:
          selectedDay === dayNum && selectedMonth === prevMonth && selectedYear === prevYear,
        slotsAvailable: 2,
      });
    }

    // Days of current month
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const isSelected =
        selectedDay === d && selectedMonth === currentMonth && selectedYear === currentYear;
      const isToday = currentYear === 2026 && currentMonth === 7 && d === 28;
      // Mock slots: weekend has fewer slots
      const dayOfWeek = new Date(currentYear, currentMonth, d).getDay();
      const slotsAvailable = dayOfWeek === 0 ? 2 : dayOfWeek === 6 ? 4 : 6;

      days.push({
        day: d,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true,
        isToday,
        isSelected,
        slotsAvailable,
      });
    }

    // Fill tail days from next month to complete 5 or 6 weeks (grid 35 or 42)
    const remaining = (7 - (days.length % 7)) % 7;
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

    for (let n = 1; n <= remaining; n++) {
      days.push({
        day: n,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
        isToday: false,
        isSelected:
          selectedDay === n && selectedMonth === nextMonth && selectedYear === nextYear,
        slotsAvailable: 4,
      });
    }

    return days;
  }, [currentYear, currentMonth, selectedDay, selectedMonth, selectedYear]);

  if (!isOpen) return null;

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (day: number, month: number, year: number) => {
    setSelectedDay(day);
    setSelectedMonth(month);
    setSelectedYear(year);
    if (month !== currentMonth || year !== currentYear) {
      setCurrentMonth(month);
      setCurrentYear(year);
    }
  };

  const handleQuickPreset = (preset: 'today' | 'tomorrow' | 'saturday' | 'nextWeek') => {
    if (preset === 'today') {
      setSelectedDay(28);
      setSelectedMonth(7); // Agosto
      setSelectedYear(2026);
      setCurrentMonth(7);
      setCurrentYear(2026);
    } else if (preset === 'tomorrow') {
      setSelectedDay(29);
      setSelectedMonth(7);
      setSelectedYear(2026);
      setCurrentMonth(7);
      setCurrentYear(2026);
    } else if (preset === 'saturday') {
      setSelectedDay(29);
      setSelectedMonth(7);
      setSelectedYear(2026);
      setCurrentMonth(7);
      setCurrentYear(2026);
    } else if (preset === 'nextWeek') {
      setSelectedDay(4);
      setSelectedMonth(8); // Setembro
      setSelectedYear(2026);
      setCurrentMonth(8);
      setCurrentYear(2026);
    }
  };

  const formattedSelectedDate = `${String(selectedDay).padStart(2, '0')}/${String(
    selectedMonth + 1
  ).padStart(2, '0')}/${selectedYear}`;

  const formattedIsoDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(
    selectedDay
  ).padStart(2, '0')}`;

  const selectedDateObj = new Date(selectedYear, selectedMonth, selectedDay);
  const fullDateLabel = selectedDateObj.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim()) return;

    onSchedule({
      contactName,
      contactPhone,
      sellerName,
      vehicleName,
      date: formattedIsoDate,
      time,
      type,
      storeUnit,
      status: 'Confirmado (24h)',
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div role="dialog" className="modal-container modal-card w-full max-w-4xl max-h-[92vh] bg-[#141416] border border-[#8B5CF6]/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 bg-[#1C1C1E] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/40 shadow-md">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base tracking-tight">
                  Agenda Comercial MotorGrid
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] text-[10px] font-extrabold border border-[#8B5CF6]/30">
                  Ano {currentYear}
                </span>
              </div>
              <p className="text-xs text-[#A1A1AA]">
                Selecione o Ano, Mês, Dia e Horário para agendamento de Test Drive ou Visita VIP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#A1A1AA] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Left Column (Visual Month/Day/Year Calendar) & Right Column (Form & Time slots) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
          
          {/* ========================================================================= */}
          {/* COLUNA 1: CALENDÁRIO INTERATIVO (ANO, MÊS, DIAS) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 p-5 sm:p-6 space-y-4 bg-[#101012]">
            
            {/* Year & Month Control Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-[#1C1C1E] rounded-2xl border border-white/10 shadow-sm">
              
              {/* Selectors for Month and Year */}
              <div className="flex items-center gap-2">
                {/* Month Dropdown */}
                <select
                  value={currentMonth}
                  onChange={(e) => {
                    const m = Number(e.target.value);
                    setCurrentMonth(m);
                  }}
                  className="bg-[#27272A] text-white font-bold text-xs sm:text-sm px-3 py-2 rounded-xl border border-white/10 outline-none focus:border-[#8B5CF6] cursor-pointer"
                >
                  {MONTH_NAMES.map((name, idx) => (
                    <option key={idx} value={idx}>
                      {name}
                    </option>
                  ))}
                </select>

                {/* Year Dropdown */}
                <select
                  value={currentYear}
                  onChange={(e) => {
                    const y = Number(e.target.value);
                    setCurrentYear(y);
                  }}
                  className="bg-[#27272A] text-white font-extrabold text-xs sm:text-sm px-3 py-2 rounded-xl border border-white/10 outline-none focus:border-[#8B5CF6] cursor-pointer"
                >
                  {[2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month navigation buttons */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-2 rounded-xl bg-[#27272A] hover:bg-[#323236] text-white border border-white/5 transition-all cursor-pointer hover:border-[#8B5CF6]/40"
                  title="Mês Anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-[#8B5CF6] px-2">
                  {MONTH_NAMES[currentMonth].slice(0, 3)}/{currentYear}
                </span>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-2 rounded-xl bg-[#27272A] hover:bg-[#323236] text-white border border-white/5 transition-all cursor-pointer hover:border-[#8B5CF6]/40"
                  title="Próximo Mês"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-semibold text-[#A1A1AA] mr-1 shrink-0">Atalhos:</span>
              <button
                type="button"
                onClick={() => handleQuickPreset('today')}
                className="modal-quick-preset-btn px-2.5 py-1 rounded-lg bg-[#27272A] hover:bg-[#8B5CF6]/20 hover:text-[#8B5CF6] text-white text-[11px] font-semibold transition-all border border-white/5 cursor-pointer whitespace-nowrap"
              >
                Hoje (28/08)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('tomorrow')}
                className="modal-quick-preset-btn px-2.5 py-1 rounded-lg bg-[#27272A] hover:bg-[#8B5CF6]/20 hover:text-[#8B5CF6] text-white text-[11px] font-semibold transition-all border border-white/5 cursor-pointer whitespace-nowrap"
              >
                Amanhã
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('saturday')}
                className="modal-quick-preset-btn px-2.5 py-1 rounded-lg bg-[#27272A] hover:bg-[#8B5CF6]/20 hover:text-[#8B5CF6] text-white text-[11px] font-semibold transition-all border border-white/5 cursor-pointer whitespace-nowrap"
              >
                Sábado
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('nextWeek')}
                className="modal-quick-preset-btn px-2.5 py-1 rounded-lg bg-[#27272A] hover:bg-[#8B5CF6]/20 hover:text-[#8B5CF6] text-white text-[11px] font-semibold transition-all border border-white/5 cursor-pointer whitespace-nowrap"
              >
                Próx. Semana
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="modal-calendar-grid p-4 bg-[#141416] rounded-2xl border border-white/10">
              {/* Day names */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {WEEK_DAYS.map((wd, i) => (
                  <div
                    key={wd}
                    className={`text-[11px] font-bold py-1 uppercase tracking-wider ${
                      i === 0 || i === 6 ? 'text-[#8B5CF6]' : 'text-[#A1A1AA]'
                    }`}
                  >
                    {wd}
                  </div>
                ))}
              </div>

              {/* Day numbers */}
              <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center">
                {calendarDays.map((item, index) => {
                  const isSelected = item.isSelected;
                  const isCurrent = item.isCurrentMonth;
                  const isToday = item.isToday;

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelectDay(item.day, item.month, item.year)}
                      className={`h-11 sm:h-12 rounded-xl flex flex-col items-center justify-center relative transition-all cursor-pointer group ${
                        isSelected
                          ? 'bg-[#8B5CF6] text-white font-extrabold shadow-lg shadow-[#8B5CF6]/40 ring-2 ring-white/30 scale-[1.03] z-10'
                          : isToday
                          ? 'bg-[#8B5CF6]/20 text-[#8B5CF6] font-bold border border-[#8B5CF6]/40 hover:bg-[#8B5CF6]/30'
                          : isCurrent
                          ? 'bg-[#1C1C1E] text-white/90 hover:bg-[#27272A] hover:text-white border border-white/5'
                          : 'bg-[#141416] text-[#A1A1AA]/40 hover:text-[#A1A1AA] hover:bg-[#1C1C1E]'
                      }`}
                    >
                      <span className="text-xs sm:text-sm">{item.day}</span>
                      
                      {/* Vagas indicator dot */}
                      {isCurrent && (
                        <span
                          className={`text-[8px] mt-0.5 font-medium ${
                            isSelected
                              ? 'text-white/90 font-bold'
                              : item.slotsAvailable > 3
                              ? 'text-emerald-400'
                              : 'text-amber-400'
                          }`}
                        >
                          {isSelected ? '✓ Sel' : `${item.slotsAvailable} vag`}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Callout Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#8B5CF6]/20 via-[#6D28D9]/15 to-transparent border border-[#8B5CF6]/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#8B5CF6] text-white shadow-sm">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#8B5CF6] block">
                    Data Selecionada no Calendário:
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white capitalize">
                    {fullDateLabel}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-[#8B5CF6] font-mono block">
                  {formattedSelectedDate}
                </span>
                <span className="text-[10px] text-[#A1A1AA]">às {time}</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* COLUNA 2: HORÁRIOS & DADOS DO AGENDAMENTO */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 p-5 sm:p-6 bg-[#141416] flex flex-col justify-between space-y-4">
            
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Horário Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    Horário da Visita *
                  </label>
                  <span className="text-[10px] text-[#A1A1AA]">Slots de 45 min</span>
                </div>

                {/* Quick time slots grid */}
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  {QUICK_TIME_SLOTS.map((slot) => {
                    const isTimeSelected = time === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTime(slot)}
                        className={`time-slot-btn py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center border ${
                          isTimeSelected
                            ? 'bg-[#8B5CF6] text-white border-white/20 shadow-md shadow-[#8B5CF6]/30 font-mono'
                            : 'bg-[#1C1C1E] text-[#A1A1AA] hover:text-white hover:bg-[#27272A] border-white/5 font-mono'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>

                {/* Manual Time Input */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#A1A1AA] whitespace-nowrap">Outro horário:</span>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="px-2.5 py-1 text-xs rounded-lg bg-[#1C1C1E] border border-white/10 text-white outline-none focus:border-[#8B5CF6] font-mono"
                  />
                </div>
              </div>

              {/* Tipo de Agendamento */}
              <div>
                <label className="block text-xs font-bold text-white mb-1.5">
                  Tipo de Compromisso *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as Appointment['type'])}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#1C1C1E] border border-white/10 focus:border-[#8B5CF6] text-white outline-none transition-colors cursor-pointer"
                >
                  <option value="Test Drive">🏎️ Test Drive VIP</option>
                  <option value="Visita à Loja">🏢 Visita ao Showroom</option>
                  <option value="Avaliação de Usado">🔍 Avaliação Técnica de Troca</option>
                  <option value="Entrega de Veículo">🎉 Cerimônia de Entrega</option>
                  <option value="Revisão Pós-venda">🔧 Revisão / Manutenção</option>
                </select>
              </div>

              {/* Veículo de Interesse */}
              <div>
                <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  Veículo do Agendamento *
                </label>
                <select
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#1C1C1E] border border-white/10 focus:border-[#8B5CF6] text-white outline-none transition-colors cursor-pointer"
                >
                  {initialVehicles.map((v) => (
                    <option key={v.id} value={`${v.brand} ${v.model} ${v.fabYear}`}>
                      {v.brand} {v.model} ({v.fabYear}) - R$ {v.price.toLocaleString('pt-BR')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cliente & Telefone */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#A1A1AA] mb-1">
                    Cliente *
                  </label>
                  <input
                    required
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Nome do cliente"
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-[#1C1C1E] border border-white/10 focus:border-[#8B5CF6] text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#A1A1AA] mb-1">
                    WhatsApp *
                  </label>
                  <input
                    required
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+55 11 9..."
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-[#1C1C1E] border border-white/10 focus:border-[#8B5CF6] text-white outline-none"
                  />
                </div>
              </div>

              {/* Vendedor & Showroom */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#A1A1AA] mb-1">
                    Vendedor *
                  </label>
                  <select
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-[#1C1C1E] border border-white/10 focus:border-[#8B5CF6] text-white outline-none cursor-pointer"
                  >
                    {initialAuthUsers.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#A1A1AA] mb-1">
                    Showroom *
                  </label>
                  <select
                    value={storeUnit}
                    onChange={(e) => setStoreUnit(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-[#1C1C1E] border border-white/10 focus:border-[#8B5CF6] text-white outline-none cursor-pointer truncate"
                  >
                    <option value="Matriz Alphaville - Showroom Premium">Matriz Alphaville</option>
                    <option value="Filial Jardins - Seminovos Selecionados">Filial Jardins</option>
                    <option value="Filial Barra da Tijuca - Autos & Pickups">Filial Barra</option>
                  </select>
                </div>
              </div>

              {/* Observações */}
              <div>
                <label className="block text-[11px] font-semibold text-[#A1A1AA] mb-1">
                  Notas / Observações
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Baia VIP, café expresso, laudo na mesa..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-[#1C1C1E] border border-white/10 focus:border-[#8B5CF6] text-white outline-none placeholder-[#A1A1AA]"
                />
              </div>

              {/* Notification Box */}
              <div className="p-3 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#8B5CF6]">
                  <Bell className="w-3.5 h-3.5" />
                  <span>Automação MotorGrid de Confirmação:</span>
                </div>
                <p className="text-[11px] text-[#A1A1AA]">
                  ✓ Confirmação no WhatsApp em 1 clique + Lembretes 24h e 2h antes com localização Waze/Google Maps.
                </p>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-[#A1A1AA] hover:text-white rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-extrabold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] active:scale-[0.98] rounded-xl shadow-lg shadow-[#8B5CF6]/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Agendamento</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
