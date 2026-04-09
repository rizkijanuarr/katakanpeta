import { createFileRoute } from '@tanstack/react-router'
import { NotFoundError } from '@/features/settings/errors/not-found-error'

export const Route = createFileRoute('/(errors)/404')({
  component: NotFoundError,
})
