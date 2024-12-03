"use client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FormProvider, useForm } from "react-hook-form"
import { TextField, Button, Checkbox, Container, Typography, Grid, Autocomplete, Box, Card, IconButton } from "@mui/material"
import { CloudUploadOutlined as CloudUploadOutlinedIcon, Clear, DeleteOutline } from "@mui/icons-material"
import states from "states-us"

import Alert from "../../components/Alert"
import VisuallyHiddenInput from "../../components/VisuallyHiddenInput"
import * as orderApis from "../../../apis/order"
import { emptyCart } from "../../../store/cart"
import Layout from "@/app/components/Layout"
import FormField from "@/app/components/forms/FormField"

export default function Checkout() {
  const userState = useSelector(state => state.user)
  const cart = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const router = useRouter()
  const [ship, setShip] = useState(false)
  const [loading, setLoading] = useState(false)
  const [label, setLabel] = useState({ name: "Upload Label" })
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })
  const form = useForm({
    defaultValues: {
      order: [{
          "notes": "",
          "ship_by_warehouse": false,
          "customer_name": "",
          "customer_mobile": "",
          "address_line_1": "",
          "address_line_2": "",
          "state": "",
          "city": "",
          "zipcode": "",
          "carrier": "",
          "tracking_number": ""
        }]
    }
  })

  const getUnitPrice = (product) => product.cart >= product.minimum_wholsale_quantity && product.minimum_wholsale_quantity > 0 ? product.wholsale_price : product.retail_price
  const totalPrice = cart.reduce((total, product) => total + getUnitPrice(product) * product.cart, 0)

  const getShippingPrice = (product) => product.shipping_price
  const shippingPrice = cart.reduce((total, product) => total + (product.shipping_on_each ? getShippingPrice(product) * product.cart : getShippingPrice(product)), 0)

  const handleSubmit = async (data) => {
    try {
      setLoading(true)

      const formData = new FormData()

      cart.forEach((product, index) => {
        formData.append(`order_lineitems[${index}][stripe_product_id]`, product.product_id)
        formData.append(`order_lineitems[${index}][product_id]`, product.id)
        formData.append(`order_lineitems[${index}][product_name]`, product.title)
        formData.append(`order_lineitems[${index}][quantity]`, product.cart)
        formData.append(`order_lineitems[${index}][company_id]`, product.company_id)
        formData.append(
          `order_lineitems[${index}][price]`,
          product.cart >= product.minimum_wholsale_quantity && product.minimum_wholsale_quantity > 0
            ? product.wholsale_price
            : product.retail_price
              ? product.retail_price
              : product.price
        )
        formData.append(
          `order_lineitems[${index}][price_id]`,
          product.cart >= product.minimum_wholsale_quantity && product.minimum_wholsale_quantity > 0
            ? product.wholsale_price_id
            : product.retail_price
              ? product.retail_price_id
              : ""
        )
      })

      formData.append("order[price]", totalPrice)
      formData.append("order[cost]", cart.reduce((total, product) => total + product.cost, 0))
      formData.append("order[shipping_status]", !ship ? "paid" : "unpaid")
      formData.append("order[shipping_price]", shippingPrice)
      formData.append("order[label_url]", label)

      formData.append("order[notes]", data.order.notes)
      formData.append("order[customer_name]", data.order.customer_name)
      formData.append("order[customer_mobile]", data.order.customer_mobile)
      formData.append("order[address_line_1]", data.order.address_line_1)
      formData.append("order[address_line_2]", data.order.address_line_2)
      formData.append("order[state]", data.order.state)
      formData.append("order[city]", data.order.city)
      formData.append("order[zipcode]", data.order.zipcode)
      formData.append("order[carrier]", data.order.carrier)
      formData.append("order[tracking_number]", data.order.tracking_number)

      const response = await orderApis.createOrder(userState.token, formData)
      if (!response.status) throw new Error(response.message)

      form.reset()
      setLabel({ name: "Upload Label" })
      dispatch(emptyCart())

      if (response.url) {
        router.replace(response.url)
      } else {
        router.replace("/products")
      }
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    } finally {
      setLoading(false)
    }
  }

  const shipping = [
    { label: "UPS" },
    { label: "USPS" },
    { label: "Fedex" },
    { label: "Speedy Post" }
  ]

  useEffect(() => {
    if (userState.customer) router.replace("/products")
  }, [])

  return (
    <Layout>
      <Alert toast={toast} setToast={setToast} />
      <Container maxWidth="lg">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} encType="multipart/form-data">
            <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" my={3}>
              <Typography variant="h4" fontWeight={700}>Checkout</Typography>
              <Typography><Checkbox name="order[ship_by_warehouse]" checked={ship} onClick={() => setShip(!ship)} />Ship by Warehouse</Typography>
            </Box>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <FormField type="text" label="Notes" variant="outlined" name="order[notes]" size="small" multiline rows={4} />
              </Grid>
              {ship && <>
                <Grid item xs={12} md={6}>
                  <FormField type="text" label="Customer Name" variant="outlined" name="order[customer_name]" size="small" rules={{ required: "Name is required" }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormField type="text" label="Customer Mobile" variant="outlined" name="order[customer_mobile]" size="small" rules={{ required: "Mobile is required" }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormField type="text" label="Address Line 1" variant="outlined" name="order[address_line_1]" size="small" rules={{ required: "Address is required" }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormField type="text" label="Address Line 2" variant="outlined" name="order[address_line_2]" size="small" />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Autocomplete
                    disablePortal
                    id="state"
                    options={states.map(o => o.name)}
                    fullWidth
                    size="small"
                    renderInput={(params) => <FormField {...params} name="order[state]" label="State" />}
                    freeSolo
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormField type="text" label="City" variant="outlined" name="order[city]" size="small" rules={{ required: "City is required" }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormField type="text" label="Zip Code" variant="outlined" name="order[zipcode]" size="small" rules={{ required: "Zipcode is required" }} />
                </Grid>
              </>}
              {!ship && <>
                <Grid item xs={12} md={4}>
                  <Autocomplete
                    disablePortal
                    options={shipping}
                    fullWidth
                    size="small"
                    renderInput={(params) => <FormField {...params} name="order[carrier]" label="Label Shipping Carrier" />}
                    freeSolo
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormField label="Label Tracking #" name="order[tracking_number]" variant="outlined" size="small" rules={{ required: "Tracking number is required" }} />
                </Grid>
                <Grid item xs={12} md={4} >
                  {!label?.type && <Button component="label" variant="outlined" size="large" startIcon={<CloudUploadOutlinedIcon />} disableElevation fullWidth>Upload label<VisuallyHiddenInput type="file" name="order[label_url]" accept=".pdf" onChange={(e) => setLabel(e.target.files[0])} required /></Button>}
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
              </>}
              <Grid item xs={12} md={9}>
                <Typography variant="h6" fontWeight={700}>Total: ${totalPrice?.toFixed(2)}</Typography>
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
        </FormProvider>
      </Container>
    </Layout>
  )
}