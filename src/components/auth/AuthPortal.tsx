import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  Building2,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Car,
  KeyRound,
  Cpu,
  Zap,
  Users,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuthUser, UserRole, PlanTier } from '../../types';
import { MotorGridLogo } from '../MotorGridLogo';

interface AuthPortalProps {
  onLogin: (user: AuthUser) => void;
  onRegister: (newUser: Omit<AuthUser, 'id' | 'createdAt' | 'lastLogin'>) => void;
  availableUsers: AuthUser[];
}

export const AuthPortal: React.FC<AuthPortalProps> = ({
  onLogin,
  onRegister,
  availableUsers,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('ana.castilho@motorgrid.com');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('Gestor de Frotas');
  const [regPlan, setRegPlan] = useState<PlanTier>('Pro');
  const [regAvatar, setRegAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
  const [regTermsAccepted, setRegTermsAccepted] = useState(true);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  const predefinedAvatars = [
    { label: 'Avatar 1', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
    { label: 'Avatar 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { label: 'Avatar 3', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' },
    { label: 'Avatar 4', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
    { label: 'Avatar 5', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      // Find matching user or fallback to first available
      const found = availableUsers.find(
        (u) => u.email.toLowerCase().trim() === loginEmail.toLowerCase().trim()
      );

      if (found) {
        setIsSubmitting(false);
        onLogin(found);
      } else {
        // Allow login if entered custom email by creating a session or logging in as current template
        const fallbackUser: AuthUser = {
          id: `user-${Date.now()}`,
          name: loginEmail.split('@')[0].replace('.', ' ').replace(/^./, (c) => c.toUpperCase()),
          email: loginEmail,
          role: 'Gestor de Frotas',
          company: 'Operadora Conectada MotorGrid',
          avatar: predefinedAvatars[0].url,
          plan: 'Pro',
          twoFactorEnabled: false,
          lastLogin: 'Agora mesmo',
          createdAt: new Date().toISOString().split('T')[0],
          status: 'Ativo',
        };
        setIsSubmitting(false);
        onLogin(fallbackUser);
      }
    }, 600);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim()) {
      setRegError('Por favor, informe seu nome completo.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegError('Por favor, informe um e-mail corporativo válido.');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('A senha deve conter pelo menos 6 caracteres.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('As senhas digitadas não coincidem.');
      return;
    }
    if (!regCompany.trim()) {
      setRegError('Por favor, informe a Concessionária ou Empresa.');
      return;
    }
    if (!regTermsAccepted) {
      setRegError('Você precisa concordar com os Termos de Telemetria e LGPD.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onRegister({
        name: regName,
        email: regEmail,
        role: regRole,
        company: regCompany,
        avatar: regAvatar,
        plan: regPlan,
        twoFactorEnabled: false,
        status: 'Ativo',
      });
      setIsSubmitting(false);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 800);
  };

  const handleQuickLogin = (user: AuthUser) => {
    onLogin(user);
  };

  return (
    <div
      id="auth-portal-container"
      className="min-h-screen w-full bg-[#0A0A0B] bg-motorgrid-pattern text-zinc-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8B5CF6]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#6D28D9]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Side: Brand Story & Telematics Overview */}
        <div className="lg:col-span-5 space-y-6 text-left hidden lg:block">
          <div className="space-y-3">
            <MotorGridLogo size="lg" showSubtitle={true} />
            <p className="text-sm text-zinc-300 font-medium leading-relaxed">
              Plataforma de inteligência e telemetria veicular B2B de alto desempenho para frotas conectadas, concessionárias e montadoras.
            </p>
          </div>

          {/* Value prop pills */}
          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-[#1C1C1E]/80 border border-[#8B5CF6]/25 shadow-lg flex items-start gap-3 backdrop-blur-sm">
              <div className="p-2 rounded-xl bg-[#8B5CF6]/20 text-[#DDD6FE] border border-[#8B5CF6]/30">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Telemetria CAN-Bus em Tempo Real</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Cluster com latência de 18ms e SLA garantido de 99.98% para monitoramento de sensores.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#1C1C1E]/80 border border-[#8B5CF6]/25 shadow-lg flex items-start gap-3 backdrop-blur-sm">
              <div className="p-2 rounded-xl bg-[#8B5CF6]/20 text-[#DDD6FE] border border-[#8B5CF6]/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Copilot IA Integrado ao Gemini 3.7</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Diagnósticos preditivos de frotas, mitigação de churn e análise estratégica automatizada.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#1C1C1E]/80 border border-[#8B5CF6]/25 shadow-lg flex items-start gap-3 backdrop-blur-sm">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Segurança ISO/SAE 21434 & LGPD</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Criptografia de ponta a ponta AES-256 e controle de acesso RBAC por perfil de usuário.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3 text-xs text-zinc-500 font-mono">
            <span className="flex items-center gap-1.5 text-[#C4B5FD]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              MotorGrid Auth v3.2
            </span>
            <span>•</span>
            <span>Ambiente Seguro SSL</span>
          </div>
        </div>

        {/* Right Side: Auth Card (Login / Register / Fast Switch) */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-[#1C1C1E] border border-[#8B5CF6]/30 shadow-2xl shadow-[#8B5CF6]/15 p-6 sm:p-8 backdrop-blur-xl relative">
            {/* Top Brand on mobile */}
            <div className="lg:hidden mb-6 flex justify-center">
              <MotorGridLogo size="md" showSubtitle={true} />
            </div>

            {/* Auth Mode Toggle Tabs */}
            <div className="flex items-center p-1 rounded-2xl bg-[#0A0A0B] border border-zinc-800 mb-6">
              <button
                id="tab-login-btn"
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setLoginError(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  authMode === 'login'
                    ? 'bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Entrar na Conta</span>
              </button>
              <button
                id="tab-register-btn"
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setRegError(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  authMode === 'register'
                    ? 'bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Criar Novo Usuário</span>
              </button>
            </div>

            {/* TAB 1: LOGIN */}
            {authMode === 'login' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-extrabold text-white tracking-tight">
                    Acessar Workspace MotorGrid
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Entre com suas credenciais corporativas ou utilize o acesso rápido abaixo.
                  </p>
                </div>

                {loginError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="text-zinc-300 font-semibold block mb-1.5">
                      E-mail Corporativo
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="login-email-input"
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="nome@empresa.com.br"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-zinc-300 font-semibold">Senha de Acesso</label>
                      <button
                        type="button"
                        onClick={() => alert('Instruções de recuperação de senha enviadas para o e-mail corporativo.')}
                        className="text-[11px] text-[#A78BFA] hover:text-[#C4B5FD] font-semibold cursor-pointer"
                      >
                        Esqueceu a senha?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="login-password-input"
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer p-1"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded bg-[#0A0A0B] border-zinc-700 text-[#8B5CF6] focus:ring-[#8B5CF6] accent-[#8B5CF6]"
                      />
                      <span className="text-xs text-zinc-400">Lembrar neste navegador</span>
                    </label>
                  </div>

                  <button
                    id="login-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white text-xs font-bold shadow-xl shadow-[#8B5CF6]/30 hover:shadow-[#8B5CF6]/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Autenticando sessão...
                      </span>
                    ) : (
                      <>
                        <span>Acessar Plataforma MotorGrid</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Quick Access / Demo Accounts */}
                <div className="pt-4 border-t border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                      Acesso Rápido por Perfil (Demo 1-Click)
                    </span>
                    <span className="text-[10px] text-[#A78BFA] font-mono">{availableUsers.length} usuários</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {availableUsers.map((user) => (
                      <button
                        key={user.id}
                        id={`quick-login-user-${user.id}`}
                        type="button"
                        onClick={() => handleQuickLogin(user)}
                        className="p-2.5 rounded-xl bg-[#0A0A0B] hover:bg-[#1C1C1E] border border-zinc-800 hover:border-[#8B5CF6]/50 text-left flex items-center gap-2.5 transition-all group cursor-pointer"
                      >
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-700 group-hover:ring-[#8B5CF6]"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-white truncate group-hover:text-[#DDD6FE]">
                            {user.name}
                          </div>
                          <div className="text-[10px] text-[#A78BFA] truncate font-medium">
                            {user.role}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: REGISTER / CRIAR USUÁRIO */}
            {authMode === 'register' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-extrabold text-white tracking-tight">
                    Criar Novo Usuário / Cadastro de Operador
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Preencha as informações do operador para liberação instantânea de telemetria.
                  </p>
                </div>

                {regError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-300 font-semibold block mb-1">
                        Nome Completo
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="register-name-input"
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Ex: Gabriela Toledo"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#8B5CF6]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-zinc-300 font-semibold block mb-1">
                        E-mail Corporativo
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="register-email-input"
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="gabriela@concessionaria.com.br"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#8B5CF6]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-300 font-semibold block mb-1">
                        Concessionária / Empresa
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="register-company-input"
                          type="text"
                          required
                          value={regCompany}
                          onChange={(e) => setRegCompany(e.target.value)}
                          placeholder="Ex: EuroAuto Frotas S/A"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#8B5CF6]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-zinc-300 font-semibold block mb-1">
                        Cargo / Perfil de Acesso
                      </label>
                      <select
                        id="register-role-select"
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value as UserRole)}
                        className="w-full px-3 py-2 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-100 focus:outline-none focus:border-[#8B5CF6]"
                      >
                        <option value="Administrador">Administrador (Acesso Total)</option>
                        <option value="Gestor de Frotas">Gestor de Frotas (Telemetria & Operação)</option>
                        <option value="Engenheiro de Telemetria">Engenheiro de Telemetria (OBD-II & CAN-Bus)</option>
                        <option value="Customer Success">Customer Success & Onboarding</option>
                        <option value="Analista de Operações">Analista de Operações</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-300 font-semibold block mb-1">
                        Senha de Acesso
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="register-password-input"
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Mínimo 6 caracteres"
                          className="w-full pl-9 pr-9 py-2 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#8B5CF6]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                        >
                          {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-zinc-300 font-semibold block mb-1">
                        Confirmar Senha
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="register-confirm-password-input"
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="Repita a senha"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#8B5CF6]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Avatar Picker */}
                  <div>
                    <label className="text-zinc-300 font-semibold block mb-1.5">
                      Foto de Perfil / Avatar
                    </label>
                    <div className="flex items-center gap-2.5">
                      {predefinedAvatars.map((av, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setRegAvatar(av.url)}
                          className={`relative rounded-full p-0.5 transition-all cursor-pointer ${
                            regAvatar === av.url
                              ? 'ring-2 ring-[#8B5CF6] scale-110'
                              : 'opacity-60 hover:opacity-100 ring-1 ring-zinc-700'
                          }`}
                        >
                          <img
                            src={av.url}
                            alt={av.label}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          {regAvatar === av.url && (
                            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#8B5CF6] rounded-full border-2 border-[#1C1C1E] flex items-center justify-center text-[8px] text-white">
                              ✓
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={regTermsAccepted}
                        onChange={(e) => setRegTermsAccepted(e.target.checked)}
                        className="rounded bg-[#0A0A0B] border-zinc-700 text-[#8B5CF6] focus:ring-[#8B5CF6] accent-[#8B5CF6] mt-0.5"
                      />
                      <span className="text-[11px] text-zinc-400">
                        Declaro conformidade com as diretrizes de telemetria automotiva, proteção de dados CAN-Bus e regulamentação LGPD.
                      </span>
                    </label>
                  </div>

                  <button
                    id="register-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white text-xs font-bold shadow-xl shadow-[#8B5CF6]/30 hover:shadow-[#8B5CF6]/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Criando conta de usuário...
                      </span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Criar Usuário & Iniciar Acesso</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
