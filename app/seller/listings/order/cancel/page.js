"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Button, Container, Grid, TextField, Typography } from "@mui/material"

import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import SellerNavbar from "@/app/components/SellerNavbar"
import * as orderApis from "@/app/apis/order"

export default function shipOrder() {
  const userState = useSelector((state) => state.user)
  const router = useRouter()
  const searchParams = useSearchParams()

  const formRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      if (!window.confirm("Are you sure you want to cancel this order?")) return
      setLoading(true)

      const payload = {
        id: searchParams.get("id"),
        order_status: "cancelled",
        cancel_reason: e.target.cancel_reason.value
      }
      const response = await orderApis.updateOrder(userState.token, payload)
      if (!response.status) throw new Error(response.message)

      setToast({ type: "success", open: true, message: "Cancelled" })

      e.target.reset()
      router.back()
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <SellerNavbar />

      <Container maxWidth="md">
        <form ref={formRef} onSubmit={handleSubmit}>
          <Typography variant="h4" fontWeight={700} my={1}>Cancel Order # {searchParams.get("id")}</Typography>

          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                type="text"
                label="Cancel Reason"
                name="cancel_reason"
                size="small"
                fullWidth
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={9} />
            <Grid item xs={3}>
              <Button
                type="submit"
                disabled={loading}
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disableElevation
              >Submit</Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Auth>
  )
}