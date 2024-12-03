"use client"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { TextField, Button, Container, Typography, Grid, Autocomplete, Box, Card, CardHeader, CardContent, Divider, Table, TableHead, TableRow, TableCell } from "@mui/material"
import states from "states-us"

import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Navbar from "@/app/components/Navbar"
import * as orderApis from "@/app/apis/order"
import { emptyCart } from "@/app/store/cart"

export default function Checkout() {
  const userState = useSelector(state => state.user)
  const cart = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const router = useRouter()
  const formRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState(null)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const getUnitPrice = (product) => product.price
  const totalPrice = cart.reduce((total, product) => total + getUnitPrice(product) * product.cart, 0)

  const getShippingPrice = (product) => product.shipping_price
  const shippingPrice = cart.reduce((total, product) => total + (product.shipping_on_each ? getShippingPrice(product) * product.cart : getShippingPrice(product)), 0)

  const handleDetails = () => {
    try {
      formRef.current["order[name]"].value = userState.user.name
      formRef.current["order[mobile]"].value = userState.user.mobile
      formRef.current["order[email]"].value = userState.user.email
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const form = new FormData(e.target)

      cart.forEach((product, index) => {
        form.append(`order_lineitems[${index}][stripe_product_id]`, product.product_id)
        form.append(`order_lineitems[${index}][product_id]`, product.id)
        form.append(`order_lineitems[${index}][product_name]`, product.title)
        form.append(`order_lineitems[${index}][quantity]`, product.cart)
        form.append(`order_lineitems[${index}][price]`, product.price)
        form.append(`order_lineitems[${index}][shipping_price]`, product.shipping_on_each ? product.shipping_price * product.cart : product.shipping_price)
        form.append(`order_lineitems[${index}][company_id]`, product.company_id)
      })

      form.append("order[total]", totalPrice)
      form.append("order[shipping_total]", shippingPrice)
      form.append("order[company_id]", [...new Set(cart.map(product => product.company_id))].join(', '))

      const response = await orderApis.createOrder(userState.token, form)
      if (!response.status) throw new Error(response.message)

      e.target.reset()
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
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Navbar />

      <Container maxWidth="lg">
        <form ref={formRef} onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" my={3}>
            <Typography variant="h4" fontWeight={700}>Checkout</Typography>
            <Button variant="outlined" onClick={handleDetails}>Use my details</Button>
          </Box>
          <Grid container spacing={1}>
            <Grid item xs={8}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <TextField fullWidth type="text" label="Notes" variant="outlined" name="order[notes]" size="small" multiline rows={4} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth type="text" label="Customer Name" variant="outlined" name="order[name]" size="small" required InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth type="text" label="Customer Mobile" variant="outlined" name="order[mobile]" size="small" required InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth type="text" label="Customer Email" variant="outlined" name="order[email]" value={userState.user?.email} size="small" required InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth type="text" label="Address Line 1" variant="outlined" name="order[address1]" size="small" required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth type="text" label="Address Line 2" variant="outlined" name="order[address2]" size="small" />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Autocomplete
                    disablePortal
                    id="state"
                    value={state}
                    options={states.map(o => o.name)}
                    fullWidth
                    size="small"
                    renderInput={(params) => <TextField {...params} name="order[state]" label="State" />}
                    freeSolo
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth type="text" label="City" variant="outlined" name="order[city]" size="small" required />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth type="text" label="Zip Code" variant="outlined" name="order[zipcode]" size="small" required />
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
                              <Typography variant="body2">Qty {`${product.cart} x $${product.price.toFixed(2)}`}</Typography>
                            </Grid>
                            <Grid item sx={2}>
                              <Typography variant="body2">${(product.cart * product.price).toFixed(2)}</Typography>
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
      </Container>
    </Auth>
  )
}