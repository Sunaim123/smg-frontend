"use client"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { Box } from "@mui/material"
import { Cancel } from "@mui/icons-material"
import Navbar from "@/app/components/Navbar"
import * as constants from "@/app/utilities/constants"

export default function StripeCancel() {
  const router = useRouter()
  const userState = useSelector(state => state.user)

  useEffect(() => {
    if (!userState.user) router.replace("/login")
    if (!userState.companyUser) router.replace("/products")
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