import React, { useState, useEffect } from 'react';
import { X, Car, DollarSign, Calendar, Fuel, Gauge, MapPin, Tag } from 'lucide-react';
import { Vehicle, VehicleStatus } from '../../types';

interface EditVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onSave: (updated: Vehicle) => void;
}

export const EditVehicleModal: React.FC<EditVehicleModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  onSave,
}) => {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [version, setVersion] = useState('');
  const [fabYear, setFabYear] = useState(2023);
  const [modYear, setModYear] = useState(2024);
  const [price, setPrice] = useState(0);
  const [km, setKm] = useState(0);
  const [color, setColor] = useState('');
  const [plate, setPlate] = useState('');
  const [vin, setVin] = useState('');
  const [fuel, setFuel] = useState('Gasolina');
  const [transmission, setTransmission] = useState('Automático');
  const [location, setLocation] = useState('Matriz Sorocaba');
  const [status, setStatus] = useState<VehicleStatus>('Disponível');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (vehicle) {
      setBrand(vehicle.brand || '');
      setModel(vehicle.model || '');
      setVersion(vehicle.version || '');
      setFabYear(vehicle.fabYear || 2023);
      setModYear(vehicle.modYear || 2024);
      setPrice(vehicle.price || 0);
      setKm(vehicle.km || 0);
      setColor(vehicle.color || '');
      setPlate(vehicle.plate || '');
      setVin(vehicle.vin || vehicle.chassis || '');
      setFuel(vehicle.fuel || 'Gasolina');
      setTransmission(vehicle.transmission || 'Automático');
      setLocation(vehicle.location || vehicle.storeUnit || 'Matriz Sorocaba');
      setStatus(vehicle.status || 'Disponível');
      setDescription(vehicle.description || '');
      setPhoto(vehicle.photo || (vehicle.photos && vehicle.photos[0]) || '');
      setError('');
    }
  }, [vehicle]);

  if (!isOpen || !vehicle) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand.trim() || !model.trim() || !price) {
      setError('Por favor preencha marca, modelo e preço.');
      return;
    }

    onSave({
      ...vehicle,
      brand,
      model,
      version,
      fabYear: Number(fabYear),
      modYear: Number(modYear),
      price: Number(price),
      km: Number(km),
      color,
      plate,
      vin,
      chassis: vin,
      fuel,
      transmission,
      location,
      storeUnit: location,
      status,
      description,
      photo,
      photos: photo ? [photo, ...(vehicle.photos || []).slice(1)] : vehicle.photos,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl rounded-2xl bg-[#141416] border border-zinc-800 p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <h3 className="text-base font-bold text-white">Editar Veículo do Estoque</h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Atualize dados técnicos, valores e status de {vehicle.brand} {vehicle.model}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Marca *</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Modelo *</label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Versão</label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Ano Fabricação</label>
              <input
                type="number"
                value={fabYear}
                onChange={(e) => setFabYear(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Ano Modelo</label>
              <input
                type="number"
                value={modYear}
                onChange={(e) => setModYear(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Preço de Venda (R$) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Quilometragem (KM)</label>
              <input
                type="number"
                value={km}
                onChange={(e) => setKm(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Cor</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Placa</label>
              <input
                type="text"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Chassi / VIN</label>
              <input
                type="text"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Combustível</label>
              <select
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              >
                <option value="Gasolina">Gasolina</option>
                <option value="Flex">Flex (Álcool/Gasolina)</option>
                <option value="Diesel">Diesel</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Elétrico">Elétrico 100%</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Status no Estoque</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as VehicleStatus)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              >
                <option value="Disponível">Disponível</option>
                <option value="Reservado">Reservado</option>
                <option value="Vendido">Vendido</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Unidade / Loja</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              >
                <option value="Matriz Sorocaba">Matriz Sorocaba</option>
                <option value="Filial Jardins SP">Filial Jardins SP</option>
                <option value="Showroom Alphaville">Showroom Alphaville</option>
                <option value="Barra da Tijuca RJ">Barra da Tijuca RJ</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">URL da Foto Principal</label>
              <input
                type="text"
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Descrição / Opcionais</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Único dono, pacote M Sport, revisões em concessionária..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#0A0A0B] border border-zinc-700 text-white focus:border-[#8B5CF6] outline-none"
            />
          </div>

          {error && <div className="text-xs text-rose-400">{error}</div>}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-lg shadow-[#8B5CF6]/30 transition-all cursor-pointer"
            >
              Salvar Veículo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
