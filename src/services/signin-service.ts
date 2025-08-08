import { compare } from 'bcryptjs'
import type { UserRepository } from '../repositories/user-repository'
import type { SignInBodyType } from '../schemas/auth/signin-schema'

export class SignInService {
  constructor(private userRepository: UserRepository) {}

  async execute(userData: SignInBodyType) {
    const user = await this.userRepository.findUserByEmail(userData.email)
    if (!user) throw new Error('Invalid credentials.')

    const isPasswordValid = await compare(
      userData.password,
      user.passwordHashed
    )
    if (!isPasswordValid) throw new Error('Invalid credentials.')

    return user
  }
}
