import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  badRequest,
  internalServerError,
  ok,
  unauthorized,
} from '../../../shared/utils/http'
import { parseResponse } from '../../../shared/utils/parse-response'
import { getWorkspaceByIdParamsSchema } from '../schemas/get-workspace-by-id.schema'
import type { GetWorkspaceService } from '../services/get-workspace.service'

export class GetWorkspaceController {
  constructor(private getWorkspaceService: GetWorkspaceService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId, params } = request
      if (!userId) return unauthorized({ error: 'Unauthorized.' })

      const { success, data, error } =
        getWorkspaceByIdParamsSchema.safeParse(params)
      if (!success) return badRequest({ error: error.message })

      const { workspaceId } = data

      const workspace = await this.getWorkspaceService.getWorkspaceById({
        userId,
        workspaceId,
      })
      const response = ok({ data: workspace })

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
