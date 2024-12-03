"use client"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Box, Button, Grid, IconButton, Badge, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, Tooltip, Typography, Container } from "@mui/material"
import * as Icon from "@mui/icons-material"

import ArrowForwardOutlined from "@mui/icons-material/ArrowForwardOutlined"
import AddchartOutlined from "@mui/icons-material/AddchartOutlined"
import AssignmentOutlined from "@mui/icons-material/AssignmentOutlined"
import OpenInNewOutlined from "@mui/icons-material/OpenInNewOutlined"
import RefreshOutlined from "@mui/icons-material/RefreshOutlined"

import Alert from "@/app/components/Alert"
import Loading from "@/app/components/Loading"
import ReturnServiceModal from "@/app/components/ReturnServiceModal"
import * as returnApis from "@/apis/return"
import * as auditApis from "@/apis/audit"
import * as constants from "@/utilities/constants"
import AuditModal from "@/app/components/AuditModal"
import ShippingChargesModal from "@/app/components/ShippingChargesModal"

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  }
}

export default function Return({ params }) {
  const userState = useSelector(state => state.user)
  const router = useRouter()

  const [value, setValue] = useState(0)
  const [_return, setReturn] = useState(null)
  const [audits, setAudits] = useState([])
  const [audit, setAudit] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [auditModal, setAuditModal] = useState(false)
  const [shippingModal, setShippingModal] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [returnService, setReturnService] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleModalOpen = (service) => {
    setSelectedService(service)
    setModalOpen(true)
  }

  const handleShippingModalOpen = (id) => {
    setReturnService({ id: id, return_id: params.id, status: "requested" })
    setShippingModal(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setSelectedService(null)
    setAuditModal(false)
    setShippingModal(false)
  }

  const handleChangeModal = async (id) => {
    try {
      const response = await auditApis.getAudit(userState.token, id)
      if (!response.status) throw new Error(response.message)

      setAudit(response.audit)
      setAuditModal(true)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const handleChange = (e, newValue) => {
    setValue(newValue)
  }

  const handleModal = (image) => {
    window.open(image)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await returnApis.updateReturnService(userState.token, returnService)
      if (!response.status) throw new Error(response.message)

      setShippingModal(false)
      setReturnService(null)
      getReturn()
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const updateStatus = async (status) => {
    try {
      const response = await returnApis.updateReturn(userState.token, { id: _return.id, return_status: status })
      if (!response.status) throw new Error(response.message)

      getReturn()
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const handleClick = async (url) => {
    if (_return.return_status === "ship requested")
      try {
        setLoading(true)
        const form = new FormData()

        form.append("return_id", params.id)
        form.append("title", "Shipped")
        form.append("return_status", "shipped")

        const response = await returnApis.patchReturn(userState.token, form)
        if (!response.status) throw new Error(response.message)

        setToast({ type: "success", open: true, message: "Return marked as shipped" })
        getReturn()
      } catch (error) {
        setToast({ type: "error", open: true, message: error.message })
      } finally {
        setLoading(false)
      }
    else
      router.push(url)
  }

  const handleValidate = async (invoice_id) => {
    try {
      const response = await returnApis.validateInvoice(userState.token, { invoice_id })
      if (!response.status) throw new Error(response.message)
      if (response.invoice_status !== "paid") throw new Error("Invoice haven't been cleared yet")

      getReturn()
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const getReturn = async () => {
    try {
      const response = await returnApis.getReturnDetails(userState.token, params.id)
      if (!response.status) throw new Error(response.message)

      response.return.streams.reverse()
      setReturn(response.return)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const getAudits = async () => {
    try {
      const query = new URLSearchParams({ entity_id: params.id, entity: "return" })
      const response = await auditApis.getAudits(userState.token, query.toString())
      if (!response.status) throw new Error(response.message)

      setAudits(response.audits)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (userState.customer) router.replace("/products")
    getReturn()
    getAudits()
  }, [])

  if (!_return)
    return (
      <Loading />
    )

  if (_return.trash)
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Icon.ReportProblem color="error" fontSize="large" />
        <Typography variant="h4" fontWeight={700} mt={2}>
          This record is in trash
        </Typography>
        <Button variant="contained" onClick={() => router.back()}>Go back</Button>
      </Box>
    )

  const returnReceived = _return.return_status === "received" || _return?.quantity - _return?.quantity_shipped > 0
  const returnShipRequested = returnReceived || _return.return_status === "ship requested"
  const requestedCount = _return.return_services.filter(service => service.status === "requested").length

  return (
    <>
      <Alert toast={toast} setToast={setToast} />
      <ReturnServiceModal selectedService={selectedService} modalOpen={modalOpen} handleModalClose={handleModalClose} handleValidate={handleValidate} />
      <ShippingChargesModal modalOpen={shippingModal} handleModalClose={handleModalClose} returnService={returnService} setReturnService={setReturnService} onSubmit={handleSubmit} />
      {audit && (<AuditModal
        modalOpen={auditModal}
        handleModalClose={handleModalClose}
        audit={audit}
      />)}

      <Container maxWidth="xl">
        <Box display="flex" justifyContent="space-between" alignItems="center" my={3} px={2}>
          <Typography variant="h4" fontWeight={700}>Return</Typography>
          <Box display="flex" gap={1}>
            {userState.companyUser && returnReceived && <Button variant="contained" onClick={() => router.push(`/wp/d/return/ship?id=${_return?.id}&title=Request Ship`)}>Request Ship</Button>}
            {userState.companyUser && returnReceived && <Button variant="contained" onClick={() => router.push(`/wp/d/return/service?id=${_return?.id}`)}>Add Service</Button>}
            {userState.warehouseUser && returnShipRequested && <Button variant="contained" onClick={() => handleClick(`/wp/d/return/ship?id=${_return?.id}&title=Mark as Shipped`)} disabled={loading}>Mark as Shipped</Button>}
          </Box>
        </Box>

        <Grid container spacing={2} px={2} mb={2}>
          <Grid item xs={3}>
            <Typography variant="body2" fontWeight={800}>RMA #</Typography>
            <Typography variant="body1">{_return.rma_number}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" fontWeight={800}>STATUS</Typography>
            {constants.returnStatus[_return.return_status]}
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" fontWeight={800}>RETURN CARRIER</Typography>
            <Typography variant="body1">{_return.carrier}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" fontWeight={800}>TRACKING #</Typography>
            <Typography variant="body1">{_return.tracking_number}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" fontWeight={800}>WEIGHT</Typography>
            <Typography variant="body1">{`${_return.weight} ${_return.weight_unit}`}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" fontWeight={800}>LENGTH</Typography>
            <Typography variant="body1">{`${_return.length} ${_return.length_unit}`}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" fontWeight={800}>WIDTH</Typography>
            <Typography variant="body1">{`${_return.width} ${_return.width_unit}`}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" fontWeight={800}>HEIGHT</Typography>
            <Typography variant="body1">{`${_return.height} ${_return.height_unit}`}</Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} px={2} mb={2}>
          {_return.quantity && <Grid item xs={3}>
            <Typography variant="body2" fontWeight={800}>QUANTITY</Typography>
            <Typography variant="body1">{_return.quantity}</Typography>
          </Grid>}
          {_return.quantity_shipped && <Grid item xs={3}>
            <Typography variant="body2" fontWeight={800}>QUANTITY SHIPPED</Typography>
            <Typography variant="body1">{_return.quantity_shipped}</Typography>
          </Grid>}
          {_return.quantity && _return.quantity_shipped && <Grid item xs={3}>
            <Typography variant="body2" fontWeight={800}>QUANTITY REMAINING</Typography>
            <Typography variant="body1">{_return.quantity - _return.quantity_shipped}</Typography>
          </Grid>}
        </Grid>

        <Grid container spacing={2} px={2} mb={3}>
          <Grid item xs={3}>
            <Typography variant="body2" fontWeight={800}>RECEIVED</Typography>
            <Typography variant="body1">{constants.getFormattedDatetime(_return.received)}</Typography>
          </Grid>
          {_return.ship && <Grid item xs={3}>
            <Typography variant="body2" fontWeight={800}>SHIP REQUEST</Typography>
            <Typography variant="body1">{constants.getFormattedDatetime(_return.ship)}</Typography>
          </Grid>}
          {_return.shipped && <Grid item xs={3}>
            <Typography variant="body2" fontWeight={800}>SHIPPED</Typography>
            <Typography variant="body1">{constants.getFormattedDatetime(_return.shipped)}</Typography>
          </Grid>}
        </Grid>

          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Activity" {...a11yProps(0)} />
            <Tab
              label={
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="body2">Services</Typography>
                  {!!requestedCount && <Badge badgeContent={requestedCount} color="error" />}
                </Box>
              }
              {...a11yProps(1)}
            />
            <Tab label="Audit" {...a11yProps(2)} />
          </Tabs>
          <CustomTabPanel value={value} index={0}>
            <Table>
              <TableHead>
                <TableRow>
                  {userState.warehouseUser && <TableCell>BY</TableCell>}
                  <TableCell>Title</TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell>Carrier</TableCell>
                  <TableCell>Tracking #</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Media</TableCell>
                </TableRow>
              </TableHead>
              {_return.streams.map((stream, index) => (
                <TableBody>
                  <TableRow key={`return-activity-${stream.id}`}>
                    {userState.warehouseUser && <TableCell>{stream.user.name}</TableCell>}
                    <TableCell>{stream.title}</TableCell>
                    <TableCell>{stream.quantity}</TableCell>
                    <TableCell>{stream.carrier ? stream.carrier : ""}</TableCell>
                    <TableCell>{stream.tracking_number ? stream.tracking_number : ""}</TableCell>
                    <TableCell>{stream.description}</TableCell>
                    <TableCell>{constants.getFormattedDatetime(stream.created_at)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {["image1", "image2"].map((image) => stream[image] && <Image src={stream[image]} alt={image} width={40} height={40} onClick={() => handleModal(index, image)} style={{ border: "2px solid #eee", borderRadius: "4px" }} />)}
                        {["image1_url", "image2_url", "image3_url", "image4_url"].map((image) => stream[image] && <Link href={stream[image]} target="_blank"><Image src={stream[image]} alt={stream[image]} width={40} height={40} style={{ border: "2px solid #eee", borderRadius: "4px" }} /></Link>)}
                        {stream.label_url && <Button href={stream.label_url} target="_blank" startIcon={<OpenInNewOutlined />} variant="contained" size="small" disableElevation>Open Label</Button>}
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ))}
            </Table>
          </CustomTabPanel>

          <CustomTabPanel value={value} index={1}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Payment Status</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Images</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              {_return.return_services.map((service) => (
                <TableBody>
                  <TableRow key={`return-service-${service.id}`}>
                    <TableCell sx={{ textTransform: "capitalize" }}>{service.type}</TableCell>
                    <TableCell>{constants.returnServiceStatus[service.status]}</TableCell>
                    <TableCell>{constants.paymentStatus[service.payment_status]} {service.payment_status !== "paid" && service.status !== "pending" && <Tooltip title="Validate Invoice"><IconButton onClick={() => handleValidate(service.invoice_id)}><RefreshOutlined color="primary" /></IconButton></Tooltip>}</TableCell>
                    <TableCell>{service.quantity}</TableCell>
                    <TableCell>{service.price === 0 ? `To be calculated` : `$${service.price.toFixed(2)}`}</TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        {["image1_url", "image2_url", "image3_url", "image4_url"].map((image) => (
                          service[image] && (
                            <Grid item key={image} xs={4}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  border: "2px solid #f3f4f6",
                                  borderRadius: "8px",
                                  width: "40px",
                                  height: "40px",
                                  padding: "8px",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleModal(service[image])}
                              >
                                <img src={service[image]} alt={image} style={{ width: "40px", height: "40px", borderRadius: "8px" }} />
                              </div>
                            </Grid>
                          )
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <IconButton color="primary" onClick={() => handleModalOpen(service)}><AssignmentOutlined /></IconButton>
                      {userState.companyUser && service.payment_status !== "paid" && service.status !== "pending" && <Tooltip title="Pay Invoice"><IconButton href={service.invoice_url} target="_blank" size="small"><ArrowForwardOutlined color="success" /></IconButton></Tooltip>}
                      {userState.warehouseUser && service.payment_status === "paid" && service.status === "requested" && <Tooltip title="Complete Service"><IconButton onClick={() => router.push(`/wp/d/${service.type}?id=${_return.id}`)}><ArrowForwardOutlined color="success" /></IconButton></Tooltip>}
                      {userState.warehouseUser && service.payment_status === "unpaid" && service.status === "pending" && <Tooltip title="Shipping charges"><IconButton onClick={() => handleShippingModalOpen(service.id)}><AddchartOutlined color="success" /></IconButton></Tooltip>}
                    </TableCell>
                  </TableRow>
                </TableBody>
              ))}
            </Table>
          </CustomTabPanel>

          <CustomTabPanel value={value} index={2}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Entity</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Changes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {audits.map((audit) => (
                  <TableRow key={audit.id}>
                    <TableCell sx={{ textTransform: "capitalize" }}>{audit.type}</TableCell>
                    <TableCell>{audit.entity}</TableCell>
                    <TableCell>{audit.message}</TableCell>
                    <TableCell>{audit.user.name}</TableCell>
                    <TableCell>{constants.getFormattedDatetime(audit.created_at)}</TableCell>
                    <TableCell>
                      <Button variant="contained" onClick={() => handleChangeModal(audit.id)}>View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CustomTabPanel>
      </Container>
    </>
  )
}