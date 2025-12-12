import React, { useEffect, useState } from 'react';
import {
  createRootRoute,
  Outlet,
  useRouter,
  useRouterState
} from '@tanstack/react-router';
import { Container } from '@mui/material';

export const Route = createRootRoute({ component: RootLayout });

function RootLayout() {
  // Workaround the fact that the path (#/...) is not added to the URL when the
  // app is first mounted
  const { status, location } = useRouterState();
  const { basepath } = useRouter();
  const [isHashInitialized, setIsHashInitialized] = useState(false);
  useEffect(() => {
    if (
      !isHashInitialized &&
      status === 'idle' &&
      location.pathname === '/' &&
      !window.location.hash.startsWith(`#/${basepath}`)
    ) {
      console.log(status, location, basepath, window.location.hash);
      console.debug('replacing');
      history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}#/${basepath}`
      );
      setIsHashInitialized(true);
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
