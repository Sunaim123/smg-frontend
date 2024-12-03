"use client"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Box, Button, Container, IconButton, Grid, Typography, FormControl, Autocomplete, Checkbox, InputLabel, Select, MenuItem } from "@mui/material"
import { FormProvider, useForm } from "react-hook-form"
import DeleteOutlined from "@mui/icons-material/DeleteOutlined"
import CloudUploadOutlined from "@mui/icons-material/CloudUploadOutlined"

import moment from "moment"
import VisuallyHiddenInput from "@/app/components/VisuallyHiddenInput"
import Alert from "@/app/components/Alert"
import * as productApis from "@/apis/product"
import * as categoryApis from "@/apis/category"
import DateTimePicker from "@/app/components/DateTimePicker"
import FormField from "@/app/components/forms/FormField"

export default function Listing() {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [images, setImages] = useState([])
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState(null)
  const [warehouse, setWarehouse] = useState(false)
  const [wholesale, setWholesale] = useState(false)
  const [sale, setSale] = useState(false)
  const [carrier, setCarrier] = useState("")
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState({
    from_date: null,
    to_date: null
  })
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })
  const form = useForm({
    defaultValues: {
      title: "",
      sku: "",
      category: "",
      short_description: "",
      description: "",
      stock_quantity: "",
      store_in_warehouse: false,
      cost: "",
      retail_price: "",
      on_sale: false,
      shipping_price: "",
      weight: "",
      length: "",
      width: "",
      height: "",
      carrier: "",
      tracking_number: "",
      wholsale_price: "",
      minimum_wholesale_quantity: "",
      sale_from: "",
      sale_end: "",
      sale_price: ""
    }
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

  const handleSubmit = async (data) => {
    try {
      setLoading(true)

      const payload = {
        title: data.title,
        sku: data.sku,
        category: category? category.label : data.category,
        short_description: data.short_description,
        description: data.description,
        stock_quantity: data.quantity,
        store_in_warehouse: warehouse,
        cost: data.cost,
        retail_price: data.price,
        on_sale: sale,
        shipping_price: data.shipping_price,
        weight: data.weight,
      }
      if (warehouse) {
        payload.carrier = carrier
        payload.tracking_number = data.tracking_number
      }
      if (sale) {
        payload.sale_price = data.sale_price
        payload.sale_from = date.from_date
        payload.sale_end = date.to_date
      }
      if (wholesale) {
        payload.wholsale_price = data.wholesale_price
        payload.minimum_wholsale_quantity = data.minimum_wholesale_quantity
      }

      const dimensions = {}
      if (data.length) dimensions.length = data.length
      if (data.width) dimensions.width = data.width
      if (data.height) dimensions.height = data.height
      payload.dimensions = JSON.stringify(dimensions)

      if (images[0]) payload.thumbnail_url = images[0]
      if (images[1]) payload.image1_url = images[1]
      if (images[2]) payload.image2_url = images[2]
      if (images[3]) payload.image3_url = images[3]

      if (searchParams.has("id")) {
        payload.id = searchParams.get("id")
        const response = await productApis.updateProduct(userState.token, payload)
        if (!response.status) throw new Error(response.message)
      } else {
        const response = await productApis.createProduct(userState.token, payload)
        if (!response.status) throw new Error(response.message)
        form.reset()
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

        form.setValue("title", response.product.title,)
        form.setValue("sku", response.product.sku,)
        form.setValue("category", response.product.category.name,)
        form.setValue("short_description", response.product.short_description,)
        form.setValue("description", response.product.description,)
        form.setValue("quantity", response.product.stock_quantity,)
        form.setValue("store_in_warehouse", response.product.store_in_warehouse,)
        form.setValue("cost", response.product.cost,)
        form.setValue("price", response.product.retail_price,)
        form.setValue("sale_price", response.product.sale_price || "",)
        form.setValue("shipping_price", response.product.shipping_price,)
        form.setValue("weight", response.product.weight,)
        form.setValue("wholesale_price", response.product.wholsale_price || "",)
        form.setValue("minimum_wholesale_quantity", response.product.minimum_wholsale_quantity || "",)
        form.setValue("tracking_number", response.product.tracking_number || "",)

        const dimensions = JSON.parse(response.product.dimensions)
      if (dimensions.length) form.setValue("length", dimensions.length)
      if (dimensions.width) form.setValue("width", dimensions.width)
      if (dimensions.height) form.setValue("height", dimensions.height)

      setCategory(response.product.category.name)
      setWarehouse(response.product.store_in_warehouse)
      setSale(response.product.on_sale)
      setCarrier(response.product.carrier)
      if (response.product.wholsale_price) setWholesale(true)
      if (response.product.on_sale) setDate({
        from_date: response.product.sale_from,
        to_date: response.product.sale_end,
      })

      const imageUrls = []
      if (response.product.thumbnail_url) imageUrls.push(response.product.thumbnail_url)
      if (response.product.image1_url) imageUrls.push(response.product.image1_url)
      if (response.product.image2_url) imageUrls.push(response.product.image2_url)
      if (response.product.image3_url) imageUrls.push(response.product.image3_url)
      setImages(imageUrls)

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

  const shipping = [
    { label: "UPS", value: "ups" },
    { label: "USPS", value: "usps" },
    { label: "Fedex", value: "fedex" },
    { label: "Speedy Post", value: "speedy post" }
  ]

  useEffect(() => {
    if (userState.permissions && !userState.permissions["CREATE_PRODUCT"]) router.replace("/sp/d")

    if (searchParams.has("id")) getProduct()
    getCategories()
  }, [])

  return (
    <>
      <Alert toast={toast} setToast={setToast} />
      <Container maxWidth="lg">
        <Box py={3}>
          <Typography variant="h4" fontWeight={700} mb={3}>Product</Typography>

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} encType="multipart/form-data">
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <FormField fullWidth type="text" label="Title" variant="outlined" name="title" size="small" rules={{ required: "Title is required" }} />
                </Grid>

                <Grid item xs={3}>
                  <FormField fullWidth type="text" label="SKU" name="sku" variant="outlined" size="small" />
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth size="small" variant="outlined" required>
                    <Autocomplete
                      disablePortal
                      freeSolo
                      value={category}
                      options={categories.map(x => ({ label: x.name, id: x.id }))}
                      fullWidth
                      size="small"
                      renderInput={(params) => <FormField {...params} name="category" label="Select Category" />}
                      onChange={(e, option) => setCategory(option)}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6} />

                <Grid item xs={2}>
                  <Typography variant="h6">Description</Typography>
                </Grid>
                <Grid item xs={10} />
                <Grid item xs={12}>
                  <FormField fullWidth type="text" label="Short Description" variant="outlined" name="short_description" size="small" rules={{ required: "Short Description is required" }} />
                </Grid>
                <Grid item xs={12}>
                  <FormField fullWidth type="text" label="Description" variant="outlined" name="description" size="small" rules={{ required: "Description is required" }} />
                </Grid>

                <Grid item xs={2}>
                  <Typography variant="h6">Stock</Typography>
                </Grid>
                <Grid item xs={10} />
                <Grid item xs={3}>
                  <FormField fullWidth type="number" label="Quantity" variant="outlined" name="quantity" size="small" rules={{ required: "Quantity is required" }} />
                </Grid>
                <Grid item xs={9} />

                <Grid item xs={2} onClick={() => setWarehouse(!warehouse)} sx={{ cursor: "pointer" }}>
                  <Typography><Checkbox checked={warehouse} onClick={() => setWarehouse(!warehouse)} />Store in warehouse</Typography>
                </Grid>
                <Grid item xs={10} />
                {warehouse && <>
                  <Grid item xs={3}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label" size="small">Shipping carrier</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={carrier}
                        size="small"
                        label="Type"
                        onChange={(e) => setCarrier(e.target.value)}
                      >
                        {shipping.map((c) => (
                          <MenuItem value={c.value}>{c.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <FormField fullWidth type="text" label="Tracking #" variant="outlined" name="tracking_number" size="small" rules={{  required: warehouse ? "Tracking number is required" : false }} />
                  </Grid>
                  <Grid item xs={6} />
                </>}

                <Grid item xs={2}>
                  <Typography variant="h6">Price</Typography>
                </Grid>
                <Grid item xs={10} />
                <Grid item xs={3}>
                  <FormField fullWidth type="number" label="Cost" name="cost" variant="outlined" size="small" inputProps={{ step: "0.01" }} rules={{ required: "Cost is required" }} />
                </Grid>
                <Grid item xs={3}>
                  <FormField fullWidth type="number" label="Price" name="price" variant="outlined" size="small" inputProps={{ step: "0.01" }} rules={{ required: "Price is required" }} />
                </Grid>
                <Grid item xs={6} />

                <Grid item xs={2} onClick={() => setSale(!sale)} sx={{ cursor: "pointer" }}>
                  <Typography><Checkbox checked={sale} onClick={() => setSale(!sale)} />Sale</Typography>
                </Grid>
                <Grid item xs={10} />
                {sale && <>
                  <Grid item xs={3}>
                    <FormField fullWidth type="number" label="Sale Price" variant="outlined" name="sale_price" size="small" inputProps={{ step: "0.01" }} rules={{  required: sale ? "Sale price is required" : false }} />
                  </Grid>
                  <Grid item xs={3}>
                    <DateTimePicker label="Start Date" value={date.from_date ? moment(date.from_date) : null} onChange={(value) => setDate({ ...date, from_date: value ? value.toISOString() : null })} rules={{  required: sale ? "Sale start date is required" : false }} />
                  </Grid>
                  <Grid item xs={3}>
                    <DateTimePicker label="End Date" value={date.to_date ? moment(date.to_date) : null} onChange={(value) => setDate({ ...date, to_date: value ? value.toISOString() : null })} rules={{  required: sale ? "Sale end date is required" : false }} />
                  </Grid>
                  <Grid item xs={3} />
                </>}

                <Grid item xs={2} onClick={() => setWholesale(!wholesale)} sx={{ cursor: "pointer" }}>
                  <Typography><Checkbox checked={wholesale} onClick={() => setWholesale(!wholesale)} />Wholesale</Typography>
                </Grid>
                <Grid item xs={10} />
                {wholesale && <>
                  <Grid item xs={3}>
                    <FormField fullWidth type="numeber" label="Wholesale Price" variant="outlined" name="wholesale_price" size="small" inputProps={{ step: "0.01" }} required={wholesale} />
                  </Grid>
                  <Grid item xs={3}>
                    <FormField fullWidth type="number" label="Minimum Wholesale quantity" variant="outlined" name="minimum_wholesale_quantity" size="small" required={wholesale} />
                  </Grid>
                  <Grid item xs={6} />
                </>}

                <Grid item xs={2} mb={1}>
                  <Typography variant="h6">Shipping</Typography>
                </Grid>
                <Grid item xs={10} />
                <Grid item xs={3}>
                  <FormField fullWidth type="number" label="Shipping Price" name="shipping_price" variant="outlined" size="small" inputProps={{ step: "0.01" }} rules={{ required: "Shipping price is required" }} />
                </Grid>
                <Grid item xs={9} />
                <Grid item xs={3}>
                  <FormField fullWidth type="text" label="Length (inch)" name="length" variant="outlined" size="small" />
                </Grid>
                <Grid item xs={3}>
                  <FormField fullWidth size="small" type="text" label="Width (inch)" name="width" variant="outlined" />
                </Grid>
                <Grid item xs={3}>
                  <FormField fullWidth size="small" type="text" label="Height (inch)" name="height" variant="outlined" />
                </Grid>
                <Grid item xs={3}>
                  <FormField fullWidth type="text" label="Weight (lbs)" name="weight" variant="outlined" size="small" />
                </Grid>

                <Grid item xs={2}>
                  <Typography variant="h6">Images</Typography>
                </Grid>
                <Grid item xs={10} />
                <Grid item xs={12} display="flex" gap={2}>
                  {images && Array.from(images).map((item, index) => {
                    return (
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
                            alt={typeof item === "string" ? item.split("/").pop() : item.name}
                            loading="lazy"
                            style={{ width: "100%", height: "150px", border: "1px #bbb solid", borderRadius: "4px", padding: "4px" }}
                          />
                        </Link>
                      </Grid>
                    )
                  })}
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
          </FormProvider>
        </Box>
      </Container>
    </>
  )
}