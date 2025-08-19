import { WorkspaceMembersRepository } from '../../workspace-members/repositories/workspace-members.repository'
import { WorkspaceRepository } from '../../workspaces/repositories/workspace.repository'
import { RemoveTransactionController } from '../controllers/remove-transaction.controller'
import { TransactionRepository } from '../repositories/transaction.repository'
import { RemoveTransactionService } from '../services/remove-transaction.service'

const transactionRepository = new TransactionRepository()
const workspaceRepository = new WorkspaceRepository()
const workspaceMemberRepository = new WorkspaceMembersRepository()
const removeTransactionService = new RemoveTransactionService(
  transactionRepository,
  workspaceRepository,
  workspaceMemberRepository
)
export const removeTransactionController = new RemoveTransactionController(
  removeTransactionService
)
