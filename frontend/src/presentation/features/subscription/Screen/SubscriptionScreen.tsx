import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useSubscriptionViewModel } from '../ViewModel/SubscriptionViewModel'
import { CreditCard, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export function SubscriptionScreen() {
  const {
    subscription,
    transactions,
    isLoading,
    isSubscribing,
    handleSubscribe,
    getStatusColor,
    getDaysRemaining,
  } = useSubscriptionViewModel()

  const statusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      PENDING: <Clock className='h-5 w-5 text-yellow-500' />,
      ACTIVE: <CheckCircle className='h-5 w-5 text-green-500' />,
      EXPIRED: <AlertCircle className='h-5 w-5 text-gray-500' />,
      REJECTED: <XCircle className='h-5 w-5 text-red-500' />,
    }
    return icons[status] || null
  }

  if (isLoading) {
    return (
      <>
        <Header>
          <div className='ms-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <div className='space-y-4'>
            <Skeleton className='h-8 w-[200px]' />
            <Skeleton className='h-64 w-full' />
            <Skeleton className='h-64 w-full' />
          </div>
        </Main>
      </>
    )
  }

  return (
    <>
      <Header>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Subscription</h1>
            <p className='text-muted-foreground mt-1'>
              Manage your subscription and view transaction history
            </p>
          </div>
          {(!subscription || subscription.status === 'REJECTED') && (
            <Button onClick={handleSubscribe} disabled={isSubscribing}>
              <CreditCard className='mr-2 h-4 w-4' />
              {isSubscribing ? 'Requesting...' : 'Subscribe Now'}
            </Button>
          )}
        </div>

        {subscription ? (
          <Card className='mb-6'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                {statusIcon(subscription.status)}
                Current Subscription
              </CardTitle>
              <CardDescription>Your subscription status and details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>Status</span>
                  <Badge
                    variant={subscription.status === 'ACTIVE' ? 'default' : 'secondary'}
                    className={getStatusColor(subscription.status)}
                  >
                    {subscription.status}
                  </Badge>
                </div>

                {subscription.status === 'ACTIVE' && subscription.end_date && (
                  <>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-muted-foreground'>End Date</span>
                      <span className='font-medium'>
                        {new Date(subscription.end_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-muted-foreground'>Days Remaining</span>
                      <span className='font-medium'>
                        {getDaysRemaining(subscription.end_date)} days
                      </span>
                    </div>
                  </>
                )}

                {subscription.status === 'PENDING' && (
                  <div className='rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800'>
                    <AlertCircle className='mr-2 inline h-4 w-4' />
                    Your subscription is pending admin approval. Please wait for confirmation.
                  </div>
                )}

                {subscription.status === 'REJECTED' && (
                  <div className='rounded-lg bg-red-50 p-4 text-sm text-red-800'>
                    <XCircle className='mr-2 inline h-4 w-4' />
                    Your subscription was rejected. You can request a new subscription.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className='mb-6'>
            <CardContent className='pt-6'>
              <div className='flex flex-col items-center justify-center py-8 text-center'>
                <CreditCard className='h-12 w-12 text-muted-foreground mb-4 opacity-50' />
                <h3 className='text-lg font-semibold mb-2'>No Subscription Yet</h3>
                <p className='text-muted-foreground mb-4'>
                  Subscribe to access Google Maps scraping features
                </p>
                <Button onClick={handleSubscribe} disabled={isSubscribing}>
                  <CreditCard className='mr-2 h-4 w-4' />
                  {isSubscribing ? 'Requesting...' : 'Subscribe Now'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your subscription request history</CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <div className='space-y-3'>
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className='flex items-center justify-between rounded-lg border p-4'
                  >
                    <div className='flex items-center gap-3'>
                      {statusIcon(tx.status)}
                      <div>
                        <p className='font-medium'>{tx.status}</p>
                        <p className='text-sm text-muted-foreground'>
                          {new Date(tx.createddate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {tx.status === 'ACTIVE' && tx.end_date && (
                      <Badge variant='outline'>
                        {getDaysRemaining(tx.end_date)} days left
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className='py-8 text-center text-muted-foreground'>
                No transaction history
              </div>
            )}
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
