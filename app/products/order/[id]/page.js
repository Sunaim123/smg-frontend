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
import Navbar from "@/app/components/Navbar"
import Loading from "@/app/components/Loading"
import * as constants from "@/app/utilities/constants"
import * as orderApis from "@/app/apis/order"

const Order = ({ params }) => {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const [order, setOrder] = useState(null)
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleClick = async () => {
    window.open(invoice.invoice_url)
  }

  const handleDeleteInvoice = async (id) => {
    try {
      const response = await orderApis.deleteInvoice(userState.token, id)
      if (!response.status) throw new Error(response.message)

      setToast({ type: "success", open: true, message: "Deleted" })
      getOrder()
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const handleCancel = async () => {
    try {
      if (!window.confirm("Are you sure you want to cancel this order?")) return
      setLoading(true)

      const payload = {
        id: params.id,
        order_status: "cancelled"
      }
      const response = await orderApis.updateOrder(userState.token, payload)
      if (!response.status) throw new Error(response.message)

      setToast({ type: "success", open: true, message: "Cancelled" })
      getOrder()
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleRefund = async () => {
    try {
      if (!window.confirm("Are you sure you want to refund this order?")) return
      setLoading(true)

      const payload = {
        id: params.id,
        payment_status: "refunded"
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

  const handleSubmit = async (e) => {
    try {
      setLoading(true)
      e.preventDefault()

      const payload = {
        order_id: params.id,
        shipping: e.target.shipping.value,
        company_id: order.company_id
      }
      const response = await orderApis.createInvoice(userState.token, payload)
      if (!response.status) throw new Error(response.message)

      setToast({ type: "success", open: true, message: "Sent" })
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
      if (response.order.order_shippingitems.length) setInvoice(response.order.order_shippingitems[0])
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (params.id) getOrder()
  }, [])

  if (!order)
    return (
      <Loading />
    )

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Navbar />

      <Container maxWidth="xl">
        <Box display="flex" justifyContent="space-between" alignItems="center" my={3}>
          <Typography variant="h4" fontWeight={700}>Order #: {order.id}</Typography>
          <Box display="flex" gap={1}>
            {userState.companyUser && order.order_status === "received" && <Button variant="contained" size="small" color="error" disableElevation disabled={loading} onClick={handleCancel}>Cancel Order</Button>}
          </Box>
        </Box>

        <Grid container spacing={1}>
          <Grid item xs={8}>
            {userState.warehouseUser && order.ship_by_warehouse && !invoice && <Box mb={1}>
              <form onSubmit={handleSubmit}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item xs={4}>
                    <Typography variant="h4" fontWeight={700}>Send Shipping Invoice: </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField type="number" name="shipping" label="Shipping Charges" size="small" fullWidth required inputProps={{ step: "0.01" }} />
                  </Grid>
                  <Grid item xs={2}>
                    <Button type="submit" variant="contained" size="large" disableElevation fullWidth disabled={loading}>Send</Button>
                  </Grid>
                </Grid>
              </form>
            </Box>}

            <Box mb={1}>
              <Card variant="outlined">
                <CardHeader title="Order Line Items" titleTypographyProps={{ variant: "h6" }} />
                <CardContent>
                  <Table size="small">
                    <TableHead sx={{ backgroundColor: "#f3f4f6" }}>
                      <TableRow>
                        <TableCell width={40}></TableCell>
                        <TableCell>Product</TableCell>
                        <TableCell>Shipping</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.order_lineitems.map((item) => (
                        <TableRow key={item.id.toString()} onDoubleClick={() => router.push(`/product/${item.product_id}`)}> 
                          <TableCell>
                            <Link href={item.product.thumbnail_url || "/dummy-product.jpeg"} target="_blank">
                              <Image src={item.product.thumbnail_url || "/dummy-product.jpeg"} alt={item.product.title} width={40} height={40} style={{ borderRadius: "4px", border: "1px solid #d1d5db" }} />
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1">{item.product.title}</Typography>
                          </TableCell>
                          <TableCell>${item.product.shipping_price.toFixed(2)}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.price.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Box>

            {invoice && <Box mb={1}>
              <Card variant="outlined">
                <CardHeader
                  title="Shipping Invoice" titleTypographyProps={{ variant: "h6" }}
                  subheader={userState.companyUser && invoice.payment_status === "unpaid" ? "* Please pay this invoice to process your order" : ""} subheaderTypographyProps={{ variant: "body2", color: "red" }}
                />
                <CardContent>
                  <Table size="small">
                    <TableHead sx={{ backgroundColor: "#f3f4f6" }}>
                      <TableRow>
                        <TableCell>Invoice #</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Payment Status</TableCell>
                        {userState.companyUser && invoice.payment_status === "unpaid" && <TableCell>Invoice URL</TableCell>}
                        {userState.warehouseUser && invoice.payment_status === "unpaid" && <TableCell>Action</TableCell>}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow key={invoice.id.toString()}>
                        <TableCell>{invoice.id}</TableCell>
                        <TableCell>${invoice.price.toFixed(2)}</TableCell>
                        <TableCell>{constants.paymentStatus[invoice.payment_status]}</TableCell>
                        {userState.companyUser && invoice.payment_status === "unpaid" && <TableCell>
                          <Button startIcon={<Icon.OpenInNew />} variant="contained" size="small" disableElevation onClick={handleClick}>Pay Invoice</Button>
                        </TableCell>}
                        {userState.warehouseUser && invoice.payment_status === "unpaid" && <TableCell><IconButton onClick={() => handleDeleteInvoice(invoice.id)} color="error" size="small"><Icon.DeleteOutlined /></IconButton></TableCell>}
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Box>}

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
                  {order.label_url && <Grid item md={4}>
                    <Typography variant="body1" fontWeight={800}>LABEL URL</Typography>
                    <Button startIcon={<Icon.OpenInNew />} variant="contained" size="small" disableElevation onClick={() => window.open(order.label_url)}>Open Label</Button>
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
                    <Grid item md={6}><Typography variant="body2">${order.price.toFixed(2)}</Typography></Grid>

                    <Grid item md={6}><Typography variant="body1" fontWeight={800}>SHIPPING PRICE:</Typography></Grid>
                    <Grid item md={6}><Typography variant="body2">${(order.shipping_price || 0).toFixed(2)}</Typography></Grid>

                    <Grid item md={6}><Typography variant="body1" fontWeight={800}>TOTAL:</Typography></Grid>
                    <Grid item md={6}><Typography variant="body2">${(order.price + (order.shipping_price || 0)).toFixed(2)}</Typography></Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>

          </Grid>
        </Grid>
      </Container>
    </Auth>
  )
}

export default Order
