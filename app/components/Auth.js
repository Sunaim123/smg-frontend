"use client"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Loading from "./Loading"
import axios from "../../utilities/axios"
import moment from "moment"
import * as serviceApis from "../../services/report"
import * as companyApis from  "../../apis/company"

export default function Auth(props) {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [company, setCompany] = useState(null)

  const validateSession = async () => {
    try {
      const { data: response } = await axios.post("/api/user/validate", {
        token: userState.token
      })
      if (!response.status) throw new Error(response.message)

      setLoading(false)
    } catch (error) {
      router.replace("/auth/signin")
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

  const getCompany = async () => {
    try {
      const response = await companyApis.getCompany(userState.token, userState.user.company_id)
      if (!response.status) throw new Error(response.message)

      setCompany(response.company)
    } catch (error) {
      alert(error.message)
    }
  }
  
  useEffect(() => {
    if (userState.user?.type === "pending") router.replace("/auth/onbaord")
    if (userState.companyUser) getCompany()
  }, [])

  useEffect(() => {
    if (!userState.user) return router.replace("/auth/signin")
    else if (company && company.payment_status === "paid" && company.subscription_id && company.end_date < moment().format("YYYY-MM-DD")) return getStripePostal()

    validateSession()

    if (userState.warehouseUser && pathname.startsWith("/sp")) router.replace("/wp/d")
    if (company && company.status === "onboard" && !company.subscription_id && pathname.startsWith("/wp")) router.replace("/sp/d")
    if (company && company.status !== "onboard" && company.subscription_id && pathname.startsWith("/sp")) router.replace("/wp/d")
  }, [company])

  if (loading)
    return (
      <Loading />
    )

  return (
    props.children
  )
}