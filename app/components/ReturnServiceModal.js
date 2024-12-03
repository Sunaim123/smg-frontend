import { Button, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import * as constants from "@/app/utilities/constants"

export default function ReturnServiceModal(props) {
  const { selectedService, modalOpen, handleModalClose } = props

  const handleClick = (image) => {
    window.open(image)
  }

  return (
    selectedService && (
      <Dialog open={modalOpen} onClose={handleModalClose} fullWidth maxWidth="xl">
        <DialogTitle textTransform="capitalize">{selectedService.type} Service Details</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={2}>
              <Typography variant="body2" color="textSecondary">TYPE</Typography>
              <Typography variant="body1" textTransform="capitalize">{selectedService.type}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2" color="textSecondary">QUANTITY</Typography>
              <Typography variant="body1">{selectedService.quantity}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2" color="textSecondary">PRICE</Typography>
              <Typography variant="body1">${selectedService.price.toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2" color="textSecondary">STATUS</Typography>
              <Typography variant="body1">{constants.returnServiceStatus[selectedService.status]}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2" color="textSecondary">PAYMENT STATUS</Typography>
              <Typography variant="body1">{constants.paymentStatus[selectedService.payment_status]}</Typography>
            </Grid>
            <Grid item sx={2} />
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">NOTES</Typography>
              <Typography variant="body1">{selectedService.company_notes}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">REMARKS</Typography>
              <Typography variant="body1">{selectedService.warehouse_notes}</Typography>
            </Grid>
            {selectedService.image1_url && <Grid item xs={1}>
              <img src={selectedService.image1_url} alt="Image 1" onClick={() => handleClick(selectedService.image1_url)} style={{ width: "100%", height: "80px", borderRadius: "4px", border: "1px solid #eee" }} />
            </Grid>}
            {selectedService.image2_url && <Grid item xs={1}>
              <img src={selectedService.image2_url} alt="Image 2" onClick={() => handleClick(selectedService.image2_url)} style={{ width: "100%", height: "80px", borderRadius: "4px", border: "1px solid #eee" }} />
            </Grid>}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="error">Close</Button>
        </DialogActions>
      </Dialog>
    )
  )
}