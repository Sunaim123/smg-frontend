"use client"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { createTheme, ThemeProvider } from "@mui/material/styles"

import CssBaseline from "@mui/material/CssBaseline"
import getTheme from "../../theme/getTheme"

export default function AppThemeProvider({ children }) {
  const themeState = useSelector(state => state.theme)
  const [mode, setMode] = useState(themeState.theme)
  const theme = createTheme(getTheme(themeState.theme))

  useEffect(() => {
    setMode(themeState.theme)
  }, [themeState.theme])

  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  )
}