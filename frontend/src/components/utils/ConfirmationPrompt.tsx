import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface ConfirmationPromptProps {
  open: boolean;
  onCloseHandler: () => void;
  promptTitle: string;
  promptDescription: string;
  actionHandler: () => void;
}

export default function ConfirmationPrompt({
  open,
  onCloseHandler,
  promptTitle,
  promptDescription,
  actionHandler,
}: ConfirmationPromptProps) {
  return (
    <Dialog open={open} onClose={onCloseHandler} maxWidth='xs' fullWidth>
      <DialogTitle>{promptTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>{promptDescription}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseHandler}>No</Button>
        <Button onClick={actionHandler}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
}
