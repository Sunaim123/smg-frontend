"use client"
import NextLink from "next/link"
import Image from "next/image"
import { useSelector } from "react-redux"
import { AppBar, Button, Link, Toolbar, Typography } from "@mui/material"
import brand from "@/public/brand-dark.png"

export default function GuestNavbar() {
  const userState = useSelector((state) => state.user)

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Toolbar sx={{ flexWrap: 'wrap' }}>
        <Typography variant="h4" fontWeight={700} color="inherit" noWrap sx={{ flexGrow: 1 }}><Image src={brand} alt="brand" width={48} height={48} /></Typography>
        <nav>
          <NextLink href="/" style={{ textDecoration: "none" }}>
            <Link
              variant="button"
              color="text.primary"
              underline="none"
              sx={{ my: 1, mx: 1.5 }}
            >
              Home
            </Link>
          </NextLink>
          <NextLink href="/#pricing" style={{ textDecoration: "none" }}>
            <Link
              variant="button"
              color="text.primary"
              underline="none"
              sx={{ my: 1, mx: 1.5 }}
            >
              Pricing
            </Link>
          </NextLink>
          <NextLink href="/#products" style={{ textDecoration: "none" }}>
            <Link
              variant="button"
              color="text.primary"
              underline="none"
              sx={{ my: 1, mx: 1.5 }}
            >
              Products
            </Link>
          </NextLink>
        </nav>
        {
          !userState.user
            ? <Button href="/login" variant="outlined" sx={{ my: 1, mx: 1.5 }}>Login</Button>
            : <Button href="/dashboard" variant="outlined" sx={{ my: 1, mx: 1.5 }}>Dashboard</Button>
        }
      </Toolbar>
    </AppBar>
  )
}
