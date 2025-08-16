import { compare, hashSync } from 'bcryptjs'
import type { IUser } from '../../../interfaces/users/user.interface'
import type { SignInUserDTO } from '../dto/signin.dto'

export const validatePassword = async (
  userData: SignInUserDTO,
  user: IUser
) => {
  return await compare(userData.password, user.passwordHashed)
}

export const hashPassword = async (password: string) => {
  return hashSync(password, 8)
}
