import React, { useState } from 'react';
import {
  Car,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  DollarSign,
  Share2,
  ExternalLink,
  ShieldCheck,
  Tag,
  Eye,
  MessageSquare,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Vehicle } from '../../types';
import { initialVehicles } from '../../data/mockData';
import { AddVehicleModal } from '../modals/AddVehicleModal';

export const EstoqueView: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVehicles = vehicles.filter((v) => {
    if (selectedBrand !== 'all' && v.brand !== selectedBrand) return false;
    if (selectedStatus !== 'all' && v.status !== selectedStatus) return false;
    if (selectedStore !== 'all' && !v.storeUnit.includes(selectedStore)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchBrand = v.brand.toLowerCase().includes(q);
      const matchModel = v.model.toLowerCase().includes(q);
      const matchPlate = v.licensePlate?.toLowerCase().includes(q);
      const matchColor = v.color.toLowerCase().includes(q);
      if (!matchBrand && !matchModel && !matchPlate && !matchColor) return false;
    }
    return true;
  });

  const totalStockValue = vehicles
    .filter((v) => v.status === 'Disponível' || v.status === 'Reservado')
    .reduce((acc, v) => acc + v.price, 0);

  const totalCostValue = vehicles
    .filter((v) => v.status === 'Disponível' || v.status === 'Reservado')
    .reduce((acc, v) => acc + (v.costPrice || v.price * 0.85), 0);

  const estimatedGrossProfit = totalStockValue - totalCostValue;

  const brands = Array.from(new Set(vehicles.map((v) => v.brand)));

  return (
    <div className="space-y-6">
      {/* Add Vehicle Modal */}
      <AddVehicleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddVehicle={(newVeh) => {
          const created: Vehicle = {
            ...newVeh,
            id: `veh-${Date.now()}`,
            viewsCount: 1,
            leadsCount: 0,
            createdAt: 'Hoje',
          };
          setVehicles((prev) => [created, ...prev]);
        }}
      />

      {/* KPI Cards & Financial Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-400">Total de Veículos no Estoque</div>
            <div className="text-2xl font-bold text-white mt-1">{vehicles.length} carros</div>
            <div className="text-[11px] text-emerald-400 mt-0.5 font-medium">
              ● {vehicles.filter((v) => v.status === 'Disponível').length} prontos para entrega
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/30">
            <Car className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-400">Valor Total do Showroom (Venda)</div>
            <div className="text-2xl font-bold text-white mt-1">
              R$ {(totalStockValue / 1000000).toFixed(2)}M
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5 font-mono">
              Preço médio: R$ {(totalStockValue / vehicles.length / 1000).toFixed(0)}k
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-400">Margem Bruta Projetada</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              R$ {(estimatedGrossProfit / 1000).toFixed(0)}k
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5 font-mono">
              ~{((estimatedGrossProfit / totalStockValue) * 100).toFixed(1)}% de margem
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/30">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-400">Integrador de Portais</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">100% Sincronizado</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Webmotors, iCarros &amp; OLX</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Integrator Status Pill Bar */}
      <div className="p-3.5 rounded-2xl bg-[#1C1C1E] border border-zinc-800 flex items-center justify-between gap-3 flex-wrap text-xs">
        <span className="font-bold text-white flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#C4B5FD]" />
          Integrador Automotivo Multi-Portal:
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1">
            <span>●</span> Webmotors Pro (Platina)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1">
            <span>●</span> iCarros API (Ativo)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1">
            <span>●</span> OLX Autos Pro (Ativo)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1">
            <span>●</span> Catálogo Meta (Facebook/Insta)
          </span>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por marca, modelo, placa ou cor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#1C1C1E] border border-zinc-800 focus:border-[#8B5CF6] text-white placeholder-zinc-500 outline-none transition-colors"
            />
          </div>

          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-[#1C1C1E] border border-zinc-800 text-white outline-none cursor-pointer"
          >
            <option value="all">Todas as Marcas</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-[#1C1C1E] border border-zinc-800 text-white outline-none cursor-pointer"
          >
            <option value="all">Todos Status</option>
            <option value="Disponível">Disponível</option>
            <option value="Reservado">Reservado</option>
            <option value="Preparação">Em Preparação</option>
            <option value="Vendido">Vendido</option>
          </select>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#C4B5FD] hover:bg-[#DDD6FE] text-[#2E1065] font-bold text-xs shadow-lg shadow-[#8B5CF6]/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer font-['Plus_Jakarta_Sans',sans-serif]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Cadastrar Veículo</span>
        </button>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVehicles.map((veh) => {
          const profit = veh.price - (veh.costPrice || veh.price * 0.85);

          return (
            <div
              key={veh.id}
              className="rounded-2xl bg-[#1C1C1E] border border-zinc-800 hover:border-[#8B5CF6]/50 shadow-xl overflow-hidden transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Photo with Overlay Badges */}
                <div className="relative h-48 w-full overflow-hidden bg-black">
                  <img
                    src={veh.photos[0]}
                    alt={`${veh.brand} ${veh.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase border ${
                      veh.status === 'Disponível'
                        ? 'bg-emerald-500/90 text-white border-emerald-400'
                        : veh.status === 'Reservado'
                        ? 'bg-amber-500/90 text-black border-amber-400'
                        : 'bg-zinc-800/90 text-zinc-300 border-zinc-700'
                    }`}
                  >
                    {veh.status}
                  </span>

                  <span className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-black/85 backdrop-blur-md text-emerald-400 font-extrabold text-sm border border-emerald-500/40">
                    R$ {veh.price.toLocaleString('pt-BR')}
                  </span>
                </div>

                {/* Info Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight">
                      {veh.brand} {veh.model}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5 truncate">{veh.version}</p>
                  </div>

                  {/* Grid Specs */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300">
                    <div className="p-2 rounded-xl bg-[#0A0A0B] border border-zinc-800">
                      <span className="text-zinc-500 block text-[10px]">Ano / Modelo:</span>
                      <span className="font-bold">
                        {veh.fabYear}/{veh.modelYear}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#0A0A0B] border border-zinc-800">
                      <span className="text-zinc-500 block text-[10px]">Km Rodados:</span>
                      <span className="font-bold">{veh.km.toLocaleString('pt-BR')} km</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#0A0A0B] border border-zinc-800">
                      <span className="text-zinc-500 block text-[10px]">Câmbio:</span>
                      <span className="font-bold">{veh.gearbox}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#0A0A0B] border border-zinc-800">
                      <span className="text-zinc-500 block text-[10px]">Combustível:</span>
                      <span className="font-bold">{veh.fuel}</span>
                    </div>
                  </div>

                  {/* Profit Margin Info */}
                  <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs flex items-center justify-between">
                    <span className="text-zinc-400 text-[11px]">Margem Bruta:</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      +R$ {profit.toLocaleString('pt-BR')} (~
                      {((profit / veh.price) * 100).toFixed(0)}%)
                    </span>
                  </div>

                  {/* Opcionais tags */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {veh.options.slice(0, 3).map((opt, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-[#0A0A0B] border border-zinc-800 text-zinc-400"
                      >
                        ✓ {opt}
                      </span>
                    ))}
                    {veh.options.length > 3 && (
                      <span className="text-[10px] text-zinc-500">
                        +{veh.options.length - 3} mais
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer: Store location & Quick actions */}
              <div className="px-4 py-3 border-t border-zinc-800 bg-[#161618] flex items-center justify-between text-xs">
                <span className="text-[11px] text-zinc-400 truncate max-w-[170px]">
                  📍 {veh.storeUnit.split('-')[0]}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      const text = `Confira o ${veh.brand} ${veh.model} (${veh.fabYear}) por R$ ${veh.price.toLocaleString('pt-BR')} na MotorGrid: https://motorgrid.com/veiculos/${veh.id}`;
                      navigator.clipboard.writeText(text);
                      alert('Ficha do veículo copiada para a área de transferência!');
                    }}
                    className="p-1.5 rounded-lg bg-[#0A0A0B] hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    title="Copiar Ficha do Carro"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      alert(`Abrindo ficha completa e fotos em 4K do ${veh.brand} ${veh.model}`);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/35 text-[#DDD6FE] border border-[#8B5CF6]/40 font-semibold transition-colors cursor-pointer text-[11px]"
                  >
                    Ver Detalhes
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
