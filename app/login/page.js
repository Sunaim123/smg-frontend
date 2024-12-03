"use client"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { Box, Button, Grid, TextField, Typography } from "@mui/material"

import * as userApis from "@/app/apis/user"
import Alert from "@/app/components/Alert"
import Copyright from "@/app/components/Copyright"
import * as userSlice from "@/app/store/user"
import authImage from "@/public/auth.jpg"
import logoImage from "@/public/smg-light-rounded.png"

export default function Page() {
  const dispatch = useDispatch()
  const router = useRouter()
  const [usernameError, setUsernameError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleChange = (type) => {
    switch (type) {
      case "username":
        setUsernameError(false)
        break
      case "password":
        setPasswordError(false)
        break
    }
  }

  const handleSubmit = async (e) => {
    try {
      setLoading(true)
      e.preventDefault()

      if (!e.target.username.value) return setUsernameError(true)
      if (!e.target.password.value) return setPasswordError(true)

      const payload = {
        username: e.target.username.value,
        password: e.target.password.value
      }
      const response = await userApis.login(payload)
      if (!response.status) throw new Error(response.message)

      dispatch(userSlice.login(response))
      e.target.reset()

      router.replace("/dashboard")
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
        <Grid item xs={12} md={8} square="true"
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            px: 8,
          }}

        >
          <Typography variant="h3" fontWeight={700}>Stock my Goods</Typography>
          <Image src={authImage} alt="service-image" style={{ width: "70%", height: "60%" }} />
          <Typography variant="body1" color="primary">Reverse Logisitics . Warehouse Management . Inventory Management . Return Management</Typography>
        </Grid>
        <Grid item xs={12} md={4} square="true"
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
          <Image src={logoImage} alt="logo-image" style={{ width: 96, height: 96 }} />
          <Typography variant="h6" fontWeight={700} mb={3}>Login to Continue</Typography>

          <form onSubmit={handleSubmit} noValidate>
            <Box display="flex" flexDirection="column" gap={1} mb={4}>
              <TextField type="text" name="username" label="Email or Username" required autoFocus error={usernameError} helperText={usernameError ? "Enter your username to continue" : ""} onChange={() => handleChange("username")} />
              <TextField type="password" name="password" label="Password" required error={passwordError} helperText={passwordError ? "Enter your password to continue" : ""} onChange={() => handleChange("password")} />

              <Box textAlign="right">
                <Link href="/validate-email" style={{ textDecoration: "none" }}>Forgot Password?</Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                size="large"
                disabled={loading}
              >Login</Button>

              <Box textAlign="center">
                <Link href="/register" style={{ textDecoration: "none" }}>Don't have an account? Register now!</Link>
              </Box>
            </Box>

            <Copyright />
          </form>
        </Grid>
      </Grid>
    </>
  )
}