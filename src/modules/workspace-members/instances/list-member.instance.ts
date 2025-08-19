import { ListMemberController } from '../controllers/list-member.controller'
import { WorkspaceMemberRepository } from '../repositories/workspace-members.repository'
import { ListMemberService } from '../services/list-member.service'

const workspaceMemberRepository = new WorkspaceMemberRepository()
const listMemberService = new ListMemberService(workspaceMemberRepository)
export const listMemberController = new ListMemberController(listMemberService)
