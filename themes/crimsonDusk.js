(() => {
  const {
    clamp01,
    getGlowMultiplier,
    hexToRgb,
    applyOptimizedShadow,
    getPerformanceMultiplier
  } = window.ParalineShared;

  // ─── Crimson Dusk Palette ───────────────────────────────────────────────────
  // Inspired by desert sunsets, ember glows, and vintage film aesthetics.
  // Deep charcoals with warm amber and crimson accents.

  const CRIMSON_COLORS = {
    emberOrange:  [255, 107,  53],   // #FF6B35 — primary glow
    deepCrimson:  [192,  57,  43],   // #C0392B — secondary glow
    warmAmber:    [243, 156,  18],   // #F39C12 — accent
    dustRed:      [220,  80,  20],   // ember mid-tone
    glowGold:     [255, 180,  60],   // bright peak
    darkEmber:    [160,  40,   8],   // deep ember shadow
  };

  // ─── Settings helpers ───────────────────────────────────────────────────────

  function getCrimsonInputMultiplier(settings = {}) {
    let base = 3.2;
    if (settings.sensitivity === "low")  base = 2.2;
    if (settings.sensitivity === "high") base = 4.5;
    if (settings.sensitivity === "custom" && typeof settings.customSensitivity === "number") {
      return base * (settings.customSensitivity / 30);
    }
    return base;
  }

  // ─── Shared color resolver ──────────────────────────────────────────────────

  function resolveEmberColor(normalizedPos, time, opacity) {
    // Cycle through ember palette: orange → amber → crimson → amber → orange
    const palette = [
      CRIMSON_COLORS.emberOrange,
      CRIMSON_COLORS.glowGold,
      CRIMSON_COLORS.warmAmber,
      CRIMSON_COLORS.deepCrimson,
      CRIMSON_COLORS.dustRed,
    ];
    const travel  = (normalizedPos + time * 0.04) % 1;
    const scaled  = travel * palette.length;
    const indexA  = Math.floor(scaled) % palette.length;
    const indexB  = (indexA + 1) % palette.length;
    const blend   = scaled - Math.floor(scaled);
    const cA = palette[indexA];
    const cB = palette[indexB];
    const r = Math.round(cA[0] + (cB[0] - cA[0]) * blend);
    const g = Math.round(cA[1] + (cB[1] - cA[1]) * blend);
    const b = Math.round(cA[2] + (cB[2] - cA[2]) * blend);
    return `rgba(${r},${g},${b},${opacity.toFixed(3)})`;
  }

  // ─── Bottom Waveform bars ───────────────────────────────────────────────────
  // A warm audio-reactive waveform strip along the bottom edge.
  // Center bars are tallest (musical emphasis), tapering to edges.

  function drawCrimsonDuskBottom(options) {
    const {
      context,
      width,
      height,
      time,
      smoothedLevel,
      settings,
      performanceMode = 'balanced'
    } = options;

    const glowMultiplier  = getGlowMultiplier(settings.glowStrength);
    const perfMultiplier  = getPerformanceMultiplier(performanceMode);
    const barCount        = settings.barCount === "dense"  ? 72
                          : settings.barCount === "sparse" ? 36
                          : 52;
    const barThickness    = settings.barThickness === "thin"   ? 2
                          : settings.barThickness === "thick"  ? 5
                          : 3.5;
    const gap             = 2;
    const step            = barThickness + gap;
    const totalWidth      = barCount * step;
    const startX          = (width - totalWidth) * 0.5;
    const baseY           = height;
    const maxBarHeight    = 18 + smoothedLevel * 48;
    const glowBlur        = (6 + smoothedLevel * 10) * glowMultiplier * perfMultiplier;

    context.globalAlpha = 1;
    context.shadowBlur  = 0;

    for (let i = 0; i < barCount; i++) {
      const normalizedI   = i / (barCount - 1);               // 0 → 1
      const distCenter    = Math.abs(normalizedI - 0.5) / 0.5; // 0=center, 1=edge
      const centerEnvelope = Math.pow(1 - distCenter, 1.2);

      // Organic noise per bar
      const noise = Math.sin(time * 3.2 + i * 0.42) * 0.4
                  + Math.sin(time * 1.9 + i * 0.71) * 0.3
                  + 0.3;

      const barH    = Math.max(1.5, maxBarHeight * noise * centerEnvelope);
      const opacity = clamp01(0.55 + smoothedLevel * 0.3 + centerEnvelope * 0.15);
      const color   = resolveEmberColor(normalizedI, time, opacity);

      const x = startX + i * step;
      const y = baseY - barH;

      // Gradient per bar: bright top → deep bottom
      const grad = context.createLinearGradient(x, y, x, baseY);
      const [r1, g1, b1] = CRIMSON_COLORS.glowGold;
      const [r2, g2, b2] = CRIMSON_COLORS.deepCrimson;
      grad.addColorStop(0, `rgba(${r1},${g1},${b1},${opacity})`);
      grad.addColorStop(1, `rgba(${r2},${g2},${b2},${(opacity * 0.4).toFixed(3)})`);

      context.fillStyle = grad;
      applyOptimizedShadow(context, color, glowBlur * (0.5 + centerEnvelope * 0.5), performanceMode);

      const radius = Math.min(barThickness * 0.5, 3);
      if (typeof context.roundRect === "function") {
        context.beginPath();
        context.roundRect(x, y, barThickness, barH, [radius, radius, 0, 0]);
        context.fill();
      } else {
        context.fillRect(x, y, barThickness, barH);
      }
    }
  }

  // ─── Side Ember bars ────────────────────────────────────────────────────────
  // Ember bars on left & right edges — distinct from Side Bars theme:
  //   • Crimson/amber palette (not multicolor)
  //   • Ember glow decay effect (bars fade outward from center vertically)
  //   • Subtle heat-shimmer horizontal offset on beat
  //   • Bars grow INWARD from edges (not fixed width)

  function drawCrimsonDuskSide(options) {
    const {
      context,
      width,
      height,
      time,
      smoothedLevel,
      settings,
      performanceMode = 'balanced'
    } = options;

    const glowMultiplier = getGlowMultiplier(settings.glowStrength);
    const perfMultiplier = getPerformanceMultiplier(performanceMode);
    const barHeight      = settings.barThickness === "thin"  ? 2
                         : settings.barThickness === "thick" ? 5
                         : 3.5;
    const gap            = settings.barCount === "dense"  ? 4
                         : settings.barCount === "sparse" ? 12
                         : 7;
    const step           = barHeight + gap;
    const edgeOverscan   = 8;
    const usableH        = height + edgeOverscan * 2;
    const count          = Math.max(10, Math.ceil(usableH / step) + 1);
    const maxBarLength   = 8 + smoothedLevel * 46;
    const glowBlur       = (4 + smoothedLevel * 10) * glowMultiplier * perfMultiplier;
    const sideInset      = 3;

    // Heat shimmer — subtle horizontal offset on strong beats
    const shimmer = smoothedLevel > 0.6 ? Math.sin(time * 18) * smoothedLevel * 2.5 : 0;

    context.globalAlpha = 1;
    context.shadowBlur  = 0;

    for (let i = 0; i < count; i++) {
      const normalizedY    = count <= 1 ? 0.5 : i / (count - 1);
      const distCenter     = Math.abs(normalizedY - 0.5) / 0.5;
      const centerEnvelope = Math.pow(1 - distCenter, 1.5);  // tall center, fade toward top/bottom

      const motion     = Math.sin(time * 2.8 + normalizedY * 9.2) * 0.45 + 0.55;
      const barLength  = Math.max(1.5, maxBarLength * motion * (0.3 + centerEnvelope * 0.85));
      const opacity    = clamp01(0.38 + smoothedLevel * 0.28 + centerEnvelope * 0.2);
      const color      = resolveEmberColor(normalizedY, time, opacity);

      const y       = -edgeOverscan + i * step;
      const leftX   = sideInset + shimmer;
      const rightX  = width - sideInset - barLength - shimmer;

      context.fillStyle = color;
      applyOptimizedShadow(context, color, glowBlur * (0.35 + centerEnvelope * 0.6), performanceMode);

      const radius = Math.min(barHeight * 0.5, 3);

      if (typeof context.roundRect === "function") {
        context.beginPath();
        context.roundRect(leftX,  y, barLength, barHeight, radius);
        context.fill();
        context.beginPath();
        context.roundRect(rightX, y, barLength, barHeight, radius);
        context.fill();
      } else {
        context.fillRect(leftX,  y, barLength, barHeight);
        context.fillRect(rightX, y, barLength, barHeight);
      }
    }
  }

  // ─── Edge glow vignette ─────────────────────────────────────────────────────
  // Soft crimson/amber glow along all screen edges — atmospheric, ambient.
  // Always rendered regardless of barMode, gives Crimson Dusk its warmth.

  function drawCrimsonEdgeGlow(context, width, height, smoothedLevel, glowMultiplier) {
    const intensity = (0.06 + smoothedLevel * 0.08) * glowMultiplier;

    // Bottom
    const gradB = context.createLinearGradient(0, height - 60, 0, height);
    gradB.addColorStop(0, `rgba(0,0,0,0)`);
    gradB.addColorStop(1, `rgba(192,57,43,${intensity * 2.2})`);
    context.fillStyle = gradB;
    context.fillRect(0, height - 60, width, 60);

    // Left
    const gradL = context.createLinearGradient(0, 0, 55, 0);
    gradL.addColorStop(0, `rgba(192,57,43,${intensity * 1.6})`);
    gradL.addColorStop(1, `rgba(0,0,0,0)`);
    context.fillStyle = gradL;
    context.fillRect(0, 0, 55, height);

    // Right
    const gradR = context.createLinearGradient(width - 55, 0, width, 0);
    gradR.addColorStop(0, `rgba(0,0,0,0)`);
    gradR.addColorStop(1, `rgba(192,57,43,${intensity * 1.6})`);
    context.fillStyle = gradR;
    context.fillRect(width - 55, 0, 55, height);

    // Top (subtle)
    const gradT = context.createLinearGradient(0, 0, 0, 35);
    gradT.addColorStop(0, `rgba(160,40,8,${intensity * 0.9})`);
    gradT.addColorStop(1, `rgba(0,0,0,0)`);
    context.fillStyle = gradT;
    context.fillRect(0, 0, width, 35);
  }

  // ─── Main draw entry ────────────────────────────────────────────────────────

  function drawCrimsonDusk(options) {
    const {
      context,
      width,
      height,
      settings,
      smoothedLevel,
    } = options;

    const glowMultiplier = getGlowMultiplier(settings.glowStrength);

    // Always: ambient edge glow
    drawCrimsonEdgeGlow(context, width, height, smoothedLevel, glowMultiplier);

    // Bar mode: bottom (default) or side
    const barMode = settings.barMode || "bottom";

    if (barMode === "bottom") {
      drawCrimsonDuskBottom(options);
    } else if (barMode === "side") {
      drawCrimsonDuskSide(options);
    } else if (barMode === "both") {
      drawCrimsonDuskBottom(options);
      drawCrimsonDuskSide(options);
    }
  }

  // ─── Export ─────────────────────────────────────────────────────────────────

  window.ParalineCrimsonDusk = {
    getCrimsonInputMultiplier,
    drawCrimsonDusk
  };
})();
