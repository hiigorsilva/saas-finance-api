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

  WORKSPACE_INVITE_MEMBER = 'workspace:invite_member',
  WORKSPACE_UPDATE_MEMBER_ROLE = 'workspace:update_member_role',
  WORKSPACE_DELETE_MEMBER = 'workspace:delete_member',
}

export const RolePermissions: Record<Roles, Permissions[]> = {
  [Roles.OWNER]: [
    Permissions.TRANSACTION_VIEW,
    Permissions.TRANSACTION_CREATE,
    Permissions.TRANSACTION_UPDATE,
    Permissions.TRANSACTION_DELETE,
    Permissions.WORKSPACE_INVITE_MEMBER,
    Permissions.WORKSPACE_UPDATE_MEMBER_ROLE,
    Permissions.WORKSPACE_DELETE_MEMBER,
  ],
  [Roles.ADMIN]: [
    Permissions.TRANSACTION_VIEW,
    Permissions.TRANSACTION_CREATE,
    Permissions.TRANSACTION_UPDATE,
    Permissions.TRANSACTION_DELETE,
    Permissions.WORKSPACE_UPDATE_MEMBER_ROLE,
    Permissions.WORKSPACE_DELETE_MEMBER,
  ],
  [Roles.MEMBER]: [
    Permissions.TRANSACTION_VIEW,
    Permissions.TRANSACTION_CREATE,
    Permissions.TRANSACTION_UPDATE,
  ],
  [Roles.VIEWER]: [Permissions.TRANSACTION_VIEW],
}
