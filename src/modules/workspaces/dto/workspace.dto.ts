import type z from 'zod'
import type { IWorkspace } from '../../../interfaces/workspaces/workspace.interface'
import type { createWorkspaceBodySchema } from '../schemas/create-workspace.schema'

export type IWorkspaceOutput = Pick<
  IWorkspace,
  'id' | 'name' | 'description' | 'type'
>
export type IWorkspaceId = Pick<IWorkspace, 'id'>
export type CreateWorkspaceDTO = z.infer<typeof createWorkspaceBodySchema>
