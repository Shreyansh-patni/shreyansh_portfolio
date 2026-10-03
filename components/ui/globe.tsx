"use client";

import { useEffect, useRef, useState } from "react";
import createGlobe, { type COBEOptions } from "cobe";
import { useMotionValue, useSpring } from "motion/react";

import { cn } from "@/lib/utils";

const MOVEMENT_DAMPING = 1400;

export const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [0.3, 0.3, 0.3],
  markerColor: [251 / 255, 100 / 255, 21 / 255],
  glowColor: [0.9, 0.9, 0.9],
  markers: [
    { location: [12.9719, 77.5937], size: 0.1 }, // Bengaluru, India (Prominent)
    { location: [23.0225, 72.5714], size: 0.05 }, // Gujarat, India
    { location: [37.7749, -122.4194], size: 0.04 }, // San Francisco, CA
    { location: [51.5074, -0.1278], size: 0.04 }, // London, UK
    { location: [35.6762, 139.6503], size: 0.04 }, // Tokyo, Japan
  ],
};

function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return !!gl;
  } catch {
    return false;
  }
}

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string;
  config?: COBEOptions;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const widthRef = useRef(0);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  const [isDark, setIsDark] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(checkWebGLSupport);

  const r = useMotionValue(0);
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  });

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      r.set(r.get() + delta / MOVEMENT_DAMPING);
    }
  };

  useEffect(() => {
    const checkDark = () => {
      if (typeof document !== "undefined") {
        const isDarkMode =
          document.documentElement.classList.contains("dark") ||
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDark(isDarkMode);
      }
    };

    checkDark();

    const observer = new MutationObserver(checkDark);
    if (typeof document !== "undefined") {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isSupported) return;

    const onResize = () => {
      if (canvasRef.current) {
        widthRef.current = canvasRef.current.offsetWidth;
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const mergedConfig: COBEOptions = {
      ...config,
      dark: isDark ? 1 : 0,
      baseColor: isDark ? [1, 1, 1] : config.baseColor,
      glowColor: isDark ? [0.2, 0.2, 0.2] : config.glowColor,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      onRender: (state) => {
        if (!pointerInteracting.current && !prefersReducedMotion) {
          phiRef.current += 0.005;
        }
        state.phi = phiRef.current + rs.get();
        state.width = widthRef.current * 2;
        state.height = widthRef.current * 2;
      },
    };

    let globe: ReturnType<typeof createGlobe> | null = null;
    let animationFrameId = 0;

    try {
      globe = createGlobe(canvas, mergedConfig);
      animationFrameId = requestAnimationFrame(() => {
        if (canvasRef.current) {
          canvasRef.current.style.opacity = "1";
        }
      });
    } catch {
      queueMicrotask(() => setIsSupported(false));
      return () => {
        window.removeEventListener("resize", onResize);
      };
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (globe) {
        try {
          globe.destroy();
        } catch {}
      }
      window.removeEventListener("resize", onResize);
    };
  }, [rs, config, isDark, isSupported]);

  if (!isSupported) {
    return (
      <div
        className={cn(
          "relative mx-auto aspect-square w-full max-w-150 flex items-center justify-center rounded-full bg-surface/30 border border-border/40 shadow-inner",
          className
        )}
        role="img"
        aria-label="3D Globe unavailable"
      >
        <div className="w-1/2 h-1/2 rounded-full bg-border/20 blur-xl" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative mx-auto aspect-square w-full max-w-150 flex items-center justify-center",
        className
      )}
    >
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-500 contain-[layout_paint_size]"
        )}
        ref={canvasRef}
        role="img"
        aria-label="Interactive 3D Globe showing key locations"
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          updatePointerInteraction(e.clientX);
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  );
}
