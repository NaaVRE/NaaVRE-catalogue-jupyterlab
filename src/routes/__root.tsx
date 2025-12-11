import React from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Container } from '@mui/material';

export const Route = createRootRoute({ component: RootLayout });

function RootLayout() {
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
