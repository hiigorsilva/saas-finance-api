import jwt from 'jsonwebtoken'
import { env } from '../shared/utils/env'

export const generateToken = async (payload: any) => {
  const token = jwt.sign(payload, env.JWT_SECRET)
  return token
}
