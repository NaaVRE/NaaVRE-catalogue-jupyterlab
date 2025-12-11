import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/assets/$assetKindSlug')({
  component: RouteComponent
});

function RouteComponent() {
  const { assetKindSlug } = Route.useParams();
  return <div>{`Hello ${assetKindSlug}!`}</div>;
}
