"use client"
import Link from "next/link"
import { Box, Container, Grid, Typography } from "@mui/material"
import PhoneIcon from "@mui/icons-material/Phone"
import EmailIcon from "@mui/icons-material/Email"
import LocationOnIcon from "@mui/icons-material/LocationOn"

const Footer = () => {
  return (
    <Box sx={{ background: "#f8f9fa", py: 5 }}>
      <Container maxWidth="lg">
        <Grid container>
          <Grid item md={4}>
            <Typography variant="h5">About</Typography>
            <Typography marginTop="1rem"><Link href="/#about" style={{ textDecoration: "none", color: "grey" }}>About us</Link></Typography>
            <Typography marginTop="1rem"><Link href="/terms" style={{ textDecoration: "none", color: "grey" }}>Terms &amp; Conditions</Link></Typography>
            <Typography marginTop="1rem"><Link href="/privacy" style={{ textDecoration: "none", color: "grey" }}>Privacy Policies</Link></Typography>
          </Grid>
          <Grid item md={4}>
            <Typography variant="h5">Contact</Typography>
            <Typography color="grey" display="flex" alignItems="center" marginTop="1rem" gap="10px"><PhoneIcon />+1 (281) 626 2300</Typography>
            <Typography color="grey" display="flex" alignItems="center" marginTop="1rem" gap="10px"><LocationOnIcon />9607 Crail Dr Spring, TX 77379</Typography>
          </Grid>
          <Grid item md={4}>
            <Typography variant="h5">Email</Typography>
            <Typography color="grey" display="flex" alignItems="center" marginTop="1rem" gap="10px"><EmailIcon /><Link href="mailto:stockmygoods@gmail.com" sx={{ textDecoration: "none" }}>stockmygoods@gmail.com</Link></Typography>
            <Typography color="grey" display="flex" alignItems="center" marginTop="1rem" gap="10px"><EmailIcon /><Link href="mailto:support@stockmygoods.com" sx={{ textDecoration: "none" }}>support@stockmygoods.com</Link></Typography>
          </Grid>
        </Grid>

        <br />

        <Typography variant="body1" color="grey" textAlign="center" sx={{ pt: 5 }}>Stock my Goods &copy; Copyrights Reserved, {new Date().getFullYear()}. Powered by Interack Solutions LLC</Typography>
      </Container>
    </Box>
  )
}

export default Footer
