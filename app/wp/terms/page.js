"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useSelector } from "react-redux"
import { Box, Button, Checkbox, Container, FormControlLabel, Typography } from "@mui/material"

import Alert from "@/app/components/Alert"
import Layout from "@/app/components/Layout"

export default function Page() {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const [terms, setTerms] = useState(false)
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  return (
    <Layout>
      <Box
        id="hero"
        sx={(theme) => ({
          width: "100%",
          backgroundRepeat: "no-repeat",
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)",
          ...theme.applyStyles("dark", {
            backgroundImage:
              "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)",
          }),
        })}
      >
        <Alert toast={toast} setToast={setToast} />
        <Container sx={{ py: 4 }}>
          <Typography variant="h3" textAlign="center" fontWeight="bold" padding="1rem">Fulfillment Terms &amp; Conditions</Typography>
          <Typography variant="body1" gutterBottom>Last update: 16th September 2024</Typography>

          <Typography variant="h6" gutterBottom fontWeight={700}>1. Acceptance of Terms</Typography>
          <ul>
            <li><Typography variant="body1" gutterBottom>By accessing or using Stock my Goods ("Warehouse or Fulfillment Services"), you agree to comply with and be bound by these Terms of Use ("Terms"). If you do not agree with these Terms, please do not use the Warehouse or Fulfillment Services.</Typography></li>
          </ul>

          <Typography variant="h6" gutterBottom fontWeight={700}>2. Eligibility</Typography>
          <ul>
            <li><Typography variant="body1" gutterBottom>To use the Warehouse or Fulfillment Services, you must be at least 18 years old or have the consent of a parent or guardian. By using the Warehouse or Fulfillment Services, you represent and warrant that you meet these eligibility requirements.</Typography></li>
          </ul>

          <Typography variant="h6" gutterBottom fontWeight={700}>3. User Accounts</Typography>
          <ul>
            <li><Typography variant="body1" gutterBottom>Registration: You must create an account to use certain features of the Warehouse or Fulfillment Services. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.</Typography></li>
            <li><Typography variant="body1" gutterBottom>Responsibility: You are responsible for maintaining the confidentiality of your account and password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</Typography></li>
          </ul>

          <Typography variant="h6" gutterBottom fontWeight={700}>4. Warehouse or Fulfillment Services Use</Typography>
          <ul>
            <li><Typography variant="body1" gutterBottom>Permitted Use: You may use the Warehouse or Fulfillment Services for lawful purposes and in accordance with these Terms. You agree not to use the Warehouse or Fulfillment Services in any way that could damage, disable, overburden, or impair the Warehouse or Fulfillment Services or interfere with any other party's use of the Warehouse or Fulfillment Services.</Typography></li>
            <li><Typography variant="body1" gutterBottom>Prohibited Activities: You may not engage in any illegal activities or violate any laws, including but not limited to fraud, hacking, or distributing malware.</Typography></li>
          </ul>

          <Typography variant="h6" gutterBottom fontWeight={700}>5. Product Listings</Typography>
          <ul>
            <li><Typography variant="body1" gutterBottom>Seller Responsibility: Sellers are responsible for the accuracy of product listings, including descriptions, images, and pricing. The Warehouse or Fulfillment Services does not guarantee the accuracy or completeness of product information.</Typography></li>
            <li><Typography variant="body1" gutterBottom>Buyer's Responsibility: Buyers are responsible for reviewing product details and making informed purchasing decisions.</Typography></li>
          </ul>

          <Typography variant="h6" gutterBottom fontWeight={700}>6. Transactions</Typography>
          <ul>
            <li><Typography variant="body1" gutterBottom>Payment Collection: The Warehouse or Fulfillment Services collects payments from buyers on behalf of sellers. All transactions are processed through Stripe connected accounts. By using the Warehouse or Fulfillment Services, you agree to Stripe's Terms of Service and Privacy Policy, which govern payment processing. For more information, please review Stripe's Terms of Service and Privacy Policy.</Typography></li>
            <li><Typography variant="body1" gutterBottom>Payouts: The Warehouse or Fulfillment Services processes payouts to sellers on a daily basis. Payments are disbursed to sellers' connected accounts according to the Warehouse or Fulfillment Services's payout schedule.</Typography></li>
            <li><Typography variant="body1" gutterBottom>Return Payments: If necessary, the Warehouse or Fulfillment Services may hold payments related to returns until the return process is completed. Refunds will be processed according to the individual seller's return policy and may be issued after the return has been inspected and approved.</Typography></li>
          </ul>

          <Typography variant="h6" gutterBottom fontWeight={700}>7. Intellectual Property</Typography>
          <ul>
            <li><Typography variant="body1" gutterBottom>Ownership: The content and materials available on the Warehouse or Fulfillment Services, including but not limited to text, graphics, logos, and software, are the property of the Warehouse or Fulfillment Services or its licensors and are protected by intellectual property laws.</Typography></li>
            <li><Typography variant="body1" gutterBottom>Limited License: You are granted a limited, non-exclusive, non-transferable license to access and use the Warehouse or Fulfillment Services for personal, non-commercial purposes.</Typography></li>
          </ul>

          <Typography variant="h6" gutterBottom fontWeight={700}>8. Limitation of Liability</Typography>
          <ul>
            <li><Typography variant="body1" gutterBottom>To the fullest extent permitted by law, the Warehouse or Fulfillment Services is not liable for any indirect, incidental, consequential, or punitive damages arising from or related to your use of the Warehouse or Fulfillment Services.</Typography></li>
          </ul>

          <Typography variant="h6" gutterBottom fontWeight={700}>9. Indemnification</Typography>
          <ul>
            <li><Typography variant="body1" gutterBottom>You agree to indemnify and hold harmless the Warehouse or Fulfillment Services, its affiliates, and their respective officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of your use of the Warehouse or Fulfillment Services or violation of these Terms.</Typography></li>
          </ul>

          <Typography variant="h6" gutterBottom fontWeight={700}>10. Changes to Terms</Typography>
          <ul>
            <li><Typography variant="body1" gutterBottom>The Warehouse or Fulfillment Services reserves the right to modify these Terms at any time. Any changes will be posted on this page, and your continued use of the Warehouse or Fulfillment Services constitutes acceptance of the updated Terms.</Typography></li>
          </ul>

          <Typography variant="h6" gutterBottom fontWeight={700}>11. Governing Law</Typography>
          <ul>
            <li><Typography variant="body1" gutterBottom>These Terms are governed by and construed in accordance with the laws of United States, India, & Pakistan. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of United States, India, & Pakistan.</Typography></li>
          </ul>

          <Typography variant="h6" gutterBottom fontWeight={700}>12. Contact Us</Typography>
          <ul>
            <li><Typography variant="body1" gutterBottom>If you have any questions about these Terms or the Warehouse or Fulfillment Services, please contact us at stockmygoods@gmail.com or +1 (832) 735 0733.</Typography></li>
          </ul>

          <FormControlLabel
            control={<Checkbox name="terms" onChange={() => setTerms(!terms)} />}
            label="I agree to the Terms of Use and Privacy Policy of Stock my Goods (Warehouse and Fulfillment Services)"
          />

          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!terms) throw new Error("Please tick the checkbox to accept Terms of Use and Privacy Policy")
                router.replace("/wp/onboard")
              }}
              color="primary" variant="contained" size="small"
            >
              Agree & Continue
            </Button>
          </Box>
        </Container>
      </Box>
    </Layout>
  )
}