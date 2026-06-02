import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError, ErrorCodes } from '../../../errors/app-error'
import { dataResponse } from '../../../shared/utils/http'
import type { MeService } from '../services/me.service'

export class MeController {
  constructor(private meService: MeService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request
    if (!userId)
      throw new AppError('Unauthorized.', 401, ErrorCodes.UNAUTHORIZED)

    const user = await this.meService.getUserData(userId)

    return reply.status(200).send(dataResponse(user))
  }
}
