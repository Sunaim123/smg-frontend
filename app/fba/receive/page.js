"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Box, Button, Container, IconButton, Typography } from "@mui/material"
import * as Icon from "@mui/icons-material"

import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Navbar from "@/app/components/Navbar"
import * as constants from "@/app/utilities/constants"
import * as fbaApis from "@/app/apis/fba"

export default function FbaService() {
  const userState = useSelector((state) => state.user)
  const router = useRouter()
  const searchParams = useSearchParams()
  const formRef = useRef(null)
  const [image1_url, setImage1_url] = useState(null)
  const [image2_url, setImage2_url] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fba, setFba] = useState(null)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleDeleteImage = (type) => {
    switch (type) {
      case "image1_url":
        setImage1_url(null)
        break;
      case "image2_url":
        setImage2_url(null)
      default:
        break;
    }
  }

  const setImage = (type, base64) => {
    switch (type) {
      case "image1_urlfile":
        formRef.current.image1_url.src = base64
        formRef.current.image1_url.srcset = base64
        break
      case "image2_urlfile":
        formRef.current.image2_url.src = base64
        formRef.current.image2_url.srcset = base64
        break
    }
  }

  const handleChange = async (e) => {
    try {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0]

        if (file.size > constants.maximumImageSize) {
          throw new Error(`Image size must be maximum of ${constants.maximumImageSize / 1_024_000}MB`)
        }
        if (!constants.imageExtensions.includes(file.type)) {
          throw new Error(`Image must be in format of ${constants.imageExtensions.join(", ")}`)
        }

        const reader = new FileReader()
        const type = e.target.name

        reader.addEventListener("load", function (e) {
          setImage(type, e.target.result)
        })

        reader.readAsDataURL(file)
        switch (type) {
          case "image1_urlfile":
            setImage1_url(URL.createObjectURL(file))
            break
          case "image2_urlfile":
            setImage2_url(URL.createObjectURL(file))
            break
        }
      }
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const handleClick = (type) => {
    switch (type) {
      case "image1_url":
        formRef.current.image1_urlfile.click()
        break
      case "image2_url":
        formRef.current.image2_urlfile.click()
        break
    }
  }

  const handleSubmit = async (e) => {
    try {
      setLoading(true)

      e.preventDefault()
      const payload = {
        id: fba.id,
        image1_url: e.target.image1_urlfile.files[0] || image1_url,
        image2_url: e.target.image2_urlfile.files[0] || image2_url,
        received: true
      }

      const response = await fbaApis.updateFba(userState.token, payload)
      if (!response.status) throw new Error(response.message)

      setToast({ type: "success", open: true, message: "fba service(s) created" })
      router.back()
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    } finally {
      setLoading(false)
    }
  }

  const getFba = async () => {
    try {
      const response = await fbaApis.getFba(userState.token, searchParams.get("id"))
      if (!response.status) throw new Error(response.message)

      setFba(response.fba)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (userState.customer) router.replace("/products")

    getFba()
  }, [])

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Navbar />

      <Container maxWidth="xs">
        <Typography  variant="h4" fontWeight={700} my={3}>Mark as Recieved</Typography>

        <form ref={formRef} onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="row" gap={1}>
            <Box position="relative">
              {image1_url && <IconButton
                onClick={() => handleDeleteImage("image1_url")}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  zIndex: 1,
                  background: "#eee"
                }}
              >
                <Icon.DeleteOutlined color="error" fontSize="small" />
              </IconButton>}
              <input
                type="file"
                name="image1_urlfile"
                ref={formRef.image1_urlfile}
                style={{ display: "none" }}
                onChange={handleChange}
              />
              <input
                name="image1_url"
                type="hidden"
                value={image1_url}
                onChange={handleChange}
              />
              <img
                src={image1_url || "/upload.png"}
                alt="image1_url"
                style={{ width: "96px", height: "96px", border: "1px solid #eee", borderRadius: "8px" }}
                onClick={() => handleClick("image1_url")}
              />
            </Box>
            <Box md={2}>
              <div style={{ position: "relative", display: "inline-block" }}>
                {image2_url && <IconButton
                  onClick={() => handleDeleteImage("image2_url")}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    zIndex: 1,
                  }}
                >
                  <Icon.DeleteOutlined color="error" fontSize="small" />
                </IconButton>}
                <input
                  type="file"
                  name="image2_urlfile"
                  ref={formRef.image2_urlfile}
                  style={{ display: "none" }}
                  onChange={handleChange}
                />
                <input
                  name="image2_url"
                  type="hidden"
                  value={image2_url}
                  onChange={handleChange}
                />
                <img
                  src={image2_url || "/upload.png"}
                  alt="image2_url"
                  style={{ width: "96px", height: "96px", border: "1px solid #eee", borderRadius: "8px" }}
                  onClick={() => handleClick("image2_url")}
                />
              </div>
            </Box>
          </Box>

          <Button
            type="submit"
            disabled={loading}
          >Submit</Button>
        </form>
      </Container>
    </Auth>
  )
}
