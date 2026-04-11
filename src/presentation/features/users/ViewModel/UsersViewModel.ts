import { useState, useEffect } from 'react'
import { UsersRepository } from '../Repository/UsersRepository'
import { User, CreateUserRequest, UpdateUserRequest } from '../Model/UserSchema'
import { toast } from 'sonner'

export function useUsersViewModel() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<User | null>(null)

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const data = await UsersRepository.getUsers()
      setUsers(data)
    } catch (error: any) {
      toast.error('Failed to fetch users', {
        description: error?.message || 'Could not load users',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleCreateUser = async (data: CreateUserRequest) => {
    try {
      await UsersRepository.createUser(data)
      toast.success('User created', {
        description: `${data.name} has been created successfully`,
      })
      setIsDialogOpen(false)
      await fetchUsers()
    } catch (error: any) {
      toast.error('Failed to create user', {
        description: error?.message || 'Could not create user',
      })
      throw error
    }
  }

  const handleUpdateUser = async (id: string, data: UpdateUserRequest) => {
    try {
      await UsersRepository.updateUser(id, data)
      toast.success('User updated', {
        description: `${data.name || 'User'} has been updated successfully`,
      })
      setIsDialogOpen(false)
      setEditingUser(null)
      await fetchUsers()
    } catch (error: any) {
      toast.error('Failed to update user', {
        description: error?.message || 'Could not update user',
      })
      throw error
    }
  }

  const handleDeleteUser = async (id: string) => {
    try {
      await UsersRepository.deleteUser(id)
      toast.success('User deleted', {
        description: 'User has been deleted successfully',
      })
      setDeleteConfirm(null)
      await fetchUsers()
    } catch (error: any) {
      toast.error('Failed to delete user', {
        description: error?.message || 'Could not delete user',
      })
      throw error
    }
  }

  const openCreateDialog = () => {
    setEditingUser(null)
    setIsDialogOpen(true)
  }

  const openEditDialog = (user: User) => {
    setEditingUser(user)
    setIsDialogOpen(true)
  }

  const openDeleteDialog = (user: User) => {
    setDeleteConfirm(user)
  }

  return {
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
  }
}
