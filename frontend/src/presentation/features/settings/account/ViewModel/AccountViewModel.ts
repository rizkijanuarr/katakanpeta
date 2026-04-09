import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { AccountRepository } from '../Repository/AccountRepository'

export const languages = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
] as const

export const accountFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Please enter your name.')
    .min(2, 'Name must be at least 2 characters.')
    .max(30, 'Name must not be longer than 30 characters.'),
  dob: z.date({
    message: 'Please select your date of birth.',
  }),
  language: z.string({
    message: 'Please select a language.',
  }).min(1, 'Please select a language.'),
})

export type AccountFormValues = z.infer<typeof accountFormSchema>

const defaultValues: Partial<AccountFormValues> = {
  name: '',
}

export function useAccountViewModel() {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  })

  const onSubmit = async (data: AccountFormValues) => {
    try {
      await AccountRepository.updateAccount(data)
      // Visual feedback form toast for demo purposes
      showSubmittedData(data)
    } catch (error) {
      console.error('Failed to update account')
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit)
  }
}
