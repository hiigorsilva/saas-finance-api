import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  badRequest,
  internalServerError,
  ok,
  unauthorized,
} from '../../../shared/utils/http'

import { parseResponse } from '../../../shared/utils/parse-response'
import { removeUserParamsSchema } from '../schemas/remove-user.schema'
import type { RemoveUserService } from '../services/remove-user.service'

export class RemoveUserController {
  constructor(private removeUserService: RemoveUserService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId, params } = request
      if (!userId) return unauthorized({ error: 'Unauthorized.' })

      const { success, data, error } = removeUserParamsSchema.safeParse(params)
      if (!success) {
        return badRequest({
          error: error.issues.map(issue => issue.message).join(', '),
        })
      }

      const { userId: userIdParams } = data

      const user = await this.removeUserService.removeUser({ userIdParams })
      const response = ok({ data: user })

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
