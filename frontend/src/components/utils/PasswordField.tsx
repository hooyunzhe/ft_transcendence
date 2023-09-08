'use client';
import { useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import checkPasswordCriteria from '@/lib/checkPasswordCriteria';
import {
  useDialogActionButtonDisabled,
  useDialogActions,
} from '@/lib/stores/useDialogStore';

interface PasswordFieldProps {
  unfocused?: boolean;
  hasCriteria?: boolean;
  disabled?: boolean;
  label?: string;
  value: string;
  onChange: (input: string) => void;
  onSubmit: () => Promise<void>;
}

export default function PasswordField({
  unfocused,
  hasCriteria,
  disabled,
  label = 'Password',
  value,
  onChange,
  onSubmit,
}: PasswordFieldProps) {
  const dialogActionButtonDisabled = useDialogActionButtonDisabled();
  const { setActionButtonDisabled } = useDialogActions();
  const [showPassword, setShowPassword] = useState(false);
  const [emptyError, setEmptyError] = useState(false);
  const [criteriaError, setCriteriaError] = useState(
    hasCriteria && value.length > 0 ? checkPasswordCriteria(value) : '',
  );

  return (
    <TextField
      fullWidth
      autoFocus={!unfocused}
      autoComplete='off'
      disabled={disabled}
      label={label}
      variant='standard'
      type={showPassword ? 'text' : 'password'}
      value={value}
      onChange={(event) => {
        setEmptyError(!event.target.value);
        setActionButtonDisabled(!event.target.value);
        if (hasCriteria) {
          const criteriaErrorText = checkPasswordCriteria(event.target.value);

          setCriteriaError(criteriaErrorText);
          setActionButtonDisabled(criteriaErrorText.length > 0);
        }
        onChange(event.target.value);
      }}
      error={emptyError || criteriaError.length > 0}
      helperText={
        emptyError
          ? `${label} cannot be empty`
          : hasCriteria && criteriaError.length > 0
          ? `${label} ${criteriaError}`
          : ''
      }
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton
              disabled={disabled}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => setShowPassword((showPassword) => !showPassword)}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
