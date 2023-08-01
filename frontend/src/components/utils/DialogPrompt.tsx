'use client';

import { useDialog, useDialogActions } from '@/lib/stores/useDialogStore';
import { useNotification } from '@/lib/stores/useNotificationStore';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

export default function DialogPrompt() {
  const dialog = useDialog();
  const { resetDialog } = useDialogActions();
  const notif = useNotification(); // for my errors

  return (
    <>
      <Dialog
        open={dialog.display}
        onClose={() => {
          resetDialog();
        }}
        maxWidth='xs'
        fullWidth
      ></Dialog>
      <DialogTitle>{dialog.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialog.description}</DialogContentText>
        {dialog.children}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            dialog.backHandler();
          }}
        >
          {dialog.actionButtonText}
        </Button>
        <Button
          onClick={() => {
            dialog.handleAction().catch((errMsg) => {
              console.log(errMsg);
            });
          }}
        >
          {dialog.actionButtonText}
        </Button>
      </DialogActions>
    </>
  );
}
