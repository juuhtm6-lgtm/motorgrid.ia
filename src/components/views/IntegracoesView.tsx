import React, { useState } from 'react';
import {
  Plug,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  RefreshCw,
  Sliders,
  Settings2,
  Lock,
} from 'lucide-react';
import { IntegrationItem } from '../../types';
import { initialIntegrations } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import { IntegrationConfigModal } from '../modals/IntegrationConfigModal';

export const IntegracoesView: React.FC = () => {
  const toast = useToast();
  const [integrations, setIntegrations] = useState<IntegrationItem[]>(initialIntegrations);
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'mensageria' | 'portais' | 'financiamento' | 'ia'
  >('all');
  const [configModalItem, setConfigModalItem] = useState<IntegrationItem | null>(null);

  const handleToggleStatus = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStatus = item.status === 'Conectado' ? 'Desconectado' : 'Conectado';
          if (newStatus === 'Conectado') {
            toast.success(`${item.name} conectado com sucesso! Sincronização em tempo real ativada.`);
          } else {
            toast.info(`${item.name} foi desconectado.`);
          }
          return {
            ...item,
            status: newStatus,
            lastSync: newStatus === 'Conectado' ? 'Agora mesmo' : item.lastSync,
          };
        }
        return item;
      })
    );
  };

  const handleSaveConfig = (id: string, updatedData: { apiKey?: string; webhookUrl?: string; autoSync: boolean }) => {
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'Conectado',
              lastSync: 'Agora mesmo',
            }
          : item
      )
    );
  };

  const filteredIntegrations = integrations.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header & Categories */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Hub de Conexões &amp; Integrações</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Sincronização bidirecional de mensagens, estoque nos portais e aprovação de crédito
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#1C1C1E] border border-zinc-800 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#8B5CF6] text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Todas ({integrations.length})
          </button>
          <button
            onClick={() => setSelectedCategory('mensageria')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              selectedCategory === 'mensageria'
                ? 'bg-[#8B5CF6] text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Mensageria
          </button>
          <button
            onClick={() => setSelectedCategory('portais')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              selectedCategory === 'portais'
                ? 'bg-[#8B5CF6] text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Portais
          </button>
          <button
            onClick={() => setSelectedCategory('financiamento')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              selectedCategory === 'financiamento'
                ? 'bg-[#8B5CF6] text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Bancos / F&amp;I
          </button>
          <button
            onClick={() => setSelectedCategory('ia')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              selectedCategory === 'ia'
                ? 'bg-[#8B5CF6] text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            IA &amp; Voz
          </button>
        </div>
      </div>

      {/* Security notice */}
      <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-[#8B5CF6]/30 text-xs flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-[#8B5CF6] shrink-0" />
        <p className="text-zinc-300">
          <strong>Segurança Corporativa MotorGrid:</strong> Tokens de acesso, chaves de API e webhooks são
          criptografados com AES-256 no backend. Nunca expostos ao navegador.
        </p>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredIntegrations.map((item) => {
          const isConnected = item.status === 'Conectado';

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#1C1C1E] border border-zinc-800 hover:border-[#8B5CF6]/40 shadow-xl transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="p-3 rounded-xl bg-[#0A0A0B] border border-zinc-800 text-2xl group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      isConnected
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'
                      }`}
                    />
                    {item.status}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="font-bold text-white text-base">{item.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>

              {/* Status and Action */}
              <div className="space-y-3 pt-3 border-t border-zinc-800 text-xs">
                {item.lastSync && (
                  <div className="text-[11px] text-zinc-400 flex items-center justify-between font-mono">
                    <span>Último Sync:</span>
                    <span className="text-zinc-300">{item.lastSync}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(item.id)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isConnected
                        ? 'bg-[#0A0A0B] hover:bg-zinc-800 text-zinc-300 border border-zinc-700'
                        : 'bg-[#C4B5FD] hover:bg-[#DDD6FE] text-[#2E1065] shadow-md shadow-[#8B5CF6]/20 font-["Plus_Jakarta_Sans",sans-serif]'
                    }`}
                  >
                    {isConnected ? 'Desconectar' : 'Conectar Agora'}
                  </button>

                  <button
                    onClick={() => setConfigModalItem(item)}
                    className="p-2 rounded-xl bg-[#0A0A0B] hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
                    title="Configurações e Mapeamento de Campos"
                  >
                    <Settings2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Integration Config Modal */}
      <IntegrationConfigModal
        isOpen={!!configModalItem}
        onClose={() => setConfigModalItem(null)}
        integration={configModalItem}
        onSaveConfig={handleSaveConfig}
      />
    </div>
  );
};
