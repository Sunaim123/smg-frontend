"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Button, Container, Grid, TextField, Typography } from "@mui/material"

import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Loading from "@/app/components/Loading"
import Navbar from "@/app/components/Navbar"
import Camera from "@/app/components/Camera"
import * as constants from "@/app/utilities/constants"
import * as returnApis from "@/app/apis/return"

export default function Ship() {
  const userState = useSelector((state) => state.user)
  const router = useRouter()
  const searchParams = useSearchParams()

  const formRef = useRef(null)
  const [_return, setReturn] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const setImage = (type, file) => {
    formRef.current[type].src = URL.createObjectURL(file)
    formRef.current[type].srcset = URL.createObjectURL(file)
  }

  const handleChange = (e) => {
    try {
      if (!e.target.files || !e.target.files.length) throw new Error("Upload an image")
      if (e.target.files[0].size > constants.maximumImageSize) throw new Error(`Image size must be maximum of ${constants.maximumImageSize / 1_024_000}MB`)
      if (!constants.imageExtensions.includes(e.target.files[0].type)) throw new Error(`Image must be in format of ${constants.imageExtensions.join(", ")}`)

      setImage(e.target.name.replace("file", ""), e.target.files[0])
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const handleClear = (type) => {
    formRef.current[`${type}`].src = "/upload.png"
    formRef.current[`${type}`].srcset = "/upload.png"
    formRef.current[`${type}64`].value = ""
    formRef.current[`${type}file`].value = ""
  }

  const handleClearFile = (type) => {
    formRef.current[`${type}file`].value = ""
  }

  const handleClick = (type) => {
    formRef.current[`${type}file`].click()
  }

  const handleSubmit = async (e) => {
    try {
      setLoading(true)
      const form = new FormData()
      e.preventDefault()

      if (e.target.image1file.files[0])
        form.append("image1_url", e.target.image1file.files[0])
      else if (e.target.image1url)
        form.append("image1_url", e.target.image1url.value)

      if (e.target.image2file.files[0])
        form.append("image2_url", e.target.image2file.files[0])
      else if (e.target.image2url)
        form.append("image2_url", e.target.image2url.value)

      if (e.target.image3file.files[0])
        form.append("image3_url", e.target.image3file.files[0])
      else if (e.target.image3url)
        form.append("image3_url", e.target.image3url.value)

      if (e.target.image4file.files[0])
        form.append("image4_url", e.target.image4file.files[0])
      else if (e.target.image4url)
        form.append("image4_url", e.target.image4url.value)

      form.append("return_id", searchParams.get("id"))
      form.append("description", e.target.description.value)
      form.append("quantity", e.target.quantity.value)
      if (e.target.image164) form.append("image1", e.target.image164.value)
      if (e.target.image264) form.append("image2", e.target.image264.value)
      if (e.target.image364) form.append("image3", e.target.image364.value)
      if (e.target.image464) form.append("image4", e.target.image464.value)

      const response = await returnApis.returnReceived(userState.token, form)
      if (!response.status) throw new Error(response.message)
      e.target.reset()

      router.back()
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    } finally {
      setLoading(false)
    }
  }

  const getReturn = async () => {
    try {
      const response = await returnApis.getReturn(userState.token, searchParams.get("id"))
      if (!response.status) throw new Error(response.message)

      setReturn(response.return)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    getReturn()
  }, [])

  if (!_return)
    return (
      <Loading />
    )

  const opened = _return.return_status === "opened"
  if (!(userState.warehouseUser && opened)) router.replace("/dashboard")

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Navbar />

      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={700} my={3}>Mark as Received</Typography>

        <form ref={formRef} onSubmit={handleSubmit}>
          {_return.quantity && <Typography variant="body2" mb={3}>Quantity Expected: {_return.quantity}</Typography>}

          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                type="text"
                label="Notes"
                name="description"
                size="small"
                rows={4}
                multiline
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth type="text" label="Quantity" variant="outlined" name="quantity" size="small" />
            </Grid>
            <Grid item xs={6} />
            <Grid item xs={6} md={3} position="relative">
              <Camera name="image1" alt="image1" handleChange={handleChange} handleClick={handleClick} handleClear={handleClear} handleClearFile={handleClearFile} camera={true} />
            </Grid>
            <Grid item xs={6} md={3} position="relative">
              <Camera name="image2" alt="image2" handleChange={handleChange} handleClick={handleClick} handleClear={handleClear} handleClearFile={handleClearFile} camera={true} />
            </Grid>
            <Grid item xs={6} md={3} position="relative">
              <Camera name="image3" alt="image3" handleChange={handleChange} handleClick={handleClick} handleClear={handleClear} handleClearFile={handleClearFile} camera={true} />
            </Grid>
            <Grid item xs={6} md={3} position="relative">
              <Camera name="image4" alt="image4" handleChange={handleChange} handleClick={handleClick} handleClear={handleClear} handleClearFile={handleClearFile} camera={true} />
            </Grid>
            <Grid item xs={9} />
            <Grid item xs={3}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disableElevation
                disabled={loading}
              >Save</Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Auth >
  )
}