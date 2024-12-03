"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Loading from "@/app/components/Loading"
import axios from "@/app/utilities/axios"
import moment from "moment"
import * as serviceApis from "@/app/services/report"

export default function Auth(props) {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const [loading, setLoading] = useState(true)

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

  const getStripePostal = async () => {
    try {
      const response = await serviceApis.stripePortal(userState.token)
      if (!response.status) throw new Error(response.message)

      window.location.href = response.url
    } catch (error) {
      alert(error.message)
    }
  }

  useEffect(() => {
    if (!userState.user) return router.replace("/login")
    else if (userState.user.company && userState.user.company.payment_status !== "paid" && !userState.user.company.subscription_id) router.replace("/payment")
    else if (userState.user.company && userState.user.company.payment_status === "paid" && userState.user.company.subscription_id && userState.user.company.end_date < moment().format("YYYY-MM-DD")) return getStripePostal()

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