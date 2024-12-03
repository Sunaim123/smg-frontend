"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { Button, Container, Grid, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material"

import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Navbar from "@/app/components/Navbar"
import * as userApis from "@/app/apis/user"
import * as roleApis from "@/app/apis/role"

export default function User() {
  const userState = useSelector(state => state.user)
  const searchParams = useSearchParams()
  const router = useRouter()
  const formRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState([])
  const [role, setRole] = useState()
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleRoleChange = async (e) => {
    setRole(e.target.value)
  }

  const handleSubmit = async (e) => {
    try {
      setLoading(true)
      e.preventDefault()

      const payload = {
        name: e.target.name.value,
        email: e.target.email.value,
        mobile: e.target.mobile.value || null,
        username: e.target.username.value,
        password: e.target.password.value,
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

      formRef.current.name.value = response.user.name
      formRef.current.email.value = response.user.email
      formRef.current.mobile.value = response.user.mobile
      formRef.current.username.value = response.user.username
      formRef.current.password.value = response.user.password

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
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Navbar />

      <br />

      <Container maxWidth="sm">
        <Typography variant="h4" fontWeight={700}>User</Typography>

        <br />

        <form ref={formRef} onSubmit={handleSubmit}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField name="name" label="Name" size="small" fullWidth required disabled={searchParams.has("id")} />
            </Grid>
            <Grid item xs={12}>
              <TextField name="email" label="Email" size="small" fullWidth required disabled={searchParams.has("id")} type="email" />
            </Grid>
            <Grid item xs={12}>
              <TextField name="mobile" label="Mobile" size="small" fullWidth type="tel" />
            </Grid>
            <Grid item xs={12}>
              <TextField name="username" label="Username" size="small" fullWidth required disabled={searchParams.has("id")} />
            </Grid>
            <Grid item xs={12}>
              <TextField name="password" label="Password" size="small" fullWidth required disabled={searchParams.has("id")} type="password" />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel size="small">Role</InputLabel>
                <Select size="small" label="Role" labelId="role" id="role" name="role" onChange={(e) => handleRoleChange(e)}>
                  {roles.map((x) => (<MenuItem value={x.id}>{x.name}</MenuItem>))}
                </Select>
              </FormControl>
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