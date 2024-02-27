import { AccountCircle } from '@mui/icons-material';
import { AppBar, IconButton, Menu, MenuItem, Toolbar, useTheme } from '@mui/material';
import React from 'react';
import { useAppSelector } from '@redux/store';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import useThemeSwitcher from '@hooks/useThemeSwitcher';
import useAuthMethods from '@hooks/useAuthMethods';
import facebook from '@assets/facebook.png';
import instagram from '@assets/instagram.png';
import twitter from '@assets/twitter.png';
import linkedin from '@assets/linkedin.png';
import { useNavigate } from 'react-router-dom';
import { AppRoutesEnum } from '@shared/appRotues';

const Header = () => {
  const { toggleAppTheme } = useThemeSwitcher();
  const theme = useTheme();
  const { logout } = useAuthMethods();
  const { loading } = useAppSelector((state) => state.http);
  const { userLoggedIn } = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className="app-header">
      <AppBar position="static" color="primary">
        <div className="flex justify-center">
          <Toolbar className="flex items-center justify-between w-4/5" style={{ paddingLeft: '0', paddingRight: '0' }}>
            <div className="logos flex items-center select-none">
              <img className="w-5 mr-3 cursor-pointer" src={facebook} alt="" />
              <img className="w-5 mr-3 cursor-pointer" src={instagram} alt="" />
              <img className="w-5 mr-3 cursor-pointer" src={twitter} alt="" />
              <img className="w-5 mr-3 cursor-pointer" src={linkedin} alt="" />
            </div>

            <span className="fsr-18 font-im ml-7">Dashboard</span>

            <div className="flex items-center">
              <IconButton onClick={toggleAppTheme} color="inherit" disabled={loading}>
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>

              <span className="fsr-16 inter ml-10 mr-5 cursor-pointer" onClick={() => navigate(AppRoutesEnum.DISCOVER)}>
                Discover
              </span>
              <span className="fsr-16 inter mr-5 cursor-pointer" onClick={() => navigate(AppRoutesEnum.WRITE)}>
                Write
              </span>

              {userLoggedIn && (
                <>
                  <span className="fsr-16 inter mr-5 cursor-pointer" onClick={() => navigate(AppRoutesEnum.POSTS)}>
                    Posts
                  </span>
                  <span className="fsr-16 inter mr-5 cursor-pointer" onClick={() => navigate(AppRoutesEnum.PROFILE)}>
                    Profile
                  </span>
                </>
              )}

              {userLoggedIn ? (
                <span onClick={logout} className="fsr-16 inter cursor-pointer">
                  Logout
                </span>
              ) : (
                <span className="fsr-16 inter cursor-pointer">Login</span>
              )}
            </div>
          </Toolbar>
        </div>
      </AppBar>
    </div>
  );
};

export default Header;
