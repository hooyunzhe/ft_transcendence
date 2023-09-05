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
  invertColors?: boolean;
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
  invertColors,
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
          color: invertColors ? '#DDDDDD' : 'black',
          ...(invertColors && {
            '&.MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#DDDDDD' },
              '&:hover fieldset': { borderColor: '#DDDDDD' },
              '&.Mui-focused fieldset': { borderColor: '#DDDDDD' },
            },
          }),
        },
      }}
      {...(invertColors && {
        InputLabelProps: {
          sx: {
            color: '#DDDDDD',
            '&.Mui-focused': {
              color: '#DDDDDD',
            },
          },
        },
      })}
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
