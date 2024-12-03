"use client"
import Divider from "@mui/material/Divider"

import Layout from "@/app/components/Layout"
import Hero from "@/app/components/landing/Hero"
import LogoCollection from "@/app/components/landing/LogoCollection"
import Highlights from "@/app/components/landing/Highlights"
import Pricing from "@/app/components/landing/Pricing"
import Features from "@/app/components/landing/Features"
import Testimonials from "@/app/components/landing/Testimonials"
import FAQ from "@/app/components/landing/FAQ"

export default function Page() {
  return (
    <Layout>
      <Hero />
      {/* <LogoCollection /> */}
      <Features />
      <Divider />
      <Testimonials />
      <Divider />
      <Highlights />
      <Divider />
      <Pricing />
      <Divider />
      <FAQ />
    </Layout>
  )
}