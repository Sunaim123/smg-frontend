import { useState } from "react"
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Typography } from "@mui/material"

const TermsAndConditions = (props) => {
  const [state, setState] = useState(false)

  return (
    <Box>
      <Dialog
        maxWidth="md"
        open={props.open}
        onClose={() => props.setOpen(false)}
        PaperProps={{
          component: "form",
          onSubmit: props.onSubmit,
        }}
      >
        <DialogTitle borderBottom={1} borderColor="lightgray">Terms of Use & Privacy Policy</DialogTitle>
        <DialogContent>
          <Box py={2}>
            <Typography variant="body1" gutterBottom>Last update: 16th September 2024</Typography>

            <Typography variant="h6" gutterBottom fontWeight={700}>1. Acceptance of Terms</Typography>
            <ul>
              <li><Typography variant="body1" gutterBottom>By accessing or using Stock my Goods ("Marketplace"), you agree to comply with and be bound by these Terms of Use ("Terms"). If you do not agree with these Terms, please do not use the Marketplace.</Typography></li>
            </ul>

            <Typography variant="h6" gutterBottom fontWeight={700}>2. Eligibility</Typography>
            <ul>
              <li><Typography variant="body1" gutterBottom>To use the Marketplace, you must be at least 18 years old or have the consent of a parent or guardian. By using the Marketplace, you represent and warrant that you meet these eligibility requirements.</Typography></li>
            </ul>

            <Typography variant="h6" gutterBottom fontWeight={700}>3. User Accounts</Typography>
            <ul>
              <li><Typography variant="body1" gutterBottom>Registration: You must create an account to use certain features of the Marketplace. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.</Typography></li>
              <li><Typography variant="body1" gutterBottom>Responsibility: You are responsible for maintaining the confidentiality of your account and password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</Typography></li>
            </ul>

            <Typography variant="h6" gutterBottom fontWeight={700}>4. Marketplace Use</Typography>
            <ul>
              <li><Typography variant="body1" gutterBottom>Permitted Use: You may use the Marketplace for lawful purposes and in accordance with these Terms. You agree not to use the Marketplace in any way that could damage, disable, overburden, or impair the Marketplace or interfere with any other party's use of the Marketplace.</Typography></li>
              <li><Typography variant="body1" gutterBottom>Prohibited Activities: You may not engage in any illegal activities or violate any laws, including but not limited to fraud, hacking, or distributing malware.</Typography></li>
            </ul>

            <Typography variant="h6" gutterBottom fontWeight={700}>5. Product Listings</Typography>
            <ul>
              <li><Typography variant="body1" gutterBottom>Seller Responsibility: Sellers are responsible for the accuracy of product listings, including descriptions, images, and pricing. The Marketplace does not guarantee the accuracy or completeness of product information.</Typography></li>
              <li><Typography variant="body1" gutterBottom>Buyer's Responsibility: Buyers are responsible for reviewing product details and making informed purchasing decisions.</Typography></li>
            </ul>

            <Typography variant="h6" gutterBottom fontWeight={700}>6. Transactions</Typography>
            <ul>
              <li><Typography variant="body1" gutterBottom>Payment Collection: The Marketplace collects payments from buyers on behalf of sellers. All transactions are processed through Stripe connected accounts. By using the Marketplace, you agree to Stripe's Terms of Service and Privacy Policy, which govern payment processing. For more information, please review Stripe's Terms of Service and Privacy Policy.</Typography></li>
              <li><Typography variant="body1" gutterBottom>Payouts: The Marketplace processes payouts to sellers on a weekly basis. Payments are disbursed to sellers' connected accounts according to the Marketplace's payout schedule.</Typography></li>
              <li><Typography variant="body1" gutterBottom>Return Payments: If necessary, the Marketplace may hold payments related to returns until the return process is completed. Refunds will be processed according to the individual seller's return policy and may be issued after the return has been inspected and approved.</Typography></li>
            </ul>

            <Typography variant="h6" gutterBottom fontWeight={700}>7. Intellectual Property</Typography>
            <ul>
              <li><Typography variant="body1" gutterBottom>Ownership: The content and materials available on the Marketplace, including but not limited to text, graphics, logos, and software, are the property of the Marketplace or its licensors and are protected by intellectual property laws.</Typography></li>
              <li><Typography variant="body1" gutterBottom>Limited License: You are granted a limited, non-exclusive, non-transferable license to access and use the Marketplace for personal, non-commercial purposes.</Typography></li>
            </ul>

            <Typography variant="h6" gutterBottom fontWeight={700}>8. Limitation of Liability</Typography>
            <ul>
              <li><Typography variant="body1" gutterBottom>To the fullest extent permitted by law, the Marketplace is not liable for any indirect, incidental, consequential, or punitive damages arising from or related to your use of the Marketplace.</Typography></li>
            </ul>

            <Typography variant="h6" gutterBottom fontWeight={700}>9. Indemnification</Typography>
            <ul>
              <li><Typography variant="body1" gutterBottom>You agree to indemnify and hold harmless the Marketplace, its affiliates, and their respective officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of your use of the Marketplace or violation of these Terms.</Typography></li>
            </ul>

            <Typography variant="h6" gutterBottom fontWeight={700}>10. Changes to Terms</Typography>
            <ul>
              <li><Typography variant="body1" gutterBottom>The Marketplace reserves the right to modify these Terms at any time. Any changes will be posted on this page, and your continued use of the Marketplace constitutes acceptance of the updated Terms.</Typography></li>
            </ul>

            <Typography variant="h6" gutterBottom fontWeight={700}>11. Governing Law</Typography>
            <ul>
              <li><Typography variant="body1" gutterBottom>These Terms are governed by and construed in accordance with the laws of United States, India, & Pakistan. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of United States, India, & Pakistan.</Typography></li>
            </ul>

            <Typography variant="h6" gutterBottom fontWeight={700}>12. Contact Us</Typography>
            <ul>
              <li><Typography variant="body1" gutterBottom>If you have any questions about these Terms or the Marketplace, please contact us at stockmygoods@gmail.com or +1 (832) 896 2999.</Typography></li>
            </ul>

            <FormControlLabel required control={<Checkbox name="terms" />} label="I agree to the Terms of Use and Privacy Policy of Stock my Goods" onChange={() => setState(!state)} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.setOpen(false)} variant="outlined">Cancel</Button>
          <Button type="submit" disabled={!state} variant="contained">Agree & Continue</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default TermsAndConditions