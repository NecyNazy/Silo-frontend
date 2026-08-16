import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, FormAlert, Input, Label } from '@/shared/components';
import { getErrorMessage } from '@/shared/lib/error';
import { useLogin } from '../hooks';
import { loginSchema, type LoginFormValues } from '../schemas';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });
  const loginMutation = useLogin();

  return (
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
          <p role="alert" className="text-xs text-red-600 dark:text-red-400">
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
          <p role="alert" className="text-xs text-red-600 dark:text-red-400">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" isLoading={loginMutation.isPending}>
        Sign in
      </Button>
    </form>
  );
}
