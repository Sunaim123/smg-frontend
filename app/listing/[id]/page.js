"use client"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Button, Box, Container, Grid, Typography, Divider, IconButton, TextField } from "@mui/material"

import Add from "@mui/icons-material/Add"
import Remove from "@mui/icons-material/Remove"
import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Loading from "@/app/components/Loading"
import Navbar from "@/app/components/Navbar"
import * as productApis from "@/app/apis/product"
import * as cartSlice from "@/app/store/cart"

export default function product({ params }) {
  const userState = useSelector(state => state.user)
  const cartState = useSelector(state => state.cart)
  const dispatch = useDispatch()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [display, setDisplay] = useState("/dummy-product.jpeg")
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
      if (response.product.images) setDisplay(JSON.parse(response.product.images)[0])
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
      <Navbar />

      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={700} my={3}>Product Details</Typography>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <img
                  src={display}
                  alt={product.title}
                  width="100%"
                  height="400px"
                  style={{ borderRadius: "4px", border: "1px solid #d1d5db" }}
                />
              </Grid>
              {product.images && JSON.parse(product.images).map((image) => (
                image && <Grid item xs={3}>
                  <img
                    src={image}
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
                <Typography fontSize={30} fontWeight={700}>${product.price.toFixed(2)}</Typography>
                <Typography>Shipping: ${product.shipping_price.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={12} />

              {userState.customer &&
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
                        <Typography>Price: ${(quantity * product.price).toFixed(2)}</Typography>
                      </Grid>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Button fullWidth onClick={handleCart}>
                      Add to cart
                    </Button>
                  </Grid>
                </>}
              <Grid item xs={12}>
                <Typography>{product.description}</Typography>
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
        </Grid>
      </Container>
    </Auth>
  )
}