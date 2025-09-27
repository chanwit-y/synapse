import { useRef, useState } from "react";
import type { NodeMenuItem, PixelValue } from "../../@type";
import { Equal } from "lucide-react";
import { Colors } from "../../util/constant";

type Props = {
  children: React.ReactNode;
  width?: PixelValue;
  maxWidth?: PixelValue; //for non-resizable card only
  title?: string;
  menuFeatureIcon?: NodeMenuItem[];
  resizable?: boolean;
  minWidth?: number;
  minHeight?: number;
};

export const Card = ({
  children,
  width,
  maxWidth,
  title,
  menuFeatureIcon = [],
  resizable = false,
  minWidth = 300,
  minHeight = 400,
}: Props) => {
  const [cardSize, setCardSize] = useState({
    width: width ? parseInt(width) : minWidth,
    height: minHeight,
  });
  const [isResizing, setIsResizing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!resizable) return;

    // stop the default action of web browser (like selecting text)
    e.preventDefault();
    // set the resizing started
    setIsResizing(true);

    startPos.current = { x: e.clientX, y: e.clientY }; //Saves the initial mouse coordinates when the drag begins.
    startSize.current = {
      width: cardSize.width,
      height: cardSize.height,
    }; //Records the width and height of the card at the moment dragging starts.

    const handleMouseMove = (e: MouseEvent) => {
      // deltaX, deltaY = how far the mouse moved horizontally and vertically.
      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;

      // Calculates newWidth/newHeight by adding the movement to the starting size, but never smaller than the minimums (Math.max)
      const newWidth = Math.max(minWidth, startSize.current.width + deltaX);
      const newHeight = Math.max(minHeight, startSize.current.height + deltaY);

      setCardSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      // stop the resizing
      setIsResizing(false);
      // Removes the event listeners to avoid memory leaks and stop tracking movement.
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    // Listens on document, not just the card, so the drag keeps working even if the mouse moves outside the card.
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={cardRef}
      className={`bg-white shadow-md rounded-md border border-gray-200 relative ${
        isResizing ? "select-none" : ""
      }`}
      style={{
        width: resizable ? `${cardSize.width}px` : width ? width : "auto",
        maxWidth: !resizable ? (maxWidth ? maxWidth : "fit-content") : "none",
        height: resizable ? `${cardSize.height}px` : "auto",
        minWidth: `${minWidth}px`,
        minHeight: resizable ? `${minHeight}px` : "auto",
      }}
    >
      <div className="p-3 flex justify-between items-center">
        {title && <p className="text-sm font-semibold">{title}</p>}
        <div className="flex space-x-2">
          {menuFeatureIcon.length > 0 &&
            menuFeatureIcon.map((item, index) => (
              <button
                key={index}
                className="bg-transparent p-1 rounded-sm hover:bg-gray-200 "
                style={{
                  backgroundColor: item.bgColor,
                  color: item.color,
                }}
                onClick={() => {
                  item.action();
                }}
              >
                <span className="w-1 h-1 [&>svg]:w-full [&>svg]:h-full">
                  {item.icon}
                </span>
              </button>
            ))}
        </div>
      </div>
      <hr style={{ borderColor: Colors.lightgrey, borderWidth: "0.5px" }} />
      <div
        className="p-4 overflow-auto"
        style={{
          height: resizable ? `calc(100% - 60px)` : "auto",
        }}
      >
        {children}
      </div>
      {/* Resize Handle */}
      {resizable && (
        <div
          className={`absolute bottom-0 right-0 w-5 h-5 p-0 cursor-se-resize flex items-center justify-center ${
            isResizing ? "text-blue-500" : "text-gray-400 hover:text-gray-600"
          } transition-colors`}
          onMouseDown={handleMouseDown}
        >
          <Equal size={16} style={{ rotate: "-45deg"}} />
        </div>
      )}
    </div>
  );
};
