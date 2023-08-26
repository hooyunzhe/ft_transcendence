import { useGameSocket } from "@/lib/stores/useSocketStore";
import { Box, Button, ToggleButton } from "@mui/material";
import { useEffect, useState } from "react";

export default function GameReady() {
  const [ready, setReady] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const gameSocket = useGameSocket();
  

   const getReady = () =>{
      if (!cooldown)
      {
        setReady(!ready);
        setCooldown(true);
      }
      const timer = setTimeout(() => {
        setCooldown(false);
      }, 1000);

      return(() => {
        clearTimeout(timer);
      })
    
   }
   return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#0e0e2a',
      }}
    >
      <p style={{ color: 'white', fontSize: '24px', marginBottom: '20px' }}>
        GET READY
      </p>
      <Button
        variant='contained'
        onClick={getReady}
  sx={{
    backgroundColor: ready ? 'red' : 'green',
    color: 'white',
    fontSize: '18px',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s', 
    '&:hover': {
      backgroundColor: ready ? 'darkred' :'darkgreen', 
    },
    '&:active': {
      backgroundColor: ready ? 'red' :'green' 
    },
  }}
>
  READY
</Button>
    </Box>
  );
}