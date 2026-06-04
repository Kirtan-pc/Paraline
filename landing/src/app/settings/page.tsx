"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Monitor, Volume2 } from "lucide-react";

const initialGroups = [
  {
    title: "Display & Performance",
    icon: Monitor,
    settings: [
      { id: "focus-mode", name: "Focus Mode Integration", description: "Reduce visualizer opacity and intensity when your system goes idle.", active: false },
      { id: "launch-startup", name: "Start with Windows", description: "Automatically launch Paraline when your computer boots up.", active: true },
    ]
  },
  {
    title: "Theme & Capture Behavior",
    icon: Volume2,
    settings: [
      { id: "theme-automation", name: "Theme Automation", description: "Automatically transition themes between day and night modes.", active: true },
      { id: "smoothing", name: "Frequency Smoothing", description: "Apply an audio low-pass filter to soften jagged frequency response spikes.", active: true },
    ]
  }
];

export default function SettingsPage() {
  const [groups, setGroups] = useState(initialGroups);

  const toggleSetting = (groupIdx: number, settingIdx: number) => {
    setGroups((prev) =>
      prev.map((g, gi) =>
        gi === groupIdx
          ? {
              ...g,
              settings: g.settings.map((s, si) =>
                si === settingIdx ? { ...s, active: !s.active } : s
              ),
            }
          : g
      )
    );
  };

  return (
    <main className="flex min-h-screen flex-col pt-32 pb-24 bg-[#060913] relative overflow-hidden z-0">
      {/* Immersive background glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#060913] to-[#060913] -z-10" />
      <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen -z-10" />
      
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-4">
        <motion.div 
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-20 text-center md:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/[0.05] border border-cyan-500/10 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400/80">Configuration</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 mb-4 tracking-tighter drop-shadow-lg">
            Client Settings Preview
          </h1>
          <p className="text-lg font-light tracking-wide text-white/50 max-w-2xl">
            This is an interactive Live Preview of the settings panel available inside the Paraline desktop client. Explore the configuration preferences you can customize on your desktop.
          </p>
        </motion.div>

        <div className="space-y-16">
          {groups.map((group, groupIdx) => (
            <motion.div 
              key={group.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (groupIdx + 1), duration: 0.8, type: "spring", bounce: 0.2 }}
              className="flex flex-col gap-8 md:flex-row md:gap-16"
            >
              {/* Group Header (Left Side) */}
              <div className="w-full md:w-64 shrink-0">
                <div className="flex items-center gap-4 text-white">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/[0.03] shadow-inner group-hover:bg-white/[0.05] transition-colors">
                    <group.icon className="h-5 w-5 text-white/70" strokeWidth={1.5} />
                  </div>
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white/90">{group.title}</h2>
                </div>
              </div>

              {/* Settings List (Right Side) */}
              <div className="flex-1 space-y-4">
                {group.settings.map((setting, settingIdx) => (
                  <div 
                    key={setting.id} 
                    className="group relative flex items-center justify-between rounded-[24px] border border-white/5 bg-white/[0.02] backdrop-blur-xl p-6 transition-all duration-500 hover:bg-white/[0.04] hover:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_5px_15px_rgba(0,0,0,0.2)]"
                  >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[24px]" />
                    
                    <div className="pr-8 relative z-10">
                      <h3 className="text-[15px] font-semibold text-white/90 group-hover:text-white transition-colors">{setting.name}</h3>
                      <p className="mt-2 text-[13px] font-light text-white/50 leading-relaxed">{setting.description}</p>
                    </div>
                    
                    {/* Premium Interactive Toggle */}
                    <button 
                      onClick={() => toggleSetting(groupIdx, settingIdx)}
                      aria-pressed={setting.active}
                      className={`relative z-10 inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20 overflow-hidden active:scale-95 ${
                        setting.active 
                          ? 'bg-cyan-500/20 border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.3)]' 
                          : 'bg-white/[0.05] border-white/10 hover:bg-white/[0.08]'
                      }`}
                    >
                      <span 
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          setting.active ? 'translate-x-[22px] shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'translate-x-1 opacity-40'
                        }`} 
                      />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
