import type { TFinancialProfile } from '../../../data/user'
import type { IWorkspaceMember } from '../interfaces/workspace-member.interface'

export type IMembersWithRole = {
  id: string
  name: string
  email: string
  role: IWorkspaceMember['role'] | null
  financialProfile: TFinancialProfile | null
  createdAt: Date
  updatedAt: Date
}
