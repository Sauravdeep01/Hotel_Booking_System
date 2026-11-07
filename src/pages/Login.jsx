import { SignIn } from '@clerk/clerk-react'
import AuthLayout from '../components/auth/AuthLayout'
import { stayEaseClerkAppearance } from '../utils/clerkAppearance'

export default function Login() {
  return (
    <AuthLayout subtitle="Sign in to manage your hotel reservations and member account.">
      <SignIn
        path="/login"
        routing="path"
        signUpUrl="/signup"
        fallbackRedirectUrl="/dashboard"
        signUpFallbackRedirectUrl="/dashboard"
        appearance={stayEaseClerkAppearance}
      />
    </AuthLayout>
  )
}
