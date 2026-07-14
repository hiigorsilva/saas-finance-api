import { and, eq, gt, isNull, or } from 'drizzle-orm'
import { db } from '../../../db/connection'
import { usersTable } from '../../../db/schemas/users'
import { workspaceInvitationsTable } from '../../../db/schemas/workspace-invitations'
import { workspacesTable } from '../../../db/schemas/workspaces'
import type {
  IWorkspaceInviteActionOutput,
  IWorkspaceInviteIdOutput,
  IWorkspaceInviteListOutput,
} from '../dto/workspace-invites.dto'
import type {
  IWorkspaceInvite,
  IWorkspaceInviteRepository,
} from '../interfaces/workspace-invites.interface'

export class WorkspaceInvitesRepository implements IWorkspaceInviteRepository {
  async sendInvite(
    inviterId: string,
    inviteeId: string,
    workspaceId: string,
    expiresAt: Date
  ): Promise<IWorkspaceInviteIdOutput> {
    const [invite] = await db
      .insert(workspaceInvitationsTable)
      .values({
        inviterId,
        inviteeId,
        workspaceId,
        status: 'PENDING',
        expiresAt,
      })
      .returning({
        id: workspaceInvitationsTable.id,
      })

    return invite
  }

  async listInvitesByUser(
    userId: string
  ): Promise<IWorkspaceInviteListOutput[]> {
    const now = new Date()
    const invites = await db
      .select({
        id: workspaceInvitationsTable.id,
        workspaceId: workspaceInvitationsTable.workspaceId,
        inviterId: workspaceInvitationsTable.inviterId,
        inviteeId: workspaceInvitationsTable.inviteeId,
        status: workspaceInvitationsTable.status,
        expiresAt: workspaceInvitationsTable.expiresAt,
        inviterName: usersTable.name,
        workspaceName: workspacesTable.name,
      })
      .from(workspaceInvitationsTable)
      .where(
        and(
          eq(workspaceInvitationsTable.inviteeId, userId),
          eq(workspaceInvitationsTable.status, 'PENDING'),
          or(
            isNull(workspaceInvitationsTable.expiresAt),
            gt(workspaceInvitationsTable.expiresAt, now)
          )
        )
      )
      .innerJoin(
        usersTable,
        eq(workspaceInvitationsTable.inviterId, usersTable.id)
      )
      .innerJoin(
        workspacesTable,
        eq(workspaceInvitationsTable.workspaceId, workspacesTable.id)
      )

    return invites as IWorkspaceInviteListOutput[]
  }

  async findPendingInviteById(
    inviteId: string,
    inviteeId: string
  ): Promise<IWorkspaceInvite | null> {
    const invite = await db.query.workspaceInvitationsTable.findFirst({
      where: and(
        eq(workspaceInvitationsTable.id, inviteId),
        eq(workspaceInvitationsTable.inviteeId, inviteeId),
        eq(workspaceInvitationsTable.status, 'PENDING')
      ),
    })

    return (invite as IWorkspaceInvite | undefined) ?? null
  }

  async acceptInvite(
    inviteId: string,
    inviteeId: string
  ): Promise<IWorkspaceInviteActionOutput> {
    await db
      .update(workspaceInvitationsTable)
      .set({
        status: 'ACCEPTED',
        acceptedAt: new Date(),
      })
      .where(
        and(
          eq(workspaceInvitationsTable.id, inviteId),
          eq(workspaceInvitationsTable.inviteeId, inviteeId),
          eq(workspaceInvitationsTable.status, 'PENDING')
        )
      )

    await this.deleteInvite(inviteId)

    return { status: 'Invite accepted successfully.' }
  }

  async declineInvite(
    inviteId: string,
    inviteeId: string
  ): Promise<IWorkspaceInviteActionOutput> {
    await db
      .update(workspaceInvitationsTable)
      .set({
        status: 'DECLINED',
        declinedAt: new Date(),
      })
      .where(
        and(
          eq(workspaceInvitationsTable.id, inviteId),
          eq(workspaceInvitationsTable.inviteeId, inviteeId),
          eq(workspaceInvitationsTable.status, 'PENDING')
        )
      )

    await this.deleteInvite(inviteId)

    return { status: 'Invite declined successfully.' }
  }

  async hasPendingInvite(
    workspaceId: string,
    inviteeId: string
  ): Promise<boolean> {
    const now = new Date()
    const invite = await db.query.workspaceInvitationsTable.findFirst({
      where: and(
        eq(workspaceInvitationsTable.workspaceId, workspaceId),
        eq(workspaceInvitationsTable.inviteeId, inviteeId),
        eq(workspaceInvitationsTable.status, 'PENDING'),
        or(
          isNull(workspaceInvitationsTable.expiresAt),
          gt(workspaceInvitationsTable.expiresAt, now)
        )
      ),
    })

    return !!invite
  }

  async deleteInvite(inviteId: string): Promise<void> {
    await db
      .delete(workspaceInvitationsTable)
      .where(eq(workspaceInvitationsTable.id, inviteId))
  }
}
