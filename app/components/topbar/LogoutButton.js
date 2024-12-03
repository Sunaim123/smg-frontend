import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"

import IconButton from "@mui/material/IconButton"

import PowerSettingsNewOutlined from "@mui/icons-material/PowerSettingsNewOutlined"

import * as userApis from "@/apis/user"
import * as userSlice from "@/store/user"
import * as cartSlice from "@/store/cart"

export default function LogoutButton() {
  const userState = useSelector(state => state.user)
  const dispatch = useDispatch()
  const router = useRouter()
  const handleClick = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return

    const response = await userApis.logout({ token: userState.token })
    if (!response.status) throw new Error(response.message)

    dispatch(userSlice.logout())
    dispatch(cartSlice.emptyCart())
    router.replace("/auth/signin")
  }

  return (
    <IconButton
      onClick={handleClick}
      color="primary"
      aria-label="Logout button"
      size="small"
    >
      <PowerSettingsNewOutlined fontSize="small" />
    </IconButton>
  )
}
