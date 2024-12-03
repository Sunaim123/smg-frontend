"use client"
import { useCallback, useRef, useState } from "react"
import { Box, Button, IconButton, Input, Paper } from "@mui/material"
import DeleteOutlined from "@mui/icons-material/DeleteOutlined"
import Webcam from "react-webcam"

const videoConstraints = {
  width: 200,
  height: 200,
  facingMode: "user"
}

export default function Camera(props) {
  const [camera, setCamera] = useState(false)
  const [picture, setPicture] = useState("")
  const webcamRef = useRef(null)

  const capture = useCallback(() => {
    const pictureSrc = webcamRef.current.getScreenshot({ width: 800, height: 800 })
    setPicture(pictureSrc)
    setCamera(false)
  })

  const handleClear = (type) => {
    props.handleClear(type)

    setCamera(false)
    setPicture("")
  }

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #ddd",
      }}
    >
      <Input
        name={`${props.name}file`}
        type="file"
        sx={{ display: "none" }}
        accept=".jpg, .jpeg, .png"
        onChange={props.handleChange}
      />
      <IconButton
        onClick={() => handleClear(props.name)}
        size="small"
        style={{
          position: "absolute",
          top: 12,
          right: 5,
          zIndex: 1,
          background: "#eee",
        }}
      >
        <DeleteOutlined color="error" fontSize="small" />
      </IconButton>

      {!camera && !picture && <>
        <Input name={`${props.name}url`} type="hidden" />
        <Input name={`${props.name}64`} type="hidden" />
        <img src="/upload.png" alt={props?.alt} id={props.name} style={{ width: "100%", height: "200px" }} />
      </>}

      {
        camera && !picture && <Webcam
          ref={webcamRef}
          audio={false}
          height={200}
          width="100%"
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
        />
      }

      {
        !camera && picture && <Box>
          <Input name={`${props.name}64`} type="hidden" value={picture} />
          <img src={picture} alt={props?.alt} id={props.name} style={{ width: "100%", height: "200px" }} />
        </Box>
      }

      <Box sx={{ display: "flex", gap: 1, p: 1, borderTop: "1px solid #ddd", background: "#f3f3f3" }}>
        <Button
          type="button"
          variant="contained"
          disableElevation
          fullWidth
          onClick={() => {
            setCamera(() => false)
            setPicture(() => "")
            props.handleClick(props.name)
          }}
        >Upload</Button>
        {
          !camera && !picture && props.camera && <Button
            type="button"
            variant="contained"
            disableElevation
            fullWidth
            onClick={() => {
              setCamera(() => true)
            }}
          >Camera</Button>
        }
        {
          camera && !picture && <Button
            type="button"
            variant="contained"
            disableElevation
            fullWidth
            onClick={() => {
              props.handleClearFile(props.name)
              capture()
            }}
          >Capture</Button>
        }
        {
          !camera && picture && <Button
            type="button"
            variant="contained"
            disableElevation
            fullWidth
            onClick={() => {
              setCamera(() => true)
              setPicture(() => "")
            }}
          >Retake</Button>
        }
      </Box>
    </Paper>
  )
}