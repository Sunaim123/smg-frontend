"use client"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Box, Button, Container, IconButton, Grid, TextField, Typography, FormControl, Autocomplete, Checkbox } from "@mui/material"

import VisuallyHiddenInput from "@/app/components/VisuallyHiddenInput"
import DeleteOutlined from "@mui/icons-material/DeleteOutlined"
import CloudUploadOutlined from "@mui/icons-material/CloudUploadOutlined"
import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Navbar from "@/app/components/Navbar"
import * as productApis from "@/app/apis/product"
import * as categoryApis from "@/app/apis/category"

export default function Listing() {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const searchParams = useSearchParams()
  const formRef = useRef(null)
  const [images, setImages] = useState([])
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState(null)
  const [shipping, setShipping] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleFileChange = (e) => {
    const files = e.target.files
    const total = (images ? images.length : 0) + files.length
    if (total > 4) return setToast({ type: "error", open: true, message: "Not more than 4 Images can be added" })

    setImages((images) => (images ? [...images, ...files] : files))
    setToast({ type: "success", open: true, message: "Images added" })
  }

  const handleDeleteImage = (index) => {
    const updatedImages = Array.from(images)
    updatedImages.splice(index, 1)
    setImages(updatedImages)
  }

  const handleSubmit = async (e) => {
    try {
      setLoading(true)
      e.preventDefault()

      const form = new FormData()
      form.append("title", e.target.title.value)
      form.append("short_description", e.target.short_description.value)
      form.append("sku", e.target.sku.value)
      form.append("description", e.target.description.value)
      form.append("category", e.target.category.value.toLowerCase())
      form.append("cost", e.target.cost.value || 0)
      form.append("price", e.target.price.value || 0)
      form.append("shipping_price", e.target.shipping_price.value || 0)
      form.append("quantity", e.target.quantity.value)
      form.append("shipping_on_each", shipping)
      for (let i = 0; i < images.length; i++) form.append("images", images[i])

      if (searchParams.has("id")) {
        form.append("id", searchParams.get("id"))
        const response = await productApis.updateProduct(userState.token, form)
        if (!response.status) throw new Error(response.message)
      } else {
        const response = await productApis.createProduct(userState.token, form)
        if (!response.status) throw new Error(response.message)
        e.target.reset()
        setImages([])
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

      setCategory(response.product.category.name)
      setShipping(response.product.shipping_on_each)
      if (response.product.images) setImages(JSON.parse(response.product.images))
      formRef.current.title.value = response.product.title
      formRef.current.description.value = response.product.description
      formRef.current.short_description.value = response.product.short_description
      formRef.current.quantity.value = response.product.quantity
      formRef.current.cost.value = response.product.cost
      formRef.current.price.value = response.product.price
      formRef.current.shipping_price.value = response.product.shipping_price
      formRef.current.sku.value = response.product.sku

    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const getCategories = async () => {
    try {
      const response = await categoryApis.getCategories(userState.token, "")
      if (!response.status) throw new Error(response.message)

      setCategories(response.categories)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (userState.permissions && !userState.permissions["CREATE_PRODUCT"]) router.replace("/dashboard")

    if (searchParams.has("id")) getProduct()
    getCategories()
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
              <Grid item xs={8} />
              <Grid item xs={4} >
                <Typography><Checkbox checked={shipping} onClick={() => setShipping(!shipping)} />Calculate shipping on each quantity</Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth type="text" label="Title" variant="outlined" name="title" size="small" />
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth type="text" label="SKU" name="sku" variant="outlined" size="small" />
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth type="number" label="Quantity" variant="outlined" name="quantity" size="small" required />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth size="small" variant="outlined" required>
                  <Autocomplete
                    disablePortal
                    freeSolo
                    value={category}
                    options={categories.map(x => ({ label: x.name, id: x.id }))}
                    fullWidth
                    size="small"
                    renderInput={(params) => <TextField {...params} name="category" label="Select Category" />}
                    onChange={(e, option) => setCategory(option)}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth type="number" label="Cost" name="cost" variant="outlined" size="small" inputProps={{ step: "0.01" }} />
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth type="number" label="Price" name="price" variant="outlined" size="small" inputProps={{ step: "0.01" }} required />
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth type="number" label="Shipping Price" name="shipping_price" variant="outlined" size="small" inputProps={{ step: "0.01" }} required />
              </Grid>
              <Grid item xs={12} display="flex" gap={1}>
                {images && Array.from(images).map((item, index) => (
                  <Grid item xs={2} key={index} position="relative">
                    <IconButton
                      onClick={() => handleDeleteImage(index)}
                      size="small"
                      style={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        zIndex: 1,
                        background: "#eee",
                        width: "24px",
                        height: "24px",
                        borderRadius: "2px"
                      }}
                    >
                      <DeleteOutlined color="error" fontSize="small" />
                    </IconButton>
                    <Link href={typeof item === "string" ? item : URL.createObjectURL(item)} target="_blank">
                      <img
                        srcSet={typeof item === "string" ? item : URL.createObjectURL(item)}
                        src={typeof item === "string" ? item : URL.createObjectURL(item)}
                        alt={typeof item === "string" ? item.split('/').pop() : item.name}
                        loading="lazy"
                        style={{ width: "100%", height: "150px", border: "1px #bbb solid", borderRadius: "4px", padding: "4px" }}
                      />
                    </Link>
                  </Grid>
                ))}
                {images.length < 4 &&
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadOutlined />}
                    sx={{ display: "flex", flexDirection: "column", width: "180px", height: "150px", border: "1px #bbb solid", borderRadius: "4px", padding: "4px" }}
                  >
                    {images.length > 0 ? `${images.length} images added` : "Upload upto 4 images"}
                    <VisuallyHiddenInput type="file" name="images" multiple onChange={handleFileChange} />
                  </Button>}
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth type="text" label="Short Description" variant="outlined" name="short_description" size="small" multiline rows={2} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth type="text" label="Description" variant="outlined" name="description" size="small" multiline rows={4} required />
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