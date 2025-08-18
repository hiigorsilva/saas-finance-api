import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  badRequest,
  created,
  internalServerError,
  unauthorized,
} from '../../../shared/utils/http'
import { parseResponse } from '../../../shared/utils/parse-response'
import {
  addMemberBodySchema,
  addMemberParamsSchema,
} from '../schemas/add-member.schema'
import type { WorkspaceMemberService } from '../services/add-member.service'

export class AddMemberToWorkspaceController {
  constructor(private workspaceMemberService: WorkspaceMemberService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId, body, params } = request
      if (!userId) return unauthorized({ error: 'Unauthorized.' })

      const {
        success: successParams,
        data: dataParams,
        error: errorParams,
      } = addMemberParamsSchema.safeParse(params)
      if (!successParams) return badRequest({ error: errorParams.message })

      const { success, data, error } = addMemberBodySchema.safeParse(body)
      if (!success) return badRequest({ error: error.message })

      const { workspaceId } = dataParams
      const { email, role } = data

      const member = await this.workspaceMemberService.addMember({
        workspaceId,
        userId,
        email,
        role,
      })

      return created({ data: member })
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
