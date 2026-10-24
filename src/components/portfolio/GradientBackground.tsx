"use client";

import { useEffect, useRef } from "react";
import { mountGradient, parseParams } from "@/lib/gradient-engine";

const params = parseParams(
  "%7B%22background%22%3A%22%23B82E2E%22%2C%22blur%22%3A0.65%2C%22colors%22%3A%5B%22%23FF6E6E%22%2C%22%23FFA9A9%22%2C%22%23FAD9D9%22%2C%22%239E3D3D%22%5D%2C%22dither%22%3A%7B%22cell%22%3A3%2C%22enabled%22%3Afalse%2C%22levels%22%3A8%7D%2C%22grain%22%3A0%2C%22interaction%22%3A%7B%22pointer%22%3A0.2%2C%22scroll%22%3A0.15%7D%2C%22kind%22%3A%22mist%22%2C%22loopSeconds%22%3A14%2C%22scale%22%3A0.8%2C%22seed%22%3A4%2C%22speed%22%3A0.8%2C%22warp%22%3A0.4%7D",
);

export function GradientBackground({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gradient = mountGradient(canvas, params);
    return () => gradient.unmount();
  }, []);
  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
