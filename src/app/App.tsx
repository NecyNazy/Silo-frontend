import { BrowserRouter } from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { AppRouter } from './router';
import { ErrorBoundary } from './screens/ErrorBoundary';

export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryProvider>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </QueryProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
