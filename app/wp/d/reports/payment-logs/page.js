"use client"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { Container, Box, Grid, FormControl, Autocomplete, Button, Typography, TextField, Table, TableHead, TableBody, TableCell, TableRow, Menu, MenuItem, InputLabel, Select, OutlinedInput, Chip } from "@mui/material"

import moment from "moment"
import DatePicker from "@/app/components/CustomDatePicker"
import Alert from "@/app/components/Alert"
import * as companyApis from "@/apis/company"
import * as paymentLogApi from "@/apis/payment-log"
import * as constants from "@/utilities/constants"
import Pagination from "@/app/components/Pagination"

export default function paymentLogs() {
  const router = useRouter()
  const userState = useSelector(state => state.user)
  const [reports, setReports] = useState([])
  const [filters, setFilters] = useState("")
  const [type, setType] = useState([])
  const [companies, setCompanies] = useState([])
  const [companyIds, setCompanyIds] = useState([])
  const [count, setCount] = useState(0)
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
    } = event;
    setType(
      typeof value === 'string' ? value.split(',') : value,
    )
  }

  const handleCompanyChange = (event) => {
    const {
      target: { value },
    } = event

    setCompanyIds(
      typeof value === "string" ? value.split(',').map(Number) : value
    )
  }

  const getReportCount = async (params) => {
    try {
      const query = new URLSearchParams({ ...params, limit: limit, offset: (active - 1) * limit })
      const response = await paymentLogApi.getPaymentLogs(userState.token, query.toString())
      if (!response.status) throw new Error(response.message)

      setCount(response.count)
      setReports(response.paymentLogs)

    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const getCompanies = async () => {
    try {
      const response = await companyApis.getCompanies(userState.token, "")
      if (!response.status) throw new Error(response.message)

      setCompanies(response.companies)
      response
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const handleFilter = async () => {
    try {
      const params = {}
      if (filters.from_date) params.from_date = filters.from_date
      if (filters.to_date) params.to_date = filters.to_date
      if (companyIds && companyIds.length > 0) params.company_ids = companyIds.join(",")
      if (type && type.length > 0) params.type = type.join(',')

      getReportCount(params)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const handleClear = async () => {
    setFilters("")
    setType([])
    setCompanyIds([])
    getReportCount()
  }

  const logs = [
    "Refund",
    "Order",
    "Fba Shipment",
    "Return Service",
    "Subscription"
  ]

  useEffect(() => {
    if (!userState.permissions["READ_REPORTS"]) router.replace("/wp/d")

    handleFilter()
    getCompanies()
  }, [active, companyIds])

  return (
    <>
      <Alert toast={toast} setToast={setToast} />
      <Container maxWidth="xl">
        <Grid container justifyContent="space-between" maxWidth="xl" alignItems="center" sx={{ padding: 2 }}>
          <Grid item container xs={3} justifyContent="flex-start" spacing={2}>
            <Grid item xs={12} alignContent="center">
              <Typography variant="h4" fontWeight={700}>Payment Logs</Typography>
            </Grid>
          </Grid>
          <Grid item container xs={9} display="flex" justifyContent="flex-end" alignItems="center" gap={1}>
            <Grid item>
              <DatePicker
                label={filters.from_date ? moment(filters.from_date).format("MM/DD/YYYY") : "From Date"}
                value={filters.from_date ? moment(filters.from_date) : null}
                onChange={(date) => setFilters({ ...filters, from_date: date.toISOString() })}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
            <Grid item>
              <DatePicker
                label={filters.to_date ? moment(filters.to_date).format("MM/DD/YYYY") : "To Date"}
                value={filters.to_date ? moment(filters.to_date) : null}
                onChange={(date) => setFilters({ ...filters, to_date: date.toISOString() })}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
            <Grid item xs={2.5}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-multiple-chip-label">Type</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  size="small"
                  value={type}
                  onChange={handleChange}
                  input={<OutlinedInput id="select-multiple-chip" label="Type" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {logs.map((name) => (
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
            <Grid item xs={2.5}>
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
            </Grid>
            <Button disableElevation variant="contained" onClick={handleFilter}>
              Filter
            </Button>
            <Button disableElevation variant="contained" color="error" onClick={handleClear}>
              Clear
            </Button>
          </Grid>
        </Grid>
      </Container>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Fees</TableCell>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>{report.type}</TableCell>
              <TableCell>{constants.getFormattedDatetime(report.datetime)}</TableCell>
              <TableCell>{report.company?.name}</TableCell>
              <TableCell>${report.amount.toFixed(2)}</TableCell>
              <TableCell>${(report.fees)?.toFixed(2)}</TableCell>
              <TableCell>${(report.amount - report.fees)?.toFixed(2)}</TableCell>
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
            <Typography display="flex" gap={1}>Showing <Typography fontWeight="700">{reports.length}</Typography> out of <Typography fontWeight="700">{count}</Typography> results</Typography>
          </Grid>
        </Grid>
      </Container>

    </>
  )
}