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
      sx={{ bgcolor: '#00000000' }}
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
        // onClick={findMatch}
        // onClick={(event) => setGameMenuAnchor(event.currentTarget)}
        // disabled={matchState === MatchState.SEARCHING}
      >
        Start Game
      </Button>
      {/* <MenuItem
        onClick={() => {
          handleClose();
          findMatch('classic');
        }}
      >
        <ListItemText>Classic</ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleClose();
          findMatch('custom');
        }}
      >
        <ListItemText>Custom</ListItemText>
      </MenuItem> */}
    </Menu>
  );
}
