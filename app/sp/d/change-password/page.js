"use client"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { FormProvider, useForm } from "react-hook-form"
import { Button, Container, TextField, Typography } from "@mui/material"

import Alert from "@/app/components/Alert"
import Loading from "@/app/components/Loading"
import * as userApis from "@/apis/user"
import FormField from "@/app/components/forms/FormField"

export default function ChangePassword() {
  const router = useRouter()
  const userState = useSelector(state => state.user)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })
  const form = useForm({
    defaultValues: {
      password: "",
      confirm_password: "",
      old_password: ""
    }
  })

  const handleSubmit = async (data) => {
    try {
      setLoading(true)

      const old_password = data.old_password
      const password = data.password
      const payload = {
        id: userState.user.id, old_password, password
      }
      const response = await userApis.changePassword(userState.token, payload)
      if (!response.status) throw new Error(response.message)

      setToast({ type: "success", open: true, message: "Password saved" })
      form.reset()
      router.back()
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!userState.user) router.push("/auth/signin")

    setLoading(false)
  }, [])

  if (loading)
    return (
      <Loading />
    )

  return (
    <>
      <Alert toast={toast} setToast={setToast} />
      <br />

      <Container maxWidth="sm">
        <Typography variant="h4" fontWeight={700} sx={{ fontWeight: 700, my: 2, textAlign: "center" }}>Change Password</Typography>

        <br />

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              type="password"
              label="Old Password"
              name="old_password"
              sx={{ my: 1 }}
              rules={{ required: "Old Password is required" }} />

            <FormField
              type="password"
              name="password"
              label="Password"
              rules={{
                required: "Password is required",
                pattern: {
                  value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                  message: "Password should have 8 characters, an uppercase, a lowercase, a number, and a special character"
                },
              }} />

            <FormField
              type="password"
              name="confirm_password"
              label="Confirm Password"
              rules={{
                required: "Confirm your password",
                validate: (value) =>
                  value === form.getValues("password") || "Passwords do not match",
              }} />

            <Button
              size="large"
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              disableElevation
              fullWidth
              sx={{ my: 1 }}
            >
              Save
            </Button>
          </form>
        </FormProvider>
      </Container>
    </>
  )
}