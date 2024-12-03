import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import * as companyApis from "@/apis/company"

export default function CardAlert({ setToast }) {
  const userState = useSelector(state => state.user)
  const router = useRouter()

  const handleStripeOnboard = async () => {
    try {
      const response = await companyApis.stripeOnboarding(userState.token)
      if (!response.status) throw new Error(response.message)

      router.push(response.url)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  return (
    <>
      <Card variant="outlined" sx={{ m: 1.5, p: 1.5 }}>
        <CardContent>
          <AutoAwesomeRoundedIcon fontSize="small" />
          <Typography gutterBottom sx={{ fontWeight: 600 }}>
            Connect your account
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Complete your onboarding to list your products for thousands of sellers.
          </Typography>
          <Button variant="contained" size="small" fullWidth onClick={handleStripeOnboard}>
            Connect Account
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
