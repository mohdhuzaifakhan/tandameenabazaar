import { useEffect, useState } from 'react';
import { ShoppingBag, Sparkles, Store } from 'lucide-react';

export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [subtextIndex, setSubtextIndex] = useState(0);

  const loadingSubtexts = [
    'Connecting local city shops...',
    'Loading verified storefronts & products...',
    'Preparing your digital bazaar experience...'
  ];

  useEffect(() => {
    // Progress bar animation timer
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 4;
      });
    }, 45);

    // Text rotation timer
    const textInterval = setInterval(() => {
      setSubtextIndex((prev) => (prev + 1) % loadingSubtexts.length);
    }, 600);

    // Trigger fade out after progress reaches ~100%
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 600);
    }, 1800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
      clearTimeout(fadeTimer);
    };
  }, [onFinish, loadingSubtexts.length]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-gradient-to-br from-[#011c14] via-[#056839] to-[#022c22] flex flex-col items-center justify-between p-6 select-none transition-opacity duration-600 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Subtle Brand Tag */}
      <div className="pt-8 flex items-center gap-2 text-emerald-200/80 text-[11px] font-black tracking-widest uppercase">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span>Rampur's Digital Marketplace</span>
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
      </div>

      {/* Main Center Animated Logo & Branding */}
      <div className="flex flex-col items-center text-center space-y-5 my-auto max-w-sm px-4">
        {/* Shopping Bag Circular Badge with Glow Rings */}
        <div className="relative group">
          <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-emerald-400 to-amber-300 opacity-40 blur-lg animate-pulse" />

          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/10 backdrop-blur-xl border-2 border-white/30 flex items-center justify-center shadow-2xl shadow-emerald-950/60">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#056839] to-emerald-400 flex items-center justify-center border border-white/20 text-white shadow-inner">
              <ShoppingBag className="w-9 h-9 sm:w-10 sm:h-10 text-white drop-shadow-md stroke-[2.2]" />
            </div>
          </div>

          {/* Floating Store Badge */}
          <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-400 text-slate-900 border-2 border-[#056839] flex items-center justify-center shadow-lg">
            <Store className="w-4 h-4 text-slate-900 stroke-[2.5]" />
          </span>
        </div>

        {/* Text Welcome Heading */}
        <div className="space-y-1.5 pt-2">
          <span className="text-xs sm:text-sm font-black tracking-widest text-amber-300 uppercase block">
            Welcome To
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-lg font-sans">
            Meena Bazaar
          </h1>
          <p className="text-xs sm:text-sm font-medium text-emerald-100/90 leading-relaxed max-w-xs mx-auto">
            Discover local shops, explore products &amp; connect directly via WhatsApp
          </p>
        </div>

        {/* Animated Progress Loader Bar */}
        <div className="w-56 sm:w-64 space-y-2.5 pt-4">
          <div className="w-full h-2 bg-emerald-950/70 rounded-full overflow-hidden border border-white/20 p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-300 rounded-full transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Rotating Subtext Status */}
          <p className="text-[11px] font-bold text-emerald-200/90 h-4 transition-all duration-300 animate-pulse">
            {loadingSubtexts[subtextIndex]}
          </p>
        </div>
      </div>

      {/* Bottom Footer Tag */}
      <div className="pb-4 text-center">
        <span className="text-[10px] font-semibold text-emerald-200/60 block">
          Powered by Digital Meena Bazaar PWA
        </span>
      </div>
    </div>
  );
}
