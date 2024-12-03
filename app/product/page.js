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
import * as constants from "@/app/utilities/constants"
import * as companyApis from "@/app/apis/company"
import * as productApis from "@/app/apis/product"

export default function Product() {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const searchParams = useSearchParams()
  const formRef = useRef(null)
  const [companies, setCompanies] = useState([])
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
      e.preventDefault()

      const form = new FormData()
      if (e.target.minimum_wholsale_quantity.value > 0 && e.target.wholsale_price.value < 1) throw new Error("Wholsale Price should be provided if Minimum Wholsale Quantity is present")

      if (e.target.thumbnailfile.files[0])
        form.append("thumbnail_url", e.target.thumbnailfile.files[0])
      else if (e.target.thumbnailurl)
        form.append("thumbnail_url", e.target.thumbnailurl.value)

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

      form.append("title", e.target.title.value)
      form.append("sku", e.target.sku.value)
      form.append("company_id", company ? company.id : "")
      form.append("description", e.target.description.value)
      form.append("short_description", e.target.short_description.value)
      form.append("manufacturer", e.target.manufacturer.value)
      form.append("brand", e.target.brand.value)
      form.append("retail_price", e.target.price.value || 0)
      form.append("cost", e.target.cost.value || 0)
      form.append("shipping_price", e.target.shipping_price.value || 0)
      form.append("wholsale_price", e.target.wholsale_price.value || 0)
      form.append("minimum_wholsale_quantity", e.target.minimum_wholsale_quantity.value || 0)
      form.append("quantity", e.target.quantity.value)
      form.append("tracking_number", e.target.tracking_number.value)
      if (e.target.thumbnail64) form.append("thumbnail", e.target.thumbnail64.value)
      if (e.target.image164) form.append("image1", e.target.image164.value)
      if (e.target.image264) form.append("image2", e.target.image264.value)
      if (e.target.image364) form.append("image3", e.target.image364.value)

      if (searchParams.has("id")) {
        form.append("id", searchParams.get("id"))
        const response = await productApis.updateProduct(userState.token, form)
        if (!response.status) throw new Error(response.message)
      } else {
        const response = await productApis.createProduct(userState.token, form)
        if (!response.status) throw new Error(response.message)
        e.target.reset()
      }

      setToast({ type: "success", open: true, message: "Saved" })
      router.back()
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    } finally {
      setLoading(false)
    }
  }

  const getProduct = async () => {
    try {
      const response = await productApis.getProduct(userState.token, searchParams.get("id"))
      if (!response.status) throw new Error(response.message)

      if (response.product.company) setCompany({ label: response.product.company.name, id: response.product.company_id })
      formRef.current.title.value = response.product.title
      formRef.current.description.value = response.product.description
      formRef.current.short_description.value = response.product.short_description
      formRef.current.quantity.value = response.product.quantity
      formRef.current.price.value = response.product.retail_price
      formRef.current.cost.value = response.product.cost
      formRef.current.shipping_price.value = response.product.shipping_price
      formRef.current.wholsale_price.value = response.product.wholsale_price
      formRef.current.minimum_wholsale_quantity.value = response.product.minimum_wholsale_quantity
      formRef.current.sku.value = response.product.sku
      formRef.current.manufacturer.value = response.product.manufacturer
      formRef.current.brand.value = response.product.brand
      formRef.current.tracking_number.value = response.product.tracking_number

      formRef.current.thumbnail.src = response.product.thumbnail_url || "/upload.png"
      formRef.current.thumbnail.srcset = response.product.thumbnail_url || "/upload.png"
      formRef.current.thumbnailurl.value = response.product.thumbnail_url

      formRef.current.image1.src = response.product.image1_url || "/upload.png"
      formRef.current.image1.srcset = response.product.image1_url || "/upload.png"
      formRef.current.image1url.value = response.product.image1_url

      formRef.current.image2.src = response.product.image2_url || "/upload.png"
      formRef.current.image2.srcset = response.product.image2_url || "/upload.png"
      formRef.current.image2url.value = response.product.image2_url

      formRef.current.image3.src = response.product.image3_url || "/upload.png"
      formRef.current.image3.srcset = response.product.image3_url || "/upload.png"
      formRef.current.image3url.value = response.product.image3_url
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
    if (!userState.warehouseUser) router.replace("/dashboard")
    getCompanies()

    if (searchParams.has("id")) getProduct()
  }, [])

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Navbar />

      <Container maxWidth="lg">
        <Box py={3}>
          <Typography variant="h4" fontWeight={700} mb={3}>Product</Typography>

          <form ref={formRef} onSubmit={handleSubmit} encType="multipart/form-data">
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField fullWidth type="text" label="Title" variant="outlined" name="title" size="small" />
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth type="text" label="SKU" name="sku" variant="outlined" size="small" />
              </Grid>
              <Grid item xs={3}>
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
              <Grid item xs={12}>
                <TextField fullWidth type="text" label="Description" variant="outlined" name="description" size="small" multiline rows={4} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth type="text" label="Short Description" variant="outlined" name="short_description" size="small" required />
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth type="text" label="Brand" name="brand" variant="outlined" size="small" />
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth type="text" label="Manufacturer" name="manufacturer" variant="outlined" size="small" />
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth type="number" label="Quantity" variant="outlined" name="quantity" size="small" required />
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth type="number" label="Minimum Wholsale Quantity" name="minimum_wholsale_quantity" variant="outlined" size="small" />
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth type="number" label="Cost" name="cost" variant="outlined" size="small" inputProps={{ step: "0.01" }} required />
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth type="number" label="Retail Price" name="price" variant="outlined" size="small" inputProps={{ step: "0.01" }} required />
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth type="number" label="Wholsale Price" name="wholsale_price" variant="outlined" size="small" inputProps={{ step: "0.01" }} />
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth type="number" label="Shipping Price" name="shipping_price" variant="outlined" size="small" inputProps={{ step: "0.01" }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth type="text" label="Tracking Number" name="tracking_number" variant="outlined" size="small" inputProps={{ step: "0.01" }} />
              </Grid>
              <Grid item xs={6} />
              {["thumbnail", "image1", "image2", "image3"].map((image) => {
                return (
                  <Grid item xs={3} position="relative">
                    <Camera name={image} alt={image} handleChange={handleChange} handleClick={handleClick} handleClear={handleClear} handleClearFile={handleClearFile} camera={true} />
                  </Grid>
                )
              })}
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