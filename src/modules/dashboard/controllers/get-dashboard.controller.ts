import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  badRequest,
  internalServerError,
  ok,
  unauthorized,
} from '../../../shared/utils/http'
import { parseResponse } from '../../../shared/utils/parse-response'
import type { IDashboardRepository } from '../interfaces/dashboard.interface'
import {
  getDashboardParamsSchema,
  getDashboardQuerySchema,
} from '../schemas/get-dashboard.schema'

export class GetDashboardController {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId, params, query } = request
      if (!userId) return unauthorized({ error: 'Unauthorized.' })

      const {
        success: successParams,
        data: dataParams,
        error: errorParams,
      } = getDashboardParamsSchema.safeParse(params)
      if (!successParams) return badRequest({ error: errorParams.issues })

      const {
        success: successQuery,
        data: dataQuery,
        error: errorQuery,
      } = getDashboardQuerySchema.safeParse(query)
      if (!successQuery) return badRequest({ error: errorQuery.issues })

      const dashboardData = await this.dashboardRepository.getDashboard(
        dataParams.workspaceId,
        dataQuery.month,
        dataQuery.year
      )

      const response = ok({ data: dashboardData })
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
