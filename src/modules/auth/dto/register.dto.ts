import type z from 'zod'
import type { registerBodySchema } from '../schemas/register.schema'

export type RegisterUserDTO = z.infer<typeof registerBodySchema>
