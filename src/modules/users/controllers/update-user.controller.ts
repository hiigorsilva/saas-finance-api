import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError, ErrorCodes } from '../../../errors/app-error'
import { dataResponse } from '../../../shared/utils/http'
import { userUpdateInputSchema } from '../schemas/update-user.schema'
import type { UpdateUserService } from '../services/update-user.service'

export class UpdateUserController {
  constructor(private updateUserService: UpdateUserService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request
    if (!userId)
      throw new AppError('Unauthorized.', 401, ErrorCodes.UNAUTHORIZED)

    const { success, data, error } = userUpdateInputSchema.safeParse(
      request.body
    )
    if (!success)
      throw new AppError(error.message, 400, ErrorCodes.VALIDATION_ERROR)

    const user = await this.updateUserService.updateUser({
      userId,
      name: data.name,
      password: data.password,
      birthDate: data.birthDate,
    })

    return reply.status(200).send(dataResponse(user))
  }
}
