import { Controller, useFormContext } from "react-hook-form"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormHelperText from "@mui/material/FormHelperText"

export default function FormCheck({ name, label, rules, ...props }) {
  const {
    control,
    formState: { errors }
  } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => <FormControl
        error={!!errors[name]}
      >
        <FormControlLabel
          control={<Checkbox {...field} color="primary" />}
          label={label}
        />
        {!!errors[name] && <FormHelperText>{errors[name]?.message}</FormHelperText>}
      </FormControl>}
      rules={rules}
    />
  )
}