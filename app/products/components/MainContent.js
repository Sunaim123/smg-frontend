"use client"
import * as React from "react"
import { useRouter } from "next/navigation"
import PropTypes from "prop-types"
import Avatar from "@mui/material/Avatar"
import AvatarGroup from "@mui/material/AvatarGroup"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Chip from "@mui/material/Chip"
import Grid from "@mui/material/Grid2"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import FormControl from "@mui/material/FormControl"
import InputAdornment from "@mui/material/InputAdornment"
import OutlinedInput from "@mui/material/OutlinedInput"
import { styled } from "@mui/material/styles"
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"
import RssFeedRoundedIcon from "@mui/icons-material/RssFeedRounded"
import { Button } from "@mui/material"
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import { CancelOutlined } from "@mui/icons-material"

const SyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: 0,
  height: "100%",
  backgroundColor: theme.palette.background.paper,
  "&:hover": {
    backgroundColor: "transparent",
    cursor: "pointer",
  },
  "&:focus-visible": {
    outline: "3px solid",
    outlineColor: "hsla(210, 98%, 48%, 0.5)",
    outlineOffset: "2px",
  },
}))

const SyledCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  gap: 4,
  padding: 16,
  flexGrow: 1,
  "&:last-child": {
    paddingBottom: 16,
  },
})

const StyledTypography = styled(Typography)({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
})

function Author({ authors }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
      }}
    >
      <Box
        sx={{ display: "flex", flexDirection: "row", gap: 1, alignItems: "center" }}
      >
        <AvatarGroup max={3}>
          {authors.map((author, index) => (
            <Avatar
              key={index}
              alt={author.name}
              src={author.avatar}
              sx={{ width: 24, height: 24 }}
            />
          ))}
        </AvatarGroup>
        <Typography variant="caption">
          {authors.map((author) => author.name).join(", ")}
        </Typography>
      </Box>
      <Typography variant="caption">July 14, 2021</Typography>
    </Box>
  )
}

Author.propTypes = {
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
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
  const router = useRouter()
  const [focusedCardIndex, setFocusedCardIndex] = React.useState(null)
  const [search, setSearch] = React.useState(null)

  const handleFocus = (index) => {
    setFocusedCardIndex(index)
  }

  const handleBlur = () => {
    setFocusedCardIndex(null)
  }

  const handleClick = () => {
    console.info("You clicked the filter chip.")
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
        <Box
          sx={{
            display: "inline-flex",
            flexDirection: "row",
            gap: 3,
            overflow: "auto",
          }}
        >
          <Chip onClick={handleClick} size="medium" label="All categories" />
          <Chip
            onClick={handleClick}
            size="medium"
            label="Company"
            sx={{
              backgroundColor: "transparent",
              border: "none",
            }}
          />
          <Chip
            onClick={handleClick}
            size="medium"
            label="Product"
            sx={{
              backgroundColor: "transparent",
              border: "none",
            }}
          />
          <Chip
            onClick={handleClick}
            size="medium"
            label="Design"
            sx={{
              backgroundColor: "transparent",
              border: "none",
            }}
          />
          <Chip
            onClick={handleClick}
            size="medium"
            label="Engineering"
            sx={{
              backgroundColor: "transparent",
              border: "none",
            }}
          />
        </Box>
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "row",
            gap: 1,
            width: { xs: "100%", md: "fit-content" },
            overflow: "auto",
          }}
        >
          <FormControl sx={{ width: { xs: "100%", md: "25ch" } }} variant="outlined">
            <OutlinedInput
              size="small"
              id="search"
              placeholder="Search…"
              value={search}
              sx={{ flexGrow: 1 }}
              onChange={(e) => setSearch(e.target.value)}
              // startAdornment={
              //   <InputAdornment position="start" sx={{ color: "text.primary" }}>
              //     <SearchRoundedIcon fontSize="small" />
              //   </InputAdornment>
              // }
              inputProps={{
                "aria-label": "search",
              }}
            />
          </FormControl>
          <IconButton size="small" aria-label="RSS feed" onClick={() => props.handleSearch(search)}>
            <SearchRoundedIcon />
          </IconButton>
          <IconButton size="small" aria-label="RSS feed" onClick={() => {
            setSearch("")
            props.handleSearch("")
          }}>
            <CancelOutlined />
          </IconButton>
        </Box>
      </Box>
      <Grid container spacing={2} >
        {props.products.map((product) => (
          <Grid size={{ xs: 6, md: 3 }} key={product.id}>
            <SyledCard
              variant="outlined"
              onFocus={() => handleFocus(0)}
              onBlur={handleBlur}
              tabIndex={0}
              className={focusedCardIndex === 0 ? "Mui-focused" : ""}
              onClick={() => router.push(`/product?id=${product.id}`)}
            >
              <CardMedia
                component="img"
                alt="green iguana"
                image={product.thumbnail_url || "/dummy-product.jpeg"}
                aspect-ratio="16 / 9"
                sx={{
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              />
              <SyledCardContent>
                {/* <Box display="flex" justifyContent="space-between">
                  <Grid> */}
                <Typography gutterBottom variant="caption" component="div">
                  {product.category.name}
                </Typography>
                <Typography gutterBottom variant="h6" component="div">
                  {product.title}
                </Typography>
                <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                  ${product.retail_price?.toFixed(2)}
                </StyledTypography>
                {/* </Grid>
                  <Grid> */}
                <Button
                  variant="contained"
                  onClick={(event) => {
                    event.stopPropagation()
                    props.onCart(product)
                  }}
                >
                  Add to cart
                  {/* <AddShoppingCartIcon /> */}
                </Button>
                {/* </Grid>
                </Box> */}
              </SyledCardContent>
              {/* <Author authors={cardData[0].authors} /> */}
            </SyledCard>
          </Grid>
        ))}
      </Grid>
    </Box >
  )
}
