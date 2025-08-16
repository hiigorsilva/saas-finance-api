import type { IUser } from '../../../interfaces/users/user.interface'

export type IUserId = Pick<IUser, 'id'>
export type IUserOutput = Omit<IUser, 'passwordHashed' | 'deletedAt'>
