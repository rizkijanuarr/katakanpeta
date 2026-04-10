import { createFileRoute } from '@tanstack/react-router'
import { SubscriptionScreen } from '@/features/subscription/Screen/SubscriptionScreen'

export const Route = createFileRoute('/_authenticated/subscription/')({
  component: SubscriptionScreen,
})
