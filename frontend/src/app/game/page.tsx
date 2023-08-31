'use client';
import GameMatchFound from '@/components/game/GameMatchFound';
import GameRender from '@/components/game/GameRender';


export default function GamePage() {
  return (
    <div style={{ 
      height: '100vh', 
    }}>
      <GameMatchFound />
    </div>
  );
}