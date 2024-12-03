import moment from "moment"
import Chip from "@mui/material/Chip"

export const maximumImageSize = 4_096_000
export const imageExtensions = ["image/jpeg", "image/jpg", "image/png"]

export const returnStatus = {
  "received": <Chip label="RECEIVED" />,
  "opened": <Chip label="OPENED" />,
  "ship requested": <Chip label="SHIP REQUESTED" color="warning" />,
  "shipped": <Chip label="SHIPPED" color="success" />,
  "delivered": <Chip label="DELIVERED" color="success" />,
}

export const returnServiceStatus = {
  "requested": <Chip label="REQUESTED" color="warning" />,
  "completed": <Chip label="COMPLETED" color="success" />,
}

export const feedbackStatus = {
  Opened: <Chip label="OPENED" />,
  Closed: <Chip label="CLOSED" color="success" />,
  Voided: <Chip label="VOIDED" color="error" />,
}

export const fbaStatus = {
  "pending": <Chip label="PENDING" />,
  "received": <Chip label="IN PROGRESS" color="warning" />,
  "shipped": <Chip label="SHIPPED" color="success" />,
}

export const paymentStatus = {
  "paid": <Chip label="PAID" color="success" />,
  "unpaid": <Chip label="UNPAID" color="error" />,
  "refunded": <Chip label="REFUNDED" color="info" />
}

export const orderStatus = {
  "received": <Chip label="RECEIVED" />,
  "awaiting payment": <Chip label="AWAITING PAYMENT" />,
  "shipped": <Chip label="SHIPPED" color="success" />,
  "cancelled": <Chip label="CANCELLED" color="error" />,
  "refunded": <Chip label="REFUNDED" color="warning" />,
}

export const invoiceStatus = {
  "awaiting payment": <Chip label="AWAITING PAYMENT" color="error" />,
  "partial paid": <Chip label="PARTIAL PAID" color="warning" />,
  "paid": <Chip label="PAID" color="success" />,
}

export const getCompanyStatus = (status, endDate) => {
  const currentDate = new Date()
  const formattedEndDate = new Date(endDate)
  
  if (status === "paid") return "green"
  if (status === "unpaid" && formattedEndDate >= currentDate) return "#FFCC00"
  if (status === "unpaid" && formattedEndDate < currentDate) return "red"
}

export const getFormattedDate = (date) => moment(date).format("Do MMM")
export const getFormattedDatetime = (date) => moment(date).format("DD-MM-YYYY HH:mm")
export const superUser = (role = "") => role === "super admin"
export const warehouseUser = (role = "") => role.toLowerCase().indexOf("warehouse") !== -1
export const companyUser = (role = "") => role.toLowerCase().indexOf("company") !== -1
