import { Button, ListItemText, Menu, MenuItem } from '@mui/material';

interface GameMenuDropdownProps {
  anchorElement: HTMLElement | undefined;
  handleClose: () => void;
  findMatch: (gameMode: string) => void;
}

export default function GameMenuDropdown({
  anchorElement,
  handleClose,
  findMatch,
}: GameMenuDropdownProps) {
  return (
    <Menu
      sx={{
        '& .MuiPaper-root': {
          bgcolor: '#00000000',
        },
      }}
      open={anchorElement !== undefined}
      anchorEl={anchorElement}
      onClose={() => handleClose()}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Button
        variant='contained'
        sx={{
          bgcolor: '#4CC9F080',
          ':hover': {
            bgcolor: '#4CC9F060',
          },
        }}
        onClick={() => {
          findMatch('classic');
          handleClose();
        }}
      >
        Classic
      </Button>
      <Button
        variant='contained'
        sx={{
          bgcolor: '#4CC9F080',
          ':hover': {
            bgcolor: '#4CC9F060',
          },
        }}
        onClick={() => {
          findMatch('cyberpong');
          handleClose();
        }}
      >
        Cyberpong
      </Button>
    </Menu>
  );
}
