import type { FastifyReply, FastifyRequest } from 'fastify'
import { signAccessTokenFor } from '../../../lib/jwt'
import { signupBodySchema } from '../../../schemas/auth/signup-schema'
import {
  badRequest,
  created,
  internalServerError,
} from '../../../shared/utils/http'
import { parseResponse } from '../../../shared/utils/parse-response'
import type { RegisterService } from '../services/register.service'

export class RegisterController {
  constructor(private registerService: RegisterService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { body } = request

      const { success, data, error } = signupBodySchema.safeParse(body)
      if (!success) {
        return badRequest({ error: error.issues.map(issue => issue.message) })
      }

      const newUser = await this.registerService.execute(data)
      const accessToken = await signAccessTokenFor(newUser.id)
      const response = created({ accessToken })

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
