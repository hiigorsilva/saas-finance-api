import type { FastifyReply, FastifyRequest } from 'fastify'
import { signAccessTokenFor } from '../../../lib/jwt'
import { badRequest, internalServerError, ok } from '../../../shared/utils/http'
import { parseResponse } from '../../../shared/utils/parse-response'
import { signinBodySchema } from '../schemas/signin.schema'
import type { SignInService } from '../services/signin.service'

export class SignInController {
  constructor(private signinService: SignInService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { body } = request

      const { success, data, error } = signinBodySchema.safeParse(body)
      if (!success) return badRequest({ error: error.issues })

      const user = await this.signinService.execute(data)
      const accessToken = await signAccessTokenFor(user.id)
      const response = ok({ accessToken })

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
