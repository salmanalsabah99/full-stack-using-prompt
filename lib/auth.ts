import { NextApiRequest, NextApiResponse } from 'next'
import { verify } from 'jsonwebtoken'

export interface JWTPayload {
  userId: string
}

export function verifyAuth(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req.cookies.session

    if (!token) {
      return res.status(401).json({ data: [], error: 'Unauthorized' })
    }

    const decoded = verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as JWTPayload

    return decoded
  } catch (error) {
    return res.status(401).json({ data: [], error: 'Invalid token' })
  }
} 