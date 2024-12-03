"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Box, Button, Container, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import AssignmentOutlined from "@mui/icons-material/AssignmentOutlined"
import EditOutlined from "@mui/icons-material/EditOutlined"
import DeleteOutlined from "@mui/icons-material/DeleteOutlined"

import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Navbar from "@/app/components/Navbar"
import * as constants from "@/app/utilities/constants"
import * as feedbackApis from "@/app/apis/feedback"

export default function Feedbacks() {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const [feedbacks, setFeedbacks] = useState([])
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const getFeedbacks = async () => {
    try {
      const response = await feedbackApis.getFeedbacks(userState.token, "")
      if (!response.status) throw new Error(response.message)

      setFeedbacks(response.feedbacks)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    getFeedbacks()
  }, [])

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Navbar />

      <Container maxWidth="xl">
        <Box display="flex" justifyContent="space-between" alignItems="center" my={3}>
          <Typography variant="h4" fontWeight={700}>Feedbacks</Typography>
          {userState.companyUser && <Button onClick={() => router.push("/feedback")}>New</Button>}
        </Box>
      </Container>

      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Problem</TableCell>
            <TableCell>Result</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {feedbacks.map((feedback) => (
            <TableRow key={feedback.id.toString()}>
              <TableCell>{feedback.name}</TableCell>
              <TableCell>{feedback.email}</TableCell>
              <TableCell sx={{ textTransform: "capitalize" }}>{feedback.type}</TableCell>
              <TableCell>{constants.feedbackStatus[feedback.status]}</TableCell>
              <TableCell>{feedback.problem}</TableCell>
              <TableCell>{feedback.result}</TableCell>
              <TableCell align="center">
                <IconButton color="primary" onClick={() => router.push(`/feedback/${feedback.id}`)}><AssignmentOutlined color="primary" /></IconButton>
                {feedback.status !== "Closed" && <IconButton color="primary" onClick={() => router.push(`/feedback?id=${feedback.id}`)}><EditOutlined color="primary" /></IconButton>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Auth>
  )
}