"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useRef, useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Autocomplete, Button, Container, Grid, TextField, Typography } from "@mui/material"

import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import SellerNavbar from "@/app/components/SellerNavbar"
import * as orderApis from "@/app/apis/order"

const shipping = [
  { label: "UPS" },
  { label: "USPS" },
  { label: "Fedex" },
  { label: "Speedy Post" }
]

export default function shipOrder() {
  const userState = useSelector((state) => state.user)
  const router = useRouter()
  const searchParams = useSearchParams()

  const formRef = useRef(null)
  const [carrier, setCarrier] = useState(null)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      const form = new FormData()

      form.append("id", searchParams.get("id"))
      form.append("order_status", "shipped")
      form.append("carrier", carrier.label)
      form.append("tracking_number", e.target.tracking_number.value)

      const response = await orderApis.updateOrder(userState.token, form)
      if (!response.status) throw new Error(response.message)

      setToast({ type: "success", open: true, message: "Order marked as shipped" })

      router.back()
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const getOrder = async () => {
    try {
      const response = await orderApis.getOrder(userState.token, searchParams.get("id"))
      if (!response.status) throw new Error(response.message)

      formRef.current.tracking_number.value = response.order.tracking_number
      setCarrier(response.order.carrier)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (searchParams.has("id")) getOrder()
  }, [])

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <SellerNavbar />

      <Container maxWidth="md">
        <form ref={formRef} onSubmit={handleSubmit}>
          <Typography variant="h4" fontWeight={700} my={1}>Shipping Details</Typography>

          <Grid container spacing={1}>
            <Grid item xs={3}>
              <Autocomplete
                disablePortal
                options={shipping}
                size="small"
                value={carrier}
                fullWidth
                onChange={(event, newValue) => setCarrier(newValue)}
                renderInput={(params) => <TextField {...params} name="carrier" label="Shipping Carrier" />}
              />
            </Grid>
            <Grid item xs={9}>
              <TextField
                type="text"
                label="Tracking #"
                name="tracking_number"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={9} />
            <Grid item xs={3}>
              <Button
                type="submit"
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