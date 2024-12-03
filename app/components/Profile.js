"use client"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter, usePathname } from "next/navigation"
import { FormProvider, useForm } from "react-hook-form"
import { Button } from "@mui/material"

import Alert from "./Alert"
import Auth from "./Auth"
import Loading from "./Loading"
import * as userSlice from "../../store/user"
import axios from "../../utilities/axios"
import FormField from "./forms/FormField"

export default function Profile() {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useDispatch()
  const userState = useSelector(state => state.user)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })
  const form = useForm({
    defaultValues: {
      name: userState.user?.name,
      email: userState.user?.email,
      mobile: userState.user?.mobile,
      username: userState.user?.username
    }
  })

  const handlePasswordRoute = () => {
    if (pathname.startsWith('/wp')) router.push("/wp/d/change-password")
    if (pathname.startsWith('/sp')) router.push("/sp/d/change-password")
  }

  const handleSubmit = async (data) => {
    try {
      setLoading(true)

      const name = data.name
      const email = data.email
      const mobile = data.mobile || null
      const username = data.username
      const payload = {
        id: userState.user.id, name, email, mobile, username
      }
      const { data: response } = await axios.put("/api/user", payload, {
        headers: {
          "Token": userState.token
        }
      })
      if (!response.status) throw new Error(response.message)

      form.reset({
        name: "",
        email: "",
        mobile: "",
        username: ""
      })
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
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField label="Name" variant="outlined" name="name" sx={{ my: 1 }} />
          <FormField label="Email" variant="outlined" name="email" sx={{ my: 1 }} />
          <FormField label="Mobile" variant="outlined" name="mobile" sx={{ my: 1 }} />
          <FormField label="Username" variant="outlined" name="username" sx={{ my: 1 }} />
          <Button
            size="large"
            variant="outlined"
            color="primary"
            disableElevation
            sx={{ my: 1 }}
            onClick={handlePasswordRoute}
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
      </FormProvider>
    </Auth >
  )
}