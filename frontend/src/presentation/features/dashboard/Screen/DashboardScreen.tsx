import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useDashboardViewModel } from '../ViewModel/DashboardViewModel'

export function DashboardScreen() {
  useDashboardViewModel()

  return (
    <>
      <Header>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
      </Main>
    </>
  )
}
