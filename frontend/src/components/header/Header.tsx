import { AccountCircle } from '@mui/icons-material';
import { AppBar, Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, useTheme } from '@mui/material';
import React from 'react';
import { useAppDispatch, useAppSelector } from '@redux/store';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import useThemeSwitcher from '@hooks/useThemeSwitcher';
import useAuthMethods from '@hooks/useAuthMethods';
import facebook from '@assets/facebook.png';
import instagram from '@assets/instagram.png';
import twitter from '@assets/twitter.png';
import linkedin from '@assets/linkedin.png';
import logo from '@assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { AppRoutesEnum } from '@shared/appRotues';
import LoginPopup from '@components/login/Login';
import useSharedEssentials from '@hooks/useSharedEssentials';
import { MessageBoxCloseTypeEnum } from '@models/common';
import { isPropEmpty } from '@shared/utilfunctions';
import blankUser from '@assets/blank_user.svg';
import UserService from '@services/userService';
import { setUserInfo } from '@redux/actions/userInfoActions';
import StorageHandler from '@shared/storageHandler';

const Header = () => {
  const [userAnchor, setUserAnchor] = React.useState<null | HTMLElement>(null);
  const [hamDrawer, setHamDrawer] = React.useState(false);
  const { toggleAppTheme } = useThemeSwitcher();
  const theme = useTheme();
  const navigate = useNavigate();
  const { logout, setUserLoginData } = useAuthMethods();
  const { loading } = useAppSelector((state) => state.http);
  const { closeType, messageDialogDetails } = useAppSelector((state) => state.notification);
  const [openLogin, setOpenLogin] = React.useState(false);
  const { parsedUserInfo, userLoggedIn, userInfo } = useAppSelector((state) => state?.user);
  const { askConfirmation } = useSharedEssentials();
  const { fetchUserInfo } = UserService();
  const dispatch = useAppDispatch();
  const storageHandler = new StorageHandler();

  async function getUserInfo() {
    const res = await fetchUserInfo();
    dispatch(setUserInfo(res));
  }

  function askLogoutConfirmation() {
    askConfirmation('Are you really want to logout', MessageBoxCloseTypeEnum.CONFIRM_LOGOUT);
    setUserAnchor(null);
  }

  function handleProfileClk() {
    navigate(`profile/${parsedUserInfo?.id}`);
    setUserAnchor(null);
  }

  React.useEffect(() => {
    const accessToken = storageHandler.jwtAccesToken;
    const refreshToken = storageHandler.jwtRefreshToken;

    // Token present;
    if (!isPropEmpty(accessToken) && !isPropEmpty(refreshToken)) {
      setUserLoginData(accessToken as string, refreshToken as string);
    }
  }, []);

  React.useEffect(() => {
    if (userLoggedIn) {
      getUserInfo();
    }
  }, [userLoggedIn]);

  React.useEffect(() => {
    if (isPropEmpty(messageDialogDetails)) {
      // return;
    }

    switch (closeType) {
      case MessageBoxCloseTypeEnum.CONFIRM_LOGOUT:
        logout();
        break;
    }
  }, [closeType]);

  console.log(userInfo?.profileImg, userInfo);

  return (
    <div className="app-header">
      <AppBar position="static" color="primary" style={{ height: '56px' }}>
        <div className="flex justify-center">
          <Toolbar className="flex items-center justify-between w-[90%] sm:w-4/5" style={{ paddingLeft: '0', paddingRight: '0' }}>
            <div className="logos flex items-center select-none">
              {/* <img className="w-5 mr-3 cursor-pointer" src={facebook} alt="" />
              <img className="w-5 mr-3 cursor-pointer" src={instagram} alt="" />
              <img className="w-5 mr-3 cursor-pointer" src={twitter} alt="" />
              <img className="w-5 mr-3 cursor-pointer" src={linkedin} alt="" /> */}
              <img className="w-[80px] mr-3 cursor-pointer" src={logo} alt="" />
            </div>

            <span className="fsr-18 font-im cursor-pointer" onClick={() => navigate(AppRoutesEnum.HOMEPAGE)}>
              StoryHaven
            </span>

            <div className="flex items-center">
              <IconButton onClick={toggleAppTheme} color="inherit" disabled={loading}>
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>

              <div className="mobile__ver sm:hidden">
                <label className="hamburger" htmlFor="check">
                  <input onClick={() => setHamDrawer((state) => !state)} className={hamDrawer ? 'active' : ''} type="checkbox" id="check" />
                  <span style={{ background: theme.palette.mode === 'dark' ? '#ffffff' : '#191919' }}></span>
                  <span style={{ background: theme.palette.mode === 'dark' ? '#ffffff' : '#191919' }}></span>
                  <span style={{ background: theme.palette.mode === 'dark' ? '#ffffff' : '#191919' }}></span>
                </label>

                <Drawer
                  variant="persistent"
                  PaperProps={{ sx: { background: (theme) => theme?.palette?.primary?.main, marginTop: '50px' } }}
                  anchor={'right'}
                  open={hamDrawer}
                  ModalProps={{
                    keepMounted: true,
                  }}
                >
                  <Box sx={{ width: 150 }} role="presentation" onClick={() => setHamDrawer(false)}>
                    <List>
                      <ListItem key={'discover'} disablePadding>
                        <ListItemButton onClick={() => navigate(AppRoutesEnum.DISCOVER + '/all')}>
                          <ListItemText primary={'Discover'} />
                        </ListItemButton>
                      </ListItem>
                      <ListItem key={'Write'} disablePadding>
                        <ListItemButton onClick={() => navigate(AppRoutesEnum.WRITE)}>
                          <ListItemText primary={'Write'} />
                        </ListItemButton>
                      </ListItem>

                      {userLoggedIn ? (
                        <>
                          <ListItem key={'Posts'} disablePadding>
                            <ListItemButton onClick={() => navigate(AppRoutesEnum.POSTS + '/all')}>
                              <ListItemText primary={'Posts'} />
                            </ListItemButton>
                          </ListItem>
                          <ListItem key={'Profile'} disablePadding>
                            <ListItemButton onClick={() => navigate(`profile/${parsedUserInfo?.id}`)}>
                              <ListItemText primary={'Profile'} />
                            </ListItemButton>
                          </ListItem>
                          <ListItem key={'Logout'} disablePadding>
                            <ListItemButton onClick={askLogoutConfirmation}>
                              <ListItemText primary={'Logout'} />
                            </ListItemButton>
                          </ListItem>
                        </>
                      ) : (
                        <ListItem key={'Login'} disablePadding>
                          <ListItemButton onClick={() => setOpenLogin(true)}>
                            <ListItemText primary={'Login'} />
                          </ListItemButton>
                        </ListItem>
                      )}
                    </List>
                  </Box>
                </Drawer>
              </div>

              <div className="desktop__ver hidden sm:flex sm:items-center">
                <span className="fsr-16 inter ml-10 mr-5 cursor-pointer" onClick={() => navigate(AppRoutesEnum.DISCOVER + '/all')}>
                  Discover
                </span>

                <span className="fsr-16 inter mr-5 cursor-pointer" onClick={() => navigate(AppRoutesEnum.WRITE)}>
                  Write
                </span>

                {userLoggedIn ? (
                  <>
                    <span className="fsr-16 inter mr-5 cursor-pointer" onClick={() => navigate(AppRoutesEnum.POSTS + '/all')}>
                      Posts
                    </span>
                    <img
                      onClick={(event) => setUserAnchor(event.currentTarget)}
                      className="w-7 h-7 cursor-pointer"
                      style={{ borderRadius: '50%' }}
                      src={!isPropEmpty(userInfo?.profileImg) ? userInfo?.profileImg : blankUser}
                      alt="User"
                    />
                    <Menu id="menu-appbar" anchorEl={userAnchor} keepMounted open={Boolean(userAnchor)} onClose={() => setUserAnchor(null)}>
                      <MenuItem onClick={handleProfileClk}>
                        <span className="fsr-14 font-isb">Profile</span>
                      </MenuItem>
                      <MenuItem onClick={askLogoutConfirmation}>
                        <span className="fsr-14 font-isb">Logout</span>
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <span onClick={() => setOpenLogin(true)} className="fsr-16 inter cursor-pointer">
                    Login
                  </span>
                )}
              </div>
            </div>
          </Toolbar>
        </div>
      </AppBar>
      <LoginPopup open={openLogin} setOpen={setOpenLogin} />
    </div>
  );
};

export default Header;
