import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import App from './App.jsx'
import { stayEaseClerkAppearance } from './utils/clerkAppearance.js'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env')
}

function ClerkProviderWithRoutes() {
  const navigate = useNavigate()

  // Ensure redirect paths stay within the active browser session/port and avoid hardcoded port mismatches
  const sanitizeTarget = (to) => {
    if (!to) return '/home'
    try {
      if (typeof window !== 'undefined') {
        // If an absolute URL is passed with a different localhost port (e.g. 5173 vs 5174)
        if (to.startsWith('http://localhost:') || to.startsWith('http://127.0.0.1:')) {
          const parsed = new URL(to)
          if (parsed.port !== window.location.port) {
            return parsed.pathname + parsed.search + parsed.hash
          }
        }
        // If an absolute URL matches the current origin, strip origin for SPA navigation
        if (to.startsWith(window.location.origin)) {
          return to.slice(window.location.origin.length) || '/home'
        }
      }
    } catch (e) {
      console.warn('Redirect sanitization error:', e)
    }
    return to
  }

  const handlePush = (to) => {
    const target = sanitizeTarget(to)
    if (target.startsWith('/')) {
      navigate(target)
    } else {
      window.location.href = target
    }
  }

  const handleReplace = (to) => {
    const target = sanitizeTarget(to)
    if (target.startsWith('/')) {
      navigate(target, { replace: true })
    } else {
      window.location.replace(target)
    }
  }

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={stayEaseClerkAppearance}
      routerPush={handlePush}
      routerReplace={handleReplace}
      afterSignOutUrl="/home"
      signInFallbackRedirectUrl="/home"
      signUpFallbackRedirectUrl="/home"
    >
      <App />
    </ClerkProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProviderWithRoutes />
    </BrowserRouter>
  </StrictMode>,
)
