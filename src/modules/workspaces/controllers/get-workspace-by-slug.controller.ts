import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError, ErrorCodes } from '../../../errors/app-error'
import { dataResponse } from '../../../shared/utils/http'
import { getValidationMessage } from '../../../shared/utils/validation'
import { getWorkspaceBySlugParamsSchema } from '../schemas/get-workspace-by-slug.schema'
import type { GetWorkspaceDetailsService } from '../services/get-workspace-details.service'

export class GetWorkspaceDetailsController {
  constructor(private getWorkspaceDetailsService: GetWorkspaceDetailsService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { userId, params } = request
    if (!userId)
      throw new AppError('Unauthorized.', 401, ErrorCodes.UNAUTHORIZED)

    const { success, data, error } =
      getWorkspaceBySlugParamsSchema.safeParse(params)
    if (!success)
      throw new AppError(
        getValidationMessage(error),
        400,
        ErrorCodes.VALIDATION_ERROR
      )

    const { slug } = data

    const workspace = await this.getWorkspaceDetailsService.getWorkspaceBySlug({
      slug,
    })

    return reply.status(200).send(dataResponse(workspace))
  }
}
