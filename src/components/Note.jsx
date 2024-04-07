import { forwardRef } from "react";

const Note = forwardRef(({ initialPosition, content, ...props }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        userSelect: "none",
        position: "absolute",
        left: `${initialPosition?.x}px`,
        top: `${initialPosition?.y}px`,
        border: "1px solid black",
        padding: "1rem",
        width: "200px",
        cursor: "move",
        backgroundColor: "lightyellow",
      }}
      {...props}
    >
      {content}
    </div>
  );
});

export default Note;
