"use client"
import Pricing from "@/app/components/landing/Pricing"
import Layout from "@/app/components/Layout"

const Onboard = () => {
  return (
    <Layout topbar={true} footer={true}>
      <Pricing loggedIn={true} />
    </Layout>
  )
}

export default Onboard