import { hashSync } from 'bcryptjs'
import type { UserRepository } from '../repositories/user-repository'
import type { SignUpBodyType } from '../schemas/signup-schema'

export class SignUpService {
  constructor(private userRepository: UserRepository) {}

  async execute(userData: SignUpBodyType) {
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
