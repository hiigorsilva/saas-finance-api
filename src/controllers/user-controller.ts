import type { FastifyRequest } from 'fastify'
import { listTransactionQuerySchema } from '../schemas/transactions/list-transaction'
import type { UserService } from '../services/user-service'
import { badRequest, ok, unauthorized } from '../shared/utils/http'

export class UserController {
  constructor(private userService: UserService) {}

  async findUserById(request: FastifyRequest) {
    const { userId } = request
    if (!userId) return unauthorized({ error: 'Unauthorized' })

    const user = await this.userService.findUserById(userId)

    return ok({ user })
  }

  async listAllUsers(request: FastifyRequest) {
    const { userId, query } = request
    if (!userId) return unauthorized({ error: 'Unauthorized' })

    const { success, data, error } = listTransactionQuerySchema.safeParse(query)
    if (!success) return badRequest({ error: error.message })

    const users = await this.userService.listAllUsers(data.page, data.limit)
    return ok({
      data: users.users,
      totalCount: users.totalCount,
      totalPages: users.totalPages,
      currentPage: users.currentPage,
      limit: users.limit,
    })
  }
}
