"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { FormProvider, useForm } from "react-hook-form"
import { Box, Button, Checkbox, Container, FormControlLabel, Grid, TextField, Tooltip, Typography } from "@mui/material"

import Alert from "@/app/components/Alert"
import Loading from "@/app/components/Loading"
import * as returnApis from "@/apis/return"
import FormField from "@/app/components/forms/FormField"

export default function Service() {
  const userState = useSelector((state) => state.user)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [_return, setReturn] = useState(null)
  const [services, setServices] = useState({
    inspection: {
      title: "Inspection",
      checked: false,
      notes: null,
      price: 4.99,
    },
    repackaging: {
      title: "Repackaging",
      checked: false,
      notes: null,
      price: 0,
    },
  })
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })
  const form = useForm()

  const handleServiceCheck = (e, key) => {
    setServices((previous) => {
      previous[key].checked = e.target.checked
      return { ...previous }
    })
  }

  const handleServiceNotes = (e, key) => {
    setServices((previous) => {
      previous[key].notes = e.target.value
      return { ...previous }
    })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      const serviceSelected = Object.values(services).some(service => service.checked)
      if (!serviceSelected) throw new Error("Select atleast one service to continue")

      const payload = {
        return_id: _return.id,
        services: []
      }

      Object.keys(services).map((key) => {
        if (services[key].checked)
          payload.services.push({
            payment_status: "unpaid",
            price: services[key].price,
            quantity: 1,
            return_id: _return.id,
            status: "requested",
            company_notes: services[key].notes,
            type: key
          })
      })

      const response = await returnApis.createReturnService(userState.token, payload)
      if (!response.status) throw new Error(response.message)

      setToast({ type: "success", open: true, message: "Return service(s) created" })
      router.back()
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    } finally {
      setLoading(false)
    }
  }

  const getReturn = async () => {
    try {
      const response = await returnApis.getReturn(userState.token, searchParams.get("id"))
      if (!response.status) throw new Error(response.message)

      setReturn(response.return)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (userState.customer) router.replace("/products")
    getReturn()
  }, [])

  if (!_return)
    return (
      <Loading />
    )

  const servicesTaken = JSON.parse(_return.services || '[]')

  return (
    <>
      <Alert toast={toast} setToast={setToast} />
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight={700} my={3}>Add Services</Typography>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            {Object.keys(services).map((key) => {
              const taken = servicesTaken.includes(key)

              return (
                <Box mb={3}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Tooltip title={taken ? "Service taken" : ""} placement="top">
                      <FormControlLabel control={<Checkbox checked={services[key].checked} onChange={(e) => handleServiceCheck(e, key)} />} label={services[key].title} disabled={taken} />
                    </Tooltip>
                    <Typography variant="body1">Price: {services[key].title === 'Inspection' ? `$${services[key].price}` : 'To be calculated'}</Typography>
                  </Box>
                  <Tooltip title={taken ? "Service taken" : ""} placement="top">
                    <FormField
                      label="Notes"
                      name={`${key}_notes`}
                      size="small"
                      fullWidth
                      disabled={taken}
                      value={services[key].notes}
                      onChange={(e) => handleServiceNotes(e, key)}
                    />
                  </Tooltip>
                </Box>
              )
            })}

            <Grid container>
              <Grid item xs={9} />
              <Grid item xs={3}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                >Submit</Button>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </Container>
    </>
  )
}
