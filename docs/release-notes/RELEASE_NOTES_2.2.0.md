# Paraline 2.2.0

Paraline 2.2.0 introduces the atmospheric new Crimson Dusk visualizer theme (with full-width bottom bar layouts, side placement support, and film grain details), live theme overlays on the landing website, multi-monitor window management, global keyboard shortcuts, a robust settings corruption recovery framework, client auto-updates, and comprehensive backend store unit testing.

## Highlights

- **New Theme - Crimson Dusk**: Warm ember and crimson glow effects inspired by desert sunsets. Highly customizable with bottom, compact, side, or combined bar layouts, drifting ember particles, and optional film grain textures.
- **Website Live Theme Previews**: Dynamic live visualizer previews implemented directly on the Next.js landing website, allowing users to apply and test visualizers full-screen on the web.
- **Multi-Monitor Overlay Manager**: Robust screen coordination to spawn and stretch visualizer windows across all connected display monitors.
- **Global Keyboard Shortcuts**: Register customizable global system hotkeys for theme cycling, overlay visibility toggles, and performance presets.
- **Settings Self-Healing**: Automated backup and repair protocols that detect, backup, and notify the user of corrupted configuration files.
- **Auto-Updater Integration**: Client auto-update mechanisms in Electron to streamline distributing new desktop releases.

## What's New

### Core Client & Themes
- New theme **Crimson Dusk** with dual-placement options, adjustable film grain overlays, and custom slider support (thickness, gap, sensitivity).
- System-wide **Global Keyboard Shortcuts** configuration panel in Settings UI, with built-in hotkey collision validation and error tracking.
- Multi-monitor spawning engine (`multi-monitor overlay manager`) to map and load overlays across multi-display layouts.
- Electron auto-updater integration for seamless background app updates.
- Refreshed tray context menu displaying "Crimson Dusk" toggle choices and settings submenus.

### Robustness & Safety
- **Settings Self-Healing**: Detects settings corruption, backs up corrupted files, and logs/notifies the user on startup.
- **Audio Bridge stdout Overflow Protection**: Automatically monitors and updates process status when stdout streams exceed bounds.
- Guarded slider labels and selectors in Settings UI against null element reference crashes.
- Improved security by adding `rel="noopener noreferrer"` attributes and warning overlays to external links.

### Landing Page & Gallery
- **Live Overlay Previews**: Full Zustand integration and canvas-based theme rendering directly on the Next.js landing website.
- Created `CrimsonDuskPreview` React component supporting prefers-reduced-motion flags and smooth browser-simulated beats.
- Added Crimson Dusk cards to the onboarding welcome grid.
- Accessibility audit fixes: Added missing aria-labels and outline focus rings to landing interactive controls.

### Developer Experience & Quality Assurance
- Added full Node unit testing framework (`node --test`) for `settingsStore.js` sanitation bounds and automation migration logic.
- Added test suites for stdout process handlers.

## Notes

- Installer artifact name: `Paraline-Setup-2.2.0.exe`
- Backward compatibility: Automatically migrates settings schemas and custom preset configurations.

## Thank You

A huge thank you to all the open-source contributors and developers who worked on this release under GSSoC'26! Version 2.2.0 significantly elevates the customization and reliability of Paraline.
