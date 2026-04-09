import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { ForgotPasswordRepository } from '../Repository/ForgotPasswordRepository'

export const forgotPasswordSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email' : undefined),
  }),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export function useForgotPasswordViewModel() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true)
    try {
      const response = await ForgotPasswordRepository.requestReset(data.email)
      toast.success(response.message)
      navigate({ to: '/sign-in-2' }) // Route to sign-in or OTP depending on flow
    } catch (error) {
      toast.error('Failed to send reset link')
    } finally {
      setIsLoading(false)
      form.reset()
    }
  }

  return {
    form,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
