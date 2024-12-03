"use client"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from "@mui/material"

export default function ShippingChargesModal(props) {

  return (
    <Dialog
      open={props.modalOpen}
      onClose={props.handleModalClose}
      scroll="paper"
      maxWidth="xl"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      PaperProps={{
        component: 'form',
        onSubmit: props.onSubmit,
      }}
    >
      <DialogTitle id="scroll-dialog-title">
        <Typography id="modal-modal-title" variant="h6">Charges</Typography>
      </DialogTitle>
      <DialogContent>
        <Grid>
          <TextField type="number" name="charges" id="charges" onChange={(e) => props.setReturnService({ ...props.returnService, price: parseFloat(e.target.value) })} variant="outlined" size="small" inputProps={{ step: "0.01" }} />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button type="submit" variant="contained" disableElevation sx={{ margin: "auto" }}>Save</Button>
      </DialogActions>
    </Dialog>
  )
}