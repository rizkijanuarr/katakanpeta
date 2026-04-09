import { createFileRoute } from '@tanstack/react-router'
import { AccountScreen } from '@/features/settings/account/Screen/AccountScreen'

export const Route = createFileRoute('/_authenticated/settings/account')({
  component: AccountScreen,
})
