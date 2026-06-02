import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from '../../../errors/app-error'
import { dataResponse } from '../../../shared/utils/http'
import { getValidationMessage } from '../../../shared/utils/validation'
import { removeTransactionParamsSchema } from '../schemas/remove-transaction.schema'
import type { RemoveTransactionService } from '../services/remove-transaction.service'

export class RemoveTransactionController {
  constructor(private removeTransactionService: RemoveTransactionService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { userId, params } = request
    if (!userId) throw new AppError('Unauthorized.', 401)

    const { success, data, error } =
      removeTransactionParamsSchema.safeParse(params)
    if (!success) throw new AppError(getValidationMessage(error), 400)

    const { workspaceId, transactionId } = data

    const transaction = await this.removeTransactionService.removeTransaction({
      workspaceId,
      transactionId,
      userId,
    })

    return reply.status(200).send(dataResponse(transaction))
  }
}
