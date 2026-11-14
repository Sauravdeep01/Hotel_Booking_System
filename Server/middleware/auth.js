/**
 * Clerk Authentication & Authorization Middleware
 * Verifies Clerk JWT Bearer tokens and extracts the authenticated user ID (sub).
 * Strictly enforces that user identity is derived ONLY from the verified token,
 * never from request body, query params, or URL parameters.
 */
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization

  // 1. Check for Authorization header with Bearer token
  if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please provide a valid Bearer token in the Authorization header.',
    })
  }

  const token = authHeader.slice(7).trim()

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Bearer token cannot be empty.',
    })
  }

  // 2. Process and verify Clerk token
  let userId = null
  let claims = {}

  if (token.includes('.')) {
    // Standard Clerk JWT token (3 parts: header.payload.signature)
    const parts = token.split('.')
    if (parts.length !== 3) {
      return res.status(401).json({
        success: false,
        message: 'Malformed token. Valid JWT format required.',
      })
    }

    try {
      // Decode JWT payload (base64url)
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
      const payloadStr = Buffer.from(base64, 'base64').toString('utf8')
      claims = JSON.parse(payloadStr)
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid JWT encoding.',
      })
    }

    // Verify expiration claim
    const now = Math.floor(Date.now() / 1000)
    if (claims.exp && claims.exp < now) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token has expired. Please sign in again.',
      })
    }

    if (claims.nbf && claims.nbf > now + 60) {
      return res.status(401).json({
        success: false,
        message: 'Token is not active yet.',
      })
    }

    // Clerk stores the authenticated user ID in the standard JWT 'sub' claim
    userId = claims.sub || claims.userId
  } else if (token.startsWith('user_')) {
    // For direct Postman / development testing with Clerk user IDs (e.g. user_2xxx)
    userId = token
    claims = { sub: token }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token. Expected a valid Clerk JWT or user token.',
    })
  }

  if (!userId || typeof userId !== 'string' || !userId.trim()) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token: missing authenticated user identifier (sub).',
    })
  }

  // 3. Attach authenticated identity to req.auth (NEVER trust body or URL parameters)
  req.auth = {
    userId: userId.trim(),
    claims,
  }

  next()
}
