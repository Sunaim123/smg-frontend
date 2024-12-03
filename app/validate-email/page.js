"use client"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { Box, Button, Grid, TextField, Typography } from "@mui/material"

import Alert from "@/app/components/Alert"
import Copyright from "@/app/components/Copyright"
import * as userApis from "@/app/apis/user"
import * as userSlice from "@/app/store/user"
import authImage from "@/public/auth.jpg"

export default function ValidateEmail() {
  const dispatch = useDispatch()
  const router = useRouter()
  const [emailError, setEmailError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleChange = (type) => {
    switch (type) {
      case "email":
        setEmailError(false)
        break
    }
  }

  const handleSubmit = async (e) => {
    try {
      setLoading(true)
      e.preventDefault()

      if (!e.target.email.value) return setEmailError(true)

      const payload = {
        email: e.target.email.value,
      }
      const response = await userApis.validateEmail(payload)
      if (!response.status) throw new Error(response.message)

      dispatch(userSlice.email(payload.email))
      e.target.reset()

      router.replace("/validate-code")
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
            <TextField type="text" name="email" label="Email Address" required autoFocus error={emailError} helperText={emailError ? "Enter your email to continue" : ""} onChange={() => handleChange("email")} />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disableElevation
              disabled={loading}
              sx={{ my: 1 }}
            >Continue</Button>

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