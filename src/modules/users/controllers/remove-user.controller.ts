import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from '../../../errors/app-error'
import { dataResponse } from '../../../shared/utils/http'
import { getValidationMessage } from '../../../shared/utils/validation'
import { removeUserParamsSchema } from '../schemas/remove-user.schema'
import type { RemoveUserService } from '../services/remove-user.service'

export class RemoveUserController {
  constructor(private removeUserService: RemoveUserService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { userId, params } = request
    if (!userId) throw new AppError('Unauthorized.', 401)

    const { success, data, error } = removeUserParamsSchema.safeParse(params)
    if (!success) throw new AppError(getValidationMessage(error), 400)

    const { userId: userIdParams } = data

    const user = await this.removeUserService.removeUser({ userIdParams })

    return reply.status(200).send(dataResponse(user))
  }
}
