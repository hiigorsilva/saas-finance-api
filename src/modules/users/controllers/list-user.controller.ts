import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  badRequest,
  internalServerError,
  ok,
  unauthorized,
} from '../../../shared/utils/http'
import { parseResponse } from '../../../shared/utils/parse-response'
import { listUserParamsSchema } from '../schemas/list-user.schema'
import type { ListUserService } from '../services/list-user.service'

export class ListUserController {
  constructor(private listUserService: ListUserService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId, query } = request
      if (!userId) return unauthorized({ error: 'Unauthorized.' })

      const { success, data, error } = listUserParamsSchema.safeParse(query)
      if (!success) {
        return badRequest({
          error: error.issues.map(issue => issue.message).join(', '),
        })
      }

      const { page, limit } = data
      const users = await this.listUserService.listAllUsers({
        userId,
        page,
        limit,
      })
      const response = ok({ ...users })

      return reply.status(response.statusCode).send(response)
    } catch (error) {
      if (error instanceof Error) {
        return reply
          .status(400)
          .send(parseResponse(badRequest({ error: error.message })))
      }
      return reply
        .status(500)
        .send(
          parseResponse(internalServerError({ error: 'Internal server error' }))
        )
    }
  }
}
