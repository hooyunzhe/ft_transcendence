
import { Console } from 'console';
import React, { useRef, useState, useEffect } from 'react';
import { Socket, io } from 'socket.io-client';

const ballStyle = {
  height: '35px',
  width: '35px',
  display: 'block',
  backgroundColor: 'blue',
  justifyContent: 'center',
  borderRadius: '100%',
  color: 'white',
};


interface Coor {
  x: number;
  y: number;
}
// const dynamicStyle = {
//   top: '${y}vh',
//   left: '${x}vw',
// };

const Ball = () => {
  const GameSocket = io(`http://${process.env.NEXT_PUBLIC_HOST_URL}:4242/gateway/game');
  const [ball, setBall] = useState<Coor>({ x: 50, y: 50 });
  
  useEffect(() => {
    GameSocket.on("game", (data: { x: number, y: number }) => {
      console.log("BAAALLL?");
      const { x, y } = data;
      const update: Coor = {x, y};
      setBall(update);
  })
}, []);

  const ballRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ballRef}
      style={{
        ...ballStyle,
        left: ball.x + 'vw',
        top: ball.y + 'vh',
        position: 'absolute',
      }}
    />
  );
};

export default Ball;
