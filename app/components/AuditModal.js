import { Button, Table, TableBody, TableCell, TableRow, TableHead, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"

export default function AuditModal(props) {
  const { modalOpen, handleModalClose, audit } = props

  return (
    <Dialog open={modalOpen} onClose={handleModalClose} fullWidth maxWidth="md">
      <DialogTitle textTransform="capitalize">Return Changes</DialogTitle>
      <DialogContent>
        <Table>
          <TableHead sx={{ backgroundColor: '#eee' }}>
            <TableRow>
              <TableCell>Changes</TableCell>
              <TableCell>Previous</TableCell>
              <TableCell>Next</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {audit.next &&
              Object.keys(audit.next).map((key) => (
                <TableRow key={key}>
                  <TableCell>
                    <Typography component="pre" variant="body2">{key.replace(/_/g, " ")}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography component="pre" variant="body2">
                      {audit.previous && audit.previous[key] !== undefined ? String(audit.previous[key]) : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography component="pre" variant="body2">
                      {audit.next[key] !== undefined ? String(audit.next[key]) : 'N/A'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleModalClose} color="error">Close</Button>
      </DialogActions>
    </Dialog>
  )
}
