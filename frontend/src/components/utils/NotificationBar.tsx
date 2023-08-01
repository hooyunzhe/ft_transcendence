import {
  useNotification,
  useNotificationActions,
} from '@/lib/stores/useNotificationStore';
import { Alert, Snackbar } from '@mui/material';

export default function NotificationBar() {
  const notification = useNotification();
  const { resetNotification } = useNotificationActions();

  return (
    <Snackbar
      open={notification.display}
      autoHideDuration={3000}
      onClose={(event, reason) => {
        if (reason !== 'clickaway') {
          resetNotification();
        }
      }}
    >
      <Alert
        onClose={resetNotification}
        severity={notification.level}
        variant='filled'
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
}
