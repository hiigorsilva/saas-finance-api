import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from '../../../errors/app-error'
import { paginatedResponse } from '../../../shared/utils/http'
import { getValidationMessage } from '../../../shared/utils/validation'
import {
  listMembersParamsSchema,
  listMembersQuerySchema,
} from '../schemas/list-member.schema'
import type { ListMemberService } from '../services/list-member.service'

export class ListMemberController {
  constructor(private listMemberService: ListMemberService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { userId, params, query } = request
    if (!userId) throw new AppError('Unauthorized.', 401)

    const { success, data, error } = listMembersParamsSchema.safeParse(params)
    if (!success) throw new AppError(getValidationMessage(error), 400)

    const {
      success: successQuery,
      data: dataQuery,
      error: errorQuery,
    } = listMembersQuerySchema.safeParse(query)
    if (!successQuery) throw new AppError(getValidationMessage(errorQuery), 400)

    const { workspaceId } = data
    const { page, limit } = dataQuery

    const members = await this.listMemberService.listAll({
      workspaceId,
      userId,
      page,
      limit,
    })

    return reply.status(200).send(paginatedResponse(members))
  }
}
