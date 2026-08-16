import type { ReactNode } from 'react';
import './theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
