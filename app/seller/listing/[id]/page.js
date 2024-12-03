"use client"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Button, Box, Container, Grid, Typography, Divider, IconButton, TextField, Tabs, Tab } from "@mui/material"

import Add from "@mui/icons-material/Add"
import Remove from "@mui/icons-material/Remove"
import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Loading from "@/app/components/Loading"
import SellerNavbar from "@/app/components/SellerNavbar"
import * as productApis from "@/app/apis/product"
import * as cartSlice from "@/app/store/cart"

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  }
}

export default function product({ params }) {
  const userState = useSelector(state => state.user)
  const cartState = useSelector(state => state.cart)
  const dispatch = useDispatch()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [display, setDisplay] = useState("/dummy-product.jpeg")
  const [value, setValue] = useState(0)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleCart = () => {
    if (product.quantity === 0) return setToast({ type: "error", open: true, message: "Out of stock" })
    const index = cartState.findIndex((item) => item.id === product.id)

    if (index === -1) {
      dispatch(cartSlice.addToCart({ ...product, cartQuantity: quantity }))
      setToast({ type: "success", open: true, message: "Product added to the cart" })
    } else {
      if (product.quantity <= cartState[index].cart) return setToast({ type: "error", open: true, message: `We do not have more than ${product.quantity} units` })
      dispatch(cartSlice.increment(index))
      setToast({ type: "success", open: true, message: "Product updated in the cart" })
    }
  }

  const handleQuantityChange = (e) => {
    if (e.target.value > product.quantity) setToast({ type: "error", open: true, message: `Only ${product.quantity} items available` })
    else setQuantity(parseInt(e.target.value))
  }

  const getProduct = async () => {
    try {
      const response = await productApis.getProduct(userState.token, params.id)
      if (!response.status) throw new Error(response.message)

      setProduct(response.product)
      if (response.product.thumbnail_url) setDisplay("thumbnail_url")
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    getProduct()
  }, [])

  if (!product)
    return (
      <Loading />
    )

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <SellerNavbar />

      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={700} my={3}>Product Details</Typography>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <img
                  src={product[display]}
                  alt={product.title}
                  width="100%"
                  height="400px"
                  style={{ borderRadius: "4px", border: "1px solid #d1d5db" }}
                />
              </Grid>
              {["thumbnail_url", "image1_url", "image2_url", "image3_url"].map((image) => (
                product[image] && <Grid item xs={3}>
                  <img
                    src={product[image]}
                    alt={image}
                    width="100%"
                    height={100}
                    style={{ cursor: "pointer", borderRadius: "4px", border: "1px solid #d1d5db" }}
                    onClick={() => setDisplay(image)}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography fontWeight={700} fontSize={25} >{product.title}</Typography>
                <Typography variant="body2">{product.brand}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography fontSize={30} fontWeight={700}>${product.retail_price.toFixed(2)}</Typography>
                <Typography>Shipping: ${product.shipping_price.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={12} />

              {/* {userState.customer &&
                <>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Grid item xs={4}>
                        <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                          <IconButton disabled={quantity === 1} color="error" onClick={() => setQuantity(quantity - 1)} aria-label="Decrease quantity">
                            <Remove />
                          </IconButton>
                          <TextField
                            value={quantity}
                            onChange={handleQuantityChange}
                            size="small"
                            type="number"
                            inputProps={{ min: 1 }}
                          />
                          <IconButton disabled={quantity === product.quantity} color="success" onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity">
                            <Add />
                          </IconButton>
                        </Box>
                      </Grid>
                      <Grid>
                        <Typography>Price: ${(quantity * product.retail_price).toFixed(2)}</Typography>
                      </Grid>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Button fullWidth onClick={handleCart}>
                      Add to cart
                    </Button>
                  </Grid>
                </>} */}
              <Grid item xs={12}>
                <Typography>{product.short_description}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} display="flex" gap={1}>
                <Typography variant="body1" fontWeight={700}>SKU:</Typography><Typography variant="body1">{product.sku}</Typography>
              </Grid>
              <Grid item xs={12} display="flex" gap={1}>
                <Typography variant="body1" fontWeight={700}>Quantity:</Typography><Typography variant="body1">{product.quantity}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Tabs value={value} onChange={(e, newValue) => setValue(newValue)} aria-label="basic tabs example">
              <Tab label="Description" {...a11yProps(0)} />
              <Tab label="Return Policy" {...a11yProps(1)} />
              <Tab label="Shipping Policy" {...a11yProps(2)} />
            </Tabs>
            <CustomTabPanel value={value} index={0}>
              <Typography m={2}>{product.description}</Typography>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <Typography m={2}>
                At SMG, we are committed to ensuring a seamless shopping experience for our customers. Our return policy allows you to return eligible items within 30 days of delivery for a full refund or exchange, provided the items are unused, in their original packaging, and accompanied by proof of purchase. Certain products, such as perishable goods, personalized items, and intimate apparel, may not qualify for returns due to health and safety reasons. If your item arrives damaged or defective, please contact our customer support team within 48 hours of receipt to initiate a hassle-free return or replacement. Refunds will be processed to the original payment method within 5-7 business days after the return is received and inspected. For detailed information, visit our <a href="/">Return Policy</a> page or contact our support team.
              </Typography>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <Typography m={2}>
                At SMG, we strive to deliver your orders promptly and securely. We offer standard and expedited shipping options to cater to your needs. Orders are typically processed within 1-2 business days and shipped to your designated address. Standard shipping takes 3-7 business days, while expedited options may take 1-3 business days, depending on your location. Shipping costs are calculated at checkout and vary based on the weight, dimensions, and destination of the order. Free shipping may be available on qualifying orders above a specified amount. Once your order is shipped, you will receive a tracking number to monitor its journey. Please note that delivery times may vary due to unforeseen circumstances such as weather conditions or carrier delays. For more information, visit our <a href="/">Shipping Policy page</a> or contact our support team.</Typography>
            </CustomTabPanel>
          </Grid>
        </Grid>
      </Container>
    </Auth>
  )
}