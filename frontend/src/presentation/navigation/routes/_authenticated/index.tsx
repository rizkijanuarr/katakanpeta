import { createFileRoute } from '@tanstack/react-router'
import { DashboardScreen } from '@/features/dashboard/Screen/DashboardScreen'

export const Route = createFileRoute('/_authenticated/')({
  component: DashboardScreen,
})
