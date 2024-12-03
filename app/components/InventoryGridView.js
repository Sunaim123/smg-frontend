import { Button, Card, CardActions, CardActionArea, CardContent, CardMedia, Grid, Typography } from "@mui/material"
import { useRouter } from "next/navigation"

export default function ProductGridView(props) {
  const router = useRouter()

  return (
    <Grid container spacing={1}>
      {props.products.map((product) => (
        <Grid key={product.id.toString()} item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Card variant="outlined">
            <CardActionArea onClick={() => router.push(`product/${product.id}`)}>
              <CardMedia
                component="img"
                image={product.thumbnail_url || "/dummy-product.jpeg"}
                title={product.title}
                sx={{ height: 200 }}
              />
              <CardContent>
                <Typography gutterBottom variant="h6">{product.title}</Typography>
                <Typography variant="body2" color="text.secondary">{product.description}</Typography>
                <Typography variant="body2" color="text.secondary">${product.retail_price.toFixed(2)}</Typography>
                <Typography variant="body2" color="text.secondary">Quantity: {product.quantity}</Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button disableElevation fullWidth variant="contained" onClick={() => props.onCart(product)}>Add to Cart</Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}