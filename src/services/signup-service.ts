import { hashSync } from 'bcryptjs'
import type { SignUpBodyType } from '../interfaces/users/user'
import type { UserRepository } from '../repositories/user-repository'

export class SignUpService {
  constructor(private userRepository: UserRepository) {}

  async execute(userData: SignUpBodyType) {
    if (userData.password.length < 8)
      throw new Error('Password must be at least 8 characters long.')

    const userAlreadyExists = await this.userRepository.isUserExistsByEmail(
      userData.email
    )
    if (userAlreadyExists) {
      throw new Error('This email is alredy in use.')
    }

    const hashedPassword = hashSync(userData.password, 8)

    const newUser = await this.userRepository.create({
      name: userData.name,
      email: userData.email,
      passwordHashed: hashedPassword,
    })
    return newUser
  }
}
