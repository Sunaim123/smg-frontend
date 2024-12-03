"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Box, Button, Container, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography, Tooltip } from "@mui/material"
import DeleteOutlined from "@mui/icons-material/DeleteOutlined"
import EditOutlined from "@mui/icons-material/EditOutlined"

import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Navbar from "@/app/components/Navbar"
import * as userApis from "@/app/apis/user"

export default function Users() {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const [users, setUsers] = useState([])
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

      const response = await userApis.deleteUser(userState.token, id)
      if (!response.status) throw new Error(response.message)

      setUsers(users.filter(user => user.id !== id))
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const getUsers = async () => {
    try {
      const response = await userApis.getUsers(userState.token, "")
      if (!response.status) throw new Error(response.message)

      setUsers(response.users)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Navbar />

      <Container maxWidth="xl">
        <Box display="flex" justifyContent="space-between" alignItems="center" my={3}>
          <Typography variant="h4" fontWeight={700}>Users</Typography>
          <Button onClick={() => router.push("/user")}>New</Button>
        </Box>
      </Container>

      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Mobile</TableCell>
            {userState.companyUser && <TableCell>Company</TableCell>}
            <TableCell>Role</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id.toString()}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.mobile}</TableCell>
              {userState.companyUser && <TableCell>{user.company?.name}</TableCell>}
              <TableCell sx={{ textTransform: "capitalize" }}>{user.user_role?.role?.name}</TableCell>
              <TableCell align="center">
                <Tooltip title="Edit" placement="top"><IconButton color="primary" onClick={() => handleLink(`/user-permissions?id=${user.id}`)}><EditOutlined /></IconButton></Tooltip>
                <IconButton color="error" size="small" onClick={() => handleDelete(user.id)}><DeleteOutlined /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Auth>
  )
}