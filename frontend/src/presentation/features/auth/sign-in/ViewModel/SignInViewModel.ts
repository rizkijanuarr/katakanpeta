import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/core/store/authStore'
import { SignInRepository } from '../Repository/SignInRepository'

// Schema dipindah dari Screen ke ViewModel supaya logika terpusat
export const signInSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email' : undefined),
  }),
  password: z.string().min(1, 'Please enter your password'),
})

export type SignInFormValues = z.infer<typeof signInSchema>

export function useSignInViewModel() {
  const [isLoading, setIsLoading] = useState(false)
  const setToken = useAuthStore((state) => state.setToken)
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

      // Update global state dengan token baru
      setToken(response.token)

      // Arahkan user ke dashboard
      navigate({ to: '/' })
    } catch (error) {
      console.error('Login failed:', error)
      // Disini bisa tambahkan logic untuk show error Toast
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
