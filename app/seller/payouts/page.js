"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Grid, Container, IconButton, Typography, Table, TableHead, TableBody, TableCell, TableRow, Box } from "@mui/material"

import AssignmentOutlined from "@mui/icons-material/AssignmentOutlined"
import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import SellerNavbar from "@/app/components/SellerNavbar"
import Pagination from "@/app/components/Pagination"
import * as payoutApis from "@/app/apis/payout"

export default function Listings() {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const [payouts, setPayouts] = useState([])
  const [total, setTotal] = useState(0)
  const [count, setCount] = useState(0)
  const [active, setActive] = useState(1)
  const limit = 25
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const getPayouts = async () => {
    try {
      const params = {}
      params.offset = (active - 1) * limit
      params.limit = limit

      const query = new URLSearchParams(params)
      const response = await payoutApis.getPayouts(userState.token, query.toString())
      if (!response.status) throw new Error(response.message)

      setCount(response.count)
      setPayouts(response.payouts)
      setTotal(response.earnings)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    getPayouts()
  }, [active])

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <SellerNavbar />

      <Container maxWidth="xl">
        <Box display="flex" justifyContent="space-between" alignItems="center" my={3}>
          <Typography variant="h4" fontWeight={700}>Payouts</Typography>
          <Typography variant="h6">Total Earnings: ${total.toFixed(2)}</Typography>
        </Box>
      </Container>

      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
            <TableCell>Payout #</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Fees</TableCell>
            <TableCell>Earned</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payouts.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>${item.amount?.toFixed(2)}</TableCell>
              <TableCell>${(item.fees + item.other_fees)?.toFixed(2)}</TableCell>
              <TableCell>${item.total_amount?.toFixed(2)}</TableCell>
              <TableCell align="center">
                <IconButton color="primary" size="small" onClick={() => router.push(`payout/${item.id}`)}><AssignmentOutlined /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Container maxWidth="xl">
        <Grid display="flex" justifyContent="space-between" py={3}>
          <Grid item xs={10}>
            <Pagination
              currentPage={active}
              totalCount={count}
              pageSize={limit}
              siblingCount={3}
              onPageChange={page => setActive(page)}
            />
          </Grid>
          <Grid item xs={2}>
            <Typography display="flex" gap={1}>Showing <Typography fontWeight="700">{payouts.length}</Typography> out of <Typography fontWeight="700">{count}</Typography> results</Typography>
          </Grid>
        </Grid>
      </Container>
    </Auth>
  )
}