import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { ProductImage } from "../types";
import { motion } from "motion/react";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  // States to facilitate high-fidelity magnification zoom
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const displayImages = images.length > 0 ? images : [
    { id: "fallback", url: "https://via.placeholder.com/600x800", altText: productName, order: 0 }
  ];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Calculate fractional coordinate values from 0.0 to 1.0 representation
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  return (
    <div id="pdp-gallery-container" className="flex flex-col gap-4 lg:sticky lg:top-24 select-none">
      {/* Primary Hero View Port with Zoom Effect */}
      <div
        id="pdp-gallery-viewport"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setMousePos({ x: 0.5, y: 0.5 });
        }}
        onMouseMove={handleMouseMove}
        className="relative aspect-[3/4] w-full bg-neutral-100 overflow-hidden rounded-lg group shadow-sm cursor-zoom-in"
      >
        <motion.img
          id="pdp-main-gallery-img"
          key={displayImages[activeIdx].url} // Key trigger to animate item transition smoothly
          initial={{ opacity: 0.85 }}
          animate={{
            opacity: 1,
            scale: isHovered ? 2.4 : 1,
          }}
          style={{
            transformOrigin: `${mousePos.x * 100}% ${mousePos.y * 100}%`,
          }}
          transition={{
            scale: { type: "spring", stiffness: 120, damping: 22, mass: 0.6 },
            opacity: { duration: 0.25, ease: "easeOut" }
          }}
          src={displayImages[activeIdx].url}
          alt={displayImages[activeIdx].altText || productName}
          className="h-full w-full object-cover object-center pointer-events-none select-none"
          referrerPolicy="no-referrer"
        />

        {/* Indication label for high accessibility zoom trigger */}
        <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-mono uppercase text-white inline-flex items-center gap-1.5 opacity-90 transition-opacity duration-200 pointer-events-none group-hover:opacity-100 tracking-wider">
          <Maximize2 className="h-3 w-3 text-kiwi animate-pulse" /> Hover to examine fabric
        </div>

        {/* Slide Controls Overlay - Keep clickable over the zoomed layers */}
        {displayImages.length > 1 && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-4 z-10 transition-opacity duration-300">
            <button
              id="gallery-prev-btn"
              onClick={handlePrev}
              className="pointer-events-auto rounded-full bg-white/95 p-2.5 text-neutral-800 shadow-lg hover:bg-white active:scale-90 transition-all opacity-0 group-hover:opacity-100 duration-200 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
            </button>
            <button
              id="gallery-next-btn"
              onClick={handleNext}
              className="pointer-events-auto rounded-full bg-white/95 p-2.5 text-neutral-800 shadow-lg hover:bg-white active:scale-90 transition-all opacity-0 group-hover:opacity-100 duration-200 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* Micro slider pager dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/40 backdrop-blur-sm py-1.5 px-3 rounded-full z-10 pointer-events-none">
          {displayImages.map((_, idx) => (
            <button
              key={idx}
              id={`pdp-dot-${idx}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveIdx(idx);
              }}
              className={`h-1.5 w-1.5 pointer-events-auto rounded-full transition-all ${
                idx === activeIdx ? "bg-white w-3" : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Row of Symmetrical Thumbnails */}
      {displayImages.length > 1 && (
        <div id="pdp-thumbnails-strip" className="flex gap-2.5 overflow-x-auto py-1 justify-center max-w-full">
          {displayImages.map((img, idx) => (
            <button
              key={img.id}
              id={`pdp-thumb-${idx}`}
              onClick={() => setActiveIdx(idx)}
              className={`h-22 w-16 rounded border bg-white overflow-hidden shrink-0 transition-all ${
                idx === activeIdx
                  ? "border-neutral-900 ring-2 ring-kiwi scale-102"
                  : "border-neutral-200 opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img.url}
                alt={`Detail thumbnail ${idx + 1}`}
                className="h-full w-full object-cover pointer-events-none"
                referrerPolicy="no-referrer"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
