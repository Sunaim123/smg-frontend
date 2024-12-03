import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import { DateTimePicker as MUIDateTimePicker } from "@mui/x-date-pickers"

export default function DateTimePicker(props) {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <MUIDateTimePicker label={props.label} sx={{ width: "100%" }} value={props.value} onChange={props.onChange} />
    </LocalizationProvider>
  )
}