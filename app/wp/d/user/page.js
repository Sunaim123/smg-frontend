"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { FormProvider, useForm } from "react-hook-form"
import { Button, Container, Grid, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material"

import Alert from "@/app/components/Alert"
import * as userApis from "@/apis/user"
import * as roleApis from "@/apis/role"
import FormField from "@/app/components/forms/FormField"

export default function User() {
  const userState = useSelector(state => state.user)
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState([])
  const [role, setRole] = useState()
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      username: "",
      password: ""
    }
  })

  const handleSubmit = async (data) => {
    try {
      setLoading(true)

      const payload = {
        name: data.name,
        email: data.email,
        mobile: data.mobile || null,
        username: data.email,
        password: data.password,
        role_id: role,
      }

      if (searchParams.get("id")) {
        const response = await userApis.updateUser(userState.token, { ...payload, id: searchParams.get("id") })
        if (!response.status) throw new Error(response.message)
      } else {
        const response = await userApis.createUser(userState.token, payload)
        if (!response.status) throw new Error(response.message)
      }

      setToast({ type: "success", open: true, message: "Saved" })
      form.reset()
      setRole()
      router.back()
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    } finally {
      setLoading(false)
    }
  }

  const getRoles = async (query) => {
    try {
      const response = await roleApis.getRoles(userState.token, query)
      if (!response.status) throw new Error(response.message)

      setRoles(response.roles)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const getUser = async () => {
    try {
      const response = await userApis.getUser(userState.token, searchParams.get("id"))
      if (!response.status) throw new Error(response.message)

      form.setValue("name", response.user.name)
      form.setValue("email", response.user.email)
      form.setValue("mobile", response.user.mobile)
      form.setValue("password", response.user.password)

    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (userState.customer) router.replace("/products")

    let params
    if (userState.warehouseUser) params = { role: "warehouse" }
    if (userState.companyUser || userState.companyAdmin) params = { role: "company" }

    const query = new URLSearchParams(params)
    getRoles(query.toString())

    if (searchParams.get("id")) getUser()
  }, [])


  return (
    <>
      <Alert toast={toast} setToast={setToast} />
      <br />

      <Container maxWidth="sm">
        <Typography variant="h4" fontWeight={700}>User</Typography>

        <br />

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <FormField name="name" label="Name" size="small" rules={{ required: "Name is required" }} disabled={searchParams.has("id")} />
              </Grid>
              <Grid item xs={12}>
                <FormField name="email" label="Email" size="small" rules={{ required: "Email is required" }} disabled={searchParams.has("id")} type="email" />
              </Grid>
              <Grid item xs={12}>
                <FormField name="mobile" label="Mobile" size="small" type="tel" />
              </Grid>
              <Grid item xs={12}>
                <FormField
                  name="password"
                  type="password"
                  label="Password"
                  size="small"
                  disabled={searchParams.has("id")}
                  rules={{
                    required: "Password is required",
                    pattern: {
                      value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                      message: "Password should have 8 characters, an uppercase, a lowercase, a number, and a special character"
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel size="small">Role</InputLabel>
                  <Select size="small" label="Role" labelId="role" id="role" name="role" onChange={(e) => setRole(e.target.value)}>
                    {roles.map((x) => (<MenuItem value={x.id}>{x.name}</MenuItem>))}
                  </Select>
                </FormControl>
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