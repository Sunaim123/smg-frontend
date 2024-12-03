"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FormProvider, useForm } from "react-hook-form"
import { Button, Container, Typography, Grid, Autocomplete, Box, Card, CardHeader, CardContent, Divider, Table, TableHead, TableRow, TableCell } from "@mui/material"
import states from "states-us"

import Alert from "../components/Alert"
import Auth from "../components/Auth"
import FormField from "@/app/components/forms/FormField"
import Layout from "../components/Layout"
import * as orderApis from "../../apis/order"
import { emptyCart } from "../../store/cart"

export default function Checkout() {
  const userState = useSelector(state => state.user)
  const cart = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState(null)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })
  const form = useForm({
    defaultValues: {
      order: [{
        "customer_name": "",
        "customer_mobile": "",
        "address_line_1": "",
        "address_line_2": "",
        "state": "",
        "city": "",
        "zipcode": "",
      }]
    }
  })

  const getUnitPrice = (product) => product.retail_price
  const totalPrice = cart.reduce((total, product) => total + getUnitPrice(product) * product.cart, 0)

  const getShippingPrice = (product) => product.shipping_price
  const shippingPrice = cart.reduce((total, product) => total + (product.shipping_on_each ? getShippingPrice(product) * product.cart : getShippingPrice(product)), 0)

  const handleDetails = () => {
    form.setValue("order[customer_name]", userState.user?.name)
    form.setValue("order[customer_mobile]", userState.user?.mobile)
    form.setValue("order[email]", userState.user?.email)
  }

  const handleSubmit = async (data) => {

    try {
      setLoading(true)
      const formData = new FormData()

      cart.forEach((product, index) => {
        formData.append(`order_lineitems[${index}][stripe_product_id]`, product.product_id)
        formData.append(`order_lineitems[${index}][product_id]`, product.id)
        formData.append(`order_lineitems[${index}][product_name]`, product.title)
        formData.append(`order_lineitems[${index}][quantity]`, product.cart)
        formData.append(`order_lineitems[${index}][price]`, product.retail_price)
        formData.append(`order_lineitems[${index}][shipping_price]`, product.shipping_on_each ? product.shipping_price * product.cart : product.shipping_price)
        formData.append(`order_lineitems[${index}][company_id]`, product.company_id)
      })

      formData.append("order[price]", totalPrice)
      formData.append("order[shipping_price]", shippingPrice)
      formData.append("order[company_id]", [...new Set(cart.map(product => product.company_id))].join(', '))
      formData.append("order[customer_name]", data.order.customer_name)
      formData.append("order[customer_mobile]", data.order.customer_mobile)
      formData.append("order[email]", data.order.email)
      formData.append("order[address_line_1]", data.order.address_line_1)
      formData.append("order[address_line_2]", data.order.address_line_2)
      formData.append("order[state]", state)
      formData.append("order[city]", data.order.city)
      formData.append("order[zipcode]", data.order.zipcode)

      const response = await orderApis.createOrder(userState.token, formData)
      if (!response.status) throw new Error(response.message)

      form.reset()
      dispatch(emptyCart())

      if (response.url) router.replace(response.url)
      else router.replace("/products")
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <Auth>
        <Alert toast={toast} setToast={setToast} />

        <Container maxWidth="lg">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} encType="multipart/form-data">
              <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" my={10}>
                <Typography variant="h4" fontWeight={700}>Checkout</Typography>
                <Button variant="contained" onClick={handleDetails}>Use my details</Button>
              </Box>
              <Grid container spacing={1}>
                <Grid item xs={8}>
                  <Grid container spacing={1}>
                    {/* <Grid item xs={12}>
                    <TextField fullWidth type="text" label="Notes" variant="outlined" name="order[notes]" size="small" multiline rows={4} />
                  </Grid> */}
                    <Grid item xs={12} md={4}>
                      <FormField type="text" label="Customer Name" variant="outlined" name="order[customer_name]" size="small" rules={{ required: "Name is required" }} InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormField type="text" label="Customer Mobile" variant="outlined" name="order[customer_mobile]" size="small" rules={{ required: "Mobile is required" }} InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormField type="text" label="Customer Email" variant="outlined" name="order[email]" value={userState.user?.email} size="small" rules={{ required: "Email is required" }} InputLabelProps={{ shrink: true }} />
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
                        value={state}
                        options={states.map(o => o.name)}
                        fullWidth
                        size="small"
                        renderInput={(params) => <FormField {...params} name="order[state]" label="State" />}
                        onChange={(e, option) => setState(option)}
                        freeSolo
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormField type="text" label="City" variant="outlined" name="order[city]" size="small" rules={{ required: "City is required" }} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormField type="text" label="Zip Code" variant="outlined" name="order[zipcode]" size="small" rules={{ required: "Zip code is required" }} />
                    </Grid>
                    <Grid item xs={9} />
                    <Grid item xs={3} md={3}>
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
                </Grid>
                <Grid item xs={4}>
                  <Grid container>
                    <Card variant="outlined" sx={{ width: "100%" }}>
                      <CardHeader title="Items" titleTypographyProps={{ variant: "h6" }} />
                      <CardContent>
                        <Box mb={5}>
                          {cart.map((product) => {
                            return (
                              <Grid container mb={2}>
                                <Grid item xs={12}>
                                  <Typography variant="body1" fontWeight={600}>{product.title}</Typography>
                                </Grid>
                                <Grid item xs={10}>
                                  <Typography variant="body2">Qty {`${product.cart} x $${product.retail_price.toFixed(2)}`}</Typography>
                                </Grid>
                                <Grid item sx={2}>
                                  <Typography variant="body2">${(product.cart * product.retail_price).toFixed(2)}</Typography>
                                </Grid>
                                <Divider sx={{ mt: 1 }} />
                              </Grid>
                            )
                          })}
                        </Box>
                        <Grid display="flex" justifyContent="space-between">
                          <Typography>Sub total</Typography>
                          <Typography>${totalPrice.toFixed(2)}</Typography>
                        </Grid>
                        <Divider sx={{ my: 1 }} />
                        <Grid display="flex" justifyContent="space-between">
                          <Typography>Shipping</Typography>
                          <Typography>${shippingPrice.toFixed(2)}</Typography>
                        </Grid>
                        <Divider sx={{ my: 1 }} />
                        <Grid display="flex" justifyContent="space-between">
                          <Typography>Total</Typography>
                          <Typography>${(totalPrice + shippingPrice).toFixed(2)}</Typography>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </FormProvider>
        </Container>
      </Auth>
    </Layout>
  )
}