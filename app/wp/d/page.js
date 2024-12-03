"use client"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { alpha } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Header from "./components/Header"
import MainGrid from "./components/MainGrid"
import * as returnApis from "@/apis/return"
import * as fbaApis from "@/apis/fba"
import * as companyApis from "@/apis/company"
import Alert from "@/app/components/Alert"

export default function MarketingPage() {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const [count, setCount] = useState({})
  const [companies, setCompanies] = useState([])
  const [company_ids, setCompany_ids] = useState([])
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleCompanyChange = (event) => {
    const {
      target: { value },
    } = event

    const selectedId = typeof value === "string" ? value.split(',').map(Number) : value
    setCompany_ids(selectedId)
  }

  const getReturnCount = async () => {
    try {
      const response = await returnApis.getCount(userState.token)
      if (!response.status) throw new Error(response.message)

      setCount((previous) => {
        return {
          ...previous,
          ...response.returns
        }
      })
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const getFbaCount = async () => {
    try {
      const response = await fbaApis.getCount(userState.token)
      if (!response.status) throw new Error(response.message)

      setCount((previous) => {
        return {
          ...previous,
          ...response.fbas
        }
      })
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const getCompanies = async () => {
    try {
      const response = await companyApis.getCompanies(userState.token, "")
      if (!response.status) throw new Error(response.message)

      setCompanies(response.companies)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (userState.customer) router.replace("/products")
    if (userState.warehouseUser) getCompanies()

    getReturnCount()
    getFbaCount()
  }, [])

  return (
    <>
      <Alert toast={toast} setToast={setToast} />
      <Box sx={{ display: "flex" }}>
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 2 },
            }}
          >
            <MainGrid
              count={count}
              setToast={setToast}
              companies={companies}
              handleChange={handleCompanyChange}
              company_ids={company_ids}
            />
          </Stack>
        </Box>
      </Box>
    </>
    // </Layout>
  )
}