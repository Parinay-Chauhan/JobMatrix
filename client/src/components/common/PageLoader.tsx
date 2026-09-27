import React from "react";

export const PageLoader: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 px-4 relative overflow-hidden select-none">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Main Loader Core */}
      <div className="relative flex flex-col items-center z-10">
        {/* Glowing Spinner Ring */}
        <div className="relative w-16 h-16 flex items-center justify-center mb-6">
          {/* Pulsing Backlight */}
          <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-md animate-pulse" />
          
          {/* Rotating Gradient Spinner */}
          <div className="w-14 h-14 rounded-2xl border-2 border-slate-800 border-t-emerald-400 border-r-teal-400 animate-spin" />
          
          {/* Inner Glowing Center */}
          <div className="absolute w-3 h-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/80 animate-ping" />
        </div>

        {/* Brand Name */}
        <div className="text-2xl font-black tracking-tight text-white mb-2">
          Job<span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Matrix</span>
        </div>

        {/* Animated Loading Bar */}
        <div className="w-36 h-1 bg-slate-800/80 rounded-full overflow-hidden relative my-3">
          <div className="h-full w-1/2 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full animate-marquee" />
        </div>

        {/* Subtitle */}
        <p className="text-xs font-medium text-slate-400 tracking-wide">
          Loading workspace & opportunities...
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
