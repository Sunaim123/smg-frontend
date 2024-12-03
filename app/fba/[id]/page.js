"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Box, Button, Container, Grid, IconButton, Typography, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import * as Icon from "@mui/icons-material"

import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Loading from "@/app/components/Loading"
import Navbar from "@/app/components/Navbar"
import * as fbaApis from "@/app/apis/fba"
import * as constants from "@/app/utilities/constants"

export default function Fba({ params }) {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const [fba, setFba] = useState(null)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleOpen = (pdf) => {
    window.open(pdf)
  }

  const handleStatus = async (payload) => {
    try {
      payload.id = fba.id
      const response = await fbaApis.updateFbaStatus(userState.token, payload)
      if (!response.status) throw new Error(response.message)

      getFba()
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const handleValidate = async () => {
    try {
      const payload = {
        invoice_id: fba.invoice_id
      }
      const response = await fbaApis.validateInvoice(userState.token, payload)
      if (!response.status) throw new Error(response.message)
      if (response.invoice_status !== "paid") throw new Error("Invoice haven't been cleared yet")

      getFba()
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const getFba = async () => {
    try {
      const response = await fbaApis.getFba(userState.token, params.id)
      if (!response.status) throw new Error(response.message)

      setFba(response.fba)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (userState.customer) router.replace("/products")

    if (params.id) getFba()
  }, [])

  if (!fba)
    return (
      <Loading />
    )

  if (fba.trash)
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

      <Container maxWidth="lg">
        <Box py={3}>
          <Grid container alignItems="center" mb={3}>
            <Grid item xs={6}>
              <Typography variant="h4" fontWeight={700}>FBA Shipment</Typography>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" justifyItems="center" alignItems="center" gap={2}>
                {(userState.warehouseUser && fba.payment_status === "paid") && <>
                  {!fba.received && !fba.shipped && <Button variant="contained" size="small" disableElevation onClick={() => router.push(`/fba/receive?id=${fba?.id}`)}>Received</Button>}
                  {fba.received && !fba.shipped && <Button variant="contained" size="small" disableElevation onClick={() => handleStatus({ shipped: true })}>Shipped</Button>}
                </>}
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" fontWeight={800}>PRODUCT DETAILS</Typography>
              <Typography variant="body1">{fba.notes}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" fontWeight={800}>QUANTITY</Typography>
              <Typography variant="body1">{fba.quantity}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" fontWeight={800}>TOTAL</Typography>
              <Typography variant="body1">{`$${fba.price.toFixed(2)}`}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" fontWeight={800}>STATUS</Typography>
              <Typography variant="body1">{constants.fbaStatus[fba.return_status]}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" fontWeight={800}>PAYMENT STATUS</Typography>
              <Typography variant="body1">{<Box display="flex" alignItems="center" gap={1}>{constants.paymentStatus[fba.payment_status]} {fba.payment_status !== "paid" && <IconButton color="primary" onClick={handleValidate}><Icon.RefreshOutlined /></IconButton>}</Box>}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" fontWeight={800}>CARRIER</Typography>
              <Typography variant="body1">{fba.carrier}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" fontWeight={800}>TRACKING NUMBER</Typography>
              <Typography variant="body1">{fba.tracking_number}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2" fontWeight={800}>WEIGHT</Typography>
              <Typography variant="body1">{fba.weight && `${fba.weight} ${fba.weight_unit}`}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2" fontWeight={800}>LENGTH</Typography>
              <Typography variant="body1">{fba.length && `${fba.length} ${fba.length_unit}`}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2" fontWeight={800}>WIDTH</Typography>
              <Typography variant="body1">{fba.width && `${fba.width} ${fba.width_unit}`}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2" fontWeight={800}>HEIGHT</Typography>
              <Typography variant="body1">{fba.height && `${fba.height} ${fba.height_unit}`}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2" fontWeight={800}>CREATED</Typography>
              <Typography variant="body1">{constants.getFormattedDatetime(fba.created)}</Typography>
            </Grid>
            {fba.created && !fba.received && !fba.shipped && <Grid item xs={9} />}
            {fba.received && <Grid item xs={3}>
              <Typography variant="body2" fontWeight={800}>RECEIVED</Typography>
              <Typography variant="body1">{constants.getFormattedDatetime(fba.received)}</Typography>
            </Grid>}
            {fba.received && !fba.shipped && <Grid item xs={6} />}
            {fba.shipped && <Grid item xs={3}>
              <Typography variant="body2" fontWeight={800}>SHIPPED</Typography>
              <Typography variant="body1">{constants.getFormattedDatetime(fba.shipped)}</Typography>
            </Grid>}
            {fba.shipped && <Grid item xs={3} />}
            {fba.barcode_url && <Grid item xs={3}>
              <Button startIcon={<Icon.OpenInNew />} variant="contained" size="small" disableElevation onClick={() => handleOpen(fba.barcode_url)}>Open Barcodes</Button>
            </Grid>}
            {fba.invoice_url && <Grid item xs={3}>
              {userState.companyUser && fba.payment_status !== "paid" && <Button startIcon={<Icon.OpenInNew />} variant="contained" size="small" disableElevation onClick={() => handleOpen(fba.invoice_url)}>Pay Invoice</Button>}
            </Grid>}
            <Grid item xs={3} />
            <Grid item xs={3}>
              {(fba.image1_url || fba.image2_url) && <Typography>Receiving Images</Typography>}
              <Box display="flex" flexDirection="row" gap={1}>
                {fba.image1_url && <img src={fba.image1_url} alt="image1_url" style={{ width: "40px", height: "40px", borderRadius: "8px" }} onClick={() => handleOpen(fba.image1_url)} />}
                {fba.image2_url && <img src={fba.image2_url} alt="image2_url" style={{ width: "40px", height: "40px", borderRadius: "8px" }} onClick={() => handleOpen(fba.image2_url)} />}
              </Box>
            </Grid>
          </Grid>

          {<>
            <Typography variant="h4" fontWeight={700} my={3}>FBA Items</Typography>

            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                  <TableCell sx={{ width: "22.5%" }}>Quantity</TableCell>
                  <TableCell sx={{ width: "22.5%" }}>Carrier</TableCell>
                  <TableCell sx={{ width: "22.5%" }}>Tracking #</TableCell>
                  <TableCell sx={{ width: "22.5%" }}>Label</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fba.fba_items.map((item) => {
                  return (
                    <TableRow>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.label_carrier}</TableCell>
                      <TableCell>{item.label_tracking_number}</TableCell>
                      <TableCell>
                        <Button startIcon={<Icon.OpenInNew />} variant="contained" size="small" disableElevation onClick={() => handleOpen(item.label_url)}>Open Label</Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </>}
        </Box>
      </Container>
    </Auth>
  )
}