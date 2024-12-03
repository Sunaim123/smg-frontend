"use client"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import Container from "@mui/material/Container"
import Layout from "@/app/components/Layout"
import MainContent from "./components/MainContent"
import Alert from "../components/Alert"
import * as productApis from "@/apis/product"
import * as cartSlice from "@/store/cart"

export default function Blog() {
  const cartState = useSelector(state => state.cart)
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const dispatch = useDispatch()
  const [products, setProducts] = useState([])
  const [params, setParams] = useState({})
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleCart = (product) => {
    if (!userState.user) return router.push("/auth/signin")
    if (product.stock_quantity === 0) return setToast({ type: "error", open: true, message: "Out of stock" })
    const index = cartState.findIndex((item) => item.id === product.id)

    if (index === -1) {
      dispatch(cartSlice.addToCart({...product, cart: 1 }))
      setToast({ type: "success", open: true, message: "Product added to the cart" })
    } else {
      if (product.stock_quantity <= cartState[index].cart) return setToast({ type: "error", open: true, message: `We do not have more than ${product.stock_quantity} units` })
      dispatch(cartSlice.increment(index))
      setToast({ type: "success", open: true, message: "Product updated in the cart" })
    }
  }

  const getProducts = async () => {
    try {
      const response = await productApis.getProducts({ title: params })
      if (!response.status) throw new Error(response.message)

      setProducts(response.products)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    getProducts()
  }, [params])

  return (
    <Layout>
      <Alert toast={toast} setToast={setToast} />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: "flex", flexDirection: "column", gap: 4, py: 4 }}
      >
        <MainContent products={products} handleSearch={search => setParams(search)} onCart={handleCart} />
      </Container>
    </Layout>
  )
}