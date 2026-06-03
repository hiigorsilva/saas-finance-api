import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError, ErrorCodes } from '../../../errors/app-error'
import { dataResponse } from '../../../shared/utils/http'
import { getValidationMessage } from '../../../shared/utils/validation'
import {
  getDashboardParamsSchema,
  getDashboardQuerySchema,
} from '../schemas/get-dashboard.schema'
import type { GetDashboardService } from '../services/dasboard.service'

export class GetDashboardController {
  constructor(private getDashboardService: GetDashboardService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { userId, params, query } = request
    if (!userId)
      throw new AppError('Unauthorized.', 401, ErrorCodes.UNAUTHORIZED)

    const {
      success: successParams,
      data: dataParams,
      error: errorParams,
    } = getDashboardParamsSchema.safeParse(params)
    if (!successParams)
      throw new AppError(
        getValidationMessage(errorParams),
        400,
        ErrorCodes.VALIDATION_ERROR
      )

    const {
      success: successQuery,
      data: dataQuery,
      error: errorQuery,
    } = getDashboardQuerySchema.safeParse(query)
    if (!successQuery)
      throw new AppError(
        getValidationMessage(errorQuery),
        400,
        ErrorCodes.VALIDATION_ERROR
      )

    const data = {
      workspaceId: dataParams.workspaceId,
      month: dataQuery.month,
      year: dataQuery.year,
    }

    const dashboardData = await this.getDashboardService.getDashboard(data)

    return reply.status(200).send(dataResponse(dashboardData))
  }
}
