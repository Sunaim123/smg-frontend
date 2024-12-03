"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Box, TextField, Button, Container, Typography, Grid, IconButton, Autocomplete, Table, TableBody, TableCell, TableHead, TableRow, Card } from "@mui/material"
import AddOutlined from "@mui/icons-material/AddOutlined"
import CloudUploadOutlined from "@mui/icons-material/CloudUploadOutlined"
import DeleteOutlined from "@mui/icons-material/DeleteOutlined"
import Clear from "@mui/icons-material/Clear"

import Alert from "@/app/components/Alert"
import SelectField from "@/app/components/SelectField"
import VisuallyHiddenInput from "@/app/components/VisuallyHiddenInput"
import * as fbaApis from "@/apis/fba"

const shipping = [
  { label: "UPS" },
  { label: "USPS" },
  { label: "Fedex" },
  { label: "Speedy Post" }
]
const weightOptions = [
  { value: "lbs", label: "lbs" },
  { value: "kgs", label: "kgs" },
  { value: "gs", label: "gs" },
  { value: "mls", label: "mls" },
]
const dimensionOptions = [
  { value: "inch", label: "inch" },
  { value: "km", label: "km" },
  { value: "m", label: "m" },
  { value: "cm", label: "cm" },
]

export default function Fba() {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const searchParams = useSearchParams()
  const formRef = useRef(null)
  const [carrier, setCarrier] = useState(null)
  const [items, setItems] = useState([
    { id: 1, quantity: 0, carrier: null }
  ])
  const [loading, setLoading] = useState(false)
  const [barcode, setBarcode] = useState(null)
  const [labels, setLabels] = useState(items.map(() => ({ name: "Upload Label" })))
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleChange = (e) => {
    if (e.target.files.length > 0)
      setToast({ type: "success", open: true, message: "File uploaded" })
    setBarcode(e.target.files[0])
  }

  const handleLabelChange = (e, index) => {
    if (e.target.files.length > 0)
      setToast({ type: "success", open: true, message: "File uploaded" })
    setLabels((prev) => {
      const newLabels = [...prev]
      newLabels[index] = e.target.files[0]
      return newLabels
    })
  }

  const handleUpdateQuantity = (e, index) => {
    setItems((previous) => {
      previous[index].quantity = e.target.value ? parseInt(e.target.value) : 0
      return [...previous]
    })
  }

  const handleUpdateCarrier = (value, index) => {
    setItems((previous) => {
      previous[index].carrier = value
      return [...previous]
    })
  }

  const handleAdd = () => {
    setItems([...items, {
      id: items.length + 1,
      quantity: 0,
      carrier: null
    }])
    setLabels([...labels, { name: "Upload Label" }])
  }

  const handleDelete = (index) => {
    setItems((previous) => {
      previous.splice(index, 1)
      return [...previous]
    })
    setLabels((previous) => {
      previous.splice(index, 1)
      return [...previous]
    })
  }

  const handleSubmit = async (e) => {
    try {
      setLoading(true)
      const form = new FormData(e.target)
      e.preventDefault()
      if (!items.length) throw new Error("Atleast add 1 item to create a fba shipment")
      form.append("barcode_url", barcode)
      for (let i = 0; i < labels.length; i++) form.append("label_url", labels[i])

      const id = searchParams.get("id")
      if (id) {
        form.append("id", id)
        const response = await fbaApis.updateFba(userState.token, form)
        if (!response.status) throw new Error(response.message)
      } else {
        const response = await fbaApis.createFba(userState.token, form)
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

  const getFba = async () => {
    try {
      const response = await fbaApis.getFba(userState.token, searchParams.get("id"))
      if (!response.status) throw new Error(response.message)

      setCarrier(response.fba.carrier)
      formRef.current.description.value = response.fba.streams[0].description
      formRef.current.rma_number.value = response.fba.rma_number
      formRef.current.tracking_number.value = response.fba.tracking_number
      formRef.current.weight.value = response.fba.weight
      formRef.current.weight_unit.value = response.fba.weight_unit
      formRef.current.length.value = response.fba.length
      formRef.current.length_unit.value = response.fba.length_unit
      formRef.current.width.value = response.fba.width
      formRef.current.width_unit.value = response.fba.width_unit
      formRef.current.height.value = response.fba.height
      formRef.current.height_unit.value = response.fba.height_unit

      if (response.fba.streams[0].image1_url) {
        formRef.current.image1.src = response.fba.streams[0].image1_url || "/upload.png"
        formRef.current.image1.srcset = response.fba.streams[0].image1_url || "/upload.png"
        formRef.current.image1url.value = response.fba.streams[0].image1_url
      } else if (response.fba.streams[0].image1) {
        formRef.current.image1.src = response.fba.streams[0].image1 || "/upload.png"
        formRef.current.image1.srcset = response.fba.streams[0].image1 || "/upload.png"
        formRef.current.image164.value = response.fba.streams[0].image1
      }

      if (response.fba.streams[0].image2_url) {
        formRef.current.image2.src = response.fba.streams[0].image2_url || "/upload.png"
        formRef.current.image2.srcset = response.fba.streams[0].image2_url || "/upload.png"
        formRef.current.image2url.value = response.fba.streams[0].image2_url
      } else if (response.fba.streams[0].image2) {
        formRef.current.image2.src = response.fba.streams[0].image2 || "/upload.png"
        formRef.current.image2.srcset = response.fba.streams[0].image2 || "/upload.png"
        formRef.current.image264.value = response.fba.streams[0].image2
      }
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (userState.customer) router.replace("/products")
    if (searchParams.get("id")) getFba()
  }, [])

  return (
    <>
      <Alert toast={toast} setToast={setToast} />
      <Container maxWidth="lg">
        <Box py={3}>
          <Typography variant="h4" fontWeight={700} mb={3}>FBA Shipment</Typography>


          <form ref={formRef} onSubmit={handleSubmit} method="post" encType="multipart/form-data">
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField fullWidth type="text" label="Tell us about the details of product" variant="outlined" name="notes" size="small" required />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth label="Quantity" name="quantity" variant="outlined" size="small" value={items.reduce((p, c) => p += c.quantity, 0)} required />
              </Grid>
              <Grid item xs={12} md={3}>
                <Autocomplete
                  disablePortal
                  value={carrier}
                  options={shipping}
                  fullWidth
                  size="small"
                  renderInput={(params) => <TextField {...params} name="carrier" label="Shipping Carrier" />}
                  onChange={(e, option) => setCarrier(option ? option.label : carrier)}
                  onInputChange={(e, value) => setCarrier(value)}
                  freeSolo
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Tracking #" name="tracking_number" variant="outlined" size="small" required />
              </Grid>
              <Grid item xs={12} md={3}>
                <Grid container spacing={1}>
                  <Grid item xs={8}>
                    <TextField fullWidth type="text" label="Weight" name="weight" variant="outlined" size="small" required />
                  </Grid>
                  <Grid item xs={4}>
                    <SelectField name="weight_unit" defaultValue="lbs" options={weightOptions} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={3}>
                <Grid container spacing={1}>
                  <Grid item xs={8}>
                    <TextField fullWidth type="text" label="Length" name="length" variant="outlined" size="small" required />
                  </Grid>
                  <Grid item xs={4}>
                    <SelectField name="length_unit" defaultValue="inch" options={dimensionOptions} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={3}>
                <Grid container spacing={1}>
                  <Grid item xs={8}>
                    <TextField fullWidth size="small" type="text" label="Width" name="width" variant="outlined" required />
                  </Grid>
                  <Grid item xs={4}>
                    <SelectField name="width_unit" defaultValue="inch" options={dimensionOptions} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={3}>
                <Grid container spacing={1}>
                  <Grid item xs={8}>
                    <TextField fullWidth size="small" type="text" label="Height" name="height" variant="outlined" required />
                  </Grid>
                  <Grid item xs={4}>
                    <SelectField name="height_unit" defaultValue="inch" options={dimensionOptions} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid gap={1} item xs={6}>
                {!barcode && <Button component="label" variant="outlined" startIcon={<CloudUploadOutlined />} disableElevation fullWidth>Upload Barcodes<VisuallyHiddenInput type="file" name="barcode_url" accept=".pdf" onChange={handleChange} required /></Button>}
                {barcode && (
                  <Card variant="outlined">
                    <Box display="flex" justifyContent="space-between" alignItems="center" px={2}>
                      <Typography variant="body2">{barcode?.name}</Typography>
                      <IconButton color="error" onClick={() => setBarcode(null)}>
                        <DeleteOutlined fontSize="small" />
                      </IconButton>
                    </Box>
                  </Card>
                )}
              </Grid>
              <Grid item xs={6} />
              <Grid item xs={12}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#eee" }}>
                      <TableCell sx={{ width: "22.5%" }}>Quantity</TableCell>
                      <TableCell sx={{ width: "22.5%" }}>Carrier</TableCell>
                      <TableCell sx={{ width: "22.5%" }}>Tracking #</TableCell>
                      <TableCell sx={{ width: "22.5%" }}>Label</TableCell>
                      <TableCell sx={{ width: "10%" }} align="center">
                        <IconButton color="primary" onClick={handleAdd}><AddOutlined /></IconButton>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item, index) => {
                      return (
                        <TableRow>
                          <TableCell>
                            <TextField fullWidth label="Quantity" name={`fba_items[${index}][quantity]`} variant="outlined" size="small" required value={item.quantity} onChange={(e) => handleUpdateQuantity(e, index)} />
                          </TableCell>
                          <TableCell>
                            <Autocomplete
                              disablePortal
                              value={item.carrier}
                              options={shipping}
                              fullWidth
                              size="small"
                              renderInput={(params) => <TextField {...params} name={`fba_items[${index}][label_carrier]`} label="Label Shipping Carrier" />}
                              onChange={(e, option) => handleUpdateCarrier(option ? option.label : item.carrier, index)}
                              onInputChange={(e, value) => handleUpdateCarrier(value, index)}
                              freeSolo
                            />
                          </TableCell>
                          <TableCell>
                            <TextField fullWidth label="Label Tracking #" name={`fba_items[${index}][label_tracking_number]`} variant="outlined" size="small" required />
                          </TableCell>
                          <TableCell>
                            <Grid xs={12}>
                              {!labels[index]?.type && <Button component="label" variant="outlined" size="large" startIcon={<CloudUploadOutlined />} disableElevation fullWidth>{labels[index]?.name}<VisuallyHiddenInput type="file" accept=".pdf" onChange={(e) => handleLabelChange(e, index)} required /></Button>}
                              {labels[index]?.type &&
                                <Card variant="outlined">
                                  <Box display="flex" justifyContent="space-between" alignItems="center" px={2}>
                                    <Typography variant="body2">{labels[index]?.name}</Typography>
                                    <Clear size="small" color="error" onClick={() => setLabels((prev) => {
                                      const newLabels = [...prev]
                                      newLabels[index] = { name: "Upload Label" }
                                      return newLabels
                                    })} sx={{ cursor: "pointer" }} />
                                  </Box>
                                </Card>
                              }
                            </Grid>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton color="error" size="small" onClick={() => handleDelete(index)}><DeleteOutlined /></IconButton>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </Grid>
              <Grid item xs={12} md={9}>
                <p>Total: ${(items.reduce((p, c) => p += c.quantity, 0) * 0.55).toFixed(2)}</p>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disableElevation
                  fullWidth
                  disabled={loading}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </>
  )
}