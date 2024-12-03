import styled from "@mui/material/styles/styled"

export default styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
})