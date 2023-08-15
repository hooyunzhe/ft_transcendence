'use client';
import { useState } from 'react';
import { TextField } from '@mui/material';
import {
  useDialogActionButtonDisabled,
  useDialogActions,
} from '@/lib/stores/useDialogStore';

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
  label,
  value,
  onChange,
  onSubmit,
}: InputFieldProps) {
  const dialogActionButtonDisabled = useDialogActionButtonDisabled();
  const { setActionButtonDisabled } = useDialogActions();
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
        setActionButtonDisabled(!event.target.value);
        onChange(event.target.value);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && !dialogActionButtonDisabled) {
          onSubmit();
        }
      }}
      error={emptyError}
      helperText={emptyError ? `${label} cannot be empty` : ''}
    />
  );
}
