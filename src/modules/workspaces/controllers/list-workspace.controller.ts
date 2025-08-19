import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  badRequest,
  internalServerError,
  ok,
  unauthorized,
} from '../../../shared/utils/http'
import { parseResponse } from '../../../shared/utils/parse-response'
import { listWorkspaceQuerySchema } from '../schemas/list-workspace.schema'
import type { ListWorkspaceService } from '../services/list-workspace.service'

export class ListWorkspaceController {
  constructor(private listWorkspacesService: ListWorkspaceService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId, query } = request
      if (!userId) return unauthorized({ error: 'Unauthorized' })

      const { success, data, error } = listWorkspaceQuerySchema.safeParse(query)
      if (!success) return badRequest({ error: error.issues })

      const { page, limit } = data

      const workspaces = await this.listWorkspacesService.list({
        userId,
        page,
        limit,
      })

      const response = ok({ ...workspaces })

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
