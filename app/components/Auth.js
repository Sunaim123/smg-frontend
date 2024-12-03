"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Loading from "@/app/components/Loading"
import axios from "@/app/utilities/axios"
import * as stripeService from "@/app/services/stripe"

export default function Auth(props) {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const getBillingPortal = async () => {
    try {
      const response = await stripeService.getBillingPortal(userState.token)
      if (!response.status) throw new Error(response.message)

      router.replace(response.url)
    } catch (error) {
      router.replace("/login")
    }
  }

  const validateSession = async () => {
    try {
      const { data: response } = await axios.post("/api/user/validate", {
        token: userState.token
      })
      if (!response.status) throw new Error(response.message)

      setLoading(false)
    } catch (error) {
      router.replace("/login")
    }
  }

  useEffect(() => {
    if (!userState.user) return router.replace("/login")
    if (userState.companyUser) {
      if (!userState.user.company) return router.replace("/login")

      const hasSubscription = userState.user.company.subscription_id
      const isUnpaid = userState.user.company.payment_status !== "paid"

      if (hasSubscription && isUnpaid) getBillingPortal()
      if (!hasSubscription && isUnpaid) return router.replace("/payment")
    }

    validateSession()
  }, [])

  if (loading)
    return (
      <Loading />
    )

  return (
    props.children
  )
}