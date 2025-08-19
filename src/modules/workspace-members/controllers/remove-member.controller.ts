import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  badRequest,
  internalServerError,
  ok,
  unauthorized,
} from '../../../shared/utils/http'
import { parseResponse } from '../../../shared/utils/parse-response'
import { removeMemberParamsSchema } from '../schemas/remove-member.schema'
import type { RemoveMemberService } from '../services/remove-member.service'

export class RemoveMemberController {
  constructor(private removeMemberService: RemoveMemberService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId, params } = request
      if (!userId) return unauthorized({ error: 'Unauthorized.' })

      const { success, data, error } =
        removeMemberParamsSchema.safeParse(params)
      if (!success) return badRequest({ error: error.issues })

      const { workspaceId, memberId } = data

      const member = await this.removeMemberService.removeMember({
        workspaceId,
        userId,
        memberId,
      })
      const response = ok({ data: member })

      return reply.status(response.statusCode).send(parseResponse(response))
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
