import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from '../errors/app-error'
import { validateAccessToken } from '../lib/jwt'

export const privateRoute = async (
  request: FastifyRequest,
  _reply: FastifyReply
) => {
  const { authorization } = request.headers
  if (!authorization) throw new AppError('Unauthorized.', 401)

  const [_, token] = authorization.split(' ')
  if (!token) throw new AppError('Unauthorized.', 401)

  const userId = await validateAccessToken(token)
  request.userId = userId
}
