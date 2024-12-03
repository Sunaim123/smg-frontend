import { Controller, useFormContext } from "react-hook-form"
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material"

export default function SelectForm({ name, rules, options, label, onChange, ...props }) {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <FormControl fullWidth error={!!errors[name]}>
      <InputLabel>{label}</InputLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            {...field}
            label={label}
            {...props}
            value={field.value}
            onChange={(e) => {
              field.onChange(e)
              if (onChange) onChange(e)
            }}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        )}
        rules={rules}
      />
      {errors[name] && <FormHelperText>{errors[name]?.message}</FormHelperText>}
    </FormControl>
  )
}
