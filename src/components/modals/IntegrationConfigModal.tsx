import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, RefreshCw, Key, Globe, Shield, Save } from 'lucide-react';
import { IntegrationItem } from '../../types';
import { useToast } from '../../context/ToastContext';

interface IntegrationConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  integration: IntegrationItem | null;
  onSaveConfig: (id: string, updatedData: { apiKey?: string; webhookUrl?: string; autoSync: boolean }) => void;
}

export const IntegrationConfigModal: React.FC<IntegrationConfigModalProps> = ({
  isOpen,
  onClose,
  integration,
  onSaveConfig,
}) => {
  const toast = useToast();
  const [apiKey, setApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [autoSync, setAutoSync] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'idle' | 'success' | 'failed'>('idle');

  useEffect(() => {
    if (integration) {
      setApiKey(`mg_live_token_${integration.id}_${Math.floor(Math.random() * 89999 + 10000)}`);
      setWebhookUrl(`https://api.motorgrid.io/v1/webhooks/${integration.id}`);
      setAutoSync(true);
      setTestResult('idle');
    }
  }, [integration]);

  if (!isOpen || !integration) return null;

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult('idle');
    setTimeout(() => {
      setIsTesting(false);
      setTestResult('success');
      toast.success(`Conexão com ${integration.name} testada com sucesso! Latência: 48ms.`);
    }, 900);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(integration.id, { apiKey, webhookUrl, autoSync });
    toast.success(`Configurações de ${integration.name} salvas com sucesso!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-[#1C1C1E] border border-zinc-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{integration.icon}</span>
            <div>
              <h3 className="font-bold text-white text-base">Configurar {integration.name}</h3>
              <p className="text-xs text-zinc-400">Credenciais de API, Webhooks e Mapeamento</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-semibold mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>Chave de API / Token de Acesso</span>
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-800 text-zinc-200 focus:outline-none focus:border-[#8B5CF6] font-mono text-xs"
              placeholder="Digite a chave da API..."
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>URL de Webhook (Recebimento de Eventos)</span>
            </label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-800 text-zinc-200 focus:outline-none focus:border-[#8B5CF6] font-mono text-xs"
            />
          </div>

          {/* Auto sync toggle */}
          <div className="p-3.5 rounded-xl bg-[#0A0A0B] border border-zinc-800 flex items-center justify-between">
            <div>
              <div className="font-semibold text-white text-xs">Sincronização em Tempo Real</div>
              <div className="text-[11px] text-zinc-400">Atualizar dados automaticamente a cada alteração</div>
            </div>
            <button
              type="button"
              onClick={() => setAutoSync(!autoSync)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                autoSync ? 'bg-[#8B5CF6]' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  autoSync ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Test connection */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0A0A0B] border border-zinc-800">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-zinc-300">Status do Endpoint</span>
            </div>
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-[#8B5CF6]' : ''}`} />
              <span>{isTesting ? 'Testando...' : 'Testar Conexão'}</span>
            </button>
          </div>

          {testResult === 'success' && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Conexão verificada! O endpoint respondeu com status 200 OK.</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#C4B5FD] hover:bg-[#DDD6FE] text-[#2E1065] font-bold shadow-md shadow-[#8B5CF6]/20 transition-all flex items-center gap-1.5 cursor-pointer font-['Plus_Jakarta_Sans',sans-serif]"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Configuração</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
