import { NextApiRequest, NextApiResponse } from 'next'
import { verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'

export interface JWTPayload {
  userId: string
}

export async function verifyAuth(req: NextApiRequest | Request, res?: NextApiResponse) {
  try {
    let token: string | undefined

    if (req instanceof Request) {
      // App Router route
      const cookieStore = await cookies()
      token = cookieStore.get('session')?.value
    } else {
      // Pages Router route
      token = req.cookies.session
    }

    if (!token) {
      if (res) {
        res.status(401).json({ data: [], error: 'Unauthorized' })
        return null
      }
      return null
    }

    try {
      const decoded = verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key'
      ) as JWTPayload

      return decoded
    } catch (verifyError) {
      console.error('Token verification error:', verifyError)
      if (res) {
        res.status(401).json({ data: [], error: 'Invalid token' })
        return null
      }
      return null
    }
  } catch (error) {
    console.error('Auth error:', error)
    if (res) {
      res.status(500).json({ data: [], error: 'Authentication error' })
      return null
    }
    return null
  }
} 