import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  badRequest,
  internalServerError,
  ok,
  unauthorized,
} from '../../../shared/utils/http'
import { parseResponse } from '../../../shared/utils/parse-response'
import {
  listMembersParamsSchema,
  listMembersQuerySchema,
} from '../schemas/list-member.schema'
import type { ListMemberService } from '../services/list-member.service'

export class ListMemberController {
  constructor(private listMemberService: ListMemberService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId, params, query } = request
      if (!userId) return unauthorized({ error: 'Unauthorized.' })

      const { success, data, error } = listMembersParamsSchema.safeParse(params)
      if (!success) return badRequest({ error: error.message })

      const {
        success: successQuery,
        data: dataQuery,
        error: errorQuery,
      } = listMembersQuerySchema.safeParse(query)
      if (!successQuery) return badRequest({ error: errorQuery.message })

      const { workspaceId } = data
      const { page, limit } = dataQuery

      const members = await this.listMemberService.listAll({
        workspaceId,
        userId,
        page,
        limit,
      })
      const response = ok({ ...members })

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
