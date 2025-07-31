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
  createdAt: Date | null
  updatedAt: Date | null
  deletedAt: Date | null
}

export type CreateUser = Pick<IUser, 'name' | 'email' | 'passwordHashed'>

export interface IUserRepository {
  create(user: CreateUser): Promise<Pick<IUser, 'id'>>
  isUserExists(email: string): Promise<boolean>
  findUserByEmail(email: string): Promise<IUser | null>
}
