import { AppError, ErrorCodes } from '../../../errors/app-error'
import type { UserRepository } from '../../users/repositories/user.repository'
import type { RegisterUserDTO } from '../dto/register.dto'
import { hashPassword } from '../validations/password-validate'

export class RegisterService {
  constructor(private userRepository: UserRepository) {}

  async execute(userData: RegisterUserDTO) {
    if (userData.password.length < 8)
      throw new AppError(
        'Password must be at least 8 characters long.',
        400,
        ErrorCodes.PASSWORD_TOO_SHORT
      )

    const userAlreadyExists = await this.userRepository.isUserExistsByEmail(
      userData.email
    )
    if (userAlreadyExists) {
      throw new AppError(
        'This email is already in use.',
        409,
        ErrorCodes.EMAIL_ALREADY_IN_USE
      )
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
