import React from "react";

export const HomeFooter: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
      &copy; {new Date().getFullYear()} JobMatrix. All rights reserved.
    </footer>
  );
};
