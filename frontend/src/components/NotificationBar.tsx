import { Alert, AlertColor, Snackbar } from '@mui/material';

interface NotificationBarProps {
  display: boolean;
  level: AlertColor;
  message: string;
  onCloseHandler: () => void;
}

export default function NotificationBar({
  display,
  level,
  message,
  onCloseHandler,
}: NotificationBarProps) {
  return (
    <Snackbar
      open={display}
      autoHideDuration={6000}
      onClose={(event, reason) => {
        if (reason !== 'clickaway') {
          onCloseHandler();
        }
      }}
    >
      <Alert onClose={onCloseHandler} severity={level} variant='filled'>
        {message}
      </Alert>
    </Snackbar>
  );
}
