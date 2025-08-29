import type { UserRepository } from '../../users/repositories/user.repository'
import type { RegisterUserDTO } from '../dto/register.dto'
import { hashPassword } from '../validations/password-validate'

export class RegisterService {
  constructor(private userRepository: UserRepository) {}

  async execute(userData: RegisterUserDTO) {
    if (userData.password.length < 8)
      throw new Error('Password must be at least 8 characters long.')

    const userAlreadyExists = await this.userRepository.isUserExistsByEmail(
      userData.email
    )
    if (userAlreadyExists) {
      throw new Error('This email is already in use.')
    }

    const hashedPassword = await hashPassword(userData.password)

    const newUser = await this.userRepository.save({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    })
    return newUser
  }
}
