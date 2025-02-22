"use client"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Box, Button, Grid, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material"

import Alert from "@/app/components/Alert"
import Copyright from "@/app/components/Copyright"
import * as userApis from "@/app/apis/user"
import authImage from "@/public/auth.jpg"
import logoImage from "@/public/brand.png"

export default function CustomerRegister() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleChange = () => {
    setPasswordError(false)
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
      const payload = {
        name: e.target.name.value,
        username: e.target.username.value,
        email: e.target.email.value,
        mobile: e.target.mobile.value,
        password: e.target.password.value,
        type: "customer"
      }
      const response = await userApis.register(payload)
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
          <Typography variant="h3" fontWeight={700}>Stock my Goods</Typography>
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
          <Image src={logoImage} alt="logo-image" style={{ width: 96, height: 96 }} />
          <Typography variant="h6" fontWeight={700} mb={3}>Register to Continue</Typography>
          <ToggleButtonGroup
            color="primary"
            value="user"
            disabled={loading}
            exclusive
            onChange={() => {
              setLoading(true)
              router.push("/register")
            }}
            aria-label="Platform"
            sx={{marginBottom: 3}}
          >
            <ToggleButton value="company">Company</ToggleButton>
            <ToggleButton value="user">User</ToggleButton>
          </ToggleButtonGroup>

          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={1} mb={4}>
              <TextField type="text" name="name" label="Name" required autoFocus />
              <TextField type="text" name="username" label="Username" required />
              <TextField type="email" name="email" label="Email" required />
              <TextField type="text" name="mobile" label="Mobile" required />
              <TextField type="password" name="password" label="Password" required
                error={passwordError}
                helperText={passwordError ? "Password must contain an uppercase, a lowercase, a number and a special character and should be minimum of 8 characters" : ""}
                onChange={() => handleChange("password")}
              />

              <Button
                type="submit"
                fullWidth
                disabled={loading}
              >Register</Button>

              <Box textAlign="center">
                <Link href="/login" style={{ textDecoration: "none" }}>Already have an account? Login now!</Link>
              </Box>
            </Box>

            <Copyright />
          </form>
        </Grid>
      </Grid>
    </>
  )
}