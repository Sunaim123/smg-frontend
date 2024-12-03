"use client"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { Button, Container, TextField, Typography } from "@mui/material"

import Navbar from "@/app/components/Navbar"
import Alert from "@/app/components/Alert"
import * as userSlice from "@/app/store/user"
import axios from "@/app/utilities/axios"

export default function Company() {
  const router = useRouter()
  const dispatch = useDispatch()
  const userState = useSelector(state => state.user)
  const formRef = useRef(null)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })
  const handleSubmit = async (e) => {
    try {
      e.preventDefault()

      const name = e.target.name.value
      const email = e.target.email.value
      const mobile = e.target.mobile.value || null
      const payload = {
        id: userState.user.id, name, email, mobile
      }
      const { data: response } = await axios.put("/api/user/company", payload, {
        headers: {
          "Token": userState.token
        }
      })
      if (!response.status) throw new Error(response.message)

      setToast({ type: "success", open: true, message: "company saved" })
      dispatch(userSlice.company(response.company))
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (userState.customer) router.replace("/products")
    if (!userState.user) router.replace("/")

    formRef.current.name.value = userState.user.company?.name || ""
    formRef.current.email.value = userState.user.company?.email || ""
    formRef.current.mobile.value = userState.user.company?.mobile || ""
  }, [])

  return (
    <>
     <Alert toast={toast} setToast={setToast} />
      <Navbar />

      <br />

      <Container maxWidth="sm">
        <Typography variant="h3" sx={{ fontWeight: 700, my: 2, textAlign: "center" }}>Company Profile</Typography>

        <br />

        <form ref={formRef} onSubmit={handleSubmit}>
          <TextField fullWidth label="Name" variant="outlined"  name="name" sx={{ my: 1 }} />
          <TextField fullWidth label="Email" variant="outlined" name="email" sx={{ my: 1 }} />
          <TextField fullWidth label="Mobile" variant="outlined" name="mobile" sx={{ my: 1 }} />
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
    </>
  )
}