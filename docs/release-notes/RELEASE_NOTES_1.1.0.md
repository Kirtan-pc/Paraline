# Paraline 1.1.0

Paraline 1.1.0 is a support and polish update focused on improving the overall experience around the app.

This release introduces the new Paraline landing page, improves tray-based controls, and adds a few quality-of-life upgrades that make the app feel more stable.

## Highlights

- New Paraline landing page for presentation and downloads
- Improved system tray experience with clearer status and quick actions
- Better fallback behavior when the audio helper is unavailable or stops
- New reset actions for theme settings and full app settings
- Improved handling for duplicate launches and overlay recovery

## What's New

### Tray and App Controls

- Added app version display in the tray menu
- Added audio capture status in the tray menu
- Added reset action for the currently selected theme
- Added reset action for all saved settings
- Added quick links to the landing page and GitHub repository

### Stability and Support

- Improved recovery when the audio helper exits or errors
- Simulated fallback now resumes automatically when helper capture is unavailable
- Added single-instance protection to avoid multiple app instances running accidentally
- Improved overlay recovery when display metrics change or the app is launched again

### Public Presence

- Launched the new Paraline landing page
- Improved download flow and project visibility around releases

## Notes

- Windows installer artifact name for this release will be `Paraline-Setup-1.1.0.exe`
- Existing settings are preserved and sanitized as before

## Thank You

Thanks to everyone checking out Paraline. This update is a small but important step toward making the app feel more polished, dependable, and actively supported.
