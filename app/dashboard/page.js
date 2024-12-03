"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { Container, Grid, Typography, FormControl, TextField, Autocomplete, InputLabel, Select, OutlinedInput, Box, Chip, MenuItem } from "@mui/material"

import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Navbar from "@/app/components/Navbar"
import DashboardCard from "@/app/components/DashboardCard"
import DashboardReport from "@/app/components/DashboardReport"
import * as returnApis from "@/app/apis/return"
import * as fbaApis from "@/app/apis/fba"
import ReturnReport from "../components/ReturnReport"
import FbaReport from "../components/FbaReport"
import * as companyApis from "@/app/apis/company"

export default function Dashboard() {
  const router = useRouter()
  const userState = useSelector(state => state.user)
  const [count, setCount] = useState({})
  const [companies, setCompanies] = useState([])
  const [filters, setFilters] = useState([])
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const received = count["return received"] || 0
  const shelfRequested = count["return shelf requested"] || 0
  const shelved = count["return shelved"] || 0
  const shipRequested = count["return ship requested"] || 0
  const shipped = count["return shipped"] || 0
  const delivered = count["return delivered"] || 0
  const fbaPending = count["fba pending"] || 0
  const fbaReceived = count["fba received"] || 0
  const fbaShipped = count["fba shipped"] || 0
  const totalReturns = received + shelfRequested + shelved + shipRequested + shipped + delivered
  const totalFbas = fbaPending + fbaReceived + fbaShipped

  const cards = [
    { id: "total-returns", title: "Total Return", link: "/returns", extra: <Typography fontSize={60} fontWeight={900} textAlign="right">{totalReturns}</Typography> },
    { id: "received-returns", title: "Return Received", link: "/returns?status=Received", extra: <Typography fontSize={60} fontWeight={900} textAlign="right">{received}</Typography> },
    { id: "ship-returns", title: "Return Ship Requests", link: "/returns?status=Ship Requested", extra: <Typography fontSize={60} fontWeight={900} textAlign="right">{shipRequested}</Typography> },
    { id: "shipped-returns", title: "Return Shipped", link: "/returns?status=Shipped", extra: <Typography fontSize={60} fontWeight={900} textAlign="right">{shipped}</Typography> },

    { id: "total-fbas", title: "Total FBA", link: "/fbas", extra: <Typography fontSize={60} fontWeight={900} textAlign="right">{totalFbas}</Typography> },
    { id: "pending-fbas", title: "FBA Pending", link: "/fbas?status=Pending", extra: <Typography fontSize={60} fontWeight={900} textAlign="right">{fbaPending}</Typography> },
    { id: "received-fbas", title: "FBA Received", link: "/fbas?status=Received", extra: <Typography fontSize={60} fontWeight={900} textAlign="right">{fbaReceived}</Typography> },
    { id: "shipped-fbas", title: "FBA Shipped", link: "/fbas?status=Shipped", extra: <Typography fontSize={60} fontWeight={900} textAlign="right">{fbaShipped}</Typography> },
  ]

  const handleChange = (event) => {
    const {
      target: { value },
    } = event
    setFilters(
      typeof value === "string" ? value.split(",") : value,
    )
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

  const getReturnCount = async () => {
    try {
      const response = await returnApis.getCount(userState.token)
      if (!response.status) throw new Error(response.message)

      setCount((previous) => {
        return {
          ...previous,
          ...response.returns
        }
      })
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const getFbaCount = async () => {
    try {
      const response = await fbaApis.getCount(userState.token)
      if (!response.status) throw new Error(response.message)

      setCount((previous) => {
        return {
          ...previous,
          ...response.fbas
        }
      })
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (userState.customer) router.replace("/products")
    if (userState.warehouseUser) getComapnies()

    getReturnCount()
    getFbaCount()
  }, [])

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Navbar />

      <Container maxWidth="xl">
        <Grid display="flex" justifyContent="space-around" alignItems="center" container spacing={1} my={3}>
          {cards.map((card) => (
            <Grid key={card.id} item xs={3}>
              <DashboardCard {...card} />
            </Grid>
          ))}
        </Grid>

        <Grid container alignItems="center" my={3}>
          <Grid item xs={9}>
            <Typography variant="h4" fontWeight={700}>Reports</Typography>
          </Grid>
          {userState.warehouseUser &&
            <Grid item xs={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-multiple-chip-label">Companies</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={filters}
                  size="small"
                  onChange={handleChange}
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
        </Grid>

        <Grid container spacing={1} my={3}>
          <Grid item xs={12} md={6}>
            <ReturnReport filters={filters} />
          </Grid>
          <Grid item xs={12} md={6}>
            <FbaReport filters={filters} />
          </Grid>
        </Grid>

        <DashboardReport setToast={setToast} filters={filters} />
      </Container>
    </Auth>
  )
}