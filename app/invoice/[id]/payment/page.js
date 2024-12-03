"use client"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Box, Button, Container, FormControl, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material"

import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Navbar from "@/app/components/Navbar"
import SelectField from "@/app/components/SelectField"
import * as invoiceApis from "@/app/apis/invoice"

export default function InvoicePayment({ params }) {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const formRef = useRef(null)
  const [invoice, setInvoice] = useState(null)
  const [invoiceLineItem, setInvoiceLineItem] = useState(null)
  const [invoiceLineItemOptions, setInvoiceLineItemOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleChangeInvoiceLineItem = (e) => {
    const lineItem = invoice.invoice_lineitems.find(item => item.id === e.target.value)
    setInvoiceLineItem(lineItem)
  }

  const handleChangeQuantity = (e) => {
    if (!invoiceLineItem) return

    formRef.current.price.value = parseInt(e.target.value) * invoiceLineItem.unit_price
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const payload = {
        quantity: parseInt(e.target.quantity.value),
        unit_price: invoiceLineItem.unit_price,
        price: parseFloat(e.target.price.value),
        product_id: invoiceLineItem.product_id,
        invoice_id: parseInt(params.id),
        invoice_lineitem_id: parseInt(e.target.invoice_lineitem_id.value),
      }
      if (payload.quantity > (invoiceLineItem.quantity - invoiceLineItem.quantity_received)) throw new Error("Quantity should be less than or equal to remaining quantity")
      if (payload.price > invoiceLineItem.price) throw new Error("Price should be less than or equal to remaining price")

      const response = await invoiceApis.createPayment(userState.token, payload)
      if (!response.status) throw new Error(response.message)

      setToast({ type: "success", open: true, message: "Saved" })
      window.close()
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    } finally {
      setLoading(false)
    }
  }

  const getInvoice = async () => {
    try {
      const response = await invoiceApis.getInvoice(userState.token, params.id)
      if (!response.status) throw new Error(response.message)

      setInvoice(response.invoice)
      setInvoiceLineItemOptions(response.invoice.invoice_lineitems.map((item) => ({
        value: item.id,
        label: `Item #: ${item.id} - ${item.product.title}`
      })))
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (userState.customer) router.replace("/products")
    if (!userState.warehouseUser) router.replace("/dashboard")

    if (params.id) getInvoice()
  }, [])

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Navbar />

      <Container maxWidth="sm">
        <Box py={3}>
          <Typography variant="h4" fontWeight={700} mb={3}>Invoice Payment</Typography>

          <form ref={formRef} onSubmit={handleSubmit} method="post">
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <SelectField label="Item" name="invoice_lineitem_id" required options={invoiceLineItemOptions} value={invoiceLineItem ? invoiceLineItem.id : ""} onChange={handleChangeInvoiceLineItem} />
              </Grid>
              {invoiceLineItem && <>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" fontWeight={800}>REMAINING QUANTITY</Typography>
                  <Typography variant="body1">{invoiceLineItem.quantity - invoiceLineItem.quantity_received}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" fontWeight={800}>REMAINING PRICE</Typography>
                  <Typography variant="body1">${(invoiceLineItem.price - invoiceLineItem.price_received).toFixed(2)}</Typography>
                </Grid>
              </>}
              <Grid item xs={12}>
                <TextField fullWidth label="Quantity" name="quantity" variant="outlined" size="small" required onChange={handleChangeQuantity} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Total" name="price" variant="outlined" size="small" required />
              </Grid>
              <Grid item xs={12}>
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
        </Box>
      </Container>
    </Auth>
  )
}