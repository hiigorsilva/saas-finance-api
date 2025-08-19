import type { IUser } from '../interfaces/user.interface'

export type IUserId = Pick<IUser, 'id'>
export type IUserOutput = Omit<IUser, 'passwordHashed' | 'deletedAt'>
