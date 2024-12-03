"use client"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { FormProvider, useForm } from "react-hook-form"
import { Button, Container, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Radio, RadioGroup, Select, Typography } from "@mui/material"
import CloudUploadOutlined from "@mui/icons-material/CloudUploadOutlined"
import * as Icon from "@mui/icons-material"

import Alert from "@/app/components/Alert"
import FormField from "@/app/components/forms/FormField"
import VisuallyHiddenInput from "@/app/components/VisuallyHiddenInput"
import * as feedbackApis from "@/apis/feedback"

export default function Support() {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const searchParams = useSearchParams()
  const formRef = useRef(null)
  const [feedback, setFeedback] = useState(null)
  const [screenshots, setScreenshots] = useState(null)
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState("service")
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })
  const form = useForm({
    defaultValues: {
      name: feedback ? feedback.name : userState.user?.name,
      email: feedback ? feedback.email : userState.user?.email,
      problem: "",
      result: "",
      status: ""
    }
  })

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

  const handleSubmit = async (data) => {
    try {
      setLoading(true)
      const formData = new FormData()

      formData.append("name", data.name)
      formData.append("email", data.email)
      formData.append("problem", data.problem)
      formData.append("result", data.result)
      if (!data.status) formData.append("status", "Opened")

      if (searchParams.get("id")) {
        formData.append("id", searchParams.get("id"))
        formData.append("type", type)
        const response = await feedbackApis.updateFeedback(userState.token, data)
        if (!response.status) throw new Error(response.message)
      } else {
        const companyId = userState.user?.company_id

        formData.delete("screenshots")
        if (screenshots)
          Array.from(screenshots).forEach((item) => {
            formData.append("screenshots", item)
          })
        formData.append("company_id", companyId)
        formData.append("type", type)
        const response = await feedbackApis.createFeedback(userState.token, formData)
        if (!response.status) throw new Error(response.message)
      }

      setToast({ type: "success", open: true, message: "Saved" })
      form.reset()
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

      const feedbacks = {}
      if (response.feedback) {
        if (userState.companyUser) {
          feedbacks.problem = response.feedback.problem
        }
        if (userState.warehouseUser) {
          feedbacks.name = response.feedback.name
          feedbacks.email = response.feedback.email
          feedbacks.result = response.feedback.result
          feedbacks.status = response.feedback.status
        }
      } else {
        if (userState.companyUser) {
          feedbacks.name = userState.user.name
          feedbacks.email = userState.user.email
        }
      }
      form.reset(feedbacks)

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
    if (userState.customer) router.replace("/cp/products")
    if (searchParams.get("id")) getFeedback()
  }, [])

  return (
    <>
      <Alert toast={toast} setToast={setToast} />
      <Container maxWidth="sm">
        <Typography variant="h4" fontWeight={700} my={3}>Feedback</Typography>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <RadioGroup name="type" value={feedback ? feedback.type : type} onChange={handleTypeChange} row>
                  <FormControlLabel value="service" control={<Radio />} label="Service Issue" />
                  <FormControlLabel value="technical" control={<Radio />} label="Technical Issue" />
                </RadioGroup>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField label="Name" variant="outlined" size="small" name="name" type="text" disabled={!!feedback} />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField label="Email" variant="outlined" size="small" name="email" type="email" disabled={!!feedback} />
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
                <FormField fullWidth label="Problem" placeholder="Tell us about the problem" variant="outlined" name="problem" type="text" size="small" value={feedback ? feedback.problem : ""} disabled={userState.warehouseUser} />
              </Grid>
              {userState.warehouseUser && <Grid item xs={12}>
                <FormField fullWidth label="Result" placeholder="Write the result of the problem" variant="outlined" name="result" type="text" size="small" value={feedback ? feedback.result : ""} />
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
                  variant="contained"
                  disabled={loading}
                  fullWidth
                >Submit</Button>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </Container>
    </>
  )
}