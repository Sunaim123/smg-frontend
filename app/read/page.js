"use client"
import axios from "@/app/utilities/axios"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import * as constants from "@/app/utilities/constants"
import Navbar from "../components/Navbar"
import { Container, Typography, TextField, Grid } from '@mui/material'
import Auth from "@/app/components/Auth"

export default function Read() {
  const router = useRouter()
  const userState = useSelector(state => state.user)

  const [feedback, setFeedback] = useState({});
  const getFeedback = async () => {
    try {
      const { data: response } = await axios.get(`/api/feedbacks/${id}`, {
        headers: {
          "Token": userState.token
        }
      })
      if (!response.status) throw new Error(response.message)
      setFeedback(response.feedback)
    } catch (error) {
      alert(error.message)
    }
  }

  useEffect(() => {
    if (!userState.user) router.replace("/")
    if (id) getFeedback()
  }, [])

  return (
    (
      <Auth>
        <Navbar />
        <Container
          component="main"
          sx={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            sx={{
              padding: (theme) => theme.spacing(4),
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              margin="2rem 0"
            >
              Feedback Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Type"
                  variant="outlined"
                  fullWidth
                  value={feedback.type}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    marginBottom: (theme) => theme.spacing(2),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Status"
                  variant="outlined"
                  fullWidth
                  value={feedback.status}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    marginBottom: (theme) => theme.spacing(2),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  value={feedback.name}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    marginBottom: (theme) => theme.spacing(2),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={feedback.email}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    marginBottom: (theme) => theme.spacing(2),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Problem"
                  variant="outlined"
                  fullWidth
                  value={feedback.problem}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    marginBottom: (theme) => theme.spacing(2),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Result"
                  variant="outlined"
                  fullWidth
                  value={feedback.result}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    marginBottom: (theme) => theme.spacing(2),
                  }}
                />
              </Grid>
            </Grid>
          </div>
        </Container>
      </Auth>
    ))
}
