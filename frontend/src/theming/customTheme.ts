import { createTheme } from '@mui/material/styles';

const { palette } = createTheme();
declare module '@mui/material/styles' {
  interface Palette {
    cancel?: Palette['primary'];
    hover?: Palette['primary'];
    inactive?: Palette['primary'];
  }

  interface PaletteOptions {
    cancel?: PaletteOptions['primary'];
    hover?: PaletteOptions['primary'];
    inactive?: PaletteOptions['primary'];
  }
}
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    ternary: true;
    cancel: true;
  }
}
declare module '@mui/material/AppBar' {
  interface AppBarPropsColorOverrides {
    ternary: true;
  }
}

// Dark theme
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: palette.augmentColor({
      color: {
        main: '#111623',
        contrastText: '#F9F9F9',
      },
    }),
    secondary: palette.augmentColor({
      color: {
        main: '#222B36',
        contrastText: '#F9F9F9',
      },
    }),

    text: {
      primary: '#F9F9F9',
      secondary: '#F9F9F9',
    },
    background: {
      default: '#111623',
      paper: '#19222c',
    },

    error: palette.augmentColor({
      color: {
        main: '#F52424',
        contrastText: '#191919',
      },
    }),
    success: palette.augmentColor({
      color: {
        main: '#7ECC29',
        contrastText: '#191919',
      },
    }),
    cancel: palette.augmentColor({
      color: {
        main: '#444444',
        contrastText: '#f1f1f1',
      },
    }),
    inactive: palette.augmentColor({
      color: {
        main: '#555555',
        contrastText: '#191919',
      },
    }),
    hover: palette.augmentColor({
      color: {
        main: '#5b664f',
        contrastText: '#191919',
      },
    }),
    info: palette.augmentColor({
      color: {
        main: '#0062a2',
        contrastText: '#ffffff',
      },
    }),
    warning: palette.augmentColor({
      color: {
        main: '#F57474',
        contrastText: '#191919',
      },
    }),

    divider: '#909284',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          textTransform: 'unset',

          '&.Mui-disabled': {
            background: '#757575',
            color: '#454545',
          },
        },
      },
    },
    // MuiTextField: {
    //   styleOverrides: {
    //     root: {
    //       '.MuiInputBase-root': {
    //         backgroundColor: '#ffffff',
    //         color: '#191919',
    //         caretColor: '#191919',
    //       },
    //       '.MuiOutlinedInput-notchedOutline': {
    //         borderColor: '#ffffff',
    //       },
    //       '.Mui-focused .MuiOutlinedInput-notchedOutline': {
    //         borderColor: '#f1f1f1',
    //       },
    //     },
    //   },
    // },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: 20,
          borderRadius: '6px 6px 0 0',
          fontWeight: 'bold',
          padding: '7px 24px',
          backgroundColor: '#222B36',
          boxShadow: '0px 4px 16px 0px #282828',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          paddingTop: '25px !important',
          backgroundColor: '#19222c',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'inherit',
          boxShadow: 'none',
          backgroundImage: 'none',
          // filter: "drop-shadow(0px 4px 4px rgba(87, 87, 87, 0.25))",
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          paddingTop: 10,
          paddingBottom: 10,
          backgroundColor: '#2E2E2E !important',
          color: '#f1f1f1',

          '&:hover': {
            backgroundColor: '#363636 !important',
            color: '#f1f1f1',
          },
          '&.Mui-selected': {
            backgroundColor: '#363636 !important',
            color: '#f1f1f1',
          },
        },
      },
    },
  },
});

// Light theme.
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: palette.augmentColor({
      color: {
        main: '#f1f1f1',
        contrastText: '#191919',
      },
    }),
    secondary: palette.augmentColor({
      color: {
        main: '#E4E4E4',
        contrastText: '#191919',
      },
    }),

    text: {
      primary: '#1b1c17',
      secondary: '#1b1c17',
    },
    background: {
      default: '#fefdf4',
      paper: '#fafafa',
    },
    error: palette.augmentColor({
      color: {
        main: '#ba1b1b',
        contrastText: '#ffffff',
      },
    }),
    success: palette.augmentColor({
      color: {
        main: '#7ECC29',
        contrastText: '#191919',
      },
    }),
    cancel: palette.augmentColor({
      color: {
        main: '#444444',
        contrastText: '#f1f1f1',
      },
    }),
    hover: palette.augmentColor({
      color: {
        main: '#757575',
        contrastText: '#474747',
      },
    }),
    inactive: palette.augmentColor({
      color: {
        main: '#555555',
        contrastText: '#191919',
      },
    }),
    info: palette.augmentColor({
      color: {
        main: '#0062a2',
        contrastText: '#ffffff',
      },
    }),
    warning: palette.augmentColor({
      color: {
        main: '#606200',
        contrastText: '#ffffff',
      },
    }),
    divider: '#75786a',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          textTransform: 'unset',

          '&.Mui-disabled': {
            background: '#757575 !important',
            color: '#454545 !important',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '.MuiInputBase-root': {
            backgroundColor: '#ffffff',
            color: '#191919',
            caretColor: '#191919',
          },
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: '#ffffff',
          },
          '.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#f1f1f1',
          },
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: 20,
          borderRadius: '6px 6px 0 0',
          fontWeight: 'bold',
          padding: '7px 24px',
          backgroundColor: '#222B36',
          boxShadow: '0px 4px 16px 0px #282828',
          color: '#ffffff',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          paddingTop: '25px !important',
          backgroundColor: '#19222c',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'inherit',
          boxShadow: 'none',
          backgroundImage: 'none',
          // filter: "drop-shadow(0px 4px 4px rgba(87, 87, 87, 0.25))",
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff !important',
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          color: '#191919 !important',
        },
      },
    },

    MuiAutocomplete: {
      styleOverrides: {
        root: {
          backgroundColor: '#F9F9F9',
          color: '#191919',
          filter: 'drop-shadow(0px 4px 4px rgba(87, 87, 87, 0.25))',

          '& .MuiInputLabel-root': {
            color: '#191919 !important',
          },
          '& .MuiInputBase-root': {
            color: '#191919 !important',
            backgroundColor: 'unset !important',
          },
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          paddingTop: 10,
          paddingBottom: 10,
          backgroundColor: '#F9F9F9',
          color: '#191919',

          '&:hover': {
            backgroundColor: '#F1f1f1 !important',
            color: '#191919',
          },
          '&.Mui-selected': {
            backgroundColor: '#F1f1f1 !important',
            color: '#191919',
          },
        },
      },
    },
  },
});
