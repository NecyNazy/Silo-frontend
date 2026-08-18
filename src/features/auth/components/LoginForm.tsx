import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, FormAlert, Input, Label } from '@/shared/components';
import { getErrorMessage } from '@/shared/lib/error';
import { useLogin } from '../hooks';
import { loginSchema, type LoginFormValues } from '../schemas';

const DEMO_ACCOUNTS_ENABLED = import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCKS !== 'false';

const DEMO_ACCOUNTS = [
  { label: 'Demo member', email: 'seed-member@silo.dev', password: 'password123' },
  { label: 'Demo officer', email: 'seed-officer@silo.dev', password: 'password123' },
];

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });
  const loginMutation = useLogin();

  return (
    <div className="space-y-6">
      <form
        className="space-y-4"
        onSubmit={handleSubmit((values) => loginMutation.mutate(values))}
        noValidate
      >
        <FormAlert message={loginMutation.isError ? getErrorMessage(loginMutation.error) : null} />

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...register('email')} />
          {errors.email && (
            <p role="alert" className="text-xs text-danger">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register('password')}
          />
          {errors.password && (
            <p role="alert" className="text-xs text-danger">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" isLoading={loginMutation.isPending}>
          Sign in
        </Button>
      </form>

      {DEMO_ACCOUNTS_ENABLED && (
        <div className="space-y-2 border-t border-border-subtle pt-5">
          <p className="text-xs text-text-muted">
            No backend running? Try the app with seed data, no server required.
          </p>
          <div className="flex gap-2">
            {DEMO_ACCOUNTS.map((account) => (
              <Button
                key={account.email}
                type="button"
                variant="outline"
                size="sm"
                className="flex-1"
                isLoading={loginMutation.isPending}
                onClick={() =>
                  loginMutation.mutate({ email: account.email, password: account.password })
                }
              >
                {account.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
