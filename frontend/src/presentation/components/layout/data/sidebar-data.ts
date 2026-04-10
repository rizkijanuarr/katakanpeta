import {
  LayoutDashboard,
  Users,
  Command,
  Search,
  CreditCard,
  FileText,
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
        {
          title: 'Scraper',
          url: '/scraper',
          icon: Search,
        },
        {
          title: 'Subscription',
          url: '/subscription',
          icon: CreditCard,
        },
      ],
    },
    {
      title: 'Admin',
      roles: ['ADMIN'],
      items: [
        {
          title: 'Users',
          url: '/users',
          icon: Users,
        },
        {
          title: 'Transactions',
          url: '/transactions',
          icon: FileText,
        },
      ],
    },
  ],
}
