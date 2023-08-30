'use client';
import { useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useDialog, useDialogActions } from '@/lib/stores/useDialogStore';
import { useUtilActions } from '@/lib/stores/useUtilStore';

export default function DialogPrompt() {
  const dialog = useDialog();
  const { setActionClicked, setBackClicked, resetDialog } = useDialogActions();
  const { setIsPromptOpen } = useUtilActions();

  useEffect(() => {
    setIsPromptOpen(dialog.display);
  }, [dialog.display]);

  return (
    <Dialog open={dialog.display} onClose={resetDialog} maxWidth='xs' fullWidth>
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
