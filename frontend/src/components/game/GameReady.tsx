import { useGameSocket } from "@/lib/stores/useSocketStore";
import { Box, ToggleButton } from "@mui/material";
import { useEffect, useState } from "react";

export default function GameReady() {
  const [ready, setReady] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const gameSocket = useGameSocket();
  
  // useEffect(() => {
    
  //  })


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
   const getText = () =>
   {
    if (ready)
      return ("Unready");
    else
      return ("Ready");
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
      <ToggleButton
      value={ready}
      selected={!ready}
      onChange={getReady}
    >
      {getText()}
    </ToggleButton>
    </Box>
  );
}