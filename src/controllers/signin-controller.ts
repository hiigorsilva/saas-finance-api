import type { FastifyRequest } from 'fastify'
import { signAccessTokenFor } from '../lib/jwt'
import { signinBodySchema } from '../schemas/signin-schema'
import type { SignInService } from '../services/signin-service'
import { ok, unauthorized } from '../shared/utils/http'

export class SignInController {
  constructor(private signinService: SignInService) {}

  async handle({ body }: FastifyRequest) {
    const { success, data, error } = signinBodySchema.safeParse(body)
    if (!success) return unauthorized({ error: error.issues })

    const user = await this.signinService.execute(data)
    const accessToken = await signAccessTokenFor(user.id)

    return ok({ accessToken })
  }
}
