"use client"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { Box, Container, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import { DeleteOutlined } from "@mui/icons-material"
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import DocumentNumber from "../document_number/page"
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import Alert from "@/app/components/Alert"
import axios from "@/utilities/axios"
import * as constants from "@/utilities/constants"
import { Router } from "next/router"

export default function DocumentNumbers() {
  const { user, token } = useSelector(state => state.user)
  const router = useRouter()
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })
  const [documentNumbers, setDocumentNumbers] = useState([])
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editModalData, setEditModalData] = useState(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [viewModalData, setViewModalData] = useState(null)

  const handleEdit = (document) => {
    setEditModalData(document)
    setEditModalOpen(true)
  }
  const handleView = (document) => {
    setViewModalData(document)
    setViewModalOpen(true)
  }

  const getDocumentNumbers = async () => {
    try {
      const { data: response } = await axios.get("/api/document_numbers", {
        headers: {
          "Token": token
        }
      })
      if (!response.status) throw new Error(response.message)

      setDocumentNumbers(response.document_numbers)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const handleDelete = async (id) => {
    try {
      if (!window.confirm('Are you sure you want to delete?')) return
      const { data: response } = await axios.delete(`/api/document_number/${id}`, {
        headers: {
          "Token": token
        }
      })
      if (!response.status) throw new Error(response.message)

      getDocumentNumbers()
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (!user) router.replace("/auth/login")

    getDocumentNumbers()
  }, [])

  return (
    <>
      <Alert toast={toast} setToast={setToast} />
      <Container maxWidth="xl" sx={{ my: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h4" fontWeight={700}>Document Numbers</Typography>
          <DocumentNumber
            id={editModalData?.id || viewModalData?.id}
            isOpen={editModalOpen || viewModalOpen}
            onClose={() => {
              setEditModalOpen(false)
              setEditModalData(null)
              setViewModalOpen(false)
              setViewModalData(null)
            }}
            readOnly={viewModalOpen}
            initialData={editModalData || viewModalData || null}
          />
        </Box>
      </Container>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>TABLE</TableCell>
            <TableCell>COLUMN</TableCell>
            <TableCell>PREFIX</TableCell>
            <TableCell>START #</TableCell>
            <TableCell>END #</TableCell>
            <TableCell align="center">INCREMENT</TableCell>
            <TableCell align="center">ACTIONS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documentNumbers && documentNumbers.map((document) => (
            <TableRow key={document.id.toString()}>
              <TableCell>{document.document_table}</TableCell>
              <TableCell>{document.document_column}</TableCell>
              <TableCell>{document.prefix}</TableCell>
              <TableCell>{document.start_number}</TableCell>
              <TableCell>{document.end_number}</TableCell>
              <TableCell align="center">{document.increment_value}</TableCell>
              <TableCell sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                <IconButton color="primary" onClick={() => handleView(document)}><ContentPasteIcon /></IconButton>
                <IconButton color="primary" onClick={() => handleEdit(document)}><ModeEditIcon /></IconButton>
                <IconButton align="center"><IconButton color="error" onClick={() => handleDelete(document.id)}><DeleteOutlined /></IconButton></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
