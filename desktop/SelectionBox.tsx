import { atom, useAtom } from "jotai";
import React, { useState, useRef, useEffect } from "react";

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

export const selectionAtom = atom<Box | null>(null);

const SelectionBox: React.FC = () => {
  const [selection, setSelection] = useState<Box | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const startCoords = useRef<{ x: number; y: number } | null>(null);
  const [selectedArea, setSelectedArea] = useAtom(selectionAtom);
  const mouseDown = useRef(false);

  const handleMouseDown = (e: MouseEvent) => {
    mouseDown.current = true;

    e.preventDefault();
    const containerRect = containerRef.current?.getBoundingClientRect();

    if (containerRect) {
      startCoords.current = {
        x: e.clientX - containerRect.left,
        y: e.clientY - containerRect.top,
      };

      const newSelection = {
        left: startCoords.current.x,
        top: startCoords.current.y,
        width: 0,
        height: 0,
      };

      setSelection(newSelection);
      setSelectedArea(newSelection);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!mouseDown.current) return;

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!startCoords.current || !containerRect) return;

    const currentX = e.clientX - containerRect.left;
    const currentY = e.clientY - containerRect.top;

    const newSelection = {
      left: Math.min(currentX, startCoords.current.x),
      top: Math.min(currentY, startCoords.current.y),
      width: Math.abs(currentX - startCoords.current.x),
      height: Math.abs(currentY - startCoords.current.y),
    };

    setSelection(newSelection);
    setSelectedArea(newSelection);
  };

  const handleMouseUp = () => {
    mouseDown.current = false;
    startCoords.current = null;
    setSelection(null);
  };

  useEffect(() => {
    window.addEventListener("mousedown", (e) =>
      handleMouseDown(e as MouseEvent)
    );
    window.addEventListener("mousemove", (e) =>
      handleMouseMove(e as MouseEvent)
    );
    window.addEventListener("mouseup", () => handleMouseUp());
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {selection && (
        <div
          style={{
            position: "absolute",
            left: selection.left,
            top: selection.top,
            width: selection.width,
            height: selection.height,
            backgroundColor: "rgba(0, 120, 215, 0.3)",
            border: "1px solid #0078d7",
            boxSizing: "border-box",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};

export default SelectionBox;
