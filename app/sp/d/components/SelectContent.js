import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import MuiAvatar from '@mui/material/Avatar';
import MuiListItemAvatar from '@mui/material/ListItemAvatar';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListSubheader from '@mui/material/ListSubheader';
import Select, { selectClasses } from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import SmartphoneRoundedIcon from '@mui/icons-material/SmartphoneRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import { Stack } from '@mui/material';

const Avatar = styled(MuiAvatar)(({ theme }) => ({
  width: 28,
  height: 28,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  color: (theme.vars || theme).palette.text.secondary,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const ListItemAvatar = styled(MuiListItemAvatar)({
  minWidth: 0,
  marginRight: 12,
});

export default function SelectContent() {
  const userState = useSelector(state => state.user)
  const [company, setCompany] = React.useState('');
  const router = useRouter()

  return (
    <Stack sx={{ p: 1 }}>
      <Select
        labelId="company-select"
        id="company-simple-select"
        value={company}
        displayEmpty
        inputProps={{ 'aria-label': 'Select company' }}
        fullWidth
        sx={{
          flexGrow: 1, p: 1,
          maxHeight: 56,
          width: 215,
          '&.MuiList-root': {
            p: '8px',
          },
          [`& .${selectClasses.select}`]: {
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            pl: 1,
          },
        }}
      >
        {/* <ListSubheader sx={{ pt: 0 }}>Production</ListSubheader> */}
        <MenuItem value="">
          <ListItemAvatar>
            <Avatar alt="Sitemark web">
              <DevicesRoundedIcon sx={{ fontSize: '1rem' }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Seller" secondary="Portal" />
        </MenuItem>
        {/* <MenuItem value={10}>
        <ListItemAvatar>
          <Avatar alt="Sitemark App">
            <SmartphoneRoundedIcon sx={{ fontSize: '1rem' }} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Sitemark-app" secondary="Mobile application" />
      </MenuItem> */}
        {userState.user?.company && userState.user?.company.subscription_id &&
          <MenuItem value={20} onClick={() => router.push("/wp/d")}>
            <ListItemAvatar>
              <Avatar alt="Sitemark Store">
                <DevicesRoundedIcon sx={{ fontSize: '1rem' }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Warehouse" secondary="Portal" />
          </MenuItem>}
        {userState.user?.company && !userState.user?.company.subscription_id && <>
          <Divider sx={{ mx: -1 }} />
          <MenuItem value={30} onClick={() => router.push("/wp/terms")}>
            <ListItemAvatar>
              <Avatar alt="Sitemark Store">
                <ConstructionRoundedIcon sx={{ fontSize: '1rem' }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Subscribe for warehouse" />
          </MenuItem>
        </>}
      </Select>
    </Stack>
  );
}
