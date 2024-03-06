import React from 'react';
import { ThemePrefEnum } from '@models/common';
import { useMediaQuery } from '@mui/material';
import { changeThemePref } from '@redux/actions/userInfoActions';
import { useAppDispatch, useAppSelector } from '@redux/store';
import StorageHandler from '@shared/storageHandler';
import { isPropEmpty } from '@shared/utilfunctions';

const useThemeSwitcher = () => {
  const { themePref } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { setThemePreference, getThemePreference } = new StorageHandler();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  /**
   * This function will apply the theme provided in the param.
   * @param theme
   */
  function setAppTheme(theme: ThemePrefEnum) {
    dispatch(changeThemePref(theme));
    setThemePreference(theme === ThemePrefEnum.DARK ? 'dark' : 'light');
  }

  /**
   * Used to toggle the current applied theme.
   */
  function toggleAppTheme() {
    const defaultTheme = themePref === ThemePrefEnum.DARK ? ThemePrefEnum.LIGHT : ThemePrefEnum?.DARK;

    setAppTheme(defaultTheme);
  }

  /**
   * This function checks if any theme preference present in LS or not.
   * If not present, then takes the preference from material media query func.
   */
  function setDefaultAppTheme() {
    let defaultTheme: ThemePrefEnum;

    if (isPropEmpty(getThemePreference)) {
      defaultTheme = prefersDarkMode ? ThemePrefEnum.DARK : ThemePrefEnum.LIGHT;
    } else {
      defaultTheme = getThemePreference === 'dark' ? ThemePrefEnum.DARK : ThemePrefEnum.LIGHT;
    }

    setAppTheme(defaultTheme);
  }

  return {
    setAppTheme,
    toggleAppTheme,
    setDefaultAppTheme,
  };
};

export default useThemeSwitcher;
