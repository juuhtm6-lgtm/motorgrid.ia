import React, { useState, useMemo } from 'react';
import {
  Users,
  UserCheck,
  Shield,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Edit3,
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  Building2,
  Store,
  Phone,
  Mail,
  Car,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lock,
  ChevronDown,
  X,
  Save,
  FileSpreadsheet,
  Activity,
  History,
} from 'lucide-react';
import {
  AuthUser,
  CanonicalRole,
  UserRole,
  UserPermissions,
  ThemeMode,
  CompanyTenant,
  TenantUnit,
  AuditLogEntry,
} from '../../types';
import { storageService } from '../../services/storageService';
import { getDefaultPermissions } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

interface EquipeViewProps {
  currentUser: AuthUser | null;
  theme?: ThemeMode;
}

export const EquipeView: React.FC<EquipeViewProps> = ({ currentUser, theme = 'dark' }) => {
  const toast = useToast();

  // Multi-tenant context
  const currentCompanyId = currentUser?.companyId || 'tenant-1';
  const isSuperAdmin = currentUser?.canonicalRole === 'platform_admin' || currentUser?.role === 'Administrador MotorGrid';

  // Company and users state
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    isSuperAdmin ? 'tenant-1' : currentCompanyId
  );

  const companies = useMemo(() => storageService.getCompanies(), []);
  const currentCompany = useMemo(() => {
    return companies.find((c) => c.id === selectedCompanyId) || companies[0];
  }, [companies, selectedCompanyId]);

  const [teamUsers, setTeamUsers] = useState<AuthUser[]>(() => {
    return storageService.getTeamUsers(selectedCompanyId);
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    return storageService.getAuditLogs(selectedCompanyId);
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [unitFilter, setUnitFilter] = useState<string>('todas');
  const [activeTabSub, setActiveTabSub] = useState<'usuarios' | 'auditoria'>('usuarios');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTargetUser, setSelectedTargetUser] = useState<AuthUser | null>(null);

  // New User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<CanonicalRole>('salesperson');
  const [newUnitId, setNewUnitId] = useState<string>(currentCompany?.units[0]?.id || 'unit-1');
  const [newStatus, setNewStatus] = useState<'Ativo' | 'Ausente' | 'Offline' | 'Bloqueado'>('Ativo');
  const [newAvatar, setNewAvatar] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  );

  // Edit User Form State
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState<CanonicalRole>('salesperson');
  const [editUnitId, setEditUnitId] = useState('');
  const [editStatus, setEditStatus] = useState<'Ativo' | 'Ausente' | 'Offline' | 'Bloqueado'>('Ativo');

  // Permissions Working State
  const [workingPermissions, setWorkingPermissions] = useState<UserPermissions | null>(null);

  // Refresh data helper
  const reloadData = (compId = selectedCompanyId) => {
    setTeamUsers(storageService.getTeamUsers(compId));
    setAuditLogs(storageService.getAuditLogs(compId));
  };

  const handleSwitchCompany = (newCompId: string) => {
    setSelectedCompanyId(newCompId);
    reloadData(newCompId);
  };

  // Top cards metrics
  const totalEquipe = teamUsers.filter((u) => u.status !== 'Bloqueado').length;
  const onlineAgora = teamUsers.filter((u) => u.status === 'Ativo').length;
  const supervisoresCount = teamUsers.filter(
    (u) => u.canonicalRole === 'supervisor' || u.role.toLowerCase().includes('supervisor')
  ).length;
  const sdrsCount = teamUsers.filter(
    (u) => u.canonicalRole === 'sdr' || u.role.toLowerCase().includes('sdr')
  ).length;
  const vendedoresCount = teamUsers.filter(
    (u) => u.canonicalRole === 'salesperson' || u.role.toLowerCase().includes('vendedor')
  ).length;

  // Filtered users
  const filteredUsers = useMemo(() => {
    return teamUsers.filter((u) => {
      // Search term
      const matchesSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.phone && u.phone.includes(searchTerm));

      // Role filter
      const matchesRole =
        roleFilter === 'todos' ||
        u.canonicalRole === roleFilter ||
        (roleFilter === 'manager' && (u.canonicalRole === 'manager' || u.role.includes('Gerente'))) ||
        (roleFilter === 'supervisor' && (u.canonicalRole === 'supervisor' || u.role.includes('Supervisor'))) ||
        (roleFilter === 'sdr' && (u.canonicalRole === 'sdr' || u.role.includes('SDR'))) ||
        (roleFilter === 'salesperson' && (u.canonicalRole === 'salesperson' || u.role.includes('Vendedor')));

      // Status filter
      const matchesStatus = statusFilter === 'todos' || u.status === statusFilter;

      // Unit filter
      const matchesUnit = unitFilter === 'todas' || u.unitId === unitFilter;

      return matchesSearch && matchesRole && matchesStatus && matchesUnit;
    });
  }, [teamUsers, searchTerm, roleFilter, statusFilter, unitFilter]);

  // Predefined avatars
  const predefinedAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  ];

  // Open Permissions Modal
  const handleOpenPermissions = (user: AuthUser) => {
    setSelectedTargetUser(user);
    const initialPerms = user.permissions || getDefaultPermissions(user.canonicalRole || 'salesperson');
    setWorkingPermissions(JSON.parse(JSON.stringify(initialPerms)));
    setIsPermissionsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (user: AuthUser) => {
    setSelectedTargetUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone || '');
    setEditRole(user.canonicalRole || 'salesperson');
    setEditUnitId(user.unitId || currentCompany?.units[0]?.id || 'unit-1');
    setEditStatus(user.status);
    setIsEditModalOpen(true);
  };

  // Open View Modal
  const handleOpenDetails = (user: AuthUser) => {
    setSelectedTargetUser(user);
    setIsDetailsModalOpen(true);
  };

  // Toggle user status (Activate / Deactivate)
  const handleToggleStatus = (user: AuthUser) => {
    const nextStatus: 'Ativo' | 'Bloqueado' = user.status === 'Bloqueado' ? 'Ativo' : 'Bloqueado';
    storageService.updateUser(user.id, { status: nextStatus }, currentUser || undefined);
    reloadData();
    toast.success(
      `Status de ${user.name} alterado para ${nextStatus === 'Ativo' ? 'Ativo' : 'Bloqueado'}.`
    );
  };

  // Save Permissions
  const handleSavePermissions = () => {
    if (!selectedTargetUser || !workingPermissions || !currentUser) return;

    const result = storageService.updateUserPermissions(
      selectedTargetUser.id,
      workingPermissions,
      currentUser
    );

    if (result.success) {
      toast.success(`Permissões de ${selectedTargetUser.name} salvas com sucesso!`);
      setIsPermissionsModalOpen(false);
      reloadData();
    } else {
      toast.error(result.error || 'Erro ao salvar permissões. Verifique as regras de herança.');
    }
  };

  // Submit Edit User
  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTargetUser) return;

    const unitObj = currentCompany?.units.find((u) => u.id === editUnitId);
    let displayRole: UserRole = 'Vendedor';
    if (editRole === 'manager') displayRole = 'Gerente';
    else if (editRole === 'supervisor') displayRole = 'Supervisor';
    else if (editRole === 'sdr') displayRole = 'SDR';
    else if (editRole === 'salesperson') displayRole = 'Vendedor';

    storageService.updateUser(
      selectedTargetUser.id,
      {
        name: editName,
        email: editEmail,
        phone: editPhone,
        canonicalRole: editRole,
        role: displayRole,
        unitId: editUnitId,
        unitName: unitObj?.name || selectedTargetUser.unitName,
        status: editStatus,
      },
      currentUser || undefined
    );

    toast.success(`Dados de ${editName} atualizados com sucesso!`);
    setIsEditModalOpen(false);
    reloadData();
  };

  // Submit Create User
  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      toast.error('Preencha os campos obrigatórios.');
      return;
    }

    const unitObj = currentCompany?.units.find((u) => u.id === newUnitId);
    let displayRole: UserRole = 'Vendedor';
    if (newRole === 'manager') displayRole = 'Gerente';
    else if (newRole === 'supervisor') displayRole = 'Supervisor';
    else if (newRole === 'sdr') displayRole = 'SDR';
    else if (newRole === 'salesperson') displayRole = 'Vendedor';

    const defaultPerms = getDefaultPermissions(newRole);

    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      role: displayRole,
      canonicalRole: newRole,
      team: displayRole === 'SDR' ? 'Pré-Atendimento' : 'Vendas Showroom',
      company: currentCompany?.name || 'Empresa Concessionária',
      companyId: selectedCompanyId,
      unitId: newUnitId,
      unitName: unitObj?.name || 'Showroom Matriz',
      avatar: newAvatar,
      plan: currentCompany?.plan || 'Enterprise',
      phone: newPhone,
      twoFactorEnabled: false,
      lastLogin: 'Nunca acessou',
      createdAt: new Date().toISOString().split('T')[0],
      status: newStatus,
      leadsCount: 0,
      attendancesCount: 0,
      salesCount: 0,
      salesMonth: 0,
      avgResponseTimeMin: 0,
      scoreAi: 90,
      permissions: defaultPerms,
    };

    const res = storageService.addUser(newUser, currentUser || undefined);

    if (res.success) {
      toast.success(`Usuário ${newUser.name} criado com sucesso no cargo ${displayRole}!`);
      setIsCreateModalOpen(false);
      setNewName('');
      setNewEmail('');
      setNewPhone('');
      reloadData();
    } else {
      toast.error(res.error || 'Erro ao criar usuário.');
    }
  };

  // Role display badge helper
  const renderRoleBadge = (roleStr: string, canonical?: CanonicalRole) => {
    if (canonical === 'platform_admin' || roleStr.includes('Administrador MotorGrid')) {
      return (
        <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[11px] font-bold flex items-center gap-1 w-fit">
          <Shield className="w-3 h-3 text-purple-400" />
          Admin MotorGrid
        </span>
      );
    }
    if (canonical === 'manager' || roleStr.includes('Gerente')) {
      return (
        <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[11px] font-bold flex items-center gap-1 w-fit">
          <Building2 className="w-3 h-3 text-indigo-400" />
          Gerente
        </span>
      );
    }
    if (canonical === 'supervisor' || roleStr.includes('Supervisor')) {
      return (
        <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-bold flex items-center gap-1 w-fit">
          <UserCheck className="w-3 h-3 text-blue-400" />
          Supervisor
        </span>
      );
    }
    if (canonical === 'sdr' || roleStr.includes('SDR')) {
      return (
        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1 w-fit">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          SDR
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1 w-fit">
        <TrendingUp className="w-3 h-3 text-amber-400" />
        Vendedor
      </span>
    );
  };

  // Status badge helper
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Ativo':
        return (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Ativo
          </span>
        );
      case 'Ausente':
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Ausente
          </span>
        );
      case 'Offline':
        return (
          <span className="px-2 py-0.5 rounded-full bg-zinc-500/20 text-zinc-300 border border-zinc-500/30 text-[10px] font-bold flex items-center gap-1 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            Offline
          </span>
        );
      case 'Bloqueado':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold flex items-center gap-1 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Bloqueado
          </span>
        );
    }
  };

  return (
    <div id="equipe-view-container" className="space-y-6 pb-12 font-['Inter',sans-serif]">
      {/* ======================================================== */}
      {/* 1. HEADER DA TELA */}
      {/* ======================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              GESTÃO DE EQUIPE
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30 text-[11px] font-bold">
              RBAC Multi-tenant
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Gerencie usuários, funções, acessos e desempenho da sua equipe comercial.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Super Admin Company Switcher */}
          {isSuperAdmin && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs">
              <Building2 className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span className="text-purple-300 font-semibold hidden sm:inline">Concessionária:</span>
              <select
                id="superadmin-company-select"
                value={selectedCompanyId}
                onChange={(e) => handleSwitchCompany(e.target.value)}
                className="bg-transparent text-white font-bold outline-none cursor-pointer"
              >
                {companies.map((comp) => (
                  <option key={comp.id} value={comp.id} className="bg-[#1C1C1E] text-white">
                    {comp.tradeName || comp.name} ({comp.id})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Subtabs (Usuários vs Auditoria) */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#1C1C1E] border border-slate-200 dark:border-zinc-800 text-xs">
            <button
              onClick={() => setActiveTabSub('usuarios')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTabSub === 'usuarios'
                  ? 'bg-[#8B5CF6] text-white shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Equipe Ativa</span>
            </button>
            <button
              onClick={() => setActiveTabSub('auditoria')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTabSub === 'auditoria'
                  ? 'bg-[#8B5CF6] text-white shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Logs de Auditoria ({auditLogs.length})</span>
            </button>
          </div>

          {/* Add User Button */}
          <button
            id="open-add-user-modal-btn"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs shadow-lg shadow-[#8B5CF6]/25 transition-all cursor-pointer active:scale-95"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Adicionar Usuário</span>
          </button>
        </div>
      </div>

      {/* Tenant Indicator Banner */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-[#161618] border border-slate-200 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6] font-bold">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{currentCompany?.tradeName || currentCompany?.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                CNPJ: {currentCompany?.cnpj}
              </span>
            </div>
            <div className="text-slate-500 dark:text-zinc-400 text-[11px] flex items-center gap-2 mt-0.5">
              <span>Plano: <strong className="text-[#8B5CF6]">{currentCompany?.plan}</strong></span>
              <span>•</span>
              <span>Licenças: <strong>{totalEquipe}</strong> de <strong>{currentCompany?.userLimit}</strong> ativas</span>
            </div>
          </div>
        </div>

        {/* Enabled Modules Badges for this company */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-zinc-400 mr-1">Módulos Contratados:</span>
          <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-mono">CRM</span>
          <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-mono">Leads</span>
          <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-mono">Atendimentos</span>
          {currentCompany?.enabledModules.estoque ? (
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
              Estoque ✓
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono">
              Estoque ✕
            </span>
          )}
          {currentCompany?.enabledModules.gridAi ? (
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono">
              Grid AI ✓
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono">
              Grid AI ✕
            </span>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. CARDS SUPERIORES DE STATUS DA EQUIPE */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* TOTAL DA EQUIPE */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#161618] border border-slate-200 dark:border-zinc-800/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total da Equipe</span>
            <div className="w-7 h-7 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {totalEquipe}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 flex items-center gap-1">
            <span>Usuários ativos na loja</span>
          </div>
        </div>

        {/* ONLINE AGORA */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#161618] border border-slate-200 dark:border-zinc-800/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Online Agora</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {onlineAgora}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Conectados no CRM</span>
          </div>
        </div>

        {/* SUPERVISORES */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#161618] border border-slate-200 dark:border-zinc-800/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Supervisores</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-400 font-mono">
            {supervisoresCount}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
            <span>Gestão de fila & SLA</span>
          </div>
        </div>

        {/* SDRs */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#161618] border border-slate-200 dark:border-zinc-800/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">SDRs</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-400 font-mono">
            {sdrsCount}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
            <span>Pré-vendas & triagem</span>
          </div>
        </div>

        {/* VENDEDORES */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#161618] border border-slate-200 dark:border-zinc-800/80 shadow-sm relative overflow-hidden col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Vendedores</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {vendedoresCount}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
            <span>Showroom & propostas</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. TABELA DA EQUIPE OU AUDITORIA */}
      {/* ======================================================== */}
      {activeTabSub === 'usuarios' ? (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#161618] border border-slate-200 dark:border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-sm">
            <div className="flex items-center gap-2 w-full md:w-80 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-zinc-800 focus-within:border-[#8B5CF6] transition-colors">
              <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
              <input
                id="search-team-input"
                type="text"
                placeholder="Buscar por nome, e-mail ou WhatsApp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-zinc-600"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-slate-400 dark:text-zinc-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Filter Cargo */}
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-zinc-800">
                <span className="text-slate-400 dark:text-zinc-500 font-medium">Cargo:</span>
                <select
                  id="filter-cargo-select"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-transparent text-slate-900 dark:text-white font-semibold outline-none cursor-pointer"
                >
                  <option value="todos" className="bg-[#1C1C1E] text-white">Todos os Cargos</option>
                  <option value="manager" className="bg-[#1C1C1E] text-white">Gerentes</option>
                  <option value="supervisor" className="bg-[#1C1C1E] text-white">Supervisores</option>
                  <option value="sdr" className="bg-[#1C1C1E] text-white">SDRs</option>
                  <option value="salesperson" className="bg-[#1C1C1E] text-white">Vendedores</option>
                </select>
              </div>

              {/* Filter Unidade */}
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-zinc-800">
                <span className="text-slate-400 dark:text-zinc-500 font-medium">Unidade:</span>
                <select
                  id="filter-unidade-select"
                  value={unitFilter}
                  onChange={(e) => setUnitFilter(e.target.value)}
                  className="bg-transparent text-slate-900 dark:text-white font-semibold outline-none cursor-pointer"
                >
                  <option value="todas" className="bg-[#1C1C1E] text-white">Todas as Lojas</option>
                  {currentCompany?.units.map((u) => (
                    <option key={u.id} value={u.id} className="bg-[#1C1C1E] text-white">
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Status */}
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-zinc-800">
                <span className="text-slate-400 dark:text-zinc-500 font-medium">Status:</span>
                <select
                  id="filter-status-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-slate-900 dark:text-white font-semibold outline-none cursor-pointer"
                >
                  <option value="todos" className="bg-[#1C1C1E] text-white">Todos</option>
                  <option value="Ativo" className="bg-[#1C1C1E] text-white">Ativo</option>
                  <option value="Ausente" className="bg-[#1C1C1E] text-white">Ausente</option>
                  <option value="Offline" className="bg-[#1C1C1E] text-white">Offline</option>
                  <option value="Bloqueado" className="bg-[#1C1C1E] text-white">Bloqueado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="rounded-2xl bg-white dark:bg-[#161618] border border-slate-200 dark:border-zinc-800/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table id="team-members-table" className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-[#0E0E10] text-slate-500 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">USUÁRIO</th>
                    <th className="py-3.5 px-4">CARGO</th>
                    <th className="py-3.5 px-4">UNIDADE</th>
                    <th className="py-3.5 px-4">STATUS</th>
                    <th className="py-3.5 px-4 text-center">LEADS</th>
                    <th className="py-3.5 px-4 text-center">ATENDIMENTOS</th>
                    <th className="py-3.5 px-4 text-center">VENDAS</th>
                    <th className="py-3.5 px-4">ÚLTIMO ACESSO</th>
                    <th className="py-3.5 px-4 text-right">AÇÕES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-500 dark:text-zinc-400">
                        Nenhum colaborador encontrado com os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const isCurrentUserRow = user.id === currentUser?.id;
                      return (
                        <tr
                          key={user.id}
                          className={`hover:bg-slate-50 dark:hover:bg-[#1C1C1F] transition-colors ${
                            user.status === 'Bloqueado' ? 'opacity-60 bg-rose-500/[0.02]' : ''
                          }`}
                        >
                          {/* 1. USUÁRIO */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                                alt={user.name}
                                className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-zinc-700 shrink-0"
                              />
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                  <span>{user.name}</span>
                                  {isCurrentUserRow && (
                                    <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold">
                                      Você
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-2">
                                  <span>{user.email}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 2. CARGO */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {renderRoleBadge(user.role, user.canonicalRole)}
                          </td>

                          {/* 3. UNIDADE */}
                          <td className="py-3.5 px-4 text-slate-700 dark:text-zinc-300 whitespace-nowrap">
                            <span className="truncate max-w-[140px] block" title={user.unitName || 'Matriz'}>
                              {user.unitName || 'Showroom Matriz'}
                            </span>
                          </td>

                          {/* 4. STATUS */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {renderStatusBadge(user.status)}
                          </td>

                          {/* 5. LEADS */}
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800 dark:text-zinc-200">
                            {user.leadsCount || 0}
                          </td>

                          {/* 6. ATENDIMENTOS */}
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800 dark:text-zinc-200">
                            {user.attendancesCount || 0}
                          </td>

                          {/* 7. VENDAS */}
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {user.salesCount || 0}
                          </td>

                          {/* 8. ÚLTIMO ACESSO */}
                          <td className="py-3.5 px-4 text-slate-500 dark:text-zinc-400 text-[11px] whitespace-nowrap">
                            {user.lastLogin || 'Recentemente'}
                          </td>

                          {/* 9. AÇÕES */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1">
                              {/* Visualizar */}
                              <button
                                onClick={() => handleOpenDetails(user)}
                                title="Visualizar ficha completa"
                                className="p-1.5 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Editar */}
                              <button
                                onClick={() => handleOpenEdit(user)}
                                title="Editar dados cadastrais"
                                className="p-1.5 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              {/* Permissões RBAC */}
                              <button
                                onClick={() => handleOpenPermissions(user)}
                                title="Gerenciar permissões granulares"
                                className="p-1.5 rounded-lg text-[#8B5CF6] hover:bg-[#8B5CF6]/15 transition-colors cursor-pointer"
                              >
                                <KeyRound className="w-3.5 h-3.5" />
                              </button>

                              {/* Desativar / Ativar */}
                              <button
                                onClick={() => handleToggleStatus(user)}
                                title={user.status === 'Bloqueado' ? 'Reativar Usuário' : 'Bloquear / Desativar Usuário'}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  user.status === 'Bloqueado'
                                    ? 'text-emerald-400 hover:bg-emerald-500/20'
                                    : 'text-rose-400 hover:bg-rose-500/20'
                                }`}
                              >
                                {user.status === 'Bloqueado' ? (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5" />
                                )}
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
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* LOGS DE AUDITORIA OPERACIONAL */
        /* ======================================================== */
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#161618] border border-slate-200 dark:border-zinc-800/80 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Registro de Auditoria Operacional & Segurança
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Rastreabilidade de todas as ações sensíveis realizadas na empresa {currentCompany?.name}.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-mono font-bold">
              Imutabilidade Ativa
            </span>
          </div>

          <div className="rounded-2xl bg-white dark:bg-[#161618] border border-slate-200 dark:border-zinc-800/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-[#0E0E10] text-slate-500 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">DATA & HORA</th>
                    <th className="py-3 px-4">USUÁRIO RESPONSÁVEL</th>
                    <th className="py-3 px-4">CARGO</th>
                    <th className="py-3 px-4">MÓDULO</th>
                    <th className="py-3 px-4">AÇÃO EXECUTADA</th>
                    <th className="py-3 px-4">REGISTRO AFETADO</th>
                    <th className="py-3 px-4">RESULTADO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-[#1C1C1F]">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 dark:text-zinc-400 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {log.userName}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-mono">
                          {log.userRole}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-zinc-300 whitespace-nowrap">
                        {log.module}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                        {log.action}
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-zinc-400 font-mono text-[11px] max-w-xs truncate">
                        {log.targetRecord}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {log.result === 'Sucesso' ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                            ✓ Sucesso
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                            ✕ Bloqueado
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MODAL: CRIAR NOVO USUÁRIO */}
      {/* ======================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="fixed inset-0 -z-10" onClick={() => setIsCreateModalOpen(false)} />
          <div
            id="modal-add-user-container"
            className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-150 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6]">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                    Adicionar Novo Usuário à Concessionária
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    Defina função e permissões corporativas para o colaborador
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 dark:text-zinc-400 hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-zinc-300 font-semibold block mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Gabriel Toledo"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white outline-none focus:border-[#8B5CF6]"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-zinc-300 font-semibold block mb-1">
                    E-mail Corporativo *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="gabriel@concessionaria.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white outline-none focus:border-[#8B5CF6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-zinc-300 font-semibold block mb-1">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="+55 (11) 98888-7777"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                <div>
                  <label className="text-slate-700 dark:text-zinc-300 font-semibold block mb-1">
                    Cargo Operacional *
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as CanonicalRole)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white outline-none focus:border-[#8B5CF6] font-semibold"
                  >
                    {isSuperAdmin && <option value="manager">Gerente da Concessionária</option>}
                    <option value="supervisor">Supervisor de Equipe</option>
                    <option value="sdr">SDR / Pré-vendas</option>
                    <option value="salesperson">Vendedor Showroom</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-zinc-300 font-semibold block mb-1">
                    Empresa / Concessionária
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentCompany?.tradeName || currentCompany?.name}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#121214] border border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 cursor-not-allowed font-medium"
                  />
                </div>

                <div>
                  <label className="text-slate-700 dark:text-zinc-300 font-semibold block mb-1">
                    Unidade / Showroom
                  </label>
                  <select
                    value={newUnitId}
                    onChange={(e) => setNewUnitId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white outline-none focus:border-[#8B5CF6]"
                  >
                    {currentCompany?.units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Avatar Selection */}
              <div>
                <label className="text-slate-700 dark:text-zinc-300 font-semibold block mb-1.5">
                  Foto de Perfil
                </label>
                <div className="flex items-center gap-2">
                  {predefinedAvatars.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewAvatar(av)}
                      className={`rounded-xl p-0.5 transition-all cursor-pointer ${
                        newAvatar === av ? 'ring-2 ring-[#8B5CF6] scale-105' : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt="Avatar" className="w-8 h-8 rounded-lg object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold shadow-md shadow-[#8B5CF6]/20 transition-all cursor-pointer"
                >
                  Salvar & Criar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. MODAL: EDITAR DADOS DO USUÁRIO */}
      {/* ======================================================== */}
      {isEditModalOpen && selectedTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="fixed inset-0 -z-10" onClick={() => setIsEditModalOpen(false)} />
          <div
            id="modal-edit-user-container"
            className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-150 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                    Editar Usuário — {selectedTargetUser.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    Altere função, unidade ou status operacional
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 dark:text-zinc-400 hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-zinc-300 font-semibold block mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white outline-none focus:border-[#8B5CF6]"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-zinc-300 font-semibold block mb-1">
                    E-mail Corporativo *
                  </label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white outline-none focus:border-[#8B5CF6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-zinc-300 font-semibold block mb-1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white outline-none focus:border-[#8B5CF6]"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-zinc-300 font-semibold block mb-1">
                    Cargo Operacional
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as CanonicalRole)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white outline-none focus:border-[#8B5CF6] font-semibold"
                  >
                    {isSuperAdmin && <option value="manager">Gerente da Concessionária</option>}
                    <option value="supervisor">Supervisor de Equipe</option>
                    <option value="sdr">SDR / Pré-vendas</option>
                    <option value="salesperson">Vendedor Showroom</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-zinc-300 font-semibold block mb-1">
                    Unidade
                  </label>
                  <select
                    value={editUnitId}
                    onChange={(e) => setEditUnitId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white outline-none focus:border-[#8B5CF6]"
                  >
                    {currentCompany?.units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 dark:text-zinc-300 font-semibold block mb-1">
                    Status Operacional
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white outline-none focus:border-[#8B5CF6]"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Ausente">Ausente</option>
                    <option value="Offline">Offline</option>
                    <option value="Bloqueado">Bloqueado</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold shadow-md shadow-[#8B5CF6]/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. MODAL: GERENCIAR PERMISSÕES GRANULARES (RBAC) */}
      {/* ======================================================== */}
      {isPermissionsModalOpen && selectedTargetUser && workingPermissions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="fixed inset-0 -z-10" onClick={() => setIsPermissionsModalOpen(false)} />
          <div
            id="modal-permissions-container"
            className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#18181B] border border-slate-200 dark:border-zinc-800 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150 text-xs max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3.5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                      Permissões de Acesso — {selectedTargetUser.name}
                    </h3>
                    {renderRoleBadge(selectedTargetUser.role, selectedTargetUser.canonicalRole)}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    Controle granular por módulo com herança restrita do plano e concedente.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPermissionsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 dark:text-zinc-400 hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Inheritance Rules Warning Banner */}
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-200 text-[11px] space-y-1 shrink-0">
              <div className="font-bold flex items-center gap-1.5 text-purple-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Regra de Herança MotorGrid:</span>
              </div>
              <p className="opacity-90">
                Permissão do Usuário ≤ Permissão do Gerente ≤ Permissão da Empresa ≤ Módulos contratados. Nenhum usuário pode receber permissão superior à concedida ao seu gestor ou além do plano da concessionária.
              </p>
            </div>

            {/* Scrollable Categories of Switches */}
            <div className="space-y-4 overflow-y-auto pr-1">
              {/* 1. CRM */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#121214] border border-slate-200 dark:border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800/50 pb-2">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    CRM Automotivo
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Módulo Ativo</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={workingPermissions.crm.view}
                      onChange={(e) =>
                        setWorkingPermissions({
                          ...workingPermissions,
                          crm: { ...workingPermissions.crm, view: e.target.checked },
                        })
                      }
                      className="rounded accent-[#8B5CF6]"
                    />
                    <span className="text-slate-700 dark:text-zinc-300">Visualizar</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={workingPermissions.crm.create}
                      onChange={(e) =>
                        setWorkingPermissions({
                          ...workingPermissions,
                          crm: { ...workingPermissions.crm, create: e.target.checked },
                        })
                      }
                      className="rounded accent-[#8B5CF6]"
                    />
                    <span className="text-slate-700 dark:text-zinc-300">Criar</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={workingPermissions.crm.edit}
                      onChange={(e) =>
                        setWorkingPermissions({
                          ...workingPermissions,
                          crm: { ...workingPermissions.crm, edit: e.target.checked },
                        })
                      }
                      className="rounded accent-[#8B5CF6]"
                    />
                    <span className="text-slate-700 dark:text-zinc-300">Editar</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={workingPermissions.crm.delete}
                      onChange={(e) =>
                        setWorkingPermissions({
                          ...workingPermissions,
                          crm: { ...workingPermissions.crm, delete: e.target.checked },
                        })
                      }
                      className="rounded accent-[#8B5CF6]"
                    />
                    <span className="text-slate-700 dark:text-zinc-300">Excluir</span>
                  </label>
                </div>
              </div>

              {/* 2. LEADS */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#121214] border border-slate-200 dark:border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800/50 pb-2">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    Leads & Oportunidades
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Carteira</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={workingPermissions.leads.viewOwn}
                      onChange={(e) =>
                        setWorkingPermissions({
                          ...workingPermissions,
                          leads: { ...workingPermissions.leads, viewOwn: e.target.checked },
                        })
                      }
                      className="rounded accent-[#8B5CF6]"
                    />
                    <span className="text-slate-700 dark:text-zinc-300">Visualizar Próprios</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={workingPermissions.leads.viewAll}
                      onChange={(e) =>
                        setWorkingPermissions({
                          ...workingPermissions,
                          leads: { ...workingPermissions.leads, viewAll: e.target.checked },
                        })
                      }
                      className="rounded accent-[#8B5CF6]"
                    />
                    <span className="text-slate-700 dark:text-zinc-300">Visualizar Todos da Loja</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={workingPermissions.leads.edit}
                      onChange={(e) =>
                        setWorkingPermissions({
                          ...workingPermissions,
                          leads: { ...workingPermissions.leads, edit: e.target.checked },
                        })
                      }
                      className="rounded accent-[#8B5CF6]"
                    />
                    <span className="text-slate-700 dark:text-zinc-300">Editar</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={workingPermissions.leads.transfer}
                      onChange={(e) =>
                        setWorkingPermissions({
                          ...workingPermissions,
                          leads: { ...workingPermissions.leads, transfer: e.target.checked },
                        })
                      }
                      className="rounded accent-[#8B5CF6]"
                    />
                    <span className="text-slate-700 dark:text-zinc-300">Transferir Lead</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={workingPermissions.leads.delete}
                      onChange={(e) =>
                        setWorkingPermissions({
                          ...workingPermissions,
                          leads: { ...workingPermissions.leads, delete: e.target.checked },
                        })
                      }
                      className="rounded accent-[#8B5CF6]"
                    />
                    <span className="text-slate-700 dark:text-zinc-300">Excluir Lead</span>
                  </label>
                </div>
              </div>

              {/* 3. ATENDIMENTOS & PIPELINE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#121214] border border-slate-200 dark:border-zinc-800/80 space-y-3">
                  <span className="font-bold text-slate-900 dark:text-white block border-b border-slate-200 dark:border-zinc-800/50 pb-2">
                    Central de Atendimento
                  </span>
                  <div className="space-y-2 text-[11px]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={workingPermissions.atendimentos.view}
                        onChange={(e) =>
                          setWorkingPermissions({
                            ...workingPermissions,
                            atendimentos: { ...workingPermissions.atendimentos, view: e.target.checked },
                          })
                        }
                        className="rounded accent-[#8B5CF6]"
                      />
                      <span className="text-slate-700 dark:text-zinc-300">Visualizar Conversas</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={workingPermissions.atendimentos.reply}
                        onChange={(e) =>
                          setWorkingPermissions({
                            ...workingPermissions,
                            atendimentos: { ...workingPermissions.atendimentos, reply: e.target.checked },
                          })
                        }
                        className="rounded accent-[#8B5CF6]"
                      />
                      <span className="text-slate-700 dark:text-zinc-300">Responder WhatsApp</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={workingPermissions.atendimentos.transfer}
                        onChange={(e) =>
                          setWorkingPermissions({
                            ...workingPermissions,
                            atendimentos: { ...workingPermissions.atendimentos, transfer: e.target.checked },
                          })
                        }
                        className="rounded accent-[#8B5CF6]"
                      />
                      <span className="text-slate-700 dark:text-zinc-300">Transferir Atendimento</span>
                    </label>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#121214] border border-slate-200 dark:border-zinc-800/80 space-y-3">
                  <span className="font-bold text-slate-900 dark:text-white block border-b border-slate-200 dark:border-zinc-800/50 pb-2">
                    Pipeline & Funil
                  </span>
                  <div className="space-y-2 text-[11px]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={workingPermissions.pipeline.view}
                        onChange={(e) =>
                          setWorkingPermissions({
                            ...workingPermissions,
                            pipeline: { ...workingPermissions.pipeline, view: e.target.checked },
                          })
                        }
                        className="rounded accent-[#8B5CF6]"
                      />
                      <span className="text-slate-700 dark:text-zinc-300">Visualizar Pipeline</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={workingPermissions.pipeline.move}
                        onChange={(e) =>
                          setWorkingPermissions({
                            ...workingPermissions,
                            pipeline: { ...workingPermissions.pipeline, move: e.target.checked },
                          })
                        }
                        className="rounded accent-[#8B5CF6]"
                      />
                      <span className="text-slate-700 dark:text-zinc-300">Movimentar Etapas</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 4. RELATÓRIOS & EQUIPE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#121214] border border-slate-200 dark:border-zinc-800/80 space-y-3">
                  <span className="font-bold text-slate-900 dark:text-white block border-b border-slate-200 dark:border-zinc-800/50 pb-2">
                    Relatórios Comerciais
                  </span>
                  <div className="space-y-2 text-[11px]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={workingPermissions.relatorios.viewOwn}
                        onChange={(e) =>
                          setWorkingPermissions({
                            ...workingPermissions,
                            relatorios: { ...workingPermissions.relatorios, viewOwn: e.target.checked },
                          })
                        }
                        className="rounded accent-[#8B5CF6]"
                      />
                      <span className="text-slate-700 dark:text-zinc-300">Ver Próprios Resultados</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={workingPermissions.relatorios.viewTeam}
                        onChange={(e) =>
                          setWorkingPermissions({
                            ...workingPermissions,
                            relatorios: { ...workingPermissions.relatorios, viewTeam: e.target.checked },
                          })
                        }
                        className="rounded accent-[#8B5CF6]"
                      />
                      <span className="text-slate-700 dark:text-zinc-300">Ver Equipe Completa</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={workingPermissions.relatorios.export}
                        onChange={(e) =>
                          setWorkingPermissions({
                            ...workingPermissions,
                            relatorios: { ...workingPermissions.relatorios, export: e.target.checked },
                          })
                        }
                        className="rounded accent-[#8B5CF6]"
                      />
                      <span className="text-slate-700 dark:text-zinc-300">Exportar Relatórios</span>
                    </label>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#121214] border border-slate-200 dark:border-zinc-800/80 space-y-3">
                  <span className="font-bold text-slate-900 dark:text-white block border-b border-slate-200 dark:border-zinc-800/50 pb-2">
                    Gestão de Equipe
                  </span>
                  <div className="space-y-2 text-[11px]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={workingPermissions.equipe.createUser}
                        onChange={(e) =>
                          setWorkingPermissions({
                            ...workingPermissions,
                            equipe: { ...workingPermissions.equipe, createUser: e.target.checked },
                          })
                        }
                        className="rounded accent-[#8B5CF6]"
                      />
                      <span className="text-slate-700 dark:text-zinc-300">Criar Usuário</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={workingPermissions.equipe.editUser}
                        onChange={(e) =>
                          setWorkingPermissions({
                            ...workingPermissions,
                            equipe: { ...workingPermissions.equipe, editUser: e.target.checked },
                          })
                        }
                        className="rounded accent-[#8B5CF6]"
                      />
                      <span className="text-slate-700 dark:text-zinc-300">Editar Usuário</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={workingPermissions.equipe.changePermissions}
                        onChange={(e) =>
                          setWorkingPermissions({
                            ...workingPermissions,
                            equipe: { ...workingPermissions.equipe, changePermissions: e.target.checked },
                          })
                        }
                        className="rounded accent-[#8B5CF6]"
                      />
                      <span className="text-slate-700 dark:text-zinc-300">Alterar Permissões</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 5. MÓDULOS ESPECIAIS (ESTOQUE, GRID AI, CONFIGURAÇÕES) */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#121214] border border-slate-200 dark:border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800/50 pb-2">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Módulos Extras & Inteligência Artificial
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Herança do Plano</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                  {/* Estoque */}
                  <div
                    className={`p-3 rounded-xl border ${
                      currentCompany?.enabledModules.estoque
                        ? 'bg-slate-100 dark:bg-zinc-800/40 border-slate-200 dark:border-zinc-700'
                        : 'bg-rose-500/5 border-rose-500/20 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1">
                        <Car className="w-3.5 h-3.5 text-[#8B5CF6]" />
                        Estoque
                      </span>
                      {!currentCompany?.enabledModules.estoque && (
                        <span className="text-[9px] text-rose-400 font-bold">Bloqueado no Plano</span>
                      )}
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        disabled={!currentCompany?.enabledModules.estoque}
                        checked={workingPermissions.estoque.view && currentCompany?.enabledModules.estoque}
                        onChange={(e) =>
                          setWorkingPermissions({
                            ...workingPermissions,
                            estoque: { ...workingPermissions.estoque, view: e.target.checked },
                          })
                        }
                        className="rounded accent-[#8B5CF6]"
                      />
                      <span className="text-slate-700 dark:text-zinc-300">Visualizar Veículos</span>
                    </label>
                  </div>

                  {/* Grid AI */}
                  <div
                    className={`p-3 rounded-xl border ${
                      currentCompany?.enabledModules.gridAi
                        ? 'bg-slate-100 dark:bg-zinc-800/40 border-slate-200 dark:border-zinc-700'
                        : 'bg-rose-500/5 border-rose-500/20 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        Grid AI Copilot
                      </span>
                      {!currentCompany?.enabledModules.gridAi && (
                        <span className="text-[9px] text-rose-400 font-bold">Bloqueado no Plano</span>
                      )}
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        disabled={!currentCompany?.enabledModules.gridAi}
                        checked={workingPermissions.gridAi.useAi && currentCompany?.enabledModules.gridAi}
                        onChange={(e) =>
                          setWorkingPermissions({
                            ...workingPermissions,
                            gridAi: { ...workingPermissions.gridAi, useAi: e.target.checked },
                          })
                        }
                        className="rounded accent-[#8B5CF6]"
                      />
                      <span className="text-slate-700 dark:text-zinc-300">Utilizar Copilot IA</span>
                    </label>
                  </div>

                  {/* Configurações */}
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-700">
                    <span className="font-bold text-slate-800 dark:text-zinc-200 block mb-2">
                      Configurações
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={workingPermissions.configuracoes.view}
                        onChange={(e) =>
                          setWorkingPermissions({
                            ...workingPermissions,
                            configuracoes: { ...workingPermissions.configuracoes, view: e.target.checked },
                          })
                        }
                        className="rounded accent-[#8B5CF6]"
                      />
                      <span className="text-slate-700 dark:text-zinc-300">Acessar Ajustes</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-end gap-2.5 shrink-0">
              <button
                onClick={() => setIsPermissionsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-semibold hover:bg-slate-200 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePermissions}
                className="px-5 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold shadow-md shadow-[#8B5CF6]/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Aplicar Permissões</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. MODAL: DETALHES DO USUÁRIO */}
      {/* ======================================================== */}
      {isDetailsModalOpen && selectedTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="fixed inset-0 -z-10" onClick={() => setIsDetailsModalOpen(false)} />
          <div
            id="modal-details-user-container"
            className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-150 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3.5">
              <div className="flex items-center gap-3">
                <img
                  src={selectedTargetUser.avatar}
                  alt={selectedTargetUser.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#8B5CF6]"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedTargetUser.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    {selectedTargetUser.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 dark:text-zinc-400 hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Performance Cards */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#101012] border border-slate-200 dark:border-zinc-800 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Leads Atribuídos</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                  {selectedTargetUser.leadsCount || 0}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#101012] border border-slate-200 dark:border-zinc-800 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Atendimentos</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                  {selectedTargetUser.attendancesCount || 0}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#101012] border border-slate-200 dark:border-zinc-800 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Carros Vendidos</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">
                  {selectedTargetUser.salesCount || 0}
                </span>
              </div>
            </div>

            {/* Details List */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#101012] border border-slate-200 dark:border-zinc-800">
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-zinc-800/60">
                <span className="text-slate-500 dark:text-zinc-400">Cargo:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedTargetUser.role}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-zinc-800/60">
                <span className="text-slate-500 dark:text-zinc-400">Unidade:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedTargetUser.unitName || 'Matriz'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-zinc-800/60">
                <span className="text-slate-500 dark:text-zinc-400">Telefone:</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{selectedTargetUser.phone || 'Não informado'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-zinc-800/60">
                <span className="text-slate-500 dark:text-zinc-400">Status:</span>
                <span>{renderStatusBadge(selectedTargetUser.status)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 dark:text-zinc-400">Último Login:</span>
                <span className="font-medium text-slate-700 dark:text-zinc-300">{selectedTargetUser.lastLogin}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  handleOpenPermissions(selectedTargetUser);
                }}
                className="px-4 py-2 rounded-xl bg-[#8B5CF6]/15 hover:bg-[#8B5CF6]/25 text-[#8B5CF6] font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Editar Permissões</span>
              </button>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-semibold hover:bg-slate-200 cursor-pointer"
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
