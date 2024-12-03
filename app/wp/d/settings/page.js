"use client"
import { useState } from "react"
import { useSelector } from "react-redux"
import { Box, Container, Tab, Tabs, Typography } from "@mui/material"

import CircularProgress from "@mui/material/CircularProgress"
import Alert from "@/app/components/Alert"
import * as serviceApis from "@/services/report"
import Profile from "@/app/components/Profile"
import Company from "@/app/components/Company"

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

export default function Settings() {
  const userState = useSelector((state) => state.user)
  const [value, setValue] = useState(0)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleChange = (e, newValue) => {
    setValue(newValue)
    if (newValue === 2) getCompany()
  }

  const getCompany = async () => {
    try {
      const response = await serviceApis.stripePortal(userState.token)
      if (!response.status) throw new Error(response.message)

      window.location.href = response.url
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <>
      <Alert toast={toast} setToast={setToast} />
      <Container maxWidth="xl">
        <Box py={3}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Profile" {...a11yProps(0)} />
            <Tab label="Company" {...a11yProps(1)} />
            <Tab label="Billing Portal" {...a11yProps(2)} />
          </Tabs>

          <CustomTabPanel value={value} index={0}>
            <Container maxWidth="sm">
              <Box py={3}>
                <Profile />
              </Box>
            </Container>
          </CustomTabPanel>

          <CustomTabPanel value={value} index={1}>
            <Container maxWidth="sm">
              <Box py={3}>
                <Company />
              </Box>
            </Container>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <Container maxWidth="sm">
              <Box display="flex" justifyContent="center" alignItems="center" py={3}>
                <CircularProgress />
              </Box>
            </Container>
          </CustomTabPanel>
        </Box>
      </Container>
    </>
  )
}