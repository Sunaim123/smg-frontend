import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Autocomplete, Box, Card, CardHeader, FormControl, Grid, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material"
import * as constants from "@/app/utilities/constants"
import * as reportServices from "@/app/services/report"

const DashboardReport = (props) => {
  const userState = useSelector(state => state.user)
  const [returns, setReturns] = useState([])
  const [users, setUsers] = useState([])

  const getReturnCount = async () => {
    try {
      const query = new URLSearchParams({company_ids: props.filters.join(",")})
      const response = await reportServices.getReturnCount(userState.token, query.toString())
      if (!response.status) throw new Error(response.message)

      setReturns(response.returns)
    } catch (error) {
      props.setToast({ type: "error", open: true, message: error.message })
    }
  }

  const getUserCount = async () => {
    try {
      const query = new URLSearchParams({company_ids: props.filters.join(",")})
      const response = await reportServices.getUserCount(userState.token, query.toString())
      if (!response.status) throw new Error(response.message)

      setUsers(response.users)
    } catch (error) {
      props.setToast({ type: "error", open: true, message: error.message })
    }
  }

  useEffect(() => {
    getUserCount()
    getReturnCount()
  }, [props.filters])

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ border: "2px #ddd dotted" }} elevation={0}>
          <CardHeader title="Number of Returns" titleTypographyProps={{ variant: "h6", fontWeight: 700 }} />
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ background: "#f3f3f3", fontWeight: "bold" }}>Company</TableCell>
                <TableCell sx={{ background: "#f3f3f3", fontWeight: "bold" }}>Date</TableCell>
                <TableCell sx={{ background: "#f3f3f3", fontWeight: "bold" }}>Returns</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {returns.map((_return) => (
                <TableRow key={_return.company}>
                  <TableCell sx={{ color: constants.getCompanyStatus(_return.company.payment_status, _return.company.end_date) }}>{_return.company}</TableCell>
                  <TableCell>{constants.getFormattedDate(_return.last_payment_date)} to {constants.getFormattedDate(_return.end_date)}</TableCell>
                  <TableCell>{_return.returns}/{_return.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ border: "2px #ddd dotted" }} elevation={0}>
          <CardHeader title="Number of Users" titleTypographyProps={{ variant: "h6", fontWeight: 700 }} />
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ background: "#f3f3f3", fontWeight: "bold" }}>Company</TableCell>
                <TableCell sx={{ background: "#f3f3f3", fontWeight: "bold" }}>Date</TableCell>
                <TableCell sx={{ background: "#f3f3f3", fontWeight: "bold" }}>Users</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.company}>
                  <TableCell sx={{ color: user.payment_status !== "paid" ? "red" : "green" }}>{user.company}</TableCell>
                  <TableCell>{constants.getFormattedDate(user.last_payment_date)} to {constants.getFormattedDate(user.end_date)}</TableCell>
                  <TableCell>{user.users}/{user.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Grid>
    </Grid>
  )
}

export default DashboardReport
