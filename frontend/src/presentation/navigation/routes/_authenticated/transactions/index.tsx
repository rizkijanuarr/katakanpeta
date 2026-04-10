import { createFileRoute } from '@tanstack/react-router'
import { TransactionsScreen } from '@/features/transactions/Screen/TransactionsScreen'

export const Route = createFileRoute('/_authenticated/transactions/')({
  component: TransactionsScreen,
})
