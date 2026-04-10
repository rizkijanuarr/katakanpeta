import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { useAuthStore } from '@/core/store/authStore'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { state } = useSidebar()
  const userRole = useAuthStore((state) => state.user?.role)

  // Filter navGroups based on user role
  const filteredNavGroups = sidebarData.navGroups.filter((group) => {
    if (!group.roles || group.roles.length === 0) return true
    return userRole && group.roles.includes(userRole)
  })

  const isCollapsed = state === 'collapsed'

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <div className='flex items-center gap-2 px-4 py-2'>
          <h1 className='text-lg font-bold'>
            {isCollapsed ? 'KP' : 'KatakanPeta'}
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {filteredNavGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
