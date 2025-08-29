import type { UserRepository } from '../repositories/user.repository'

type RemoveUserProps = {
  userIdParams: string
}

export class RemoveUserService {
  constructor(private userRepository: UserRepository) {}

  async removeUser({ userIdParams }: RemoveUserProps) {
    const isUserExists =
      await this.userRepository.isUserExistsById(userIdParams)
    if (!isUserExists) throw new Error('User not found.')

    const user = await this.userRepository.remove(userIdParams)
    if (!user) throw new Error('User not found.')

    return user.status
  }
}
