import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  useConfirmation,
  useConfirmationActions,
} from '@/lib/stores/useConfirmationStore';

export default function ConfirmationPrompt() {
  const confirmation = useConfirmation();
  const { resetConfirmation } = useConfirmationActions();

  function handleConfirmation() {
    confirmation.handleAction(confirmation.args);
    resetConfirmation();
  }

  return (
    <Dialog
      open={confirmation.required}
      onClose={resetConfirmation}
      maxWidth='xs'
      fullWidth
    >
      <DialogTitle>{confirmation.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{confirmation.description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={resetConfirmation}>No</Button>
        <Button onClick={handleConfirmation}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
}
