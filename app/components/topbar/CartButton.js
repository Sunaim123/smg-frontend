import Link from "next/link"
import { useSelector } from "react-redux"
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -6,
    top: -6,
  },
}));

export default function CustomizedBadges() {
  const cart = useSelector(state => state.cart)

  return (
    <IconButton aria-label="cart" size="small" href="/cart" LinkComponent={Link}>
      <StyledBadge badgeContent={cart.length} color="error">
        <ShoppingCartIcon />
      </StyledBadge>
    </IconButton>
  );
}