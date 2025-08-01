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
      .values({ ...data, ownerId })
      .returning({ id: workspacesTable.id })

    if (!workspace) throw new Error('Error creating workspace')
    return workspace
  }
}
