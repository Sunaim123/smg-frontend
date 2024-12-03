"use client"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { TextField, Button, Checkbox, Container, Typography, Grid, Autocomplete, Box, Card, IconButton, CardHeader, CardContent, Divider } from "@mui/material"
import { CloudUploadOutlined as CloudUploadOutlinedIcon, Clear, DeleteOutline } from "@mui/icons-material"
import states from "states-us"

import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Navbar from "@/app/components/Navbar"
import VisuallyHiddenInput from "@/app/components/VisuallyHiddenInput"
import * as orderApis from "@/app/apis/order"
import { emptyCart } from "@/app/store/cart"

export default function Checkout() {
  const userState = useSelector(state => state.user)
  const cart = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const router = useRouter()
  const formRef = useRef(null)
  const [ship, setShip] = useState(userState.warehouseUser ? false : true)
  const [loading, setLoading] = useState(false)
  const [label, setLabel] = useState({ name: "Upload Label" })
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const getUnitPrice = (product) => product.cart >= product.minimum_wholsale_quantity && product.minimum_wholsale_quantity > 0 ? product.wholsale_price : product.retail_price
  const totalPrice = cart.reduce((total, product) => total + getUnitPrice(product) * product.cart, 0)
  const totalShipping = cart.reduce((total, product) => total + product.shipping_price * product.cart, 0)

  const handleSubmit = async (e) => {
    try {
      setLoading(true)
      const form = new FormData(e.target)
      e.preventDefault()

      cart.forEach((product, index) => {
        form.append(`order_lineitems[${index}][stripe_product_id]`, product.product_id)
        form.append(`order_lineitems[${index}][product_id]`, product.id)
        form.append(`order_lineitems[${index}][product_name]`, product.title)
        form.append(`order_lineitems[${index}][quantity]`, product.cart)
        form.append(`order_lineitems[${index}][company_id]`, product.company_id)
        form.append(`order_lineitems[${index}][cost]`, product.cost)
        form.append(`order_lineitems[${index}][shipping_price]`, product.shipping_price)
        form.append(`order_lineitems[${index}][price]`, getUnitPrice(product))
        form.append(`order_lineitems[${index}][price_id]`, product.cart >= product.minimum_wholsale_quantity && product.minimum_wholsale_quantity > 0 ? product.wholsale_price_id : product.retail_price ? product.retail_price_id : "")
      })

      form.append("order[price]", totalPrice)
      form.append("order[shipping_price]", cart.reduce((total, product) => total + product.shipping_price, 0))
      form.append("order[shipping_status]", !ship ? "paid" : "unpaid")
      form.append("order[label_url]", label)

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

  const shipping = [
    { label: "UPS" },
    { label: "USPS" },
    { label: "Fedex" },
    { label: "Speedy Post" }
  ]

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Navbar />

      <Container maxWidth="lg">
        <form ref={formRef} onSubmit={handleSubmit} method="post" encType="multipart/form-data">
          <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" my={3}>
            <Typography variant="h4" fontWeight={700}>Checkout</Typography>
            {userState.warehouseUser && <Typography><Checkbox name="order[ship_by_warehouse]" checked={ship} onClick={() => setShip(!ship)} />Ship by Warehouse</Typography>}
          </Box>
          <Grid container spacing={1}>
            <Grid item xs={8}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <TextField fullWidth type="text" label="Notes" variant="outlined" name="order[notes]" size="small" multiline rows={4} />
                </Grid>
                {ship && <>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth type="text" label="Customer Name" variant="outlined" name="order[customer_name]" size="small" required />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth type="text" label="Customer Mobile" variant="outlined" name="order[customer_mobile]" size="small" required />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth type="text" label="Address Line 1" variant="outlined" name="order[address_line_1]" size="small" required />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth type="text" label="Address Line 2" variant="outlined" name="order[address_line_2]" size="small" />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Autocomplete
                      disablePortal
                      id="state"
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
                    <TextField fullWidth type="text" label="Zip Code" variant="outlined" name="order[zip]" size="small" required />
                  </Grid>
                </>}
                {!ship && <>
                  <Grid item xs={12} md={4}>
                    <Autocomplete
                      disablePortal
                      options={shipping}
                      fullWidth
                      size="small"
                      renderInput={(params) => <TextField {...params} name="order[carrier]" label="Label Shipping Carrier" />}
                      freeSolo
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth label="Label Tracking #" name="order[tracking_number]" variant="outlined" size="small" required />
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
                              <Typography variant="body2">Qty {`${product.cart} x $${product.retail_price?.toFixed(2)}`}</Typography>
                            </Grid>
                            <Grid item sx={2}>
                              <Typography variant="body2">${(product.cart * product.retail_price)?.toFixed(2)}</Typography>
                            </Grid>
                            <Divider sx={{ mt: 1 }} />
                          </Grid>
                        )
                      })}
                    </Box>
                    <Grid display="flex" justifyContent="space-between">
                      <Typography>Sub total</Typography>
                      <Typography>${totalPrice?.toFixed(2)}</Typography>
                    </Grid>
                    <Divider sx={{ my: 1 }} />
                    <Grid display="flex" justifyContent="space-between">
                      <Typography>Shipping</Typography>
                      <Typography>${totalShipping?.toFixed(2)}</Typography>
                    </Grid>
                    <Divider sx={{ my: 1 }} />
                    <Grid display="flex" justifyContent="space-between">
                      <Typography>Total</Typography>
                      <Typography>${(totalPrice + totalShipping)?.toFixed(2)}</Typography>
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