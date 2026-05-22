import os
import subprocess

def run_cmd(cmd):
    print("Running:", cmd)
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error running {cmd}: {result.stderr}")
    return result.stdout

# Reset main branch to origin/main (which we previously fetched, so we'll just reset hard to the commit before ours)
# Wait, our commit is HEAD. The previous commit is HEAD~1.
run_cmd("git checkout main")
# Reset main branch to 288559f
run_cmd("git checkout main")
run_cmd("git reset --hard 288559f")

# Auto-Start Branch
run_cmd("git checkout -b feat-auto-start")

# Patch settingsStore.js for Auto-Start
with open("settingsStore.js", "r") as f:
    settings = f.read()
settings = settings.replace('const DEFAULT_SETTINGS = Object.freeze({\n  selectedTheme: "ambientWave",', 'const DEFAULT_SETTINGS = Object.freeze({\n  launchOnStartup: false,\n  selectedTheme: "ambientWave",')
settings = settings.replace('function createDefaultSettings() {\n  return {\n    selectedTheme: DEFAULT_SETTINGS.selectedTheme,', 'function createDefaultSettings() {\n  return {\n    launchOnStartup: DEFAULT_SETTINGS.launchOnStartup,\n    selectedTheme: DEFAULT_SETTINGS.selectedTheme,')
settings = settings.replace('function sanitizeSettings(input = {}) {\n  const source = migrateLegacySettings(input);\n\n  return {\n    selectedTheme: pick(source.selectedTheme, VALID_MAIN_THEMES, DEFAULT_SETTINGS.selectedTheme),', 'function sanitizeSettings(input = {}) {\n  const source = migrateLegacySettings(input);\n\n  return {\n    launchOnStartup: typeof source.launchOnStartup === "boolean" ? source.launchOnStartup : DEFAULT_SETTINGS.launchOnStartup,\n    selectedTheme: pick(source.selectedTheme, VALID_MAIN_THEMES, DEFAULT_SETTINGS.selectedTheme),')
with open("settingsStore.js", "w") as f:
    f.write(settings)

# Patch main.js for Auto-Start
with open("main.js", "r") as f:
    main_js = f.read()
startup_func = """
function applyStartupSettings(launchOnStartup) {
  app.setLoginItemSettings({
    openAtLogin: launchOnStartup,
    path: process.execPath,
    args: app.isPackaged ? [] : [app.getAppPath()]
  });
}
const PROJECT_URL"""
main_js = main_js.replace("const PROJECT_URL", startup_func)

update_old = """function updateSettings(nextSettings) {
  visualizerSettings = settingsStore.save(mergeSettingsPatch(visualizerSettings, nextSettings));

  sendVisualizerSettings();
  refreshTrayMenu();
}"""
update_new = """function updateSettings(nextSettings) {
  visualizerSettings = settingsStore.save(mergeSettingsPatch(visualizerSettings, nextSettings));

  if (nextSettings.launchOnStartup !== undefined) {
    applyStartupSettings(visualizerSettings.launchOnStartup);
  }

  sendVisualizerSettings();
  refreshTrayMenu();
}"""
main_js = main_js.replace(update_old, update_new)

tray_old = """    {
      label: "Visualizer Mode","""
tray_new = """    {
      label: "Launch on Startup",
      type: "checkbox",
      checked: !!visualizerSettings.launchOnStartup,
      click: () => updateSettings({ launchOnStartup: !visualizerSettings.launchOnStartup })
    },
    { type: "separator" },
    {
      label: "Visualizer Mode","""
main_js = main_js.replace(tray_old, tray_new)

ready_old = """  visualizerSettings = settingsStore.save(settingsStore.load());

  ipcMain.handle("audio-bridge-status", () => {"""
ready_new = """  visualizerSettings = settingsStore.save(settingsStore.load());
  applyStartupSettings(visualizerSettings.launchOnStartup);

  ipcMain.handle("audio-bridge-status", () => {"""
main_js = main_js.replace(ready_old, ready_new)

with open("main.js", "w") as f:
    f.write(main_js)

# Commit and Push Auto-Start
run_cmd('git add .')
run_cmd('git commit -m "Feat: Auto Start Paraline on Windows Login via Tray Toggle (#14)"')
run_cmd('git push -f origin feat-auto-start')
# Create PR
run_cmd('gh pr create --repo SamXop123/Paraline --title "Feat: Auto Start Paraline on Windows Login via Tray Toggle (#14)" --body "Fixes #14" --head Aditya948351:feat-auto-start')


# Multi-Monitor Branch
run_cmd("git checkout main")
run_cmd("git checkout -b feat-multi-monitor")

# Patch settingsStore.js for Multi-Monitor
with open("settingsStore.js", "r") as f:
    settings = f.read()
settings = settings.replace('const DEFAULT_SETTINGS = Object.freeze({\n  selectedTheme: "ambientWave",', 'const DEFAULT_SETTINGS = Object.freeze({\n  monitors: Object.freeze({}),\n  selectedTheme: "ambientWave",')
settings = settings.replace('function createDefaultSettings() {\n  return {\n    selectedTheme: DEFAULT_SETTINGS.selectedTheme,', 'function createDefaultSettings() {\n  return {\n    monitors: { ...DEFAULT_SETTINGS.monitors },\n    selectedTheme: DEFAULT_SETTINGS.selectedTheme,')
san_old = """function sanitizeSettings(input = {}) {
  const source = migrateLegacySettings(input);

  return {
    selectedTheme: pick(source.selectedTheme, VALID_MAIN_THEMES, DEFAULT_SETTINGS.selectedTheme),"""
san_new = """function sanitizeSettings(input = {}) {
  const source = migrateLegacySettings(input);

  const monitors = (source.monitors && typeof source.monitors === "object" && !Array.isArray(source.monitors))
    ? source.monitors
    : { ...DEFAULT_SETTINGS.monitors };

  return {
    monitors,
    selectedTheme: pick(source.selectedTheme, VALID_MAIN_THEMES, DEFAULT_SETTINGS.selectedTheme),"""
settings = settings.replace(san_old, san_new)
with open("settingsStore.js", "w") as f:
    f.write(settings)

# Patch main.js for Multi-Monitor
with open("main.js", "r") as f:
    main_js = f.read()

main_js = main_js.replace("let overlayWindow;", "const overlayWindows = new Map();")

create_old = """function createOverlayWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { bounds } = primaryDisplay;

  overlayWindow = new BrowserWindow({
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    movable: false,
    fullscreenable: false,
    skipTaskbar: true,
    hasShadow: false,
    focusable: false,
    backgroundColor: "#00000000",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js")
    }
  });

  overlayWindow.setAlwaysOnTop(true, "screen-saver");
  overlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  overlayWindow.setIgnoreMouseEvents(true, { forward: true });
  overlayWindow.setBounds(bounds);
  overlayWindow.moveTop();
  overlayWindow.loadFile("index.html");
  overlayWindow.webContents.on("did-finish-load", () => {
    setTimeout(() => {
      sendVisualizerSettings();
    }, 100);
  });

  overlayWindow.on("closed", () => {
    overlayWindow = null;
  });
}"""
create_new = """function createOverlayForDisplay(display) {
  const { bounds, id } = display;

  const isEnabled = visualizerSettings.monitors && visualizerSettings.monitors[id] ? visualizerSettings.monitors[id].enabled !== false : true;
  if (!isEnabled) {
    return;
  }

  if (overlayWindows.has(id)) {
    return;
  }

  const win = new BrowserWindow({
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    movable: false,
    fullscreenable: false,
    skipTaskbar: true,
    hasShadow: false,
    focusable: false,
    backgroundColor: "#00000000",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js")
    }
  });

  win.setAlwaysOnTop(true, "screen-saver");
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setIgnoreMouseEvents(true, { forward: true });
  win.setBounds(bounds);
  win.moveTop();
  win.loadFile("index.html");
  win.webContents.on("did-finish-load", () => {
    setTimeout(() => {
      sendVisualizerSettings();
    }, 100);
  });

  win.on("closed", () => {
    overlayWindows.delete(id);
  });

  overlayWindows.set(id, win);
}

function syncOverlayWindows() {
  const displays = screen.getAllDisplays();
  const currentDisplayIds = new Set(displays.map(d => d.id));

  for (const [id, win] of overlayWindows.entries()) {
    const isEnabled = visualizerSettings.monitors && visualizerSettings.monitors[id] ? visualizerSettings.monitors[id].enabled !== false : true;
    if (!currentDisplayIds.has(id) || !isEnabled) {
      if (!win.isDestroyed()) {
        win.close();
      }
      overlayWindows.delete(id);
    }
  }

  for (const display of displays) {
    createOverlayForDisplay(display);
  }
}"""
main_js = main_js.replace(create_old, create_new)

send_audio_old = """function sendAudioLevel(value, source) {
  if (isPaused) {
    return;
  }

  if (!overlayWindow || overlayWindow.isDestroyed()) {
    return;
  }

  overlayWindow.webContents.send("audio-level", {
    value,
    source
  });
}"""
send_audio_new = """function sendAudioLevel(value, source) {
  if (isPaused) {
    return;
  }

  for (const win of overlayWindows.values()) {
    if (!win.isDestroyed()) {
      win.webContents.send("audio-level", { value, source });
    }
  }
}"""
main_js = main_js.replace(send_audio_old, send_audio_new)

send_vis_old = """function sendVisualizerSettings() {
  if (!overlayWindow || overlayWindow.isDestroyed()) {
    return;
  }

  overlayWindow.webContents.send("visualizer-settings", getRendererSettings());
}"""
send_vis_new = """function sendVisualizerSettings() {
  for (const win of overlayWindows.values()) {
    if (!win.isDestroyed()) {
      win.webContents.send("visualizer-settings", getRendererSettings());
    }
  }
}"""
main_js = main_js.replace(send_vis_old, send_vis_new)

update_old = """function updateSettings(nextSettings) {
  visualizerSettings = settingsStore.save(mergeSettingsPatch(visualizerSettings, nextSettings));

  sendVisualizerSettings();
  refreshTrayMenu();
}"""
update_new = """function updateSettings(nextSettings) {
  visualizerSettings = settingsStore.save(mergeSettingsPatch(visualizerSettings, nextSettings));

  if (nextSettings.monitors !== undefined) {
    syncOverlayWindows();
  }

  sendVisualizerSettings();
  refreshTrayMenu();
}"""
main_js = main_js.replace(update_old, update_new)

reload_old = """function reloadVisualizer() {
  if (!overlayWindow || overlayWindow.isDestroyed()) {
    return;
  }

  overlayWindow.webContents.reloadIgnoringCache();
}"""
reload_new = """function reloadVisualizer() {
  for (const win of overlayWindows.values()) {
    if (!win.isDestroyed()) {
      win.webContents.reloadIgnoringCache();
    }
  }
}"""
main_js = main_js.replace(reload_old, reload_new)

resize_old = """function resizeOverlayToPrimaryDisplay() {
  if (!overlayWindow) {
    return;
  }

  const { bounds } = screen.getPrimaryDisplay();
  overlayWindow.setBounds(bounds);
  overlayWindow.setAlwaysOnTop(true, "screen-saver");
  overlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  overlayWindow.moveTop();
}"""
resize_new = """function resizeAllOverlays() {
  const displays = screen.getAllDisplays();
  for (const display of displays) {
    const win = overlayWindows.get(display.id);
    if (win && !win.isDestroyed()) {
      win.setBounds(display.bounds);
      win.setAlwaysOnTop(true, "screen-saver");
      win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
      win.moveTop();
    }
  }
}"""
main_js = main_js.replace(resize_old, resize_new)

tray_old = """    {
      label: "Visualizer Mode","""
tray_new = """    { type: "separator" },
    {
      label: "Displays",
      submenu: screen.getAllDisplays().map((display, index) => {
        const isEnabled = visualizerSettings.monitors && visualizerSettings.monitors[display.id] ? visualizerSettings.monitors[display.id].enabled !== false : true;
        return {
          label: `Display ${index + 1} (${display.bounds.width}x${display.bounds.height})`,
          type: "checkbox",
          checked: isEnabled,
          click: () => {
            updateSettings({
              monitors: {
                ...visualizerSettings.monitors,
                [display.id]: { enabled: !isEnabled }
              }
            });
          }
        };
      })
    },
    { type: "separator" },
    {
      label: "Visualizer Mode","""
main_js = main_js.replace(tray_old, tray_new)

ready_old = """  createOverlayWindow();
  createTray();
  sendVisualizerSettings();

  // Start the simulated fallback first so any real helper level can immediately disable it.
  startSimulatedAudioFallback();

  audioBridge = createAudioBridge((value) => {
    stopSimulatedAudioFallback();
    sendAudioLevel(value, "helper");
  }, handleAudioBridgeStatusChange);
  audioBridge.start();
  refreshTrayMenu();

  screen.on("display-metrics-changed", resizeOverlayToPrimaryDisplay);
  screen.on("display-added", resizeOverlayToPrimaryDisplay);
  screen.on("display-removed", resizeOverlayToPrimaryDisplay);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createOverlayWindow();
    }
  });"""
ready_new = """  syncOverlayWindows();
  createTray();
  sendVisualizerSettings();

  // Start the simulated fallback first so any real helper level can immediately disable it.
  startSimulatedAudioFallback();

  audioBridge = createAudioBridge((value) => {
    stopSimulatedAudioFallback();
    sendAudioLevel(value, "helper");
  }, handleAudioBridgeStatusChange);
  audioBridge.start();
  refreshTrayMenu();

  screen.on("display-metrics-changed", () => {
    syncOverlayWindows();
    resizeAllOverlays();
  });
  screen.on("display-added", syncOverlayWindows);
  screen.on("display-removed", syncOverlayWindows);

  app.on("activate", () => {
    if (overlayWindows.size === 0) {
      syncOverlayWindows();
    }
  });"""
main_js = main_js.replace(ready_old, ready_new)

inst_old = """app.on("second-instance", () => {
  if (overlayWindow && !overlayWindow.isDestroyed()) {
    resizeOverlayToPrimaryDisplay();
    sendVisualizerSettings();
  }
});"""
inst_new = """app.on("second-instance", () => {
  if (overlayWindows.size > 0) {
    resizeAllOverlays();
    sendVisualizerSettings();
  }
});"""
main_js = main_js.replace(inst_old, inst_new)

with open("main.js", "w") as f:
    f.write(main_js)

# Commit and Push Multi-Monitor
run_cmd('git add .')
run_cmd('git commit -m "Feat: Multi-Monitor Support for Overlay Windows (#11)"')
run_cmd('git push -f origin feat-multi-monitor')
# Create PR
run_cmd('gh pr create --repo SamXop123/Paraline --title "Feat: Multi-Monitor Support for Overlay Windows (#11)" --body "Fixes #11" --head Aditya948351:feat-multi-monitor')

# Finally check back out to main
run_cmd("git checkout main")
