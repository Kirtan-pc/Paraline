"use client";

import { useEffect, useRef } from "react";

export function AmbientWavePreview({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    let smoothedLevel = 0;

    const render = () => {
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }

      const width = canvas.width;
      const height = canvas.height;

      // Update simulated audio reactivity
      if (active) {
        const target = 0.25 + 0.3 * Math.sin(time * 3) + 0.15 * Math.sin(time * 7.5);
        smoothedLevel += (target - smoothedLevel) * 0.1;
      } else {
        smoothedLevel += (0 - smoothedLevel) * 0.05;
      }

      time += active ? 0.015 : 0.005;

      ctx.clearRect(0, 0, width, height);

      // Reset canvas composite and shadow settings
      ctx.globalCompositeOperation = "source-over";
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";

      const glowScale = 1.18;
      const topBase = height * 0.25 + smoothedLevel * 10;
      const bottomBase = height * 0.75 - smoothedLevel * 25;
      const primaryAmplitude = 6 + smoothedLevel * 18;
      const secondaryAmplitude = 2 + smoothedLevel * 8;

      const blueTheme = {
        topLine: "rgba(145, 220, 255, 0.75)",
        topGlow: "rgba(120, 205, 255, 0.35)",
        bottomLine: "rgba(168, 232, 255, 0.7)",
        bottomGlow: "rgba(120, 205, 255, 0.25)"
      };

      // Draw Top Waves
      drawSoftFill(ctx, {
        width,
        time,
        yBase: topBase,
        amplitude: primaryAmplitude * 0.6,
        frequency: 0.0064,
        speed: 0.28,
        color: blueTheme.topGlow,
        thickness: 28,
        alphaScale: glowScale,
        invert: true
      });
      drawWave(ctx, {
        width,
        time,
        yBase: topBase,
        amplitude: primaryAmplitude * 0.6,
        frequency: 0.0088,
        speed: 0.26,
        color: blueTheme.topLine,
        lineWidth: 2.2,
        opacity: 0.8,
        glowScale,
        invert: true
      });
      drawWave(ctx, {
        width,
        time,
        yBase: topBase + 6,
        amplitude: secondaryAmplitude * 0.55,
        frequency: 0.0112,
        speed: 0.34,
        color: blueTheme.topGlow,
        lineWidth: 1.5,
        opacity: 0.4,
        glowScale,
        invert: true
      });

      // Draw Bottom Waves
      drawSoftFill(ctx, {
        width,
        time,
        yBase: bottomBase,
        amplitude: primaryAmplitude * 0.9,
        frequency: 0.007,
        speed: 0.32,
        color: blueTheme.bottomGlow,
        thickness: 40,
        alphaScale: glowScale
      });
      drawWave(ctx, {
        width,
        time,
        yBase: bottomBase,
        amplitude: primaryAmplitude * 0.9,
        frequency: 0.0102,
        speed: 0.34,
        color: blueTheme.bottomLine,
        lineWidth: 2.8,
        opacity: 0.9,
        glowScale
      });
      drawWave(ctx, {
        width,
        time,
        yBase: bottomBase - 8,
        amplitude: secondaryAmplitude,
        frequency: 0.013,
        speed: 0.48,
        color: blueTheme.bottomGlow,
        lineWidth: 1.8,
        opacity: 0.5,
        glowScale
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [active]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 bg-transparent" 
      style={{ opacity: active ? 1 : 0.6 }}
    />
  );
}

interface WaveOptions {
  width: number;
  time: number;
  yBase: number;
  amplitude: number;
  frequency: number;
  speed: number;
  color: string;
  lineWidth: number;
  opacity: number;
  glowScale?: number;
  invert?: boolean;
}

function drawWave(ctx: CanvasRenderingContext2D, options: WaveOptions) {
  const { width, time, yBase, amplitude, frequency, speed, color, lineWidth, opacity, glowScale = 1, invert = false } = options;
  const step = 20;
  const phaseA = time * speed;
  const phaseB = time * speed * 0.52;

  ctx.beginPath();
  for (let x = 0; x <= width; x += step) {
    const waveA = Math.sin(x * frequency + phaseA);
    const waveB = Math.sin(x * frequency * 0.42 - phaseB);
    const lift = (waveA + waveB) * amplitude;
    const y = yBase + (invert ? -lift : lift);

    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.globalAlpha = opacity * glowScale;
  ctx.shadowBlur = (24 + amplitude * 0.4) * glowScale;
  ctx.shadowColor = color;
  ctx.stroke();
}

interface SoftFillOptions {
  width: number;
  time: number;
  yBase: number;
  amplitude: number;
  frequency: number;
  speed: number;
  color: string;
  thickness: number;
  alphaScale?: number;
  invert?: boolean;
}

function drawSoftFill(ctx: CanvasRenderingContext2D, options: SoftFillOptions) {
  const { width, time, yBase, amplitude, frequency, speed, color, thickness, alphaScale = 1, invert = false } = options;
  const step = 24;
  const phaseA = time * speed;
  const phaseB = time * speed * 0.45;

  ctx.beginPath();
  ctx.moveTo(0, yBase);
  for (let x = 0; x <= width; x += step) {
    const waveA = Math.sin(x * frequency + phaseA);
    const waveB = Math.sin(x * frequency * 0.35 - phaseB);
    const lift = (waveA + waveB) * amplitude;
    ctx.lineTo(x, yBase + (invert ? -lift : lift));
  }

  ctx.lineTo(width, yBase + (invert ? -thickness : thickness));
  ctx.lineTo(0, yBase + (invert ? -thickness : thickness));
  ctx.closePath();

  ctx.globalAlpha = alphaScale;
  ctx.shadowBlur = 0;
  ctx.fillStyle = color;
  ctx.fill();
}
