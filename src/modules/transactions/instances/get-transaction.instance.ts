import { WorkspaceRepository } from '../../workspaces/repositories/workspace.repository'
import { GetTransactionController } from '../controllers/get-transaction.controller'
import { TransactionRepository } from '../repositories/transaction.repository'
import { GetTransactionService } from '../services/get-transaction.service'

const transactionRepository = new TransactionRepository()
const workspaceRepository = new WorkspaceRepository()
const getTransactionService = new GetTransactionService(
  transactionRepository,
  workspaceRepository
)
export const getTransactionController = new GetTransactionController(
  getTransactionService
)
