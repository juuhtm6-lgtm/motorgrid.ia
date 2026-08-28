import React, { useState } from 'react';
import { X, Car, Plus, DollarSign, Camera, CheckCircle2 } from 'lucide-react';
import { Vehicle } from '../../types';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVehicle: (vehicle: Omit<Vehicle, 'id' | 'viewsCount' | 'leadsCount' | 'createdAt'>) => void;
}

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  isOpen,
  onClose,
  onAddVehicle,
}) => {
  const [brand, setBrand] = useState('Porsche');
  const [model, setModel] = useState('911 Carrera S');
  const [version, setVersion] = useState('3.0 Biturbo PDK 450cv');
  const [fabYear, setFabYear] = useState(2023);
  const [modelYear, setModelYear] = useState(2024);
  const [km, setKm] = useState(12800);
  const [gearbox, setGearbox] = useState('Dupla Embreagem');
  const [fuel, setFuel] = useState('Gasolina');
  const [color, setColor] = useState('Cinza Giz');
  const [licensePlate, setLicensePlate] = useState('POR-9E11');
  const [chassis, setChassis] = useState('WP0ZZZ99ZPS109234');
  const [price, setPrice] = useState(890000);
  const [costPrice, setCostPrice] = useState(790000);
  const [storeUnit, setStoreUnit] = useState('Matriz Alphaville - Showroom Premium');
  const [status, setStatus] = useState<Vehicle['status']>('Disponível');
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop&q=80'
  );
  const [optionsStr, setOptionsStr] = useState(
    'Sport Chrono, Escape Esportivo, Teto Solar Elétrico, Som Burmester, Faróis Matrix LED'
  );

  if (!isOpen) return null;

  const grossProfit = price - costPrice;
  const marginPercent = price > 0 ? ((grossProfit / price) * 100).toFixed(1) : '0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVehicle({
      brand,
      model,
      version,
      fabYear: Number(fabYear),
      modelYear: Number(modelYear),
      km: Number(km),
      gearbox,
      fuel,
      color,
      licensePlate,
      chassis,
      price: Number(price),
      costPrice: Number(costPrice),
      options: optionsStr.split(',').map((s) => s.trim()).filter(Boolean),
      photos: [photoUrl],
      status,
      storeUnit,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#141416] border border-[#8B5CF6]/30 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 bg-[#1C1C1E] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/30">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Cadastrar Veículo no Estoque</h3>
              <p className="text-xs text-zinc-400">Publicação com Sincronização nos Portais</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Marca *</label>
              <input
                required
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ex: BMW, Porsche, Audi"
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Modelo *</label>
              <input
                required
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Ex: 320i M Sport"
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Versão Completa</label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="Ex: 2.0 Turbo ActiveFlex"
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Ano Fab.</label>
              <input
                type="number"
                value={fabYear}
                onChange={(e) => setFabYear(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Ano Mod.</label>
              <input
                type="number"
                value={modelYear}
                onChange={(e) => setModelYear(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Km Rodados *</label>
              <input
                required
                type="number"
                value={km}
                onChange={(e) => setKm(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Placa (Mercosul)</label>
              <input
                type="text"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Câmbio</label>
              <select
                value={gearbox}
                onChange={(e) => setGearbox(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white outline-none"
              >
                <option value="Automático">Automático</option>
                <option value="Dupla Embreagem">Dupla Embreagem (PDK/DSG)</option>
                <option value="CVT">CVT</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Combustível</label>
              <select
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white outline-none"
              >
                <option value="Gasolina">Gasolina</option>
                <option value="Flex">Flex (Álcool/Gasolina)</option>
                <option value="Diesel">Diesel</option>
                <option value="Híbrido">Híbrido (PHEV/MHEV)</option>
                <option value="Elétrico">100% Elétrico (EV)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Cor</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 focus:border-[#8B5CF6] text-white outline-none"
              />
            </div>
          </div>

          {/* Pricing & Profit Calculation Card */}
          <div className="p-4 rounded-xl bg-[#1C1C1E] border border-zinc-800 space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-xs text-white">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Precificação & Margem Bruta Estimada</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Preço de Venda (R$) *</label>
                <input
                  required
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-emerald-500/40 text-emerald-300 font-bold outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Preço de Custo / Compra (R$)</label>
                <input
                  type="number"
                  value={costPrice}
                  onChange={(e) => setCostPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-200 outline-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0A0A0B] border border-zinc-800 text-xs">
              <span className="text-zinc-400">Lucro Bruto Estimado:</span>
              <span className="font-bold text-emerald-400">
                R$ {grossProfit.toLocaleString('pt-BR')} ({marginPercent}%)
              </span>
            </div>
          </div>

          {/* Store Unit & Photo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Loja / Showroom</label>
              <select
                value={storeUnit}
                onChange={(e) => setStoreUnit(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 text-white outline-none"
              >
                <option value="Matriz Alphaville - Showroom Premium">Matriz Alphaville - Showroom Premium</option>
                <option value="Filial Jardins - Seminovos Selecionados">Filial Jardins - Seminovos Selecionados</option>
                <option value="Filial Barra da Tijuca - Autos & Pickups">Filial Barra da Tijuca - Autos & Pickups</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Status de Disponibilidade</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Vehicle['status'])}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 text-white outline-none"
              >
                <option value="Disponível">Disponível no Showroom</option>
                <option value="Reservado">Reservado / Em Negociação</option>
                <option value="Preparação">Em Preparação / Estética</option>
                <option value="Vendido">Vendido</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Foto Principal (URL)</label>
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Opcionais e Destaques (separados por vírgula)</label>
            <input
              type="text"
              value={optionsStr}
              onChange={(e) => setOptionsStr(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700/80 text-white outline-none"
            />
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
              <span>Publicar no Estoque</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
