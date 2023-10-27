import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Typography, IconButton, MenuItem, Card, Avatar } from '@mui/material';
//
import Iconify from '../../iconify';
import MenuPopover from '../../menu-popover';
import { getUserLevelByNumber, returnMoment } from 'src/utils/function';
import { useEffect } from 'react';
import useResizeObserver from 'src/hooks/useResizeObserver';
import { useCallback } from 'react';

// ----------------------------------------------------------------------

StandardNode.propTypes = {
  sx: PropTypes.object,
  node: PropTypes.object,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default function StandardNode({ node, onEdit, onDelete, sx }) {
  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };
  const onResize = useCallback((target) => {
    console.log(returnMoment());
    // Handle the resize event
  }, []);

  const ref = useResizeObserver(onResize);
  return (
    <>
      <Card
        sx={{
          p: 2,
          minWidth: 200,
          borderRadius: 1.5,
          textAlign: 'left',
          position: 'relative',
          display: 'inline-flex',
          flexDirection: 'column',
          ...sx,
        }}
        ref={ref}
        className={`${node.user_name}-popover`}
      >
        <IconButton
          color={openPopover ? 'inherit' : 'default'}
          onClick={handleOpenPopover}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <Iconify icon="eva:more-horizontal-fill" />
        </IconButton>

        <Avatar
          alt={node.name}
          src={node.profile_img || ''}
          sx={{ mr: 2, mb: 1, width: 48, height: 48 }}
        />

        <Typography variant="subtitle2">
          {node.user_name}
        </Typography>
        <Typography variant="caption" component="div" noWrap sx={{ color: 'text.secondary' }}>
          {node.nickname}
        </Typography>
        <Typography variant="caption" component="div" noWrap sx={{ color: 'text.secondary' }}>
          {getUserLevelByNumber(node.level)}
        </Typography>
      </Card>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
        transformOrigin={{ vertical: 'center', horizontal: 'left' }}
        arrow="left-center"
        class_name={`${node.user_name}-popover`}
        sx={{ width: 160 }}
      >
        {/* {onDelete && (
          <MenuItem
            onClick={() => {
              handleClosePopover();
              onDelete();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="eva:trash-2-outline" />
            Delete
          </MenuItem>
        )} */}

        {onEdit && (
          <MenuItem
            onClick={() => {
              handleClosePopover();
              onEdit();
            }}
          >
            <Iconify icon="eva:edit-fill" />
            매출내역
          </MenuItem>
        )}
      </MenuPopover>
    </>
  );
}
