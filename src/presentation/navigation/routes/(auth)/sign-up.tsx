import { createFileRoute } from '@tanstack/react-router'
import { SignUpScreen } from '@/features/auth/sign-up/Screen/SignUpScreen'

export const Route = createFileRoute('/(auth)/sign-up')({
  component: SignUpScreen,
})
