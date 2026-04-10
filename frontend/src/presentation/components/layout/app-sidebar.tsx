import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { useAuthStore } from '@/core/store/authStore'
import { ThemeSwitch } from '@/components/theme-switch'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const userRole = useAuthStore((state) => state.user?.role)

  // Filter navGroups based on user role
  const filteredNavGroups = sidebarData.navGroups.filter((group) => {
    if (!group.roles || group.roles.length === 0) return true
    return userRole && group.roles.includes(userRole)
  })

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <div className='flex items-center gap-2 px-4 py-2'>
          <h1 className='text-lg font-bold'>KatakanPeta</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {filteredNavGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className='flex items-center gap-2 px-2 py-2'>
          <ThemeSwitch />
        </div>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
