import React, { useContext, useRef, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ShareIcon from '@mui/icons-material/Share';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import Box from '@mui/material/Box';
import { ShareDialog } from './share-dialog';
import { UserInfoContext } from '../../contexts/UserInfoContext';
import { TooltipOverflowLabel } from '../common/tooltip-overflow-label';
import { IBaseAsset } from '../../types/NaaVRECatalogue/BaseAssets';

function AssetTitle({
  asset,
  userIsOwner,
  sx
}: {
  asset: IBaseAsset;
  userIsOwner: boolean;
  sx?: SxProps;
}) {
  const regex = new RegExp(`-${asset.owner}$`);
  const title = asset.title.replace(regex, '');

  return (
    <Stack sx={sx}>
      <TooltipOverflowLabel variant="subtitle2" label={title} />
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center'
        }}
      >
        <LocalOfferIcon color="action" fontSize="inherit" />
        {/*FIXME: only show for cell?*/}
        {/*<Typography variant="body2">v{asset.version}</Typography>*/}
        {asset.owner && (
          <>
            <PersonIcon color="action" fontSize="inherit" />
            <TooltipOverflowLabel
              variant="body2"
              label={userIsOwner ? 'me' : asset.owner}
            />
          </>
        )}
      </Stack>
    </Stack>
  );
}

export function ListItem({
  asset,
  fetchAssetsListResponse
}: {
  asset: IBaseAsset;
  fetchAssetsListResponse: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const userinfo = useContext(UserInfoContext);
  const userIsOwner = asset.owner === userinfo.preferred_username;

  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  return (
    <Box
      ref={ref}
      draggable={true}
      sx={{
        margin: '10px',
        fontSize: '14px',
        display: 'flex',
        height: '25px',
        border: '1px solid lightgray',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgb(195, 235, 202)',
        backgroundColor: 'rgb(229,252,233)',
        borderRadius: '5px',
        padding: '10px',
        paddingRight: '1px',
        cursor: 'grab',
        '&:active': {
          cursor: 'grabbing'
        }
      }}
    >
      <AssetTitle
        asset={asset}
        userIsOwner={userIsOwner}
        sx={{ width: 'calc(100% - 80px + 8px)' }}
      />
      <IconButton
        aria-label="Info"
        style={{ borderRadius: '100%' }}
        sx={{ width: '40px' }}
        onClick={() => setShareDialogOpen(true)}
      >
        {(asset.shared_with_users || []).length > 0 ||
        (asset.shared_with_scopes || []).length > 0 ? (
          <PeopleIcon />
        ) : (
          <ShareIcon />
        )}
      </IconButton>
      <ShareDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        onUpdated={fetchAssetsListResponse}
        asset={asset}
        readonly={!userIsOwner}
      />
      <IconButton
        aria-label="Info"
        style={{ borderRadius: '100%' }}
        sx={{ width: '40px', marginLeft: '-8px' }}
      >
        <InfoOutlinedIcon />
      </IconButton>
    </Box>
  );
}

export function LoadingListItem() {
  return (
    <Skeleton
      variant="rounded"
      style={{
        margin: '10px',
        fontSize: '14px',
        display: 'flex',
        height: '25px',
        border: '1px solid transparent',
        padding: '10px',
        borderRadius: '5px'
      }}
    />
  );
}
