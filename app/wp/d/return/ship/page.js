"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { FormProvider, useForm } from "react-hook-form"
import { Autocomplete, Box, Button, Container, Grid, Typography, IconButton, Card } from "@mui/material"
import CloudUploadOutlined from "@mui/icons-material/CloudUploadOutlined"
import DeleteOutlined from "@mui/icons-material/DeleteOutlined"

import Alert from "@/app/components/Alert"
import Loading from "@/app/components/Loading"
import VisuallyHiddenInput from "@/app/components/VisuallyHiddenInput"
import * as returnApis from "@/apis/return"
import FormField from "@/app/components/forms/FormField"

const shipping = [
  { label: "UPS" },
  { label: "USPS" },
  { label: "Fedex" },
  { label: "Speedy Post" }
]

export default function Ship() {
  const userState = useSelector((state) => state.user)
  const router = useRouter()
  const searchParams = useSearchParams()

  const [_return, setReturn] = useState(null)
  const [loading, setLoading] = useState(false)
  const [carrier, setCarrier] = useState("")
  const [label, setLabel] = useState({ name: "Upload Label" })
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })
  const form = useForm({
    defaultValues: {
      description: "",
      quantity_shipped: "",
      tracking_number: ""
    }
  })

  const handleSubmit = async (data) => {
    try {
      setLoading(true)

      if (_return.quantity_shipped && _return.quantity && (_return.quantity - _return.quantity_shipped) < parseInt(data.quantity_shipped)) throw new Error("Quantity should be less than or equal to " + (_return.quantity - _return.quantity_shipped))
      else if (_return.quantity && _return.quantity < parseInt(data.quantity_shipped)) throw new Error("Quantity should be less than or equal to " + _return.quantity)

      const payload = {
        return_id: _return.id,
        description: data.description,
        quantity_shipped: data.quantity_shipped,
        carrier: carrier,
        tracking_number: data.tracking_number,
        label_url: label,
        title: "Ship Requested",
        return_status: "ship requested"
      }

      const response = await returnApis.patchReturn(userState.token, payload)
      if (!response.status) throw new Error(response.message)

      setToast({ type: "success", open: true, message: `Return marked as ${data.title}` })
      form.reset()
      router.back()
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    } finally {
      setLoading(false)
    }
  }

  const getReturn = async () => {
    try {
      const response = await returnApis.getReturn(userState.token, searchParams.get("id"))
      if (!response.status) throw new Error(response.message)

      setReturn(response.return)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (userState.customer) router.replace("/products")
    getReturn()
  }, [])

  if (!_return)
    return (
      <Loading />
    )

  const shipRequest = _return.return_status === "received" || _return?.quantity - _return?.quantity_shipped > 0
  const shipRequested = _return.return_status === "received" || _return.return_status === "ship requested" || _return?.quantity - _return?.quantity_shipped > 0
  if (!((userState.companyUser && shipRequest) || (userState.warehouseUser && shipRequested))) router.replace("/sp/d")

  return (
    <>
      <Alert toast={toast} setToast={setToast} />
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight={700} my={3}>{searchParams.get("title")}</Typography>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            {_return.quantity_shipped && _return.quantity && <Typography variant="body2" mb={3}>Quantity Remaining: {_return.quantity - _return.quantity_shipped}</Typography>}

            <Grid container spacing={1}>
              <Grid item xs={12}>
                <FormField
                  type="text"
                  label="Notes"
                  name="description"
                  size="small"
                />
              </Grid>
              <Grid item xs={2}>
                <FormField type="text" label="Quantity" variant="outlined" name="quantity_shipped" size="small" />
              </Grid>
              <Grid item xs={4}>
                <Autocomplete
                  disablePortal
                  options={shipping}
                  size="small"
                  renderInput={(params) => <FormField {...params} name="carrier" label="Shipping Carrier" />}
                  onChange={(e, option) => setCarrier(option.label)}
                  freeSolo
                />
              </Grid>
              <Grid item xs={6}>
                <FormField
                  type="text"
                  label="Tracking #"
                  name="tracking_number"
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                {!label?.type && (
                  <Button component="label" variant="outlined" startIcon={<CloudUploadOutlined />} fullWidth>
                    Upload Label
                    <VisuallyHiddenInput
                      type="file"
                      name="label_url"
                      onChange={(e) => setLabel(e.target.files[0])}
                      accept=".pdf"
                      required={userState.companyUser}
                    />
                  </Button>
                )}
                {label?.type && (
                  <Card variant="outlined">
                    <Box display="flex" justifyContent="space-between" alignItems="center" px={2}>
                      <Typography variant="body2">{label?.name}</Typography>
                      <IconButton color="error" onClick={() => setLabel(null)}>
                        <DeleteOutlined fontSize="small" />
                      </IconButton>
                    </Box>
                  </Card>
                )}
              </Grid>
              <Grid item xs={9} />
              <Grid item xs={3}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disableElevation
                  disabled={loading}
                >{searchParams.get("title")}</Button>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </Container>
    </ >
  )
}