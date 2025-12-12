import React, { useEffect } from 'react';
import {
  createRootRoute,
  Outlet,
  useRouter,
  useRouterState
} from '@tanstack/react-router';
import { Container } from '@mui/material';

export const Route = createRootRoute({ component: RootLayout });

function RootLayout() {
  const { status, location } = useRouterState();
  const { basepath } = useRouter();
  // Workaround the fact that the path (#/...) is not added to the URL when the
  // app is first mounted
  useEffect(() => {
    if (
      status === 'idle' &&
      location.pathname === '/' &&
      !window.location.hash.startsWith(`#/${basepath}`)
    ) {
      history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}#/${basepath}`
      );
    }
  }, [status, location]);
  return (
    <Container
      sx={{
        width: '100vw',
        height: '100vh',
        padding: '1rem'
      }}
    >
      <Outlet />
    </Container>
  );
}
