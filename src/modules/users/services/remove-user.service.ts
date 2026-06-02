import { AppError, ErrorCodes } from '../../../errors/app-error'
import type { UserRepository } from '../repositories/user.repository'

type RemoveUserProps = {
  userIdParams: string
}

export class RemoveUserService {
  constructor(private userRepository: UserRepository) {}

  async removeUser({ userIdParams }: RemoveUserProps) {
    const isUserExists =
      await this.userRepository.isUserExistsById(userIdParams)
    if (!isUserExists)
      throw new AppError('User not found.', 404, ErrorCodes.USER_NOT_FOUND)

    const user = await this.userRepository.remove(userIdParams)
    if (!user)
      throw new AppError('User not found.', 404, ErrorCodes.USER_NOT_FOUND)

    return user.status
  }
}
