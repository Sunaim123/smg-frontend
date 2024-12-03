import * as React from "react"
import { useRouter, usePathname } from "next/navigation"

import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Stack from "@mui/material/Stack"

import HomeRoundedIcon from "@mui/icons-material/HomeRounded"
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded"
import InventoryIcon from "@mui/icons-material/Inventory"
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded"
import InfoRoundedIcon from "@mui/icons-material/InfoRounded"
import HelpRoundedIcon from "@mui/icons-material/HelpRounded"
import CategoryIcon from "@mui/icons-material/Category"
import GroupIcon from "@mui/icons-material/Group"
import Warehouse from "@mui/icons-material/Warehouse"

export default function MenuContent() {
  const router = useRouter()
  const pathname = usePathname()

  const mainListItems = [
    { text: "Home", icon: <HomeRoundedIcon />, link: "/sp/d" },
    { text: "Products", icon: <InventoryIcon />, link: "/sp/d/products" },
    { text: "Orders", icon: <CategoryIcon />, link: "/sp/d/orders" },
    { text: "Returns", icon: <Warehouse />, link: "/sp/d/returns?status=Received" },
    { text: "Payments", icon: <AnalyticsRoundedIcon />, link: "/sp/d/payments" },
  ]

  const secondaryListItems = [
    { text: "Users", icon: <GroupIcon />, link: "/sp/d/users" },
    { text: "Settings", icon: <SettingsRoundedIcon />, link: "/sp/d/settings" },
    { text: "Support", icon: <HelpRoundedIcon />, link: "/sp/d/supports" },
  ]

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton selected={pathname === item.link.split('?')[0]} onClick={() => router.push(item.link)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  )
}
