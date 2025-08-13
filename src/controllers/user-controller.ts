import type { FastifyRequest } from 'fastify'
import type { UserService } from '../services/user-service'
import { ok, unauthorized } from '../shared/utils/http'

export class UserController {
  constructor(private userService: UserService) {}

  async findUserById(request: FastifyRequest) {
    const { userId } = request
    if (!userId) return unauthorized({ error: 'Unauthorized' })

    const user = await this.userService.findUserById(userId)

    return ok({ user })
  }

  async listAllUsers(request: FastifyRequest) {
    const { userId } = request
    if (!userId) return unauthorized({ error: 'Unauthorized' })

    const users = await this.userService.listAllUsers()
    return ok({ users })
  }
}
