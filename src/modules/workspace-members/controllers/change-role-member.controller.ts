import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  badRequest,
  internalServerError,
  ok,
  unauthorized,
} from '../../../shared/utils/http'
import { parseResponse } from '../../../shared/utils/parse-response'
import {
  changeRoleMemberBodySchema,
  changeRoleMemberParamsSchema,
} from '../schemas/change-role-member.schema'
import type { ChangeRoleMemberService } from '../services/change-role-member.service'

export class ChangeRoleMemberController {
  constructor(private changeRoleMemberService: ChangeRoleMemberService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId, body, params } = request
      if (!userId) return unauthorized({ error: 'Unauthorized.' })

      const { success, data, error } =
        changeRoleMemberBodySchema.safeParse(body)
      if (!success) return badRequest({ error: error.issues })

      const {
        success: successParams,
        data: dataParams,
        error: errorParams,
      } = changeRoleMemberParamsSchema.safeParse(params)
      if (!successParams) return badRequest({ error: errorParams.issues })

      const { workspaceId, memberId } = dataParams
      const { newRole } = data

      const changedRoleMember =
        await this.changeRoleMemberService.changeMemberRole({
          workspaceId,
          memberId,
          newRole,
        })

      const response = ok({ data: changedRoleMember })
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
