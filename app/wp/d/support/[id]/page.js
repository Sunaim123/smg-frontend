"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Container, Grid, Typography } from "@mui/material"

import Alert from "@/app/components/Alert"
import * as constants from "@/utilities/constants"
import * as feedbackApis from "@/apis/feedback"

export default function Support({ params }) {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const [feedback, setFeedback] = useState(null)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const getFeedback = async () => {
    try {
      const response = await feedbackApis.getFeedback(userState.token, params.id)
      if (!response.status) throw new Error(response.message)

      setFeedback(response.feedback)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (userState.customer) router.replace("/wp/products")

    if (params.id) getFeedback()
  }, [])

  return (
    <>
      <Alert toast={toast} setToast={setToast} />
      <Container maxWidth="sm">
        <Typography variant="h4" fontWeight={700} my={3}>Feedback</Typography>

        {
          feedback && <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="body2" gutterBottom>TYPE</Typography>
              <Typography variant="body1" gutterBottom>{feedback.type}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" gutterBottom>STATUS</Typography>
              <Typography variant="body1" gutterBottom>{constants.feedbackStatus[feedback.status]}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" gutterBottom>REPORTED BY</Typography>
              <Typography variant="body1" gutterBottom>{feedback.name}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" gutterBottom>EMAIL</Typography>
              <Typography variant="body1" gutterBottom>{feedback.email}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" gutterBottom>OPENED</Typography>
              <Typography variant="body1" gutterBottom>{constants.getFormattedDatetime(feedback.opened)}</Typography>
            </Grid>
            {feedback.closed && <Grid item xs={6}>
              <Typography variant="body2" gutterBottom>CLOSED</Typography>
              <Typography variant="body1" gutterBottom>{constants.getFormattedDatetime(feedback.closed)}</Typography>
            </Grid>}
            {feedback.voided && <Grid item xs={6}>
              <Typography variant="body2" gutterBottom>VOIDED</Typography>
              <Typography variant="body1" gutterBottom>{constants.getFormattedDatetime(feedback.voided)}</Typography>
            </Grid>}
            <Grid item xs={12}>
              <Typography variant="body2" gutterBottom>PROBLEM</Typography>
              <Typography variant="body1" gutterBottom>{feedback.problem}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" gutterBottom>RESULT</Typography>
              <Typography variant="body1" gutterBottom>{feedback.result || "No result added by the support"}</Typography>
            </Grid>


            {feedback.urls && <Grid item xs={12}>
              <Typography variant="body2" gutterBottom>SCREENSHOTS</Typography>
              <Grid container spacing={1}>
                {JSON.parse(feedback.urls).map((item) => (
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
              </Grid>
            </Grid>}
          </Grid>
        }
      </Container>
    </>
  )
}