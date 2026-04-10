import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboardViewModel } from '../ViewModel/DashboardViewModel'
import {
  Activity,
  Database,
  Users,
  Clock,
  AlertCircle,
  CreditCard,
  TrendingUp,
} from 'lucide-react'

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color = 'blue',
}: {
  title: string
  value: string | number
  description?: string
  icon: any
  color?: string
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-500',
    green: 'bg-green-500/10 text-green-500',
    orange: 'bg-orange-500/10 text-orange-500',
    purple: 'bg-purple-500/10 text-purple-500',
    red: 'bg-red-500/10 text-red-500',
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <div className={`rounded-lg p-2 ${colorClasses[color] || colorClasses.blue}`}>
          <Icon className='h-4 w-4' />
        </div>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        {description && (
          <p className='text-xs text-muted-foreground mt-1'>{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

function UserDashboardContent({ data }: { data: any }) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: 'bg-green-500',
      PENDING: 'bg-yellow-500',
      EXPIRED: 'bg-gray-500',
      REJECTED: 'bg-red-500',
    }
    return colors[status] || 'bg-gray-500'
  }

  return (
    <div className='space-y-6'>
      {/* Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
          <CardDescription>Your current subscription details</CardDescription>
        </CardHeader>
        <CardContent>
          {data?.subscription ? (
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className={`h-3 w-3 rounded-full ${getStatusColor(data.subscription.status)}`} />
                  <span className='font-medium'>{data.subscription.status || 'No Subscription'}</span>
                </div>
                {data.subscription.days_remaining !== null && (
                  <Badge variant={data.subscription.days_remaining > 7 ? 'default' : 'destructive'}>
                    {data.subscription.days_remaining} days remaining
                  </Badge>
                )}
              </div>
              
              {data.subscription.start_date && (
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div>
                    <p className='text-muted-foreground'>Start Date</p>
                    <p className='font-medium'>
                      {new Date(data.subscription.start_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className='text-muted-foreground'>End Date</p>
                    <p className='font-medium'>
                      {new Date(data.subscription.end_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className='text-center py-4 text-muted-foreground'>
              <AlertCircle className='mx-auto h-8 w-8 mb-2 opacity-50' />
              <p>No active subscription</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <StatCard
          title='Total Scrapes'
          value={data?.total_scrapes || 0}
          description='Total Google Maps scrapes'
          icon={Database}
          color='blue'
        />
        <StatCard
          title='Recent Scrapes'
          value={data?.recent_scrapes?.length || 0}
          description='Last 5 scrapes'
          icon={Activity}
          color='green'
        />
        <StatCard
          title='Subscription Days'
          value={data?.subscription?.days_remaining || 0}
          description='Days until expiration'
          icon={Clock}
          color='orange'
        />
      </div>

      {/* Recent Scrapes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Scrapes</CardTitle>
          <CardDescription>Your latest scrape operations</CardDescription>
        </CardHeader>
        <CardContent>
          {data?.recent_scrapes && data.recent_scrapes.length > 0 ? (
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b'>
                    <th className='text-left py-3 px-4 font-medium'>Query</th>
                    <th className='text-left py-3 px-4 font-medium'>Date</th>
                    <th className='text-right py-3 px-4 font-medium'>Results</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent_scrapes.map((scrape: any) => (
                    <tr key={scrape.id} className='border-b hover:bg-muted/50'>
                      <td className='py-3 px-4'>{scrape.query}</td>
                      <td className='py-3 px-4'>
                        {new Date(scrape.createddate).toLocaleDateString()}
                      </td>
                      <td className='py-3 px-4 text-right'>
                        <Badge variant='secondary'>{scrape.result_count}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='text-center py-8 text-muted-foreground'>
              <Database className='mx-auto h-8 w-8 mb-2 opacity-50' />
              <p>No scrapes yet. Start scraping to see your history here!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function AdminDashboardContent({ data }: { data: any }) {
  return (
    <div className='space-y-6'>
      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          title='Total Users'
          value={data?.total_users || 0}
          description='Registered users'
          icon={Users}
          color='blue'
        />
        <StatCard
          title='Total Transactions'
          value={data?.total_transactions || 0}
          description='All subscription requests'
          icon={CreditCard}
          color='purple'
        />
        <StatCard
          title='Pending Approvals'
          value={data?.pending_approvals || 0}
          description='Awaiting your approval'
          icon={AlertCircle}
          color='orange'
        />
        <StatCard
          title='Active Subscriptions'
          value={data?.active_subscriptions || 0}
          description='Currently active'
          icon={TrendingUp}
          color='green'
        />
      </div>

      {/* Total Scrapes Card */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Usage</CardTitle>
          <CardDescription>Total scrapes across all users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between'>
            <div>
              <div className='text-4xl font-bold'>{data?.total_scrapes || 0}</div>
              <p className='text-sm text-muted-foreground mt-1'>Total Google Maps scrapes</p>
            </div>
            <Database className='h-12 w-12 text-primary opacity-50' />
          </div>
        </CardContent>
      </Card>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>Latest registered users</CardDescription>
        </CardHeader>
        <CardContent>
          {data?.recent_users && data.recent_users.length > 0 ? (
            <div className='space-y-3'>
              {data.recent_users.slice(0, 5).map((user: any) => (
                <div key={user.id} className='flex items-center justify-between py-2'>
                  <div className='flex items-center gap-3'>
                    <div className='h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center'>
                      <span className='text-sm font-medium'>{user.name?.charAt(0) || 'U'}</span>
                    </div>
                    <div>
                      <p className='text-sm font-medium'>{user.name}</p>
                      <p className='text-xs text-muted-foreground'>{user.email}</p>
                    </div>
                  </div>
                  <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex h-[200px] items-center justify-center text-muted-foreground'>
              No users yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function DashboardScreen() {
  const { isLoading, error, userRole, userDashboard, adminDashboard } = useDashboardViewModel()

  if (isLoading) {
    return (
      <>
        <Header />
        <Main>
          <div className='space-y-4'>
            <Skeleton className='h-8 w-[200px]' />
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className='h-32' />
              ))}
            </div>
          </div>
        </Main>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <Main>
          <div className='flex h-[400px] flex-col items-center justify-center text-center'>
            <AlertCircle className='h-12 w-12 text-destructive mb-4' />
            <h2 className='text-xl font-semibold mb-2'>Failed to load dashboard</h2>
            <p className='text-muted-foreground'>{error}</p>
          </div>
        </Main>
      </>
    )
  }

  return (
    <>
      <Header />

      <Main>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold tracking-tight'>
            {userRole === 'ADMIN' ? 'Admin Dashboard' : 'Dashboard'}
          </h1>
          <p className='text-muted-foreground mt-1'>
            {userRole === 'ADMIN' 
              ? 'Monitor and manage your platform' 
              : 'Monitor your subscription and scrape activity'}
          </p>
        </div>

        {userRole === 'ADMIN' && adminDashboard ? (
          <AdminDashboardContent data={adminDashboard} />
        ) : (
          <UserDashboardContent data={userDashboard} />
        )}
      </Main>
    </>
  )
}
