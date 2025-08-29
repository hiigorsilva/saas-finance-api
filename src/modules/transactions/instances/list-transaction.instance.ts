import { WorkspaceRepository } from '../../workspaces/repositories/workspace.repository'
import { ListTransactionController } from '../controllers/list-transaction.controller'
import { TransactionRepository } from '../repositories/transaction.repository'
import { ListTransactionService } from '../services/list-transaction.service'

const transactionRepository = new TransactionRepository()
const workspaceRepository = new WorkspaceRepository()
const listTransactionService = new ListTransactionService(
  transactionRepository,
  workspaceRepository
)
export const listTransactionController = new ListTransactionController(
  listTransactionService
)
