import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from '../../../errors/app-error'
import { paginatedResponse } from '../../../shared/utils/http'
import { getValidationMessage } from '../../../shared/utils/validation'
import { listUserParamsSchema } from '../schemas/list-user.schema'
import type { ListUserService } from '../services/list-user.service'

export class ListUserController {
  constructor(private listUserService: ListUserService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { userId, query } = request
    if (!userId) throw new AppError('Unauthorized.', 401)

    const { success, data, error } = listUserParamsSchema.safeParse(query)
    if (!success) throw new AppError(getValidationMessage(error), 400)

    const { page, limit } = data
    const users = await this.listUserService.listAllUsers({
      userId,
      page,
      limit,
    })

    return reply.status(200).send(paginatedResponse(users))
  }
}
