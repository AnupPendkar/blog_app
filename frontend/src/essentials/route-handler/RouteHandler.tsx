import React from 'react';
import { useTheme } from '@mui/material';
import { AppRoutesEnum } from '@shared/appRotues';
import { isPropEmpty } from '@shared/utilfunctions';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import BaseUrlConfigurator from '@components/base-url-config/BaseUrlConfigurator';
import StorageHandler from '@shared/storageHandler';
import Homepage from '@pages/homepage/Homepage';
import Write from '@pages/write/Write';
import SinglePost from '@pages/single-post/SinglePost';
import AllPosts from '@pages/all-posts/AllPosts';
import Discover from '@pages/discover/Discover';
import Profile from '@pages/profile/Profile';

const RouteHandler = () => {
  const theme = useTheme();
  const storageHandler = new StorageHandler();

  /**
   * This fun works as auth guard. User can access protected routes only if the user logged in.
   * Else redirects to the login route.
   * @returns (access || login) route
   */
  function AuthGuard() {
    return <Outlet />;
    return !isPropEmpty(storageHandler.jwtAccesToken) ? <Outlet /> : <Navigate to="/login" />;
  }

  return (
    <div className="app-main" style={{ background: theme.palette.primary.main }}>
      <Routes>
        <Route path={AppRoutesEnum.CONFIG} element={<BaseUrlConfigurator />} />
        <Route element={<AuthGuard />}>
          <Route path="/" element={<Navigate to={AppRoutesEnum.DISCOVER} />} />
          <Route path={AppRoutesEnum.HOMEPAGE} element={<Homepage />} />
          <Route path={AppRoutesEnum.POSTS} element={<AllPosts />} />
          <Route path={AppRoutesEnum.DISCOVER} element={<Discover />} />
          <Route path="/write" element={<Write />} />
          <Route path="/single-post/:id" element={<SinglePost />} />
          <Route path="/profile/:id" element={<Profile />} />

          <Route path="*" element={<Navigate to={AppRoutesEnum.DISCOVER} />} />
        </Route>
      </Routes>
    </div>
  );
};

export default RouteHandler;
