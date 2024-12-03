"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Box, Container, Button, Grid, IconButton, Badge, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, Tooltip, Typography } from "@mui/material"
import * as Icon from "@mui/icons-material"

import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Loading from "@/app/components/Loading"
import Navbar from "@/app/components/Navbar"
import * as invoiceApis from "@/app/apis/invoice"
import * as constants from "@/app/utilities/constants"

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

export default function Invoice({ params }) {
  const userState = useSelector(state => state.user)
  const router = useRouter()

  const [value, setValue] = useState(0)
  const [invoice, setInvoice] = useState(null)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleChange = (e, newValue) => {
    setValue(newValue)
  }

  const handleModal = (image) => {
    window.open(image)
  }

  const getInvoice = async () => {
    try {
      const response = await invoiceApis.getInvoice(userState.token, params.id)
      if (!response.status) throw new Error(response.message)

      setInvoice(response.invoice)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    getInvoice()
  }, [])

  if (!invoice)
    return (
      <Loading />
    )

  if (invoice.trash)
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Icon.ReportProblem color="error" fontSize="large" />
        <Typography variant="h4" fontWeight={700} mt={2}>
          This record is in trash
        </Typography>
        <Button variant="outlined" onClick={() => router.back()}>Go back</Button>
      </Box>
    )

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Navbar />

      <Container maxWidth="md">
        <Box display="flex" justifyContent="space-between" alignItems="center" my={3}>
          <Typography variant="h4" fontWeight={700}>Invoice</Typography>
          {userState.warehouseUser && invoice.status !== "paid" &&
            <>
              <a
                href={`/invoice/${invoice.id}/payment`}
                target="_blank"
                style={{ textDecoration: 'none' }}
              >
                <Button>
                  Add Payment
                </Button>
              </a>
            </>
          }
        </Box>
      </Container>

      <Container maxWidth="md">
        <Grid container spacing={1} mb={3}>
          <Grid item xs={6}>
            <Typography variant="body2" fontWeight={800}>INVOICE #</Typography>
            <Typography variant="body1">INV{invoice.id}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" fontWeight={800}>COMPANY</Typography>
            <Typography variant="body1">{invoice.company.name}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" fontWeight={800}>QUANTITY</Typography>
            <Typography variant="body1">{invoice.quantity}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" fontWeight={800}>TOTAL</Typography>
            <Typography variant="body1">${invoice.price?.toFixed(2)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" fontWeight={800}>STATUS</Typography>
            {constants.invoiceStatus[invoice.status]}
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" fontWeight={800}>CREATED AT</Typography>
            <Typography variant="body1">{constants.getFormattedDatetime(invoice.created_at)}</Typography>
          </Grid>
        </Grid>
      </Container>

      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
        <Tab label="Items" {...a11yProps(0)} />
        <Tab label="Payments" {...a11yProps(1)} />
      </Tabs>
      <CustomTabPanel value={value} index={0}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f3f4f6" }}>
            <TableRow>
              <TableCell width={40}></TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Paid Qty</TableCell>
              <TableCell>Unpaid Qty</TableCell>
              <TableCell>Paid Amount</TableCell>
              <TableCell>Unpaid Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoice.invoice_lineitems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Image src={item.product.thumbnail_url || "/dummy-product.jpeg"} alt="thumbnail" width={40} height={40} onClick={() => handleModal(item.product.thumbnail_url || "/dummy-product.jpeg")} style={{ border: "1px solid #d1d5db", borderRadius: "4px", cursor: "pointer" }} />
                </TableCell>
                <TableCell>{item.product.title}</TableCell>
                <TableCell>{constants.invoiceStatus[item.status]}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${item.unit_price.toFixed(2)}</TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>{item.quantity_received}</TableCell>
                <TableCell>{item.quantity - item.quantity_received}</TableCell>
                <TableCell>${item.price_received?.toFixed(2)}</TableCell>
                <TableCell>${(item.price - item.price_received)?.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f3f4f6" }}>
            <TableRow>
              <TableCell width={40}></TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Date</TableCell>
              {/* <TableCell>Actions</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {invoice.invoice_lineitems.map(item => item.invoice_payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  <Image src={item.product.thumbnail_url || "/dummy-product.jpeg"} alt="thumbnail" width={40} height={40} onClick={() => handleModal(item.product.thumbnail_url || "/dummy-product.jpeg")} style={{ border: "1px solid #d1d5db", borderRadius: "4px", cursor: "pointer" }} />
                </TableCell>
                <TableCell>{item.product.title}</TableCell>
                <TableCell>{payment.quantity}</TableCell>
                <TableCell>${payment.unit_price?.toFixed(2)}</TableCell>
                <TableCell>${payment.price.toFixed(2)}</TableCell>
                <TableCell>{constants.getFormattedDate(payment.created_at)}</TableCell>
                {/* <TableCell>
                  <Tooltip title="Delete" placement="top">
                    <IconButton color="error" onClick={() => handleTrash(payment.id)}>
                      <DeleteOutlined />
                    </IconButton>
                  </Tooltip>
                </TableCell> */}
              </TableRow>
            )))}
          </TableBody>
        </Table>
      </CustomTabPanel>
    </Auth>
  )
}