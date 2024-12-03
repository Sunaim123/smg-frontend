"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Box, Button, Container, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography, Tooltip } from "@mui/material"
import DeleteOutlined from "@mui/icons-material/DeleteOutlined"
import EditOutlined from "@mui/icons-material/EditOutlined"

import Alert from "@/app/components/Alert"
import * as roleApis from "@/apis/role"

export default function Roles() {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const [roles, setRoles] = useState([])
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleLink = (link) => {
    router.push(link)
  }

  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to delete?")) return

      const response = await roleApis.deleteRole(userState.token, id)
      if (!response.status) throw new Error(response.message)

      setRoles(roles.filter(role => role.id !== id))
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const getRoles = async (query) => {
    try {
      const response = await roleApis.getRoles(userState.token, query)
      if (!response.status) throw new Error(response.message)

      setRoles(response.roles)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (userState.customer) router.replace("/products")

    let params
    if (userState.warehouseUser) params = { role: "warehouse" }
    if (userState.companyUser || userState.companyAdmin) params = { role: "company" }

    const query = new URLSearchParams(params)
    getRoles(query.toString())
  }, [])

  return (
    <>
      <Alert toast={toast} setToast={setToast} />

      <Container maxWidth="xl">
        <Box display="flex" justifyContent="space-between" alignItems="center" my={3}>
          <Typography variant="h4" fontWeight={700}>Roles</Typography>
          <Button variant="contained" onClick={() => router.push("/wp/d/role")}>New</Button>
        </Box>
      </Container>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            {userState.companyUser && <TableCell>Company</TableCell>}
            {userState.warehouseUser && <TableCell>Warehouse</TableCell>}
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id.toString()}>
              <TableCell>{role.name}</TableCell>
              {userState.companyUser && <TableCell sx={{ textTransform: "capitalize" }}>{role.company?.name}</TableCell>}
               {userState.warehouseUser && <TableCell sx={{ textTransform: "capitalize" }}>{role.warehouse?.name}</TableCell>}
              <TableCell align="center">
                <Tooltip title="Edit" placement="top"><IconButton color="primary" onClick={() => handleLink(`/role?id=${role.id}`)}><EditOutlined /></IconButton></Tooltip>
                <IconButton color="error" size="small" onClick={() => handleDelete(role.id)}><DeleteOutlined /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}