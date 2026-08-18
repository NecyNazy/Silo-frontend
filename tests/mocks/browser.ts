import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { demoHandlers } from './handlers/demo';

// Demo handlers are local-dev-only (see handlers/demo.ts) and deliberately
// not part of the shared `handlers` array used by tests/setup.ts, so they
// never change unit/e2e test behavior.
export const worker = setupWorker(...handlers, ...demoHandlers);
