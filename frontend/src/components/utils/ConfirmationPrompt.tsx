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
  handleAction: () => void;
}

export default function ConfirmationPrompt({
  open,
  onCloseHandler,
  promptTitle,
  promptDescription,
  handleAction,
}: ConfirmationPromptProps) {
  return (
    <Dialog open={open} onClose={onCloseHandler} maxWidth='xs' fullWidth>
      <DialogTitle>{promptTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>{promptDescription}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseHandler}>No</Button>
        <Button onClick={handleAction}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
}
