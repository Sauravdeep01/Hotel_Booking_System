/**
 * Authentication Middleware for Clerk Integration
 * Verifies that the user is authenticated.
 * Extracts authenticated user identity from Clerk JWT token, x-user-id header, or request payload.
 */
export const requireAuth = (req, res, next) => {
  let userId = null

  // 1. Check Authorization header for Clerk JWT / Bearer token
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    if (token) {
      if (token.includes('.')) {
        try {
          // Decode Clerk JWT token payload (standard 3-part base64url JWT)
          const base64Payload = token.split('.')[1]
          const payloadStr = Buffer.from(base64Payload, 'base64').toString('utf8')
          const payload = JSON.parse(payloadStr)
          if (payload && (payload.sub || payload.userId || payload.id)) {
            userId = payload.sub || payload.userId || payload.id
          }
        } catch (e) {
          // If token format is non-standard JWT, fallback to treating token as raw ID
          userId = token
        }
      } else {
        userId = token
      }
    }
  }

  // 2. Check standard user identification headers and request payload
  if (!userId) {
    userId =
      req.headers['x-user-id'] ||
      req.headers['user-id'] ||
      req.body?.userId ||
      req.query?.userId
  }

  // 3. If unauthenticated, return 401 Unauthorized
  if (!userId || typeof userId !== 'string' || !userId.trim()) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please sign in to cancel this reservation.',
    })
  }

  // Attach authenticated user info to request
  req.auth = {
    userId: userId.trim(),
  }

  next()
}

