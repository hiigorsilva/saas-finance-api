import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  badRequest,
  internalServerError,
  ok,
  unauthorized,
} from '../../../shared/utils/http'
import { parseResponse } from '../../../shared/utils/parse-response'
import {
  editWorkspaceBodySchema,
  editWorkspaceParamsSchema,
} from '../schemas/edit-workspace.schema'
import type { EditWorkspaceService } from '../services/edit-workspace.service'

export class EditWorkspaceController {
  constructor(private editWorkspacesService: EditWorkspaceService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId, body, params } = request
      if (!userId) return unauthorized({ error: 'Unauthorized.' })

      const {
        success: successParams,
        data: dataParams,
        error: errorParams,
      } = editWorkspaceParamsSchema.safeParse(params)
      if (!successParams) return badRequest({ error: errorParams.issues })

      const { success, data, error } = editWorkspaceBodySchema.safeParse(body)
      if (!success) return badRequest({ error: error.issues })

      const { workspaceId } = dataParams

      const workspace = await this.editWorkspacesService.edit({
        userId,
        workspaceId,
        data,
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
