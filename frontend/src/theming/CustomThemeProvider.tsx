import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { darkTheme, lightTheme } from './customTheme';
import { useAppSelector } from '@redux/store';
import useThemeSwitcher from '@hooks/useThemeSwitcher';

type MyThemeProviderProps = {
  children: React.ReactNode;
};

const CustomThemeProvider = (props: MyThemeProviderProps) => {
  const { themePref } = useAppSelector((state) => state.user);
  const { setDefaultAppTheme } = useThemeSwitcher();

  const customTheme = useMemo(() => (themePref === 0 ? darkTheme : lightTheme), [themePref]);

  /**
   * Maintains the global style for MUI components.
   * @returns
   */
  const GlobalStyle = () => (
    <GlobalStyles
      styles={(theme) => ({
        // Menu
        '.MuiMenu-list': {
          paddingBottom: '0 !important',
          paddingTop: '0 !important',
        },
        '.MuiMenu-paper': {
          boxShadow: '0px 2px 9px -2px #282828 !important;',
        },
      })}
    />
  );

  useEffect(() => {
    setDefaultAppTheme();
  }, []);

  // Providing the custom theme and globalstyles to all the children routes.
  return (
    <ThemeProvider theme={customTheme}>
      <GlobalStyle />
      <CssBaseline enableColorScheme />
      {props.children}
    </ThemeProvider>
  );
};

export default CustomThemeProvider;
