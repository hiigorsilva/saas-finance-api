import { AppError, ErrorCodes } from '../../../errors/app-error'
import type { UserRepository } from '../repositories/user.repository'

export class MeService {
  constructor(private userRepository: UserRepository) {}

  async getUserData(userId: string) {
    const userAlreadyExists = await this.userRepository.isUserExistsById(userId)
    if (!userAlreadyExists)
      throw new AppError('User not found', 404, ErrorCodes.USER_NOT_FOUND)

    const user = await this.userRepository.findUserById(userId)
    if (!user)
      throw new AppError('User not found', 404, ErrorCodes.USER_NOT_FOUND)

    return user
  }
}
