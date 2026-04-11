import { createFileRoute } from '@tanstack/react-router'
import { LandingScreen } from '@/features/landing/Screen/LandingScreen'

export const Route = createFileRoute('/')({
  component: LandingScreen,
})
