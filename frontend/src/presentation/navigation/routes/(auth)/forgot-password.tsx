import { createFileRoute } from '@tanstack/react-router'
import { ForgotPasswordScreen } from '@/features/auth/forgot-password/Screen/ForgotPasswordScreen'

export const Route = createFileRoute('/(auth)/forgot-password')({
  component: ForgotPasswordScreen,
})
