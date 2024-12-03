"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useRef, useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Button, Container, Grid, IconButton, TextField, Typography } from "@mui/material"
import CloudUploadOutlined from "@mui/icons-material/CloudUploadOutlined"
import DeleteOutlined from "@mui/icons-material/DeleteOutlined"
import Clear from "@mui/icons-material/Clear"

import Link from "next/link"
import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Navbar from "@/app/components/Navbar"
import VisuallyHiddenInput from "@/app/components/VisuallyHiddenInput"
import * as returnApis from "@/app/apis/return"

export default function Inspection() {
  const userState = useSelector((state) => state.user)
  const router = useRouter()
  const searchParams = useSearchParams()
  const formRef = useRef(null)
  const [images, setImages] = useState(null)
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleChange = (e) => {
    if (e.target.files.length > 0)
      setToast({ type: "success", open: true, message: "File uploaded" })
    setVideo(e.target.files[0])
  }

  const handleFileChange = (e) => {
    const files = e.target.files
    const total = (images ? images.length : 0) + files.length
    if (total > 4) return setToast({ type: "error", open: true, message: "Not more than 4 Images can be added" })

    setImages((images) => (images ? [...images, ...files] : files))
    setToast({ type: "success", open: true, message: "Images added" })
  }

  const handleDeleteImage = (index) => {
    const updatedImages = Array.from(images)
    updatedImages.splice(index, 1)
    setImages(updatedImages)

    if (updatedImages.length === 0) setImages(null)
  }

  const handleDeleteVideo = () => {
    setVideo(null)
  }

  const handleSubmit = async (e) => {
    try {
      setLoading(true)
      e.preventDefault()
      const form = new FormData()

      form.append("return_id", searchParams.get("id"))
      form.append("warehouse_notes", e.target.warehouse_notes.value)
      form.append("title", "Inspection Completed")
      form.append("return_status", "completed")
      form.append("type", "inspection")
      if (e.target.video && e.target.video.files) {
        form.append("video", video)
      }
      if (images && video?.length === 0) {
        for (let i = 0; i < images.length; i++)
          form.append("images", images[i])
      }

      const response = await returnApis.completeReturnService(userState.token, form)
      if (!response.status) throw new Error(response.message)

      setToast({ type: "success", open: true, message: "Return service marked as completed" })
      router.back()
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (userState.customer) router.replace("/products")
  }, [])
  
  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Navbar />

      <Container maxWidth="sm">
        <Typography variant="h4" fontWeight={700} my={3}>Complete Service</Typography>

        <form ref={formRef} onSubmit={handleSubmit}>
          <Grid container gap={1}>
            <Grid item xs={12}>
              <TextField
                type="text"
                label="Notes"
                name="warehouse_notes"
                size="small"
                rows={4}
                multiline
                fullWidth
              />
            </Grid>
            {!video && <Grid item xs={12}>
              <Button component="label" variant="outlined" startIcon={<CloudUploadOutlined />} fullWidth>
                {images ? `${images.length} images added` : "Upload upto 4 images"}
                <VisuallyHiddenInput type="file" name="images" multiple onChange={handleFileChange} />
              </Button>
            </Grid>}
            <Grid item xs={12} display="flex" gap={1}>
              {images && Array.from(images).map((item, index) => (
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
                    <DeleteOutlined color="error" fontSize="small" />
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
            </Grid>
            {!images && !video && <Grid item xs={12}>
              <Typography align="center">Or</Typography>
            </Grid>}
            {!images && <><Grid item xs={12}>
              <Button component="label" variant="outlined" startIcon={<CloudUploadOutlined />} fullWidth>
                Upload a video
                <VisuallyHiddenInput type="file" name="video" onChange={handleChange} />
              </Button>
            </Grid>
              {video && <Grid display="flex" alignItems="center" justifyContent="center" item xs={12}>
                {video?.name} <Clear color="error" fontSize="small" sx={{ cursor: "pointer" }} onClick={handleDeleteVideo} />
              </Grid>}
              <Grid item xs={12}>
                <Typography color="error">* You can either upload up to 4 images or a video</Typography>
              </Grid>
            </>}
            <Grid item xs={12}>
              <Button
                type="submit"
                color="primary"
                fullWidth
                disabled={loading}
              >Submit</Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Auth>
  )
}