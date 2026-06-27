import type { IPaginationOutput } from '../../../shared/types/response'
import type {
  CreateWorkspaceDTO,
  IWorkspaceId,
  IWorkspaceOutput,
} from '../dto/workspace.dto'

export interface IWorkspace {
  id: string
  name: string
  slug: string
  description: string | null
  type: 'PRIVATE' | 'SHARED'
  ownerId: string
  createdAt: Date
  updatedAt: Date
}

export interface IWorkspaceDetails extends IWorkspace {
  ownerName: string
  totalMembers: number
  members: Array<{
    id: string
    userId: string
    workspaceId: string
    role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'
    joinedAt: Date
    userName: string
    userEmail: string
  }>
}

export interface IWorkspaceRepository {
  save(data: CreateWorkspaceDTO, userId: string): Promise<IWorkspaceId>

  alreadyExistsByName(workspaceName: string, userId: string): Promise<boolean>

  alreadyExistsById(workspaceId: string): Promise<boolean>

  isPrivateWorkspace(workspaceId: string): Promise<boolean>

  list(
    userId: string,
    page: number,
    limit: number
  ): Promise<IPaginationOutput<IWorkspaceOutput>>

  findWorkspaceById(workspaceId: string): Promise<IWorkspace | null>

  findWorkspaceBySlug(slug: string): Promise<IWorkspaceDetails | null>

  remove(workspaceId: string, userId: string): Promise<{ status: string }>

  edit(
    workspaceId: string,
    userId: string,
    data: CreateWorkspaceDTO
  ): Promise<IWorkspaceOutput>
}
