import { Alert as MUIAlert, Snackbar } from "@mui/material"

export default function Alert({ toast, setToast }) {
  const handleClose = () => {
    setToast({ ...toast, open: false })
  }

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={toast.open}
      onClose={handleClose}
      message={toast.message}
      key="message"
      autoHideDuration={toast.type === "success" ? 2500 : 10000}
    >
      <MUIAlert onClose={handleClose} severity={toast.type} sx={{ width: "100%" }}>{toast.message}</MUIAlert>
    </Snackbar>
  )
}