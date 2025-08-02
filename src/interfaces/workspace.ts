import type { CreateWorkspaceBodyType } from '../schemas/workspace-schema'

export interface IWorkspaceDetail {
  id: string
  name: string
  description: string | null
  type: 'PRIVATE' | 'SHARED'
  ownerId: string
  createdAt: Date | null
  updatedAt: Date
}

export interface IWorkspace {
  id: string
  name: string
  description: string | null
  type: 'PRIVATE' | 'SHARED'
}

export type IWorkspaceId = Pick<IWorkspace, 'id'>

export interface IWorkspaceRepository {
  create(data: CreateWorkspaceBodyType, userId: string): Promise<IWorkspaceId>
  alreadyExistsByName(workspaceName: string, userId: string): Promise<boolean>
  alreadyExistsById(workspaceName: string, userId: string): Promise<boolean>
  list(userId: string): Promise<IWorkspace[]>
  delete(workspaceId: string, userId: string): Promise<{ status: string }>
  //   getWorkspaceById(workspaceId: string): Promise<IWorkspace | null>
  //   delete(workspaceId: string): Promise<void>
  // }
}
