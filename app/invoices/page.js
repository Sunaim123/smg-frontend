"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Autocomplete, Box, Grid, Button, Chip, Container, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip, Typography, FormControl, InputLabel, Select, OutlinedInput, MenuItem } from "@mui/material"
import AssignmentOutlined from "@mui/icons-material/AssignmentOutlined"
import EditOutlined from "@mui/icons-material/EditOutlined"
import DeleteOutlined from "@mui/icons-material/DeleteOutlined"
import RestoreFromTrashOutlined from "@mui/icons-material/RestoreFromTrashOutlined"
import moment from "moment"

import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Navbar from "@/app/components/Navbar"
import DateTimePicker from "@/app/components/DateTimePicker"
import Pagination from "@/app/components/Pagination"

import * as companyApis from "@/app/apis/company"
import * as invoiceApis from "@/app/apis/invoice"
import * as constants from "@/app/utilities/constants"

export default function Invoices() {
  const userState = useSelector(state => state.user)
  const router = useRouter()

  const [today, setToday] = useState(false)
  const [filters, setFilters] = useState({})
  const [trash, setTrash] = useState(false)
  const [companies, setCompanies] = useState([])
  const [companyIds, setCompanyIds] = useState([])
  const [count, setCount] = useState(0)
  const [invoices, setInvoices] = useState([])
  const [active, setActive] = useState(1)
  const limit = 25
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleCompanyChange = (event) => {
    const {
      target: { value },
    } = event

    setCompanyIds(
      typeof value === "string" ? value.split(',').map(Number) : value
    )
  }

  const handleFilter = () => {
    setFilters("")
    getInvoices()
  }

  const handleLink = (link) => {
    router.push(link)
  }

  const handleTrash = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to delete?")) return

      const response = await invoiceApis.trashInvoice(userState.token, { id: id, trash: true })
      if (!response.status) throw new Error(response.message)

      getInvoices()
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const handleRestore = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to restore this return?")) return

      const response = await invoiceApis.trashInvoice(userState.token, { id: id, trash: false })
      if (!response.status) throw new Error(response.message)

      getInvoices()
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const getComapnies = async () => {
    try {
      const response = await companyApis.getCompanies(userState.token, "")
      if (!response.status) throw new Error(response.message)

      setCompanies(response.companies)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const getInvoices = async () => {
    try {
      const params = {}
      if (companyIds && companyIds.length > 0) params.company_ids = companyIds.join(",")
      if (today) {
        params.from_date = moment().startOf("day").format("YYYY-MM-DD HH:mm")
        params.to_date = moment().endOf("day").format("YYYY-MM-DD HH:mm")
      }
      if (filters.from_date) params.from_date = filters.from_date
      if (filters.to_date) params.to_date = filters.to_date
      params.trash = trash

      const query = new URLSearchParams(params)
      const response = await invoiceApis.getInvoices(userState.token, query.toString())
      if (!response.status) throw new Error(response.message)

      setCount(response.count)
      setInvoices(response.invoices)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (userState.warehouseUser) getComapnies()
  }, [])

  useEffect(() => {
    getInvoices()
  }, [filters, trash, today, companyIds])

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Navbar />

      <Container maxWidth="xl">
        <Grid container justifyContent="space-between" alignItems="center" py={3}>
          <Grid item xs={4}>
            <Typography variant="h4" fontWeight={700}>Invoices</Typography>
          </Grid>
          <Grid item xs={8} container justifyContent="flex-end" alignItems="center" gap={1}>
            {userState.warehouseUser && <Chip variant={trash ? "filled" : "outlined"} label="Trash" color="error" size="medium" onClick={() => setTrash(!trash)}></Chip>}
            <Chip variant={today ? "filled" : "outlined"} label="Today" color="primary" size="medium" onClick={() => setToday(!today)}></Chip>
            <Grid item xs={2} sx={{ width: 200 }}>
              <DateTimePicker
                label="From"
                value={filters.from_date ? moment(filters.from_date) : null}
                onChange={(value) => setFilters({ ...filters, from_date: value ? value.toISOString() : null })}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
            <Grid item xs={2} sx={{ width: 200 }}>
              <DateTimePicker
                label="To"
                value={filters.to_date ? moment(filters.to_date) : null}
                onChange={(value) => setFilters({ ...filters, to_date: value ? value.toISOString() : null })}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>

            <Grid item xs={2}>
              {userState.warehouseUser &&
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
                </FormControl>}
            </Grid>

            <Button color="error" onClick={handleFilter}>Clear</Button>
            {userState.warehouseUser && <Button onClick={() => handleLink("/invoice")}>New</Button>}
          </Grid>
        </Grid>
      </Container>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
            <TableCell>Invoice #</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((invoice) => {
            const isAwaitingPayment = invoice.status === "awaiting payment"
            const isTrash = invoice.trash

            return (
              <TableRow key={invoice.id.toString()}>
                <TableCell>INV{invoice.id}</TableCell>
                <TableCell>{invoice.quantity}</TableCell>
                <TableCell>${invoice.price?.toFixed(2)}</TableCell>
                <TableCell>{invoice.company.name}</TableCell>
                <TableCell>{constants.invoiceStatus[invoice.status]}</TableCell>
                <TableCell>{constants.getFormattedDatetime(invoice.created_at)}</TableCell>
                <TableCell align="right">
                  {userState.warehouseUser && !isTrash && isAwaitingPayment && <Tooltip title="Edit" placement="top"><IconButton color="primary" onClick={() => handleLink(`/invoice?id=${invoice.id}`)}><EditOutlined /></IconButton></Tooltip>}
                  {!invoice.trash && <Tooltip title="View" placement="top"><IconButton color="primary" onClick={() => handleLink(`/invoice/${invoice.id}`)}><AssignmentOutlined /></IconButton></Tooltip>}
                  {userState.warehouseUser && (
                    !isTrash ? (
                      <Tooltip title="Delete" placement="top">
                        <IconButton color="error" onClick={() => handleTrash(invoice.id)}>
                          <DeleteOutlined />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Restore" placement="top">
                        <IconButton color="success" onClick={() => handleRestore(invoice.id)}>
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
            <Typography display="flex" gap={1}>Showing <Typography fontWeight="700">{invoices.length}</Typography> out of <Typography fontWeight="700">{count}</Typography> results</Typography>
          </Grid>
        </Grid>
      </Container>
    </Auth>
  )
}