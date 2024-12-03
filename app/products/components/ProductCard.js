"use client"
import * as React from "react"
import Avatar from "@mui/material/Avatar"
import AvatarGroup from "@mui/material/AvatarGroup"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"
import { styled } from "@mui/material/styles"

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

export default function ProductCard({ index, cardData, onFocus, onBlur }) {
  return (
    <SyledCard
      variant="outlined"
      onFocus={onFocus}
      onBlur={onBlur}
      tabIndex={index}
      className={focusedCardIndex === index ? "Mui-focused" : ""}
      sx={{ height: "100%" }}
    >
      <CardMedia
        component="img"
        alt="green iguana"
        image={cardData.img}
        sx={{
          height: { sm: "auto", md: "50%" },
          aspectRatio: { sm: "16 / 9", md: "" },
        }}
      />
      <SyledCardContent>
        <Typography gutterBottom variant="caption" component="div">
          {cardData.tag}
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          {cardData.title}
        </Typography>
        <StyledTypography variant="body2" color="text.secondary" gutterBottom>
          {cardData.description}
        </StyledTypography>
      </SyledCardContent>
      <Author authors={cardData.authors} />
    </SyledCard>
  )
}
