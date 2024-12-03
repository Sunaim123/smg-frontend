"use client"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { Divider, Container, Grid, Typography, FormControl, Box, Button, TextField, Card, CardActionArea, CardContent, Paper, InputLabel, Select, OutlinedInput, Chip, MenuItem, Checkbox } from "@mui/material"

import moment from "moment"
import DateTimePicker from "../../components/DateTimePicker"
import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Navbar from "@/app/components/Navbar"
import * as companyApis from "@/app/apis/company"
import * as reportApis from "@/app/services/report"

export default function IncomeStatement() {
  const router = useRouter()
  const userState = useSelector(state => state.user)
  const [subscription, setSubscription] = useState(0)
  const [fba, setFba] = useState(0)
  const [return_service, setReturn_service] = useState(0)
  const [inventory, setInventory] = useState(0)
  const [shipping, setShipping] = useState(0)
  const [refund, setRefund] = useState(0)
  const [fees, setFees] = useState(0)
  const [partialFees, setPartialFees] = useState(0)
  const [cost, setCost] = useState(0)
  const [filters, setFilters] = useState("")
  const [companies, setCompanies] = useState([])
  const [companyIds, setCompanyIds] = useState([])
  const [check, setCheck] = useState(false)
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

  const getReportCount = async (params) => {
    try {
      const response = await reportApis.getIncomeStatement(userState.token, params)
      if (!response.status) throw new Error(response.message)

      setInventory(response.payment_log.order?.amount || 0)
      setSubscription(response.payment_log.subscription?.amount || 0)
      setReturn_service(response.payment_log['return service']?.amount || 0)
      setShipping(response.payment_log.shipping?.amount || 0)
      setRefund(response.payment_log.refund?.amount || 0)
      setFba(response.payment_log['fba shipment']?.amount || 0)
      setFees(response.fees)
      setPartialFees(response.partial_fees)
      setCost(response.cost)

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
      const query = new URLSearchParams(params)

      getReportCount(query.toString())
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const handleClear = async () => {
    setFilters("")
    setCompanyIds([])
    setInventory(0)
    setSubscription(0)
    setReturn_service(0)
    setShipping(0)
    setRefund(0)
    setFba(0)
    setFees(0)
    setCost(0)
    setPartialFees(0)
  }

  useEffect(() => {
    if (!userState.permissions["READ_REPORTS"]) router.replace("/dashboard")
    getCompanies()
  }, [])

  const total = inventory + refund - cost
  const stripeFees = check ? fees : partialFees
  const netProfit = check ? subscription + fba + return_service + total - fees : subscription + fba + return_service - partialFees

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Navbar />

      <Container maxWidth="lg">
        <Grid container justifyContent="space-between" maxWidth="xl" alignItems="center" sx={{ py: 2 }}>
          <Grid item container xs={5} justifyContent="flex-start" spacing={2}>
            <Grid item alignContent="center">
              <Typography variant="h4" fontWeight={700}>Income Statement</Typography>
            </Grid>
          </Grid>
          <Grid item xs={7} display="flex" justifyContent="flex-end" gap={2}>
            <Grid item xs={3}>
              <DateTimePicker
                label="From"
                value={filters.from_date ? moment(filters.from_date) : null}
                onChange={(value) => setFilters({ ...filters, from_date: value ? value.toISOString() : null })}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
            <Grid item xs={3}>
              <DateTimePicker
                label="To"
                value={filters.to_date ? moment(filters.to_date) : null}
                onChange={(value) => setFilters({ ...filters, to_date: value ? value.toISOString() : null })}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>

            <Grid item xs={3}>
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
              Generate
            </Button>
            <Button disableElevation variant="contained" color="error" onClick={handleClear}>
              Clear
            </Button>
          </Grid>
        </Grid>

        <Checkbox checked={check} onClick={() => setCheck(!check)} /> Include Inventory

        <Card variant="outlined">
          <CardContent>
            <Grid display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Subscriptions</Typography>
              <Typography variant="h6" fontWeight={800}>${subscription?.toFixed(2)}</Typography>
            </Grid>
            <Grid display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">FBA Shipments</Typography>
              <Typography variant="h6" fontWeight={800}>${fba?.toFixed(2)}</Typography>
            </Grid>
            <Grid display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Return Services</Typography>
              <Typography variant="h6" fontWeight={800}>${return_service?.toFixed(2)}</Typography>
            </Grid>

            <Divider sx={{ my: 1 }} />

            {check && <>
              <Grid display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Inventory</Typography>
              </Grid>
              <Grid display="flex" justifyContent="space-between" alignItems="center" sx={{ ml: 2 }}>
                <Typography variant="body1">Orders</Typography>
                <Typography variant="body1">${inventory?.toFixed(2)}</Typography>
              </Grid>
              <Grid display="flex" justifyContent="space-between" alignItems="center" sx={{ ml: 2 }}>
                <Typography variant="body1">Shipping</Typography>
                <Typography variant="body1">${shipping?.toFixed(2)}</Typography>
              </Grid>
              <Grid display="flex" justifyContent="space-between" alignItems="center" sx={{ ml: 2 }}>
                <Typography variant="body1">Refunds</Typography>
                <Typography variant="body1">-${(refund * -1)?.toFixed(2)}</Typography>
              </Grid>
              <Grid display="flex" justifyContent="space-between" alignItems="center" sx={{ ml: 2 }}>
                <Typography variant="body1">Cost</Typography>
                <Typography variant="body1">-${cost?.toFixed(2)}</Typography>
              </Grid>
              <Divider sx={{ my: 1 }} />
              <Grid display="flex" justifyContent="space-between" alignItems="center" sx={{ ml: 2 }}>
                <Typography variant="body1">Total</Typography>
                <Typography variant="body1" fontWeight={800}>${total.toFixed(2)}</Typography>
              </Grid>

              <Divider sx={{ my: 1 }} />
            </>}

            <Grid display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Stripe Fees</Typography>
              <Typography variant="h6" fontWeight={800}>${stripeFees?.toFixed(2)}</Typography>
            </Grid>
            <Grid display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5">Net Profit</Typography>
              <Typography variant="h5" fontWeight={800}>${(netProfit).toFixed(2)}</Typography>
            </Grid>
          </CardContent>
        </Card>
      </Container>

    </Auth>
  )
}
