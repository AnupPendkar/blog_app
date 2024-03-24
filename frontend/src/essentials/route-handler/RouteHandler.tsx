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
import AllCategories from '@pages/all-categories/AllCategories';

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
          <Route path="/" element={<Navigate to={AppRoutesEnum.HOMEPAGE} />} />
          <Route path={AppRoutesEnum.HOMEPAGE} element={<Homepage />} />

          <Route path={AppRoutesEnum.DISCOVER} element={<Navigate to={AppRoutesEnum.DISCOVER + '/all'} />} />
          <Route path={AppRoutesEnum.DISCOVER + '/:id'} element={<Discover />} />

          <Route path={AppRoutesEnum.POSTS} element={<Navigate to={AppRoutesEnum.POSTS + '/all'} />} />
          <Route path={AppRoutesEnum.POSTS + '/:id'} element={<AllPosts />} />

          <Route path={AppRoutesEnum.WRITE} element={<Write />} />

          <Route path={AppRoutesEnum.ALL_CATEGORIES} element={<AllCategories />} />

          <Route path={AppRoutesEnum.SINGLE_POST} element={<Navigate to={AppRoutesEnum.SINGLE_POST + '/all'} />} />
          <Route path={AppRoutesEnum.SINGLE_POST + '/:id'} element={<SinglePost />} />

          <Route path={AppRoutesEnum.PROFILE + '/:id'} element={<Profile />} />

          <Route path="*" element={<Navigate to={AppRoutesEnum.DISCOVER} />} />
        </Route>
      </Routes>
    </div>
  );
};

export default RouteHandler;
