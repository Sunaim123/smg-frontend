import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, TextField } from "@mui/material"
import moment from "moment"

import DateTimePicker from "./DateTimePicker"

const Modal = (props) => {
  return (
    <Box>
      <Dialog
        maxWidth="lg"
        open={props.open}
        onClose={() => props.setOpen(false)}
        PaperProps={{
          component: 'form',
          onSubmit: props.onSubmit,
        }}
      >
        <DialogTitle>Search Returns</DialogTitle>
        <DialogContent>
          <Grid container spacing={1} py={1}>
            <Grid item xs={6}>
              <DateTimePicker label="From" value={props.filters.from_date ? moment(props.filters.from_date) : null} onChange={(value) => props.setFilters({ ...props.filters, from_date: value ? value.toISOString() : null })} />
            </Grid>
            <Grid item xs={6}>
              <DateTimePicker label="To" value={props.filters.to_date ? moment(props.filters.to_date) : null} onChange={(value) => props.setFilters({ ...props.filters, to_date: value ? value.toISOString() : null })} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Rma Number" size="small" fullWidth value={props.filters.rma_number} onChange={(e) => props.setFilters({ ...props.filters, rma_number: e.target.value })} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Tracking Number" size="small" fullWidth value={props.filters.tracking_number} onChange={(e) => props.setFilters({ ...props.filters, tracking_number: e.target.value })} />
            </Grid>
            <Grid item xs={10} />
            <Grid item xs={2}>
              <Button type="submit" variant="contained" disableElevation fullWidth>Search</Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default Modal
