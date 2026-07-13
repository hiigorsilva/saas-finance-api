import type { IWorkspaceInviteIdOutput } from '../../workspace-invites/dto/workspace-invites.dto'
import type { SendWorkspaceInviteService } from '../../workspace-invites/services/send-workspace-invite.service'

type AddMemberProps = {
  workspaceId: string
  inviterId: string
  email: string
}

export class WorkspaceMemberService {
  constructor(private sendWorkspaceInviteService: SendWorkspaceInviteService) {}

  async addMember({
    workspaceId,
    inviterId,
    email,
  }: AddMemberProps): Promise<IWorkspaceInviteIdOutput> {
    return this.sendWorkspaceInviteService.send({
      workspaceId,
      inviterId,
      email,
    })
  }
}
