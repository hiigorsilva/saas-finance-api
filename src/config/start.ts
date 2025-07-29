import type { FastifyInstance } from 'fastify'
import { env } from '../shared/utils/env'

export const registerServerStart = async (app: FastifyInstance) => {
  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' })
    console.log(`✅ Server is running on port ${env.PORT}`)
    console.log(`✅ Docs available at http://localhost:${env.PORT}/api/docs`)
  } catch (error) {
    app.log.error('SERVER_START_ERROR', error)
    process.exit(1)
  }
}
