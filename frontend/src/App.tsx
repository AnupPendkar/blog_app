import React from 'react';
import './App.scss';
import Loader from '@components/loader/Loader';
import { HashRouter } from 'react-router-dom';
import { useAppSelector } from '@redux/store';
import Header from '@components/header/Header';
import Footer from '@components/footer/Footer';
import RouteHandler from './essentials/route-handler/RouteHandler';
import ErrorDialog from '@components/error-dialog/ErrorDialog';
import MessageDialog from '@components/message-dialog/MessageDialog';
import useAppEffects from '@hooks/useAppEffects';

function App() {
  useAppEffects();
  const { userLoggedIn } = useAppSelector((state) => state.user);

  return (
    <div className="App">
      <Loader />
      <HashRouter>
        {true && (
          <>
            <Header />
            <Footer />
          </>
        )}
        <RouteHandler />
      </HashRouter>

      <ErrorDialog />
      <MessageDialog />
    </div>
  );
}

export default App;
