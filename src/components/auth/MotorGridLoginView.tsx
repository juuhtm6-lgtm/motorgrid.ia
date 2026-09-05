import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon,
  Zap,
  Car,
  Layers,
  MessageSquare,
  TrendingUp,
  X,
  HelpCircle,
  FileText,
  KeyRound,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MotorGridIcon } from '../MotorGridLogo';
import { AuthUser, ThemeMode } from '../../types';

interface MotorGridLoginViewProps {
  onLogin: (user: AuthUser) => void;
  availableUsers: AuthUser[];
  theme: ThemeMode;
  onToggleTheme: () => void;
  onNavigateToPlans?: () => void;
}

export const MotorGridLoginView: React.FC<MotorGridLoginViewProps> = ({
  onLogin,
  availableUsers,
  theme,
  onToggleTheme,
  onNavigateToPlans,
}) => {
  // Form States
  const [email, setEmail] = useState('ana.castilho@motorgrid.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status & Feedback States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Secondary Modals
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [activeLegalModal, setActiveLegalModal] = useState<'privacidade' | 'termos' | 'suporte' | null>(null);

  // Validate Email Simple Helper
  const isValidEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  // Handle Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    // Validations
    if (!cleanEmail) {
      setErrorMessage('Por favor, informe seu e-mail corporativo.');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setErrorMessage('Formato de e-mail inválido. Utilize o formato seuemail@empresa.com.br');
      return;
    }

    if (!cleanPassword) {
      setErrorMessage('Por favor, digite sua senha de acesso.');
      return;
    }

    if (cleanPassword.length < 4) {
      setErrorMessage('A senha informada deve conter ao menos 4 caracteres.');
      return;
    }

    setIsLoading(true);

    // Simulate authenticating against MotorGrid backend/auth service
    setTimeout(() => {
      // Find matching user from mock system or fallback user
      const foundUser = availableUsers.find(
        (u) => u.email.toLowerCase() === cleanEmail.toLowerCase()
      );

      if (foundUser) {
        setIsLoading(false);
        setSuccessMessage(`Autenticado com sucesso! Carregando comando de ${foundUser.name}...`);
        setTimeout(() => {
          onLogin(foundUser);
        }, 500);
      } else {
        // Create authenticated session for custom email
        const generatedUser: AuthUser = {
          id: `usr-${Date.now()}`,
          name: cleanEmail.split('@')[0].replace(/[\._-]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
          email: cleanEmail,
          role: 'Administrador',
          team: 'Comercial & Gestão',
          company: 'MotorGrid Auto Premium',
          unitId: 'unit-1',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          plan: 'Enterprise',
          phone: '+55 (11) 98765-4321',
          twoFactorEnabled: true,
          lastLogin: 'Agora mesmo',
          createdAt: new Date().toISOString().split('T')[0],
          status: 'Ativo',
          leadsCount: 120,
          salesMonth: 8,
          avgResponseTimeMin: 2.2,
        };

        setIsLoading(false);
        setSuccessMessage(`Bem-vindo ao MotorGrid! Redirecionando para o Dashboard...`);
        setTimeout(() => {
          onLogin(generatedUser);
        }, 500);
      }
    }, 700);
  };

  // Quick Account Selection
  const handleSelectQuickAccount = (user: AuthUser) => {
    setEmail(user.email);
    setPassword('••••••••••••');
    setErrorMessage(null);
  };

  return (
    <div
      id="motorgrid-login-root"
      className={`min-h-screen w-full flex flex-col justify-between overflow-x-hidden transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#0A0A0B] text-zinc-100' : 'bg-[#F8FAFC] text-[#0F172A]'
      }`}
    >
      {/* Top Header Bar with Theme Toggle */}
      <header className="w-full flex items-center justify-between px-6 py-4 z-20">
        {/* Mobile Logo Brand */}
        <div className="flex items-center gap-2.5 md:hidden">
          <div className="p-1.5 rounded-lg bg-[#1C1C1E] border border-[#8B5CF6]/30">
            <MotorGridIcon className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-white dark:text-white">MotorGrid</span>
            <span className="text-[8px] font-semibold tracking-widest uppercase opacity-70 text-[#8B5CF6]">
              Automotive Command
            </span>
          </div>
        </div>

        <div className="hidden md:block" />

        {/* Action Controls Top-Right */}
        <div className="flex items-center gap-3 ml-auto">
          {onNavigateToPlans && (
            <button
              type="button"
              id="btn-login-header-plans"
              onClick={onNavigateToPlans}
              className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'text-zinc-300 hover:text-white bg-[#1C1C1E] hover:bg-[#27272A] border border-white/10'
                  : 'text-[#475569] hover:text-[#0F172A] bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] shadow-sm'
              }`}
            >
              Conhecer Planos & ROI
            </button>
          )}

          {/* Theme Toggle ☀️ / 🌙 */}
          <button
            id="login-theme-toggle-btn"
            type="button"
            onClick={onToggleTheme}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer group flex items-center justify-center shadow-sm ${
              theme === 'dark'
                ? 'bg-[#1C1C1E] hover:bg-[#27272A] border-white/10 hover:border-[#8B5CF6] text-[#A1A1AA] hover:text-white'
                : 'bg-white hover:bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#8B5CF6] text-[#64748B] hover:text-[#0F172A]'
            }`}
            title={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
            aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500 group-hover:text-amber-600 transition-colors" />
            )}
          </button>
        </div>
      </header>

      {/* Main Container: 55% Institutional / Branding | 45% Login Form */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center py-4 lg:py-8">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ============================================================ */}
          {/* LADO ESQUERDO (55%) — IDENTIDADE MOTORGRID (DARK PERMANENTE) */}
          {/* ============================================================ */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-7 flex flex-col justify-center relative select-none"
          >
            {/* Ambient Background Tech Glow & Grid Lines */}
            <div className="absolute -top-16 -left-16 w-96 h-96 bg-[#8B5CF6]/15 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#6D28D9]/10 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Emblem Card Container with Subtle Lighting - Permanent Dark Brand Panel */}
            <div
              id="motorgrid-brand-panel"
              className="relative p-6 sm:p-10 rounded-3xl overflow-hidden border border-[rgba(139,92,246,0.25)] shadow-2xl backdrop-blur-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(18, 15, 36, 0.95) 0%, rgba(14, 12, 27, 0.98) 50%, rgba(8, 7, 15, 0.98) 100%)',
                color: '#FFFFFF',
              }}
            >
              {/* Subtle Tech Grid Overlay */}
              <div
                className="absolute inset-0 opacity-[0.07] pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(#8B5CF6 1.5px, transparent 1.5px), linear-gradient(to right, #8B5CF6 1px, transparent 1px), linear-gradient(to bottom, #8B5CF6 1px, transparent 1px)`,
                  backgroundSize: '24px 24px, 48px 48px, 48px 48px',
                }}
              />

              {/* Top Discreet Tag */}
              <div className="flex items-center gap-2 mb-8 relative z-10">
                <span
                  className="brand-badge-ai inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-sm"
                  style={{
                    backgroundColor: 'rgba(139, 92, 246, 0.20)',
                    border: '1px solid rgba(139, 92, 246, 0.40)',
                    color: '#DDD6FE',
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#A78BFA] animate-pulse" />
                  ✦ Powered by Grid AI
                </span>
                <span
                  className="brand-badge-version hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono border"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.10)',
                    color: '#CBD5E1',
                  }}
                >
                  v2.8 Automotive OS
                </span>
              </div>

              {/* [EMBLEMA MOTORGRID] Official Emblem Hero */}
              <div className="flex items-center gap-5 mb-6 relative z-10">
                <div className="relative flex items-center justify-center p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#1C1533] to-[#0D0A1A] border border-[#8B5CF6]/50 shadow-xl shadow-[#8B5CF6]/25 group">
                  {/* Subtle pulsing glow ring */}
                  <div className="absolute -inset-0.5 bg-[#8B5CF6]/30 rounded-2xl blur-sm -z-10 animate-pulse" />
                  <MotorGridIcon className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]" />
                </div>

                <div className="flex flex-col justify-center">
                  <div className="flex items-baseline">
                    <span
                      className="brand-logo-text text-3xl sm:text-4xl font-extrabold tracking-tight font-['Inter',sans-serif]"
                      style={{ color: '#FFFFFF' }}
                    >
                      MotorGrid
                    </span>
                  </div>
                  <span
                    className="brand-subtitle font-bold uppercase text-xs sm:text-sm tracking-[0.28em] mt-1 font-['Inter',sans-serif]"
                    style={{ color: '#A78BFA' }}
                  >
                    AUTOMOTIVE COMMAND
                  </span>
                </div>
              </div>

              {/* Main Headline */}
              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-snug mb-4 relative z-10"
                style={{ color: '#FFFFFF' }}
              >
                Inteligência que move{' '}
                <span
                  className="brand-headline-accent text-transparent bg-clip-text bg-gradient-to-r from-[#C4B5FD] via-[#A78BFA] to-[#8B5CF6]"
                  style={{ color: '#A78BFA' }}
                >
                  sua operação.
                </span>
              </h1>

              {/* Complementary Description */}
              <p
                className="brand-desc text-sm sm:text-base leading-relaxed mb-8 max-w-xl relative z-10"
                style={{ color: '#CBD5E1' }}
              >
                Centralize atendimento, leads, estoque, vendas e performance em um único ecossistema automotivo inteligente.
              </p>

              {/* Operational Capabilities Feature Grid */}
              <div
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t relative z-10"
                style={{ borderColor: 'rgba(255, 255, 255, 0.12)' }}
              >
                {/* Card 1: Atendimento */}
                <div
                  className="brand-card p-3 rounded-xl transition-all duration-200 cursor-default group/card"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.035)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                  }}
                >
                  <div
                    className="brand-card-icon-box w-7 h-7 rounded-lg flex items-center justify-center mb-2"
                    style={{
                      backgroundColor: 'rgba(139, 92, 246, 0.20)',
                      border: '1px solid rgba(139, 92, 246, 0.30)',
                      color: '#A78BFA',
                    }}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <div className="brand-card-title text-xs font-bold" style={{ color: '#FFFFFF' }}>
                    Atendimento
                  </div>
                  <div className="brand-card-desc text-[10px]" style={{ color: '#94A3B8' }}>
                    WhatsApp & Multi
                  </div>
                </div>

                {/* Card 2: Pipeline & CRM */}
                <div
                  className="brand-card p-3 rounded-xl transition-all duration-200 cursor-default group/card"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.035)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                  }}
                >
                  <div
                    className="brand-card-icon-box w-7 h-7 rounded-lg flex items-center justify-center mb-2"
                    style={{
                      backgroundColor: 'rgba(139, 92, 246, 0.20)',
                      border: '1px solid rgba(139, 92, 246, 0.30)',
                      color: '#A78BFA',
                    }}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <div className="brand-card-title text-xs font-bold" style={{ color: '#FFFFFF' }}>
                    Pipeline & CRM
                  </div>
                  <div className="brand-card-desc text-[10px]" style={{ color: '#94A3B8' }}>
                    Funil Comercial
                  </div>
                </div>

                {/* Card 3: Estoque Vivo */}
                <div
                  className="brand-card p-3 rounded-xl transition-all duration-200 cursor-default group/card"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.035)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                  }}
                >
                  <div
                    className="brand-card-icon-box w-7 h-7 rounded-lg flex items-center justify-center mb-2"
                    style={{
                      backgroundColor: 'rgba(139, 92, 246, 0.20)',
                      border: '1px solid rgba(139, 92, 246, 0.30)',
                      color: '#A78BFA',
                    }}
                  >
                    <Car className="w-3.5 h-3.5" />
                  </div>
                  <div className="brand-card-title text-xs font-bold" style={{ color: '#FFFFFF' }}>
                    Estoque Vivo
                  </div>
                  <div className="brand-card-desc text-[10px]" style={{ color: '#94A3B8' }}>
                    0km & Seminovos
                  </div>
                </div>

                {/* Card 4: Grid AI */}
                <div
                  className="brand-card p-3 rounded-xl transition-all duration-200 cursor-default group/card"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.035)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                  }}
                >
                  <div
                    className="brand-card-icon-box w-7 h-7 rounded-lg flex items-center justify-center mb-2"
                    style={{
                      backgroundColor: 'rgba(139, 92, 246, 0.20)',
                      border: '1px solid rgba(139, 92, 246, 0.30)',
                      color: '#A78BFA',
                    }}
                  >
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div className="brand-card-title text-xs font-bold" style={{ color: '#FFFFFF' }}>
                    Grid AI
                  </div>
                  <div className="brand-card-desc text-[10px]" style={{ color: '#94A3B8' }}>
                    Copilot 24/7
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ============================================================ */}
          {/* LADO DIREITO (45%) — FORMULÁRIO DE LOGIN                     */}
          {/* ============================================================ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="lg:col-span-5 flex flex-col justify-center w-full"
          >
            <div
              id="login-form-card"
              className={`w-full p-6 sm:p-8 rounded-3xl border shadow-xl transition-all ${
                theme === 'dark'
                  ? 'bg-[#141417] border-white/10 shadow-black/60'
                  : 'bg-white border-[#E2E8F0] shadow-xl shadow-slate-200/80'
              }`}
            >
              {/* Header Titles */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" />
                  <span className={`text-xs font-semibold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-[#A78BFA]' : 'text-[#7C3AED]'
                  }`}>
                    Autenticação Segura
                  </span>
                </div>
                <h2 className={`text-2xl font-extrabold tracking-tight ${
                  theme === 'dark' ? 'text-white' : 'text-[#0F172A]'
                }`}>
                  Bem-vindo ao MotorGrid
                </h2>
                <p className={`text-sm mt-1 ${
                  theme === 'dark' ? 'text-zinc-400' : 'text-[#475569]'
                }`}>
                  Acesse sua central de comando.
                </p>
              </div>

              {/* Feedback Alerts */}
              <AnimatePresence mode="wait">
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-400"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}

                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-400"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{successMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4" noValidate>
                {/* Field: E-mail */}
                <div>
                  <label
                    htmlFor="login-email-input"
                    className={`block text-xs font-semibold mb-1.5 ${
                      theme === 'dark' ? 'text-zinc-200' : 'text-[#334155]'
                    }`}
                  >
                    E-mail
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className={`w-4 h-4 ${theme === 'dark' ? 'text-zinc-500' : 'text-[#64748B]'}`} />
                    </div>
                    <input
                      id="login-email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seuemail@empresa.com.br"
                      disabled={isLoading}
                      className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent ${
                        theme === 'dark'
                          ? 'bg-[#1C1C1E] border-white/10 text-white placeholder:text-zinc-600'
                          : 'bg-white border-[#CBD5E1] text-[#0F172A] placeholder:text-[#94A3B8] shadow-sm'
                      }`}
                    />
                  </div>
                </div>

                {/* Field: Senha */}
                <div>
                  <label
                    htmlFor="login-password-input"
                    className={`block text-xs font-semibold mb-1.5 ${
                      theme === 'dark' ? 'text-zinc-200' : 'text-[#334155]'
                    }`}
                  >
                    Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className={`w-4 h-4 ${theme === 'dark' ? 'text-zinc-500' : 'text-[#64748B]'}`} />
                    </div>
                    <input
                      id="login-password-input"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={isLoading}
                      className={`w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent ${
                        theme === 'dark'
                          ? 'bg-[#1C1C1E] border-white/10 text-white placeholder:text-zinc-600'
                          : 'bg-white border-[#CBD5E1] text-[#0F172A] placeholder:text-[#94A3B8] shadow-sm'
                      }`}
                    />
                    <button
                      id="btn-toggle-password-visibility"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer transition-colors ${
                        theme === 'dark'
                          ? 'text-zinc-400 hover:text-white'
                          : 'text-[#64748B] hover:text-[#0F172A]'
                      }`}
                      title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                      aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Checkbox & Forgot Password Link */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      id="login-remember-me-checkbox"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#8B5CF6] focus:ring-[#8B5CF6] accent-[#8B5CF6] cursor-pointer"
                    />
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-zinc-300' : 'text-[#475569]'
                    }`}>
                      Lembrar meu acesso
                    </span>
                  </label>

                  <button
                    id="btn-forgot-password-link"
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setIsForgotPasswordOpen(true);
                    }}
                    className="text-xs font-semibold text-[#8B5CF6] hover:text-[#7C3AED] hover:underline cursor-pointer transition-colors"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                {/* Submit Button: ENTRAR NO MOTORGRID */}
                <button
                  id="btn-submit-login-main"
                  type="submit"
                  disabled={isLoading}
                  style={{ background: 'linear-gradient(90deg, #7C3AED, #8B5CF6)' }}
                  className="w-full py-3 px-4 rounded-xl text-white font-bold text-sm tracking-wide shadow-lg shadow-[#8B5CF6]/30 hover:brightness-105 hover:shadow-[0_0_24px_rgba(139,92,246,0.45)] active:brightness-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group mt-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 text-white animate-spin" />
                      <span>Entrando no MotorGrid...</span>
                    </>
                  ) : (
                    <>
                      <span>ENTRAR NO MOTORGRID</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick Profile Selection for Fast Demo / Testing */}
              <div className={`mt-6 pt-5 border-t ${
                theme === 'dark' ? 'border-white/10' : 'border-[#E2E8F0]'
              }`}>
                <div className="flex items-center justify-between mb-2.5">
                  <span className={`text-[11px] font-semibold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-zinc-400' : 'text-[#64748B]'
                  }`}>
                    Acesso Rápido de Demonstração:
                  </span>
                  <span className="text-[10px] text-[#8B5CF6] font-mono font-bold">1-clique</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {availableUsers.slice(0, 4).map((usr) => {
                    const isSelected = email.toLowerCase() === usr.email.toLowerCase();
                    return (
                      <button
                        key={usr.id}
                        type="button"
                        onClick={() => handleSelectQuickAccount(usr)}
                        className={`p-2.5 rounded-xl text-left border transition-all flex items-center gap-2.5 cursor-pointer group ${
                          isSelected
                            ? theme === 'dark'
                              ? 'border-[#8B5CF6] bg-[#8B5CF6]/15 text-white shadow-sm'
                              : 'border-[#8B5CF6] bg-[#F5F3FF] shadow-sm'
                            : theme === 'dark'
                            ? 'bg-[#1C1C1E]/60 hover:bg-[#1C1C1E] border-white/5'
                            : 'bg-white hover:bg-[#F8FAFC] border-[#E2E8F0] shadow-sm'
                        }`}
                      >
                        <img
                          src={usr.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                          alt={usr.name}
                          className="w-7 h-7 rounded-lg object-cover ring-1 ring-[#8B5CF6]/40 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div
                            className={`text-xs font-bold truncate transition-colors ${
                              isSelected
                                ? theme === 'dark' ? 'text-white' : 'text-[#7C3AED]'
                                : theme === 'dark'
                                ? 'text-zinc-200 group-hover:text-white'
                                : 'text-[#334155] group-hover:text-[#0F172A]'
                            }`}
                          >
                            {usr.name.split(' ')[0]}
                          </div>
                          <div
                            className={`text-[10px] truncate font-mono ${
                              isSelected
                                ? theme === 'dark' ? 'text-[#C4B5FD]' : 'text-[#8B5CF6]'
                                : theme === 'dark'
                                ? 'text-zinc-400'
                                : 'text-[#64748B]'
                            }`}
                          >
                            {usr.role}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Security Shield Tag */}
              <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-[#8B5CF6] font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>Criptografia de ponta a ponta & Protocolo SSL 256-bit</span>
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      {/* ============================================================ */}
      {/* 9. RODAPÉ                                                    */}
      {/* ============================================================ */}
      <footer
        id="login-footer"
        className={`w-full py-6 px-6 border-t text-xs transition-colors z-20 ${
          theme === 'dark'
            ? 'bg-[#0A0A0B]/80 border-white/10 text-zinc-400'
            : 'bg-white/90 border-[#E2E8F0] text-[#64748B]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-semibold text-[#8B5CF6]">MotorGrid Automotive Command</span>
            <span className="mx-2">•</span>
            <span>© 2026 MotorGrid. Todos os direitos reservados.</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              id="btn-login-footer-privacy"
              onClick={() => setActiveLegalModal('privacidade')}
              className="hover:text-[#8B5CF6] hover:underline transition-colors cursor-pointer"
            >
              Privacidade
            </button>
            <span>•</span>
            <button
              type="button"
              id="btn-login-footer-terms"
              onClick={() => setActiveLegalModal('termos')}
              className="hover:text-[#8B5CF6] hover:underline transition-colors cursor-pointer"
            >
              Termos
            </button>
            <span>•</span>
            <button
              type="button"
              id="btn-login-footer-support"
              onClick={() => setActiveLegalModal('suporte')}
              className="hover:text-[#8B5CF6] hover:underline transition-colors cursor-pointer"
            >
              Suporte
            </button>
          </div>
        </div>
      </footer>

      {/* ============================================================ */}
      {/* MODAL: ESQUECI MINHA SENHA                                   */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isForgotPasswordOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl ${
                theme === 'dark' ? 'bg-[#1C1C1E] border-white/15 text-white' : 'bg-white border-[#E2E8F0] text-[#0F172A]'
              }`}
            >
              <div className={`flex items-center justify-between pb-3 border-b ${
                theme === 'dark' ? 'border-white/10' : 'border-[#E2E8F0]'
              }`}>
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-[#8B5CF6]" />
                  <h3 className="font-bold text-base">Recuperação de Acesso</h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPasswordOpen(false);
                    setForgotSubmitted(false);
                  }}
                  className={`p-1 rounded-lg transition-colors cursor-pointer ${
                    theme === 'dark'
                      ? 'hover:bg-white/10 text-zinc-400 hover:text-white'
                      : 'hover:bg-slate-100 text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {!forgotSubmitted ? (
                <div className="py-4 space-y-4">
                  <p className={`text-xs ${theme === 'dark' ? 'text-zinc-300' : 'text-[#475569]'}`}>
                    Informe seu e-mail corporativo cadastrado no MotorGrid para receber um token de redefinição imediato.
                  </p>

                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${
                      theme === 'dark' ? 'text-zinc-200' : 'text-[#334155]'
                    }`}>
                      E-mail Corporativo
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="seuemail@empresa.com.br"
                      className={`w-full px-3.5 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] ${
                        theme === 'dark'
                          ? 'bg-[#141417] border-white/10 text-white placeholder:text-zinc-600'
                          : 'bg-white border-[#CBD5E1] text-[#0F172A] placeholder:text-[#94A3B8] shadow-sm'
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsForgotPasswordOpen(false)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                        theme === 'dark'
                          ? 'text-zinc-300 hover:bg-white/10'
                          : 'text-[#475569] hover:bg-slate-100'
                      }`}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (forgotEmail) setForgotSubmitted(true);
                      }}
                      className="px-4 py-2 text-xs font-bold rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-md shadow-[#8B5CF6]/30 cursor-pointer"
                    >
                      Enviar Instruções
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm">Instruções enviadas!</h4>
                  <p className={`text-xs max-w-xs mx-auto ${theme === 'dark' ? 'text-zinc-300' : 'text-[#475569]'}`}>
                    Um link de redefinição com validade de 30 minutos foi enviado para <strong>{forgotEmail}</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPasswordOpen(false);
                      setForgotSubmitted(false);
                    }}
                    className="mt-2 px-5 py-2 rounded-xl bg-[#8B5CF6] text-white text-xs font-bold cursor-pointer"
                  >
                    Voltar ao Login
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* MODAL: PRIVACIDADE / TERMOS / SUPORTE                        */}
      {/* ============================================================ */}
      <AnimatePresence>
        {activeLegalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-lg p-6 rounded-2xl border shadow-2xl ${
                theme === 'dark' ? 'bg-[#1C1C1E] border-white/15 text-white' : 'bg-white border-[#E2E8F0] text-[#0F172A]'
              }`}
            >
              <div className={`flex items-center justify-between pb-3 border-b ${
                theme === 'dark' ? 'border-white/10' : 'border-[#E2E8F0]'
              }`}>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#8B5CF6]" />
                  <h3 className="font-bold text-base capitalize">
                    {activeLegalModal === 'privacidade' && 'Política de Privacidade & LGPD'}
                    {activeLegalModal === 'termos' && 'Termos de Serviço & SLA Operacional'}
                    {activeLegalModal === 'suporte' && 'Central de Suporte & Atendimento'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveLegalModal(null)}
                  className={`p-1 rounded-lg transition-colors cursor-pointer ${
                    theme === 'dark'
                      ? 'hover:bg-white/10 text-zinc-400 hover:text-white'
                      : 'hover:bg-slate-100 text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className={`py-4 space-y-3 text-xs max-h-80 overflow-y-auto leading-relaxed ${
                theme === 'dark' ? 'text-zinc-300' : 'text-[#475569]'
              }`}>
                {activeLegalModal === 'privacidade' && (
                  <>
                    <p>
                      O <strong>MotorGrid Automotive Command</strong> cumpre integralmente a Lei Geral de Proteção de Dados (LGPD nº 13.709/2018).
                    </p>
                    <p>
                      Todos os dados de clientes, propostas, veículos e conversas trafegam sob criptografia TLS 1.3 de ponta a ponta e são armazenados em data centers de alta disponibilidade com redundância geográfica e isolamento multi-tenant por concessionária/grupo.
                    </p>
                    <p>
                      Não comercializamos, transferimos ou compartilhamos informações confidenciais com terceiros não autorizados.
                    </p>
                  </>
                )}

                {activeLegalModal === 'termos' && (
                  <>
                    <p>
                      O uso do ecossistema MotorGrid é regido pelo Acordo de Nível de Serviço (SLA) de 99.98% de disponibilidade.
                    </p>
                    <p>
                      A integração com a Meta Ads API, WhatsApp Business Cloud e portais automotivos é mantida com autenticação OAuth oficial e monitoramento de taxa de requisições.
                    </p>
                    <p>
                      Cada usuário autenticado opera com permissões baseadas em funções (RBAC: Administrador, Gestor, Vendedor, SDR).
                    </p>
                  </>
                )}

                {activeLegalModal === 'suporte' && (
                  <>
                    <p>
                      Precisa de auxílio técnico ou suporte operacional imediato?
                    </p>
                    <div className="p-3 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-white space-y-1 my-2">
                      <div className="font-bold text-[#DDD6FE]">Canal Direto de Atendimento:</div>
                      <div>💬 WhatsApp Suporte: +55 (11) 98765-4321</div>
                      <div>📧 E-mail: suporte@motorgrid.com.br</div>
                      <div>⏰ Horário: 24/7 para clientes Enterprise e Pro</div>
                    </div>
                  </>
                )}
              </div>

              <div className={`pt-3 border-t flex justify-end ${
                theme === 'dark' ? 'border-white/10' : 'border-[#E2E8F0]'
              }`}>
                <button
                  type="button"
                  onClick={() => setActiveLegalModal(null)}
                  className="px-4 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
