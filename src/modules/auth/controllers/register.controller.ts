import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from '../../../errors/app-error'
import { signAccessTokenFor } from '../../../lib/jwt'
import { dataResponse } from '../../../shared/utils/http'
import { getValidationMessage } from '../../../shared/utils/validation'
import { registerBodySchema } from '../schemas/register.schema'
import type { RegisterService } from '../services/register.service'

export class RegisterController {
  constructor(private registerService: RegisterService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { body } = request

    const { success, data, error } = registerBodySchema.safeParse(body)
    if (!success) throw new AppError(getValidationMessage(error), 400)

    const newUser = await this.registerService.execute(data)
    const accessToken = await signAccessTokenFor(newUser.id)

    return reply.status(201).send(dataResponse({ accessToken }))
  }
}
