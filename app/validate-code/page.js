"use client"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useSelector } from "react-redux"
import { Box, Button, Grid, TextField, Typography } from "@mui/material"

import Alert from "@/app/components/Alert"
import Copyright from "@/app/components/Copyright"
import * as userApis from "@/app/apis/user"
import authImage from "@/public/auth.jpg"

export default function ValidateCode() {
  const userState = useSelector((state) => state.user)
  const router = useRouter()
  const [codeError, setCodeError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleChange = (type) => {
    switch (type) {
      case "code":
        setCodeError(false)
        break
    }
  }

  const handleResend = async () => {
    try {
      setLoading(true)

      if (!userState.email) throw new Error('Email not found to resend verification code')

      const payload = {
        email: userState.email,
      }
      const response = await userApis.validateEmail(payload)
      if (!response.status) throw new Error(response.message)

      setToast({ type: "success", open: true, message: "A verification code has been resent to your email" })
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    try {
      setLoading(true)
      e.preventDefault()

      if (!userState.email) throw new Error('Email not found to resend verification code')
      if (!e.target.code.value) return setCodeError(true)

      const payload = {
        email: userState.email,
        code: e.target.code.value,
      }
      const response = await userApis.validateCode(payload)
      if (!response.status) throw new Error(response.message)

      e.target.reset()
      router.replace("/reset-password")
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Alert toast={toast} setToast={setToast} />

      <Grid container sx={{ height: "100vh" }}>
        <Grid item xs={12} md={8} square
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            px: 8,
          }}

        >
          <Typography variant="h3">Stock my Goods</Typography>
          <Image src={authImage} alt="service-image" style={{ width: "70%", height: "60%" }} />
          <Typography variant="body1" color="primary">Reverse Logisitics . Warehouse Management . Inventory Management . Return Management</Typography>
        </Grid>
        <Grid item xs={12} md={4} square
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderLeft: "1px solid #ccc",
            px: 8,
          }}
        >
          <h3>Forgot Password</h3>

          <form onSubmit={handleSubmit} sx={{ mt: 1 }} noValidate>
            <TextField type="text" name="code" label="Verification Code" required autoFocus error={codeError} helperText={codeError ? "Enter your code to continue" : ""} onChange={() => handleChange("code")} />

            <Box textAlign="right">
              <Button
                type="button"
                variant="text"
                disableElevation
                disabled={loading}
                onClick={handleResend}
              >Resend Code</Button>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disableElevation
              disabled={loading}
              sx={{ my: 1 }}
            >Login</Button>

            <Box textAlign="center" mb={4}>
              <Link href="/login" style={{ textDecoration: "none" }}>Back to Login</Link>
            </Box>

            <Copyright />
          </form>
        </Grid>
      </Grid>
    </>
  )
}