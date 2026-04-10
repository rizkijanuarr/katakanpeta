import {
  LayoutDashboard,
  Settings,
  Wrench,
  Users,
  Command,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Shadcn Admin',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'Admin',
      roles: ['ADMIN'], // Only ADMIN can see this group
      items: [
        {
          title: 'Users',
          url: '/users',
          icon: Users,
        },
      ],
    },

    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Account',
              url: '/settings/account',
              icon: Wrench,
            },
          ],
        },
      ],
    },
  ],
}

