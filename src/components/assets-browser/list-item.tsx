import React, { ReactNode, useContext, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PeopleIcon from '@mui/icons-material/People';
import ShareIcon from '@mui/icons-material/Share';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

import { ShareDialog } from './share-dialog';
import { UserInfoContext } from '../../contexts/UserInfoContext';
import { Asset, AssetKind } from './asset-kinds';
import { DeleteDialog } from './delete-dialog';

type Action = {
  title: string;
  icon: ReactNode;
  handler: () => void;
  enabled: boolean;
  showInline: boolean;
};

function MoreMenu({ actions }: { actions: Action[] }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        id="basic-button"
        aria-label="More"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ borderRadius: '100%' }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button'
          }
        }}
      >
        {actions
          .filter(a => a.enabled)
          .map(a => (
            <MenuItem
              key={a.title}
              onClick={e => {
                a.handler();
                handleClose();
              }}
            >
              <ListItemIcon>{a.icon}</ListItemIcon>
              <ListItemText>{a.title}</ListItemText>
            </MenuItem>
          ))}
      </Menu>
    </>
  );
}

export function ListItem({
  asset,
  assetKind,
  fetchAssetsListResponse
}: {
  asset: Asset;
  assetKind: AssetKind;
  fetchAssetsListResponse: () => void;
}) {
  const userinfo = useContext(UserInfoContext);
  const userIsOwner = asset.owner === userinfo.preferred_username;
  const hasVersion = 'version' in asset;
  const hasFile = 'file' in asset;
  const isShared =
    (asset.shared_with_users || []).length > 0 ||
    (asset.shared_with_scopes || []).length > 0;

  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const regex = new RegExp(`-${asset.owner}$`);
  const title = asset.title.replace(regex, '');

  const actions = [
    {
      title: 'Add to my files',
      icon: <NoteAddIcon />,
      handler: () => {}, // TODO
      enabled: hasFile,
      showInline: true
    },
    {
      title: !isShared ? 'Share' : userIsOwner ? 'Shared' : 'Shared with me',
      icon: isShared ? <PeopleIcon /> : <ShareIcon />,
      handler: () => setShareDialogOpen(true),
      enabled: true,
      showInline: true
    },
    {
      title: 'Delete',
      icon: <DeleteIcon />,
      handler: () => setDeleteDialogOpen(true),
      enabled: userIsOwner,
      showInline: false
    }
  ];

  return (
    <TableRow hover>
      <TableCell sx={{ fontWeight: 'bold' }}>{title}</TableCell>
      {hasVersion && <TableCell>v{asset.version}</TableCell>}
      <TableCell>{asset.owner && userIsOwner ? 'me' : asset.owner}</TableCell>
      <TableCell>
        <>
          {actions
            .filter(a => a.enabled && a.showInline)
            .map(a => (
              <Tooltip key={a.title} title={a.title}>
                <IconButton
                  aria-label={a.title}
                  sx={{ borderRadius: '100%', width: '40px' }}
                  onClick={a.handler}
                >
                  {a.icon}
                </IconButton>
              </Tooltip>
            ))}
        </>
        <ShareDialog
          open={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
          onUpdated={fetchAssetsListResponse}
          asset={asset}
          readonly={!userIsOwner}
        />
        <DeleteDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onUpdated={fetchAssetsListResponse}
          asset={asset}
          assetKind={assetKind}
          readonly={!userIsOwner}
        />
        <MoreMenu actions={actions} />
      </TableCell>
    </TableRow>
  );
}

export function LoadingListItem() {
  return (
    <Skeleton
      variant="rounded"
      style={{
        fontSize: '14px',
        borderRadius: '5px',
        display: 'flex',
        height: '53px',
        margin: '10px'
      }}
    />
  );
}
