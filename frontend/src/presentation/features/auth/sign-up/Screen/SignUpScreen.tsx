import { Link } from '@tanstack/react-router'
import { Logo } from '@/assets/logo'
import { IconFacebook, IconGithub } from '@/assets/brand-icons'
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
import { PasswordInput } from '@/components/password-input'
import { useSignUpViewModel } from '../ViewModel/SignUpViewModel'

export function SignUpScreen() {
  const { form, isLoading, onSubmit } = useSignUpViewModel()

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
            <h2 className='text-lg font-semibold tracking-tight'>Create an account</h2>
            <p className='text-sm text-muted-foreground'>
              Enter your email and password to create an account. <br />
              Already have an account?{' '}
              <Link
                to='/sign-in-2'
                className='underline underline-offset-4 hover:text-primary'
              >
                Sign In
              </Link>
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={onSubmit} className='grid gap-3'>
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder='********' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder='********' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className='mt-2' disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <div className='relative my-2'>
                <div className='absolute inset-0 flex items-center'>
                  <span className='w-full border-t' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                  <span className='bg-background px-2 text-muted-foreground'>
                    Or continue with
                  </span>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-2'>
                <Button variant='outline' className='w-full' type='button' disabled={isLoading}>
                  <IconGithub className='h-4 w-4' /> GitHub
                </Button>
                <Button variant='outline' className='w-full' type='button' disabled={isLoading}>
                  <IconFacebook className='h-4 w-4' /> Facebook
                </Button>
              </div>
            </form>
          </Form>

          <p className='px-8 text-center text-sm text-muted-foreground'>
            By creating an account, you agree to our{' '}
            <a href='/terms' className='underline underline-offset-4 hover:text-primary'>
              Terms of Service
            </a>{' '}
            and{' '}
            <a href='/privacy' className='underline underline-offset-4 hover:text-primary'>
              Privacy Policy
            </a>
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
