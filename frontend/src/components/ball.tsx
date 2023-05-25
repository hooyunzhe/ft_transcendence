import React from 'react';

const ballStyle = {
  height: "35px",
  width: "35px",
  display: "block",
  backgroundColor: "blue",
  justifyContent: "center",
  borderRadius: "100%",
  color: "white",
  position: "absolute",
};

interface BallProps {
  x: number;
  y: number;
}

const Ball: React.FC<BallProps> = ({ x, y, onClick }) => {
  const dynamicStyle = {
    left: `${x}vw`,
    top: `${y}vh`,
  };

  return (
    <div className="ball" style={{ ...ballStyle, ...dynamicStyle }} onClick={onClick} />
  );
};

export default Ball;