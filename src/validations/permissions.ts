import { type Permissions, RolePermissions, type Roles } from '../data/roles'

export const can = (role: Roles, permission: Permissions): boolean => {
  return RolePermissions[role].includes(permission) ?? false
}

export const cannot = (role: Roles, permission: Permissions) => {
  return !can(role, permission)
}
