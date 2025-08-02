import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../middlewares/private-route'

// ************ CREATE ************

export const createWorkspaceBodySchema = z.object({
  name: z.string().min(2).trim(),
  description: z.string().trim().optional(),
  type: z.enum(['PRIVATE', 'SHARED']),
})
export type CreateWorkspaceBodyType = z.infer<typeof createWorkspaceBodySchema>

const createWorkspaceSuccessResponseSchema = z.object({
  statusCode: z.literal(201),
  body: z.object({
    workspace: z.object({
      id: z.string(),
    }),
  }),
})

const createWorkspaceBadRequestResponseSchema = z.object({
  statusCode: z.literal(400),
  body: z.object({
    error: z.string(),
  }),
})

export const createWorkspace: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Create a new wokspace',
    consumes: ['application/json'],
    security: [{ bearerAuth: [] }],
    tags: ['Workspace'],
    body: createWorkspaceBodySchema,
    response: {
      201: createWorkspaceSuccessResponseSchema,
      400: createWorkspaceBadRequestResponseSchema,
    },
  },
}

// ************ LIST ************

export const listworkspaceSuccessResponseSchema = z.object({
  statusCode: z.literal(200),
  body: z.object({
    workspaces: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().nullable(),
        type: z.string(),
      })
    ),
  }),
})

export const listWorkspaceBadRequestResponeSchema = z.object({
  statusCode: z.literal(400),
  body: z.object({
    error: z.string(),
  }),
})

export const listWorkspace: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'List all workspaces',
    consumes: ['application/json'],
    tags: ['Workspace'],
    security: [{ bearerAuth: [] }],
    response: {
      200: listworkspaceSuccessResponseSchema,
      400: listWorkspaceBadRequestResponeSchema,
    },
  },
}

// ************ DELETE ************

export const deleteWorkspaceBadRequestResponseSchema = z.object({
  statusCode: z.literal(400),
  body: z.object({
    error: z.string(),
  }),
})

export const paramsDeleteWorkspaceSchema = z.object({
  workspaceId: z.string(),
})
export type ParamsDeleteWorkspaceType = z.infer<
  typeof paramsDeleteWorkspaceSchema
>

export const deleteWorkspaceSuccessResponseSchema = z.object({
  statusCode: z.literal(200),
  body: z.object({
    status: z.string(),
  }),
})

export const deleteWorkspace: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Delete a workspace',
    tags: ['Workspace'],
    security: [{ bearerAuth: [] }],
    params: paramsDeleteWorkspaceSchema,
    response: {
      200: deleteWorkspaceSuccessResponseSchema,
      400: deleteWorkspaceBadRequestResponseSchema,
    },
  },
}
