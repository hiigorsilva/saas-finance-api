import type { TFinancialProfile } from '../../data/user'
import type { RegisterUserDTO } from '../../modules/auth/dto/register.dto'

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

export type IUserId = Pick<IUser, 'id'>

export interface IUserRepository {
  isUserExistsByEmail(email: string): Promise<boolean>
  isUserExistsById(userId: string): Promise<boolean>
  findUserByEmail(email: string): Promise<IUser | null>
  save(userData: RegisterUserDTO): Promise<IUserId>
}
