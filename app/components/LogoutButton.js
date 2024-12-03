import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { PowerSettingsNew } from "@mui/icons-material";
import * as userSlice from "@/store/user"
import * as cartSlice from "@/store/cart"
import * as userApis from "@/apis/user"

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -6,
    top: -6,
  },
}));

export default function CustomizedBadges() {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const dispatch = useDispatch()

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return

    const response = await userApis.logout({ token: userState.token })
    if (!response.status) throw new Error(response.message)

    dispatch(cartSlice.emptyCart())
    dispatch(userSlice.logout())
    router.push("/auth/signin")
  }

  return (
    <IconButton aria-label="logout" size="small" onClick={handleLogout}>
      <StyledBadge color="error">
        <PowerSettingsNew />
      </StyledBadge>
    </IconButton>
  );
}