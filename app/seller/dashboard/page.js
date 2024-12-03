"use client"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Box, Container, Grid, Typography } from "@mui/material"

import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import SellerNavbar from "@/app/components/SellerNavbar"
import DashboardCard from "@/app/components/DashboardCard"

import * as orderApis from "@/app/apis/order"

export default function Dashboard() {
  const userState = useSelector(state => state.user)
  const [count, setCount] = useState({})
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const received = count["order received"] || 0
  const awaitingPayment = count["order awaiting payment"] || 0
  const shipped = count["order shipped"] || 0
  const cancelled = count["order cancelled"] || 0
  const refunded = count["order refunded"] || 0
  const payouts = count["order payouts"] || 0
  const totalOrders = received + awaitingPayment + shipped + cancelled + refunded

  const cards = [
    { id: "total-orders", title: "Total Orders", link: "/seller/listings/orders", extra: <Typography fontSize={60} fontWeight={900} textAlign="right">{totalOrders}</Typography> },
    { id: "received-orders", title: "Awaiting Payment", link: "/seller/listings/orders?status=Awaiting Payment", extra: <Typography fontSize={60} fontWeight={900} textAlign="right">{awaitingPayment}</Typography> },
    { id: "request-ship-orders", title: "Awaiting Shipment", link: "/seller/listings/orders?status=Received", extra: <Typography fontSize={60} fontWeight={900} textAlign="right">{received}</Typography> },
    { id: "shipped-orders", title: "Orders Shipped", link: "/seller/listings/orders?status=Shipped", extra: <Typography fontSize={60} fontWeight={900} textAlign="right">{shipped}</Typography> },
    { id: "cancelled-orders", title: "Orders Cancelled", link: "/seller/listings/orders?status=Cancelled", extra: <Typography fontSize={60} fontWeight={900} textAlign="right">{cancelled}</Typography> },
    { id: "refunded-orders", title: "Orders Refunded", link: "/seller/listings/orders?status=Refunded", extra: <Typography fontSize={60} fontWeight={900} textAlign="right">{refunded}</Typography> },
    { id: "upcoming-payouts", title: "Upcoming Payouts", link: "/seller/listings/orders", extra: <Typography fontSize={60} fontWeight={900} textAlign="right">${payouts?.toFixed(2)}</Typography> },
  ]

  const getOrderCount = async () => {
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
    getOrderCount()
  }, [])

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <SellerNavbar />

      <Container maxWidth="xl">
        <Box display="flex" flexDirection="column" gap={3} py={3}>

          <Grid container spacing={3}>
            {cards.map((card) => (
              <Grid key={card.id} item xs={3}>
                <DashboardCard {...card} />
              </Grid>
            ))}
          </Grid>

        </Box>
      </Container>
    </Auth>
  )
}