import {
  categorySchema,
  paymentMethodSchema,
  typeSchema,
} from '../../../data/transactions'
import { AppError, ErrorCodes } from '../../../errors/app-error'
import type { WorkspaceRepository } from '../../workspaces/repositories/workspace.repository'
import type {
  ICategoryTransactionType,
  IPaymentMethodTransactionType,
  ITransactionType,
} from '../dto/transaction.dto'
import type { TransactionRepository } from '../repositories/transaction.repository'

type ListTransactionProps = {
  workspaceId: string
  page: number
  limit: number
  search?: string
  type?: ITransactionType
  category?: ICategoryTransactionType
  paymentMethod?: IPaymentMethodTransactionType
  startDate?: Date
  endDate?: Date
}

export class ListTransactionService {
  constructor(
    private transactionRepository: TransactionRepository,
    private workspaceRepository: WorkspaceRepository
  ) {}

  async listAll({
    workspaceId,
    page,
    limit,
    search,
    type,
    category,
    paymentMethod,
    startDate,
    endDate,
  }: ListTransactionProps) {
    if (page < 1) {
      throw new AppError(
        'The page number must be greater than or equal to 1.',
        400,
        ErrorCodes.VALIDATION_ERROR
      )
    }

    if (limit > 100) {
      throw new AppError(
        'The limit must not exceed 100.',
        400,
        ErrorCodes.VALIDATION_ERROR
      )
    }

    const workspaceIsExists =
      await this.workspaceRepository.alreadyExistsById(workspaceId)
    if (!workspaceIsExists)
      throw new AppError(
        'Workspace not found.',
        404,
        ErrorCodes.WORKSPACE_NOT_FOUND
      )

    if (search && search.length < 3) {
      throw new AppError(
        'The search term must be at least 3 characters long.',
        400,
        ErrorCodes.VALIDATION_ERROR
      )
    }

    if (startDate && endDate && startDate > endDate) {
      throw new AppError(
        'The start date must be earlier than or equal to the end date.',
        400,
        ErrorCodes.VALIDATION_ERROR
      )
    }

    if (type) {
      const validTypes = typeSchema.options
      if (!validTypes.includes(type as (typeof validTypes)[number])) {
        throw new AppError(
          `Invalid transaction type. Valid types are: ${validTypes.join(', ')}.`,
          400,
          ErrorCodes.VALIDATION_ERROR
        )
      }
    }

    if (category) {
      const validCategories = categorySchema.options
      if (
        !validCategories.includes(category as (typeof validCategories)[number])
      ) {
        throw new AppError(
          `Invalid transaction category. Valid categories are: ${validCategories.join(', ')}.`,
          400,
          ErrorCodes.VALIDATION_ERROR
        )
      }
    }

    if (paymentMethod) {
      const validPaymentMethods = paymentMethodSchema.options
      if (
        !validPaymentMethods.includes(
          paymentMethod as (typeof validPaymentMethods)[number]
        )
      ) {
        throw new AppError(
          `Invalid payment method. Valid methods are: ${validPaymentMethods.join(', ')}.`,
          400,
          ErrorCodes.VALIDATION_ERROR
        )
      }
    }

    const transactions = await this.transactionRepository.list(
      workspaceId,
      page,
      limit,
      search,
      type,
      category,
      paymentMethod,
      startDate,
      endDate
    )
    return transactions
  }
}
