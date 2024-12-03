"use client"
import Link from "next/link"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { Box, Button } from "@mui/material"
import { CheckCircle } from "@mui/icons-material"
import Layout from "../../components/Layout"

export default function StripeReturn() {
  const router = useRouter()
  const userState = useSelector(state => state.user)

  useEffect(() => {
    if (!userState.user) router.replace("/login")
  }, [])

  return (
    <Layout>
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }} my={10}>
        <CheckCircle color="success" sx={{ fontSize: 144 }} />
        <h1 color="success" style={{ margin: 0 }}>Success</h1>
        <p style={{ color: "#ccc" }}>Your subscription has been created successfully.</p>
        <Button variant="outlined" onClick={() => router.push("/wp/d")}>Dashboard</Button>
      </Box>
    </Layout>
  )
}