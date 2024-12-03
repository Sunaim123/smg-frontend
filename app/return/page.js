"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Autocomplete, Box, Button, Container, FormControl, Grid, IconButton, TextField, Typography } from "@mui/material"
import DeleteOutlined from "@mui/icons-material/DeleteOutlined"

import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Camera from "@/app/components/Camera"
import Navbar from "@/app/components/Navbar"
import SelectField from "@/app/components/SelectField"
import * as companyApis from "@/app/apis/company"
import * as returnApis from "@/app/apis/return"
import * as constants from "@/app/utilities/constants"

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

export default function Return() {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const searchParams = useSearchParams()
  const formRef = useRef(null)
  const [companies, setCompanies] = useState([])
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
      form.append("company_id", company ? company.id : "")
      form.append("quantity", e.target.quantity.value)
      form.append("carrier", carrier || "")
      form.append("tracking_number", e.target.tracking_number.value)
      form.append("weight", e.target.weight.value || "-")
      form.append("weight_unit", e.target.weight_unit.value)
      form.append("length", e.target.length.value || "-")
      form.append("length_unit", e.target.length_unit.value)
      form.append("width", e.target.width.value || "-")
      form.append("width_unit", e.target.width_unit.value)
      form.append("height", e.target.height.value || "-")
      form.append("height_unit", e.target.height_unit.value)
      form.append("return_status", "received")
      if (e.target.image164) form.append("image1", e.target.image164.value)
      if (e.target.image264) form.append("image2", e.target.image264.value)
      if (e.target.image364) form.append("image3", e.target.image364.value)
      if (e.target.image464) form.append("image4", e.target.image464.value)

      if (searchParams.get("id")) {
        form.append("id", searchParams.get("id"))
        const response = await returnApis.updateReturn(userState.token, form)
        if (!response.status) throw new Error(response.message)
      } else {
        form.append("title", "Return Received")
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

  const getCompanies = async () => {
    try {
      const response = await companyApis.getCompanies(userState.token, "")
      if (!response.status) throw new Error(response.message)

      setCompanies(response.companies)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    getCompanies()

    if (searchParams.get("id")) getReturn()
  }, [])

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Navbar />

      <Container maxWidth="lg">
        <Box py={3}>
          <Typography variant="h4" fontWeight={700} mb={3}>Return</Typography>

          <form ref={formRef} onSubmit={handleSubmit} encType="multipart/form-data">
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField fullWidth type="text" label="Notes" variant="outlined" name="description" size="small" multiline rows={4} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth type="text" label="RMA #" variant="outlined" name="rma_number" size="small" />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small" variant="outlined" required>
                  <Autocomplete
                    disablePortal
                    value={company}
                    options={companies.map(x => ({ label: x.name, id: x.id }))}
                    fullWidth
                    size="small"
                    renderInput={(params) => <TextField {...params} name="company_id" label="Select Company" />}
                    onChange={(e, option) => setCompany(option)}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField fullWidth type="text" label="Quantity" variant="outlined" name="quantity" size="small" />
              </Grid>
              <Grid item xs={12} md={4}>
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
                <TextField fullWidth label="Tracking #" name="tracking_number" variant="outlined" size="small" />
              </Grid>
              <Grid item xs={12} md={3}>
                <Grid container spacing={1}>
                  <Grid item xs={8}>
                    <TextField fullWidth type="text" label="Weight" name="weight" variant="outlined" size="small" />
                  </Grid>
                  <Grid item xs={4}>
                    <SelectField name="weight_unit" defaultValue="lbs" options={weightOptions} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={3}>
                <Grid container spacing={1}>
                  <Grid item xs={8}>
                    <TextField fullWidth type="text" label="Length" name="length" variant="outlined" size="small" />
                  </Grid>
                  <Grid item xs={4}>
                    <SelectField name="length_unit" defaultValue="inch" options={dimensionOptions} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={3}>
                <Grid container spacing={1}>
                  <Grid item xs={8}>
                    <TextField fullWidth size="small" type="text" label="Width" name="width" variant="outlined" />
                  </Grid>
                  <Grid item xs={4}>
                    <SelectField name="width_unit" defaultValue="inch" options={dimensionOptions} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={3}>
                <Grid container spacing={1}>
                  <Grid item xs={8}>
                    <TextField fullWidth size="small" type="text" label="Height" name="height" variant="outlined" />
                  </Grid>
                  <Grid item xs={4}>
                    <SelectField name="height_unit" defaultValue="inch" options={dimensionOptions} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6} md={3} position="relative">
                <Camera name="image1" alt="image1" handleChange={handleChange} handleClick={handleClick} handleClear={handleClear} handleClearFile={handleClearFile} camera={true} />
              </Grid>
              <Grid item xs={6} md={3} position="relative">
                <Camera name="image2" alt="image2" handleChange={handleChange} handleClick={handleClick} handleClear={handleClear} handleClearFile={handleClearFile} camera={true} />
              </Grid>
              <Grid item xs={6} md={3} position="relative">
                <Camera name="image3" alt="image3" handleChange={handleChange} handleClick={handleClick} handleClear={handleClear} handleClearFile={handleClearFile} camera={true} />
              </Grid>
              <Grid item xs={6} md={3} position="relative">
                <Camera name="image4" alt="image4" handleChange={handleChange} handleClick={handleClick} handleClear={handleClear} handleClearFile={handleClearFile} camera={true} />
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