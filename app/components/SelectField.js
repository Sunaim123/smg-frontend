import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"

export default function SelectField(props) {
  return (
    <FormControl fullWidth size="small" {...props}>
      <InputLabel>{props.label}</InputLabel>
      <Select name={props.name} size="small" fullWidth {...props}>
        {props.options.map((option) => {
          return (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}