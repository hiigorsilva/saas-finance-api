import { WorkspaceRepository } from '../../workspaces/repositories/workspace.repository'
import { EditTransactionController } from '../controllers/edit-transaction.controller'
import { TransactionRepository } from '../repositories/transaction.repository'
import { EditTransactionService } from '../services/edit-transaction.service'

const transactionRepository = new TransactionRepository()
const workspaceRepository = new WorkspaceRepository()
const editTransactionService = new EditTransactionService(
  transactionRepository,
  workspaceRepository
)
export const editTransactionController = new EditTransactionController(
  editTransactionService
)
