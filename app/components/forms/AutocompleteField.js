import { Controller, useFormContext } from "react-hook-form";
import FormField from "./FormField";
import { Autocomplete } from "@mui/material";

export default function AutocompleteField({ name, rules, options = [], ...props }) {
  const { control, formState: { errors } } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <Autocomplete
          {...props}
          options={options}
          fullWidth
          size="small"
          freeSolo
          value={field.value || ''}
          onChange={(e, option) => field.onChange(option ? option.label : '')}
          renderInput={(params) => (
            <FormField
              {...params}
              label={props.label}
              error={!!errors[name]}
              helperText={errors[name]?.message}
            />
          )}
        />
      )}
    />
  );
}
