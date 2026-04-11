import { ConfirmDialog } from '@/components/confirm-dialog'
import { useLogoutViewModel } from '@/features/auth/ViewModel/LogoutViewModel'

interface SignOutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const { isLoading, handleLogout } = useLogoutViewModel()

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Sign out'
      desc='Are you sure you want to sign out? You will need to sign in again to access your account.'
      confirmText={isLoading ? 'Signing out...' : 'Sign out'}
      destructive
      handleConfirm={handleLogout}
      className='sm:max-w-sm'
    />
  )
}
