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
  whiteText?: boolean;
  ignoreError?: boolean;
  handleEnterInput?: boolean;
  label: string;
  value: string;
  onChange: (input: string) => void;
  onSubmit: () => Promise<void>;
}

export default function InputField({
  outlined,
  normalMargin,
  whiteText,
  ignoreError,
  handleEnterInput,
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
      InputProps={{
        sx: {
          color: whiteText ? '#DDDDDD' : 'black',
        },
      }}
      value={value}
      onChange={(event) => {
        if (!ignoreError) {
          setEmptyError(!event.target.value);
          setActionButtonDisabled(!event.target.value);
        }
        onChange(event.target.value);
      }}
      onKeyDown={(event) => {
        if (
          event.key === 'Enter' &&
          handleEnterInput &&
          (ignoreError || !dialogActionButtonDisabled)
        ) {
          onSubmit();
        }
      }}
      error={!ignoreError && emptyError}
      helperText={!ignoreError && emptyError ? `${label} cannot be empty` : ''}
    />
  );
}
