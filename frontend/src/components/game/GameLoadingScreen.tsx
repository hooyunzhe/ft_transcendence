'use client'

import { useUtilActions } from "@/lib/stores/useUtilStore";
import { View } from "@/types/UtilTypes";
import { Box, LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";



export default function GameLoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState(0);
  const viewAction = useUtilActions();
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress === 100) {
          viewAction.setCurrentView(View.PHASER);
        }
        const diff = Math.random() * 10;
        return Math.min(prevProgress + diff, 100);
      });
      setDots((prevDots) => (prevDots + 1)  % 4);
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const loadingText = () => {
    const dottedLine = '.'.repeat(dots);
    return `Loading${dottedLine}`;
  }
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh', // Center the content vertically
        backgroundColor: '#0e0e2a', // Neon purple background color
      }}
    >
      <p style={{ color: 'white', fontSize: '24px', marginBottom: '20px' }}>
        {loadingText()}
      </p>
      <LinearProgress
        sx={{ width: '50%', height: '20px', borderRadius: '10px' }}
        variant="determinate"
        value={progress}
        color="secondary" // Use the secondary color for neon purple
      />
    </Box>
  );
}