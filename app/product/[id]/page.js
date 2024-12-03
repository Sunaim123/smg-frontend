"use client"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Container, Grid, Typography } from "@mui/material"

import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Loading from "@/app/components/Loading"
import Navbar from "@/app/components/Navbar"
import * as inventoryApis from "@/app/apis/inventory"

export default function product({ params }) {
  const userState = useSelector(state => state.user)
  const [product, setProduct] = useState(null)
  const [display, setDisplay] = useState("thumbnail_url")
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const getInventory = async () => {
    try {
      const response = await inventoryApis.getInventory(userState.token, params.id)
      if (!response.status) throw new Error(response.message)

      setProduct(response.product)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }
 
  useEffect(() => {
    getInventory()
  }, [])

  if (!product)
    return (
      <Loading />
    )

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Navbar />

      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={700} my={3}>Product Details</Typography>

        <Grid container spacing={3}>
          <Grid item xs={3}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <img
                  src={product[display] || "/dummy-product.jpeg"}
                  alt={product.title}
                  width="100%"
                  height={200}
                  style={{ borderRadius: "4px", border: "1px solid #d1d5db" }}
                />
              </Grid>
              {["thumbnail_url", "image1_url", "image2_url", "image3_url"].map((image) => (
                product[image] && <Grid item xs={3}>
                  <img
                    src={product[image]}
                    alt={image}
                    width="100%"
                    height={50}
                    style={{ cursor: "pointer", borderRadius: "4px", border: "1px solid #d1d5db" }}
                    onClick={() => setDisplay(image)}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={9}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight={800}>TITLE</Typography>
                <Typography variant="body1">{product.title}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight={800}>SKU</Typography>
                <Typography variant="body1">{product.sku}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight={800}>BRAND</Typography>
                <Typography variant="body1">{product.brand}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight={800}>MANUFACTURER</Typography>
                <Typography variant="body1">{product.manufacturer}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight={800}>QUANTITY</Typography>
                <Typography variant="body1">{product.quantity}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight={800}>MINIMUM WHOLESALE QUANTITY</Typography>
                <Typography variant="body1">{product.minimum_wholsale_quantity}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight={800}>RETAIL PRICE</Typography>
                <Typography variant="body1">${product.retail_price.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight={800}>WHOLESALE PRICE</Typography>
                <Typography variant="body1">${product.wholsale_price?.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight={800}>SHIPPING PRICE</Typography>
                <Typography variant="body1">${product.shipping_price?.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight={800}>TRACKING #</Typography>
                <Typography variant="body1">{product.tracking_number}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" fontWeight={800}>DESCRIPTION</Typography>
                <Typography variant="body1">{product.description}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Auth>
  )
}