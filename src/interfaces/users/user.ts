import type z from 'zod'
import type { signupBodySchema } from '../../schemas/auth/signup-schema'

export interface IUser {
  id: string
  name: string
  email: string
  passwordHashed: string
  financialProfile:
    | 'DEBTOR'
    | 'SPENDER'
    | 'DETACHED'
    | 'SAVER'
    | 'INVESTOR'
    | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export type InputCreateUser = Pick<IUser, 'name' | 'email' | 'passwordHashed'>
export type UserId = Pick<IUser, 'id'>
export type UserWithoutPassword = Omit<IUser, 'passwordHashed'>
export type SignUpBodyType = z.infer<typeof signupBodySchema>

export interface IUserRepository {
  create(user: InputCreateUser): Promise<UserId>
  isUserExistsById(userId: string): Promise<boolean>
  isUserExistsByEmail(email: string): Promise<boolean>
  findUserByEmail(email: string): Promise<UserWithoutPassword | null>
  findUserById(userId: string): Promise<UserWithoutPassword | null>
}
