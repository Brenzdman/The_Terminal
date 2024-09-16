import { createContext, useState, useContext, SetStateAction } from "react";
import { ReactNode } from "react";

// Create a Context
let AccessContext = createContext<{
  isVisible: boolean;
  popupPassword: string | null;
  showPopup: (password: string) => void;
  hidePopup: () => void;
}>({
  isVisible: false,
  popupPassword: null,
  showPopup: () => {},
  hidePopup: () => {},
});

// Export the hook for using the context in other components
export const usePopup = () => useContext(AccessContext);

export const AccessProvider = ({ children }: { children: ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [password, setPassword] = useState<string | null>(null);

  // Function to show the popup
  const showPopup = (password: string) => {
    console.log(password);
    setPassword(password);
    setIsVisible(true);
  };

  // Function to hide the popup
  const hidePopup = () => setIsVisible(false);

  AccessContext = createContext({
    isVisible,
    popupPassword: password,
    showPopup,
    hidePopup,
  });

  return (
    <AccessContext.Provider
      value={{ isVisible, popupPassword: password, showPopup, hidePopup }}
    >
      {children}
    </AccessContext.Provider>
  );
};
