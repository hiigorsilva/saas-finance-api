import jwt from 'jsonwebtoken'
import { env } from '../shared/utils/env'

export const signAccessTokenFor = async (userId: string) => {
  const accessToken = jwt.sign({ sub: userId }, env.JWT_SECRET, {
    expiresIn: '7d',
  })
  return accessToken
}
