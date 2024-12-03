"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { useSelector } from "react-redux"
import { FormProvider, useForm } from "react-hook-form"
import { Autocomplete, Button, Container, Grid, TextField, Typography } from "@mui/material"

import Alert from "@/app/components/Alert"
import * as orderApis from "@/apis/order"
import FormField from "@/app/components/forms/FormField"

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
  const form = useForm()

  const [carrier, setCarrier] = useState("")
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleSubmit = async (data) => {
    try {

      const payload = {
        id: searchParams.get("id"),
        status: "shipped",
        carrier: carrier,
        tracking_number: data.tracking_number
      }

      const response = await orderApis.updateOrderLineItem(userState.token, payload)
      if (!response.status) throw new Error(response.message)

      setToast({ type: "success", open: true, message: "Order marked as shipped" })
      setCarrier("")
      router.back()
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  return (
    <>
      <Alert toast={toast} setToast={setToast} />
      <Container maxWidth="md">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <Typography variant="h4" fontWeight={700} my={1}>Mark as Shipped</Typography>

            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Autocomplete
                  disablePortal
                  options={shipping}
                  size="small"
                  fullWidth
                  onChange={(e, option) => setCarrier(option.label)}
                  renderInput={(params) => <FormField {...params} name="carrier" label="Shipping Carrier" />}
                />
              </Grid>
              <Grid item xs={6}>
                <FormField
                  type="text"
                  label="Tracking #"
                  name="tracking_number"
                  size="small"
                  rules={{ required: "Tracking Number is required" }}
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
        </FormProvider>
      </Container>
    </>
  )
}