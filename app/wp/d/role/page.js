"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { FormProvider, useForm } from "react-hook-form"
import { Button, Container, Grid, TextField, Typography } from "@mui/material"

import Alert from "@/app/components/Alert"
import * as roleApis from "@/apis/role"
import FormField from "@/app/components/forms/FormField"

export default function Role() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const formRef = useRef(null)
  const userState = useSelector(state => state.user)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })
  const form = useForm({
    defaultValues: { name: "" }
  })

  const handleSubmit = async (data) => {
    try {
      setLoading(true)

      const payload = {
        name: data.name
      }

      if (searchParams.get("id")) {
        const response = await roleApis.updateRole(userState.token, { ...payload, id: searchParams.get("id") })
        if (!response.status) throw new Error(response.message)
      } else {
        const response = await roleApis.createRole(userState.token, payload)
        if (!response.status) throw new Error(response.message)
      }

      setToast({ type: "success", open: true, message: "Saved" })
      form.reset()
      router.back()
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    } finally {
      setLoading(false)
    }
  }

  const getRole = async () => {
    try {
      const response = await roleApis.getRole(userState.token, searchParams.get("id"))
      if (!response.status) throw new Error(response.message)

      form.reset({ name: response.role.name })

    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (userState.customer) router.replace("/products")
    if (searchParams.has("id")) getRole()
  }, [])


  return (
    <>
      <Alert toast={toast} setToast={setToast} />
      <br />

      <Container maxWidth="sm">
        <Typography variant="h4" fontWeight={700}>Role</Typography>

        <br />

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <FormField name="name" label="Name" size="small" rules={{ required: "Name is required" }} />
              </Grid>
              <Grid item xs={12} md={8} />
              <Grid item xs={12} md={4}>
                <Button type="submit" variant="contained" disabled={loading} fullWidth>Save</Button>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </Container>
    </>
  )
}