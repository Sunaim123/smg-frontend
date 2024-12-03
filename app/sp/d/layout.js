"use client"
import { useState } from "react"
import { Box, Stack } from "@mui/material"
import { alpha } from "@mui/material/styles"
import Auth from "@/app/components/Auth"
import Layout from "@/app/components/Layout"
import AppNavbar from "./AppNavbar"
import SideMenu from "./SideMenu"
import Alert from "@/app/components/Alert"

export default function Page({ children }) {
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  return (
    <Layout topbar={true} footer={false}>
      <Auth>
        <Box sx={{ display: "flex" }}>
          <SideMenu toast={toast} setToast={setToast} />
          <AppNavbar />
          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: theme.vars
                ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                : alpha(theme.palette.background.default, 1),
              overflow: "auto",
            })}
          >
            <Stack
              spacing={2}
              sx={{
                alignItems: "center",
                mx: 3,
                pb: 5,
                mt: { xs: 8, md: 0 },
              }}
            >
              <Alert toast={toast} setToast={setToast} />
              {children}
            </Stack>
          </Box>
        </Box>
      </Auth>
    </Layout>
  )
}
