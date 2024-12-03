"use client"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { Box, Button, Checkbox, Container, FormControl, FormControlLabel, ListItemButton, FormGroup, Grid, InputLabel, List, ListItem, ListItemText, MenuItem, Select, Typography, } from "@mui/material"

import Alert from "./Alert"
import Auth from "./Auth"
import * as roleApis from "../../apis/role"

export default function Permissions() {
  const router = useRouter()
  const userState = useSelector(state => state.user)
  const [selectedRole, setSelectedRole] = useState({})
  const [selectedRoleId, setSelectedRoleId] = useState(null)
  const [selectedPage, setSelectedPage] = useState("User")
  const [selectedPermissions, setSelectedPermissions] = useState({})
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
    pagePermissions["Return"] = ["CREATE RETURN", "UPDATE RETURN", "DELETE RETURN", "READ RETURN", "READ RETURNS"]
    pagePermissions["FBA"] = ["CREATE FBA", "UPDATE FBA", "DELETE FBA", "READ FBA", "READ FBAS"]
    pagePermissions["Product"] = ["CREATE PRODUCT", "UPDATE PRODUCT", "READ PRODUCT", "READ PRODUCTS"]
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
    pagePermissions["Reports"] = ["READ REPORTS"]
    pagePermissions["Payment logs"] = ["READ PAYMENT LOGS"]
    pagePermissions["Invoice"] = ["CREATE INVOICE", "UPDATE INVOICE", "DELETE INVOICE", "READ INVOICE", "READ INVOICES"]
  }

  const handlePageChange = (page) => {
    setSelectedPage(page)
  }

  const handleRoleChange = async (e) => {
    const roleId = e.target.value
    setSelectedRoleId(roleId)
    setSelectedRole(roles.find((role) => role.id === roleId))
  }

  const handleCheckboxChange = (permission) => {
    setSelectedPermissions((prevPermissions) => ({
      ...prevPermissions,
      [permission]: !prevPermissions[permission],
    }))
  }

  const handleCheckAll = (e, permission) => {
    const all = permission.reduce((acc, permission) => {
      acc[permission] = e.target.checked
      return acc
    }, {})

    setSelectedPermissions((prevPermissions) => ({
      ...prevPermissions, ...all
    }))
  }

  const handleSave = async () => {
    try {
      const allPermissions = {
        id: selectedRoleId,
        permissions: selectedPermissions,
      }
      const response = await roleApis.updateRole(userState.token, allPermissions)
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

      setSelectedRole(response.roles[0]?.name)
      setSelectedRoleId(response.roles[0]?.id)
      setRoles(response.roles)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const getRole = async () => {
    try {
      if (!selectedRoleId) return

      const response = await roleApis.getRole(userState.token, selectedRoleId)
      if (!response.status) throw new Error(response.message)

      setSelectedPermissions(JSON.parse(response.role.permissions))
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (userState.permissions && !userState.permissions["UPDATE_ROLE"]) router.replace("/wp/d")

    let params
    if (userState.warehouseUser) params = { role: "warehouse" }
    if (userState.companyUser || userState.companyAdmin) params = { role: "company" }

    const query = new URLSearchParams(params)
    getRoles(query.toString())
  }, [])

  useEffect(() => {
    getRole()
  }, [selectedRoleId])

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Container maxWidth="xl">
        <Box mt={4}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={3} sx={{ height: "calc(100vh - 64px)", overflow: "auto" }}>
              <Typography variant="h4" fontWeight={700}>Roles</Typography>
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
                <Grid item xs={6} md={4}>
                <FormControlLabel
                        control={
                <Checkbox
                  checked={pagePermissions[selectedPage].every(permission => selectedPermissions[permission] === true)}
                  onChange={(e) => handleCheckAll(e, pagePermissions[selectedPage])} />
                        }
                label = "ALL"
                />
                </Grid>
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
