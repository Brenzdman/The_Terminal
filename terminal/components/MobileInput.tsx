import React, { useEffect, useRef } from "react";

const MobileInput: React.FC = () => {
  const invisibleInputRef = useRef<HTMLInputElement>(null);
  const onClick = () => {
    if (invisibleInputRef.current) {
      invisibleInputRef.current.focus();
    }
  };

  useEffect(() => {
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
    };
  });

  return (
    <div>
      <input
        ref={invisibleInputRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0,
          zIndex: -1,
          fontSize: "16px",
          outline: "none",
          border: "none",
          background: "transparent",
          color: "transparent",
          cursor: "default",
        }}
        type="text"
        id="invisibleInput"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
    </div>
  );
};

export default MobileInput;
