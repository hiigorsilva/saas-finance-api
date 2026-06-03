import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError, ErrorCodes } from '../../../errors/app-error'
import { signAccessTokenFor } from '../../../lib/jwt'
import { dataResponse } from '../../../shared/utils/http'
import { getValidationMessage } from '../../../shared/utils/validation'
import { signinBodySchema } from '../schemas/signin.schema'
import type { SignInService } from '../services/signin.service'

export class SignInController {
  constructor(private signinService: SignInService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { body } = request

    const { success, data, error } = signinBodySchema.safeParse(body)
    if (!success)
      throw new AppError(
        getValidationMessage(error),
        400,
        ErrorCodes.VALIDATION_ERROR
      )

    const user = await this.signinService.execute(data)
    const accessToken = await signAccessTokenFor(user.id)

    return reply.status(200).send(dataResponse({ accessToken }))
  }
}
