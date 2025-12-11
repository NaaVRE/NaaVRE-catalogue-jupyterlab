import React, { StrictMode } from 'react';
import {
  createMemoryHistory,
  createRouter,
  RouterProvider
} from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

const router = createRouter({ routeTree, history: createMemoryHistory() });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
