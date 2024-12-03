"use client"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Box, Grid, Button, Container, FormControl, IconButton, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, Chip, Tooltip, OutlinedInput } from "@mui/material"
import AssignmentOutlined from "@mui/icons-material/AssignmentOutlined"
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined"
import RestoreFromTrashOutlined from "@mui/icons-material/RestoreFromTrashOutlined"

import Alert from "@/app/components/Alert"
import * as constants from "@/utilities/constants"
import * as companyApis from "@/apis/company"
import * as fbaApis from "@/apis/fba"
import Pagination from "@/app/components/Pagination"

export default function Fbas() {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const [filters, setFilters] = useState({
    return_status: searchParams.get("status") || null,
  })
  const [companies, setCompanies] = useState([])
  const [companyIds, setCompanyIds] = useState([])
  const [fbas, setFbas] = useState([])
  const [status, setStatus] = useState([])
  const [count, setCount] = useState(0)
  const [active, setActive] = useState(1)
  const [trash, setTrash] = useState(false)
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

  const handleClear = () => {
    setFilters("")
    setCompanyIds([])
    setStatus([])
    setTrash(false)
    router.push(pathname)
  }

  const handleTrash = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to delete?")) return

      const response = await fbaApis.trashFba(userState.token, { id: id, trash: true })
      if (!response.status) throw new Error(response.message)

      setFbas((fbas) => fbas.filter(fba => fba.id !== id))
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const handleRestore = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to restore this shipment?")) return

      const response = await fbaApis.trashFba(userState.token, { id: id, trash: false })
      if (!response.status) throw new Error(response.message)

      getFbas()
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

  const getFbas = async () => {
    try {
      const params = {}

      if (status && status.length > 0) params.status = status.join(",")
      if (companyIds && companyIds.length > 0) params.company_ids = companyIds.join(",")
      params.trash = trash
      params.offset = (active - 1) * limit
      params.limit = limit

      const query = new URLSearchParams(params)
      const response = await fbaApis.getFbas(userState.token, query.toString())
      if (!response.status) throw new Error(response.message)

      setCount(response.count)
      setFbas(response.fbas)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (userState.warehouseUser) getComapnies()
  }, [])

  useEffect(() => {
    if (userState.customer) router.replace("/products")

    if (searchParams.has("status")) setStatus([searchParams.get("status")])
  }, [])

  useEffect(() => {
    getFbas()
  }, [filters, trash, active, status, companyIds])

  return (
    <>
      <Alert toast={toast} setToast={setToast} />

      <Container maxWidth="xl">
        <Grid container justifyContent="space-between" alignItems="center" py={3}>
          <Grid item xs={3}>
            <Typography variant="h4" fontWeight={700}>FBA Shipments</Typography>
          </Grid>
          <Grid item xs={9} container justifyContent="flex-end" alignItems="center" gap={1}>
            <Chip variant={trash ? "filled" : "outlined"} label="Trash" color="error" size="medium" onClick={handleTrashSearch}></Chip>

            <Grid item xs={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-multiple-chip-label">FBA Status</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={status}
                  size="small"
                  onChange={handleChange}
                  input={<OutlinedInput id="select-multiple-chip" label="Fba Status" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Received">Received</MenuItem>
                  <MenuItem value="Shipped">Shipped</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {userState.warehouseUser &&
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
              </Grid>}

            <Button variant="contained" color="error" onClick={handleClear}>Clear</Button>
            {userState.companyUser && <Button variant="contained" onClick={() => router.push("/wp/d/fba")}>New</Button>}
          </Grid>
        </Grid>
      </Container>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>FBA #</TableCell>
            <TableCell>Carrier</TableCell>
            <TableCell>Tracking #</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Payment Status</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Recieved</TableCell>
            <TableCell>Shipped</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fbas.map((fba) => (
            <TableRow key={fba.id.toString()}>
              <TableCell>FBA{fba.id}</TableCell>
              <TableCell>{fba.carrier}</TableCell>
              <TableCell>{fba.tracking_number}</TableCell>
              <TableCell>{constants.fbaStatus[fba.return_status]}</TableCell>
              <TableCell>{constants.paymentStatus[fba.payment_status]}</TableCell>
              <TableCell sx={{ color: constants.getCompanyStatus(fba.company.payment_status, fba.company.end_date) }}>
                {fba.company.name}
              </TableCell>
              <TableCell>{fba.received && constants.getFormattedDatetime(fba.received)}</TableCell>
              <TableCell>{fba.shipped && constants.getFormattedDatetime(fba.shipped)}</TableCell>
              <TableCell align="center" sx={{ display: "flex" }}>
                <IconButton color="primary" size="small" onClick={() => router.push(`/wp/d/fba/${fba.id}`)}><AssignmentOutlined /></IconButton>
                {userState.warehouseUser && (
                  !fba.trash ? (
                    <Tooltip title="Delete" placement="top">
                      <IconButton color="error" onClick={() => handleTrash(fba.id)}>
                        <DeleteOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Restore" placement="top">
                      <IconButton color="success" onClick={() => handleRestore(fba.id)}>
                        <RestoreFromTrashOutlined />
                      </IconButton>
                    </Tooltip>
                  )
                )}
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
            <Typography display="flex" gap={1}>Showing <Typography fontWeight="700">{fbas.length}</Typography> out of <Typography fontWeight="700">{count}</Typography> results</Typography>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}