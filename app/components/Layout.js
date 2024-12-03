"use client"
import Box from "@mui/material/Box"
import TopBar from "@/app/components/TopBar"
import Footer from "@/app/components/Footer"
import ThemeProvider from "@/app/components/ThemeProvider"

export default function Layout({ topbar = true, footer = true, children }) {
  return (
    <ThemeProvider>
      <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
        {topbar && <TopBar />}
        <Box sx={{ flex: "1 1", overflow: "auto" }}>
          {children}
          {footer && <Footer />}
        </Box>
      </Box>
    </ThemeProvider>
  )
}
