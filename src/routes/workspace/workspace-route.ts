import type { FastifyInstance } from 'fastify'
import { WorkspaceController } from '../../controllers/workspace-controller'
import { WorkspaceRepository } from '../../repositories/workspace-repository'
import * as schema from '../../schemas/workspace-schema'
import { WorkspaceService } from '../../services/workspace-service'
import { badRequest, internalServerError } from '../../shared/utils/http'
import { parseResponse } from '../../shared/utils/parse-response'

const workspaceRepository = new WorkspaceRepository()
const workspaceService = new WorkspaceService(workspaceRepository)
const workspaceController = new WorkspaceController(workspaceService)

export const workspaceRoute = async (app: FastifyInstance) => {
  app.post('/workspace', schema.createWorkspace, async (request, reply) => {
    try {
      const response = await workspaceController.create(request)
      return reply.status(response.statusCode).send(response)
    } catch (error) {
      if (error instanceof Error) {
        return reply
          .status(400)
          .send(parseResponse(badRequest({ error: error.message })))
      }
      return reply
        .status(500)
        .send(
          parseResponse(internalServerError({ error: 'Internal server error' }))
        )
    }
  })

  app.get('/workspace', schema.listWorkspace, async (request, reply) => {
    try {
      const response = await workspaceController.list(request)
      return reply.status(response.statusCode).send(response)
    } catch (error) {
      if (error instanceof Error) {
        return reply
          .status(400)
          .send(parseResponse(badRequest({ error: error.message })))
      }
      return reply
        .status(500)
        .send(
          parseResponse(internalServerError({ error: 'Internal server error' }))
        )
    }
  })

  app.get(
    '/workspace/:workspaceId',
    schema.findWorkspaceById,
    async (request, reply) => {
      try {
        const response = await workspaceController.findWorkspaceById(request)
        return reply.status(response.statusCode).send(response)
      } catch (error) {
        if (error instanceof Error) {
          return reply
            .status(400)
            .send(parseResponse(badRequest({ error: error.message })))
        }
        return reply
          .status(500)
          .send(
            parseResponse(
              internalServerError({ error: 'Internal server error' })
            )
          )
      }
    }
  )

  app.delete(
    '/workspace/:workspaceId',
    schema.deleteWorkspace,
    async (request, reply) => {
      try {
        const response = await workspaceController.delete(request)
        return reply.status(response.statusCode).send(response)
      } catch (error) {
        if (error instanceof Error) {
          return reply
            .status(400)
            .send(parseResponse(badRequest({ error: error.message })))
        }
        return reply
          .status(500)
          .send(
            parseResponse(
              internalServerError({ error: 'Internal server error' })
            )
          )
      }
    }
  )

  app.put(
    '/workspace/:workspaceId',
    schema.updateWorkspace,
    async (request, reply) => {
      try {
        const response = await workspaceController.update(request)
        return reply.status(response.statusCode).send(response)
      } catch (error) {
        if (error instanceof Error) {
          return reply
            .status(400)
            .send(parseResponse(badRequest({ error: error.message })))
        }
        return reply
          .status(500)
          .send(
            parseResponse(
              internalServerError({ error: 'Internal server error' })
            )
          )
      }
    }
  )
}
