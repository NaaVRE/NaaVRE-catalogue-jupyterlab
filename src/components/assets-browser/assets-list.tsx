import React, { ReactNode } from 'react';

import { ListItem, LoadingListItem } from './list-item';
import { Stack, Typography } from '@mui/material';
import { IBaseAsset } from '../../types/NaaVRECatalogue/BaseAssets';

export function AssetsList({
  assets,
  loading,
  message,
  fetchAssetsListResponse,
  button,
  filter,
  pageNav
}: {
  assets: Array<IBaseAsset>;
  loading: boolean;
  message: string | null;
  fetchAssetsListResponse: () => void;
  button?: ReactNode;
  filter?: ReactNode;
  pageNav?: ReactNode;
}) {
  return (
    <Stack>
      {filter && filter}
      {button && button}
      <>
        {loading ? (
          <>
            <LoadingListItem />
            <LoadingListItem />
          </>
        ) : (
          <>
            {message !== null && (
              <Typography variant="body1">{message}</Typography>
            )}
            {assets.map(asset => (
              <ListItem
                asset={asset}
                fetchAssetsListResponse={fetchAssetsListResponse}
              />
            ))}
          </>
        )}
      </>
      {pageNav && pageNav}
    </Stack>
  );
}
