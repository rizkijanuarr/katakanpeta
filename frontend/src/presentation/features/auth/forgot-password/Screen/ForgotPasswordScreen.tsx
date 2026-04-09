import { Link } from '@tanstack/react-router'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Logo } from '@/assets/logo'
import { cn } from '@/lib/utils'
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
import { useForgotPasswordViewModel } from '../ViewModel/ForgotPasswordViewModel'

export function ForgotPasswordScreen() {
  const { form, isLoading, onSubmit } = useForgotPasswordViewModel()

  return (
    <div className='relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
          <div className='mb-4 flex items-center justify-center'>
            <Logo className='me-2' />
            <h1 className='text-xl font-medium'>Shadcn Admin</h1>
          </div>
        </div>
        <div className='mx-auto flex w-full max-w-sm flex-col justify-center space-y-2'>
          <div className='flex flex-col space-y-2 text-start'>
            <h2 className='text-lg font-semibold tracking-tight'>Forgot Password</h2>
            <p className='text-sm text-muted-foreground'>
              Enter your registered email and <br /> we will send you a link to
              reset your password.
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={onSubmit} className='grid gap-2'>
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
              <Button className='mt-2' disabled={isLoading}>
                Continue
                {isLoading ? <Loader2 className='animate-spin' /> : <ArrowRight />}
              </Button>
            </form>
          </Form>

          <p className='mx-auto px-8 text-center text-sm text-balance text-muted-foreground'>
            Don't have an account?{' '}
            <Link
              to='/sign-up'
              className='underline underline-offset-4 hover:text-primary'
            >
              Sign up
            </Link>
            .
          </p>
        </div>
      </div>

      <div
        className={cn(
          'relative h-full overflow-hidden max-lg:hidden',
          'bg-gradient-to-br from-primary/20 via-muted to-primary/10'
        )}
      >
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='text-center text-muted-foreground'>
            <Logo className='mx-auto mb-4 h-16 w-16 opacity-20' />
          </div>
        </div>
      </div>
    </div>
  )
}
