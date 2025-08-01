import type { CreateWorkspaceBodyType } from '../schemas/workspace-schema'

export interface IWorkspace {
  id: string
  name: string
  description: string
  type: 'PRIVATE' | 'SHARED'
}

export type IWorkspaceId = Pick<IWorkspace, 'id'>

export interface IWorkspaceRepository {
  create(data: CreateWorkspaceBodyType, ownerId: string): Promise<IWorkspaceId>
  //   list(workspaceId: string): Promise<IWorkspace[]>
  //   getWorkspaceById(workspaceId: string): Promise<IWorkspace | null>
  //   update(workspaceId: string): Promise<IWorkspace>
  //   delete(workspaceId: string): Promise<void>
  // }
}
