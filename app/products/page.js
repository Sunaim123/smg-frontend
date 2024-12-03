"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Box, Grid, Button, Container, TextField, Typography } from "@mui/material"

import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Navbar from "@/app/components/Navbar"
import ProductListView from "@/app/components/ProductListView"
import InventoryGridView from "@/app/components/InventoryGridView"
import ProductGridView from "@/app/components/ProductGridView"
import * as inventoryApis from "@/app/apis/inventory"
import * as productApis from "@/app/apis/product"
import * as companyApis from "@/app/apis/company"
import * as cartSlice from "@/app/store/cart"

export default function Products() {
  const userState = useSelector(state => state.user)
  const cartState = useSelector(state => state.cart)
  const dispatch = useDispatch()
  const router = useRouter()
  const ref = useRef(null)
  const [products, setProducts] = useState([])
  const [filter, setFilter] = useState()
  const [count, setCount] = useState(0)
  const [productCount, setproductCount] = useState({ quantity: 0, count: 0 })
  const [company, setCompany] = useState(null)
  const [active, setActive] = useState(1)
  const limit = 25
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleLink = (link) => {
    router.push(link)
  }

  const handleClear = () => {
    setFilter()
    ref.current.value = ""
  }

  const openModal = (img) => {
    window.open(img)
  }

  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to delete?")) return

      const response = await inventoryApis.deleteInventory(userState.token, id)
      if (!response.status) throw new Error(response.message)

      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id))
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const handleCart = (product) => {
    if (product.quantity === 0) return setToast({ type: "error", open: true, message: "Out of stock" })
    const index = cartState.findIndex((item) => item.id === product.id)

    if (index === -1) {
      dispatch(cartSlice.addToCart(product))
      setToast({ type: "success", open: true, message: "Product added to the cart" })
    } else {
      if (product.quantity <= cartState[index].cart) return setToast({ type: "error", open: true, message: `We do not have more than ${product.quantity} units` })
      dispatch(cartSlice.increment(index))
      setToast({ type: "success", open: true, message: "Product updated in the cart" })
    }
  }

  const getInventories = async () => {
    try {
      const params = {}
      if (filter) params.tracking_number = filter.tracking_number
      if (userState.warehouseUser) params.offset = (active - 1) * limit
      if (userState.warehouseUser) params.limit = limit

      const query = new URLSearchParams(params)
      const response = await inventoryApis.getInventories(userState.token, query.toString())
      if (!response.status) throw new Error(response.message)

      setCount(response.count)
      setProducts(response.products)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const getProducts = async () => {
    try {
      const params = {}
      if (filter) params.title = filter.title
      if (userState.warehouseUser) params.offset = (active - 1) * limit
      if (userState.warehouseUser) params.limit = limit

      const query = new URLSearchParams(params)
      const response = await productApis.getProducts(userState.token, query.toString())
      if (!response.status) throw new Error(response.message)

      setCount(response.count)
      setProducts(response.products)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const getInventoryCount = async () => {
    try {
      const response = await inventoryApis.getInventoryCount(userState.token, "")
      if (!response.status) throw new Error(response.message)

      setproductCount({ cost: response.cost, quantity: response.quantity });
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const getCompany = async () => {
    try {
      const response = await companyApis.getCompany(userState.token, userState.user.company_id)
      if (!response.status) throw new Error(response.message)

      setCompany(response.company)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    if (userState.customer) getProducts()
    else {
      getInventories()
      getInventoryCount()
    }
    if (userState.companyUser) getCompany()
  }, [filter, active])

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Navbar />

      <Container maxWidth="xl">
        <Box display="flex" justifyContent="space-between" alignItems="center" my={3}>
          <Grid item xs={6}>
            <Typography variant="h4" fontWeight={700}>SMG Inventory</Typography>
            {userState.warehouseUser && <Typography color="textSecondary">Quantity: {productCount.quantity} | Cost: ${productCount.cost?.toFixed(2)}</Typography>}
          </Grid>

          {userState.warehouseUser && (
            <Grid xs={6} display="flex" justifyContent="space-between" alignItems="center" gap={1}>
              <TextField
                type="text"
                label="Tracking Number"
                name="tracking_number"
                variant="outlined"
                size="small"
                inputRef={ref}
              />
              <Button
                disableElevation
                size="small"
                variant="contained"
                onClick={() => setFilter({ tracking_number: ref.current.value })}
              >
                Filter
              </Button>
              <Button
                disableElevation
                size="small"
                variant="contained"
                color="error"
                onClick={handleClear}
              >
                Clear
              </Button>
              <Button
                disableElevation
                size="small"
                variant="contained"
                onClick={() => handleLink("/product")}
              >
                New
              </Button>
            </Grid>
          )}
          {/* {userState.companyUser && company?.status === "onboard" &&
            <Button onClick={() => router.replace("/listings")}>
              My Listings
            </Button>
          } */}
          {userState.customer &&
            <Grid display="flex" gap={2}>
              <TextField
                type="text"
                label="Search"
                name="title"
                variant="outlined"
                size="small"
                inputRef={ref}
              />
              <Button
                disableElevation
                size="small"
                variant="contained"
                onClick={() => setFilter({ title: ref.current.value })}
              >
                Search
              </Button>
            </Grid>}
        </Box>

        {userState.companyUser && <InventoryGridView products={products} onCart={handleCart} />}
        {userState.customer && <ProductGridView products={products} onCart={handleCart} />}
      </Container>

      {userState.warehouseUser && <ProductListView products={products} limit={limit} count={count} active={active} onChange={(page) => setActive(page)} onLink={handleLink} onDelete={handleDelete} handleModal={(img) => openModal(img)} seller={false} />}
    </Auth>
  )
}