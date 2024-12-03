"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Box, Grid, Container, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography, TextField, Button, MenuItem, FormControl, InputLabel, Select, OutlinedInput, Chip, Tooltip } from "@mui/material"
import AssignmentOutlined from "@mui/icons-material/AssignmentOutlined"
import DeleteOutlined from "@mui/icons-material/DeleteOutlined"
import RestoreFromTrashOutlined from "@mui/icons-material/RestoreFromTrashOutlined"

import moment from "moment"
import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import SellerNavbar from "@/app/components/SellerNavbar"
import DateTimePicker from "@/app/components/DateTimePicker"
import * as constants from "@/app/utilities/constants"
import * as orderApis from "@/app/apis/order"
import * as companyApis from "@/app/apis/company"
import Pagination from "@/app/components/Pagination"

export default function Orders() {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orders, setOrders] = useState([])
  const [count, setCount] = useState(0)
  const [filters, setFilters] = useState("")
  const [trash, setTrash] = useState(false)
  const [status, setStatus] = useState([searchParams.get("status")] || [])
  const [paymentStatus, setPaymentStatus] = useState([])
  const [active, setActive] = useState(1)
  const limit = 25
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleChange = (event) => {
    const {
      target: { value },
    } = event
    setStatus(
      typeof value === "string" ? value.split(",") : value,
    )
  }

  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to delete?")) return

      const response = await orderApis.trashOrder(userState.token, { id: id, trash: true })
      if (!response.status) throw new Error(response.message)

      setOrders(orders.filter(order => order.id !== id))
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const handleRestore = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to restore this order?")) return

      const response = await orderApis.trashOrder(userState.token, { id: id, trash: false })
      if (!response.status) throw new Error(response.message)

      const params = { status: ["Received"], trash: trash }
      getOrders(params)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const handlePaymentChange = (event) => {
    const {
      target: { value },
    } = event
    setPaymentStatus(
      typeof value === "string" ? value.split(",") : value,
    )
  }

  const getOrders = async (params) => {
    try {
      const query = new URLSearchParams({ ...params, limit: limit, offset: (active - 1) * limit })
      const response = await orderApis.getOrders(userState.token, query.toString())
      if (!response.status) throw new Error(response.message)

      setCount(response.count)
      setOrders(response.orders)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const handleFilter = async () => {
    try {
      const params = {}
      if (filters.from_date) params.from_date = filters.from_date
      if (filters.to_date) params.to_date = filters.to_date
      if (status && status.length > 0) params.status = status.join(",")
      if (paymentStatus && paymentStatus.length > 0) params.payment_status = paymentStatus.join(",")
      params.trash = trash
      params.for = "listingOrders"

      getOrders(params)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const handleClear = async () => {
    setFilters("")
    setStatus([])
    setPaymentStatus([])
    setTrash(false)
    const params = { trash: trash, for: "listingOrders" }
    getOrders(params)
  }

  const orderStatus = [
    "Awaiting Payment",
    "Received",
    "Cancelled",
    "Shipped",
  ]

  const payment = [
    "Paid",
    "Unpaid",
    "Refunded",
  ]

  useEffect(() => {
    const params = { status: [searchParams.get("status")], trash: trash, for: "listingOrders" }
    getOrders(params)
  }, [active, trash])

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <SellerNavbar />

      <Container maxWidth="xl">
        <Box display="flex" justifyContent="space-between" alignItems="center" my={3}>
          <Grid item xs={2}>
            <Typography variant="h4" fontWeight={700}>My Orders</Typography>
          </Grid>
          <Grid item container xs={10} display="flex" justifyContent="flex-end" alignItems="center" gap={1}>
            <Chip variant={trash ? "filled" : "outlined"} label="Trash" color="error" size="medium" onClick={() => setTrash(!trash)}></Chip>

            <Grid item xs={1.5}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-multiple-chip-label">Order Status</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={status}
                  size="small"
                  onChange={handleChange}
                  input={<OutlinedInput id="select-multiple-chip" label="Order Status" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {orderStatus.map((name) => (
                    <MenuItem
                      key={name}
                      value={name}
                    >
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={1.5}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-multiple-chip-label">Payment Status</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={paymentStatus}
                  size="small"
                  onChange={handlePaymentChange}
                  input={<OutlinedInput id="select-multiple-chip" label="Payment Status" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {payment.map((name) => (
                    <MenuItem
                      key={name}
                      value={name}
                    >
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={1.5}>
              <DateTimePicker
                label="From"
                value={filters.from_date ? moment(filters.from_date) : null}
                onChange={(value) => setFilters({ ...filters, from_date: value ? value.toISOString() : null })}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
            <Grid item xs={1.5}>
              <DateTimePicker
                label="To"
                value={filters.to_date ? moment(filters.to_date) : null}
                onChange={(value) => setFilters({ ...filters, to_date: value ? value.toISOString() : null })}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
            <Button disableElevation variant="contained" onClick={handleFilter}>
              Filter
            </Button>
            <Button disableElevation variant="contained" color="error" onClick={handleClear}>
              Clear
            </Button>
          </Grid>
        </Box>
      </Container>

      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
            <TableCell>Order #</TableCell>
            <TableCell>Datetime</TableCell>
            <TableCell>Order Status</TableCell>
            <TableCell>Payment Status</TableCell>
            <TableCell>Total</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => {
            return (
              <TableRow key={order.id.toString()}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{constants.getFormattedDatetime(order.created_at)}</TableCell>
                <TableCell>{constants.orderStatus[order.order_status]}</TableCell>
                <TableCell>{constants.paymentStatus[order.payment_status]}</TableCell>
                <TableCell>${(order.price + order.shipping_price)?.toFixed(2)}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" size="small" onClick={() => router.push(`/seller/listings/order/${order.id}`)}><AssignmentOutlined /></IconButton>
                  {!order.trash ? (
                      <Tooltip title="Delete" placement="top">
                        <IconButton color="error" onClick={() => handleDelete(order.id)}>
                          <DeleteOutlined />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Restore" placement="top">
                        <IconButton color="success" onClick={() => handleRestore(order.id)}>
                          <RestoreFromTrashOutlined />
                        </IconButton>
                      </Tooltip>
                    )
                  }
                </TableCell>
              </TableRow>
            )
          })}
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
            <Typography display="flex" gap={1}>Showing <Typography fontWeight="700">{orders.length}</Typography> out of <Typography fontWeight="700">{count}</Typography> results</Typography>
          </Grid>
        </Grid>
      </Container>
    </Auth>
  )
}