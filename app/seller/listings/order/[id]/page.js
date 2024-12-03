"use client"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Typography, Card, CardContent, CardHeader, Table, TableHead, TableBody, TableRow, TableCell, Container, Box, Grid, Button, TextField, IconButton } from "@mui/material"
import * as Icon from "@mui/icons-material"

import Auth from "@/app/components/Auth"
import Alert from "@/app/components/Alert"
import SellerNavbar from "@/app/components/SellerNavbar"
import Loading from "@/app/components/Loading"
import * as constants from "@/app/utilities/constants"
import * as orderApis from "@/app/apis/order"

const Order = ({ params }) => {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleRefund = async () => {
    try {
      if (!window.confirm("Are you sure you want to refund this order?")) return
      setLoading(true)

      const payload = {
        id: params.id,
        status: "refunded"
      }
      const response = await orderApis.updateOrder(userState.token, payload)
      if (!response.status) throw new Error(response.message)

      setToast({ type: "success", open: true, message: "Refunded" })
      getOrder()
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    } finally {
      setLoading(false)
    }
  }

  const getOrder = async () => {
    try {
      const response = await orderApis.getOrder(userState.token, params.id)
      if (!response.status) throw new Error(response.message)

      setOrder(response.order)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (userState.warehouseUser) router.replace("/dashboard")
    if (params.id) getOrder()
  }, [])

  if (!order)
    return (
      <Loading />
    )

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <SellerNavbar />

      <Container maxWidth="xl">
        <Box display="flex" justifyContent="space-between" alignItems="center" my={3}>
          <Typography variant="h4" fontWeight={700}>Order #: {order.id}</Typography>
          <Box display="flex" gap={1}>
            {order?.order_status !== "cancelled" && <Button variant="contained" size="small" disableElevation disabled={loading} color="error" onClick={() => router.push(`/seller/listings/order/cancel?id=${params.id}`)}>Cancel Order</Button>}
            {order?.order_status === "received" && order?.payment_status === "paid" && <Button variant="contained" size="small" disableElevation disabled={loading} onClick={() => router.push(`/listings/order/ship?id=${params.id}`)}>Add Tracking</Button>}
            {order?.order_status === "shipped" && order?.payment_status === "paid" && <Button variant="contained" size="small" disableElevation disabled={loading} onClick={() => router.push(`/listings/order/ship?id=${params.id}`)}>Edit Tracking</Button>}
            {order?.order_status === "cancelled" && order?.payment_status === "paid" && <Button variant="contained" size="small" color="error" disableElevation disabled={loading} onClick={handleRefund}>Refund Order</Button>}
          </Box>
        </Box>

        <Grid container spacing={1}>
          <Grid item xs={8}>
            <Box mb={1}>
              <Card variant="outlined">
                <CardHeader title="Order Line Items" titleTypographyProps={{ variant: "h6" }} />
                <CardContent>
                  <Table size="small">
                    <TableHead sx={{ backgroundColor: "#f3f4f6" }}>
                      <TableRow>
                        <TableCell width={40}></TableCell>
                        <TableCell>Product</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Shipping</TableCell>
                        <TableCell>Sub Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.order_lineitems.map((item) => {
                        return (
                          <TableRow key={item.id.toString()} onDoubleClick={() => router.push(`/listing/${item.product_id}`)}>
                            <TableCell>
                              <Link href={item.product.images ? JSON.parse(item.product.images)[0] : item.product.thumbnail_url || "/dummy-product.jpeg"} target="_blank">
                                <Image src={item.product.images ? JSON.parse(item.product.images)[0] : item.product.thumbnail_url || "/dummy-product.jpeg"} alt={item.product.title} width={40} height={40} style={{ borderRadius: "4px", border: "1px solid #d1d5db" }} />
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body1">{item.product.title}</Typography>
                            </TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>${item.price.toFixed(2)}</TableCell>
                            <TableCell>${item.product?.shipping_price.toFixed(2)}</TableCell>
                            <TableCell>${(item.price + item.product?.shipping_price).toFixed(2)}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Box>

            <Card variant="outlined">
              <CardHeader title="Shipping Details" titleTypographyProps={{ variant: "h6" }} />
              <CardContent>
                <Grid container spacing={1} mb={1}>
                  <Grid item md={6}>
                    <Typography variant="body1" fontWeight={800}>CUSTOMER NAME</Typography>
                    <Typography variant="body2">{order.customer_name}</Typography>
                  </Grid>
                  <Grid item md={6}>
                    <Typography variant="body1" fontWeight={800}>CUSTOMER MOBILE</Typography>
                    <Typography variant="body2">{order.customer_mobile}</Typography>
                  </Grid>
                  <Grid item md={6}>
                    <Typography variant="body1" fontWeight={800}>ADDRESS 1</Typography>
                    <Typography variant="body2">{order.address_line_1}</Typography>
                  </Grid>
                  <Grid item md={6}>
                    <Typography variant="body1" fontWeight={800}>ADDRESS 2</Typography>
                    <Typography variant="body2">{order.address_line_2}</Typography>
                  </Grid>
                  <Grid item md={4}>
                    <Typography variant="body1" fontWeight={800}>CITY</Typography>
                    <Typography variant="body2">{order.city}</Typography>
                  </Grid>
                  <Grid item md={4}>
                    <Typography variant="body1" fontWeight={800}>STATE</Typography>
                    <Typography variant="body2">{order.state}</Typography>
                  </Grid>
                  <Grid item md={4}>
                    <Typography variant="body1" fontWeight={800}>ZIPCODE</Typography>
                    <Typography variant="body2">{order.zip}</Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  {order.carrier && <Grid item md={4}>
                    <Typography variant="body1" fontWeight={800}>SHIPPING CARRIER</Typography>
                    <Typography variant="body2">{order.carrier}</Typography>
                  </Grid>}
                  {order.tracking_number && <Grid item md={4}>
                    <Typography variant="body1" fontWeight={800}>TRACKING NUMBER</Typography>
                    <Typography variant="body2">{order.tracking_number}</Typography>
                  </Grid>}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Box mb={1}>
              <Card variant="outlined">
                <CardHeader title="Order Summary" titleTypographyProps={{ variant: "h6" }} />
                <CardContent>
                  <Grid container spacing={1}>
                    <Grid item md={6}><Typography variant="body1" fontWeight={800}>DATETIME:</Typography></Grid>
                    <Grid item md={6}><Typography variant="body2">{constants.getFormattedDatetime(order.created_at)}</Typography></Grid>

                    <Grid item md={6}><Typography variant="body1" fontWeight={800}>ORDER STATUS:</Typography></Grid>
                    <Grid item md={6}>{constants.orderStatus[order.order_status]}</Grid>

                    <Grid item md={6}><Typography variant="body1" fontWeight={800}>PAYMENT STATUS:</Typography></Grid>
                    <Grid item md={6}>{constants.paymentStatus[order.payment_status]}</Grid>

                    <Grid item md={6}><Typography variant="body1" fontWeight={800}>SUB TOTAL:</Typography></Grid>
                    <Grid item md={6}><Typography variant="body2">${order.price?.toFixed(2) || 0}</Typography></Grid>

                    <Grid item md={6}><Typography variant="body1" fontWeight={800}>SHIPPING TOTAL:</Typography></Grid>
                    <Grid item md={6}><Typography variant="body2">${order.shipping_price?.toFixed(2) || 0}</Typography></Grid>

                    <Grid item md={6}><Typography variant="body1" fontWeight={800}>TOTAL:</Typography></Grid>
                    <Grid item md={6}><Typography variant="body2">${(order.price + order.shipping_price)?.toFixed(2) || 0}</Typography></Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>

            {userState.companyUser && <Card variant="outlined">
              <CardHeader title="Fees" titleTypographyProps={{ variant: "h6" }} />
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item md={6}><Typography variant="body1" fontWeight={800}>TRANSACTION CHARGES:</Typography></Grid>
                  <Grid item md={6}><Typography variant="body2">${(order.fees + order.other_fees)?.toFixed(2) || 0}</Typography></Grid>

                  <Grid item md={6}><Typography variant="body1" fontWeight={800}>YOU EARNED:</Typography></Grid>
                  <Grid item md={6}><Typography variant="body2">${order.payout?.toFixed(2) || 0}</Typography></Grid>

                </Grid>
              </CardContent>
            </Card>}

          </Grid>
        </Grid>
      </Container>
    </Auth>
  )
}

export default Order