import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { server } from '../../../../../tests/mocks/server';
import { useAuthStore } from '../../store';
import { LoginForm } from '../LoginForm';

function renderLoginForm() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('LoginForm', () => {
  it('shows validation errors for empty submission', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/valid email address/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it('logs in with valid credentials', async () => {
    server.use(
      http.post('/api/auth/login', () =>
        HttpResponse.json({
          success: true,
          message: null,
          data: {
            accessToken: 'test-access-token',
            refreshToken: 'test-refresh-token',
            memberId: 'test-member-id',
            role: 'MEMBER',
          },
          timestamp: new Date().toISOString(),
        }),
      ),
    );

    const user = userEvent.setup();
    renderLoginForm();

    await user.type(screen.getByLabelText(/email/i), 'member@silo.dev');
    await user.type(screen.getByLabelText(/password/i), 'anything');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => expect(useAuthStore.getState().isAuthenticated).toBe(true));
    expect(useAuthStore.getState().role).toBe('MEMBER');
  });
});
