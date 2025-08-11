export enum Roles {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
}

export enum Permissions {
  TRANSACTION_VIEW = 'transaction:view',
  TRANSACTION_CREATE = 'transaction:create',
  TRANSACTION_UPDATE = 'transaction:update',
  TRANSACTION_DELETE = 'transaction:delete',

  WORKSPACE_INVITE = 'workspace:invite',
  WORKSPACE_UPDATE_ROLE = 'workspace:update_role',
}

export const RolePermissions: Record<Roles, Permissions[]> = {
  [Roles.OWNER]: [
    Permissions.TRANSACTION_VIEW,
    Permissions.TRANSACTION_CREATE,
    Permissions.TRANSACTION_UPDATE,
    Permissions.TRANSACTION_DELETE,
    Permissions.WORKSPACE_INVITE,
    Permissions.WORKSPACE_UPDATE_ROLE,
  ],
  [Roles.ADMIN]: [
    Permissions.TRANSACTION_VIEW,
    Permissions.TRANSACTION_CREATE,
    Permissions.TRANSACTION_UPDATE,
    Permissions.TRANSACTION_DELETE,
    Permissions.WORKSPACE_INVITE,
  ],
  [Roles.MEMBER]: [
    Permissions.TRANSACTION_VIEW,
    Permissions.TRANSACTION_CREATE,
    Permissions.TRANSACTION_UPDATE,
  ],
  [Roles.VIEWER]: [Permissions.TRANSACTION_VIEW],
}
