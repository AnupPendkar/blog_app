import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import CustomThemeProvider from './theming/CustomThemeProvider';
import App from './App';
import { Provider } from 'react-redux';
import { store } from '@redux/store';
import UrlConfigManager from '@shared/urlConfigManager';
import axios from 'axios';
import { createAxiosInsFromBaseUrl } from '@redux/reducers/axiosReducer';

const urlConfigManager = new UrlConfigManager();

/**
 * This function first takes the base url mentioned in the config.json file
 * Then set it as default overall in app for any requests.
 * @return {*}  {Promise<void>}
 */
function resolveConfigJsonFile(): Promise<void> {
  return new Promise((resolve) => {
    axios.get('config.json').then((res) => {
      urlConfigManager.initBaseURLConfigurator(res?.data?.baseUrl);
      createAxiosInsFromBaseUrl(urlConfigManager.baseUrl as string);
      resolve();
    });
  });
}

resolveConfigJsonFile().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <CustomThemeProvider>
        <App />
      </CustomThemeProvider>
    </Provider>
  );
});
