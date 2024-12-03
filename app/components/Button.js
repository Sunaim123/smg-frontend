"use client"
import Button from "@mui/material/Button"

export default function CustomButton(props) {
  return (
    <Button
      type="submit"
      sx={{
        backgroundColor: "black",
        color: "white",
        textAlign: "center",
        border: "none",
        borderRadius: "4px",
        textTransform: "none",
        cursor: "pointer",
        fontSize: "1rem",
        padding: "6px 12px",
        "&:hover": {
          backgroundColor: "#4EC274",
          color: "black",
        },
      }}
      {...props}
    >
      {props.children}
    </Button>
  )
}
