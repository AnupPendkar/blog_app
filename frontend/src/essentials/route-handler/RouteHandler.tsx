import React from 'react';
import { useTheme } from '@mui/material';
import { AppRoutesEnum } from '@shared/appRotues';
import { isPropEmpty } from '@shared/utilfunctions';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import BaseUrlConfigurator from '@components/base-url-config/BaseUrlConfigurator';
import StorageHandler from '@shared/storageHandler';
import Login from '@components/login/Login';
import Homepage from '@pages/homepage/Homepage';
import Write from '@pages/write/Write';
import SinglePost from '@pages/single-post/SinglePost';

const RouteHandler = () => {
  const theme = useTheme();
  const location = useLocation();
  const storageHandler = new StorageHandler();

  /**
   * This fun works as auth guard. User can access protected routes only if the user logged in.
   * Else redirects to the login route.
   * @returns (access || login) route
   */
  function AuthGuard() {
    if (isPropEmpty(storageHandler.jwtAccesToken) && location?.pathname === AppRoutesEnum.LOGIN) {
      return;
    }

    return !isPropEmpty(storageHandler.jwtAccesToken) ? <Outlet /> : <Navigate to="/login" />;
  }

  return (
    <div className="app-main" style={{ background: theme.palette.primary.main }}>
      <Routes>
        <Route path={AppRoutesEnum.LOGIN} element={<Login />} />
        <Route path={AppRoutesEnum.CONFIG} element={<BaseUrlConfigurator />} />
        <Route element={<AuthGuard />}>
          <Route path="/" element={<Navigate to={AppRoutesEnum.HOMEPAGE} />} />
          <Route path={AppRoutesEnum.HOMEPAGE} element={<Homepage />} />
          <Route path="/write" element={<Write />} />
          <Route path="/single-post/:id" element={<SinglePost />} />

          <Route path="*" element={<Navigate to={AppRoutesEnum.HOMEPAGE} />} />
        </Route>
      </Routes>
    </div>
  );
};

export default RouteHandler;
