import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError, ErrorCodes } from '../../../errors/app-error'
import { dataResponse } from '../../../shared/utils/http'
import { getValidationMessage } from '../../../shared/utils/validation'
import { getTransactionByIdParamsSchema } from '../schemas/get-transaction-by-id.schema'
import type { GetTransactionService } from '../services/get-transaction.service'

export class GetTransactionController {
  constructor(private getTransactionService: GetTransactionService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { userId, params } = request
    if (!userId)
      throw new AppError('Unauthorized.', 401, ErrorCodes.UNAUTHORIZED)

    const { success, data, error } =
      getTransactionByIdParamsSchema.safeParse(params)
    if (!success)
      throw new AppError(
        getValidationMessage(error),
        400,
        ErrorCodes.VALIDATION_ERROR
      )

    const { workspaceId, transactionId } = data

    const transaction = await this.getTransactionService.getTransactionById({
      workspaceId,
      transactionId,
    })

    return reply.status(200).send(dataResponse(transaction))
  }
}
