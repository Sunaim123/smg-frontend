"use client"
import { useRouter } from "next/navigation"
import { useRef, useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { TextField, Button, Checkbox, Container, Typography, Grid, Autocomplete, Box, Card, IconButton } from "@mui/material"
import { CloudUploadOutlined as CloudUploadOutlinedIcon, Clear, DeleteOutline } from "@mui/icons-material"
import states from "states-us"

import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Navbar from "@/app/components/Navbar"
import VisuallyHiddenInput from "@/app/components/VisuallyHiddenInput"
import * as orderApis from "@/app/apis/inventory-order"
import { emptyCart } from "@/app/store/cart"

export default function Checkout() {
  const userState = useSelector(state => state.user)
  const cart = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const router = useRouter()
  const formRef = useRef(null)
  const [ship, setShip] = useState(false)
  const [loading, setLoading] = useState(false)
  const [label, setLabel] = useState({ name: "Upload Label" })
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const getUnitPrice = (product) => product.cart >= product.minimum_wholsale_quantity && product.minimum_wholsale_quantity > 0 ? product.wholsale_price : product.retail_price
  const totalPrice = cart.reduce((total, product) => total + getUnitPrice(product) * product.cart, 0)

  const handleSubmit = async (e) => {
    try {
      setLoading(true)
      const form = new FormData(e.target)
      e.preventDefault()

      cart.forEach((product, index) => {
        form.append(`order_lineitems[${index}][stripe_product_id]`, product.product_id)
        form.append(`order_lineitems[${index}][inventory_id]`, product.id)
        form.append(`order_lineitems[${index}][inventory_name]`, product.title)
        form.append(`order_lineitems[${index}][quantity]`, product.cart)
        form.append(`order_lineitems[${index}][company_id]`, product.company_id)
        form.append(`order_lineitems[${index}][price]`, product.cart >= product.minimum_wholsale_quantity && product.minimum_wholsale_quantity > 0 ? product.wholsale_price : product.retail_price ? product.retail_price : product.price)
        form.append(`order_lineitems[${index}][price_id]`, product.cart >= product.minimum_wholsale_quantity && product.minimum_wholsale_quantity > 0 ? product.wholsale_price_id : product.retail_price ? product.retail_price_id : "")
      })

      form.append("order[price]", totalPrice.toFixed(2))
      form.append("order[cost]", cart.reduce((total, product) => total + product.cost, 0))  
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

  useEffect(() => {
    if (userState.customer) router.replace("/products")
  }, [])

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Navbar />

      <Container maxWidth="lg">
        <form ref={formRef} onSubmit={handleSubmit} method="post" encType="multipart/form-data">
          <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" my={3}>
            <Typography variant="h4" fontWeight={700}>Checkout</Typography>
            <Typography><Checkbox name="order[ship_by_warehouse]" checked={ship} onClick={() => setShip(!ship)} />Ship by Warehouse</Typography>
          </Box>
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
                <TextField fullWidth type="text" label="Zip Code" variant="outlined" name="order[zipcode]" size="small" required />
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
      </Container>
    </Auth>
  )
}