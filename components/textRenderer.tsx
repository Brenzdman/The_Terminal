import React from "react";
import { useAtom } from "jotai";
import { textDisplayAtom } from "../constants"; // Adjust the import path as needed

const TextDisplayRenderer = () => {
  const [textDisplay] = useAtom(textDisplayAtom);

  return <div>{textDisplay.renderText()}</div>;
};

export default TextDisplayRenderer;
