"use client";
import React from "react";

const ButtonStyle: React.CSSProperties = {
  position: "fixed",
  top: "10px",
  right: "20px",
  justifyContent: "right",
  zIndex: 1000,
};

const FullscreenButton: React.FC = () => {
  const handleClick = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <button style={ButtonStyle} onClick={handleClick}>
      ⛶
    </button>
  );
};

export default FullscreenButton;
