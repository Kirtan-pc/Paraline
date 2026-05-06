import { motion } from "framer-motion";
import HeroSection from "./components/sections/HeroSection";
import ExperienceSection from "./components/sections/ExperienceSection";
import ThemeShowcaseSection from "./components/sections/ThemeShowcaseSection";
import CTASection from "./components/sections/CTASection";

const downloadUrl = "/downloads/Paraline-Setup.exe";

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-midnight text-white">
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.06),transparent_24%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.08),transparent_28%)]" />

      <div className="relative z-10">
        <main>
        </main>
      </div>
    </div>
  );
}
