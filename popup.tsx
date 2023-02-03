import { ThemeProvider } from "@mui/material/styles"
import { HashRouter } from "react-router-dom"
import AppRoutes from "routes/routes"
import theme from "theme"

import "./App.css"

function App() {
  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </ThemeProvider>
  )
}

export default App
