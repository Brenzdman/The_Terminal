"use client";
import React from "react";

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
  const handleClick = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <button style={ButtonStyle} onClick={handleClick}>
      ⛶
    </button>
  );
};

export default FullscreenButton;
