import type { UserRepository } from '../repositories/user.repository'

type ListUserProps = {
  userId: string
  page: number
  limit: number
}

export class ListUserService {
  constructor(private userRepository: UserRepository) {}

  async listAllUsers({ userId, page, limit }: ListUserProps) {
    const isUserExists = await this.userRepository.isUserExistsById(userId)
    if (!isUserExists) throw new Error('User not found')

    const users = await this.userRepository.listAllUsers(page, limit)
    return users
  }
}
