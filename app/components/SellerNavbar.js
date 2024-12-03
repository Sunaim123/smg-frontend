"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppBar, Avatar, Badge, Box, Button, Container, Divider, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material"
import * as Icon from "@mui/icons-material"

import Alert from "@/app/components/Alert"
import brand from "@/public/smg-light-rounded-green.png"
import * as userSlice from "@/app/store/user"
import * as companyApis from "@/app/apis/company"
import axios from "@/app/utilities/axios"
import TermsAndConditions from "./TermsAndConditions"
import { emptyCart } from "@/app/store/cart"

export default function SellerNavbar() {
  const userState = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const router = useRouter()

  const [anchorEl, setAnchorEl] = useState(null)
  const [anchorElNav, setAnchorElNav] = useState(null)
  const [anchorElUser, setAnchorElUser] = useState(null)
  const [termsModal, setTermsModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleStripeOnboard = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const response = await companyApis.stripeOnboarding(userState.token)
      if (!response.status) throw new Error(response.message)

      router.push(response.url)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleMenuClick = async (item) => {
    setAnchorElUser(null)

    if (item === "Logout") {
      if (!window.confirm("Are you sure you want to logout?")) return

      const { data: response } = await axios.post("/api/user/logout", { token: userState.token })
      if (!response.status) throw new Error(response.message)

      dispatch(emptyCart())
      dispatch(userSlice.logout())
      router.replace("/login")
    }
    else router.replace(`/${item.toLowerCase()}`)
  }

  const handleOpenNavMenu = (e) => {
    setAnchorElNav(e.currentTarget)
  }

  const handleOpenUserMenu = (e) => {
    setAnchorElUser(e.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleLink = (link) => {
    router.push(link)
    setAnchorEl(null)
  }

  const pages = [
    { key: "dashboard", title: "Dashboard", link: "/seller/dashboard", icon: <Icon.HomeOutlined /> },
    { key: "listings", title: "Listings", link: "/seller/listings", icon: <Icon.Inventory2Outlined /> },
    { key: "orders", title: "Orders", link: "/seller/listings/orders?status=Received", icon: <Icon.CategoryOutlined /> },
    { key: "payouts", title: "Payouts", link: "/seller/payouts?status=Opened", icon: <Icon.WarehouseOutlined /> },
  ]

  const settings = [
    "Logout"
  ]

  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: "#219C57" }}>
      <Alert toast={toast} setToast={setToast} />
      <TermsAndConditions open={termsModal} setOpen={setTermsModal} onSubmit={handleStripeOnboard} />

      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Image src={brand} alt="brand" width={40} height={40} />
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <Icon.Menu />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.key} onClick={() => handleLink(page.link)}>
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Image src={brand} alt="brand" width={40} height={40} />
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.key}
                onClick={() => handleLink(page.link)}
                sx={{ my: 2, color: "white", display: "flex", alignItems: "center", gap: 1, backgroundColor: "#219C57" }}
              >
                {page.title}
              </Button>
            ))}

          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Button onClick={() => router.push("/dashboard")} sx={{ backgroundColor: "#219C57" }}>
              Warehouse
            </Button>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={userState.user && userState.user.name} src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <Box sx={{ minWidth: "200px", textAlign: "center" }}>
                  {settings.map((item, index) => (
                    <MenuItem key={index} onClick={() => handleMenuClick(item)}>
                      {item}
                    </MenuItem>
                  ))}
                </Box>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}