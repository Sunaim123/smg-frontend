"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Autocomplete, Box, Button, Container, Grid, TextField, Typography, IconButton, Card, CardContent } from "@mui/material"
import CloudUploadOutlined from "@mui/icons-material/CloudUploadOutlined"
import DeleteOutlined from "@mui/icons-material/DeleteOutlined"

import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Loading from "@/app/components/Loading"
import Navbar from "@/app/components/Navbar"
import VisuallyHiddenInput from "@/app/components/VisuallyHiddenInput"
import * as returnApis from "@/app/apis/return"

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

  const formRef = useRef(null)
  const [_return, setReturn] = useState(null)
  const [loading, setLoading] = useState(false)
  const [label, setLabel] = useState({ name: "Upload Label" })
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleSubmit = async (e) => {
    try {
      setLoading(true)
      const form = new FormData()
      e.preventDefault()

      if (_return.quantity_shipped && _return.quantity && (_return.quantity - _return.quantity_shipped) < parseInt(e.target.quantity_shipped.value)) throw new Error("Quantity should be less than or equal to " + (_return.quantity - _return.quantity_shipped))
      else if (_return.quantity && _return.quantity < parseInt(e.target.quantity_shipped.value)) throw new Error("Quantity should be less than or equal to " + _return.quantity)

      form.append("return_id", _return.id)
      form.append("description", e.target.description.value)
      form.append("quantity_shipped", e.target.quantity_shipped.value)
      form.append("carrier", e.target.carrier.value)
      form.append("tracking_number", e.target.tracking_number.value)
      form.append("label_url", label)

      if (userState.companyUser && shipRequest) {
        form.append("title", "Ship Requested")
        form.append("return_status", "ship requested")
      }
      if (userState.warehouseUser && shipRequested) {
        form.append("title", "Shipped")
        form.append("return_status", "shipped")
      }

      const response = await returnApis.patchReturn(userState.token, form)
      if (!response.status) throw new Error(response.message)

      setToast({ type: "success", open: true, message: `Return marked as ${form.get("title")}` })

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
  if (!((userState.companyUser && shipRequest) || (userState.warehouseUser && shipRequested))) router.replace("/dashboard")

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Navbar />

      <Container maxWidth="md">
        <Typography variant="h4" fontWeight={700} my={3}>{searchParams.get("title")}</Typography>

        <form ref={formRef} onSubmit={handleSubmit}>
          {_return.quantity_shipped && _return.quantity && <Typography variant="body2" mb={3}>Quantity Remaining: {_return.quantity - _return.quantity_shipped}</Typography>}

          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                type="text"
                label="Notes"
                name="description"
                size="small"
                rows={4}
                multiline
                fullWidth
              />
            </Grid>
            <Grid item xs={2}>
              <TextField fullWidth type="text" label="Quantity" variant="outlined" name="quantity_shipped" size="small" />
            </Grid>
            <Grid item xs={4}>
              <Autocomplete
                disablePortal
                options={shipping}
                size="small"
                fullWidth
                renderInput={(params) => <TextField {...params} name="carrier" label="Shipping Carrier" />}
                freeSolo
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="text"
                label="Tracking #"
                name="tracking_number"
                size="small"
                fullWidth
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
                  <Box display="flex" justifyContent="space-between" alignItems="center" px={2} py={1}>
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
      </Container>
    </Auth >
  )
}