"use client"
import { useState } from "react"
import { useSelector } from "react-redux"
import { useRouter, usePathname } from "next/navigation"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Stack from "@mui/material/Stack"
import HomeRoundedIcon from "@mui/icons-material/HomeRounded"
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded"
import ReceiptIcon from "@mui/icons-material/Receipt"
import AssessmentIcon from "@mui/icons-material/Assessment"
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded"
import HelpRoundedIcon from "@mui/icons-material/HelpRounded"
import GroupIcon from "@mui/icons-material/Group"
import { Divider } from "@mui/material"
import Warehouse from "@mui/icons-material/Warehouse"


export default function MenuContent() {
  const userState = useSelector(state => state.user)
  const router = useRouter()
  const pathname = usePathname()
  const [state, setState] = useState(false)

  const mainListItems = [
    { text: "Home", icon: <HomeRoundedIcon />, link: "/wp/d" },
    { text: "Returns", icon: <Warehouse />, link: "/wp/d/returns?status=Received" },
    { text: "Fulfillments", icon: <PeopleRoundedIcon />, link: "/wp/d/fbas?status=Pending" },
  ]
  // if (userState.warehouseUser && userState.permissions && userState.permissions["READ_INVOICES"]) mainListItems.push({ text: "Invoices", icon: <ReceiptIcon />, link: "/wp/d/invoices" })

  const secondaryListItems = [
    { text: "Users", icon: <GroupIcon />, link: "/wp/d/users" },
    { text: "Settings", icon: <SettingsRoundedIcon />, link: "/wp/d/settings" },
    { text: "Support", icon: <HelpRoundedIcon />, link: "/wp/d/supports" },
  ]

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              selected={pathname === item.link.split('?')[0]}
              onClick={() => {
                router.push(item.link)
                setState(false)
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        {userState.warehouseUser && userState.permissions && userState.permissions["READ_PAYMENT_LOGS"] &&
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton onClick={() => setState(!state)}>
              <ListItemIcon><AssessmentIcon /></ListItemIcon>
              <ListItemText primary="Reports" />
            </ListItemButton>
          </ListItem>}
        {userState.warehouseUser && userState.permissions && userState.permissions["READ_PAYMENT_LOGS"] && state &&
          <>
            <Divider />
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton selected={pathname === "/wp/d/reports/payment-logs"} onClick={() => router.push("/wp/d/reports/payment-logs")}>
                <ListItemText primary="&nbsp;&nbsp;&nbsp; > Payment Logs" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton selected={pathname === "/wp/d/reports/income-statement"} onClick={() => router.push("/wp/d/reports/income-statement")}>
                <ListItemText primary="&nbsp;&nbsp;&nbsp; > Income Statement" />
              </ListItemButton>
            </ListItem>
          </>
        }
      </List>

      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              selected={pathname === item.link}
              onClick={() => {
                router.push(item.link)
                setState(false)
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  )
}
