import { SignUp } from '@clerk/clerk-react'
import AuthLayout from '../components/auth/AuthLayout'
import { stayEaseClerkAppearance } from '../utils/clerkAppearance'

export default function Signup() {
  return (
    <AuthLayout subtitle="Create an account to unlock member rates and instant booking.">
      <SignUp
        path="/signup"
        routing="path"
        signInUrl="/login"
        fallbackRedirectUrl="/dashboard"
        signInFallbackRedirectUrl="/dashboard"
        appearance={stayEaseClerkAppearance}
      />
    </AuthLayout>
  )
}
