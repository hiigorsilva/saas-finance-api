import type { UserRepository } from '../repositories/user.repository'

type RemoveUserProps = {
  userId: string
}

export class RemoveUserService {
  constructor(private userRepository: UserRepository) {}

  async removeUser({ userId }: RemoveUserProps) {
    const isUserExists = await this.userRepository.isUserExistsById(userId)
    if (!isUserExists) throw new Error('User not found.')

    const user = await this.userRepository.remove(userId)
    if (!user) throw new Error('User not found.')

    return user.status
  }
}
