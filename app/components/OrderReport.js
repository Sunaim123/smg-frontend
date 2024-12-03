import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line } from "react-chartjs-2"
import * as reportService from "../../services/report"
import { Card, CardHeader, CardContent, Box, Button, ButtonGroup, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material"

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

const chartOptions = {
  responsive: true,
}

const OrderReport = (props) => {
  const userState = useSelector(state => state.user)
  const [orders, setOrders] = useState([])

  const getOrders = async (params) => {
    try {
      const response = await reportService.getOrderCount(userState.token, params)
      if (!response.status) throw new Error(response.message)

      setOrders(response.orders)
    } catch (error) {
      alert(error.message)
    }
  }

  useEffect(() => {
    let query = ""
    if (props.company_ids) query = new URLSearchParams({ company_ids: props.company_ids.join(",") }).toString()
    getOrders(query)
  }, [props.company_ids])

  const data = {
    labels: orders.map(x => x.month),
    datasets: [{
      label: 'Orders',
      data: orders.map(x => parseInt(x.count)),
      backgroundColor: "#1976d2",
    }]
  }

  return (
    <Card variant="outlined" elevation={false}>
      <CardContent sx={{ height: "100%" }}>
        <Line options={chartOptions} data={data} />
      </CardContent>
    </Card>
  )
}

export default OrderReport
