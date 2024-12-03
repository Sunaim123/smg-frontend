"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Typography, Card, CardContent, CardHeader, Table, TableHead, TableBody, TableRow, TableCell, Container, Box, Grid, Button, TextField, IconButton } from "@mui/material"

import Auth from "@/app/components/Auth"
import Alert from "@/app/components/Alert"
import SellerNavbar from "@/app/components/SellerNavbar"
import Loading from "@/app/components/Loading"
import * as constants from "@/app/utilities/constants"
import * as payoutApis from "@/app/apis/payout"

const Payout = ({ params }) => {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const [payout, setPayout] = useState(null)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const getPayout = async () => {
    try {
      const response = await payoutApis.getPayout(userState.token, params.id)
      if (!response.status) throw new Error(response.message)

      setPayout(response.payout)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (userState.warehouseUser) router.replace("/dashboard")
    if (params.id) getPayout()
  }, [])

  if (!payout)
    return (
      <Loading />
    )

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <SellerNavbar />

      <Container maxWidth="xl">
        <Box my={3}>
          <Typography variant="h4" fontWeight={700}>Payout #: {payout.id}</Typography>
        </Box>

        <Grid container spacing={1}>
          <Grid item xs={8}>
            <Box mb={1}>
              <Card variant="outlined">
                <CardHeader title="Payout Line Items" titleTypographyProps={{ variant: "h6" }} />
                <CardContent>
                  <Table size="small">
                    <TableHead sx={{ backgroundColor: "#f3f4f6" }}>
                      <TableRow>
                        <TableCell>Order #</TableCell>
                        <TableCell>Order Amount</TableCell>
                        <TableCell>Fees</TableCell>
                        <TableCell>Earned</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {payout.payout_lineitems.map((item) => {
                        return (
                          <TableRow key={item.id.toString()} onDoubleClick={() => router.replace(`/listings/order/${item.order_id}`)}>
                            <TableCell>{item.order_id}</TableCell>
                            <TableCell>${item.amount?.toFixed(2)}</TableCell>
                            <TableCell>${(item.fees + item.other_fees)?.toFixed(2)}</TableCell>
                            <TableCell>${item.total_amount?.toFixed(2)}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box mb={1}>
              <Card variant="outlined">
                <CardHeader title="Payout Summary" titleTypographyProps={{ variant: "h6" }} />
                <CardContent>
                  <Grid container spacing={1}>
                    <Grid item md={6}><Typography variant="body1" fontWeight={800}>DATETIME:</Typography></Grid>
                    <Grid item md={6}><Typography variant="body2">{constants.getFormattedDatetime(payout.created_at)}</Typography></Grid>

                    <Grid item md={6}><Typography variant="body1" fontWeight={800}>PAYOUT AMOUNT:</Typography></Grid>
                    <Grid item md={6}><Typography variant="body2">${payout.amount?.toFixed(2)}</Typography></Grid>

                    <Grid item md={6}><Typography variant="body1" fontWeight={800}>FEES:</Typography></Grid>
                    <Grid item md={6}><Typography variant="body2">${(payout.fees + payout.other_fees)?.toFixed(2)}</Typography></Grid>

                    <Grid item md={6}><Typography variant="body1" fontWeight={800}>TOTAL EARNING:</Typography></Grid>
                    <Grid item md={6}><Typography variant="body2">${payout.total_amount?.toFixed(2) || 0}</Typography></Grid>

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

export default Payout