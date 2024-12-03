"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useRef, useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Autocomplete, Box, Button, Card, Container, Grid, IconButton, TextField, Typography } from "@mui/material"
import { CloudUploadOutlined as CloudUploadOutlinedIcon, DeleteOutline } from "@mui/icons-material"

import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Navbar from "@/app/components/Navbar"
import VisuallyHiddenInput from "@/app/components/VisuallyHiddenInput"
import * as orderApis from "@/app/apis/inventory-order"

const shipping = [
  { label: "UPS" },
  { label: "USPS" },
  { label: "Fedex" },
  { label: "Speedy Post" }
]

export default function shipInventoryOrder() {
  const userState = useSelector((state) => state.user)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [label, setLabel] = useState({ name: "Upload Label" })
  const formRef = useRef(null)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleChange = (e) => {
    if (e.target.files.length > 0)
      setToast({ type: "success", open: true, message: "File uploaded" })
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      const form = new FormData()

      form.append("id", searchParams.get("id"))
      form.append("order_status", "shipped")
      form.append("notes", e.target.notes.value)
      form.append("carrier", e.target.carrier.value)
      form.append("tracking_number", e.target.tracking_number.value)
      form.append("order[label_url]", label)

      const response = await orderApis.updateOrder(userState.token, form)
      if (!response.status) throw new Error(response.message)

      setToast({ type: "success", open: true, message: "Order marked as shipped" })

      router.back()
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (userState.customer) router.replace("/products")

  }, [])

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Navbar />

      <Container maxWidth="md">
        <form ref={formRef} onSubmit={handleSubmit}>
          <Typography variant="h4" fontWeight={700} my={1}>Mark as Shipped</Typography>

          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                type="text"
                label="Notes"
                name="notes"
                size="small"
                rows={4}
                multiline
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                disablePortal
                options={shipping}
                size="small"
                fullWidth
                renderInput={(params) => <TextField {...params} name="carrier" label="Shipping Carrier" />}
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
              {!label?.type && <Button component="label" variant="outlined" size="large" startIcon={<CloudUploadOutlinedIcon />} disableElevation fullWidth>Upload label<VisuallyHiddenInput type="file" name="label_url" accept=".pdf" onChange={(e) => setLabel(e.target.files[0])} required /></Button>}
              {label?.type &&
                <Card variant="outlined">
                  <Box display="flex" justifyContent="space-between" alignItems="center" px={2} py={0.5}>
                    <Typography variant="body2">{label?.name}</Typography>
                    <IconButton color="error" onClick={() => setLabel(null)}>
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </Box>
                </Card>
              }
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