import { createTheme } from '@mui/material/styles'

const themePalete = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "35%",
                }
            }
        }
    },
    // palette: {
    //   primary: { main: "#38BF87" },
    //   secondary: { main: "#ff1a1a" },
    // }
  })
  
  export default themePalete;