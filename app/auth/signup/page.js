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
import FormCheck from "@/app/components/forms/FormCheck"
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
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
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
      name: "",
      email: "",
      company: "",
      mobile: "",
      username: "",
      password: "",
      terms: false,
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

      const payload = {
        user: {
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          username: data.email,
          password: data.password
        },
      }
      const registerResponse = await userApis.register(payload)
      if (!registerResponse.status) throw new Error(registerResponse.message)

      dispatch(userSlice.register(registerResponse))
      form.reset()

      router.replace(constants.redirectUrls.awaiting_onboard)
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
        <FormProvider {...form}>
          <Card variant="outlined">
            <Box textAlign="center">
              <SitemarkIcon />
              <Typography
                component="h1"
                variant="h4"
                sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
              >
                Sign up
              </Typography>
            </Box>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <FormControl>
                    <FormLabel htmlFor="name">Full name</FormLabel>
                    <FormField
                      id="name"
                      name="name"
                      disabled={loading}
                      rules={{ required: "Name is required" }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="name">Mobile</FormLabel>
                    <FormField
                      id="mobile"
                      name="mobile"
                      disabled={loading}
                      rules={{ required: "Mobile is required" }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormField
                      id="email"
                      name="email"
                      disabled={loading}
                      rules={{
                        required: "Email is required",
                        pattern: {
                          value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                          message: "Email address should be like john.doe@gmail.com"
                        },
                      }}
                      type="email"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormField
                      type="password"
                      id="password"
                      name="password"
                      disabled={loading}
                      rules={{
                        required: "Password is required",
                        pattern: {
                          value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                          message: "Password should have 8 characters, an uppercase, a lowercase, a number, and a special character"
                        },
                      }}
                    />
                  </FormControl>
                  <FormCheck
                    id="terms"
                    name="terms"
                    label={<Typography>
                      {"I agree to the "}
                      <span>
                        <Link
                          component="button"
                          type="button"
                          onClick={() => router.replace("/terms")}
                          variant="body2"
                        >
                          Terms of Use
                        </Link>
                      </span>
                      {" and "}
                      <span>
                        <Link
                          component="button"
                          type="button"
                          onClick={() => router.replace("/privacy")}
                          variant="body2"
                        >
                          Privacy Policy
                        </Link>
                      </span>
                      {" of Stock my Goods."}
                    </Typography>}
                    disabled={loading}
                    rules={{
                      required: "Please tick the checkbox to accept our terms of use and privacy policy"
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                  >
                    Sign up
                  </Button>
                  <Typography sx={{ textAlign: "center" }}>
                    Already have an account?{" "}
                    <span>
                      <Link
                        component="button"
                        type="button"
                        onClick={() => router.replace("/auth/signin")}
                        variant="body2"
                        sx={{ alignSelf: "center" }}
                      >
                        Sign in
                      </Link>
                    </span>
                  </Typography>
                </Box>
              </form>
            </FormProvider>
          </Card>
        </FormProvider>
      </Container>
    </Layout>
  )
}