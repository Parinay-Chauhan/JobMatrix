import React from "react";

export const PageLoader: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 animate-in fade-in duration-300">
      <div className="relative flex items-center justify-center">
        {/* Outer Glow Pulse */}
        <div className="absolute h-16 w-16 rounded-2xl bg-indigo-500/20 animate-ping" />
        
        {/* Modern Spinning Ring */}
        <div className="h-14 w-14 rounded-2xl border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
        
        {/* Center Logo Letter */}
        <div className="absolute text-indigo-600 font-black text-sm tracking-tighter select-none">
          JP
        </div>
      </div>

      <div className="mt-6 text-center space-y-1">
        <h3 className="text-sm font-bold text-gray-800 tracking-tight">
          Loading Page...
        </h3>
        <p className="text-xs text-gray-400">
          Preparing your workspace and resources
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
