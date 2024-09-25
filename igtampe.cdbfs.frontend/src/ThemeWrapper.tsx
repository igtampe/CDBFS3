import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

export default function ThemeWrapper(props:{children:any}){

      const theme = createTheme({
        palette: {
          mode: 'dark',
          primary: { main: '#FF6A00', },
          secondary: { main: '#7F006E', },
        },
      })
      

    return <ThemeProvider theme={theme}>
        <CssBaseline/>
        {props.children}
    </ThemeProvider>

}

