import type { UserRepository } from '../repositories/user-repository'

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string) {
    const userAlreadyExists = this.userRepository.isUserExistsById(userId)
    if (!userAlreadyExists) throw new Error('Unauthorized')

    const user = this.userRepository.findUserById(userId)
    return user
  }
}
