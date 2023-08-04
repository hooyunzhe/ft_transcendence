'use client';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useDialog, useDialogActions } from '@/lib/stores/useDialogStore';

export default function DialogPrompt() {
  const dialog = useDialog();
  const { setActionClicked, setBackClicked, resetDialog } = useDialogActions();

  return (
    <Dialog
      open={dialog.display}
      onClose={() => {
        resetDialog();
      }}
      maxWidth='xs'
      fullWidth
    >
      <DialogTitle>{dialog.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialog.description}</DialogContentText>
        {dialog.children}
      </DialogContent>
      <DialogActions>
        <Button onClick={setBackClicked}>{dialog.backButtonText}</Button>
        <Button onClick={setActionClicked}>{dialog.actionButtonText}</Button>
      </DialogActions>
    </Dialog>
  );
}
