import React from "react";
import Image from "next/image";
import { galleryItems as defaultGalleryItems, type GalleryItem } from "@/content/gallery";

interface GallerySectionProps {
  items?: GalleryItem[];
}

export function GallerySection({
  items = defaultGalleryItems,
}: GallerySectionProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="mb-14" data-purpose="gallery-section">
      <div className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground mb-6 font-medium">
        GALLERY
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative group overflow-hidden rounded-xl bg-surface border border-border"
          >
            <div className="relative aspect-4/3 w-full overflow-hidden">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 100vw, 300px"
                className="object-cover"
              />
            </div>
            {item.caption && (
              <p className="p-2.5 text-[12px] text-muted-foreground leading-snug">
                {item.caption}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
