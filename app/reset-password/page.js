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

export default function ResetPassword() {
  const userState = useSelector((state) => state.user)
  const router = useRouter()
  const [passwordError, setPasswordError] = useState(false)
  const [confirmPasswordError, setConfirmPasswordError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleChange = (type) => {
    switch (type) {
      case "password":
        setPasswordError(false)
        break
      case "confirm_password":
        setConfirmPasswordError(false)
        break
    }
  }

  const handleSubmit = async (e) => {
    try {
      setLoading(true)
      e.preventDefault()

      const validation = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/.test(e.target.password.value)
      if (!validation) {
        setPasswordError(true)
        return
      }

      if (!e.target.password.value) return setPasswordError(true)
      if (!e.target.confirm_password.value) return setConfirmPasswordError(true)
      if (e.target.password.value !== e.target.confirm_password.value) return setConfirmPasswordError(true)

      const payload = {
        email: userState.email,
        password: e.target.password.value,
      }
      const response = await userApis.resetPassword(payload)
      if (!response.status) throw new Error(response.message)

      e.target.reset()

      router.replace("/login")
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
            <TextField type="password" name="password" label="Password" required autoFocus error={passwordError} helperText={passwordError ? "Please Enter a password with. At least one uppercase letter. At least one lowercase letter. At least one digit. At least one special character from the set #?!@$%^&*- and minimum length of 8 characters" : ""} onChange={() => handleChange("password")} />
            <TextField type="password" name="confirm_password" label="Confirm Password" required error={confirmPasswordError} helperText={confirmPasswordError ? "Both passwords should match" : ""} onChange={() => handleChange("confirm_password")} />

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