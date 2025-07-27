import type { RouteHandlerMethod } from 'fastify'
import * as service from './health-check-service'

export const health: RouteHandlerMethod = async (_, reply) => {
  const healthCheck = await service.healthCheckService()
  if (!healthCheck.success) {
    return reply.status(400).send({
      statusCode: 400,
      message: healthCheck.error,
    })
  }

  const response = {
    statusCode: 200,
    data: healthCheck.data?.status,
  }

  return reply.status(200).send(response)
}
