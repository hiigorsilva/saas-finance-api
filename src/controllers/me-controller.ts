import type { FastifyRequest } from 'fastify'
import type { UserService } from '../services/user-service'
import { ok, unauthorized } from '../shared/utils/http'

export class MeController {
  constructor(private userService: UserService) {}

  async handle(request: FastifyRequest) {
    const { userId } = request
    if (!userId) return unauthorized({ error: 'Unauthorized' })
    const user = await this.userService.execute(userId)

    return ok({ user })
  }
}
