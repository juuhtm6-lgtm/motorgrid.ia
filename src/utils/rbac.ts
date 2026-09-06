import { AuthUser, UserPermissions, CanonicalRole, ActiveTab, CompanyTenant } from '../types';
import { getDefaultPermissions } from '../data/mockData';

/**
 * Checks if a user has a specific granular permission.
 * Examples of permissionKey:
 * - 'crm.view'
 * - 'crm.edit'
 * - 'crm.delete'
 * - 'leads.viewAll'
 * - 'leads.delete'
 * - 'relatorios.export'
 * - 'equipe.createUser'
 * - 'equipe.changePermissions'
 * - 'estoque.view'
 * - 'gridAi.useAi'
 */
export function canAccess(user: AuthUser | null, permissionKey: string): boolean {
  if (!user) return false;

  // Platform admin has universal clearance
  if (user.canonicalRole === 'platform_admin' || user.role === 'Administrador MotorGrid') {
    return true;
  }

  // Blocked users have zero permissions
  if (user.status === 'Bloqueado') {
    return false;
  }

  const permissions: UserPermissions =
    user.permissions || getDefaultPermissions(user.canonicalRole || 'salesperson');

  const [category, action] = permissionKey.split('.');
  if (!category || !action) return false;

  const categoryPerms = (permissions as any)[category];
  if (!categoryPerms) return false;

  return Boolean(categoryPerms[action]);
}

/**
 * Checks if a user has permission to navigate to an ActiveTab.
 */
export function canAccessTab(
  user: AuthUser | null,
  tab: ActiveTab,
  company?: CompanyTenant
): boolean {
  if (!user) return false;

  // Platform admin can access everything
  if (user.canonicalRole === 'platform_admin' || user.role === 'Administrador MotorGrid') {
    return true;
  }

  // Check company enabled modules first
  if (company) {
    if (tab === 'estoque' && !company.enabledModules.estoque) return false;
    if (tab === 'ai-copilot' && !company.enabledModules.gridAi) return false;
    if (tab === 'relatorios' && !company.enabledModules.relatorios) return false;
    if (tab === 'meta-ads' && !company.enabledModules.metaAds) return false;
    if (tab === 'campanhas' && !company.enabledModules.metaAds) return false;
    if (tab === 'equipe' && !company.enabledModules.equipe) return false;
  }

  const role = user.canonicalRole || 'salesperson';

  switch (tab) {
    case 'dashboard':
      return true; // All authenticated users have their tailored dashboard

    case 'leads':
      return canAccess(user, 'crm.view') || canAccess(user, 'leads.viewOwn');

    case 'atendimento':
      return canAccess(user, 'atendimentos.view');

    case 'pipeline':
      return canAccess(user, 'pipeline.view');

    case 'estoque':
      return canAccess(user, 'estoque.view');

    case 'equipe':
      // Manager, Supervisor or anyone with team view/create permission
      return (
        role === 'manager' ||
        role === 'supervisor' ||
        canAccess(user, 'equipe.createUser') ||
        canAccess(user, 'equipe.editUser')
      );

    case 'ai-copilot':
      return canAccess(user, 'gridAi.useAi');

    case 'relatorios':
    case 'relatorio-leads':
    case 'conversoes':
    case 'funil-comercial':
      return canAccess(user, 'relatorios.viewOwn') || canAccess(user, 'relatorios.viewTeam');

    case 'automacao':
    case 'campanhas':
    case 'anuncios':
    case 'meta-ads':
      return role === 'manager' || role === 'supervisor';

    case 'administracao':
    case 'settings':
    case 'ajustes':
      return canAccess(user, 'configuracoes.view');

    case 'billing':
      return role === 'manager';

    default:
      return true;
  }
}
