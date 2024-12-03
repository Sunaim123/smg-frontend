"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { FormProvider, useForm } from "react-hook-form"

import { styled } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import FormLabel from "@mui/material/FormLabel"
import FormControl from "@mui/material/FormControl"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import MuiCard from "@mui/material/Card"

import * as userApis from "@/apis/user"
import * as userSlice from "@/store/user"
import * as constants from "@/utilities/constants"
import Alert from "@/app/components/Alert"
import FormField from "@/app/components/forms/FormField"
import Layout from "@/app/components/Layout"
import { SitemarkIcon } from "@/app/auth/components/CustomIcons"

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

const Container = styled(Stack)(({ theme }) => ({
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

export default function Page() {
  const dispatch = useDispatch()
  const router = useRouter()
  const form = useForm({
    defaultValues: {
      username: "",
      password: ""
    }
  })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleSubmit = async (data) => {
    try {
      setLoading(true)

      const response = await userApis.login(data)
      if (!response.status) throw new Error(response.message)

      dispatch(userSlice.login(response))
      form.reset()

      const redirectUrl = constants.redirectUrls[response.user.type]
      if (redirectUrl) router.replace(redirectUrl)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <Alert toast={toast} setToast={setToast} />
      <Container direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Box textAlign="center">
            <SitemarkIcon />
            <Typography
              component="h1"
              variant="h4"
              sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
            >
              Sign in
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
                  <FormLabel htmlFor="username">Email or Username</FormLabel>
                  <FormField
                    id="username"
                    name="username"
                    placeholder="Username"
                    disabled={loading}
                    rules={{ required: "Username is required" }}
                  />
                </FormControl>
                <FormControl>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Link
                      component="button"
                      type="button"
                      onClick={() => router.push("/auth/validate-email")}
                      variant="body2"
                      sx={{ alignSelf: "baseline" }}
                    >
                      Forgot your password?
                    </Link>
                  </Box>
                  <FormField
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    disabled={loading}
                    rules={{ required: "Password is required" }}
                  />
                </FormControl>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  Sign in
                </Button>
                <Typography sx={{ textAlign: "center" }}>
                  Don&apos;t have an account?{" "}
                  <span>
                    <Link
                      component="button"
                      type="button"
                      onClick={() => router.push("/auth/signup")}
                      variant="body2"
                      sx={{ alignSelf: "center" }}
                    >
                      Sign up
                    </Link>
                  </span>
                </Typography>
              </Box>
            </form>
          </FormProvider>
        </Card>
      </Container>
    </Layout>
  )
}
