import { and, eq } from 'drizzle-orm'
import { db } from '../db/connection'
import { workspacesTable } from '../db/schemas/workspaces'
import type {
  IWorkspaceId,
  IWorkspaceRepository,
} from '../interfaces/workspace'
import type { CreateWorkspaceBodyType } from '../schemas/workspace-schema'

export class WorkspaceRepository implements IWorkspaceRepository {
  async create(
    data: CreateWorkspaceBodyType,
    ownerId: string
  ): Promise<IWorkspaceId> {
    const [workspace] = await db
      .insert(workspacesTable)
      .values({
        ownerId: ownerId,
        name: data.name,
        description: data.description,
        type: data.type,
      })
      .returning({ id: workspacesTable.id })

    if (!workspace) throw new Error('Error creating workspace')
    return workspace
  }

  async alreadyExists(workspaceName: string, userId: string): Promise<boolean> {
    const workspace = await db.query.workspacesTable.findFirst({
      where: and(
        eq(workspacesTable.name, workspaceName),
        eq(workspacesTable.ownerId, userId)
      ),
    })
    return !!workspace
  }
}
