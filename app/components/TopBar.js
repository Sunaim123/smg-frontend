"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { styled } from "@mui/material/styles"

import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Toolbar from "@mui/material/Toolbar"
import Drawer from "@mui/material/Drawer"
import MenuIcon from "@mui/icons-material/Menu"
import Divider from "@mui/material/Divider"
import MenuItem from "@mui/material/MenuItem"

import CloseRoundedIcon from "@mui/icons-material/CloseRounded"

import Sitemark from "@/app/components/SitemarkIcon"
import CartButton from "@/app/components/topbar/CartButton"
import LogoutButton from "@/app/components/topbar/LogoutButton"
import ToggleButton from "@/app/components/topbar/ToggleButton"

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderBottom: "1px solid",
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.background.paper,
  boxShadow: "none",
  backgroundImage: "none",
  zIndex: theme.zIndex.drawer + 1,
  flex: "0 0 auto",
}))

export default function TopBar() {
  const userState = useSelector(state => state.user)
  const [open, setOpen] = useState(false)
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen)
  }

  return (
    <StyledAppBar>
      <Toolbar
        variant="dense"
        disableGutters
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          p: "8px 12px",
        }}
      >
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}>
          <Sitemark />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Button variant="text" color="info" size="small" href="/products" LinkComponent={Link}>Products</Button>
            <Button variant="text" color="info" size="small" href="/#features" LinkComponent={Link}>Features</Button>
            <Button variant="text" color="info" size="small" href="/#testimonials" LinkComponent={Link}>Testimonials</Button>
            <Button variant="text" color="info" size="small" href="/#highlights" LinkComponent={Link}>Highlights</Button>
            <Button variant="text" color="info" size="small" href="/#pricing" LinkComponent={Link}>Pricing</Button>
            <Button variant="text" color="info" size="small" href="/#faq" LinkComponent={Link}>FAQ</Button>
            <Button variant="text" color="info" size="small" href="/blogs" LinkComponent={Link}>Blog</Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 1,
            alignItems: "center",
          }}
        >
          {!userState.user && <Button color="primary" variant="text" size="small" href="/auth/signin" LinkComponent={Link}>Sign in</Button>}
          {!userState.user && <Button color="primary" variant="contained" size="small" href="/auth/signup" LinkComponent={Link}>Sign up</Button>}
          {userState.user?.type === "customer" && <Button color="primary" variant="text" size="small" href="/cp/d/orders/awaiting-payment" LinkComponent={Link}>Orders</Button>}
          {userState.user?.type === "company" && <Button color="primary" variant="text" size="small" href="/wp/d" LinkComponent={Link}>Dashoard</Button>}
          <CartButton />
          <ToggleButton />
          {userState.user && <LogoutButton />}
        </Box>
        <Box sx={{ display: { sm: "flex", md: "none" } }}>
          <IconButton aria-label="Menu button" onClick={toggleDrawer(!open)}>
            <MenuIcon />
          </IconButton>
          <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
            <Box sx={{ p: 2, mt: "56px", backgroundColor: "background.default" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <IconButton onClick={toggleDrawer(false)}>
                  <CloseRoundedIcon />
                </IconButton>
              </Box>
              <Divider sx={{ my: 3 }} />
              <MenuItem href="/products" LinkComponent={Link}>Products</MenuItem>
              <MenuItem href="/#features" LinkComponent={Link}>Features</MenuItem>
              <MenuItem href="/#testimonials" LinkComponent={Link}>Testimonials</MenuItem>
              <MenuItem href="/#hightlightes" LinkComponent={Link}>Highlights</MenuItem>
              <MenuItem href="/#pricing" LinkComponent={Link}>Pricing</MenuItem>
              <MenuItem href="/#faq" LinkComponent={Link}>FAQ</MenuItem>
              <MenuItem href="/blogs" LinkComponent={Link}>Blog</MenuItem>
              {!userState.user && <MenuItem>
                <Button color="primary" variant="contained" fullWidth href="/auth/signup" LinkComponent={Link}>Sign up</Button>
              </MenuItem>}
              {!userState.user && <MenuItem>
                <Button color="primary" variant="outlined" fullWidth href="/auth/signin" LinkComponent={Link}>Sign in</Button>
              </MenuItem>}
              {userState.user?.type === "customer" && <MenuItem href="/cp/d/orders/awaiting-payment" LinkComponent={Link}>Orders</MenuItem>}
              {userState.user?.type === "company" && <MenuItem href="/wp/d" LinkComponent={Link}>Dashoard</MenuItem>}
              <MenuItem>
                <CartButton />
              </MenuItem>
              <MenuItem>
                <ToggleButton />
              </MenuItem>
              {userState.user && <MenuItem>
                <LogoutButton />
              </MenuItem>}
            </Box >
          </Drawer >
        </Box >
      </Toolbar >
    </StyledAppBar >
  )
}