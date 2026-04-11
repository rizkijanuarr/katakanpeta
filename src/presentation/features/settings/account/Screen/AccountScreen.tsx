import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { networkModule } from '@/core/network/NetworkModule'
import { AppRoutes } from '@/core/common/AppRoutes'
import { User, Mail, Shield, Calendar, Activity } from 'lucide-react'
import { toast } from 'sonner'

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  active: boolean
  createdDate: string
  modifiedDate: string | null
}

export function AccountScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await networkModule.request<{ success: boolean; message: string; data: UserProfile }>(AppRoutes.AUTH.ME, {
          method: 'GET',
          requiresAuth: true,
        })
        setProfile(response.data)
      } catch (error: any) {
        toast.error('Failed to load profile', {
          description: error?.message || 'Could not fetch user profile',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (isLoading) {
    return (
      <>
        <Header breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Account' }]} />
        <Main>
          <div className='mb-8'>
            <Skeleton className='h-8 w-[200px] mb-2' />
            <Skeleton className='h-4 w-[300px]' />
          </div>
          <div className='grid gap-4 md:grid-cols-2'>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className='h-32' />
            ))}
          </div>
        </Main>
      </>
    )
  }

  return (
    <>
      <Header breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Account' }]} />

      <Main>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold tracking-tight'>Account</h1>
          <p className='text-muted-foreground mt-1'>
            View your account profile and details
          </p>
        </div>

        {profile && (
          <div className='grid gap-6 md:grid-cols-2'>
            {/* Profile Overview */}
            <Card className='md:col-span-2'>
              <CardHeader>
                <CardTitle>Profile Overview</CardTitle>
                <CardDescription>Your basic account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex items-start gap-6'>
                  <div className='h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary'>
                    {profile.name?.charAt(0) || 'U'}
                  </div>
                  <div className='flex-1 space-y-4'>
                    <div>
                      <h2 className='text-2xl font-bold'>{profile.name}</h2>
                      <p className='text-muted-foreground'>{profile.email}</p>
                    </div>
                    <div className='flex gap-2'>
                      <Badge variant={profile.role === 'ADMIN' ? 'default' : 'secondary'}>
                        {profile.role}
                      </Badge>
                      <Badge variant={profile.active ? 'default' : 'destructive'}>
                        {profile.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Details */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <User className='h-5 w-5' />
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <User className='h-4 w-4' />
                    Name
                  </div>
                  <span className='font-medium'>{profile.name}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <Mail className='h-4 w-4' />
                    Email
                  </div>
                  <span className='font-medium'>{profile.email}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <Shield className='h-4 w-4' />
                    Role
                  </div>
                  <span className='font-medium'>{profile.role}</span>
                </div>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Activity className='h-5 w-5' />
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <Activity className='h-4 w-4' />
                    Status
                  </div>
                  <Badge variant={profile.active ? 'default' : 'destructive'}>
                    {profile.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <Calendar className='h-4 w-4' />
                    Created
                  </div>
                  <span className='font-medium'>
                    {new Date(profile.createdDate).toLocaleDateString()}
                  </span>
                </div>
                {profile.modifiedDate && (
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                      <Calendar className='h-4 w-4' />
                      Last Modified
                    </div>
                    <span className='font-medium'>
                      {new Date(profile.modifiedDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </Main>
    </>
  )
}
