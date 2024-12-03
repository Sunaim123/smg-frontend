"use client"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Box, Button, Container, Dialog, DialogContent, DialogContentText, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import axios from "@/app/utilities/axios"
import * as constants from "@/app/utilities/constants"
import Auth from "@/app/components/Auth"

export default function DocumentNumber({ id, isOpen, onClose, initialData, readOnly }) {
  const userState = useSelector(state => state.user)
  const [open, setOpen] = useState(isOpen)
  const [formState, setFormState] = useState({
    documentTable: initialData ? initialData.document_table : "",
    documentColumn: initialData ? initialData.document_column : "",
    prefix: initialData ? initialData.prefix : "",
    startNumber: initialData ? initialData.start_number : "",
    increment: initialData ? initialData.increment_value : "",
  })
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setFormState({
      documentTable: "",
      documentColumn: "",
      prefix: "",
      startNumber: "",
      increment: "",
    })
    setOpen(false)
    onClose()
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()

      const { documentTable, documentColumn, prefix, startNumber, increment } = formState

      const payload = {
        document_table: documentTable,
        document_column: documentColumn,
        prefix,
        start_number: startNumber,
        increment_value: increment,
      }

      const token = userState.token
      if (id) {
        payload.id = parseInt(id)
        const { data: response } = await axios.put("/api/document_number", payload, {
          headers: {
            "Token": token
          }
        })
        if (!response.status) throw new Error(response.message)
      } else {
        const { data: response } = await axios.post("/api/document_number", payload, {
          headers: {
            "Token": token
          }
        })
        if (!response.status) throw new Error(response.message)
      }

      window.location.href = "/document_numbers"
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const handleDocumentChange = (e) => {
    const selected = e.target.value

    setFormState(prevState => ({
      ...prevState,
      documentTable: selected,
      documentColumn: selected === "Return" ? "Return #" : selected === "FBA" ? "FBA #" : "",
    }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  useEffect(() => {
    setOpen(isOpen)
    if (initialData) {
      setFormState({
        documentTable: initialData.document_table,
        documentColumn: initialData.document_column,
        prefix: initialData.prefix,
        startNumber: initialData.start_number,
        increment: initialData.increment_value,
      })
    }
  }, [isOpen, initialData])

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  const renderDocumentColumnMenuItems = () => {
    let items = []

    if (formState.documentTable === "Return") {
      items.push({ key: "Return #", value: "Return #", label: "Return #" })
    } else if (formState.documentTable === "FBA") {
      items.push({ key: "FBA #", value: "FBA #", label: "FBA #" })
    }

    return items
  }

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      {userState.companyUser && (
        <Box>
          <Button disableElevation variant="contained" size="large" onClick={handleClickOpen}>New</Button>
          <Dialog maxWidth="lg" open={open} onClose={handleClose}>
            <DialogContent>
              <DialogContentText>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <Box>
                    <Typography fontWeight="bold" color="black" fontSize="25px" padding="0.6rem 1rem">Document Number</Typography>
                    <Container maxWidth="xl">
                      <Grid container spacing={2}>
                        <Grid item xs={6} md={4}>
                          <FormControl fullWidth>
                            <InputLabel size="small" htmlFor="document-table">Document Table</InputLabel>
                            <Select size="small" label="Document Table" labelId="document-table" id="document-table" name="documentType" disabled={readOnly} value={formState.documentTable} onChange={handleDocumentChange}>
                              <MenuItem value="Return">Return</MenuItem>
                              <MenuItem value="FBA">FBA</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={6} md={4}>
                          <FormControl fullWidth>
                            <InputLabel size="small" htmlFor="document_column">Document Column</InputLabel>
                            <Select label="Document Column" size="small" labelId="document_column" id="document_column" name="document_column" disabled={readOnly} value={formState.documentColumn} onChange={handleInputChange}>
                              {renderDocumentColumnMenuItems().map(item => (
                                <MenuItem key={item.key} value={item.value}>{item.label}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item md={4}></Grid>
                      </Grid>
                      <Grid container spacing={2} marginTop={1}>
                        <Grid item md={4}>
                          <TextField size="small" label="Prefix" name="prefix" value={formState.prefix} onChange={handleInputChange} fullWidth disabled={readOnly} />
                        </Grid>
                        <Grid item md={4}>
                          <TextField size="small" label="Start #" name="startNumber" value={formState.startNumber} onChange={handleInputChange} fullWidth disabled={readOnly} />
                        </Grid>
                        <Grid item md={4}>
                          <TextField size="small" label="Increment Value" name="increment" value={formState.increment} onChange={handleInputChange} fullWidth disabled={readOnly} />
                        </Grid>
                      </Grid>
                    </Container>
                    <Box mt={2} display="flex" justifyContent="flex-end">
                      <Button disableElevation variant="contained" color="error" onClick={handleClose}> Close</Button>
                      {!readOnly && <Box ml={2}>
                        <Button disableElevation type="submit" variant="contained" onClick={handleSubmit}>Save</Button>
                      </Box>}
                    </Box>
                  </Box>
                </LocalizationProvider>
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </Box>
      )}
    </Auth>
  )
}
