import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

export default function ThemeWrapper(props: { children: any }) {

  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: { main: process.env.REACT_APP_THEME_PRIMARY_COLOR ?? '#FF6A00', },
      secondary: { main: process.env.REACT_APP_THEME_SECONDARY_COLOR ?? '#7F006E', },
    },
  })


  return <ThemeProvider theme={theme}>
    <CssBaseline />
    {props.children}
  </ThemeProvider>

}

