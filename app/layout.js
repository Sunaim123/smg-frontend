"use client"
import "./globals.css"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import store, { persistor } from "./store"
import theme from "@/app/utilities/theme"
import FacebookPixel from "@/app/components/FacebookPixel"
import GoogleAnalytics from "@/app/components/GoogleAnalytics"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <FacebookPixel />
      </head>
      <body>
        <GoogleAnalytics />
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  )
}
