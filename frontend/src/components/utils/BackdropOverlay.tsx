'use client';
import { Backdrop } from '@mui/material';
import { useBackdrop, useBackdropActions } from '@/lib/stores/useBackdropStore';

export default function BackdropOverlay() {
  const backdrop = useBackdrop();
  const { resetBackdrop } = useBackdropActions();

  function handleClick(): void {
    if (backdrop.handleClose) {
      backdrop.handleClose();
      resetBackdrop();
    }
  }

  return (
    <Backdrop
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        ...(backdrop.fadeTransition && { bgcolor: 'black' }),
      }}
      {...(backdrop.fadeTransition && {
        transitionDuration: { enter: 1500, exit: 3000 },
      })}
      open={backdrop.display}
      onClick={handleClick}
    >
      {backdrop.children}
    </Backdrop>
  );
}
