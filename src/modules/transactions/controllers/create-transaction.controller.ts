import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from '../../../errors/app-error'
import { dataResponse } from '../../../shared/utils/http'
import { getValidationMessage } from '../../../shared/utils/validation'
import {
  createTransactionBodySchema,
  createTransactionParamsSchema,
} from '../schemas/create-transaction.schema'
import type { CreateTransactionService } from '../services/create-transaction.service'

export class CreateTransactionController {
  constructor(private createTransactionService: CreateTransactionService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { userId, body, params } = request
    if (!userId) throw new AppError('Unauthorized.', 401)

    const { success, data, error } = createTransactionBodySchema.safeParse(body)
    if (!success) throw new AppError(getValidationMessage(error), 400)

    const {
      success: successParams,
      data: dataParams,
      error: errorParams,
    } = createTransactionParamsSchema.safeParse(params)
    if (!successParams)
      throw new AppError(getValidationMessage(errorParams), 400)

    const { workspaceId } = dataParams

    const transaction = await this.createTransactionService.create({
      workspaceId,
      userId,
      data,
    })

    return reply.status(201).send(dataResponse(transaction))
  }
}
