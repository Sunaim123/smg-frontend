"use client"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Box, Grid, Container, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography, TextField, Button, MenuItem, FormControl, InputLabel, Select, OutlinedInput, Chip, Tooltip } from "@mui/material"
import AssignmentOutlined from "@mui/icons-material/AssignmentOutlined"
import DeleteOutlined from "@mui/icons-material/DeleteOutlined"
import RestoreFromTrashOutlined from "@mui/icons-material/RestoreFromTrashOutlined"

import moment from "moment"
import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Navbar from "@/app/components/Navbar"
import DateTimePicker from "@/app/components/DateTimePicker"
import * as constants from "@/app/utilities/constants"
import * as orderApis from "@/app/apis/order"
import * as companyApis from "@/app/apis/company"
import Pagination from "@/app/components/Pagination"

export default function Orders() {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const [orders, setOrders] = useState([])
  const [count, setCount] = useState(0)
  const [filters, setFilters] = useState({
    from_date: searchParams.get("from"),
    to_date: searchParams.get("to")
  })
  const [trash, setTrash] = useState(JSON.parse(searchParams.get("trash")) || false)
  const [status, setStatus] = useState(typeof searchParams.get("status") === "string" ? searchParams.get("status").split(",") : [])
  const [paymentStatus, setPaymentStatus] = useState(typeof searchParams.get("payment_status") === "string" ? searchParams.get("payment_status").split(",") : [])
  const [companyIds, setCompanyIds] = useState(typeof searchParams.get("company_id") === "string" ? searchParams.get("company_id").split(",").map(Number) : [])
  const [companies, setCompanies] = useState([])
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

    const selectedStatus = typeof value === "string" ? value.split(",") : value
    setStatus(selectedStatus)

    const params = new URLSearchParams(searchParams)
    params.set('status', selectedStatus.join(','))
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleCompanyChange = (event) => {
    const {
      target: { value },
    } = event

    const selectedId = typeof value === "string" ? value.split(',').map(Number) : value
    setCompanyIds(selectedId)

    const params = new URLSearchParams(searchParams)
    params.set('company_id', selectedId.join(','))
    router.push(`${pathname}?${params.toString()}`)
  }

  const handlePaymentChange = (event) => {
    const {
      target: { value },
    } = event

    const selectedStatus = typeof value === "string" ? value.split(",") : value
    setPaymentStatus(selectedStatus)

    const params = new URLSearchParams(searchParams)
    params.set('payment_status', selectedStatus.join(','))
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleTrashSearch = () => {
    setTrash(!trash)

    const params = new URLSearchParams(searchParams)
    params.set('trash', !trash)
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleFromDate = (value) => {
    setFilters({ ...filters, from_date: value ? value.toISOString() : null })

    const dateParams = new URLSearchParams(searchParams)
    dateParams.set('from', value.toISOString())
    router.push(`${pathname}?${dateParams.toString()}`)
  }

  const handleToDate = (value) => {
    setFilters({ ...filters, to_date: value ? value.toISOString() : null })

    const dateParams = new URLSearchParams(searchParams)
    dateParams.set('to', value.toISOString())
    router.push(`${pathname}?${dateParams.toString()}`)
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

  const getCompanies = async () => {
    try {
      const response = await companyApis.getCompanies(userState.token, "")
      if (!response.status) throw new Error(response.message)

      setCompanies(response.companies)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
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
      if (companyIds && companyIds.length > 0) params.company_ids = companyIds.join(",")
      params.trash = trash

      getOrders(params)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const handleClear = async () => {
    setFilters("")
    setStatus([])
    setPaymentStatus([])
    setCompanyIds([])
    setTrash(false)
    const params = { trash: trash }
    getOrders(params)
    router.push(pathname)
  }

  const orderStatus = [
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
    const params = { trash: trash }
    if (searchParams.has("status")) params.status = [searchParams.get("status")]
    if (searchParams.has("payment_status")) params.payment_status = [searchParams.get("payment_status")]
    if (searchParams.has("from")) params.from_date = searchParams.get("from")
    if (searchParams.has("to")) params.to_date = searchParams.get("to")

    getOrders(params)
    getCompanies()
  }, [active, trash])

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Navbar />

      <Container maxWidth="xl">
        <Box display="flex" justifyContent="space-between" alignItems="center" my={3}>
          <Grid item xs={2}>
            <Typography variant="h4" fontWeight={700}>Orders</Typography>
          </Grid>
          <Grid item container xs={10} display="flex" justifyContent="flex-end" alignItems="center" gap={1}>
            {userState.companyUser && <Chip variant={trash ? "filled" : "outlined"} label="Trash" color="error" size="medium" onClick={handleTrashSearch}></Chip>}

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

            {userState.warehouseUser &&
              <Grid item xs={1.5}>
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-multiple-chip-label">Companies</InputLabel>
                  <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={companyIds}
                    size="small"
                    onChange={handleCompanyChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Companies" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((id) => {
                          const company = companies.find((c) => c.id === id)
                          return <Chip key={id} label={company?.name} />
                        })}
                      </Box>
                    )}
                  >
                    {companies.map((company) => (
                      <MenuItem key={company.id} value={company.id}>
                        {company.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>}

            <Grid item xs={1.5}>
              <DateTimePicker
                label="From"
                value={filters.from_date ? moment(filters.from_date) : null}
                onChange={(value) => handleFromDate(value)}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
            <Grid item xs={1.5}>
              <DateTimePicker
                label="To"
                value={filters.to_date ? moment(filters.to_date) : null}
                onChange={(value) => handleToDate(value)}
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
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => {
            return (
              <TableRow key={order.id.toString()}>
                <TableCell>{order.number}</TableCell>
                <TableCell>{constants.getFormattedDatetime(order.created_at)}</TableCell>
                <TableCell>{constants.orderStatus[order.status]}</TableCell>
                <TableCell>{constants.paymentStatus[order.payment_status]}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" size="small" onClick={() => router.push(`order/${order.id}`)}><AssignmentOutlined /></IconButton>
                  {userState.warehouseUser && (
                    !order.trash ? (
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
                  )}
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