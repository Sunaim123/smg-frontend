"use client"
import * as React from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuContent from './components/MenuContent';
import OptionsMenu from './components/OptionsMenu';
import SelectContent from './components/SelectContent';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu() {
  const userState = useSelector(state => state.user)

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          mt: '36px',
          p: 1.5,
        }}
      >
      </Box>
      <SelectContent />
      <MenuContent />
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* <Avatar
          sizes="small"
          alt={userState.user?.name}
          src="/static/images/avatar/7.jpg"
          sx={{ width: 36, height: 36 }}
        /> */}
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            {userState.user?.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {userState.user?.email}
          </Typography>
        </Box>
        {/* <OptionsMenu /> */}
      </Stack>
    </Drawer>
  );
}
