"use client"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Box } from "@mui/material"
import { CheckCircle } from "@mui/icons-material"
import Navbar from "@/app/components/Navbar"
import * as constants from "@/app/utilities/constants"
import Link from "next/link"

export default function StripeSuccess() {
  const userState = useSelector(state => state.user)

  useEffect(() => {
    if (!userState.user) window.location.href = "/login"
    if (!userState.companyUser) window.location.href = "/dashboard"

    setTimeout(() => {
      window.location.href = "/products"
    }, 2000);
  }, [])

  return (
    <>
      <Navbar />

      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <CheckCircle color="success" sx={{ fontSize: 144 }} />
        <h1 color="success" style={{ margin: 0 }}>Success</h1>
        <p style={{ color: "#ccc" }}>Your payment has been recieved. Continue purchasing</p>
        <Link style={{textDecoration: "none"}} href="/products">Inventory</Link>
      </Box>
    </>
  )
}