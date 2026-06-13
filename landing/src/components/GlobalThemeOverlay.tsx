"use client";

import { useEffect } from "react";
import { usePreviewStore } from "@/store/preview";
import { useSidebarStore } from "@/store/sidebar";
import { specificThemes } from "./ThemeShowcase";
import { motion, AnimatePresence } from "framer-motion";
import { EyeOff } from "lucide-react";

export function GlobalThemeOverlay() {
  const activePreviewThemeId = usePreviewStore((state) => state.activePreviewThemeId);
  const setActivePreviewThemeId = usePreviewStore((state) => state.setActivePreviewThemeId);
  const setIsSidebarOpen = useSidebarStore((state) => state.setIsOpen);

  const theme = specificThemes.find((t) => t.id === activePreviewThemeId);

  useEffect(() => {
    if (activePreviewThemeId) {
      setIsSidebarOpen(false);
    } else {
      if (typeof window !== "undefined" && window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      }
    }
  }, [activePreviewThemeId, setIsSidebarOpen]);

  return (
    <>
      {/* Edge visualizer overlay */}
      {theme && (
        <div className="fixed inset-0 z-[40] w-full h-full pointer-events-none">
          <theme.Preview
            active={true}
            transparent={true}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 bg-transparent pointer-events-none"
          />
        </div>
      )}

      {/* Floating control badge */}
      <AnimatePresence>
        {theme && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-6 right-6 z-[99] flex items-center gap-4 rounded-2xl border border-cyan-500/30 bg-[#0a0d16]/90 px-4 py-3 shadow-[0_15px_40px_rgba(34,211,238,0.25)] backdrop-blur-xl pointer-events-auto"
          >
            <div className="flex items-center gap-2">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </div>
              <span className="text-xs font-semibold text-white/90">
                Previewing <span className="text-cyan-400 font-bold">{theme.name}</span>
              </span>
            </div>
            <div className="h-4 w-[1px] bg-white/10" />
            <button
              onClick={() => setActivePreviewThemeId(null)}
              className="flex items-center gap-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 px-3 py-1.5 text-xs font-bold text-red-400 transition-all duration-300"
            >
              <EyeOff className="h-3.5 w-3.5" />
              Turn Off
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
