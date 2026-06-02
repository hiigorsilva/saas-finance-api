import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from '../../../errors/app-error'
import { dataResponse } from '../../../shared/utils/http'
import { getValidationMessage } from '../../../shared/utils/validation'
import {
  editTransactionBodySchema,
  editTransactionParamsSchema,
} from '../schemas/edit-transaction.schema'
import type { EditTransactionService } from '../services/edit-transaction.service'

export class EditTransactionController {
  constructor(private editTransactionService: EditTransactionService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { userId, body, params } = request
    if (!userId) throw new AppError('Unauthorized.', 401)

    const {
      success: successParams,
      data: dataParams,
      error: errorParams,
    } = editTransactionParamsSchema.safeParse(params)
    if (!successParams)
      throw new AppError(getValidationMessage(errorParams), 400)

    const { success, data, error } = editTransactionBodySchema.safeParse(body)
    if (!success) throw new AppError(getValidationMessage(error), 400)

    const { workspaceId, transactionId } = dataParams

    const transaction = await this.editTransactionService.editTransaction({
      workspaceId,
      transactionId,
      data,
    })

    return reply.status(200).send(dataResponse(transaction))
  }
}
