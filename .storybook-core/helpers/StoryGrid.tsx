import React from "react";

export const StoryGrid: React.FC<{
  title?: string;
  children: React.ReactNode;
  columns?: number;
}> = ({ title, children, columns = 3 }) => {
  const minColumnWidth = columns > 3 ? "10rem" : "12rem";

  return (
    <div style={{ marginBottom: "2rem" }}>
      {title && <h3 style={{ marginBottom: "1rem" }}>{title}</h3>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${minColumnWidth}), 1fr))`,
          gap: "1rem",
        }}
      >
        {children}
      </div>
    </div>
  );
};
