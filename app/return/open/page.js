"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Autocomplete, Box, Button, Container, FormControl, Grid, InputAdornment, TextField, Typography } from "@mui/material"

import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Camera from "@/app/components/Camera"
import Navbar from "@/app/components/Navbar"
import SelectField from "@/app/components/SelectField"
import * as returnApis from "@/app/apis/return"
import * as constants from "@/app/utilities/constants"

const returnReasons = [
  { id: "ordered by mistake", label: "Ordered by mistake" },
  { id: "arrived damaged", label: "Arrived damaged" },
  { id: "don't like it", label: "Don't like it" },
  { id: "missing parts or pieces", label: "Missing parts or pieces" },
  { id: "changed my mind", label: "Changed my mind" },
  { id: "item is defective", label: "Item is defective" },
  { id: "received wrong item", label: "Received wrong item" },
  { id: "doesn't fit", label: "Doesn't fit" },
  { id: "found a better price", label: "Found a better price" },
  { id: "doesn't match the description or photos", label: "Doesn't match the description or photos" },
]
const shipping = [
  { label: "UPS" },
  { label: "USPS" },
  { label: "Fedex" },
  { label: "Speedy Post" }
]

export default function Page() {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const searchParams = useSearchParams()
  const formRef = useRef(null)
  const [carrier, setCarrier] = useState("")
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const setImage = (type, file) => {
    formRef.current[type].src = URL.createObjectURL(file)
    formRef.current[type].srcset = URL.createObjectURL(file)
  }

  const handleChange = (e) => {
    try {
      if (!e.target.files || !e.target.files.length) throw new Error("Upload an image")
      if (e.target.files[0].size > constants.maximumImageSize) throw new Error(`Image size must be maximum of ${constants.maximumImageSize / 1_024_000}MB`)
      if (!constants.imageExtensions.includes(e.target.files[0].type)) throw new Error(`Image must be in format of ${constants.imageExtensions.join(", ")}`)

      setImage(e.target.name.replace("file", ""), e.target.files[0])
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const handleClear = (type) => {
    formRef.current[`${type}`].src = "/upload.png"
    formRef.current[`${type}`].srcset = "/upload.png"
    formRef.current[`${type}64`].value = ""
    formRef.current[`${type}file`].value = ""
  }

  const handleClearFile = (type) => {
    formRef.current[`${type}file`].value = ""
  }

  const handleClick = (type) => {
    formRef.current[`${type}file`].click()
  }

  const handleSubmit = async (e) => {
    try {
      setLoading(true)
      const form = new FormData()
      e.preventDefault()

      if (e.target.image1file.files[0])
        form.append("image1_url", e.target.image1file.files[0])
      else if (e.target.image1url)
        form.append("image1_url", e.target.image1url.value)

      if (e.target.image2file.files[0])
        form.append("image2_url", e.target.image2file.files[0])
      else if (e.target.image2url)
        form.append("image2_url", e.target.image2url.value)

      if (e.target.image3file.files[0])
        form.append("image3_url", e.target.image3file.files[0])
      else if (e.target.image3url)
        form.append("image3_url", e.target.image3url.value)

      if (e.target.image4file.files[0])
        form.append("image4_url", e.target.image4file.files[0])
      else if (e.target.image4url)
        form.append("image4_url", e.target.image4url.value)

      form.append("description", e.target.description.value)
      form.append("rma_number", e.target.rma_number.value)
      form.append("reason", e.target.reason.value)
      form.append("details", e.target.details.value)
      form.append("quantity", e.target.quantity.value)
      form.append("carrier", carrier || "")
      form.append("tracking_number", e.target.tracking_number.value)
      form.append("return_status", "opened")
      form.append("weight", e.target.weight.value || "-")
      form.append("length", e.target.length.value || "-")
      form.append("width", e.target.width.value || "-")
      form.append("height", e.target.height.value || "-")
      if (e.target.image164) form.append("image1", e.target.image164.value)
      if (e.target.image264) form.append("image2", e.target.image264.value)
      if (e.target.image364) form.append("image3", e.target.image364.value)
      if (e.target.image464) form.append("image4", e.target.image464.value)

      if (searchParams.get("id")) {
        form.append("id", searchParams.get("id"))
        const response = await returnApis.updateReturn(userState.token, form)
        if (!response.status) throw new Error(response.message)
      } else {
        form.append("title", "Return Opened")
        const response = await returnApis.createReturn(userState.token, form)
        if (!response.status) throw new Error(response.message)
        e.target.reset()
      }

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

      setCompany({ label: response.return.company.name, id: response.return.company_id })
      setCarrier(response.return.carrier)
      formRef.current.description.value = response.stream.description
      formRef.current.rma_number.value = response.return.rma_number
      formRef.current.quantity.value = response.return.quantity
      formRef.current.tracking_number.value = response.return.tracking_number
      formRef.current.weight.value = response.return.weight
      formRef.current.weight_unit.value = response.return.weight_unit
      formRef.current.length.value = response.return.length
      formRef.current.length_unit.value = response.return.length_unit
      formRef.current.width.value = response.return.width
      formRef.current.width_unit.value = response.return.width_unit
      formRef.current.height.value = response.return.height
      formRef.current.height_unit.value = response.return.height_unit

      formRef.current.image3.src = response.stream.image3_url || "/upload.png"
      formRef.current.image3.srcset = response.stream.image3_url || "/upload.png"
      formRef.current.image3url.value = response.stream.image3_url

      formRef.current.image4.src = response.stream.image4_url || "/upload.png"
      formRef.current.image4.srcset = response.stream.image4_url || "/upload.png"
      formRef.current.image4url.value = response.stream.image4_url

      if (response.stream.image1_url) {
        formRef.current.image1.src = response.stream.image1_url || "/upload.png"
        formRef.current.image1.srcset = response.stream.image1_url || "/upload.png"
        formRef.current.image1url.value = response.stream.image1_url
      } else if (response.stream.image1) {
        formRef.current.image1.src = response.stream.image1 || "/upload.png"
        formRef.current.image1.srcset = response.stream.image1 || "/upload.png"
        formRef.current.image164.value = response.stream.image1
      }

      if (response.stream.image2_url) {
        formRef.current.image2.src = response.stream.image2_url || "/upload.png"
        formRef.current.image2.srcset = response.stream.image2_url || "/upload.png"
        formRef.current.image2url.value = response.stream.image2_url
      } else if (response.stream.image2) {
        formRef.current.image2.src = response.stream.image2 || "/upload.png"
        formRef.current.image2.srcset = response.stream.image2 || "/upload.png"
        formRef.current.image264.value = response.stream.image2
      }
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (searchParams.get("id")) getReturn()
  }, [])

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Navbar />

      <Container maxWidth="lg">
        <Box py={3}>
          <Typography variant="h4" fontWeight={700} mb={3}>Open a Return</Typography>

          <form ref={formRef} onSubmit={handleSubmit} encType="multipart/form-data">
            <Grid container spacing={1}>
              <Grid item xs={12} md={3}>
                <TextField fullWidth type="text" label="RMA #" variant="outlined" name="rma_number" size="small" />
              </Grid>
              <Grid item xs={12} md={9}>
                <FormControl fullWidth size="small" variant="outlined" required>
                  <Autocomplete
                    disablePortal
                    value={company}
                    options={returnReasons}
                    fullWidth
                    size="small"
                    renderInput={(params) => <TextField {...params} name="reason" label="Return Reason" />}
                    onChange={(e, option) => setCompany(option)}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    freeSolo
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth type="text" label="Return Details" variant="outlined" name="details" size="small" multiline rows={4} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1" color="gray">Multiple Quantity</Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth type="number" label="Quantity" variant="outlined" name="quantity" size="small"
                  inputProps={{
                    min: 1
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" color="gray">Return Shipping Details</Typography>
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
              <Grid item xs={12} md={3}>
                <TextField fullWidth label="Tracking #" name="tracking_number" variant="outlined" size="small" />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1" color="gray">Weight & Dimensions</Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth type="text" label="Weight" name="weight" variant="outlined" size="small"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth type="text" label="Length" name="length" variant="outlined" size="small"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">inch</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth size="small" type="text" label="Width" name="width" variant="outlined"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">inch</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth size="small" type="text" label="Height" name="height" variant="outlined"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">inch</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" color="gray">Additional Notes for Operator</Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth type="text" label="Notes for Operator" variant="outlined" name="description" size="small" multiline rows={4} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" color="gray">Return Images (If customer provided any images, this will help us comparing the item)</Typography>
              </Grid>
              <Grid item xs={6} md={3} position="relative">
                <Camera name="image1" alt="image1" handleChange={handleChange} handleClick={handleClick} handleClear={handleClear} handleClearFile={handleClearFile} camera={false} />
              </Grid>
              <Grid item xs={6} md={3} position="relative">
                <Camera name="image2" alt="image2" handleChange={handleChange} handleClick={handleClick} handleClear={handleClear} handleClearFile={handleClearFile} camera={false} />
              </Grid>
              <Grid item xs={6} md={3} position="relative">
                <Camera name="image3" alt="image3" handleChange={handleChange} handleClick={handleClick} handleClear={handleClear} handleClearFile={handleClearFile} camera={false} />
              </Grid>
              <Grid item xs={6} md={3} position="relative">
                <Camera name="image4" alt="image4" handleChange={handleChange} handleClick={handleClick} handleClear={handleClear} handleClearFile={handleClearFile} camera={false} />
              </Grid>
              <Grid item xs={12} md={9} />
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
    </Auth>
  )
}