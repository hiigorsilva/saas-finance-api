import type { TFinancialProfile } from '../../data/user'

export interface IUser {
  id: string
  name: string
  email: string
  passwordHashed: string
  financialProfile: TFinancialProfile | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export interface IUserRepository {
  isUserExistsByEmail(email: string): Promise<boolean>
  isUserExistsById(userId: string): Promise<boolean>
  findUserByEmail(email: string): Promise<IUser | null>
}
