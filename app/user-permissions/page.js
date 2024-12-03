"use client"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useRouter, useSearchParams } from "next/navigation"
import { Box, Button, Checkbox, Container, FormControl, FormControlLabel, ListItemButton, Grid, InputLabel, List, ListItem, ListItemText, MenuItem, Select, Typography, } from "@mui/material"

import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Navbar from "@/app/components/Navbar"
import * as roleApis from "@/app/apis/role"
import * as userRoleApis from "@/app/apis/user-role"
import * as userApis from "@/app/apis/user"

export default function Permissions() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userState = useSelector(state => state.user)
  const [user, setUser] = useState('')
  const [selectedRoleId, setSelectedRoleId] = useState(null)
  const [selectedPage, setSelectedPage] = useState("User")
  const [selectedPermissions, setSelectedPermissions] = useState({})
  const [initialPermissions, setInitialPermissions] = useState({})
  const [roles, setRoles] = useState([])
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  let pagePermissions = {}
  if (userState.companyUser) {
    pagePermissions["User"] = ["CREATE USER", "UPDATE USER", "DELETE USER", "READ USER", "READ USERS"]
      pagePermissions["Feedback"] = ["CREATE FEEDBACK", "UPDATE FEEDBACK", "DELETE FEEDBACK", "READ FEEDBACK", "READ FEEDBACKS"]
      pagePermissions["Return"] = ["UPDATE RETURN", "DELETE RETURN", "READ RETURN", "READ RETURNS"]
      pagePermissions["FBA"] = ["CREATE FBA", "UPDATE FBA", "DELETE FBA", "READ FBA", "READ FBAS"]
      pagePermissions["Product"] = ["CREATE PRODUCT", "UPDATE PRODUCT", "DELETE PRODUCT", "READ PRODUCT", "READ PRODUCTS"]
      pagePermissions["Order"] = ["CREATE ORDER", "UPDATE ORDER", "DELETE ORDER", "READ ORDER", "READ ORDERS", "CREATE ORDER INVOICE", "READ ORDER INVOICE", "DELETE ORDER INVOICE"]
  }
  if (userState.superUser) {
    pagePermissions["User"] = ["CREATE USER", "UPDATE USER", "DELETE USER", "READ USER", "READ USERS"]
      pagePermissions["Address"] = ["CREATE ADDRESS", "UPDATE ADDRESS", "DELETE ADDRESS", "READ ADDRESS", "READ ADDRESSES"]
      pagePermissions["Company"] = ["CREATE COMPANY", "UPDATE COMPANY", "DELETE COMPANY", "READ COMPANY", "READ COMPANIES"]
      pagePermissions["Roles"] = ["UPDATE ROLE", "READ ROLE", "READ ROLES"]
      pagePermissions["Warehouse"] = ["CREATE WAREHOUSE", "UPDATE WAREHOUSE", "DELETE WAREHOUSE", "READ WAREHOUSE", "READ WAREHOUSES"]
  }
  if (userState.warehouseUser) {
    pagePermissions["Company"] = ["READ COMPANY", "READ COMPANIES"]
      pagePermissions["User"] = ["CREATE USER", "UPDATE USER", "DELETE USER", "READ USER", "READ USERS"]
    pagePermissions["Feedback"] = ["UPDATE FEEDBACK", "DELETE FEEDBACK", "READ FEEDBACK", "READ FEEDBACKS"]
      pagePermissions["Return"] = ["CREATE RETURN", "UPDATE RETURN", "DELETE RETURN", "READ RETURN", "READ RETURNS"]
      pagePermissions["FBA"] = ["UPDATE FBA", "DELETE FBA", "READ FBA", "READ FBAS"]
      pagePermissions["Product"] = ["CREATE PRODUCT", "UPDATE PRODUCT", "DELETE PRODUCT", "READ PRODUCT", "READ PRODUCTS"]
    pagePermissions["Order"] = ["UPDATE ORDER", "DELETE ORDER", "READ ORDER", "READ ORDERS", "CREATE ORDER INVOICE", "READ ORDER INVOICE", "DELETE ORDER INVOICE"]
      pagePermissions["Reports"] = ["READ REPORTS"],
      pagePermissions["Payment logs"] = ["READ PAYMENT LOGS"]
    pagePermissions["Invoice"] = ["CREATE INVOICE", "UPDATE INVOICE", "DELETE INVOICE", "READ INVOICE", "READ INVOICES"]
  }

  const handlePageChange = (page) => {
    setSelectedPage(page)
  }

  const handleRoleChange = async (e) => {
    const roleId = e.target.value
    setSelectedRoleId(roleId)
  }

  const handleCheckboxChange = (permission) => {
    setSelectedPermissions((prevPermissions) => ({
      ...prevPermissions,
      [permission]: !prevPermissions[permission],
    }))
  }

  const handleSave = async () => {
    try {

      const changedPermissions = {}
      Object.keys(selectedPermissions).forEach(permission => {
        if (selectedPermissions[permission] !== initialPermissions[permission]) {
          changedPermissions[permission] = selectedPermissions[permission]
        }
      })

      const allPermissions = {
        id: searchParams.get("id"),
        role_id: selectedRoleId,
        permissions: changedPermissions,
      }
      const response = await userRoleApis.updateUserRole(userState.token, allPermissions)
      if (!response.status) throw new Error(response.message)

      setToast({ type: "success", open: true, message: "permissions saved" })
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const getRoles = async (query) => {
    try {
      const response = await roleApis.getRoles(userState.token, query)
      if (!response.status) throw new Error(response.message)

      setSelectedRoleId(response.roles[0].id)
      setRoles(response.roles)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const getUserRole = async () => {
    try {

      const response = await userRoleApis.getUserRole(userState.token, searchParams.get("id"))
      if (!response.status) throw new Error(response.message)

      setSelectedPermissions(response.user_role.permissions)
      setInitialPermissions(response.user_role.rolePermissions)
      setSelectedRoleId(response.user_role.role_id)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const getUser = async () => {
    try {
      const response = await userApis.getUser(userState.token, searchParams.get("id"))
      if (!response.status) throw new Error(response.message)

      setUser(response.user.name);
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (userState.permissions && !userState.permissions["UPDATE_USER"]) router.replace("/dashboard")

    let params
    if (userState.warehouseUser) params = { role: "warehouse" }
    if (userState.companyUser || userState.companyAdmin) params = { role: "company" }

    const query = new URLSearchParams(params)
    getRoles(query.toString())
  }, [])

  useEffect(() => {
    getUserRole()
    getUser()
  }, [])

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Navbar />
      <Container maxWidth="xl">
        <Box mt={4}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={3} sx={{ height: "calc(100vh - 64px)", overflow: "auto" }}>
              <Typography variant="h4" fontWeight={700}>Roles for {user}</Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel id="role-select-label">Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  value={selectedRoleId || ""}
                  onChange={handleRoleChange}
                  label="Role"
                  sx={{ textTransform: "capitalize" }}
                >
                  {roles.map((role) => (
                    <MenuItem
                      key={role.id.toString()}
                      value={role.id}
                      sx={{ textTransform: "capitalize" }}
                    >
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="h4" fontWeight={700} mt={4}>
                Features
              </Typography>
              <List>
                {Object.keys(pagePermissions).map((page) => (
                  <ListItem key={page} disablePadding>
                    <ListItemButton
                      selected={selectedPage === page}
                      onClick={() => handlePageChange(page)}
                    >
                      <ListItemText primary={page} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={9}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Permissions for {selectedPage}
              </Typography>
              <Grid container spacing={2}>
                {pagePermissions[selectedPage]?.map((permission) => (
                  <Grid item xs={6} md={4} key={permission}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedPermissions[permission] === true}
                          onChange={() => handleCheckboxChange(permission)}
                        />
                      }
                      label={permission}
                    />
                  </Grid>
                ))}
              </Grid>
              {userState.permissions && userState.permissions["UPDATE_ROLE"] && (
                <Box mt={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Auth>
  )
}
