import React, { useState } from 'react';
import {
  Car,
  ShieldCheck,
  Zap,
  CheckCircle2,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  Calculator,
  Lock,
  Mail,
  User,
  Building2,
  KeyRound,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  BarChart3,
  Users,
  CreditCard,
  Sliders,
  DollarSign,
  Fuel,
  Wrench,
  Gauge,
  Activity,
  Check,
  Star,
  Phone,
  HelpCircle,
  Clock,
  Radio,
  FileText,
  RefreshCw,
  LogOut,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuthUser, PlanTier, UserRole } from '../../types';
import { MotorGridLogo } from '../MotorGridLogo';

interface SalesLandingPageProps {
  onLogin: (user: AuthUser) => void;
  onRegister: (newUser: Omit<AuthUser, 'id' | 'createdAt' | 'lastLogin'>) => void;
  availableUsers: AuthUser[];
  currentUser?: AuthUser | null;
  onGoToDashboard?: () => void;
  onLogout?: () => void;
}

export const SalesLandingPage: React.FC<SalesLandingPageProps> = ({
  onLogin,
  onRegister,
  availableUsers,
  currentUser,
  onGoToDashboard,
  onLogout,
}) => {
  // Billing cycle toggle: Monthly vs Annual (20% discount)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [selectedPlanForAuth, setSelectedPlanForAuth] = useState<PlanTier>('Pro');

  // ROI Calculator State
  const [calcFleetSize, setCalcFleetSize] = useState<number>(30);
  const [calcMonthlyKm, setCalcMonthlyKm] = useState<number>(3800);
  const [calcFuelPrice, setCalcFuelPrice] = useState<number>(5.90);
  const [calcFuelEfficiency, setCalcFuelEfficiency] = useState<number>(8.5); // km/l

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('ana.castilho@motorgrid.com');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('Gestor de Frotas');
  const [regPhone, setRegPhone] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regTermsAccepted, setRegTermsAccepted] = useState(true);
  const [regError, setRegError] = useState<string | null>(null);
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);

  // Dynamic ROI Calculations
  // Estimated 18% fuel savings with real-time telematics & driver score
  const monthlyLitersPerVehicle = calcMonthlyKm / calcFuelEfficiency;
  const totalMonthlyFuelCost = calcFleetSize * monthlyLitersPerVehicle * calcFuelPrice;
  const estimatedMonthlyFuelSavings = totalMonthlyFuelCost * 0.18;
  const estimatedAnnualFuelSavings = estimatedMonthlyFuelSavings * 12;

  // Maintenance & wear savings (~R$ 140/vehicle/month saved through predictive diagnostics)
  const estimatedMonthlyMaintenanceSavings = calcFleetSize * 140;
  const estimatedAnnualMaintenanceSavings = estimatedMonthlyMaintenanceSavings * 12;

  const totalAnnualSavings = estimatedAnnualFuelSavings + estimatedAnnualMaintenanceSavings;
  const planCostPerMonth = (selectedPlanForAuth === 'Starter' ? 49 : selectedPlanForAuth === 'Pro' ? 89 : 149) * calcFleetSize;
  const estimatedROI = Math.round((totalAnnualSavings / (planCostPerMonth * 12)) * 10) / 10;

  // Open Auth Modal with pre-selected plan
  const handleSelectPlanToRegister = (plan: PlanTier) => {
    setSelectedPlanForAuth(plan);
    setAuthMode('register');
    setIsAuthModalOpen(true);
  };

  const handleOpenLogin = () => {
    if (onGoToDashboard) {
      onGoToDashboard();
    } else {
      setAuthMode('login');
      setIsAuthModalOpen(true);
    }
  };

  // Form Submissions
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmittingLogin(true);

    setTimeout(() => {
      const found = availableUsers.find(
        (u) => u.email.toLowerCase().trim() === loginEmail.toLowerCase().trim()
      );

      if (found) {
        setIsSubmittingLogin(false);
        setIsAuthModalOpen(false);
        onLogin(found);
      } else {
        const fallbackUser: AuthUser = {
          id: `user-${Date.now()}`,
          name: loginEmail.split('@')[0].replace('.', ' ').replace(/^./, (c) => c.toUpperCase()),
          email: loginEmail,
          role: 'Gestor de Frotas',
          company: 'Operadora Conectada MotorGrid',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          plan: selectedPlanForAuth,
          twoFactorEnabled: true,
          lastLogin: 'Agora mesmo',
          createdAt: new Date().toISOString().split('T')[0],
          status: 'Ativo',
        };
        setIsSubmittingLogin(false);
        setIsAuthModalOpen(false);
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
      setRegError('Por favor, insira um e-mail corporativo válido.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setRegError('A senha deve conter no mínimo 6 caracteres.');
      return;
    }
    if (!regCompany.trim()) {
      setRegError('Por favor, informe o nome da sua empresa ou frota.');
      return;
    }
    if (!regTermsAccepted) {
      setRegError('É necessário aceitar os Termos de Uso e Política de Privacidade.');
      return;
    }

    setIsSubmittingReg(true);

    setTimeout(() => {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8B5CF6', '#A78BFA', '#10B981', '#38BDF8'],
        });
      } catch (e) {
        // fallback if canvas-confetti is not loaded
      }

      const newUser: AuthUser = {
        id: `usr-${Date.now()}`,
        name: regName.trim(),
        email: regEmail.trim(),
        role: regRole,
        team: 'Comercial',
        unitId: 'unit-1',
        company: regCompany.trim(),
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        plan: selectedPlanForAuth,
        twoFactorEnabled: false,
        lastLogin: 'Agora mesmo',
        createdAt: new Date().toISOString().split('T')[0],
        status: 'Ativo',
        phone: regPhone.trim() || '+55 (11) 99876-5432',
      };

      setIsSubmittingReg(false);
      setIsAuthModalOpen(false);
      onRegister(newUser);
    }, 700);
  };

  const pricingPlans = [
    {
      id: 'Starter' as PlanTier,
      name: 'Starter Connected',
      tagline: 'Ideal para pequenas frotas e autônomos que buscam visibilidade básica',
      monthlyPrice: 49,
      annualPrice: 39,
      badge: null,
      popular: false,
      features: [
        'Rastreamento GPS com atualização a cada 15 segundos',
        'Até 15 veículos conectados',
        'App mobile do motorista (iOS & Android)',
        'Cercas eletrônicas simples (até 10 áreas)',
        'Alertas de ignição ligada/desligada e excesso de velocidade',
        'Histórico de rotas por 30 dias',
        'Suporte por e-mail em dias úteis',
      ],
      missingFeatures: [
        'Telemetria CAN-Bus avançada (RPM, freios, temperatura)',
        'Copilot IA Gemini de diagnósticos preditivos de quebra',
        'Acesso irrestrito a APIs e Webhooks REST',
        'Gerente de Sucesso de Conta dedicado',
      ],
    },
    {
      id: 'Pro' as PlanTier,
      name: 'Pro Telematics',
      tagline: 'O mais completo para frotas corporativas que buscam máxima economia e IA',
      monthlyPrice: 89,
      annualPrice: 71,
      badge: 'Mais Escolhido • Economize 20%',
      popular: true,
      features: [
        'Tudo do plano Starter Connected',
        'Telemetria CAN-Bus completa em tempo real (5s)',
        'Copilot IA Gemini 3.7 para Diagnósticos Preditivos de Falha',
        'Classificação de comportamento do motorista (Eco-Drive Score)',
        'Controle automatizado de abastecimentos, manutenções e TCO',
        'Cercas eletrônicas e rotas otimizadas ilimitadas',
        'Histórico de dados e telemetria por 12 meses',
        'Integração via Webhooks e API REST padrão',
        'Suporte prioritário via WhatsApp e Telefone',
      ],
      missingFeatures: [
        'Infraestrutura dedicada & SLA contratual de 99.99%',
        'Customização White-Label com domínio próprio',
      ],
    },
    {
      id: 'Enterprise' as PlanTier,
      name: 'Enterprise Fleet',
      tagline: 'Para grandes transportadoras, locadoras, frotas pesadas e montadoras',
      monthlyPrice: 149,
      annualPrice: 119,
      badge: 'Frotas de Alta Escala',
      popular: false,
      features: [
        'Tudo do plano Pro Telematics',
        'Veículos ilimitados com escalabilidade em nuvem híbrida',
        'Integração nativa com ERPs (SAP, TOTVS, Sankhya, Senior)',
        'Módulo White-Label (sua marca, aplicativo e domínio próprio)',
        'Gerente de Conta & Customer Success dedicado (CSM)',
        'SLA contratual garantido de 99.99% de uptime',
        'Treinamento e capacitação presencial da equipe operacional',
        'Histórico de telemetria perpétuo para auditorias',
        'Suporte técnico 24/7/365 com plantão de engenharia',
      ],
      missingFeatures: [],
    },
  ];

  const faqs = [
    {
      q: 'Como é feita a instalação dos módulos e leitura CAN-Bus?',
      a: 'A instalação é 100% plug & play através da porta OBD-II dos veículos, sem cortes de chicote elétrico ou perda de garantia de fábrica. Para frotas pesadas (caminhões e ônibus), disponibilizamos chicotes indutivos CAN-Bus que leem os dados do tacógrafo e módulo central por aproximação magnética.',
    },
    {
      q: 'Como funciona o período de teste grátis de 14 dias?',
      a: 'Ao criar sua conta e selecionar o plano Pro ou Starter, você recebe acesso imediato a todas as funcionalidades do sistema, simulador de telemetria e dashboards por 14 dias sem compromisso financeiro. Não cobramos taxa de cancelamento.',
    },
    {
      q: 'Posso migrar de plano ou alterar a quantidade de veículos?',
      a: 'Sim! A qualquer momento você pode fazer upgrade, downgrade ou adicionar/remover veículos diretamente pelo painel de faturamento. O valor é recalculado proporcionalmente aos dias de utilização.',
    },
    {
      q: 'Como a Inteligência Artificial Gemini prevê quebras mecânicas?',
      a: 'O Copilot IA MotorGrid analisa continuamente os parâmetros de telemetria (variação de temperatura do líquido de arrefecimento, oscilações na tensão do alternador, padrões anômalos de frenagem e pressão de óleo). Quando detecta desvios estatísticos em relação à média do modelo do veículo, o sistema emite um alerta preditivo antes que a falha paralise o veículo na estrada.',
    },
    {
      q: 'A plataforma atende às exigências da LGPD e segurança de dados?',
      a: 'Sim. Todos os dados trafegam com criptografia TLS 1.3 ponta a ponta e são armazenados em servidores com certificação ISO 27001 e SOC-2. Motoristas e operadores possuem níveis de permissão com controle de acesso granular baseado em funções (RBAC).',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 font-sans antialiased selection:bg-[#8B5CF6] selection:text-white">
      {/* 1. TOP SALES NAVIGATION BAR */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0A0A0B]/85 border-b border-[#8B5CF6]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <MotorGridLogo size="md" />
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30">
              Telemetria & Frotas
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-zinc-300">
            <a href="#recursos" className="hover:text-white transition-colors">
              Recursos & IA
            </a>
            <a href="#calculadora" className="hover:text-white transition-colors flex items-center gap-1.5 text-[#A78BFA]">
              <Calculator className="w-3.5 h-3.5" />
              Calculadora ROI
            </a>
            <a href="#planos" className="hover:text-white transition-colors">
              Planos & Preços
            </a>
            <a href="#depoimentos" className="hover:text-white transition-colors">
              Depoimentos
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={onGoToDashboard}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold transition-all shadow-lg shadow-[#8B5CF6]/25 cursor-pointer"
                >
                  <Gauge className="w-4 h-4" />
                  <span>Acessar Painel</span>
                </button>
                <button
                  onClick={onLogout}
                  title="Sair da Conta"
                  className="p-2 rounded-xl bg-zinc-800/80 hover:bg-rose-500/20 hover:text-rose-400 text-zinc-400 border border-zinc-700 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <button
                  id="landing-login-nav-btn"
                  onClick={handleOpenLogin}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-200 hover:text-white hover:bg-zinc-800/80 border border-zinc-700/60 transition-all cursor-pointer"
                >
                  Entrar na Conta
                </button>

                <button
                  id="landing-cta-nav-btn"
                  onClick={() => handleSelectPlanToRegister('Pro')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white text-xs font-bold transition-all shadow-lg shadow-[#8B5CF6]/30 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Experimentar Grátis</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#8B5CF6]/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Launch Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C1C1E] border border-[#8B5CF6]/30 text-xs font-medium text-[#DDD6FE] shadow-inner">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B5CF6] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8B5CF6]"></span>
              </span>
              <span className="font-semibold text-white">Novo MotorGrid 2026</span>
              <span className="text-zinc-400">•</span>
              <span className="text-[#A78BFA] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" /> Copilot IA Gemini 3.7 Integrado
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
              Maximize a Eficiência da sua Frota com{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#A78BFA] via-[#C084FC] to-[#38BDF8]">
                Telemetria Conectada
              </span>{' '}
              e Inteligência Artificial.
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed max-w-2xl mx-auto">
              Reduza até <strong className="text-emerald-400 font-semibold">28% em custos operacionais de combustível</strong>, evite quebras com diagnósticos preditivos CAN-Bus e automatize a gestão de veículos, contratos e manutenções em tempo real.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <button
                id="hero-choose-plan-btn"
                onClick={() => handleSelectPlanToRegister('Pro')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white text-sm font-bold transition-all shadow-xl shadow-[#8B5CF6]/35 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Escolher um Plano & Testar 14 Dias Grátis</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#calculadora"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#1C1C1E] hover:bg-[#252528] border border-zinc-700/80 text-zinc-200 text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-[#A78BFA]" />
                <span>Simular Economia da Frota</span>
              </a>

              {currentUser ? (
                <button
                  onClick={onGoToDashboard}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Gauge className="w-4 h-4" />
                  <span>Entrar no Painel ({currentUser.name.split(' ')[0]})</span>
                </button>
              ) : (
                <button
                  onClick={handleOpenLogin}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer border border-zinc-800"
                >
                  <Lock className="w-4 h-4 text-zinc-400" />
                  <span>Já sou Cliente (Login)</span>
                </button>
              )}
            </div>

            {/* Trust highlights */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sem fidelidade contratual
              </span>
              <span className="flex items-center gap-1.5 text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instalação Plug & Play OBD-II
              </span>
              <span className="flex items-center gap-1.5 text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Ativação Imediata
              </span>
            </div>
          </div>

          {/* Interactive Live Telematics Showcase Widget */}
          <div className="mt-14 max-w-5xl mx-auto rounded-3xl bg-[#1C1C1E]/95 border border-[#8B5CF6]/30 p-5 sm:p-7 shadow-2xl shadow-black/80 relative overflow-hidden">
            {/* Header of widget */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#A78BFA]">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">Volvo FH 540 Globetrotter • Placa MGX-2026</h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ● Telemetria Ao Vivo
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">Rota: Rodovia dos Bandeirantes (SP) • Motorista: Marcos Silveira</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 font-mono">
                  Latência: <strong className="text-emerald-400">32ms</strong>
                </span>
                <span className="px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 font-mono">
                  CAN-Bus: <strong className="text-emerald-400">100% OK</strong>
                </span>
              </div>
            </div>

            {/* Realtime Telemetry Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-5">
              <div className="p-3.5 rounded-2xl bg-[#0A0A0B] border border-zinc-800/90">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                  <span>Velocidade Atual</span>
                  <Gauge className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-xl font-black text-white tracking-tight">84 <span className="text-xs font-normal text-zinc-400">km/h</span></div>
                <div className="text-[10px] text-emerald-400 mt-1 font-medium">Faixa econômica 75-85 km/h</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0A0A0B] border border-zinc-800/90">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                  <span>RPM do Motor</span>
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-xl font-black text-white tracking-tight">1.350 <span className="text-xs font-normal text-zinc-400">RPM</span></div>
                <div className="text-[10px] text-emerald-400 mt-1 font-medium">Torque ideal de cruzeiro</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0A0A0B] border border-zinc-800/90">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                  <span>Consumo Médio</span>
                  <Fuel className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-xl font-black text-white tracking-tight">2.8 <span className="text-xs font-normal text-zinc-400">km/L</span></div>
                <div className="text-[10px] text-emerald-400 mt-1 font-medium">+18% vs média da frota</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0A0A0B] border border-zinc-800/90">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                  <span>Diagnóstico IA</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
                </div>
                <div className="text-xl font-black text-emerald-400 tracking-tight">98.4<span className="text-xs font-normal text-zinc-400">/100</span></div>
                <div className="text-[10px] text-[#A78BFA] mt-1 font-medium">Sem falhas mecânicas</div>
              </div>
            </div>

            {/* AI Banner inside widget */}
            <div className="mt-4 p-3.5 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/25 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5 text-xs text-[#DDD6FE]">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>
                  <strong>Copilot IA:</strong> "Manutenção preventiva de pastilhas de freio prevista para daqui a 2.400 km. Economia estimada de R$ 1.850 evitando desgaste dos discos."
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#A78BFA]">Prevenção Ativa</span>
            </div>
          </div>

          {/* Social Proof Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-y border-zinc-800/80 py-8">
            <div>
              <div className="text-3xl font-black text-white tracking-tight">+45.000</div>
              <div className="text-xs text-zinc-400 mt-1 font-medium">Veículos & Dispositivos Ativos</div>
            </div>
            <div>
              <div className="text-3xl font-black text-emerald-400 tracking-tight">R$ 18.4M</div>
              <div className="text-xs text-zinc-400 mt-1 font-medium">Economizados em Combustível</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white tracking-tight">99.98%</div>
              <div className="text-xs text-zinc-400 mt-1 font-medium">Disponibilidade e Uptime SLA</div>
            </div>
            <div>
              <div className="text-3xl font-black text-[#A78BFA] tracking-tight">&lt; 1.2%</div>
              <div className="text-xs text-zinc-400 mt-1 font-medium">Taxa de Cancelamento (Churn)</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE FLEET ROI CALCULATOR */}
      <section id="calculadora" className="py-20 bg-[#0E0E11] border-y border-[#8B5CF6]/15 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Calculator className="w-3.5 h-3.5" />
              Calculadora de Retorno sobre Investimento
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Descubra Quanto sua Frota vai Economizar Todo Mês
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl mx-auto">
              Ajuste os parâmetros da sua operação abaixo para calcular a economia real com a telemetria preditiva do MotorGrid.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Sliders Input Panel */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#1C1C1E] border border-zinc-800 space-y-6 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#A78BFA]" />
                <span>Parâmetros da sua Frota</span>
              </h3>

              {/* Slider 1: Fleet Size */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-300">Quantidade de Veículos na Frota</span>
                  <span className="text-[#A78BFA] text-sm font-bold font-mono">{calcFleetSize} veículos</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={calcFleetSize}
                  onChange={(e) => setCalcFleetSize(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]"
                />
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>5 veículos</span>
                  <span>100 veículos</span>
                  <span>200+ veículos</span>
                </div>
              </div>

              {/* Slider 2: Monthly KM per vehicle */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-300">KM Médio Rodado por Veículo / Mês</span>
                  <span className="text-[#A78BFA] text-sm font-bold font-mono">{calcMonthlyKm.toLocaleString('pt-BR')} km</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="200"
                  value={calcMonthlyKm}
                  onChange={(e) => setCalcMonthlyKm(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]"
                />
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>1.000 km</span>
                  <span>5.000 km</span>
                  <span>10.000 km</span>
                </div>
              </div>

              {/* Slider 3: Fuel Price */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-300">Preço Médio do Combustível (Diesel / Gasolina)</span>
                  <span className="text-emerald-400 text-sm font-bold font-mono">
                    {calcFuelPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} / L
                  </span>
                </div>
                <input
                  type="range"
                  min="4.00"
                  max="8.00"
                  step="0.10"
                  value={calcFuelPrice}
                  onChange={(e) => setCalcFuelPrice(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#10B981]"
                />
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>R$ 4,00</span>
                  <span>R$ 6,00</span>
                  <span>R$ 8,00</span>
                </div>
              </div>

              {/* Quick info tag */}
              <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-400 flex items-center gap-2">
                <Fuel className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Baseado em dados consolidados de telemetria: redução média de <strong>18% em consumo de combustível</strong> com redução de marcha lenta e aceleração brusca.
                </span>
              </div>
            </div>

            {/* Results Card */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#1C1C1E] to-[#141416] border border-[#8B5CF6]/30 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#8B5CF6]/10 blur-3xl rounded-full pointer-events-none" />

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">Economia Projetada</span>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight mt-1">
                  {estimatedAnnualFuelSavings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  <span className="text-xs font-normal text-zinc-400 block mt-0.5">por ano apenas em combustível</span>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-zinc-800 text-xs">
                <div className="flex justify-between py-1 border-b border-zinc-800/50">
                  <span className="text-zinc-400">Economia Mensal em Combustível:</span>
                  <span className="text-white font-bold font-mono">
                    {estimatedMonthlyFuelSavings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} / mês
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-zinc-800/50">
                  <span className="text-zinc-400">Economia Preditiva em Manutenções:</span>
                  <span className="text-emerald-300 font-bold font-mono">
                    + {estimatedAnnualMaintenanceSavings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} / ano
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-zinc-800/50">
                  <span className="text-zinc-400">Economia Anual Total Consolidada:</span>
                  <span className="text-emerald-400 font-black font-mono text-sm">
                    {totalAnnualSavings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-zinc-400">Retorno sobre Investimento (ROI):</span>
                  <span className="text-[#A78BFA] font-bold font-mono">
                    {estimatedROI}x o valor do plano
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="calc-activate-plan-btn"
                  onClick={() => handleSelectPlanToRegister('Pro')}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Contratar Plano Pro para {calcFleetSize} Veículos</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KEY CAPABILITIES & FEATURES (BENTO GRID) */}
      <section id="recursos" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30">
            <Cpu className="w-3.5 h-3.5" />
            Engenharia Automotiva de Ponta
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Tudo o que sua Operação Precisa para Rodar com Máxima Produtividade
          </h2>
          <p className="text-sm text-zinc-400">
            Tecnologia de hardware IoT integrada com software em nuvem de alta disponibilidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: CAN-Bus Telemetry */}
          <div className="p-6 rounded-3xl bg-[#1C1C1E] border border-zinc-800 hover:border-[#8B5CF6]/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#A78BFA]">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">Telemetria CAN-Bus em Tempo Real</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Leitura direta do barramento automotivo com telemetria de 5 em 5 segundos. Monitore RPM, aceleração, frenagem brusca, temperatura do motor e nível de bateria sem fios cortados.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#A78BFA] font-semibold">
              <Check className="w-4 h-4" /> Compatível com 99% dos veículos leves e pesados
            </div>
          </div>

          {/* Card 2: AI Predictive Copilot */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#1C1C1E] to-[#171719] border border-[#8B5CF6]/30 hover:border-[#8B5CF6]/60 transition-all space-y-4 shadow-lg shadow-[#8B5CF6]/10">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">Copilot IA de Diagnóstico Preditivo</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Algoritmo treinado com modelos automotivos que prevê quebras de alternador, injeção eletrônica e freios antes que o veículo fique inoperante na rodovia.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-amber-300 font-semibold">
              <Check className="w-4 h-4" /> Redução de 34% em manutenções corretivas
            </div>
          </div>

          {/* Card 3: Geofencing & Routing */}
          <div className="p-6 rounded-3xl bg-[#1C1C1E] border border-zinc-800 hover:border-[#8B5CF6]/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Gauge className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">Cercas Virtuais & Rotas Otimizadas</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Crie perímetros virtuais para clientes, filiais e postos autorizados. Receba notificações automáticas no WhatsApp e e-mail em caso de desvio de rota ou entrada em zonas de risco.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-blue-400 font-semibold">
              <Check className="w-4 h-4" /> Alertas em tempo real com mapa satélite
            </div>
          </div>

          {/* Card 4: Automated Financial & Billing */}
          <div className="p-6 rounded-3xl bg-[#1C1C1E] border border-zinc-800 hover:border-[#8B5CF6]/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">Faturamento Automatizado & Gestão de TCO</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Emissão de cobranças recorrentes via PIX, Boleto e Cartão de Crédito. Controle o custo total por quilômetro rodado (R$/km) de cada veículo da sua operação com relatórios fiscais.
            </p>
          </div>

          {/* Card 5: REST API & ERP Integration */}
          <div className="p-6 rounded-3xl bg-[#1C1C1E] border border-zinc-800 hover:border-[#8B5CF6]/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">API REST & Conectores ERP</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Conecte o MotorGrid diretamente com seus sistemas internos (SAP, TOTVS, Sankhya, Power BI). Webhooks em tempo real disparam eventos em milissegundos.
            </p>
          </div>

          {/* Card 6: Enterprise Security & Compliance */}
          <div className="p-6 rounded-3xl bg-[#1C1C1E] border border-zinc-800 hover:border-[#8B5CF6]/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">Segurança Bancária & LGPD</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Criptografia TLS 1.3 de ponta a ponta, autenticação em dois fatores (2FA), controle de acessos RBAC e armazenamento em nuvem com certificações ISO 27001 e SOC-2.
            </p>
          </div>
        </div>
      </section>

      {/* 5. PRICING PLANS SECTION */}
      <section id="planos" className="py-20 bg-[#0E0E11] border-y border-[#8B5CF6]/15 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30">
              <CreditCard className="w-3.5 h-3.5" />
              Planos Transparentes Sem Surpresas
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Escolha o Plano Perfeito para a sua Frota
            </h2>
            <p className="text-sm text-zinc-400">
              Todos os planos incluem 14 dias de teste grátis com suporte completo de ativação.
            </p>

            {/* Monthly vs Annual Toggle */}
            <div className="flex items-center justify-center gap-3 pt-3">
              <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-white' : 'text-zinc-400'}`}>
                Faturamento Mensal
              </span>
              <button
                id="billing-cycle-toggle-btn"
                onClick={() => setBillingCycle((prev) => (prev === 'monthly' ? 'annual' : 'monthly'))}
                className="w-14 h-7 rounded-full bg-zinc-800 p-1 relative border border-zinc-700 transition-colors cursor-pointer"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-[#8B5CF6] transition-transform shadow-md ${
                    billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-semibold ${billingCycle === 'annual' ? 'text-white' : 'text-zinc-400'}`}>
                  Faturamento Anual
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Economize 20%
                </span>
              </div>
            </div>
          </div>

          {/* Plans Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {pricingPlans.map((plan) => {
              const currentPrice = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;

              return (
                <div
                  key={plan.id}
                  className={`rounded-3xl p-7 flex flex-col justify-between transition-all relative ${
                    plan.popular
                      ? 'bg-gradient-to-b from-[#1C1C1E] to-[#161618] border-2 border-[#8B5CF6] shadow-2xl shadow-[#8B5CF6]/20'
                      : 'bg-[#1C1C1E] border border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white shadow-lg shadow-[#8B5CF6]/40 tracking-wide uppercase">
                      {plan.badge}
                    </div>
                  )}

                  <div className="space-y-5">
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">{plan.name}</h3>
                      <p className="text-xs text-zinc-400 mt-1 min-h-[32px]">{plan.tagline}</p>
                    </div>

                    {/* Price */}
                    <div className="pt-2 pb-4 border-b border-zinc-800">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-zinc-400 font-semibold">R$</span>
                        <span className="text-4xl font-black text-white tracking-tight">{currentPrice}</span>
                        <span className="text-xs text-zinc-400">/ veículo / mês</span>
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-1">
                        {billingCycle === 'annual'
                          ? `Faturado anualmente (R$ ${currentPrice * 12}/veículo/ano)`
                          : 'Faturamento mensal recorrente'}
                      </div>
                    </div>

                    {/* Plan features list */}
                    <div className="space-y-2.5 text-xs">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">O que está incluído:</p>
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-zinc-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}

                      {plan.missingFeatures.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-zinc-400 line-through">
                          <span className="w-4 h-4 flex items-center justify-center text-zinc-400 shrink-0 mt-0.5">•</span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Plan CTA Button */}
                  <div className="pt-6 mt-6 border-t border-zinc-800">
                    <button
                      id={`plan-btn-${plan.id.toLowerCase()}`}
                      onClick={() => handleSelectPlanToRegister(plan.id)}
                      className={`w-full py-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                        plan.popular
                          ? 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white shadow-[#8B5CF6]/30'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Contratar Plano {plan.name}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. CUSTOMER TESTIMONIALS */}
      <section id="depoimentos" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            Depoimentos Reais
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Quem Usa e Recomenda o MotorGrid
          </h2>
          <p className="text-sm text-zinc-400">
            Mais de 1.200 empresas e frotistas confiam sua operação na nossa tecnologia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#1C1C1E] border border-zinc-800 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed italic">
              "Reduzimos mais de R$ 42.000 por mês em diesel na nossa frota de 85 caminhões nos primeiros 90 dias com o MotorGrid. A leitura direta do CAN-Bus transformou a forma como nossos motoristas dirigem."
            </p>
            <div className="pt-2 flex items-center gap-3 border-t border-zinc-800">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                alt="Carlos Eduardo Silva"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-white">Carlos Eduardo Silva</h4>
                <p className="text-[11px] text-zinc-400">Diretor de Logística • TransPaulista Express</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#1C1C1E] border border-zinc-800 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed italic">
              "O Copilot IA evitou uma quebra catastrófica de motor em uma de nossas vans de entrega ao alertar sobre a elevação anormal da temperatura 2 dias antes da luz da injeção acender. Sensacional."
            </p>
            <div className="pt-2 flex items-center gap-3 border-t border-zinc-800">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                alt="Renata Vasconcelos"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-white">Renata Vasconcelos</h4>
                <p className="text-[11px] text-zinc-400">Gerente de Frotas • Rápido Brasil Entregas</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#1C1C1E] border border-zinc-800 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed italic">
              "Integrar a API do MotorGrid com nosso ERP SAP levou menos de 2 semanas. Hoje emitimos os relatórios de quilometragem e despesas para reembolso automaticamente."
            </p>
            <div className="pt-2 flex items-center gap-3 border-t border-zinc-800">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                alt="Rodrigo Fagundes"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-white">Rodrigo Fagundes</h4>
                <p className="text-[11px] text-zinc-400">CTO • Locaveículos Rent a Car</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section id="faq" className="py-20 bg-[#0E0E11] border-y border-[#8B5CF6]/15">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30">
              <HelpCircle className="w-3.5 h-3.5" />
              Dúvidas Frequentes
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Perguntas e Respostas sobre o MotorGrid
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;

              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#1C1C1E] border border-zinc-800 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer hover:bg-zinc-800/40"
                  >
                    <span className="text-sm font-bold text-white pr-4">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#A78BFA] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs text-zinc-300 leading-relaxed border-t border-zinc-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA BANNER */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/20 via-purple-900/10 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Pronto para Transformar a Eficiência da sua Frota?
          </h2>
          <p className="text-base text-zinc-300 max-w-xl mx-auto">
            Junte-se a centenas de empresas que reduziram custos com telemetria inteligente. Ativação imediata em 2 minutos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              id="final-cta-btn"
              onClick={() => handleSelectPlanToRegister('Pro')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white text-sm font-bold transition-all shadow-xl shadow-[#8B5CF6]/35 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Começar com o Plano Pro Telematics</span>
            </button>

            <button
              onClick={handleOpenLogin}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#1C1C1E] hover:bg-[#252528] border border-zinc-700 text-zinc-200 text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-zinc-400" />
              <span>Entrar em Conta Existente</span>
            </button>
          </div>
        </div>
      </section>

      {/* 9. SALES FOOTER */}
      <footer className="border-t border-zinc-800/80 bg-[#08080A] py-12 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <MotorGridLogo size="sm" />
            <span>© 2026 MotorGrid Automotive Technology Ltda. Todos os direitos reservados.</span>
          </div>

          <div className="flex items-center gap-6 text-zinc-400">
            <a href="#recursos" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#recursos" className="hover:text-white transition-colors">Privacidade & LGPD</a>
            <a href="#recursos" className="hover:text-white transition-colors">Segurança</a>
            <a href="#recursos" className="hover:text-white transition-colors">Suporte Técnico</a>
          </div>
        </div>
      </footer>

      {/* 10. INTEGRATED AUTH MODAL (LOGIN & REGISTER WITH PLAN CHECKOUT) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#1C1C1E] border border-[#8B5CF6]/30 shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            {/* Close Modal Button */}
            <button
              id="auth-modal-close-btn"
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              ✕
            </button>

            {/* Header & Mode Switcher */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <MotorGridLogo size="sm" />
                <span className="text-xs font-bold text-[#A78BFA] px-2 py-0.5 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30">
                  Acesso Conectado
                </span>
              </div>

              <div className="flex rounded-2xl bg-[#0A0A0B] p-1 border border-zinc-800">
                <button
                  id="modal-mode-register-btn"
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/25'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Criar Conta & Assinar Plano
                </button>

                <button
                  id="modal-mode-login-btn"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/25'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Já Tenho Conta (Entrar)
                </button>
              </div>
            </div>

            {/* FORM: REGISTER WITH PLAN SELECTION */}
            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                {/* Selected Plan Bar */}
                <div className="p-3.5 rounded-2xl bg-[#0A0A0B] border border-[#8B5CF6]/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Plano Selecionado:</span>
                    <span className="text-xs font-black text-emerald-400">14 Dias de Teste Grátis</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {(['Starter', 'Pro', 'Enterprise'] as PlanTier[]).map((plan) => (
                      <button
                        key={plan}
                        type="button"
                        onClick={() => setSelectedPlanForAuth(plan)}
                        className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all text-center cursor-pointer ${
                          selectedPlanForAuth === plan
                            ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#DDD6FE]'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {plan === 'Starter' ? 'Starter' : plan === 'Pro' ? 'Pro ⭐' : 'Enterprise'}
                      </button>
                    ))}
                  </div>
                </div>

                {regError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                    {regError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-300 font-semibold block mb-1">Nome Completo</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="Ex: Carlos Eduardo"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-[#8B5CF6]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-300 font-semibold block mb-1">E-mail Corporativo</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="carlos@empresa.com.br"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-[#8B5CF6]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-300 font-semibold block mb-1">Empresa / Nome da Frota</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="Ex: TransLog Transportes"
                        value={regCompany}
                        onChange={(e) => setRegCompany(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-[#8B5CF6]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-300 font-semibold block mb-1">Telefone / WhatsApp</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="+55 (11) 99876-5432"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-[#8B5CF6]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Criar Senha de Acesso</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      placeholder="Mínimo 6 caracteres"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-[#8B5CF6]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-200"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms-check"
                    checked={regTermsAccepted}
                    onChange={(e) => setRegTermsAccepted(e.target.checked)}
                    className="mt-0.5 rounded text-[#8B5CF6] focus:ring-[#8B5CF6] bg-zinc-800 border-zinc-700 cursor-pointer"
                  />
                  <label htmlFor="terms-check" className="text-[11px] text-zinc-400 leading-tight cursor-pointer">
                    Concordo com os Termos de Serviço, Política de Privacidade e Ativação do Teste Grátis de 14 dias.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReg}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white text-xs font-bold transition-all shadow-lg shadow-[#8B5CF6]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingReg ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Configurando seu Acesso ao Plano {selectedPlanForAuth}...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Ativar Conta com Plano {selectedPlanForAuth} (14 Dias Grátis)</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* FORM: LOGIN */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                {loginError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                    {loginError}
                  </div>
                )}

                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">E-mail Cadastrado</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-[#8B5CF6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Senha</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#0A0A0B] border border-zinc-700 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-[#8B5CF6]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-200"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingLogin}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white text-xs font-bold transition-all shadow-lg shadow-[#8B5CF6]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingLogin ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Autenticando sessão...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Entrar no MotorGrid</span>
                    </>
                  )}
                </button>

                {/* Fast One-Click Demo Logins */}
                <div className="pt-3 border-t border-zinc-800 space-y-2">
                  <span className="text-[11px] font-bold text-zinc-400 block">Acesso Rápido com Contas Demonstrativas:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {availableUsers.slice(0, 2).map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          setIsAuthModalOpen(false);
                          onLogin(user);
                        }}
                        className="flex items-center gap-2 p-2 rounded-xl bg-[#0A0A0B] hover:bg-zinc-800/80 border border-zinc-800 text-left transition-colors cursor-pointer"
                      >
                        <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-lg object-cover" />
                        <div className="truncate">
                          <div className="text-[11px] font-bold text-white truncate">{user.name}</div>
                          <div className="text-[10px] text-[#A78BFA] truncate">{user.role}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
