import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import './index.css';

async function prepare() {
  if (import.meta.env.VITE_ENABLE_MOCKS === 'false') return;

  const { worker } = await import('../tests/mocks/browser');
  return worker.start({ onUnhandledRequest: 'bypass' });
}

prepare().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
