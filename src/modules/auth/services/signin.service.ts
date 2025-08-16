import type { UserRepository } from '../../users/repositories/user.repository'
import type { SignInUserDTO } from '../dto/signin.dto'
import { validatePassword } from '../validations/password-validate'

export class SignInService {
  constructor(private userRepository: UserRepository) {}

  async execute(userData: SignInUserDTO) {
    const user = await this.userRepository.findUserByEmail(userData.email)
    if (!user) throw new Error('Invalid credentials.')

    const isPasswordValid = await validatePassword(userData, user)
    if (!isPasswordValid) throw new Error('Invalid credentials.')

    return user
  }
}
