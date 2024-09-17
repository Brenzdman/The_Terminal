import { createContext, useState, useContext, SetStateAction } from "react";
import { ReactNode } from "react";

// Create a Context
let AccessContext = createContext<{
  isVisible: boolean;
  popupPassword: string | null | Promise<any>;
  showPopup: (password: string | Promise<any>, onComplete: () => void) => void;
  hidePopup: () => void;
  onComplete: () => void;
}>({
  isVisible: false,
  popupPassword: null,
  showPopup: () => {},
  hidePopup: () => {},
  onComplete: () => {},
});

// Export the hook for using the context in other components
export const usePopup = () => useContext(AccessContext);

export const AccessProvider = ({ children }: { children: ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [password, setPassword] = useState<string | null | Promise<any>>(null);
  const [onComplete, setOnComplete] = useState<SetStateAction<any>>(() => {});

  // Function to show the popup
  const showPopup = (
    password: string | Promise<any>,
    onComplete: () => void
  ) => {
    setPassword(password);
    setIsVisible(true);
    setOnComplete(() => onComplete);
  };

  // Function to hide the popup
  const hidePopup = () => setIsVisible(false);

  AccessContext = createContext({
    isVisible,
    popupPassword: password,
    showPopup,
    hidePopup,
    onComplete,
  });

  return (
    <AccessContext.Provider
      value={{
        isVisible,
        popupPassword: password,
        showPopup,
        hidePopup,
        onComplete,
      }}
    >
      {children}
    </AccessContext.Provider>
  );
};
