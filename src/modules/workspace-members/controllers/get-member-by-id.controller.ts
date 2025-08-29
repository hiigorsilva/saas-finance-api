import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  badRequest,
  internalServerError,
  ok,
  unauthorized,
} from '../../../shared/utils/http'
import { parseResponse } from '../../../shared/utils/parse-response'
import { getMemberByIdParamsSchema } from '../schemas/get-member-by-id.schema'
import type { GetMemberByIdService } from '../services/get-member-by-id.service'

export class GetMemberByIdController {
  constructor(private getMemberByIdService: GetMemberByIdService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId, params } = request
      if (!userId) return unauthorized({ error: 'Unauthorized.' })

      const { success, data, error } =
        getMemberByIdParamsSchema.safeParse(params)
      if (!success) return badRequest({ error: error.issues })

      const { workspaceId, memberId } = data

      const member = await this.getMemberByIdService.getMemberById({
        workspaceId,
        memberId,
      })
      const response = ok({ data: member })

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
