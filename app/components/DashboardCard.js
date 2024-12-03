import { useRouter } from "next/navigation"
import { Card, CardActionArea, CardContent, Typography } from "@mui/material"

export default function DashboardCard(props) {
  const router = useRouter()

  const handleLink = (link) => {
    router.push(link)
  }

  return (
    <Card sx={{ border: "2px #ddd dotted" }} elevation={false}>
      <CardActionArea onClick={() => handleLink(props.link)}>
        <CardContent>
          <Typography fontSize={20} fontWeight={700} mb={5} color="text">{props.title}</Typography>
          {props.extra}
        </CardContent>
      </CardActionArea>
    </Card>
  )
}