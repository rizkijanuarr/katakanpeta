import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore, User } from '@/core/store/authStore'
import { SignInRepository } from '../Repository/SignInRepository'
import { toast } from 'sonner'

// Schema dipindah dari Screen ke ViewModel supaya logika terpusat
export const signInSchema = z.object({
  email: z.string().email({
    error: (iss) => (iss.input === '' ? 'Please enter your email' : undefined),
  }),
  password: z.string().min(1, 'Please enter your password'),
})

export type SignInFormValues = z.infer<typeof signInSchema>

export function useSignInViewModel() {
  const [isLoading, setIsLoading] = useState(false)
  const setAuth = useAuthStore((state) => state.setAuth)
  const navigate = useNavigate()

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: SignInFormValues) => {
    setIsLoading(true)
    try {
      // Panggil Repository (Network API)
      const response = await SignInRepository.login(data)

      // Construct User object dari response
      const user: User = {
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role as 'ADMIN' | 'USER',
      }

      // Update global state dengan token DAN user info
      setAuth(response.token, user)

      // Show success toast
      toast.success('Login successful', {
        description: `Welcome back, ${user.name}!`,
      })

      // Arahkan user ke dashboard
      navigate({ to: '/dashboard' })
    } catch (error: any) {
      console.error('Login failed:', error)
      toast.error('Login failed', {
        description: error?.message || 'Invalid email or password',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    form,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
