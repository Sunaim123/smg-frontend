"use client"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Autocomplete, Box, Grid, Button, Chip, Container, FormControl, IconButton, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip, Typography, OutlinedInput } from "@mui/material"
import AssignmentOutlined from "@mui/icons-material/AssignmentOutlined"
import EditOutlined from "@mui/icons-material/EditOutlined"
import DeleteOutlined from "@mui/icons-material/DeleteOutlined"
import RestoreFromTrashOutlined from "@mui/icons-material/RestoreFromTrashOutlined"
import moment from "moment"

import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Modal from "@/app/components/Modal"
import Navbar from "@/app/components/Navbar"
import Pagination from "@/app/components/Pagination"

import * as companyApis from "@/app/apis/company"
import * as returnApis from "@/app/apis/return"
import * as constants from "@/app/utilities/constants"

export default function Returns() {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const [open, setOpen] = useState(false)
  const [today, setToday] = useState(JSON.parse(searchParams.get("today")) || false)
  const [trash, setTrash] = useState(searchParams.get("trash") || false)
  const [filters, setFilters] = useState("")
  const [companyIds, setCompanyIds] = useState(typeof searchParams.get("company_id") === "string" ? searchParams.get("company_id").split(",").map(Number) : [])
  const [companies, setCompanies] = useState([])
  const [count, setCount] = useState(0)
  const [returns, setReturns] = useState([])
  const [status, setStatus] = useState(typeof searchParams.get("status") === "string" ? searchParams.get("status").split(",") : [])
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

  const handleTrashSearch = () => {
    setTrash(!trash)

    const params = new URLSearchParams(searchParams)
    params.set('trash', !trash)
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleTodaySearch = () => {
    setToday(!today)

    const params = new URLSearchParams(searchParams)
    params.set('today', !today)
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleClear = () => {
    setFilters("")
    setStatus([])
    setCompanyIds([])
    setToday(false)
    setTrash(false)
    getReturns()
    router.push(pathname)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleLink = (link) => {
    router.push(link)
  }

  const handleTrash = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to delete?")) return

      const response = await returnApis.trashReturn(userState.token, { id: id, trash: true })
      if (!response.status) throw new Error(response.message)

      getReturns()
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()

    getReturns()
    setOpen(false)
  }

  const handleRestore = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to restore this return?")) return

      const response = await returnApis.trashReturn(userState.token, { id: id, trash: false })
      if (!response.status) throw new Error(response.message)

      getReturns()
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

  const getReturns = async () => {
    try {
      const params = {}

      if (filters.from_date) params.from_date = filters.from_date
      if (filters.to_date) params.to_date = filters.to_date
      if (filters.rma_number) params.rma_number = filters.rma_number
      if (filters.tracking_number) params.tracking_number = filters.tracking_number
      if (today) {
        params.from_date = moment().startOf("day").format("YYYY-MM-DD HH:mm")
        params.to_date = moment().endOf("day").format("YYYY-MM-DD HH:mm")
      }
      if (status && status.length > 0) params.status = status.join(",")
      if (companyIds && companyIds.length > 0) params.company_ids = companyIds.join(",")
      params.trash = trash
      params.offset = (active - 1) * limit
      params.limit = limit

      const query = new URLSearchParams(params)
      const response = await returnApis.getReturns(userState.token, query.toString())
      if (!response.status) throw new Error(response.message)

      setCount(response.count)
      setReturns(response.returns)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (userState.warehouseUser) getCompanies()
  }, [])

  useEffect(() => {
    getReturns()
  }, [status, filters.company_id, today, trash, active, companyIds])
  
  useEffect(() => {
    if (userState.customer) router.replace("/products")
    if (userState.warehouseUser) getCompanies()
  }, [])

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Modal open={open} setOpen={setOpen} filters={filters} setFilters={setFilters} onSubmit={handleSearch} />
      <Navbar />

      <Container maxWidth="xl">
        <Grid container justifyContent="space-between" alignItems="center" py={3}>
          <Grid item xs={4}>
            <Typography variant="h4" fontWeight={700}>Returns</Typography>
          </Grid>
          <Grid item xs={8} container justifyContent="flex-end" alignItems="center" gap={1}>
            {userState.warehouseUser && <Chip variant={trash ? "filled" : "outlined"} label="Trash" color="error" size="medium" onClick={handleTrashSearch}></Chip>}
            <Chip variant={today ? "filled" : "outlined"} label="Today" color="primary" size="medium" onClick={handleTodaySearch}></Chip>

            <Grid item xs={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-multiple-chip-label">Return Status</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={status}
                  size="small"
                  onChange={handleChange}
                  input={<OutlinedInput id="select-multiple-chip" label="Return Status" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="Received">Received</MenuItem>
                  <MenuItem value="Ship Requested">Ship Requested</MenuItem>
                  <MenuItem value="Shipped">Shipped</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {userState.warehouseUser &&
              <Grid item xs={2}>
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

            <Button onClick={handleOpen}>Filters</Button>
            <Button color="error" onClick={handleClear}>Clear</Button>
            {!userState.companyUser && <Button onClick={() => handleLink("/return")}>New</Button>}
          </Grid>
        </Grid>
      </Container>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
            <TableCell>RMA #</TableCell>
            <TableCell>Qty</TableCell>
            <TableCell>Qty Shipped</TableCell>
            <TableCell>Carrier</TableCell>
            <TableCell>Tracking #</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Company</TableCell>
            {userState.warehouseUser && <TableCell>User</TableCell>}
            <TableCell>Recieved At</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {returns.map((_return) => {
            return (
              <TableRow key={_return.id.toString()}>
                <TableCell>{_return.rma_number}</TableCell>
                <TableCell>{_return.quantity || 1}</TableCell>
                <TableCell>{_return.quantity_shipped}</TableCell>
                <TableCell>{_return.carrier}</TableCell>
                <TableCell>{_return.tracking_number}</TableCell>
                <TableCell>{constants.returnStatus[_return.return_status]}</TableCell>
                <TableCell sx={{ color: constants.getCompanyStatus(_return.company.payment_status, _return.company.end_date) }}>
                  {_return.company.name}
                </TableCell>
                {userState.warehouseUser && <TableCell>{_return.user.name}</TableCell>}
                <TableCell>{constants.getFormattedDatetime(_return.received)}</TableCell>
                <TableCell align="center">
                  {/* {userState.warehouseUser && _return.return_status === "ship requested" && <Tooltip title="Mark as Shipped" placement="top"><IconButton color="primary" onClick={() => handleLink(`status?id=${_return.id}&title=Mark as Shipped`)}><MoveToInbox /></IconButton></Tooltip>} */}
                  <Tooltip title="View" placement="top"><IconButton color="primary" onClick={() => handleLink(`/return/${_return.id}`)}><AssignmentOutlined /></IconButton></Tooltip>
                  {userState.warehouseUser && <Tooltip title="Edit" placement="top"><IconButton color="primary" onClick={() => handleLink(`/return?id=${_return.id}`)}><EditOutlined /></IconButton></Tooltip>}
                  {userState.warehouseUser && (
                    !_return.trash ? (
                      <Tooltip title="Delete" placement="top">
                        <IconButton color="error" onClick={() => handleTrash(_return.id)}>
                          <DeleteOutlined />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Restore" placement="top">
                        <IconButton color="success" onClick={() => handleRestore(_return.id)}>
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
            <Typography display="flex" gap={1}>Showing <Typography fontWeight="700">{returns.length}</Typography> out of <Typography fontWeight="700">{count}</Typography> results</Typography>
          </Grid>
        </Grid>
      </Container>
    </Auth>
  )
}