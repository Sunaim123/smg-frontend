"use client"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Button, Box, Container, Grid, Typography, Divider, IconButton, TextField, Tabs, Tab, Chip } from "@mui/material"
import Add from "@mui/icons-material/Add"
import Remove from "@mui/icons-material/Remove"

import Alert from "@/app/components/Alert"
import Loading from "@/app/components/Loading"
import * as productApis from "@/apis/product"
import * as cartSlice from "@/store/cart"

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
  const [value, setValue] = useState(0)
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [display, setDisplay] = useState("/dummy-product.jpeg")
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleChange = (e, newValue) => {
    setValue(newValue)
  }

  const handleCart = () => {
    if (product.stock_quantity === 0) return setToast({ type: "error", open: true, message: "Out of stock" })
    const index = cartState.findIndex((item) => item.id === product.id)

    if (index === -1) {
      dispatch(cartSlice.addToCart({ ...product, cartQuantity: quantity }))
      setToast({ type: "success", open: true, message: "Product added to the cart" })
    } else {
      if (product.stock_quantity <= cartState[index].cart) return setToast({ type: "error", open: true, message: `We do not have more than ${product.stock_quantity} units` })
      dispatch(cartSlice.increment(index))
      setToast({ type: "success", open: true, message: "Product updated in the cart" })
    }
  }

  const handleQuantityChange = (e) => {
    if (e.target.value > product.stock_quantity) setToast({ type: "error", open: true, message: `Only ${product.stock_quantity} items available` })
    else setQuantity(parseInt(e.target.value))
  }

  const getProduct = async () => {
    try {
      const response = await productApis.getProduct(userState.token, params.id)
      if (!response.status) throw new Error(response.message)

      setProduct(response.product)
      if (response.product.thumbnail_url) setDisplay(response.product.thumbnail_url)
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
    <>
      <Alert toast={toast} setToast={setToast} />
      <Container maxWidth="lg">
        <Box mb={3}>
        <Typography variant="h4" fontWeight={700} my={3}>Product Details</Typography>

        <Grid container spacing={5}>
          <Grid item xs={4}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <img
                  src={display}
                  alt={product.title}
                  width="100%"
                  height="300px"
                  style={{ borderRadius: "4px", border: "1px solid #d1d5db" }}
                />
              </Grid>
              {["thumbnail_url", "image1_url", "image2_url", "image3_url"].map((image) => (
                product[image] && <Grid item xs={3}>
                  <img
                    src={product[image]}
                    alt={product[image]}
                    width="100%"
                    height={100}
                    style={{ cursor: "pointer", borderRadius: "4px", border: "1px solid #d1d5db" }}
                    onClick={() => setDisplay(product[image])}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={8}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography fontWeight={700} fontSize={25} >{product.title}</Typography>
                <Typography variant="body2">{product.brand}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography fontSize={30} fontWeight={700}>${product.retail_price.toFixed(2)}</Typography>
                <Typography>Shipping: ${product.shipping_price.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Chip label={product.category.name} color="primary" variant="outlined" />
              </Grid>
              <Grid item sx={10} />
              <Grid item xs={12} />
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
                      <IconButton disabled={quantity === product.stock_quantity} color="success" onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity">
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
                <Button variant="contained" fullWidth onClick={handleCart}>
                  Add to cart
                </Button>
              </Grid>
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
                <Typography variant="body1" fontWeight={700}>Quantity:</Typography><Typography variant="body1">{product.stock_quantity}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item sx={12}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Description" {...a11yProps(0)} />
              <Tab label="Return Policy" {...a11yProps(1)} />
            </Tabs>
            <CustomTabPanel value={value} index={0}>
              {product.description}
            </CustomTabPanel>
          </Grid>
        </Grid>
        </Box>
      </Container>
    </>
  )
}