"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { Button, Container, Grid, TextField, Typography } from "@mui/material"

import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Navbar from "@/app/components/Navbar"
import * as roleApis from "@/app/apis/role"

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

  const handleSubmit = async (e) => {
    try {
      setLoading(true)
      e.preventDefault()

      const payload = {
        name: e.target.name.value,
      }

      if (searchParams.get("id")) {
        const response = await roleApis.updateRole(userState.token, { ...payload, id: searchParams.get("id") })
        if (!response.status) throw new Error(response.message)
      } else {
        const response = await roleApis.createRole(userState.token, payload)
        if (!response.status) throw new Error(response.message)
      }

      setToast({ type: "success", open: true, message: "Saved" })
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

      formRef.current.name.value = response.role.name

    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (userState.customer) router.replace("/products")
    if (searchParams.has("id")) getRole()
  }, [])


  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Navbar />

      <br />

      <Container maxWidth="sm">
        <Typography variant="h4" fontWeight={700}>Role</Typography>

        <br />

        <form ref={formRef} onSubmit={handleSubmit}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField name="name" label="Name" size="small" fullWidth required />
            </Grid> 
            <Grid item xs={12} md={8} />
            <Grid item xs={12} md={4}>
              <Button type="submit" disabled={loading} fullWidth>Save</Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Auth>
  )
}