import type { FastifyReply, FastifyRequest } from 'fastify'
import { validateAccessToken } from '../lib/jwt'
import {
  badRequest,
  internalServerError,
  unauthorized,
} from '../shared/utils/http'
import { parseResponse } from '../shared/utils/parse-response'

export const privateRoute = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { authorization } = request.headers
    if (!authorization) {
      return reply
        .status(401)
        .send(parseResponse(unauthorized({ error: 'Unauthorized' })))
    }

    const [_, token] = authorization.split(' ')
    const userId = await validateAccessToken(token)

    request.userId = userId

    return userId
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
