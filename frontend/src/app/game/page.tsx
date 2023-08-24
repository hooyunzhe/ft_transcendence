'use client';
import GameRender from '@/components/game/GameRender';

export default function gamePage() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <GameRender />
    </div>
  );
}
