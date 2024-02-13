import React from 'react';
import './loader.scss';
import { useAppSelector } from '@redux/store';

const Loader = () => {
  const { loading, loaderVisibility } = useAppSelector((state) => state?.http);

  return (
    <>
      {loaderVisibility &&
        loading && ( // Show loader only when both reducer states are true
          <div className="loader">
            <div className="spinner-container">
              <div className="spinner mb-17"></div>
              <span className="fsr-22 font-ib white loading-text">Loading</span>
            </div>
          </div>
        )}
    </>
  );
};

export default Loader;
