"use client"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Container, Grid, Button, TextField, Typography } from "@mui/material"
import * as newsletterApis from "@/apis/newsletter"
import Alert from "@/app/components/Alert"

export default function newsletter() {
  const router = useRouter()
  const formRef = useRef(null)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {

      const payload = {
        email: e.target.email.value
      }
      const response = await newsletterApis.unsubscribeNewsletter(payload)
      if (!response.status) throw new Error(response.message)

      setToast({ type: "success", open: true, message: "You have successfully unsubscribed" })
      setTimeout(() => {
        router.replace("https://stockmygoods.com/")
      }, 2000);
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }
  return (
    <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Alert toast={toast} setToast={setToast} />
      <form ref={formRef} onSubmit={handleSubmit} encType="multipart/form-data">
        <Grid container flexDirection="column" alignItems="center" spacing={1}>
          <Grid item>
            <Typography variant="h4" fontWeight={700}>Unsubscribe from Newsletter</Typography>
          </Grid>
          <Grid item sx={{ width: '100%', maxWidth: '400px' }}>
            <TextField name="email" size="small" type="email" label="Enter your email" />
          </Grid>
          <Grid item>
            <Button type="submit" sx={{ padding: "6px 16px", border: "none", borderRadius: 2, backgroundColor: "#3754A5" }}>Unsubscribe</Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  )
}
