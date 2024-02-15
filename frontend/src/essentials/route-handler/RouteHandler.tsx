import BaseUrlConfigurator from '@components/base-url-config/BaseUrlConfigurator';
import { useTheme } from '@mui/material';
import { AppRoutesEnum } from '@shared/appRotues';
import StorageHandler from '@shared/storageHandler';
import { isPropEmpty } from '@shared/utilfunctions';
import React, { useEffect } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Login from '@components/login/Login';
import Homepage from '@pages/Homepage';

const RouteHandler = () => {
  const theme = useTheme();
  const storageHandler = new StorageHandler();

  /**
   * This fun works as auth guard. User can access protected routes only if the user logged in.
   * Else redirects to the login route.
   * @returns (access || login) route
   */
  function AuthGuard() {
    return !isPropEmpty(storageHandler.jwtAccesToken) ? <Outlet /> : <Navigate to="/login" />;
  }

  return (
    <div className="app-main" style={{ background: theme.palette.primary.main }}>
      <Routes>
        <Route path={AppRoutesEnum.LOGIN} element={<Login />} />
        <Route path={AppRoutesEnum.CONFIG} element={<BaseUrlConfigurator />} />
        <Route element={<AuthGuard />}>
          <Route path="/" element={<Navigate to={AppRoutesEnum.DATA_CAPTURE} />} />
          <Route path={AppRoutesEnum.DATA_CAPTURE} element={<Homepage />} />

          {/* <Route path={AppRoutesEnum.RAIL_TRANSACTIONS} element={<RailTransactionHistory />} />
          <Route path={AppRoutesEnum.UPLOAD} element={<VIew1 />} />
          <Route path="/app" element={<VIew1 />} /> */}

          <Route path="*" element={<Navigate to={AppRoutesEnum.DATA_CAPTURE} />} />
        </Route>
      </Routes>
    </div>
  );
};

export default RouteHandler;
