import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { SignUpRepository } from '../Repository/SignUpRepository'
import { toast } from 'sonner'

export const signUpSchema = z.object({
  name: z.string().min(1, 'Please enter your name'),
  email: z.string().email({
    error: (iss) => (iss.input === '' ? 'Please enter your email' : undefined),
  }),
  password: z
    .string()
    .min(1, 'Please enter your password')
    .min(7, 'Password must be at least 7 characters long'),
})

export type SignUpFormValues = z.infer<typeof signUpSchema>

export function useSignUpViewModel() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true)
    try {
      await SignUpRepository.register(data)
      
      toast.success('Registration successful', {
        description: 'Please login with your new account',
      })
      
      // Navigate to Sign In after successful registration
      navigate({ to: '/sign-in-2' })
    } catch (error: any) {
      toast.error('Registration failed', {
        description: error?.message || 'Failed to create account',
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
