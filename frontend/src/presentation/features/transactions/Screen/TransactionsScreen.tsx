import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useTransactionsViewModel } from '../ViewModel/TransactionsViewModel'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'

export function TransactionsScreen() {
  const {
    transactions,
    isLoading,
    filter,
    setFilter,
    handleApprove,
    handleReject,
  } = useTransactionsViewModel()

  const [activeTab, setActiveTab] = useState('ALL')

  const statusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      PENDING: <Clock className='h-4 w-4 text-yellow-500' />,
      ACTIVE: <CheckCircle className='h-4 w-4 text-green-500' />,
      EXPIRED: <AlertCircle className='h-4 w-4 text-gray-500' />,
      REJECTED: <XCircle className='h-4 w-4 text-red-500' />,
    }
    return icons[status] || null
  }

  const tabs = [
    { label: 'All', value: 'ALL' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Rejected', value: 'REJECTED' },
  ]

  return (
    <>
      <Header>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold tracking-tight'>Transactions</h1>
          <p className='text-muted-foreground mt-1'>
            Manage and approve subscription requests
          </p>
        </div>

        {/* Filter Tabs */}
        <div className='flex gap-2 mb-6'>
          {tabs.map((tab) => (
            <Button
              key={tab.value}
              variant={activeTab === tab.value ? 'default' : 'outline'}
              size='sm'
              onClick={() => {
                setActiveTab(tab.value)
                setFilter(tab.value)
              }}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Transactions</CardTitle>
            <CardDescription>
              {activeTab === 'ALL' ? 'All' : activeTab} transactions ({transactions.length})
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='space-y-3'>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className='h-16 w-full' />
                ))}
              </div>
            ) : transactions.length > 0 ? (
              <div className='rounded-md border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>
                          <div>
                            <p className='font-medium'>{tx.user_name || 'Unknown'}</p>
                            <p className='text-sm text-muted-foreground'>
                              {tx.user_email || ''}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            {statusIcon(tx.status)}
                            <Badge
                              variant={tx.status === 'ACTIVE' ? 'default' : 'secondary'}
                            >
                              {tx.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(tx.createddate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {tx.start_date
                            ? new Date(tx.start_date).toLocaleDateString()
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {tx.end_date
                            ? new Date(tx.end_date).toLocaleDateString()
                            : '-'}
                        </TableCell>
                        <TableCell className='text-right'>
                          {tx.status === 'PENDING' && (
                            <div className='flex items-center justify-end gap-2'>
                              <Button
                                variant='default'
                                size='sm'
                                onClick={() => handleApprove(tx.id)}
                              >
                                <CheckCircle className='mr-1 h-3 w-3' />
                                Approve
                              </Button>
                              <Button
                                variant='outline'
                                size='sm'
                                className='text-destructive hover:text-destructive'
                                onClick={() => handleReject(tx.id)}
                              >
                                <XCircle className='mr-1 h-3 w-3' />
                                Reject
                              </Button>
                            </div>
                          )}
                          {tx.status !== 'PENDING' && (
                            <span className='text-sm text-muted-foreground'>
                              {tx.status === 'ACTIVE' ? 'Active' : 'Completed'}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className='flex h-[300px] flex-col items-center justify-center text-center'>
                <Clock className='h-12 w-12 text-muted-foreground mb-4 opacity-50' />
                <h2 className='text-xl font-semibold mb-2'>No transactions found</h2>
                <p className='text-muted-foreground'>
                  {activeTab !== 'ALL' ? 'Try a different filter' : 'No subscription requests yet'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
