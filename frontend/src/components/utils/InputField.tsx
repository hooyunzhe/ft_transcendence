import { TextField } from '@mui/material';
import { useState } from 'react';

interface InputFieldProps {
  outlined?: boolean;
  normalMargin?: boolean;
  label: string;
  value: string;
  onChange: (input: string) => void;
  onSubmit: () => Promise<void>;
}

export default function InputField({
  outlined,
  normalMargin,
  value,
  onChange,
  onSubmit,
  label,
}: InputFieldProps) {
  const [emptyError, setEmptyError] = useState(false);

  return (
    <TextField
      fullWidth
      autoFocus
      autoComplete='off'
      hiddenLabel={!label}
      label={label}
      variant={outlined ? 'outlined' : 'standard'}
      margin={normalMargin ? 'normal' : 'dense'}
      value={value}
      onChange={(event) => {
        setEmptyError(!event.target.value);
        onChange(event.target.value);
      }}
      onKeyDown={(event) => event.key === 'Enter' && onSubmit()}
      error={emptyError}
      helperText={emptyError ? `${label} cannot be empty` : ''}
    />
  );
}
