"use client"
import { useRouter, useParams, useSearchParams, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Box, Grid, Container, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography, TextField, Button, MenuItem, FormControl, InputLabel, Select, OutlinedInput, Chip, Tooltip, Tabs, Tab } from "@mui/material"
import AssignmentOutlined from "@mui/icons-material/AssignmentOutlined"
import DeleteOutlined from "@mui/icons-material/DeleteOutlined"
import RestoreFromTrashOutlined from "@mui/icons-material/RestoreFromTrashOutlined"

import moment from "moment"
import Alert from "@/app/components/Alert"
import DatePicker from "@/app/components/CustomDatePicker"
import * as constants from "@/utilities/constants"
import * as orderApis from "@/apis/order"
import Pagination from "@/app/components/Pagination"
import Layout from "@/app/components/Layout"
import Auth from "@/app/components/Auth"

export default function Orders() {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const pathname = usePathname()
  const [orders, setOrders] = useState([])
  const [count, setCount] = useState(0)
  const [filters, setFilters] = useState({
    from_date: searchParams.get("f") || "",
    to_date: searchParams.get("e") || ""
  })
  const [trash, setTrash] = useState(false)
  const [value, setValue] = useState(decodeURIComponent(params.status))
  const [active, setActive] = useState(1)
  const limit = 25
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleDate = (type, date) => {
    const params = new URLSearchParams(searchParams)

    switch (type) {
      case "from":
        setFilters({ ...filters, from_date: date.toISOString() })
        params.set('f', date.toISOString())
        router.push(`${pathname}?${params.toString()}`)
        break
      case "to":
        setFilters({ ...filters, to_date: date.toISOString() })
        params.set('e', date.toISOString())
        router.push(`${pathname}?${params.toString()}`)
        break
    }
  }

  const getOrders = async (orderParams) => {
    try {
      const query = new URLSearchParams({ ...orderParams, limit: limit, offset: (active - 1) * limit, type: "customer" })
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
      const orderParams = {}
      if (filters.from_date) orderParams.from_date = filters.from_date
      if (filters.to_date) orderParams.to_date = filters.to_date
      if (params) orderParams.status = [decodeURIComponent(params.status.toLowerCase())]
      if (params.status === "awaiting-payment") {
        orderParams.status = "received"
        orderParams.payment_status = "unpaid"
      }
      if (params.status === "awaiting-shipment") {
        orderParams.status = "received"
        orderParams.payment_status = "paid"
      }
      orderParams.trash = trash
      orderParams.type = "customer"

      getOrders(orderParams)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const handleClear = async () => {
    setFilters({
      from_date: "",
      to_date: ""
    })
    setTrash(false)
    router.push(pathname)
    const orderParams = { trash: trash, status: [decodeURIComponent(params.status.toLowerCase())] }
    getOrders(orderParams)
  }

  const handleSearch = () => {
    const orderParams = {
      status: [decodeURIComponent(params.status.toLowerCase())],
      trash: trash,
      from_date: filters.from_date,
      to_date: filters.to_date,
      type: "customer",
    }
    if (params.status === "awaiting-payment") {
      orderParams.status = "received"
      orderParams.payment_status = "unpaid"
    }
    if (params.status === "awaiting-shipment") {
      orderParams.status = "received"
      orderParams.payment_status = "paid"
    }

    getOrders(orderParams)
  }

  useEffect(() => {
    if (userState.user.type === "pending") router.replace("/register/onboard")
    handleSearch()
  }, [active, trash])

  return (
    <Auth>
      <Layout topbar={true} footer={true}>
        <Alert toast={toast} setToast={setToast} />
        <Container maxWidth="xl">
          <Box display="flex" justifyContent="space-between" alignItems="center" my={3}>
            <Grid item xs={2}>
              <Typography variant="h4" fontWeight={700}>Orders</Typography>
            </Grid>
            <Grid item container xs={11} display="flex" justifyContent="flex-end" alignItems="center" gap={1}>
              {userState.companyUser && <Chip variant={trash ? "filled" : "outlined"} label="Trash" color="error" size="medium" onClick={() => setTrash(!trash)}></Chip>}

              <Grid item>
                <DatePicker
                  label={filters.from_date ? moment(filters.from_date).format("MM/DD/YYYY") : "From Date"}
                  value={filters.from_date ? moment(filters.from_date) : null}
                  onChange={(value) => handleDate("from", value)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
              <Grid item>
                <DatePicker
                  label={filters.to_date ? moment(filters.to_date).format("MM/DD/YYYY") : "To Date"}
                  value={filters.to_date ? moment(filters.to_date) : null}
                  onChange={(value) => handleDate("to", value)}
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

          <Tabs
            value={value}
            onChange={(e, newValue) => {
              const params = new URLSearchParams(searchParams)
              if (filters.from_date) params.set('f', moment(filters.from_date))
              if (filters.to_date) params.set('e', moment(filters.to_date))

              router.push(`/cp/d/orders/${newValue}?${params.toString()}`)
              setValue(newValue)
            }}
            aria-label="basic tabs example">
            <Tab label="Awaiting Payment" value="awaiting-payment" />
            <Tab label="Awaiting Shipment" value="awaiting-shipment" />
            <Tab label="Shipped" value="shipped" />
            <Tab label="Cancelled" value="cancelled" />
            <Tab label="Refunded" value="refunded" />
          </Tabs>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order #</TableCell>
                <TableCell>Datetime</TableCell>
                <TableCell>Order Status</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => {
                return (
                  <TableRow key={order.id.toString()}>
                    <TableCell>O.{order.id}</TableCell>
                    <TableCell>{constants.getFormattedDatetime(order.created_at)}</TableCell>
                    <TableCell>{constants.orderStatus[order.order_status]}</TableCell>
                    <TableCell>{constants.paymentStatus[order.payment_status]}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" size="small" onClick={() => router.push(`/cp/d/order/${order.id}`)}><AssignmentOutlined /></IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

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
      </Layout>
    </Auth>
  )
}