import { Controller, useFormContext } from "react-hook-form"
import TextField from "@mui/material/TextField"

export default function FormField({ name, rules, onChange, ...props }) {
  const {
    control,
    formState: { errors }
  } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => <TextField
        {...field}
        {...props}
        value={field.value}
        error={!!errors[name]}
        fullWidth
        helperText={errors[name]?.message}
        onChange={(e) => {
          field.onChange(e)
          if (onChange) onChange(e)
        }}
      />}
      rules={rules}
    />
  )
}