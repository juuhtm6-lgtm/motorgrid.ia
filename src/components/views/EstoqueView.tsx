import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Download,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Car,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  Edit3,
  Trash2,
  Share2,
  X,
  ExternalLink,
  Sparkles,
  DollarSign,
  Fuel,
  Gauge,
  Calendar,
  Layers,
  MapPin,
  FileText,
  Filter,
  Check,
} from 'lucide-react';
import { Vehicle, VehicleStatus } from '../../types';
import { initialVehicles } from '../../data/mockData';
import { AddVehicleModal } from '../modals/AddVehicleModal';

export const EstoqueView: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [searchQuery, setSearchQuery] = useState('');
  const [brandFilter, setBrandFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [storeFilter, setStoreFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(3);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedVehicleForDetails, setSelectedVehicleForDetails] = useState<Vehicle | null>(null);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Advanced filters
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [minYear, setMinYear] = useState<number | ''>('');
  const [maxYear, setMaxYear] = useState<number | ''>('');
  const [fuelFilter, setFuelFilter] = useState('ALL');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Unique lists for dropdowns
  const availableBrands = useMemo(() => {
    return Array.from(new Set(vehicles.map((v) => v.brand))).sort();
  }, [vehicles]);

  const availableStores = useMemo(() => {
    return Array.from(new Set(vehicles.map((v) => v.location || v.storeUnit))).sort();
  }, [vehicles]);

  // Filtered dataset
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      // Search text (VIN, Model, or Brand)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const vin = (v.vin || v.chassis || '').toLowerCase();
        const model = v.model.toLowerCase();
        const brand = v.brand.toLowerCase();
        if (!vin.includes(q) && !model.includes(q) && !brand.includes(q)) {
          return false;
        }
      }

      // Brand filter
      if (brandFilter !== 'ALL' && v.brand.toLowerCase() !== brandFilter.toLowerCase()) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'ALL') {
        const normStatus = v.status.toUpperCase();
        if (statusFilter === 'AVAILABLE' && normStatus !== 'AVAILABLE' && normStatus !== 'DISPONÍVEL') {
          return false;
        }
        if (statusFilter === 'RESERVED' && normStatus !== 'RESERVED' && normStatus !== 'RESERVADO') {
          return false;
        }
        if (statusFilter === 'SOLD' && normStatus !== 'SOLD' && normStatus !== 'VENDIDO') {
          return false;
        }
      }

      // Store filter
      if (storeFilter !== 'ALL') {
        const loc = (v.location || v.storeUnit || '').toLowerCase();
        if (!loc.includes(storeFilter.toLowerCase())) {
          return false;
        }
      }

      // Advanced filters
      if (minPrice !== '' && v.price < Number(minPrice)) return false;
      if (maxPrice !== '' && v.price > Number(maxPrice)) return false;
      if (minYear !== '' && v.fabYear < Number(minYear)) return false;
      if (maxYear !== '' && v.fabYear > Number(maxYear)) return false;
      if (fuelFilter !== 'ALL' && v.fuel.toLowerCase() !== fuelFilter.toLowerCase()) return false;

      return true;
    });
  }, [
    vehicles,
    searchQuery,
    brandFilter,
    statusFilter,
    storeFilter,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    fuelFilter,
  ]);

  // Pagination calculation
  const totalEntries = 156; // Mock large inventory footprint matching screenshot
  const displayTotalCount =
    searchQuery || brandFilter !== 'ALL' || statusFilter !== 'ALL' || storeFilter !== 'ALL'
      ? filteredVehicles.length
      : totalEntries;

  const totalPages = Math.max(1, Math.ceil(filteredVehicles.length / pageSize));
  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredVehicles.slice(start, start + pageSize);
  }, [filteredVehicles, currentPage, pageSize]);

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, filteredVehicles.length);

  // Status badge styling helper (Matching exact design from screenshot)
  const renderStatusBadge = (status: VehicleStatus) => {
    const st = status.toUpperCase();
    if (st === 'AVAILABLE' || st === 'DISPONÍVEL') {
      return (
        <span className="inline-block px-3 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-[#241738] text-[#C4B5FD] border border-[#8B5CF6]/30">
          AVAILABLE
        </span>
      );
    }
    if (st === 'RESERVED' || st === 'RESERVADO') {
      return (
        <span className="inline-block px-3 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-[#2C1C16] text-[#FDBA74] border border-[#C2410C]/40">
          RESERVED
        </span>
      );
    }
    if (st === 'SOLD' || st === 'VENDIDO') {
      return (
        <span className="inline-block px-3 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-[#18181B] text-zinc-400 border border-zinc-700/60">
          SOLD
        </span>
      );
    }
    return (
      <span className="inline-block px-3 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
        {status}
      </span>
    );
  };

  // Status switcher
  const handleQuickStatusChange = (vehicleId: string, newStatus: VehicleStatus) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, status: newStatus } : v))
    );
    showToast(`Status do veículo atualizado para "${newStatus}".`);
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = ['VIN', 'Brand', 'Model', 'Year', 'Mileage_KM', 'Price_USD', 'Status', 'Location'];
    const rows = filteredVehicles.map((v) => [
      `"${v.vin || v.chassis}"`,
      `"${v.brand}"`,
      `"${v.model}"`,
      v.fabYear,
      v.km,
      v.price,
      `"${v.status}"`,
      `"${v.location || v.storeUnit}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `motorgrid_stock_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exportação CSV concluída com sucesso!');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-['Plus_Jakarta_Sans',sans-serif] text-zinc-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6] text-white text-xs font-semibold shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Section (Exact typography & layout from user screenshot) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Stock Management
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed">
            Real-time inventory control across all store locations.
          </p>
        </div>

        {/* Action Buttons Top Right */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Export CSV Button */}
          <button
            id="export-csv-btn"
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#141416] hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white text-xs font-semibold shadow-sm transition-all cursor-pointer font-['Plus_Jakarta_Sans',sans-serif]"
          >
            <Download className="w-3.5 h-3.5 text-zinc-300" />
            <span>Export CSV</span>
          </button>

          {/* + New Vehicle Button (Lilac Pill from Screenshot) */}
          <button
            id="new-vehicle-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C4B5FD] hover:bg-[#DDD6FE] active:scale-[0.98] text-[#2E1065] text-xs font-bold shadow-lg shadow-[#8B5CF6]/20 transition-all cursor-pointer font-['Plus_Jakarta_Sans',sans-serif]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Vehicle</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar (Exact Pill Box from user screenshot) */}
      <div className="p-3 sm:p-3.5 rounded-2xl bg-[#141416] border border-zinc-800/80 shadow-lg flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* Search VIN, Model, or Brand... */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="stock-search-input"
            type="text"
            placeholder="Search VIN, Model, or Brand..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-800 focus:border-[#8B5CF6] text-white placeholder-zinc-500 outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Brand: All dropdown */}
        <div className="relative shrink-0">
          <select
            id="stock-brand-filter"
            value={brandFilter}
            onChange={(e) => {
              setBrandFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="appearance-none w-full sm:w-auto px-4 py-2.5 pr-8 text-xs font-medium rounded-xl bg-[#0A0A0B] hover:bg-zinc-900 border border-zinc-800 text-zinc-300 focus:border-[#8B5CF6] outline-none cursor-pointer transition-colors"
          >
            <option value="ALL">Brand: All</option>
            {availableBrands.map((b) => (
              <option key={b} value={b}>
                Brand: {b}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Status: All dropdown */}
        <div className="relative shrink-0">
          <select
            id="stock-status-filter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="appearance-none w-full sm:w-auto px-4 py-2.5 pr-8 text-xs font-medium rounded-xl bg-[#0A0A0B] hover:bg-zinc-900 border border-zinc-800 text-zinc-300 focus:border-[#8B5CF6] outline-none cursor-pointer transition-colors"
          >
            <option value="ALL">Status: All</option>
            <option value="AVAILABLE">Status: Available</option>
            <option value="RESERVED">Status: Reserved</option>
            <option value="SOLD">Status: Sold</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Store: All dropdown */}
        <div className="relative shrink-0">
          <select
            id="stock-store-filter"
            value={storeFilter}
            onChange={(e) => {
              setStoreFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="appearance-none w-full sm:w-auto px-4 py-2.5 pr-8 text-xs font-medium rounded-xl bg-[#0A0A0B] hover:bg-zinc-900 border border-zinc-800 text-zinc-300 focus:border-[#8B5CF6] outline-none cursor-pointer transition-colors"
          >
            <option value="ALL">Store: All</option>
            {availableStores.map((s) => (
              <option key={s} value={s}>
                Store: {s.length > 20 ? s.slice(0, 18) + '...' : s}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* ADVANCED Button */}
        <button
          id="stock-advanced-filter-btn"
          onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold tracking-wider uppercase transition-all cursor-pointer shrink-0 font-['Plus_Jakarta_Sans',sans-serif] ${
            isAdvancedFilterOpen || minPrice !== '' || maxPrice !== '' || minYear !== '' || fuelFilter !== 'ALL'
              ? 'bg-[#2A1B4E] border-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/20'
              : 'bg-[#0A0A0B] hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-300" />
          <span>ADVANCED</span>
          {(minPrice !== '' || maxPrice !== '' || minYear !== '' || fuelFilter !== 'ALL') && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#C4B5FD] animate-pulse" />
          )}
        </button>
      </div>

      {/* Advanced Filter Drawer / Panel */}
      {isAdvancedFilterOpen && (
        <div className="p-5 rounded-2xl bg-[#141416] border border-[#8B5CF6]/30 shadow-2xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C4B5FD]" />
              Filtros Avançados de Inventário
            </span>
            <button
              onClick={() => {
                setMinPrice('');
                setMaxPrice('');
                setMinYear('');
                setMaxYear('');
                setFuelFilter('ALL');
              }}
              className="text-[11px] text-zinc-400 hover:text-[#C4B5FD] cursor-pointer"
            >
              Limpar Filtros Avançados
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Price Range */}
            <div className="space-y-1.5">
              <label className="text-zinc-400 block font-semibold">Faixa de Preço ($ / R$):</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Mín ($)"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A0A0B] border border-zinc-800 text-white outline-none"
                />
                <span className="text-zinc-600">-</span>
                <input
                  type="number"
                  placeholder="Máx ($)"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A0A0B] border border-zinc-800 text-white outline-none"
                />
              </div>
            </div>

            {/* Year Range */}
            <div className="space-y-1.5">
              <label className="text-zinc-400 block font-semibold">Ano de Fabricação:</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="De (Ex: 2022)"
                  value={minYear}
                  onChange={(e) => setMinYear(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A0A0B] border border-zinc-800 text-white outline-none"
                />
                <span className="text-zinc-600">-</span>
                <input
                  type="number"
                  placeholder="Até (Ex: 2025)"
                  value={maxYear}
                  onChange={(e) => setMaxYear(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A0A0B] border border-zinc-800 text-white outline-none"
                />
              </div>
            </div>

            {/* Fuel Type */}
            <div className="space-y-1.5">
              <label className="text-zinc-400 block font-semibold">Combustível / Propulsão:</label>
              <select
                value={fuelFilter}
                onChange={(e) => setFuelFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0A0A0B] border border-zinc-800 text-white outline-none cursor-pointer"
              >
                <option value="ALL">Todos os Tipos</option>
                <option value="Gasoline">Gasolina</option>
                <option value="Electric">Elétrico</option>
                <option value="Hybrid">Híbrido</option>
                <option value="Diesel">Diesel</option>
                <option value="Flex">Flex</option>
              </select>
            </div>

            {/* Apply Action */}
            <div className="flex items-end">
              <button
                onClick={() => setIsAdvancedFilterOpen(false)}
                className="w-full py-2 rounded-xl bg-[#C4B5FD] hover:bg-[#DDD6FE] text-[#2E1065] font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Stock Data Table (Exact Layout & Typography from Image) */}
      <div className="rounded-2xl bg-[#141416] border border-zinc-800/80 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/80 bg-[#141416] text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                <th className="py-4 px-6 min-w-[280px]">VEHICLE</th>
                <th className="py-4 px-6 min-w-[140px]">YEAR / KM</th>
                <th className="py-4 px-6 min-w-[130px]">PRICE</th>
                <th className="py-4 px-6 min-w-[130px]">STATUS</th>
                <th className="py-4 px-6 min-w-[150px]">LOCATION</th>
                <th className="py-4 px-6 text-right min-w-[110px]">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-xs">
              {paginatedVehicles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    <Car className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#C4B5FD]" />
                    Nenhum veículo encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                paginatedVehicles.map((vehicle) => {
                  return (
                    <tr
                      key={vehicle.id}
                      className="hover:bg-zinc-900/50 transition-colors group"
                    >
                      {/* VEHICLE: Thumbnail + Name + VIN */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={vehicle.photos[0] || 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop&q=80'}
                            alt={vehicle.model}
                            className="w-12 h-9 rounded-lg object-cover bg-zinc-900 border border-zinc-800 shrink-0 shadow-sm"
                          />
                          <div className="space-y-0.5">
                            <div className="font-bold text-white text-sm tracking-tight group-hover:text-[#DDD6FE] transition-colors cursor-pointer"
                              onClick={() => setSelectedVehicleForDetails(vehicle)}
                            >
                              {vehicle.brand === 'Mercedes-Benz' && vehicle.model.startsWith('Mercedes-Benz') ? vehicle.model : `${vehicle.brand} ${vehicle.model}`}
                            </div>
                            <div className="font-mono text-[11px] text-zinc-400">
                              VIN: {vehicle.vin || vehicle.chassis || 'WPOZZZ99ZLS12345'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* YEAR / KM */}
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <div className="text-sm font-semibold text-zinc-200">
                            {vehicle.fabYear}
                          </div>
                          <div className="text-xs text-zinc-400">
                            {vehicle.km.toLocaleString('en-US')} km
                          </div>
                        </div>
                      </td>

                      {/* PRICE */}
                      <td className="py-4 px-6">
                        <div className="text-sm font-bold text-white font-mono">
                          ${vehicle.price.toLocaleString('en-US')}
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="py-4 px-6">
                        {renderStatusBadge(vehicle.status)}
                      </td>

                      {/* LOCATION */}
                      <td className="py-4 px-6">
                        <span className="text-xs text-zinc-300 font-medium">
                          {vehicle.location || vehicle.storeUnit || 'HQ Matrix'}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            id={`view-details-${vehicle.id}`}
                            onClick={() => setSelectedVehicleForDetails(vehicle)}
                            className="p-1.5 rounded-lg bg-[#18181B] hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                            title="Ver Detalhes do Veículo"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`share-link-${vehicle.id}`}
                            onClick={() => {
                              const shareText = `Confira o ${vehicle.brand} ${vehicle.model} (${vehicle.fabYear}) por $${vehicle.price.toLocaleString('en-US')} na MotorGrid: https://motorgrid.io/stock/${vehicle.id}`;
                              navigator.clipboard.writeText(shareText);
                              showToast('Link do veículo copiado para a área de transferência!');
                            }}
                            className="p-1.5 rounded-lg bg-[#18181B] hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                            title="Copiar Link / Compartilhar"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer: Exact pagination and entry count from user screenshot */}
        <div className="px-6 py-4 border-t border-zinc-800/80 bg-[#141416] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          {/* Left: Showing 1 to 3 of 156 entries */}
          <div className="text-zinc-400 font-medium">
            Showing {filteredVehicles.length === 0 ? 0 : startIndex} to {endIndex} of{' '}
            <span className="text-zinc-300 font-bold">{displayTotalCount}</span> entries
          </div>

          {/* Right: Pagination Controls (< 1 2 3 ... >) */}
          <div className="flex items-center gap-1.5 select-none">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-500 transition-colors cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page 1 (Active square from screenshot) */}
            <button
              onClick={() => setCurrentPage(1)}
              className={`w-7 h-7 rounded-md font-bold flex items-center justify-center transition-all cursor-pointer text-xs ${
                currentPage === 1
                  ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              1
            </button>

            {/* Page 2 */}
            <button
              onClick={() => setCurrentPage(2)}
              className={`w-7 h-7 rounded-md font-bold flex items-center justify-center transition-all cursor-pointer text-xs ${
                currentPage === 2
                  ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              2
            </button>

            {/* Page 3 */}
            <button
              onClick={() => setCurrentPage(3)}
              className={`w-7 h-7 rounded-md font-bold flex items-center justify-center transition-all cursor-pointer text-xs ${
                currentPage === 3
                  ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              3
            </button>

            {/* Ellipsis */}
            <span className="px-1 text-zinc-600 font-mono">...</span>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-500 transition-colors cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      <AddVehicleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddVehicle={(newVeh) => {
          const created: Vehicle = {
            ...newVeh,
            id: `veh-${Date.now()}`,
            vin: newVeh.chassis,
            location: newVeh.storeUnit,
            viewsCount: 1,
            leadsCount: 0,
            createdAt: 'Hoje',
          };
          setVehicles((prev) => [created, ...prev]);
          showToast(`Veículo "${created.brand} ${created.model}" cadastrado no estoque!`);
        }}
      />

      {/* Vehicle Details Modal */}
      {selectedVehicleForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#18181B] border border-[#8B5CF6]/40 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header Image */}
            <div className="relative h-60 w-full overflow-hidden bg-black">
              <img
                src={selectedVehicleForDetails.photos[0]}
                alt={selectedVehicleForDetails.model}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#18181B] via-transparent to-black/60" />

              <button
                onClick={() => setSelectedVehicleForDetails(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-zinc-300 hover:text-white hover:bg-black transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">
                    {selectedVehicleForDetails.brand} {selectedVehicleForDetails.model}
                  </h2>
                  <p className="text-xs text-zinc-300 font-mono mt-0.5">
                    VIN: {selectedVehicleForDetails.vin || selectedVehicleForDetails.chassis}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-zinc-400">Preço de Venda</div>
                  <div className="text-xl font-black text-white font-mono">
                    ${selectedVehicleForDetails.price.toLocaleString('en-US')}
                  </div>
                </div>
              </div>
            </div>

            {/* Details Content */}
            <div className="p-6 space-y-5 text-xs">
              {/* Status Switcher Bar */}
              <div className="p-3 rounded-2xl bg-[#0A0A0B] border border-zinc-800 flex items-center justify-between gap-2 flex-wrap">
                <span className="text-zinc-400 font-semibold">Alterar Status:</span>
                <div className="flex items-center gap-2">
                  {(['AVAILABLE', 'RESERVED', 'SOLD'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        handleQuickStatusChange(selectedVehicleForDetails.id, st);
                        setSelectedVehicleForDetails((prev) => (prev ? { ...prev, status: st } : null));
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedVehicleForDetails.status.toUpperCase() === st
                          ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30'
                          : 'bg-[#18181B] hover:bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-zinc-300">
                <div className="p-3 rounded-xl bg-[#0A0A0B] border border-zinc-800 space-y-1">
                  <div className="text-[10px] text-zinc-500 uppercase font-semibold">Ano Fab / Mod</div>
                  <div className="font-bold text-sm text-white">{selectedVehicleForDetails.fabYear}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#0A0A0B] border border-zinc-800 space-y-1">
                  <div className="text-[10px] text-zinc-500 uppercase font-semibold">Quilometragem</div>
                  <div className="font-bold text-sm text-white">{selectedVehicleForDetails.km.toLocaleString('en-US')} km</div>
                </div>
                <div className="p-3 rounded-xl bg-[#0A0A0B] border border-zinc-800 space-y-1">
                  <div className="text-[10px] text-zinc-500 uppercase font-semibold">Câmbio</div>
                  <div className="font-bold text-sm text-white">{selectedVehicleForDetails.gearbox}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#0A0A0B] border border-zinc-800 space-y-1">
                  <div className="text-[10px] text-zinc-500 uppercase font-semibold">Localização</div>
                  <div className="font-bold text-sm text-white truncate">{selectedVehicleForDetails.location || selectedVehicleForDetails.storeUnit}</div>
                </div>
              </div>

              {/* Options */}
              {selectedVehicleForDetails.options && selectedVehicleForDetails.options.length > 0 && (
                <div className="space-y-2">
                  <div className="text-zinc-400 font-semibold">Equipamentos & Opcionais:</div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedVehicleForDetails.options.map((opt, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-[#0A0A0B] border border-zinc-800 text-zinc-300 text-[11px]"
                      >
                        ✓ {opt}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-800 bg-[#121214] flex items-center justify-between">
              <button
                onClick={() => {
                  setVehicles((prev) => prev.filter((v) => v.id !== selectedVehicleForDetails.id));
                  setSelectedVehicleForDetails(null);
                  showToast('Veículo removido do estoque.');
                }}
                className="px-3.5 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir Veículo</span>
              </button>

              <button
                onClick={() => setSelectedVehicleForDetails(null)}
                className="px-5 py-2 rounded-xl bg-[#C4B5FD] hover:bg-[#DDD6FE] text-[#2E1065] font-bold text-xs shadow-md transition-all cursor-pointer font-['Plus_Jakarta_Sans',sans-serif]"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
