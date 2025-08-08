import type { FastifyInstance } from 'fastify'
import { TransactionController } from '../../controllers/transaction-controller'
import { TransactionRepository } from '../../repositories/transaction-repository'
import { WorkspaceRepository } from '../../repositories/workspace-repository'
import { createTransactionSchema } from '../../schemas/transactions/create-transaction'
import { deleteTransaction } from '../../schemas/transactions/delete-transaction'
import { findTransactionByIdSchema } from '../../schemas/transactions/find-by-id-transaction'
import { listTransactionSchema } from '../../schemas/transactions/list-transaction'
import { updateTransaction } from '../../schemas/transactions/update-transaction'
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
    createTransactionSchema,
    async (request, reply) => {
      try {
        const response = await transactionController.create(request)
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
            parseResponse(
              internalServerError({ error: 'Internal server error' })
            )
          )
      }
    }
  )

  app.get(
    '/:workspaceId/transaction',
    listTransactionSchema,
    async (request, reply) => {
      try {
        const response = await transactionController.list(request)
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
            parseResponse(
              internalServerError({ error: 'Internal server error.' })
            )
          )
      }
    }
  )

  app.get(
    '/:workspaceId/transaction/:transactionId',
    findTransactionByIdSchema,
    async (request, reply) => {
      try {
        const response =
          await transactionController.findTransactionById(request)
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
            parseResponse(
              internalServerError({ error: 'Internal server error.' })
            )
          )
      }
    }
  )

  app.delete(
    '/:workspaceId/transaction/:transactionId',
    deleteTransaction,
    async (request, reply) => {
      try {
        const response = await transactionController.delete(request)
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
            parseResponse(
              internalServerError({ error: 'Internal server error.' })
            )
          )
      }
    }
  )

  app.put(
    '/:workspaceId/transaction/:transactionId',
    updateTransaction,
    async (request, reply) => {
      try {
        const response = await transactionController.update(request)
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
            parseResponse(
              internalServerError({ error: 'Internal server error.' })
            )
          )
      }
    }
  )
}
