import React, { StrictMode } from 'react';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { createSyncedMemoryHistory } from './url-hash-sync';

export const BASEPATH = 'naavre-catalogue';
export const URL_RE = new RegExp(String.raw`#\/${BASEPATH}($|\/)`);

const { history, setFocused } = createSyncedMemoryHistory(
  `/${BASEPATH}`
);

const router = createRouter({
  routeTree,
  history,
  basepath: BASEPATH
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  // Tanstack router requires `Register` interface, which differs from Jupyter
  // lab's naming rule. We ignore the rule here to avoid lint errors.
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Register {
    router: typeof router;
  }
}

export { setFocused };

export function App() {
  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
