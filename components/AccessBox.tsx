import { usePopup } from "@/functions/Access";
import React, { useRef, useState, useEffect } from "react";

const AccessBox = () => {
  const { isVisible, hidePopup, popupPassword } = usePopup();
  const inputRef = useRef<HTMLInputElement>(null); // Reference to the input element
  const [inputValue, setInputValue] = useState(""); // Stores the input value
  const [accessStatus, setAccessStatus] = useState<string | null>(null); // Access status (granted/denied)

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (inputValue === popupPassword) {
          setAccessStatus("ACCESS GRANTED");
          document.addEventListener("keydown", closePopup);
      } else {
          setAccessStatus("ACCESS DENIED");
          document.addEventListener("keydown", closePopup);
      }
      }
      
  };

    const closePopup = () => {
        setInputValue("");
        setAccessStatus(null);
        hidePopup();
        document.removeEventListener("keydown", closePopup);
    }
    
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value); // Update input as the user types
  };

  // ASCII art for the unified border around the content and input
  const asciiBorder = `
  +--------------------------------------+
  |                                      |
  |                                      |
  |                                      |
  |                                      |
  +--------------------------------------+
  `;

  const boxText = (text: string | null) => {
    return <pre style={styles.boxText}>{text || ""}</pre>;
  };

  const inputBox = () => {
    return (
      <input
        ref={inputRef}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        value={inputValue}
        style={styles.inputBox}
        placeholder=""
      />
    );
  };

  return isVisible ? (
    <div tabIndex={-1} style={styles.accessBox}>
      <div>
        <pre style={styles.asciiBorder}>
          {/* ASCII Art Border */}
          {asciiBorder}
        </pre>

        <div style={styles.background}></div>

        {/* Dynamic Content inside the border */}
        {boxText(accessStatus ? accessStatus : "Enter the password")}

        {/* Input box inside the same border */}
        {accessStatus ? null : inputBox()}
      </div>
    </div>
  ) : null;
};

export default AccessBox;

const styles: { [key: string]: React.CSSProperties } = {
  accessBox: {
    display: "flex",
    position: "fixed",
    justifyContent: "center",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "20px",
    color: "#00FF00",
    zIndex: 1000,
    width: "350px",
    textAlign: "center",
  },

  background: {
    display: "flex",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: -1,
    width: "350px",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: "100%",
  },

  asciiBorder: {
    position: "absolute",
    transform: "translate(-50%, -50%)",
    top: "50%",
    left: "50%",
    color: "#00FF00",
    margin: 0,
  },
  boxText: {
    color: "#00FF00",
    fontFamily: "'Courier New', monospace",
    fontSize: "14px",
    textAlign: "center",
    marginBottom: "20px",
  },
  inputBox: {
    width: "150%",
    transform: "translate(-14%, 0)",
    padding: "10px",
    border: "1px solid #00FF00",
    backgroundColor: "rgba(0, 0, 0, 0)",
    color: "#00FF00",
    fontSize: "14px",
    fontFamily: "'Courier New', monospace",
    outline: "none",
    caretColor: "#00FF00",
    boxShadow: "none",
  },
};
