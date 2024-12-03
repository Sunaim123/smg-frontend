"use client"
import Image from "next/image"
import Link from "next/link"
import { useSelector } from "react-redux"
import { Box, Table, TableBody, TableCell, TableRow, Grid, Container, Button, Typography } from "@mui/material"

import GuestNavbar from "@/app/components/GuestNavbar"
import Footer from "@/app/components/Footer"
import axios from "@/app/utilities/axios"
import heroImage from "@/public/hero-mobile.png"
import loginFront from "@/public/login-front.png"

export default function Home() {
  const userState = useSelector((state) => state.user)

  const handleSubscribe = async (price) => {
    try {
      const { data: response } = await axios.post("/service/stripe/subscribe", { price }, {
        headers: {
          "Token": userState.token,
        }
      })
      if (!response.status) throw new Error(response.message)

      window.location.href = response.url
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <>
      <GuestNavbar />

      <Box id="about" sx={{ height: "40rem", my: 5, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Container maxWidth="lg">
          <Typography variant="h3" mb={5} align="center">About us</Typography>

          <Grid container alignItems="center" justifyContent="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" fontWeight={700} textAlign="justify" fontSize="xl" mb={3} fontStyle="light">At Stock my Goods, we understand the challenges of managing a successful eCommerce business. That&apos;s why we created our powerful return management system to help online retailers streamline their return processes and enhance the customer experience.</Typography>
            </Grid>
            <Grid item xs={12} md={6} textAlign="right">
              <Image src={heroImage} alt="service-image" width={200} height={350} />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box id="pricing" sx={{ background: "#f8f9fa", py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" mb={5} align="center">Pricing Plan</Typography>

          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={{ background: "#dee2e6", border: "1px solid rgba(224, 224, 224, 1)" }} rowSpan={2}><Typography variant="h5" fontWeight="bold">Features</Typography></TableCell>
                <TableCell sx={{ background: "#f4bd61", textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}><Typography variant="h5" fontWeight="bold" color="white">Starter</Typography></TableCell>
                <TableCell sx={{ background: "#2fb380", textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}><Typography variant="h5" fontWeight="bold" color="white">Standard</Typography></TableCell>
                <TableCell sx={{ background: "#3459e6", textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}><Typography variant="h5" fontWeight="bold" color="white">Premium</Typography></TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ background: "#f4bd61", textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}><Typography variant="h5" fontWeight="bold" color="white">$ 99.99/month</Typography></TableCell>
                <TableCell sx={{ background: "#2fb380", textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}><Typography variant="h5" fontWeight="bold" color="white">$ 299.99/month</Typography></TableCell>
                <TableCell sx={{ background: "#3459e6", textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}><Typography variant="h5" fontWeight="bold" color="white">$ 499.99/month</Typography></TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>No. Of Users</TableCell>
                <TableCell sx={{ textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}>1 User</TableCell>
                <TableCell sx={{ textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}>3 Users</TableCell>
                <TableCell sx={{ textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}>5 Users</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>No. Of Racks</TableCell>
                <TableCell sx={{ textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}>1 Racks</TableCell>
                <TableCell sx={{ textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}>3 Racks</TableCell>
                <TableCell sx={{ textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}>5 Racks</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>No. Of Returns</TableCell>
                <TableCell sx={{ textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}>10 Returns</TableCell>
                <TableCell sx={{ textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}>30 Returns</TableCell>
                <TableCell sx={{ textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}>50 Returns</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>Support</TableCell>
                <TableCell sx={{ textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}>✖</TableCell>
                <TableCell sx={{ textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}>✖</TableCell>
                <TableCell sx={{ textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}>✔</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>Email Support</TableCell>
                <TableCell sx={{ textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}>✖</TableCell>
                <TableCell sx={{ textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}>✔</TableCell>
                <TableCell sx={{ textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}>✔</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>Stocking & Warehousing</TableCell>
                <TableCell sx={{ textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}>✔</TableCell>
                <TableCell sx={{ textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}>✔</TableCell>
                <TableCell sx={{ textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}>✔</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>Labelling</TableCell>
                <TableCell sx={{ textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}>✔</TableCell>
                <TableCell sx={{ textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}>✔</TableCell>
                <TableCell sx={{ textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}>✔</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>Shipping</TableCell>
                <TableCell sx={{ textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}>✔</TableCell>
                <TableCell sx={{ textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}>✔</TableCell>
                <TableCell sx={{ textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)" }}>✔</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}></TableCell>
                <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>
                  {
                    userState.companyUser
                      ? <Button variant="contained" size="large" disableElevation fullWidth onClick={() => handleSubscribe(process.env.NEXT_PUBLIC_STARTER)}>Subscribe</Button>
                      : <Link href="/register"><Button variant="contained" size="large" disableElevation fullWidth>Sign up</Button></Link>
                  }
                </TableCell>
                <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>
                  {
                    userState.companyUser
                      ? <Button variant="contained" size="large" disableElevation fullWidth onClick={() => handleSubscribe(process.env.NEXT_PUBLIC_STANDARD)}>Subscribe</Button>
                      : <Link href="/register"><Button variant="contained" size="large" disableElevation fullWidth>Sign up</Button></Link>
                  }
                </TableCell>
                <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>
                  {
                    userState.companyUser
                      ? <Button variant="contained" size="large" disableElevation fullWidth onClick={() => handleSubscribe(process.env.NEXT_PUBLIC_PREMIUM)}>Subscribe</Button>
                      : <Link href="/register"><Button variant="contained" size="large" disableElevation fullWidth>Sign up</Button></Link>
                  }
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Container>
      </Box>

      <Box id="products" sx={{ my: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" mb={5} align="center">Our Product</Typography>

          <Grid container alignItems="center" justifyContent="center">
            <Grid item xs={12} md={6}>
              <Image src={loginFront} alt="service-image" width={300} height={300} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" textAlign="justify" fontSize="lg" mb={3} fontStyle="light">Our cloud-based SaaS platform offers an all-in-one solution for managing product returns, including automated return processing, customer self-service portals, integrations with shipping carriers, and powerful analytics and reporting. With Stock my Goods, you can reduce the time and resources required to manage returns, while providing your customers with a seamless and hassle-free return experience.</Typography>
              <Typography variant="body1" textAlign="justify" fontSize="lg" mb={3} fontStyle="light">Our team of experienced developers and product managers is dedicated to providing the highest level of support and service to our clients. We are passionate about helping eCommerce businesses grow and succeed, and we are committed to delivering the best possible solutions to meet your needs.</Typography>
              <Link href="/register"><Button variant="contained" size="large" disableElevation>Get Started</Button></Link>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Footer />
    </>
  )
}
