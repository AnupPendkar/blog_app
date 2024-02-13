import { AccountCircle } from '@mui/icons-material';
import { AppBar, IconButton, Menu, MenuItem, Toolbar, useTheme } from '@mui/material';
import React from 'react';
import { useAppSelector } from '@redux/store';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import useThemeSwitcher from '@hooks/useThemeSwitcher';
import useAuthMethods from '@hooks/useAuthMethods';

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { isSocketConnected } = useAppSelector((state) => state.user);
  const { toggleAppTheme } = useThemeSwitcher();
  const theme = useTheme();
  const { logout } = useAuthMethods();
  const { loading } = useAppSelector((state) => state.http);

  function handleMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <div className="app-header">
      <AppBar position="static" color="primary">
        <Toolbar className="flex items-center justify-between">
          {/* <img className="h-14 w-14" src={logo} alt="ATCO logo" /> */}
          <span>logo</span>

          <span className="fsr-18 font-im ml-7">Dashboard</span>

          <div className="flex items-center">
            <IconButton onClick={toggleAppTheme} color="inherit" disabled={loading}>
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>

            {/* <img className="w-4 h-4 mr-4 ml-2" src={isSocketConnected ? connected : disconnected} /> */}

            <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleMenu} color="inherit">
              <AccountCircle />
            </IconButton>

            <Menu id="menu-appbar" anchorEl={anchorEl} color="success" MenuListProps={{ sx: { backgroundColor: 'none' } }} open={Boolean(anchorEl)} onClose={handleClose}>
              {/* <MenuItem onClick={handleClose}>
                <span className="fsr-14 font-isb">Manage account</span>
              </MenuItem> */}
              <MenuItem onClick={logout}>
                <span className="fsr-14 font-isb">Logout</span>
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
