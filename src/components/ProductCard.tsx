import React, { useState } from "react";
import { Star, Eye, ShoppingCart } from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  key?: string;
  product: Product;
  onOpenDetails: (product: Product) => void;
  onQuickAdd: (product: Product, variantId: string) => void;
}

export default function ProductCard({ product, onOpenDetails, onQuickAdd }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Derive unique colors and unique sizes of current product variants
  const colors = Array.from(new Set(product.variants.map((v) => v.color)));
  const sizes = Array.from(new Set(product.variants.map((v) => v.size)));

  // Calculate average rating
  const avgRating =
    product.reviews.length > 0
      ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)
      : null;

  // Find default image or first image
  const displayImage = product.images[currentImageIndex] || product.images[0] || { url: "https://via.placeholder.com/600", altText: "Kiwi product" };

  // To quick add, we pick the first available variant
  const defaultVariant = product.variants.find((v) => v.stockQuantity > 0) || product.variants[0];

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-white overflow-hidden rounded-md border border-neutral-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onMouseEnter={() => {
        setIsHovered(true);
        if (product.images.length > 1) setCurrentImageIndex(1);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[3/4] w-full bg-neutral-100 overflow-hidden cursor-pointer" onClick={() => onOpenDetails(product)}>
        <img
          id={`product-img-${product.id}`}
          src={displayImage.url}
          alt={displayImage.altText || product.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Featured Tag indicator */}
        {product.isFeatured && (
          <div className="absolute left-3 top-3 z-10 rounded bg-dark/95 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-kiwi uppercase">
            FEATURED
          </div>
        )}

        {/* Out of Stock banner */}
        {product.variants.reduce((acc, v) => acc + v.stockQuantity, 0) === 0 && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <span className="rounded bg-black px-4 py-1.5 text-xs font-bold tracking-widest text-white uppercase border border-neutral-700">
              Sold Out
            </span>
          </div>
        )}

        {/* Floating Quick Action Overlay Buttons */}
        <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center gap-2 px-4 transition-all duration-300 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            id={`quick-add-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              if (defaultVariant) {
                onQuickAdd(product, defaultVariant.id);
              }
            }}
            disabled={product.variants.reduce((acc, v) => acc + v.stockQuantity, 0) === 0}
            className="flex items-center gap-1.5 rounded-md bg-white px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-dark shadow-md hover:bg-kiwi transition-colors disabled:opacity-50"
          >
            <ShoppingCart className="h-4 w-4" /> Quick Add
          </button>
          
          <button
            id={`quick-view-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(product);
            }}
            className="flex items-center justify-center rounded-md bg-dark p-2.5 text-white shadow-md hover:bg-neutral-800 transition-colors"
            title="Inspect item"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Product Information Area */}
      <div className="flex flex-1 flex-col p-4">
        {/* Colors & Review Summary */}
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5 font-sans">
          <span className="truncate max-w-[120px]" title={colors.join(", ")}>
            {colors.length} {colors.length === 1 ? "Color" : "Colors"}
          </span>
          
          {avgRating && (
            <div className="flex items-center gap-1 text-neutral-800">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{avgRating}</span>
              <span className="text-neutral-400">({product.reviews.length})</span>
            </div>
          )}
        </div>

        {/* product Title */}
        <h3 className="font-display font-medium text-sm text-dark tracking-tight line-clamp-1 mb-1 cursor-pointer hover:underline hover:decoration-kiwi" onClick={() => onOpenDetails(product)}>
          {product.name}
        </h3>

        {/* Pricing Segment */}
        <div className="mt-auto pt-2 flex items-baseline justify-between">
          <span id={`price-${product.id}`} className="font-mono text-sm font-semibold text-neutral-900">
            ${product.basePrice.toFixed(2)}
          </span>
          {sizes.length > 0 && (
            <span className="text-[10px] text-neutral-400 font-mono font-medium tracking-wide uppercase">
              {sizes.join(" / ")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
