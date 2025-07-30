import type { FastifyRequest } from 'fastify'
import { signupBodySchema } from '../schemas/signup-schema'
import type { SignUpService } from '../services/signup-service'
import { badRequest, created } from '../shared/utils/http'

export class SignUpController {
  constructor(private signUpService: SignUpService) {}

  async handle({ body }: FastifyRequest) {
    const { success, data, error } = signupBodySchema.safeParse(body)
    if (!success) return badRequest({ error: error.issues })

    const newUser = await this.signUpService.execute(data)
    const accessToken = await this.signUpService.signAccessTokenFor(newUser.id)
    return created({ accessToken })
  }
}
