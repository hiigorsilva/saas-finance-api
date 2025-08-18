import type { TFinancialProfile } from '../../data/user'
import type { RegisterUserDTO } from '../../modules/auth/dto/register.dto'
import type { IUserId, IUserOutput } from '../../modules/users/dto/user.dto'
import type { IPaginationOutput } from '../../shared/types/response'

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
  save(userData: RegisterUserDTO): Promise<IUserId>
  findUserByEmail(email: string): Promise<IUser | null>
  findUserById(userId: string): Promise<IUserOutput | null>
  listAllUsers(
    page: number,
    limit: number
  ): Promise<IPaginationOutput<IUserOutput>>
  listInactiveUsers(
    page: number,
    limit: number
  ): Promise<IPaginationOutput<IUserOutput>>
}
