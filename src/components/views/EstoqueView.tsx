import React, { useState } from 'react';
import {
  Car,
  Search,
  Plus,
  Cpu,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Battery,
  ShieldCheck,
  Building2,
  QrCode,
  Tag,
  Download,
  Filter,
} from 'lucide-react';
import { EstoqueItem, EstoqueStatus, DeviceType } from '../../types';

const initialStockItems: EstoqueItem[] = [
  {
    id: 'st-1',
    serialNumber: 'IMEI-8649201948201',
    model: 'Rastreador OBD-II 4G',
    supplier: 'Teltonika Telematics',
    status: 'Instalado',
    batteryHealth: 98,
    firmwareVersion: 'v4.12.8-CAN',
    installedInVehicle: 'BRA-2E19 (Scania R450)',
    installedInCompany: 'Logística TransBrasil',
    lastPing: 'Há 12 segundos',
    receivedDate: '10/01/2026',
    locationStock: 'Veículo Ativo em Rota',
  },
  {
    id: 'st-2',
    serialNumber: 'IMEI-8649201948202',
    model: 'Rastreador OBD-II 4G',
    supplier: 'Teltonika Telematics',
    status: 'Instalado',
    batteryHealth: 100,
    firmwareVersion: 'v4.12.8-CAN',
    installedInVehicle: 'RIO-9912 (Mercedes Sprinter)',
    installedInCompany: 'Ambulâncias Vida',
    lastPing: 'Há 45 segundos',
    receivedDate: '12/01/2026',
    locationStock: 'Veículo Ativo em Rota',
  },
  {
    id: 'st-3',
    serialNumber: 'CAN-99104882190',
    model: 'Sensor CAN-Bus Pro',
    supplier: 'Bosch Automotive Solutions',
    status: 'Disponível',
    batteryHealth: 100,
    firmwareVersion: 'v2.0.4',
    lastPing: 'Pronto para instalação',
    receivedDate: '20/02/2026',
    locationStock: 'Prateleira A-04 (Galpão SP)',
  },
  {
    id: 'st-4',
    serialNumber: 'CAN-99104882191',
    model: 'Sensor CAN-Bus Pro',
    supplier: 'Bosch Automotive Solutions',
    status: 'Disponível',
    batteryHealth: 100,
    firmwareVersion: 'v2.0.4',
    lastPing: 'Pronto para instalação',
    receivedDate: '20/02/2026',
    locationStock: 'Prateleira A-04 (Galpão SP)',
  },
  {
    id: 'st-5',
    serialNumber: 'SAT-7718293011',
    model: 'Módulo GPS Satelital',
    supplier: 'Iridium Extreme Connect',
    status: 'Em Teste',
    batteryHealth: 94,
    firmwareVersion: 'v5.8.1-SAT',
    lastPing: 'Bancada de Teste Lab-02',
    receivedDate: '15/02/2026',
    locationStock: 'Laboratório de Homologação',
  },
  {
    id: 'st-6',
    serialNumber: 'CAM-4401928301',
    model: 'Câmera Veicular ADAS',
    supplier: 'Sensata Technologies',
    status: 'Disponível',
    batteryHealth: 100,
    firmwareVersion: 'v3.1.0-AI',
    lastPing: 'Pronto para envio',
    receivedDate: '25/02/2026',
    locationStock: 'Prateleira B-02 (Galpão SP)',
  },
  {
    id: 'st-7',
    serialNumber: 'FUEL-110293848',
    model: 'Sensor de Combustível Ultrassônico',
    supplier: 'Omnicomm Sensors',
    status: 'Reservado',
    batteryHealth: 96,
    firmwareVersion: 'v1.9.0',
    installedInCompany: 'AgroSafra Grãos',
    lastPing: 'Aguardando agendamento técnico',
    receivedDate: '18/02/2026',
    locationStock: 'Doca de Saída / Expedição',
  },
];

export const EstoqueView: React.FC = () => {
  const [stock, setStock] = useState<EstoqueItem[]>(initialStockItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modelFilter, setModelFilter] = useState<string>('all');
  const [isNewDeviceModalOpen, setIsNewDeviceModalOpen] = useState(false);

  // New device modal state
  const [newSerial, setNewSerial] = useState('');
  const [newModel, setNewModel] = useState<DeviceType>('Rastreador OBD-II 4G');
  const [newSupplier, setNewSupplier] = useState('Teltonika Telematics');
  const [newLocation, setNewLocation] = useState('Prateleira A-01 (Galpão SP)');

  const filteredStock = stock.filter((item) => {
    const matchesSearch =
      item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.installedInVehicle && item.installedInVehicle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.installedInCompany && item.installedInCompany.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesModel = modelFilter === 'all' || item.model === modelFilter;

    return matchesSearch && matchesStatus && matchesModel;
  });

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSerial) return;

    const newItem: EstoqueItem = {
      id: `st-${Date.now()}`,
      serialNumber: newSerial,
      model: newModel,
      supplier: newSupplier,
      status: 'Disponível',
      batteryHealth: 100,
      firmwareVersion: 'v4.12.8-CAN',
      receivedDate: new Date().toLocaleDateString('pt-BR'),
      locationStock: newLocation,
      lastPing: 'Em estoque',
    };

    setStock((prev) => [newItem, ...prev]);
    setIsNewDeviceModalOpen(false);
    setNewSerial('');
  };

  const totalDevices = stock.length;
  const installedCount = stock.filter((s) => s.status === 'Instalado').length;
  const availableCount = stock.filter((s) => s.status === 'Disponível').length;
  const inTestCount = stock.filter((s) => s.status === 'Em Teste' || s.status === 'Reservado').length;

  return (
    <div className="space-y-6">
      {/* Header Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-400">Total de Equipamentos</div>
            <div className="text-2xl font-bold text-white mt-1">{totalDevices} unidades</div>
            <div className="text-[11px] text-[#A78BFA] mt-0.5">Rastreadores, CAN-Bus & ADAS</div>
          </div>
          <div className="p-3 rounded-xl bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[#8B5CF6]/30">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-400">Instalados em Veículos</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{installedCount} ativos</div>
            <div className="text-[11px] text-emerald-400/80 mt-0.5">Telemetria ao vivo</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <Car className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-400">Disponíveis em Estoque</div>
            <div className="text-2xl font-bold text-white mt-1">{availableCount} prontos</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Prontos para expedição imediata</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/15 text-blue-300 border border-blue-500/30">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-400">Em Teste / Reservados</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{inTestCount} dispositivos</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Homologação e lab</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Action / Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por IMEI, modelo, veículo, placa ou cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white placeholder-zinc-500 outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 text-zinc-300 focus:border-[#8B5CF6] outline-none"
            >
              <option value="all">Todos os Status</option>
              <option value="Disponível">Disponível</option>
              <option value="Instalado">Instalado</option>
              <option value="Em Teste">Em Teste</option>
              <option value="Reservado">Reservado</option>
            </select>

            <select
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 text-zinc-300 focus:border-[#8B5CF6] outline-none"
            >
              <option value="all">Todos os Modelos</option>
              <option value="Rastreador OBD-II 4G">Rastreador OBD-II 4G</option>
              <option value="Sensor CAN-Bus Pro">Sensor CAN-Bus Pro</option>
              <option value="Módulo GPS Satelital">Módulo GPS Satelital</option>
              <option value="Câmera Veicular ADAS">Câmera ADAS</option>
              <option value="Sensor de Combustível Ultrassônico">Sensor Combustível</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setIsNewDeviceModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#C4B5FD] hover:bg-[#DDD6FE] text-[#2E1065] font-bold text-xs shadow-md shadow-[#8B5CF6]/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Cadastrar Dispositivo</span>
        </button>
      </div>

      {/* Stock Table */}
      <div className="rounded-2xl border border-zinc-800/80 bg-[#141416] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-[#1C1C1E]/80 text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Serial / IMEI</th>
                <th className="py-3.5 px-4">Modelo & Fabricante</th>
                <th className="py-3.5 px-4">Status & Bateria</th>
                <th className="py-3.5 px-4">Veículo / Empresa Vinculada</th>
                <th className="py-3.5 px-4">Localização / Estoque</th>
                <th className="py-3.5 px-4">Último Ping</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-sm">
              {filteredStock.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-4 px-4 font-mono text-xs font-bold text-white flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-[#A78BFA]" />
                    <span>{item.serialNumber}</span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-semibold text-zinc-200 text-xs">{item.model}</div>
                    <div className="text-[11px] text-zinc-500">{item.supplier} • {item.firmwareVersion}</div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                          item.status === 'Instalado'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : item.status === 'Disponível'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            : item.status === 'Em Teste'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {item.status}
                      </span>
                      <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-mono">
                        <Battery className="w-3.5 h-3.5 text-emerald-400" />
                        {item.batteryHealth}%
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-xs">
                    {item.installedInVehicle ? (
                      <div>
                        <div className="font-bold text-white flex items-center gap-1">
                          <Car className="w-3.5 h-3.5 text-[#A78BFA]" />
                          <span>{item.installedInVehicle}</span>
                        </div>
                        <div className="text-[11px] text-zinc-400">{item.installedInCompany}</div>
                      </div>
                    ) : item.installedInCompany ? (
                      <div className="text-zinc-300 font-medium">{item.installedInCompany}</div>
                    ) : (
                      <span className="text-zinc-500 italic">Não vinculado (Livre)</span>
                    )}
                  </td>

                  <td className="py-4 px-4 text-xs text-zinc-300">
                    <div>{item.locationStock}</div>
                    <div className="text-[10px] text-zinc-500">Recebido: {item.receivedDate}</div>
                  </td>

                  <td className="py-4 px-4 text-xs font-mono text-zinc-400">
                    {item.lastPing}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Device Modal */}
      {isNewDeviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#141416] border border-[#8B5CF6]/30 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Cadastrar Novo Dispositivo no Estoque</h3>
            <form onSubmit={handleAddDevice} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">IMEI ou Número de Série</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: IMEI-8649201948299"
                  value={newSerial}
                  onChange={(e) => setNewSerial(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Tipo de Equipamento</label>
                <select
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value as DeviceType)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white outline-none"
                >
                  <option value="Rastreador OBD-II 4G">Rastreador OBD-II 4G</option>
                  <option value="Sensor CAN-Bus Pro">Sensor CAN-Bus Pro</option>
                  <option value="Módulo GPS Satelital">Módulo GPS Satelital</option>
                  <option value="Câmera Veicular ADAS">Câmera Veicular ADAS</option>
                  <option value="Sensor de Combustível Ultrassônico">Sensor de Combustível Ultrassônico</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Localização no Almoxarifado</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsNewDeviceModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-[#2E1065] bg-[#C4B5FD] hover:bg-[#DDD6FE] rounded-xl"
                >
                  Salvar Equipamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
