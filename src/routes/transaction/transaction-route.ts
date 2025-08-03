import type { FastifyInstance } from 'fastify'
import { TransactionController } from '../../controllers/transaction-controller'
import { TransactionRepository } from '../../repositories/transaction-repository'
import { WorkspaceRepository } from '../../repositories/workspace-repository'
import * as schema from '../../schemas/transactions/create-transaction'
import { TransactionService } from '../../services/transaction-service'
import { badRequest, internalServerError } from '../../shared/utils/http'
import { parseResponse } from '../../shared/utils/parse-response'

const transactionRepository = new TransactionRepository()
const workspaceRepository = new WorkspaceRepository()
const transactionService = new TransactionService(
  transactionRepository,
  workspaceRepository
)
const transactionController = new TransactionController(transactionService)

export const transactionRoute = async (app: FastifyInstance) => {
  app.post(
    '/:workspaceId/transaction',
    schema.createTransaction,
    async (request, reply) => {
      try {
        const response = await transactionController.create(request)
        return reply.status(response.statusCode).send(response)
      } catch (error) {
        if (error instanceof Error) {
          console.log('Erro na resposta da rota', error)
          return reply
            .status(400)
            .send(parseResponse(badRequest({ error: error.message })))
        }
        return reply
          .status(500)
          .send(
            parseResponse(
              internalServerError({ error: 'Internal server error' })
            )
          )
      }
    }
  )
}
