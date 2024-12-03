"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { Box, Card, Container, Divider, List, ListItem, ListItemButton, ListItemText, Typography, Button, TextField } from "@mui/material"

import axios from "@/app/utilities/axios"
import * as userApis from "@/app/apis/user"
import * as userSlice from "@/app/store/user"

const Payment = () => {
  const userState = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const router = useRouter()
  const [coupon, setCoupon] = useState("")

  const handleSubscribe = async (price, coupon) => {
    try {
      const { data: response } = await axios.post("/service/stripe/subscribe", { price, coupon, email: userState.user.email }, {
        headers: {
          "Token": userState.token,
        }
      })
      if (!response.status) throw new Error(response.message)

      router.replace(response.url)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout")) return

    const response = await userApis.logout({ token: userState.token })
    if (!response.status) throw new Error(response.message)

    dispatch(userSlice.logout())
    router.replace("/login")
  }

  useEffect(() => {
    if (userState.customer) router.replace("/products")
  }, [])

  return (
    <Container maxWidth="sm">
      <Box mt={10}>
        <Typography variant="h3" textAlign="center" fontWeight={700}>Payment</Typography>
        <Typography color="GrayText" textAlign="center" mb={5}>Complete your payment to continue using our services</Typography>

        <Box mb={2}>
          <TextField
            label="Coupon Code"
            variant="outlined"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
        </Box>

        <Card variant="outlined">
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleSubscribe(process.env.NEXT_PUBLIC_STARTER, coupon)}>
                <ListItemText
                  primary="Starter"
                  primaryTypographyProps={{
                    gutterBottom: true,
                    variant: "h5"
                  }}
                  secondary={
                    <>
                      <Typography gutterBottom>Unlock essential features with our Starter package. Perfect for beginners looking to get started quickly.</Typography>
                      <Typography variant="h5" textAlign="right">$ 99.99</Typography>
                    </>
                  }
                />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleSubscribe(process.env.NEXT_PUBLIC_STANDARD, coupon)}>
                <ListItemText
                  primary="Standard"
                  primaryTypographyProps={{
                    gutterBottom: true,
                    variant: "h5"
                  }}
                  secondary={
                    <>
                      <Typography gutterBottom>Take your experience to the next level with our Standard Package. Enjoy a balanced set of features suitable for individuals and small businesses.</Typography>
                      <Typography variant="h5" textAlign="right">$ 299.99</Typography>
                    </>
                  }
                />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleSubscribe(process.env.NEXT_PUBLIC_PREMIUM, coupon)}>
                <ListItemText
                  primary="Premium"
                  primaryTypographyProps={{
                    gutterBottom: true,
                    variant: "h5"
                  }}
                  secondary={
                    <>
                      <Typography gutterBottom>Experience the ultimate with our Premium Package. Unleash the full power of our platform with advanced features designed for businesses and professionals.</Typography>
                      <Typography variant="h5" textAlign="right">$ 499.99</Typography>
                    </>
                  }
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Card>

        <Box textAlign="center" my={2}>
          <Button variant="contained" color="error" size="large" disableElevation fullWidth onClick={handleLogout}>Logout</Button>
        </Box>
      </Box>
    </Container>
  )
}

export default Payment
