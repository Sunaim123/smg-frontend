import Image from "next/image"
import Link from "next/link"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { Box, Container, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Grid, Typography } from "@mui/material"
import AssignmentOutlined from "@mui/icons-material/AssignmentOutlined"
import EditOutlined from "@mui/icons-material/EditOutlined"
import DeleteOutlined from "@mui/icons-material/DeleteOutlined"
import Pagination from "./Pagination"

export default function ProductListView(props) {
  const router = useRouter()
  const userState = useSelector(state => state.user)

  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
            <TableCell width={40}></TableCell>
            <TableCell>SKU</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Tracking #</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Shipping Price</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Link href={product.thumbnail_url || "/dummy-product.jpeg"} target="_blank">
                  <Image src={product.thumbnail_url || "/dummy-product.jpeg"} alt={product.title} width={40} height={40} style={{ borderRadius: "4px", border: "1px solid #d1d5db" }} />
                </Link>
              </TableCell>
              <TableCell>{product.sku}</TableCell>
              <TableCell>{product.title}</TableCell>
              <TableCell>{product.tracking_number}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>${product.retail_price.toFixed(2)}</TableCell>
              <TableCell>${(product.shipping_price)?.toFixed(2)}</TableCell>
              <TableCell align="center">
                <IconButton color="primary" size="small" onClick={() => router.push(`product/${product.id}`)}><AssignmentOutlined /></IconButton>
                {userState.warehouseUser && <IconButton color="primary" size="small" onClick={() => props.onLink(`product?id=${product.id}`)}><EditOutlined /></IconButton>}
                {userState.warehouseUser && <IconButton color="error" size="small" onClick={() => props.onDelete(product.id)}><DeleteOutlined /></IconButton>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Container maxWidth="xl">
        <Grid display="flex" justifyContent="space-between" py={3}>
          <Grid item xs={10}>
            <Pagination
              currentPage={props.active}
              totalCount={props.count}
              pageSize={props.limit}
              siblingCount={3}
              onPageChange={page => props.onChange(page)}
            />
          </Grid>
          <Grid item xs={2}>
            <Typography display="flex" gap={1}>Showing <Typography fontWeight="700">{props.products.length}</Typography> out of <Typography fontWeight="700">{props.count}</Typography> results</Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}