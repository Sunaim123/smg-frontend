import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import moment from "moment"
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
import * as reportService from "@/app/services/report"
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

const ReturnReport = (props) => {
  const userState = useSelector(state => state.user)
  const [returns, setReturns] = useState([])

  const getReturns = async () => {
    try {
      const query = new URLSearchParams({company_ids: props.filters.join(",")})
      const response = await reportService.getReturnCountValue(userState.token, query.toString())
      if (!response.status) throw new Error(response.message)

      setReturns(response.returns)
    } catch (error) {
      alert(error.message)
    }
  }

  useEffect(() => {
    getReturns()
  }, [props.filters])

  const data = {
    labels: returns.map(x => x.month),
    datasets: [{
      label: 'Returns',
      data: returns.map(x => parseInt(x.count)),
      backgroundColor: "#1976d2",
    }]
  }

  return (
    <Card sx={{ border: "2px #ddd dotted" }} elevation={false}>
      <CardContent sx={{ height: 400 }}>
        <Line options={chartOptions} data={data} />
      </CardContent>
    </Card>
  )
}

export default ReturnReport
