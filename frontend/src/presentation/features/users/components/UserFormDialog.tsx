import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { User, CreateUserRequest, UpdateUserRequest } from '../Model/UserSchema'
import { Loader2 } from 'lucide-react'

const userFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(7, 'Password must be at least 7 characters').optional(),
  role: z.enum(['ADMIN', 'USER']),
})

type UserFormValues = z.infer<typeof userFormSchema>

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingUser: User | null
  onSubmit: (id: string, data: UpdateUserRequest) => Promise<void> | ((data: CreateUserRequest) => Promise<void>)
}

export function UserFormDialog({ open, onOpenChange, editingUser, onSubmit }: UserFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'USER',
    },
  })

  useEffect(() => {
    if (editingUser) {
      form.reset({
        name: editingUser.name,
        email: editingUser.email,
        password: '',
        role: editingUser.role,
      })
    } else {
      form.reset({
        name: '',
        email: '',
        password: '',
        role: 'USER',
      })
    }
  }, [editingUser, open])

  const handleSubmit = async (data: UserFormValues) => {
    setIsLoading(true)
    try {
      if (editingUser) {
        const updateData: UpdateUserRequest = {
          name: data.name,
          email: data.email,
          role: data.role,
        }
        if (data.password) {
          updateData.password = data.password
        }
        await (onSubmit as (id: string, data: UpdateUserRequest) => Promise<void>)(editingUser.id, updateData)
      } else {
        const createData: CreateUserRequest = {
          name: data.name,
          email: data.email,
          password: data.password || 'password123',
          role: data.role,
        }
        await (onSubmit as (data: CreateUserRequest) => Promise<void>)(createData)
      }
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{editingUser ? 'Edit User' : 'Create User'}</DialogTitle>
          <DialogDescription>
            {editingUser
              ? 'Update user information and role'
              : 'Add a new user to the platform'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='John Doe' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='name@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password {editingUser && '(leave empty to keep current)'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder={editingUser ? '••••••••' : 'password123'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a role' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='USER'>User</SelectItem>
                      <SelectItem value='ADMIN'>Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    {editingUser ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>{editingUser ? 'Update User' : 'Create User'}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
