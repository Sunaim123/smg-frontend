"use client"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { Button, TextField } from "@mui/material"

import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Loading from "../components/Loading"
import * as userSlice from "@/app/store/user"
import axios from "@/app/utilities/axios"

export default function Profile() {
  const router = useRouter()
  const dispatch = useDispatch()
  const userState = useSelector(state => state.user)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)

      const name = e.target.name.value
      const email = e.target.email.value
      const mobile = e.target.mobile.value || null
      const username = e.target.username.value
      const payload = {
        id: userState.user.id, name, email, mobile, username
      }
      const { data: response } = await axios.put("/api/user", payload, {
        headers: {
          "Token": userState.token
        }
      })
      if (!response.status) throw new Error(response.message)

      setToast({ type: "success", open: true, message: "Profile saved" })
      dispatch(userSlice.profile(response.user))
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!userState.user) window.location.href = "/"

    setLoading(false)
  }, [])

  if (loading)
    return (
      <Loading />
    )

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Name" variant="outlined" name="name" defaultValue={userState.user?.name} sx={{ my: 1 }} />
        <TextField fullWidth label="Email" variant="outlined" name="email" defaultValue={userState.user?.email} sx={{ my: 1 }} />
        <TextField fullWidth label="Mobile" variant="outlined" name="mobile" defaultValue={userState.user?.mobile} sx={{ my: 1 }} />
        <TextField fullWidth label="Username" variant="outlined" name="username" defaultValue={userState.user?.username} sx={{ my: 1 }} />
        <Button
          size="large"
          variant="outlined"
          color="primary"
          disableElevation
          sx={{ my: 1 }}
          onClick={() => router.push("/change-password")}
        >
          Change password
        </Button>
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
    </Auth >
  )
}