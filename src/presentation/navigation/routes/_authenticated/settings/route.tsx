import { createFileRoute } from '@tanstack/react-router'
import { SettingsScreen } from '@/features/settings/Screen/SettingsScreen'

export const Route = createFileRoute('/_authenticated/settings')({
  component: SettingsScreen,
})
