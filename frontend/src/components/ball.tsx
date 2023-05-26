import { randomInt } from 'crypto';
import React, { useRef, useState, useEffect } from 'react';

const ballStyle = {
  height: '35px',
  width: '35px',
  display: 'block',
  backgroundColor: 'blue',
  justifyContent: 'center',
  borderRadius: '100%',
  color: 'white',
};

interface BallProps {
  x: number;
  y: number;
}

interface windowSize {
  width: number;
  height: number;
}

// const dynamicStyle = {
//   top: '${y}vh',
//   left: '${x}vw',
// };

const Ball = () => {
  const [ball, setBall] = useState<BallProps>({ x: 50, y: 50 });
  const heading = Math.random() * Math.PI;

  const [dir, setDir] = useState<{ x: number; y: number }>({
    x: Math.cos(heading),
    y: Math.sin(heading),
  });
  const [windowSize, setWindowSize] = useState<windowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const ballRef = useRef<HTMLDivElement>(null);

  const update = (prevBall: BallProps) => {
    const rects = ballRef.current?.getBoundingClientRect();

    console.log('top rect', rects?.top);
    setBall({ x: prevBall.x + dir.x * 0.5, y: prevBall.y + dir.y * 0.5 });

    if (rects) {
      if (rects?.left >= window.innerWidth) {
        if (dir.x >= 0) setDir((prevDir) => ({ ...prevDir, x: -prevDir.x }));
      }
      if (rects?.left <= 0) {
        if (dir.x < 0) setDir((prevDir) => ({ ...prevDir, x: -prevDir.x }));
      }
      if (rects?.top >= window.innerHeight) {
        if (dir.y >= 0) setDir((prevDir) => ({ ...prevDir, y: -prevDir.y }));
      }
      if (rects?.top <= 0) {
        if (dir.y < 0) setDir((prevDir) => ({ ...prevDir, y: -prevDir.y }));
      }
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      update(ball);
    }, 5);

    return () => {
      clearInterval(timer);
    };
  }, [ball]);
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
