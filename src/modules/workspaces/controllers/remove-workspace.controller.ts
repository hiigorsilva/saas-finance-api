import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  badRequest,
  internalServerError,
  ok,
  unauthorized,
} from '../../../shared/utils/http'
import { parseResponse } from '../../../shared/utils/parse-response'
import { removeWorkspaceParamsSchema } from '../schemas/remove-workspace.schema'
import type { RemoveWorkspaceService } from '../services/remove-workspace.service'

export class RemoveWorkspaceController {
  constructor(private removeWorkspaceService: RemoveWorkspaceService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId, params } = request
      if (!userId) return unauthorized({ error: 'Unauthorized.' })

      const { success, data, error } =
        removeWorkspaceParamsSchema.safeParse(params)
      if (!success) return badRequest({ error: error.issues })

      const { workspaceId } = data
      const workspace = await this.removeWorkspaceService.remove({
        workspaceId,
        userId,
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
