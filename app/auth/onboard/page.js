"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { FormProvider, useForm } from "react-hook-form"

import { Box, Container, Card, CardActionArea, CardContent, Grid, Typography, TextField, Button } from "@mui/material"
import CheckOutlined from "@mui/icons-material/CheckOutlined"

import FormField from "@/app/components/forms/FormField"
import Alert from "@/app/components/Alert"
import Layout from "@/app/components/Layout"
import * as userApis from "@/apis/user"
import * as userSlice from "@/store/user"
import * as constants from "@/utilities/constants"

export default function Page() {
  const userState = useSelector(state => state.user)
  const dispatch = useDispatch()
  const router = useRouter()
  const form = useForm({
    defaultValues: {
      type: "",
      password: ""
    }
  })
  const [type, setType] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleType = (type) => {
    form.setValue("type", type)
    setType(type)
  }

  const handleSubmit = async (data) => {
    try {
      setLoading(true)

      const response = await userApis.onboard(userState.token, { ...data, type })
      if (!response.status) throw new Error(response.message)

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
      <Container maxWidth="sm">
        <Box my={10}>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12}>
                  <Typography variant="h5">What are you signing up for?</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Card sx={{ p: 0, backgroundColor: type === constants.userTypes.customer ? "action.selected" : "" }}>
                    <CardActionArea onClick={() => handleType(constants.userTypes.customer)}>
                      <CardContent sx={{ p: 1.6 }}>
                        <Box display="flex" alignItems="center">
                          <Box flex={1}>
                            <Typography variant="h6" component="div">Customer</Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>Explore amazing products and discount offers.</Typography>
                          </Box>
                          {type === constants.userTypes.customer && <CheckOutlined sx={{ fontSize: 20 }} />}
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card sx={{ p: 0, backgroundColor: type === constants.userTypes.seller ? "action.selected" : "" }}>
                    <CardActionArea onClick={() => handleType(constants.userTypes.seller)}>
                      <CardContent sx={{ p: 1.6 }}>
                        <Box display="flex" alignItems="center">
                          <Box flex={1}>
                            <Typography variant="h6" component="div">Become a Seller</Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>Sign up to become a seller on the new leading marketplace.</Typography>
                          </Box>
                          {type === constants.userTypes.seller && <CheckOutlined sx={{ fontSize: 20 }} />}
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card sx={{ p: 0, backgroundColor: type === constants.userTypes.warehouse ? "action.selected" : "" }}>
                    <CardActionArea onClick={() => handleType(constants.userTypes.warehouse)}>
                      <CardContent sx={{ p: 1.6 }}>
                        <Box display="flex" gap={2} alignItems="center">
                          <Box flex={1}>
                            <Typography variant="h6" component="div">Subscribe for Warehouse</Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>Sign up for managing your returns and fulfilments. Get access to our latest exciting and amazing inventory.</Typography>
                          </Box>
                          {type === constants.userTypes.warehouse && <CheckOutlined sx={{ fontSize: 20 }} />}
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>

                {type && type !== constants.userTypes.customer && <Grid item xs={12}>
                  <Box display="flex" flexDirection="column" justifyContent="center" alignItems="flex-start" gap={1} mt={5}>
                    <Typography variant="h5">Provide your Company Name</Typography>
                    <FormField
                      id="company"
                      name="company"
                      placeholder="Company Name"
                      disabled={loading}
                      rules={{ required: "Company Name is required" }}
                    />
                  </Box>
                </Grid>}

                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" fullWidth>Continue</Button>
                </Grid>
              </Grid>
            </form>
          </FormProvider>
        </Box>
      </Container>
    </Layout>
  )
}
