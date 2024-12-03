"use client"
import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FormProvider, useForm } from "react-hook-form"
import { Button } from "@mui/material"

import Alert from "./Alert"
import * as userSlice from "../../store/user"
import * as companyApis from "../../apis/company"
import FormField from "./forms/FormField"

export default function Company() {
  const dispatch = useDispatch()
  const userState = useSelector(state => state.user)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })
  const form = useForm({
    defaultValues: {
      name: userState.user?.company?.name,
      email: userState.user?.company?.email,
      mobile: userState.user?.company?.mobile,
    }
  })

  const handleSubmit = async (data) => {
    try {

      const name = data.name
      const email = data.email
      const mobile = data.mobile || null
      const payload = {
        company: {
          id: userState.user.company_id,
          name: name,
          email: email,
          mobile: mobile
        }
      }

      const response = await companyApis.updateCompany(userState.token, payload)
      if (!response.status) throw new Error(response.message)

      form.reset({
        name: "",
        email: "",
        mobile: ""
      })
      setToast({ type: "success", open: true, message: "company saved" })
      dispatch(userSlice.company(response.company))
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  return (
    <>
      <Alert toast={toast} setToast={setToast} />
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField label="Name" variant="outlined" name="name" sx={{ my: 1 }} />
          <FormField label="Email" variant="outlined" name="email" sx={{ my: 1 }} />
          <FormField label="Mobile" variant="outlined" name="mobile" sx={{ my: 1 }} />
          <Button
            size="large"
            type="submit"
            variant="contained"
            color="primary"
            disableElevation
            fullWidth
            sx={{ my: 1 }}
          >
            Save
          </Button>
        </form>
      </FormProvider>
    </>
  )
}