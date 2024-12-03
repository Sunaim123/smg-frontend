"use client"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { useSelector } from "react-redux"
import { Box, Grid, Button, Container, IconButton, Typography, Table, TableHead, TableBody, TableCell, TableRow, TextField } from "@mui/material"

import DeleteOutlined from "@mui/icons-material/DeleteOutlined"
import EditOutlined from "@mui/icons-material/EditOutlined"
import AssignmentOutlined from "@mui/icons-material/AssignmentOutlined"
import Alert from "@/app/components/Alert"
import Auth from "@/app/components/Auth"
import SellerNavbar from "@/app/components/SellerNavbar"
import Pagination from "@/app/components/Pagination"
import * as productApis from "@/app/apis/product"

export default function Listings() {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const formRef = useRef(null)
  const [products, setProducts] = useState([])
  const [count, setCount] = useState(0)
  const [active, setActive] = useState(1)
  const limit = 25
  const [toast, setToast] = useState({
    type: "success",
    open: false,
    message: null,
  })
  const [filter, setFilter] = useState({
    search: null
  })

  const handleLink = (link) => {
    router.push(link)
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

  const getProducts = async () => {
    try {
      const params = {}
      if (filter.search) params.search = filter.search
      params.offset = (active - 1) * limit
      params.limit = limit
      params.for = "listings"

      const query = new URLSearchParams(params)
      const response = await productApis.getProducts(userState.token, query.toString())
      if (!response.status) throw new Error(response.message)

      setCount(response.count)
      setProducts(response.products)
    } catch (error) {
      setToast({ type: "error", open: true, message: error.message })
    }
  }

  const handleClear = () => {
    setFilter({
      search: null
    })
    formRef.current.search.value = ""
  }

  useEffect(() => {
    if (userState.warehouseUser) router.replace("/products")
    getProducts()
  }, [filter, active])

  return (
    <Auth>
      <Alert toast={toast} setToast={setToast} />
      <SellerNavbar />

      <Container maxWidth="xl">
        <Box display="flex" justifyContent="space-between" alignItems="center" my={3}>
          <Grid item xs={6}>
            <Typography variant="h4" fontWeight={700}>Listings</Typography>
          </Grid>

          <Grid xs={6} display="flex" justifyContent="space-between" alignItems="center" gap={1}>
            <form
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault()
                setFilter({
                  search: formRef.current.search.value,
                })
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={6}>
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
                  <Button
                    disableElevation
                    size="small"
                    variant="contained"
                    onClick={() => handleLink("/listing")}
                  >
                    New
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Box>
      </Container>

      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
            <TableCell width={40}></TableCell>
            <TableCell>SKU</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Shipping</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Link href={product.thumbnail_url || "/dummy-product.jpeg"} target="_blank">
                  <Image src={product.thumbnail_url || "/dummy-product.jpeg"} alt={product.title} width={40} height={40} style={{ borderRadius: "4px", border: "1px solid #d1d5db" }} />
                </Link>
              </TableCell>
              <TableCell>{product.sku}</TableCell>
              <TableCell>{product.title}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>${product.retail_price.toFixed(2)}</TableCell>
              <TableCell>${(product.shipping_price)?.toFixed(2)}</TableCell>
              <TableCell align="center">
                <IconButton color="primary" size="small" onClick={() => router.push(`listing/${product.id}`)}><AssignmentOutlined /></IconButton>
                <IconButton color="primary" size="small" onClick={() => router.push(`listing?id=${product.id}`)}><EditOutlined /></IconButton>
                <IconButton color="error" size="small" onClick={() => handleDelete(product.id)}><DeleteOutlined /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Container maxWidth="xl">
        <Grid display="flex" justifyContent="space-between" py={3}>
          <Grid item xs={10}>
            <Pagination
              currentPage={active}
              totalCount={count}
              pageSize={limit}
              siblingCount={3}
              onPageChange={page => setActive(page)}
            />
          </Grid>
          <Grid item xs={2}>
            <Typography display="flex" gap={1}>Showing <Typography fontWeight="700">{products.length}</Typography> out of <Typography fontWeight="700">{count}</Typography> results</Typography>
          </Grid>
        </Grid>
      </Container>
    </Auth>
  )
}