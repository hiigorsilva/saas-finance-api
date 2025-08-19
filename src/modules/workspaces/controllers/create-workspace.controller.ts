import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  badRequest,
  created,
  internalServerError,
  unauthorized,
} from '../../../shared/utils/http'
import { parseResponse } from '../../../shared/utils/parse-response'
import { createWorkspaceBodySchema } from '../schemas/create-workspace.schema'
import type { CreateWorkspaceService } from '../services/create-workspace.service'

export class CreateWorkspaceController {
  constructor(private createWorkspaceService: CreateWorkspaceService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId, body } = request
      if (!userId) return unauthorized({ error: 'Unauthorized' })

      const { success, data, error } = createWorkspaceBodySchema.safeParse(body)
      if (!success) return badRequest({ error: error.issues })

      const workspace = await this.createWorkspaceService.create(data, userId)
      const response = created({ data: workspace })

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
