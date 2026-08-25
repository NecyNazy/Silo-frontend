import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, FormAlert, Input, Label } from '@/shared/components';
import { getErrorMessage } from '@/shared/lib/error';
import { useRegister } from '../hooks';
import { registerSchema, type RegisterFormValues } from '../schemas';

export function RegisterForm() {
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });
  const registerMutation = useRegister();

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((values) => registerMutation.mutate(values))}
      noValidate
    >
      <FormAlert
        message={registerMutation.isError ? getErrorMessage(registerMutation.error) : null}
      />

      <div className="space-y-1.5">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" autoComplete="name" {...registerField('fullName')} />
        {errors.fullName && (
          <p role="alert" className="text-xs text-danger">
            {errors.fullName.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...registerField('email')} />
        {errors.email && (
          <p role="alert" className="text-xs text-danger">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phoneNumber">Phone</Label>
        <Input
          id="phoneNumber"
          type="tel"
          autoComplete="tel"
          placeholder="08012345678"
          {...registerField('phoneNumber')}
        />
        {errors.phoneNumber && (
          <p role="alert" className="text-xs text-danger">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...registerField('password')}
        />
        {errors.password && (
          <p role="alert" className="text-xs text-danger">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" isLoading={registerMutation.isPending}>
        Create account
      </Button>
    </form>
  );
}
