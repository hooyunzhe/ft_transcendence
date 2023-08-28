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
      fullWidth
      maxWidth='xs'
      open={dialog.display}
      onClose={resetDialog}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          setActionClicked();
        }
      }}
    >
      <DialogTitle>{dialog.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialog.description}</DialogContentText>
        {dialog.children}
      </DialogContent>
      <DialogActions>
        <Button onClick={setBackClicked}>{dialog.backButtonText}</Button>
        <Button
          onClick={setActionClicked}
          disabled={dialog.actionButtonDisabled}
        >
          {dialog.actionButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
