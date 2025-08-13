import type { UserRepository } from '../repositories/user-repository'

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findUserById(userId: string) {
    const userAlreadyExists = this.userRepository.isUserExistsById(userId)
    if (!userAlreadyExists) throw new Error('Unauthorized')

    const user = this.userRepository.findUserById(userId)
    return user
  }

  async listAllUsers(page: number, limit: number) {
    const users = await this.userRepository.listAllUsers(page, limit)
    return users
  }
}
