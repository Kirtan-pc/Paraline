# Paraline 2.1.0

Paraline 2.1.0 introduces a dedicated welcome and onboarding overlay, settings backup import/export, profile duplication flows, configurable theme automation schedules, Focus Mode tweak controls, and major reliability improvements to the C# audio capture helper.

## Highlights

- **First-Time Welcome & Onboarding Overlay**: An interactive walkthrough guiding new users through microphone setups, window alignments, and tray menu operations.
- **Profile Duplication Flow**: Easily clone custom visualizer profiles in the settings tab to experiment with alternative setups.
- **Settings Backup (Import & Export)**: Full visualizer configuration backup and restoration support with robust JSON schema verification.
- **Configurable Theme Automation**: Custom sunrise and sunset scheduling hour bounds to match daily visual preferences.
- **Self-Healing Audio Stream Capturing**: Dynamic recovery loop in the C# audio helper to handle Windows default output device changes automatically.
- **Focus Mode Customization Tweaks**: Adjust idle timeout durations and custom dim opacity percentages directly in the settings panel.

## What's New

### Core Client Features
- Sleek welcome onboarding sequence popup on first launch (`onboarding.html`).
- IPC handler and UI controls for theme profile duplication.
- Backup settings verification to reject invalid or corrupted backup arrays.
- Extended tweaks tab with custom sliders for Focus Mode dim levels and idle timeouts.

### Audio Helper & Stability
- Dynamic reconnection loop in C# `audio-helper` to automatically capture audio on device switches.
- Restrict audio capture re-spawning during intentional pauses or stops.
- Fixed critical context menu leaks causing app freezes and taskbar ghost windows.
- Stderr logging stdout buffer size capped (`MAX_STDOUT_BUFFER_BYTES`) to prevent memory leaks from flood logs.

### Visualizer Themes & UI
- Side Braids: Upgraded to use realistic 3D horizontal twisting physics with perspective amplitude scaling.
- Ripple Flow: Fixed color rendering bug, restoring full three-color custom gradients.
- Syncing support: Real-time settings dropdown updates when themes are toggled via the system tray menu.

### Landing Page Modernization
- Complete migration of the marketing website from Vite to Next.js.
- Rewrote all 11 visualizer previews in HTML5 Canvas to reflect desktop behaviors.
- Added Theme Comparison Mode to compare themes side-by-side.
- Restored Vercel and Google Analytics with complete click-event tracking.

## Notes

- Installer artifact name: `Paraline-Setup-2.1.0.exe`
- Backward compatibility: Automatically migrates previous config settings to the 2.1.0 schema.

## Thank You

A huge thank you to our users, testers, and contributors! Version 2.1.0 makes Paraline significantly more reliable, customisable, and user-friendly.
