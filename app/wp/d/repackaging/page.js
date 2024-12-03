"use client"
import Link from "next/link"
import { useRef, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"
import { FormProvider, useForm } from "react-hook-form"
import { Button, Container, Grid, Typography, IconButton } from "@mui/material"
import { CloudUploadOutlined, DeleteOutlined } from "@mui/icons-material"

import Alert from "@/app/components/Alert"
import FormField from "@/app/components/forms/FormField"
import VisuallyHiddenInput from "@/app/components/VisuallyHiddenInput"
import * as returnApis from "@/apis/return"

export default function Repackaging() {
  const userState = useSelector((state) => state.user)
  const router = useRouter()
  const searchParams = useSearchParams()
  const formRef = useRef(null)
  const [images, setImages] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })
  const form = useForm({
    defaultValues: {
      warehouse_notes: ""
    }
  })

  const handleFileChange = (e) => {
    const files = e.target.files
    const total = (images ? images.length : 0) + files.length
    if (total > 2) return setToast({ type: "error", open: true, message: "Not more than 2 Images can be added" })

    setImages((images) => (images ? [...images, ...files] : files))
    setToast({ type: "success", open: true, message: "Images added" })
  }

  const handleDeleteImage = (index) => {
    const updatedImages = Array.from(images)
    updatedImages.splice(index, 1)
    setImages(updatedImages)

    if (updatedImages.length === 0) setImages(null)
  }

  const handleSubmit = async (data) => {
    try {
      setLoading(true)
      const formData = new FormData()

      formData.append("warehouse_notes", data.warehouse_notes)
      formData.append("return_id", searchParams.get("id"))
      formData.append("title", "repackaging Complete")
      formData.append("return_status", "completed")
      formData.append("type", "repackaging")
      if (images) {
        for (let i = 0; i < images.length; i++)
          formData.append("images", images[i])
      }
      for (const entry of formData.entries()) console.log(entry)

      const response = await returnApis.completeReturnService(userState.token, formData)
      if (!response.status) throw new Error(response.message)

      setToast({ type: "success", open: true, message: `Return marked as ${payload.title}` })
      form.reset()
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
    <>
      <Alert toast={toast} setToast={setToast} />
      {userState.warehouseUser && <Container maxWidth="md">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} style={{ margin: "40px 0" }}>
            <Typography variant="h4" marginBottom={3}>Repackaging</Typography>
            <Grid item xs={12}>
              <FormField
                type="text"
                label="Notes"
                name="warehouse_notes"
                size="small"
              />
            </Grid>

            <Grid container rowSpacing={2}>
              <Grid item xs={6} marginTop={2}>
                <Button component="label" variant="outlined" startIcon={<CloudUploadOutlined />} fullWidth>
                  {images ? `${images.length} images added` : "Upload upto 2 images"}
                  <VisuallyHiddenInput type="file" name="images" multiple onChange={handleFileChange} required />
                </Button>
              </Grid>
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
                        style={{ width: "100%", height: "100px", border: "1px #bbb solid", borderRadius: "4px", padding: "4px" }}
                      />
                    </Link>
                  </Grid>
                ))}
              </Grid>
              <Grid item xs={3} />
            </Grid>

            <Grid item xs={9} />
            <Grid item xs={3} marginTop={2} textAlign="right">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                disableElevation
              >submit</Button>
            </Grid>
          </form>
        </FormProvider>
      </Container>}
    </>
  )
}