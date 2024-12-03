"use client"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { Box, Container, Tab, Tabs, Typography } from "@mui/material"

import Alert from "@/app/components/Alert"
import Permissions from "@/app/components/Permissions"
import Users from "@/app/components/Users"
import Roles from "@/app/components/Roles"

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

export default function Page() {
  const router = useRouter()
  const userState = useSelector(state => state.user)
  const [value, setValue] = useState(0)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleChange = (e, newValue) => {
    setValue(newValue)
  }

  useEffect(() => {
    if (userState.customer) router.replace("/products")

  }, [])

  return (
    <>
      <Alert toast={toast} setToast={setToast} />
      <Container maxWidth="xl">
        <Box py={3}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Users" {...a11yProps(0)} />
            <Tab label="Roles" {...a11yProps(1)} />
            {userState.permissions && userState.permissions["UPDATE_ROLE"] &&
              <Tab label="Permissions" {...a11yProps(2)} />}
          </Tabs>

          <CustomTabPanel value={value} index={0}>
            <Box py={3}>
              <Users />
            </Box>
          </CustomTabPanel>

          <CustomTabPanel value={value} index={1}>
            <Box py={3}>
              <Roles />
            </Box>
          </CustomTabPanel>

          <CustomTabPanel value={value} index={2}>
            <Permissions />
          </CustomTabPanel>
        </Box>
      </Container>
    </>
  )
}