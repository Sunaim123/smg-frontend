import * as React from "react"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import Chip from "@mui/material/Chip"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import Container from "@mui/material/Container"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid2"
import Typography from "@mui/material/Typography"

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import axios from "@/utilities/axios"
import Alert from "../Alert"

const tiers = [
  {
    title: "Starter",
    price: "99.99",
    description: [
      "1 user included",
      "1 rack space",
      "10 returns",
      "Help center access",
      "Email support",
    ],
    buttonText: "Sign up for free",
    buttonVariant: "outlined",
    buttonColor: "primary",
    priceId: process.env.NEXT_PUBLIC_STARTER,
  },
  {
    title: "Standard",
    subheader: "Recommended",
    price: "299.99",
    description: [
      "1 user included",
      "3 rack space",
      "30 returns",
      "Help center access",
      "Priority email support",
      "Dedicated team",
      "Best deals",
    ],
    buttonText: "Start now",
    buttonVariant: "contained",
    buttonColor: "secondary",
    priceId: process.env.NEXT_PUBLIC_STANDARD,
  },
  {
    title: "Premium",
    price: "499.99",
    description: [
      "1 user included",
      "5 rack space",
      "50 returns",
      "Help center access",
      "Phone & email support",
    ],
    buttonText: "Sign up for free",
    buttonVariant: "outlined",
    buttonColor: "primary",
    priceId: process.env.NEXT_PUBLIC_PREMIUM,
  },
]

export default function Pricing({ loggedIn = false }) {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const [toast, setToast] = React.useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleSubscribe = async (price) => {
    try {
      if (!loggedIn) return router.replace("/auth/signup")

      const { data: response } = await axios.post("/service/stripe/subscribe", { price }, {
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

  return (
    <Container
      id="pricing"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Alert toast={toast} setToast={setToast} />
      <Box
        sx={{
          width: { sm: "100%", md: "60%" },
          textAlign: { sm: "left", md: "center" },
        }}
      >
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: "text.primary" }}
        >
          Pricing
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Stock my Goods offers best price and quality of services
          accross Texas. <br />
          It&apos;s built for eCommerce businesses so they can focus
          on their sales.
        </Typography>
      </Box>
      <Grid
        container
        spacing={3}
        sx={{ alignItems: "center", justifyContent: "center", width: "100%" }}
      >
        {tiers.map((tier) => (
          <Grid
            size={{ xs: 12, sm: tier.title === "Premium" ? 12 : 6, md: 4 }}
            key={tier.title}
          >
            <Card
              sx={[
                {
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                },
                tier.title === "Standard" &&
                ((theme) => ({
                  border: "none",
                  background:
                    "radial-gradient(circle at 50% 0%, hsl(220, 20%, 35%), hsl(220, 30%, 6%))",
                  boxShadow: `0 8px 12px hsla(220, 20%, 42%, 0.2)`,
                  ...theme.applyStyles("dark", {
                    background:
                      "radial-gradient(circle at 50% 0%, hsl(220, 20%, 20%), hsl(220, 30%, 16%))",
                    boxShadow: `0 8px 12px hsla(0, 0%, 0%, 0.8)`,
                  }),
                })),
              ]}
            >
              <CardContent>
                <Box
                  sx={[
                    {
                      mb: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2,
                    },
                    tier.title === "Standard"
                      ? { color: "grey.100" }
                      : { color: "" },
                  ]}
                >
                  <Typography component="h3" variant="h6">
                    {tier.title}
                  </Typography>
                  {tier.title === "Standard" && (
                    <Chip icon={<AutoAwesomeIcon />} label={tier.subheader} />
                  )}
                </Box>
                <Box
                  sx={[
                    {
                      display: "flex",
                      alignItems: "baseline",
                    },
                    tier.title === "Standard"
                      ? { color: "grey.50" }
                      : { color: null },
                  ]}
                >
                  <Typography component="h3" variant="h2">
                    ${tier.price}
                  </Typography>
                  <Typography component="h3" variant="h6">
                    &nbsp; per month
                  </Typography>
                </Box>
                <Divider sx={{ my: 2, opacity: 0.8, borderColor: "divider" }} />
                {tier.description.map((line) => (
                  <Box
                    key={line}
                    sx={{ py: 1, display: "flex", gap: 1.5, alignItems: "center" }}
                  >
                    <CheckCircleRoundedIcon
                      sx={[
                        {
                          width: 20,
                        },
                        tier.title === "Standard"
                          ? { color: "primary.light" }
                          : { color: "primary.main" },
                      ]}
                    />
                    <Typography
                      variant="subtitle2"
                      component={"span"}
                      sx={[
                        tier.title === "Standard"
                          ? { color: "grey.50" }
                          : { color: null },
                      ]}
                    >
                      {line}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant={tier.buttonVariant}
                  color={tier.buttonColor}
                  onClick={() => handleSubscribe(tier.priceId)}
                >
                  {!loggedIn ? tier.buttonText : "Continue"}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
