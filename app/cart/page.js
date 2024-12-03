"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Box, Button, Card, CardContent, CardHeader, Container, Divider, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material"
import Add from "@mui/icons-material/Add"
import DeleteOutlined from "@mui/icons-material/DeleteOutlined"
import Remove from "@mui/icons-material/Remove"
import RemoveShoppingCartOutlined from "@mui/icons-material/RemoveShoppingCartOutlined"

import Alert from "../components/Alert"
import * as cartSlice from "../../store/cart"
import Layout from "../components/Layout"

function Cart() {
  const userState = useSelector((state) => state.user)
  const cartState = useSelector((state) => state.cart)
  const router = useRouter()
  const dispatch = useDispatch()
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const getUnitPrice = (product) => product.cart >= product.minimum_wholsale_quantity && product.minimum_wholsale_quantity > 0 ? product.wholsale_price : product.retail_price ? product.retail_price : product.price
  const getSubTotal = (product) => (product.cart >= product.minimum_wholsale_quantity && product.minimum_wholsale_quantity > 0 ? product.wholsale_price : product.retail_price ? product.retail_price : product.price) * product.cart

  let shippingPrice = 0
  if (userState.customer) {
    const getShippingPrice = (product) => product.shipping_price
    shippingPrice = cartState.reduce((total, product) => total + (product.shipping_on_each ? getShippingPrice(product) * product.cart : getShippingPrice(product)), 0)
  }

  const totalPrice = cartState.reduce((total, product) => {
    return total + getUnitPrice(product) * product.cart
  }, 0)
  let netTotal = totalPrice
  if (userState.customer) netTotal += shippingPrice

  const handleCheckout = () => {
    if (userState.customer) router.push("/checkout")
    else router.push("/wp/checkout")
  }

  const handleIncrement = (product, index) => {
    if (product.stock_quantity <= cartState[index].cart) return setToast({ type: "error", open: true, message: `We do not have more than ${product.stock_quantity} units` })

    dispatch(cartSlice.increment(index))
  }

  const handleDecrement = (product, index) => {
    if (product.cart - 1 <= 0)
      dispatch(cartSlice.removeFromCart(index))
    else
      dispatch(cartSlice.decrement(index))
  }

  const handleQuantityChange = (value, product, index) => {
    if (product.stock_quantity < value) return setToast({ type: "error", open: true, message: `We do not have more than ${product.stock_quantity} units` })

    dispatch(cartSlice.setQuantity({ value, index }))
  }

  if (!cartState.length)
    return (
      <Layout>
        <Box sx={{ py: 4 }} display="flex" flexDirection="column" justifyContent="center" alignItems="center" my={10}>
          <RemoveShoppingCartOutlined sx={{ fontSize: 280, padding: 4, background: "hsl(210, 100%, 95%)", color: "hsl(210, 98%, 48%)", borderRadius: 50 }} />
          <Typography variant="h3" fontWeight={900} my={4}>Your Cart is Empty</Typography>
          <Typography variant="h5">Looks like you have not added anything to your cart.</Typography>
          <Typography variant="h5" mb={4}>Go ahead and explore top products.</Typography>
          <Button disableElevation size="large" variant="contained" onClick={() => router.replace("/products")}>Explore Products</Button>
        </Box>
      </Layout>
    )

  return (
    <Layout>
      <Alert toast={toast} setToast={setToast} />
      <Container maxWidth="xl">
        {cartState.length > 0 && <Box py={10}>
          <Typography variant="h4" fontWeight={700} mb={3}>Shopping Cart</Typography>

          <Grid container spacing={1}>
            <Grid item xs={8}>
              <Card variant="outlined">
                <CardHeader title="Items" titleTypographyProps={{ variant: "h6" }} />
                <CardContent>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                        <TableCell width={40}></TableCell>
                        <TableCell>SKU</TableCell>
                        <TableCell>Product</TableCell>
                        <TableCell>Unit Price</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Sub Total</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cartState.map((product, index) => {
                        return (
                          <TableRow key={product.id.toString()}>
                            <TableCell>
                              <Image src={product.images ? JSON.parse(product.images)[0] : product.thumbnail_url || "/dummy-product.jpeg"} alt={product.title} width={40} height={40} style={{ borderRadius: "4px", border: "1px solid #d1d5db" }} />
                            </TableCell>
                            <TableCell>{product.sku}</TableCell>
                            <TableCell>{product.title}</TableCell>
                            <TableCell>${(getUnitPrice(product))?.toFixed(2)}</TableCell>
                            <TableCell width="30%">
                              <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                                <IconButton color="error" onClick={() => handleDecrement(product, index)}><Remove /></IconButton>
                                <TextField
                                  value={product.cart}
                                  onChange={(e) => handleQuantityChange(parseInt(e.target.value), product, index)}
                                  size="small"
                                />
                                <IconButton color="success" onClick={() => handleIncrement(product, index)}><Add /></IconButton>
                              </Box>
                            </TableCell>
                            <TableCell>${(getSubTotal(product))?.toFixed(2)}</TableCell>
                            <TableCell align="center">
                              <IconButton color="error" onClick={() => dispatch(cartSlice.removeFromCart(index))}><DeleteOutlined /></IconButton>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card variant="outlined">
                <CardHeader title="Summary" titleTypographyProps={{ variant: "h6" }} />
                <CardContent>
                  {userState.customer &&
                    <><Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6">Sub total: </Typography>
                      <Typography variant="h6">${totalPrice.toFixed(2)}</Typography>
                    </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">Shipping: </Typography>
                        <Typography variant="h6">${shippingPrice.toFixed(2)}</Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                    </>}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5">Total: </Typography>
                    <Typography variant="h5" fontWeight={800}>${netTotal.toFixed(2)}</Typography>
                  </Box>
                  <Button disableElevation fullWidth size="large" variant="contained" onClick={handleCheckout}>Proceed to checkout</Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>}
      </Container>
    </Layout>
  )
}

export default Cart
