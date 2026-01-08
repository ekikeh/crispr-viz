import React from 'react';

interface TooltipProps {
  visible: boolean;
  x: number;
  y: number;
  content: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ visible, x, y, content }) => {
  if (!visible) return null;

  return (
    <div
      className="absolute z-50 pointer-events-none bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded shadow-xl p-3 max-w-[250px]"
      style={{
        left: x + 15,
        top: y + 15,
        transition: 'opacity 0.1s ease-in-out',
      }}
    >
      {content}
    </div>
  );
};