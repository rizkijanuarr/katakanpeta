import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { ForgotPasswordRepository } from '../Repository/ForgotPasswordRepository'

export const forgotPasswordSchema = z.object({
  email: z.string().email({
    error: (iss) => (iss.input === '' ? 'Please enter your email' : undefined),
  }),
  newPassword: z
    .string()
    .min(1, 'Please enter a new password')
    .min(7, 'Password must be at least 7 characters long'),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export function useForgotPasswordViewModel() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '', newPassword: '' },
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true)
    try {
      await ForgotPasswordRepository.requestReset(data)
      
      toast.success('Password reset successful', {
        description: 'Please login with your new password',
      })
      
      navigate({ to: '/sign-in-2' })
    } catch (error: any) {
      toast.error('Password reset failed', {
        description: error?.message || 'Failed to reset password',
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
