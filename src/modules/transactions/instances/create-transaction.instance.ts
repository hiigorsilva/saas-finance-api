import { WorkspaceRepository } from '../../workspaces/repositories/workspace.repository'
import { CreateTransactionController } from '../controllers/create-transaction.controller'
import { TransactionRepository } from '../repositories/transaction.repository'
import { CreateTransactionService } from '../services/create-transaction.service'

const transactionRepository = new TransactionRepository()
const workspaceRepository = new WorkspaceRepository()
const createTransactionService = new CreateTransactionService(
  transactionRepository,
  workspaceRepository
)
export const createTransactionController = new CreateTransactionController(
  createTransactionService
)
