"use client"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Box, Button, Container } from "@mui/material"

import Auth from "@/app/components/Auth"
import Navbar from "@/app/components/Navbar"
import * as stripeService from "@/app/services/stripe"

export default function Status() {
  const userState = useSelector((state) => state.user)

  const handleLink = (link) => {
    window.location.href = link
  }

  const getCompany = async () => {
    try {
      const response = await stripeService.getBillingPortal(userState.token)
      if (!response.status) throw new Error(response.message)

      window.location.href = response.url
    } catch (error) {
      alert(error.message)
    }
  }

  useEffect(() => {
    // getCompany()
  }, [])

  return (
    <Auth>
      <Navbar />

      <Container maxWidth="xl">
        <Box my={5}>
          {!(userState.user?.company && userState.user.company.subscription_id)
            ? <>
              <h1>No subscription found</h1>
              <Button variant="contained" disableElevation onClick={() => handleLink('/#pricing')}>Add Payment Method</Button>
            </>
            : <Button variant="contained" disableElevation onClick={getCompany}>Open Customer Portal</Button>
          }
        </Box>
      </Container>
    </Auth>
  )
}