import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { SignInScreen } from '@/features/auth/sign-in/Screen/SignInScreen'

const signinSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/sign-in-2')({
  validateSearch: signinSearchSchema,
  component: SignInScreen,
})
