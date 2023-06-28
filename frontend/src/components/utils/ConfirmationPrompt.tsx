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
  handleAction: (...args: any) => void;
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
        {/* DOES NOTHING AND CLOSES I GUESS */}
        <Button onClick={onCloseHandler}>No</Button>
        {/*  API STUFF HAPPENS HERE*/}
        <Button onClick={handleAction}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
}
