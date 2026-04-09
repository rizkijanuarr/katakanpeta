import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { SignUpRepository } from '../Repository/SignUpRepository'

export const signUpSchema = z
  .object({
    email: z.email({
      error: (iss) => (iss.input === '' ? 'Please enter your email' : undefined),
    }),
    password: z
      .string()
      .min(1, 'Please enter your password')
      .min(7, 'Password must be at least 7 characters long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

export type SignUpFormValues = z.infer<typeof signUpSchema>

export function useSignUpViewModel() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true)
    try {
      const response = await SignUpRepository.register(data)
      console.log('Registration Success:', response)
      // Navigate ke SignIn setelah register berhasil
      navigate({ to: '/sign-in-2' })
    } catch (error) {
      console.error('Registration failed:', error)
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
