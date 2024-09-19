"use client";
import React, { useRef } from "react";

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
  const buttonRef = useRef<HTMLButtonElement>(null);

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

    if (buttonRef.current) {
      buttonRef.current.blur();
    }
  };

  return (
    <button ref={buttonRef} style={ButtonStyle} onClick={handleClick}>
      ⛶
    </button>
  );
};

export default FullscreenButton;
