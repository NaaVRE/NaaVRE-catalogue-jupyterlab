import React, { useContext, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import RefreshIcon from '@mui/icons-material/Refresh';

import { AssetsList } from './assets-list';
import { PageNav } from './page-nav';
import { ListFilters } from './list-filters';
import { SettingsContext } from '../../settings';
import { useCatalogueList } from '../../hooks/use-catalogue-list';
import {
  IBaseAsset,
  ISharingScope
} from '../../types/NaaVRECatalogue/BaseAssets';
import { SharingScopesContext } from '../../contexts/SharingScopesContext';
import { useUserInfo } from '../../hooks/use-user-info';
import { UserInfoContext } from '../../contexts/UserInfoContext';
import { AssetKind } from './asset-kinds';

export function AssetsBrowser({ assetKind }: { assetKind: AssetKind }) {
  const settings = useContext(SettingsContext);
  const {
    setUrl: setAssetsListUrl,
    setInitialPath: setAssetsListInitialPath,
    loading,
    errorMessage,
    fetchResponse: fetchAssetsListResponse,
    response: assetsListResponse
  } = useCatalogueList<IBaseAsset>({
    settings,
    initialPath: `${assetKind.cataloguePath}/?ordering=-created`
  });

  useEffect(() => {
    setAssetsListInitialPath(`${assetKind.cataloguePath}/?ordering=-created`);
  }, [assetKind.cataloguePath]);

  const { response: sharingScopesResponse } = useCatalogueList<ISharingScope>({
    settings,
    initialPath: 'sharing-scopes/?page_size=100',
    getAllPages: true
  });

  const userInfo = useUserInfo();

  return (
    <SharingScopesContext.Provider value={sharingScopesResponse.results}>
      <UserInfoContext.Provider value={userInfo}>
        <AssetsList
          assets={assetsListResponse.results}
          loading={loading}
          message={
            errorMessage
              ? errorMessage
              : assetsListResponse.count === 0
                ? `There are no ${assetKind.title} in your catalogue.`
                : null
          }
          fetchAssetsListResponse={fetchAssetsListResponse}
          button={
            <Tooltip title="Refresh" arrow>
              <IconButton
                aria-label="Reload"
                style={{ borderRadius: '100%' }}
                onClick={() => fetchAssetsListResponse()}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          }
          filter={<ListFilters setUrl={setAssetsListUrl} />}
          pageNav={
            <PageNav
              listResponse={assetsListResponse}
              setUrl={setAssetsListUrl}
            />
          }
        />
      </UserInfoContext.Provider>
    </SharingScopesContext.Provider>
  );
}
