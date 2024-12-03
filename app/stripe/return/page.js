"use client"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { Box } from "@mui/material"
import { CheckCircle } from "@mui/icons-material"
import Navbar from "@/app/components/Navbar"
import * as constants from "@/app/utilities/constants"
import Link from "next/link"

export default function StripeReturn() {
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
        <CheckCircle color="success" sx={{ fontSize: 144 }} />
        <h1 color="success" style={{ margin: 0 }}>Success</h1>
        <p style={{ color: "#ccc" }}>Your subscription has been created successfully. Please login again to continue</p>
        <Link href="/login">Login</Link>
      </Box>
    </>
  )
}