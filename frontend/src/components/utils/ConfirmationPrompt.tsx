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
      fullWidth
      maxWidth='xs'
      open={confirmation.required}
      onClose={resetConfirmation}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          handleConfirmation();
        }
      }}
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
