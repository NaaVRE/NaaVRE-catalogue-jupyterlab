import React from 'react';

import { ListFiltersSearch } from './list-filters-search';
import { ListFiltersOrdering } from './list-filters-ordering';
import { ListFiltersCheckboxes } from './list-filters-checkboxes';

export function updateSearchParams(
  url: string | null,
  params: { [key: string]: string | null }
): string | null {
  if (url === null) {
    return null;
  }
  const newUrl = new URL(url);
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === '') {
      newUrl.searchParams.delete(key);
    } else {
      newUrl.searchParams.set(key, value);
    }
  }
  return newUrl.toString();
}

export function ListFilters({
  setUrl
}: {
  setUrl: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  return (
    <>
      <ListFiltersSearch setUrl={setUrl} />
      <ListFiltersCheckboxes setUrl={setUrl} />
      <ListFiltersOrdering setUrl={setUrl} />
    </>
  );
}
