"use client"
import { styled } from "@mui/material/styles"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import FormLabel from "@mui/material/FormLabel"
import FormControl from "@mui/material/FormControl"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import MuiCard from "@mui/material/Card"
import Layout from "@/app/components/Layout"
import { SitemarkIcon } from "../components/CustomIcons"
import Alert from "@/app/components/Alert"
import * as userApis from "@/apis/user"
import FormField from "@/app/components/forms/FormField"

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}))

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100%",
  marginTop: theme.spacing(8),
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}))

export default function ResetPassword() {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })
  const form = useForm({
    defaultValues: {
      password: "",
      confirm_password: ""
    }
  })

  const handleSubmit = async (data) => {
    try {
      setLoading(true)

      const payload = {
        email: userState.email,
        password: data.password,
      }
      const response = await userApis.resetPassword(payload)
      if (!response.status) throw new Error(response.message)

      form.reset()

      router.replace("/auth/signin")
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <Alert toast={toast} setToast={setToast} />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Box textAlign="center">
            <SitemarkIcon />
            <Typography
              component="h1"
              variant="h4"
              sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
            >
              Reset Password
            </Typography>
          </Box>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  gap: 2,
                }}
              >
                <FormControl>
                  <FormLabel htmlFor="username">Password</FormLabel>
                  <FormField
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    rules={{
                      required: "Password is required",
                      pattern: {
                        value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                        message: "Password should have 8 characters, an uppercase, a lowercase, a number, and a special character"
                      },
                    }} />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="password">Confirm Password</FormLabel>
                  <FormField
                    type="password"
                    name="confirm_password"
                    placeholder="••••••••"
                    rules={{
                      required: "Confirm your password",
                      validate: (value) =>
                        value === form.getValues("password") || "Passwords do not match",
                    }} />
                </FormControl>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                >
                  Continue
                </Button>
                <Typography sx={{ textAlign: "center" }}>
                  <span>
                    <Link
                      href="/auth/signin"
                      variant="body2"
                      sx={{ alignSelf: "center" }}
                    >
                      Back to Login
                    </Link>
                  </span>
                </Typography>
              </Box>
            </form>
          </FormProvider>
        </Card>
      </SignInContainer>
    </Layout>
  )
}
