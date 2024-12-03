"use client"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Autocomplete, Button, Container, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material"
import CloudUploadOutlined from "@mui/icons-material/CloudUploadOutlined"
import * as Icon from "@mui/icons-material"

import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Navbar from "@/app/components/Navbar"
import VisuallyHiddenInput from "@/app/components/VisuallyHiddenInput"
import * as feedbackApis from "@/app/apis/feedback"

export default function Feedback() {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const searchParams = useSearchParams()
  const formRef = useRef(null)
  const [feedback, setFeedback] = useState(null)
  const [screenshots, setScreenshots] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })
  const [type, setType] = useState("service")

  const handleTypeChange = (e) => {
    setType(e.target.value)
  }

  const handleFileChange = (e) => {
    const files = e.target.files
    const total = (screenshots ? screenshots.length : 0) + files.length
    if (total > 2) return setToast({ type: "error", open: true, message: "Not more than 2 screenshots can be added" })

    setScreenshots((screenshots) => (screenshots ? [...screenshots, ...files] : files))
    setToast({ type: "success", open: true, message: "Screenshots added" })
  }

  const handleSubmit = async (e) => {
    try {
      setLoading(true)
      e.preventDefault()
      const form = new FormData(e.target)

      if (!form.has("status")) form.append("status", "Opened")
      if (searchParams.get("id")) {
        form.append("id", searchParams.get("id"))
        const response = await feedbackApis.updateFeedback(userState.token, form)
        if (!response.status) throw new Error(response.message)
      } else {
        const companyId = userState.user?.company_id

        form.delete("screenshots")
        if (screenshots)
          Array.from(screenshots).forEach((item) => {
            form.append("screenshots", item)
          })
        form.append("company_id", companyId)
        const response = await feedbackApis.createFeedback(userState.token, form)
        if (!response.status) throw new Error(response.message)
      }

      setToast({ type: "success", open: true, message: "Saved" })

      router.back()
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    } finally {
      setLoading(false)
    }
  }

  const getFeedback = async () => {
    try {
      const response = await feedbackApis.getFeedback(userState.token, searchParams.get("id"))
      if (!response.status) throw new Error(response.message)

      if (response.feedback) {
        if (userState.companyUser && formRef.current) {
          formRef.current.problem.value = response.feedback.problem
        }
        if (userState.warehouseUser && formRef.current) {
          formRef.current.name.value = response.feedback.name
          formRef.current.email.value = response.feedback.email
          formRef.current.result.value = response.feedback.result
          formRef.current.status.value = response.feedback.status
        }
      } else {
        if (userState.companyUser && formRef.current) {
          formRef.current.name.value = userState.user.name
          formRef.current.email.value = userState.user.email
        }
      }

      setFeedback(response.feedback)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const handleDeleteImage = (index) => {
    const updatedScreenshots = Array.from(screenshots)
    updatedScreenshots.splice(index, 1)
    setScreenshots(updatedScreenshots)
  }

  useEffect(() => {
    if (searchParams.get("id")) getFeedback()
  }, [])

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Navbar />

      <Container maxWidth="sm">
        <Typography  variant="h4" fontWeight={700} my={3}>Feedback</Typography>

        <form formref={formRef} onSubmit={handleSubmit}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <RadioGroup name="type" value={feedback ? feedback.type : type} onChange={handleTypeChange} row>
                <FormControlLabel value="service" control={<Radio />} label="Service Issue" />
                <FormControlLabel value="technical" control={<Radio />} label="Technical Issue" />
              </RadioGroup>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Name" variant="outlined" size="small" name="name" type="text" defaultValue={feedback ? feedback.name : userState.user?.name} disabled={!!feedback} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Email" variant="outlined" size="small" name="email" type="email" defaultValue={feedback ? feedback.email : userState.user?.email} disabled={!!feedback} />
            </Grid>
            {userState.warehouseUser && <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  label="Status"
                  id="status"
                  name="status"
                  value={feedback ? feedback.status : "Opened"}
                  onChange={(e) => setFeedback({ ...feedback, status: e.target.value })}
                >
                  <MenuItem value="Opened">Opened</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                  <MenuItem value="Voided">Voided</MenuItem>
                </Select>
              </FormControl>
            </Grid>}
            <Grid item xs={12}>
              <TextField fullWidth label="Problem" placeholder="Tell us about the problem" variant="outlined" name="problem" type="text" size="small" defaultValue={feedback ? feedback.problem : ""} multiline rows={4} disabled={userState.warehouseUser} />
            </Grid>
            {userState.warehouseUser && <Grid item xs={12}>
              <TextField fullWidth label="Result" placeholder="Write the result of the problem" variant="outlined" name="result" type="text" size="small" defaultValue={feedback ? feedback.result : ""} multiline rows={4} />
            </Grid>}
            {!feedback && <Grid item xs={12}>
              <Button component="label" variant="outlined" startIcon={<CloudUploadOutlined />} fullWidth>
                {screenshots ? `${screenshots.length} screenshots added` : "Upload upto 2 Screenshots"}
                <VisuallyHiddenInput type="file" name="screenshots" multiple onChange={handleFileChange} />
              </Button>
            </Grid>}
            {screenshots && Array.from(screenshots).map((item, index) => (
              <Grid item xs={2} key={index} position="relative">
                <IconButton
                  onClick={() => handleDeleteImage(index)}
                  size="small"
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 0,
                    zIndex: 1,
                    background: "#eee",
                  }}
                >
                  <Icon.DeleteOutlined color="error" fontSize="small" />
                </IconButton>
                <Link href={URL.createObjectURL(item)} target="_blank">
                  <img
                    srcSet={URL.createObjectURL(item)}
                    src={URL.createObjectURL(item)}
                    alt={item.name}
                    loading="lazy"
                    style={{ width: "100%", height: "75px", border: "1px #bbb solid", borderRadius: "4px", padding: "4px" }}
                  />
                </Link>
              </Grid>
            ))}
            {feedback && JSON.parse(feedback.urls || "[]").map((item) => (
              <Grid item xs={2}>
                <Link href={item.link} target="_blank">
                  <img
                    srcSet={item.link}
                    src={item.link}
                    alt={item.title}
                    loading="lazy"
                    style={{ width: "100%", height: "75px", border: "1px #bbb solid", borderRadius: "4px", padding: "4px" }}
                  />
                </Link>
              </Grid>
            ))}
            <Grid item xs={12} md={9} />
            <Grid item xs={12} md={3}>
              <Button
                type="submit"
                disabled={loading}
                fullWidth
              >Submit</Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Auth>
  )
}