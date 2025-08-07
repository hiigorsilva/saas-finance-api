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

// ************ FIND WORKSPACE BY ID ************

export const findWorkspaceByIdParamsSchema = z.object({
  workspaceId: z.string(),
})

export const findWorkspaceById: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Find a workspace by id',
    tags: ['Workspace'],
    security: [{ bearerAuth: [] }],
    params: findWorkspaceByIdParamsSchema,
    response: {
      200: z.object({
        statusCode: z.literal(200),
        body: z.object({
          workspace: z.object({
            id: z.string(),
            name: z.string(),
            description: z.string().nullable(),
            type: z.enum(['PRIVATE', 'SHARED']),
            ownerId: z.string(),
            createdAt: z.date(),
            updatedAt: z.date(),
          }),
        }),
      }),
      400: z.object({
        statusCode: z.literal(400),
        body: z.object({
          error: z.string(),
        }),
      }),
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

// ************ UPDATE ************

export const updateWorkspaceParamsSchema = z.object({
  workspaceId: z.string(),
})

const updateWorkspaceSuccessResponseSchema = z.object({
  statusCode: z.literal(200),
  body: z.object({
    workspace: z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable(),
      type: z.string(),
      ownerId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  }),
})

const updateWorkspaceBadRequestResponseSchema = z.object({
  statusCode: z.literal(200),
  body: z.object({
    status: z.string(),
  }),
})

export const updateWorkspaceBodySchema = z.object({
  name: z
    .string()
    .min(2, { error: 'Name must have at least 2 characters' })
    .trim(),
  description: z.string().trim().optional(),
  type: z.enum(['PRIVATE', 'SHARED']),
})

export const updateWorkspace: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Edit a workspace by id',
    consumes: ['application/json'],
    tags: ['Workspace'],
    security: [{ bearerAuth: [] }],
    params: updateWorkspaceParamsSchema,
    body: updateWorkspaceBodySchema,
    response: {
      200: updateWorkspaceSuccessResponseSchema,
      400: updateWorkspaceBadRequestResponseSchema,
    },
  },
}
