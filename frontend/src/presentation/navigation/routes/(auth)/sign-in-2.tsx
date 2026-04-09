import { createFileRoute } from '@tanstack/react-router'
import { SignInScreen } from '@/features/auth/sign-in/Screen/SignInScreen'

export const Route = createFileRoute('/(auth)/sign-in-2')({
  component: SignInScreen,
})
