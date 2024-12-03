"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { FormProvider, useForm } from "react-hook-form"
import { Autocomplete, Box, Button, Container, FormControl, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material"
import AddOutlined from "@mui/icons-material/AddOutlined"
import DeleteOutlined from "@mui/icons-material/DeleteOutlined"

import Alert from "@/app/components/Alert"
import SelectField from "@/app/components/SelectField"
import * as companyApis from "@/apis/company"
import * as invoiceApis from "@/apis/invoice"
import * as productApis from "@/apis/product"
import FormField from "@/app/components/forms/FormField"

export default function Invoice() {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [companies, setCompanies] = useState([])
  const [company, setCompany] = useState(null)
  const [products, setProducts] = useState([])
  const [items, setItems] = useState([
    { product_id: "", quantity: 0, unit_price: 0, price: 0 }
  ])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })
  const form = useForm({
    defaultValues: {
      quantity: "",
      price: "",
      invoice_lineitems: []
    }
  })


  const getTotal = (array, key) => array.reduce((previous, current) => previous += current[key], 0)

  const handleUpdateProduct = (e, index) => {
    setItems((previous) => {
      previous[index].product_id = e.target.value ? parseInt(e.target.value) : ""
      previous[index].quantity = 0
      previous[index].unit_price = 0
      previous[index].price = 0
      return [...previous]
    })
  }

  const handleUpdateQuantity = (e, product_id, index) => {
    const quantity = products.find((x) => x.value === product_id)?.quantity
    if (e.target.value > quantity) setToast({ type: "error", open: true, message: `Only ${quantity} quantity is available for this product` })
    else {
      setItems((previous) => {
        previous[index].quantity = e.target.value ? parseInt(e.target.value) : 0
        previous[index].price = e.target.value ? parseInt(e.target.value) * previous[index].unit_price : 0
        return [...previous]
      })
      form.setValue(`invoice_lineitems[${index}][unit_price]`, items[index].unit_price)
      form.setValue(`invoice_lineitems[${index}][price]`, items[index].price)
      form.setValue("quantity", getTotal(items, "quantity"))
      form.setValue("price", getTotal(items, "price"))
    }
  }

  const handleUpdateUnitPrice = (e, index) => {
    setItems((previous) => {
      previous[index].unit_price = e.target.value ? parseFloat(e.target.value) : 0
      previous[index].price = e.target.value ? parseInt(e.target.value) * previous[index].quantity : 0
      return [...previous]
    })
    form.setValue(`invoice_lineitems[${index}][unit_price]`, items[index].unit_price)
    form.setValue(`invoice_lineitems[${index}][price]`, items[index].price)
    form.setValue("quantity", getTotal(items, "quantity"))
    form.setValue("price", getTotal(items, "price"))
  }

  const handleAdd = () => {
    setItems([...items, {
      quantity: 0,
      unit_price: 0,
      price: 0
    }])
  }

  const handleDelete = (index) => {
    setItems((previous) => {
      previous.splice(index, 1)
      return [...previous]
    })
  }

  const handleSubmit = async (data) => {
    try {
      setLoading(true)
      if (!items.length) throw new Error("Atleast add 1 item to create an invoice")
      if (!company) throw new Error("Please select a company")

      const payload = {
        invoice: {
          quantity: parseInt(data.quantity),
          price: parseFloat(data.price),
          company_id: parseInt(company.id)
        },
        invoice_lineitems: items
      }

      const id = searchParams.get("id")
      if (id) {
        payload.invoice.id = id
        const response = await invoiceApis.updateInvoice(userState.token, payload)
        if (!response.status) throw new Error(response.message)
      } else {
        const response = await invoiceApis.createInvoice(userState.token, payload)
        if (!response.status) throw new Error(response.message)
      }

      setToast({ type: "success", open: true, message: "Saved" })
      form.reset()
      setCompany(null)
      router.back()
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    } finally {
      setLoading(false)
    }
  }

  const getInvoice = async () => {
    try {
      const response = await invoiceApis.getInvoice(userState.token, searchParams.get("id"))
      if (!response.status) throw new Error(response.message)

      form.reset({
        quantity: response.invoice.quantity,
        price: response.invoice.price
      })
      setCompany(response.invoice.company.name)
      setItems(response.invoice.invoice_lineitems)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const getCompanies = async () => {
    try {
      const response = await companyApis.getCompanies(userState.token, "")
      if (!response.status) throw new Error(response.message)

      setCompanies(response.companies)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const getProducts = async () => {
    try {
      const response = await productApis.getProducts()
      if (!response.status) throw new Error(response.message)

      setProducts(response.products.map(product => ({ label: product.title, value: product.id, quantity: product.stock_quantity })))
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (userState.customer) router.replace("/products")
    getCompanies()
    getProducts()

    if (searchParams.get("id")) getInvoice()
  }, [])

  return (
    <>
      <Alert toast={toast} setToast={setToast} />
      <Container maxWidth="lg">
        <Box py={3}>
          <Typography variant="h4" fontWeight={700} mb={3}>Invoice</Typography>

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <Grid container spacing={1}>
                <Grid item xs={12} md={4}>
                  <FormField label="Quantity" name="quantity" variant="outlined" size="small" value={getTotal(items, "quantity")} rules={{ required: "Quantity is required" }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormField label="Total" name="price" variant="outlined" size="small" value={getTotal(items, "price")} rules={{ required: "Price is required" }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl size="small" variant="outlined" fullWidth required>
                    <Autocomplete
                      disablePortal
                      value={company}
                      options={companies.map(x => ({ label: x.name, id: x.id }))}
                      fullWidth
                      size="small"
                      renderInput={(params) => <FormField {...params} name="company_id" label="Company" />}
                      onChange={(e, option) => setCompany(option)}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#eee" }}>
                        <TableCell sx={{ width: "22.5%" }}>Product</TableCell>
                        <TableCell sx={{ width: "22.5%" }}>Quantity</TableCell>
                        <TableCell sx={{ width: "22.5%" }}>Unit Price</TableCell>
                        <TableCell sx={{ width: "22.5%" }}>Price</TableCell>
                        <TableCell sx={{ width: "10%" }} align="center">
                          <IconButton color="primary" onClick={handleAdd}><AddOutlined /></IconButton>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((item, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell>
                              <SelectField label="Product" name={`invoice_lineitems[${index}][product_id]`} options={products} rules={{ required: "Product is required" }} value={item.product_id} onChange={(e) => handleUpdateProduct(e, index)} />
                            </TableCell>
                            <TableCell>
                              <FormField type="number" label="Quantity" name={`invoice_lineitems[${index}][quantity]`} variant="outlined" size="small" rules={{ required: "Quantity is required" }} value={item.quantity} onChange={(e) => handleUpdateQuantity(e, item.product_id, index)} />
                            </TableCell>
                            <TableCell>
                              <FormField type="number" label="Unit Price" name={`invoice_lineitems[${index}][unit_price]`} variant="outlined" size="small" rules={{ required: "Unit price is required" }} value={item.unit_price} onChange={(e) => handleUpdateUnitPrice(e, index)} inputProps={{ step: "0.01" }} />
                            </TableCell>
                            <TableCell>
                              <FormField label="Total Price" name={`invoice_lineitems[${index}][price]`} variant="outlined" size="small" rules={{ required: "Price is required" }} value={item.price} />
                            </TableCell>
                            <TableCell align="center">
                              <IconButton color="error" size="small" onClick={() => handleDelete(index)}><DeleteOutlined /></IconButton>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </Grid>
                <Grid item xs={12} md={9} />
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
          </FormProvider>
        </Box>
      </Container>
    </>
  )
}