"use client"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Box } from "@mui/material"
import { Cancel } from "@mui/icons-material"
import Navbar from "@/app/components/Navbar"
import * as constants from "@/app/utilities/constants"

export default function StripeCancel() {
  const userState = useSelector(state => state.user)

  useEffect(() => {
    if (!userState.user) window.location.href = "/login"
    if (!userState.companyUser) window.location.href = "/dashboard"
  }, [])

  return (
    <>
      <Navbar />

      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <Cancel color="error" sx={{ fontSize: 144 }} />
        <h1 color="success" style={{ margin: 0 }}>Cancel</h1>
        <p style={{ color: "#ccc" }}>You are unable to make payment. Please try again</p>
      </Box>
    </>
  )
}