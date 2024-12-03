import { useDispatch, useSelector } from "react-redux"

import IconButton from "@mui/material/IconButton"

import WbSunnyOutlined from "@mui/icons-material/WbSunnyOutlined"
import ModeNightOutlined from "@mui/icons-material/ModeNightOutlined"

import * as themeSlice from "@/store/theme"

export default function ToggleButton() {
  const themeState = useSelector(state => state.theme)
  const mode = themeState.theme
  const dispatch = useDispatch()
  const handleClick = () => {
    dispatch(themeSlice.toggleTheme(mode === "dark" ? "light" : "dark"))
  }

  return (
    <IconButton
      onClick={handleClick}
      color="primary"
      aria-label="Theme toggle button"
      size="small"
    >
      {mode === "dark" ? (
        <WbSunnyOutlined fontSize="small" />
      ) : (
        <ModeNightOutlined fontSize="small" />
      )}
    </IconButton>
  )
}
