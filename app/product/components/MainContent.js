"use client"
import * as React from "react"
import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import FormControl from "@mui/material/FormControl"
import InputAdornment from "@mui/material/InputAdornment"
import OutlinedInput from "@mui/material/OutlinedInput"
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"
import RssFeedRoundedIcon from "@mui/icons-material/RssFeedRounded"
import { Add, Remove } from "@mui/icons-material"
import { Button, Divider, Tab, Tabs, TextField } from "@mui/material"

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  }
}

export function Search() {
  return (
    <FormControl sx={{ width: { xs: "100%", md: "25ch" } }} variant="outlined">
      <OutlinedInput
        size="small"
        id="search"
        placeholder="Search…"
        sx={{ flexGrow: 1 }}
        startAdornment={
          <InputAdornment position="start" sx={{ color: "text.primary" }}>
            <SearchRoundedIcon fontSize="small" />
          </InputAdornment>
        }
        inputProps={{
          "aria-label": "search",
        }}
      />
    </FormControl>
  )
}

export default function MainContent(props) {
  const [value, setValue] = React.useState(0)

  const handleChange = (e, newValue) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div>
        <Typography variant="h1" gutterBottom>
          Product
        </Typography>
        <Typography>Explore exciting products and get the best deals on Stock my Goods</Typography>
      </div>
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          flexDirection: "row",
          gap: 1,
          width: { xs: "100%", md: "fit-content" },
          overflow: "auto",
        }}
      >
        <Search />
        <IconButton size="small" aria-label="RSS feed">
          <RssFeedRoundedIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column-reverse", md: "row" },
          width: "100%",
          justifyContent: "space-between",
          alignItems: { xs: "start", md: "center" },
          gap: 4,
          overflow: "auto",
        }}
      >
      </Box>
      <Grid container spacing={5} >
        <Grid item xs={4}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <img
                src={props.display}
                alt={props.product.title}
                width="100%"
                height="300px"
                style={{ borderRadius: "4px", border: "1px solid #d1d5db" }}
              />
            </Grid>
            {["thumbnail_url", "image1_url", "image2_url", "image3_url"].map((image) => (
              props.product[image] && <Grid item xs={3}>
                <img
                  src={props.product[image]}
                  alt={props.product[image]}
                  width="100%"
                  height="100%"
                  style={{ cursor: "pointer", borderRadius: "4px", border: "1px solid #d1d5db" }}
                  onClick={() => props.setDisplay(props.product[image])}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={8}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography fontWeight={700} fontSize={25} >{props.product.title}</Typography>
              <Typography variant="body2">{props.product.brand}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography fontSize={30} fontWeight={700}>${props.product.retail_price?.toFixed(2)}</Typography>
              <Typography>Shipping: ${props.product.shipping_price?.toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Chip label={props.product.category?.name} color="primary" variant="outlined" />
            </Grid>
            <Grid item sx={10} />
            <Grid item xs={12} />
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Grid item xs={4}>
                  {/* <Box display="flex" justifyContent="center" alignItems="center" gap={1}> */}
                    {/* <IconButton disabled={props.quantity === 1} color="error" onClick={() => props.setQuantity(props.quantity - 1)} aria-label="Decrease quantity">
                      <Remove />
                    </IconButton> */}
                    <Typography>Quantity:</Typography>
                    <TextField
                      value={props.quantity}
                      onChange={props.handleQuantityChange}
                      size="small"
                      type="number"
                      inputProps={{ min: 1 }}
                    />
                    {/* <IconButton disabled={props.quantity === props.product.stock_quantity} color="success" onClick={() => props.setQuantity(props.quantity + 1)} aria-label="Increase quantity">
                      <Add />
                    </IconButton> */}
                  {/* </Box> */}
                </Grid>
                {/* <Grid>
                  <Typography>Price: ${(props.quantity * props.product.retail_price)?.toFixed(2)}</Typography>
                </Grid> */}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" fullWidth onClick={props.handleCart}>
                Add to cart
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography>{props.product.short_description}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} display="flex" gap={1}>
              <Typography variant="body1" fontWeight={700}>SKU:</Typography><Typography variant="body1">{props.product.sku}</Typography>
            </Grid>
            <Grid item xs={12} display="flex" gap={1}>
              <Typography variant="body1" fontWeight={700}>Quantity:</Typography><Typography variant="body1">{props.product.stock_quantity}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sx={12} display="flex" flexDirection="column" gap={2}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Description" {...a11yProps(0)} />
            <Tab label="Return Policy" {...a11yProps(1)} />
          </Tabs>
          <CustomTabPanel value={value} index={0}>
            {props.product.description}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            Return Policy

            At SMG, we aim to ensure that you are completely satisfied with your purchase. If for any reason you are not happy with your item, you may return it under the following conditions:

            1. Eligibility for Returns
            Items must be returned within 30 days of receipt.
            Products must be unused, in their original packaging, and in the same condition as when received.
            Certain items, including perishable goods, intimate or sanitary products, and customized items, are non-returnable.
            2. Return Process
            To initiate a return, please contact our customer support team with your order details and reason for return.
            Upon approval, we will provide a return shipping label or instructions.
            3. Refunds
            Once the returned item is received and inspected, we will notify you of the approval or rejection of your refund.
            Approved refunds will be processed to the original payment method within 5-10 business days.
            4. Exchanges
            If you received a defective or damaged item, we offer exchanges at no additional cost. Please contact us within 7 days of delivery to arrange an exchange.
            5. Shipping Costs
            Return shipping is free for defective or incorrect items.
            For other returns, shipping costs are the responsibility of the buyer and will be deducted from the refund.
          </CustomTabPanel>
        </Grid>
      </Grid>
    </Box>
  )
}
