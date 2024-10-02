import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

export default function ThemeWrapper(props: { children: any }) {

  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: { main: import.meta.env.VITE_THEME_PRIMARY_COLOR ?? '#FF6A00', },
      secondary: { main: import.meta.env.VITE_THEME_SECONDARY_COLOR ?? '#7F006E', },
    },
  })


  return <ThemeProvider theme={theme}>
    <CssBaseline />
    {props.children}
  </ThemeProvider>

}

