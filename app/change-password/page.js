"use client"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { Button, Container, TextField, Typography } from "@mui/material"

import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Navbar from "@/app/components/Navbar"
import Loading from "../components/Loading"
import * as userApis from "@/app/apis/user"

export default function ChangePassword() {
  const router = useRouter()
  const userState = useSelector(state => state.user)
  const [loading, setLoading] = useState(true)
  const [passwordError, setPasswordError] = useState(false)
  const [confirmPasswordError, setConfirmPasswordError] = useState(false)
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
    e.preventDefault()
    try {
      setLoading(true)

      const validation = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/.test(e.target.password.value)
      if (!validation) {
        setPasswordError(true)
        return
      }

      if (e.target.password.value !== e.target.confirmPassword.value) return setConfirmPasswordError(true)

      const oldPassword = e.target.oldPassword.value
      const password = e.target.password.value
      const payload = {
        id: userState.user.id, oldPassword, password
      }
      const response = await userApis.changePassword(userState.token, payload)
      if (!response.status) throw new Error(response.message)

      setToast({ type: "success", open: true, message: "Password saved" })
      router.back()
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!userState.user) router.push("/")

    setLoading(false)
  }, [])

  if (loading)
    return (
      <Loading />
    )

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Navbar />

      <br />

      <Container maxWidth="sm">
        <Typography variant="h4" fontWeight={700} sx={{ fontWeight: 700, my: 2, textAlign: "center" }}>Change Password</Typography>

        <br />

        <form onSubmit={handleSubmit}>
          <TextField fullWidth type="password" label="Old Password" variant="outlined" name="oldPassword" sx={{ my: 1 }} />

          <TextField
            fullWidth
            type="password"
            label="New Password"
            variant="outlined"
            name="password"
            sx={{ my: 1 }}
            error={passwordError}
            helperText={passwordError ? "Please Enter a password with. At least one uppercase letter. At least one lowercase letter. At least one digit. At least one special character from the set #?!@$%^&*- and minimum length of 8 characters" : ""}
            onChange={() => handleChange("password")} />

          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            variant="outlined"
            name="confirmPassword"
            sx={{ my: 1 }}
            error={confirmPasswordError}
            helperText={confirmPasswordError ? "Both passwords should match" : ""}
            onChange={() => handleChange("confirm_password")} />

          <Button
            size="large"
            type="submit"
            variant="contained"
            color="primary"
            disableElevation
            fullWidth
            sx={{ my: 1 }}
          >
            Save
          </Button>
        </form>
      </Container>
    </Auth>
  )
}