import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { useAuthStore } from '@/core/store/authStore'
import { AppScreen } from '@/core/common/AppScreen'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    const { isLoggedIn } = useAuthStore.getState()
    if (!isLoggedIn) {
      throw redirect({
        to: AppScreen.SIGN_IN,
        search: {
          redirect: window.location.pathname,
        },
      })
    }
  },
  component: AuthenticatedLayout,
})
