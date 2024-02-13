import React, { useEffect } from 'react';
import UrlConfigManager from '@shared/urlConfigManager';

const BaseUrlConfigurator = () => {
  const urlConfigManager = new UrlConfigManager();

  useEffect(() => {
    urlConfigManager.invokePrompt().then(async (res) => {
      if (res) {
        urlConfigManager.removeTokensFromLS();
      }
    });
  });

  return <div></div>;
};

export default BaseUrlConfigurator;
