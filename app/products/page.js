"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Box, Grid, Button, Container, TextField, Typography } from "@mui/material"

import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import Navbar from "@/app/components/Navbar"
import ProductListView from "@/app/components/ProductListView"
import ProductGridView from "@/app/components/ProductGridView"
import * as productApis from "@/app/apis/product"
import * as cartSlice from "@/app/store/cart"

export default function Products() {
  const userState = useSelector(state => state.user)
  const cartState = useSelector(state => state.cart)
  const dispatch = useDispatch()
  const router = useRouter()
  const formRef = useRef(null)
  const [products, setProducts] = useState([])
  const [filter, setFilter] = useState({
    tracking_number: null,
    search: null
  })
  const [count, setCount] = useState(0)
  const [productCount, setproductCount] = useState({ quantity: 0, count: 0 })
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
    setFilter({
      tracking_number: null,
      search: null
    })
    if (userState.warehouseUser) formRef.current.tracking_number.value = ""
    formRef.current.search.value = ""
  }

  const openModal = (img) => {
    window.open(img)
  }

  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to delete?")) return

      const response = await productApis.deleteProduct(userState.token, id)
      if (!response.status) throw new Error(response.message)

      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id))
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const handleCart = (product) => {
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

  const getProducts = async () => {
    try {
      const params = {}
      if (filter.tracking_number) params.tracking_number = filter.tracking_number
      if (filter.search) params.search = filter.search
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

  const getProductCount = async () => {
    try {
      const response = await productApis.getProductCount(userState.token, "")
      if (!response.status) throw new Error(response.message)

      setproductCount({ cost: response.cost, quantity: response.quantity });
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    getProducts()
    getProductCount()
  }, [filter, active])

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <Navbar />

      <Container maxWidth="xl">
        <Grid container my={3}>
          <Grid item xs={6}>
            <Typography variant="h4" fontWeight={700}>Products</Typography>
            {userState.warehouseUser && <Typography color="textSecondary">Quantity: {productCount.quantity} | Cost: ${productCount.cost?.toFixed(2)}</Typography>}
          </Grid>

          <Grid item xs={6}>
            <form
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault()
                setFilter({
                  tracking_number: userState.warehouseUser ? formRef.current.tracking_number.value : null,
                  search: formRef.current.search.value,
                })
              }}
            >
              <Grid container spacing={2}>
                  <Grid item xs={4}>
                {userState.warehouseUser && (
                    <TextField
                      fullWidth
                      type="text"
                      label="Tracking Number"
                      name="tracking_number"
                      variant="outlined"
                      size="small"
                    />
                )}
                  </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    type="text"
                    label="Search"
                    name="search"
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={4} display="flex" gap={1}>
                  <Button
                    disableElevation
                    type="submit"
                    size="small"
                    variant="contained"
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
                 {userState.warehouseUser &&
                  <Button
                    disableElevation
                    size="small"
                    variant="contained"
                    onClick={() => handleLink("/product")}
                  >
                    New
                  </Button>}
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>

        {userState.companyUser && <ProductGridView products={products} onCart={handleCart} />}
      </Container>

      {userState.warehouseUser && <ProductListView products={products} limit={limit} count={count} active={active} onChange={(page) => setActive(page)} onLink={handleLink} onDelete={handleDelete} handleModal={(img) => openModal(img)} />}
    </Auth>
  )
}