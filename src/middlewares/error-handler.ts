import type { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import { AppError } from '../errors/app-error'

type ValidationErrorItem = {
  message?: string
}

type ErrorLike = {
  message?: string
  code?: string
  statusCode?: number
  validation?: ValidationErrorItem[]
}

const isErrorLike = (value: unknown): value is ErrorLike => {
  return typeof value === 'object' && value !== null
}

const formatErrorMessage = (message: string) => {
  return message.replace(/^(body|params|querystring|headers)\/[\w.-]+\s*/i, '')
}

export const registerErrorHandler = (app: FastifyInstance) => {
  app.setErrorHandler((error, _request, reply) => {
    const safeError: ErrorLike = isErrorLike(error) ? error : {}

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        message: error.message,
      })
    }

    const hasValidationError =
      safeError.code === 'FST_ERR_VALIDATION' ||
      Array.isArray(safeError.validation)

    if (error instanceof ZodError) {
      const firstIssue = error.issues.at(0)
      return reply.status(400).send({
        message: firstIssue?.message ?? 'Dados da requisição inválidos',
      })
    }

    if (hasValidationError) {
      const validation = safeError.validation
      const firstValidationMessage = validation?.[0]?.message

      return reply.status(400).send({
        message: formatErrorMessage(
          firstValidationMessage ??
            safeError.message ??
            'Dados da requisição inválidos'
        ),
      })
    }

    if (safeError.code === 'FST_ERR_BAD_STATUS_CODE') {
      return reply.status(500).send({ message: 'Internal server error' })
    }

    const statusCode =
      typeof safeError.statusCode === 'number' ? safeError.statusCode : 500

    if (statusCode >= 400 && statusCode < 500) {
      return reply.status(statusCode).send({
        message: safeError.message || 'Erro desconhecido na requisição',
      })
    }

    return reply.status(500).send({ message: 'Internal server error' })
  })
}
