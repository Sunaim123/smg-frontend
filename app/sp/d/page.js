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
import * as orderApis from "@/apis/order"
import Alert from "@/app/components/Alert"

export default function MarketingPage() {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const [count, setCount] = useState({})
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

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

  const getOrdersCount = async () => {
    try {
      const response = await orderApis.getCount(userState.token)
      if (!response.status) throw new Error(response.message)

      setCount((previous) => {
        return {
          ...previous,
          ...response.orders
        }
      })
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (userState.customer) router.replace("/products")

    getReturnCount()
    getOrdersCount()
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
            <MainGrid count={count}/>
          </Stack>
        </Box>
      </Box>
    </>
  )
}