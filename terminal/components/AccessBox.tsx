import { usePopup } from "@/terminal/components/AccessProvider";
import React, { useRef, useState, useEffect } from "react";
import { getColor } from "@/terminal/functions/color";

const AccessBox = () => {
  const { isVisible, hidePopup, popupPassword, onComplete } = usePopup();
  const inputRef = useRef<HTMLInputElement>(null); // Reference to the input element
  const [inputValue, setInputValue] = useState(""); // Stores the input value
  const [trueInputValue, setTrueInputValue] = useState(""); // Stores the true input value
  const [accessStatus, setAccessStatus] = useState<string | null>(null); // Access status (granted/denied)
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null); // Stores the timeout ID

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const checkPassword = async (popupPassword: string | null) => {
        const res = await fetch("/api/check-secret", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: "ASCII",
            passcode: trueInputValue,
          }),
        });

        console.log(popupPassword, trueInputValue);

        const data = await res.json();

        if (data.success) {
          setAccessStatus("ACCESS GRANTED");
          document.addEventListener("keydown", closePopup);

          onComplete();
        } else {
          setAccessStatus("ACCESS DENIED");
          document.addEventListener("keydown", closePopup);
        }
      };

      checkPassword(popupPassword);
    }
  };

  const closePopup = () => {
    setInputValue("");
    setTrueInputValue("");
    setAccessStatus(null);
    hidePopup();
    document.removeEventListener("keydown", closePopup);
    document.removeEventListener("contextmenu", handleRightClick);
    document.removeEventListener("paste", handlePaste);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const lastChar = newValue.slice(-1);

    setInputValue(newValue); // Update input as the user types

    // if new character is entered, append it to the true input value
    if (newValue.length > trueInputValue.length) {
      setTrueInputValue(trueInputValue + lastChar);
    } else {
      // if a character is deleted, remove the last character from the true input value
      setTrueInputValue(trueInputValue.slice(0, -1));
    }

    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }

    // Set a new timeout to hide the last character after 500ms
    const newHideTimeout = setTimeout(() => {
      setInputValue((prevValue) => prevValue.replace(/./g, "*"));
      setHideTimeout(null);
    }, 500);

    setHideTimeout(newHideTimeout);
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

  const handleRightClick = (event: MouseEvent) => {
    event.preventDefault();

    const pasteText = navigator.clipboard.readText();
    pasteText.then((text) => {
      setInputValue(text);
      setTrueInputValue(text);
    });
  };

  const handlePaste = (event: ClipboardEvent) => {
    event.preventDefault();
  };

  const inputBox = () => {
    // Show all but last character as asterisks
    const hiddenValue =
      inputValue.length > 1
        ? inputValue.slice(0, -1).replace(/./g, "*") + inputValue.slice(-1)
        : inputValue;

    document.addEventListener("contextmenu", handleRightClick);
    document.addEventListener("paste", handlePaste);
    const handleMouseDown = (event: React.MouseEvent<HTMLInputElement>) => {
      // Focus the input on mouse click
      if (inputRef.current) {
        inputRef.current.focus();
      }
      event.preventDefault(); // Prevent selecting the text via mouse
    };

    return (
      <input
        ref={inputRef}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        value={hiddenValue}
        style={styles.inputBox}
        placeholder=""
        onMouseDown={handleMouseDown}
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
        {boxText(accessStatus ? accessStatus : "ENTER PASSWORD")}

        {/* Input box inside the same border */}
        {accessStatus ? null : inputBox()}
      </div>
    </div>
  ) : null;
};

export default AccessBox;

const color = getColor("input");

const styles: { [key: string]: React.CSSProperties } = {
  accessBox: {
    userSelect: "none",
    display: "flex",
    position: "fixed",
    justifyContent: "center",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "20px",
    color: color,
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
    height: "120px",
  },

  asciiBorder: {
    position: "absolute",
    transform: "translate(-50%, -50%)",
    top: "50%",
    left: "50%",
    color: color,
    margin: 0,
    fontWeight: "bold",
  },
  boxText: {
    color: color,
    fontFamily: "'Courier New', monospace",
    fontSize: "18px",
    textAlign: "center",
    marginBottom: "20px",
  },
  inputBox: {
    width: "150%",
    transform: "translate(-15.5%, 0)",
    padding: "10px",
    border: "1px solid " + color,
    backgroundColor: "rgba(0, 0, 0, 0)",
    color: color,
    fontSize: "14px",
    fontFamily: "'Courier New', monospace",
    outline: "none",
    caretColor: color,
    boxShadow: "none",
  },
};
