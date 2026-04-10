import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useUsersViewModel } from '../ViewModel/UsersViewModel'
import { UserFormDialog } from '../components/UserFormDialog'
import { DeleteUserDialog } from '../components/DeleteUserDialog'
import { Plus, Pencil, Trash2, Users } from 'lucide-react'

export function UsersScreen() {
  const {
    users,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    editingUser,
    deleteConfirm,
    setDeleteConfirm,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
  } = useUsersViewModel()

  return (
    <>
      <Header />

      <Main>
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Users Management</h1>
            <p className='text-muted-foreground mt-1'>
              Manage all registered users on the platform
            </p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className='mr-2 h-4 w-4' />
            Add User
          </Button>
        </div>

        {isLoading ? (
          <div className='space-y-4'>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className='h-16 w-full' />
            ))}
          </div>
        ) : users.length > 0 ? (
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className='font-medium'>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.active ? 'default' : 'destructive'}>
                        {user.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex items-center justify-end gap-2'>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => openEditDialog(user)}
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='text-destructive hover:text-destructive'
                          onClick={() => openDeleteDialog(user)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className='flex h-[400px] flex-col items-center justify-center rounded-lg border text-center'>
            <Users className='h-12 w-12 text-muted-foreground mb-4' />
            <h2 className='text-xl font-semibold mb-2'>No users found</h2>
            <p className='text-muted-foreground mb-4'>
              Get started by creating your first user
            </p>
            <Button onClick={openCreateDialog}>
              <Plus className='mr-2 h-4 w-4' />
              Add User
            </Button>
          </div>
        )}
      </Main>

      {/* Create/Edit User Dialog */}
      <UserFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingUser={editingUser}
        onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteUserDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
        user={deleteConfirm}
        onConfirm={() => deleteConfirm && handleDeleteUser(deleteConfirm.id)}
      />
    </>
  )
}
