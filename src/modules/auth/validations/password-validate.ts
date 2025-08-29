import { compare, hashSync } from 'bcryptjs'

export const validatePassword = async (
  password: string,
  passwordHashed: string
) => {
  return await compare(password, passwordHashed)
}

export const hashPassword = async (password: string) => {
  return hashSync(password, 8)
}
