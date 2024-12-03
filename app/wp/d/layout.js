"use client"
import { Box, Stack } from "@mui/material"
import { alpha } from "@mui/material/styles"
import Auth from "@/app/components/Auth"
import Layout from "@/app/components/Layout"
import AppNavbar from "./AppNavbar"
import SideMenu from "./SideMenu"

export default function Page({ children }) {
  return (
    <Layout topbar={true} footer={false}>
      <Auth>
        <Box sx={{ display: "flex" }}>
          <SideMenu />
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
              {children}
            </Stack>
          </Box>
        </Box>
      </Auth>
    </Layout>
  )
}
