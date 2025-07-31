import jwt, { type JwtPayload } from 'jsonwebtoken'
import { env } from '../shared/utils/env'

export const signAccessTokenFor = async (userId: string) => {
  const accessToken = jwt.sign({ sub: userId }, env.JWT_SECRET, {
    expiresIn: '7d',
  })
  return accessToken
}

export const validateAccessToken = async (token: string) => {
  try {
    const { sub } = jwt.verify(token, env.JWT_SECRET) as JwtPayload
    return sub ?? null
  } catch (error) {
    console.error('FAILED_TO_VALIDATE_ACCESS_TOKEN', error)
    return null
  }
}
