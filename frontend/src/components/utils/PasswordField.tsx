'use client';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { useState } from 'react';

interface PasswordFieldProps {
  value: string;
  onChange: (input: string) => void;
  label?: string;
  variant?: 'filled' | 'outlined' | 'standard';
  disabled?: boolean;
}

export default function PasswordField({
  value,
  onChange,
  label,
  variant,
  disabled,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  // const displayNotification = display;

  return (
    <TextField
      fullWidth
      autoComplete='off'
      type={showPassword ? 'text' : 'password'}
      label={label ?? 'Password'}
      variant={variant}
      disabled={disabled}
      value={value}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      error={passwordError}
      helperText={passwordError ? `${label} criteria for password not met` : ''}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton
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
