import * as React from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { styled } from "@mui/material/styles"
import Divider, { dividerClasses } from "@mui/material/Divider"
import Menu from "@mui/material/Menu"
import MuiMenuItem from "@mui/material/MenuItem"
import { paperClasses } from "@mui/material/Paper"
import { listClasses } from "@mui/material/List"
import ListItemText from "@mui/material/ListItemText"
import ListItemIcon, { listItemIconClasses } from "@mui/material/ListItemIcon"
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded"
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded"
import MenuButton from "./MenuButton"
import * as userApis from "@/apis/user"
import * as userSlice from "@/store/user"
import * as cartSlice from "@/store/cart"

const MenuItem = styled(MuiMenuItem)({
  margin: "2px 0",
})

export default function OptionsMenu() {
  const userState = useSelector(state => state.user)
  const dispatch = useDispatch()
  const router = useRouter()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = async () => {
    setAnchorEl(null)

    const response = await userApis.logout({ token: userState.token })
    if (!response.status) throw new Error(response.message)

    dispatch(cartSlice.emptyCart())
    dispatch(userSlice.logout())
    router.push("/auth/signin")
  }

  return (
    <React.Fragment>
      <MenuButton
        aria-label="Open menu"
        onClick={handleClick}
        sx={{ borderColor: "transparent" }}
      >
        <MoreVertRoundedIcon />
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={() => setAnchorEl(null)}
        onClick={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: "4px",
          },
          [`& .${paperClasses.root}`]: {
            padding: 0,
          },
          [`& .${dividerClasses.root}`]: {
            margin: "4px -4px",
          },
        }}
      >
        <MenuItem
          sx={{
            [`& .${listItemIconClasses.root}`]: {
              ml: "auto",
              minWidth: 0,
            },
          }}
          onClick={handleClose}
        >
          <ListItemText >Logout</ListItemText>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
}
