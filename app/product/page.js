"use client"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useSearchParams, useRouter } from "next/navigation"
import Container from "@mui/material/Container"
import Layout from "@/app/components/Layout"
import MainContent from "./components/MainContent"
import Alert from "../components/Alert"
import * as productApis from "@/apis/product"
import * as cartSlice from "@/store/cart"

export default function Blog() {
  const userState = useSelector(state => state.user)
  const cartState = useSelector(state => state.cart)
  const router = useRouter()
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  const [product, setProduct] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [display, setDisplay] = useState("/dummy-product.jpeg")
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })

  const handleCart = () => {
    if (!userState.user) return router.push("/auth/signin")
    if (product.stock_quantity === 0) return setToast({ type: "error", open: true, message: "Out of stock" })
    const index = cartState.findIndex((item) => item.id === product.id)

    if (index === -1) {
      dispatch(cartSlice.addToCart({ ...product, cart: quantity }))
      setToast({ type: "success", open: true, message: "Product added to the cart" })
    } else {
      if (product.stock_quantity <= cartState[index].cart) return setToast({ type: "error", open: true, message: `We do not have more than ${product.stock_quantity} units` })
      dispatch(cartSlice.increment(index))
      setToast({ type: "success", open: true, message: "Product updated in the cart" })
    }
  }

  const handleQuantityChange = (e) => {
    if (e.target.value > product.stock_quantity) setToast({ type: "error", open: true, message: `Only ${product.stock_quantity} items available` })
    else setQuantity(parseInt(e.target.value))
  }

  const getProduct = async () => {
    try {
      const response = await productApis.getProduct(userState.token, searchParams.get("id"))
      if (!response.status) throw new Error(response.message)

      setProduct(response.product)
      if (response.product.thumbnail_url) setDisplay(response.product.thumbnail_url)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    getProduct()
  }, [])

  return (
    <Layout>
      <Alert toast={toast} setToast={setToast} />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: "flex", flexDirection: "column", my: 16, gap: 4 }}
      >
        <MainContent
          product={product}
          display={display}
          quantity={quantity}
          setQuantity={q => setQuantity(q)}
          handleQuantityChange={handleQuantityChange}
          setDisplay={setDisplay}
          handleCart={handleCart}
        />
      </Container>
    </Layout>
  )
}