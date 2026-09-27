"use client";

import { useEffect } from "react";

export function PrintAutoTrigger() {
  useEffect(() => {
    let isTriggered = false;

    const triggerPrint = async () => {
      if (isTriggered) return;
      isTriggered = true;

      // 1. Wait for document.readyState === "complete"
      if (document.readyState !== "complete") {
        await new Promise((resolve) => {
          window.addEventListener("load", resolve, { once: true });
        });
      }

      // 2. Wait for fonts if available
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      // 3. Wait for all images to complete loading and decoding
      const images = Array.from(document.images);
      await Promise.all(
        images.map((img) => {
          if (img.complete) {
            return img.decode ? img.decode().catch(() => {}) : Promise.resolve();
          }
          return new Promise((resolve) => {
            img.onload = () => resolve(img.decode ? img.decode().catch(() => {}) : undefined);
            img.onerror = resolve;
          });
        })
      );

      // 4. Wait one animation frame for rendering stability
      await new Promise((resolve) => requestAnimationFrame(resolve));

      // 5. Invoke native browser print dialog
      window.print();
    };

    const handleAfterPrint = () => {
      try {
        window.close();
      } catch {
        // Ignore if browser prevents closing auto-opened windows
      }
    };

    window.addEventListener("afterprint", handleAfterPrint);

    // Short buffer for React hydration & layout frame
    const timer = setTimeout(() => {
      void triggerPrint();
    }, 250);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  return null;
}
