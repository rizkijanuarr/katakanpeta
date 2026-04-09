import { useState, useEffect } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { UsersRepository } from '../Repository/UsersRepository'
import { User } from '../Model/UserSchema'

const route = getRouteApi('/_authenticated/users/')

export function useUsersViewModel() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        const data = await UsersRepository.getUsers()
        setUsers(data)
      } catch (error) {
        console.error('Failed to fetch users:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return {
    users,
    search,
    navigate,
    isLoading
  }
}
