"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppBar, Avatar, Badge, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material"
import * as Icon from "@mui/icons-material"

import CircularProgress from "@mui/material/CircularProgress"
import Alert from "./Alert"
import brand from "../../public/smg-light-rounded.png"
import * as userSlice from "../../store/user"
import * as companyApis from "../../apis/company"
import axios from "../../utilities/axios"
import TermsAndConditions from "./TermsAndConditions"
import { emptyCart } from "../../store/cart"

export default function Navbar() {
  const userState = useSelector((state) => state.user)
  const cart = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const router = useRouter()

  const [anchorEl, setAnchorEl] = useState(null)
  const [anchorElNav, setAnchorElNav] = useState(null)
  const [anchorElUser, setAnchorElUser] = useState(null)
  const [company, setCompany] = useState(null)
  const [termsModal, setTermsModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const open = Boolean(anchorEl)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

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

  const getCompany = async () => {
    try {
      const response = await companyApis.getCompany(userState.token, userState.user.company_id)
      if (!response.status) throw new Error(response.message)
      setCompany(response.company)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
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
      router.replace("/auth/signin")
    }
    else if (item === "Document Number") router.replace("/wp/document_numbers")
    else router.replace(`/wp/${item.toLowerCase()}`)
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
    !userState.customer && { key: "dashboard", title: "Dashboard", link: "/wp/d", icon: <Icon.HomeOutlined /> },
    !userState.customer && { key: "returns", title: "Returns", link: "/wp/returns?status=Received", icon: <Icon.WarehouseOutlined /> },
    !userState.customer && { key: "fbas", title: "FBA Shipments", link: "/wp/fbas?status=Pending", icon: <Icon.LocalShippingOutlined /> },
    { key: "products", title: userState.customer ? "Products" : "Inventory", link: "/products", icon: <Icon.Inventory2Outlined /> },
    { key: "orders", title: userState.customer ? "Orders" : "Inventory Orders", link: userState.customer ? "/cp/orders" : "/wp/inventory-orders", icon: <Icon.CategoryOutlined /> }
  ].filter(Boolean)

  const settings = [
    !userState.customer && "Users",
    !userState.customer && "Supports",
    userState.companyUser && "Document Number",
    userState.companyUser && "Settings",
    "Logout"
  ].filter(Boolean)

  useEffect(() => {
    if (userState.companyUser) getCompany()
  }, [])

  return (
    <AppBar position="static" elevation={0}>
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
            <Image src={brand} alt="brand" width={48} height={48} />
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
                  <Typography textAlign="center">{page.icon} {page.title}</Typography>
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
            SMG
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.key}
                onClick={() => handleLink(page.link)}
                sx={{ my: 2, color: "white", display: "flex", alignItems: "center", gap: 1 }}
              >
                {page.icon} {page.title}
              </Button>
            ))}

            {userState.warehouseUser && userState.permissions && userState.permissions["READ_INVOICES"] &&
              <Button
                key="invoices"
                onClick={() => handleLink("/wp/invoices")}
                sx={{ my: 2, color: "white", display: "flex", alignItems: "center", gap: 1 }}
              >
                <Icon.ReceiptOutlined /> &nbsp; Invoices
              </Button>}

            {userState.warehouseUser && userState.permissions && userState.permissions["READ_PAYMENT_LOGS"] && (
              <Button
                onClick={handleClick}
                sx={{ my: 2, alignItems: "center" }}
              >
                <Icon.AssessmentOutlined /> &nbsp; Reports
              </Button>)}
            <Menu
              id="fade-menu"
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleLink("/wp/reports/payment-logs")}>Logs</MenuItem>
              <MenuItem onClick={() => handleLink("/wp/reports/income-statement")}>Income Statement</MenuItem>
            </Menu>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            {userState.companyUser && company?.status !== "onboard" &&
              <Button onClick={() => setTermsModal(true)}>
                {loading ? <CircularProgress color="inherit" size={20} /> : <Icon.SellOutlined />} &nbsp; Become a seller
              </Button>}
            {userState.companyUser && company?.status === "onboard" &&
              <Button onClick={() => router.push("/sp/d")} startIcon={<Icon.StorefrontOutlined />}>
                Seller Portal
              </Button>}

            {!userState.warehouseUser &&
              <Button
                key="cart"
                onClick={() => handleLink("/wp/cart")}
                sx={{ my: 2, color: "white", display: "flex", alignItems: "center", gap: 1 }}
              >
                <Icon.ShoppingCartOutlined />
                {cart.length > 0 && <Badge> {cart.length} </Badge>}
              </Button>}

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
                {settings.map((item, index) => (
                  <MenuItem key={index} onClick={() => handleMenuClick(item)}>
                    {item}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
