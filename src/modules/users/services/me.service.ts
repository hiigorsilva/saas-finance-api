import type { UserRepository } from '../repositories/user.repository'

export class MeService {
  constructor(private userRepository: UserRepository) {}

  async getUserData(userId: string) {
    const userAlreadyExists = this.userRepository.isUserExistsById(userId)
    if (!userAlreadyExists) throw new Error('User not found')

    const user = await this.userRepository.findUserById(userId)
    return user
  }
}
