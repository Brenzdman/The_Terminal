"use client";
import React, { useEffect } from "react";

const ButtonStyle: React.CSSProperties = {
  position: "fixed",
  top: "10px",
  right: "20px",
  justifyContent: "right",
  zIndex: 1000,
  userSelect: "none",
  cursor: "pointer",
};

const FullscreenButton: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  useEffect(() => {
    if (document.fullscreenElement) {
      setIsFullscreen(true);
    } else {
      setIsFullscreen(false);
    }
  }, []);

  const handleClick = () => {
    if (document.documentElement.requestFullscreen && !isFullscreen) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <button style={ButtonStyle} onClick={handleClick}>
      ⛶
    </button>
  );
};

export default FullscreenButton;
