"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { FormProvider, useForm } from "react-hook-form"
import { Box, Button, Container, Grid, Typography } from "@mui/material"

import Alert from "@/app/components/Alert"
import SelectForm from "@/app/components/forms/SelectForm"
import * as invoiceApis from "@/apis/invoice"
import FormField from "@/app/components/forms/FormField"

export default function InvoicePayment({ params }) {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const [invoice, setInvoice] = useState(null)
  const [invoiceLineItem, setInvoiceLineItem] = useState(null)
  const [invoiceLineItemOptions, setInvoiceLineItemOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })
  const form = useForm({
    defaultValues: {
      quantity: "",
      unit_price: "",
      price: "",
      invoice_lineitem_id: "",
    }
  })

  const handleChangeInvoiceLineItem = (e) => {
    const lineItem = invoice.invoice_lineitems.find(item => item.id === e.target.value)
    setInvoiceLineItem(lineItem)
  }

  const handleChangeQuantity = (e) => {
    if (!invoiceLineItem) return

    form.setValue("price", parseInt(e.target.value) * invoiceLineItem.unit_price || 0)
    form.setValue("quantity" ,parseInt(e.target.value) || 0)
  }

  const handleSubmit = async (data) => {
    try {
      setLoading(true)

      const payload = {
        quantity: parseInt(data.quantity),
        unit_price: invoiceLineItem.unit_price,
        price: parseFloat(data.price),
        product_id: invoiceLineItem.product_id,
        invoice_id: parseInt(params.id),
        invoice_lineitem_id: parseInt(data.invoice_lineitem_id),
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
    if (params.id) getInvoice()
  }, [])

  return (
    <>
      <Alert toast={toast} setToast={setToast} />
      <Container maxWidth="sm">
        <Box py={3}>
          <Typography variant="h4" fontWeight={700} mb={3}>Invoice Payment</Typography>

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <SelectForm label="Item" name="invoice_lineitem_id" required options={invoiceLineItemOptions} value={invoiceLineItem ? invoiceLineItem.id : ""} onChange={handleChangeInvoiceLineItem} />
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
                  <FormField label="Quantity" name="quantity" variant="outlined" size="small" rules={{ required: "Quantity is required" }} onChange={handleChangeQuantity} />
                </Grid>
                <Grid item xs={12}>
                  <FormField label="Total" name="price" variant="outlined" size="small" rules={{ required: "Price is required" }} />
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
          </FormProvider>
        </Box>
      </Container>
    </>
  )
}