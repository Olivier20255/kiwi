import React, { useState, useMemo } from "react";
import { Plus, Minus, ShoppingBag, Eye, ShieldCheck, Truck, RefreshCw, Star, Sparkles } from "lucide-react";
import { Product, ProductVariant } from "../types";

interface ProductInfoProps {
  product: Product;
  onAddToCart: (product: Product, variantId: string, quantity: number) => void;
  onColorChange?: (color: string) => void;
}

export default function ProductInfo({ product, onAddToCart, onColorChange }: ProductInfoProps) {
  // Extract unique colors/sizes from product variants safely
  const uniqueColors = useMemo(() => {
    return Array.from(new Set(product.variants.map((v) => v.color)));
  }, [product.variants]);

  const uniqueSizes = useMemo(() => {
    return Array.from(new Set(product.variants.map((v) => v.size)));
  }, [product.variants]);

  // Set initial default selection if options exist
  const [selectedColor, setSelectedColor] = useState<string>(uniqueColors[0] || "");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  // Accordion active state
  type Section = "description" | "materials" | "shipping";
  const [activeSection, setActiveSection] = useState<Section | null>("description");

  // Determine variant match for current color + size
  const activeVariant = useMemo(() => {
    if (!selectedColor || !selectedSize) return null;
    return product.variants.find(
      (v) => v.color.toLowerCase() === selectedColor.toLowerCase() && v.size.toLowerCase() === selectedSize.toLowerCase()
    ) || null;
  }, [product.variants, selectedColor, selectedSize]);

  // Helper to audit stock matching current color + ANY size
  const getStockStatusForSize = (size: string) => {
    const variant = product.variants.find(
      (v) => v.color.toLowerCase() === selectedColor.toLowerCase() && v.size.toLowerCase() === size.toLowerCase()
    );
    if (!variant) return { exists: false, stock: 0 };
    return { exists: true, stock: variant.stockQuantity };
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    if (onColorChange) {
      onColorChange(color);
    }

    // Auto-reset size if the new color color does not have the selected size in stock
    if (selectedSize) {
      const match = product.variants.find(
        (v) => v.color.toLowerCase() === color.toLowerCase() && v.size.toLowerCase() === selectedSize.toLowerCase()
      );
      if (!match || match.stockQuantity === 0) {
        setSelectedSize("");
      }
    }
  };

  const incrementQty = () => {
    if (activeVariant && quantity < activeVariant.stockQuantity) {
      setQuantity((v) => v + 1);
    } else if (!activeVariant) {
      setQuantity((v) => v + 1);
    }
  };

  const decrementQty = () => {
    setQuantity((v) => (v > 1 ? v - 1 : 1));
  };

  const toggleSection = (section: Section) => {
    setActiveSection((curr) => (curr === section ? null : section));
  };

  const activePrice = activeVariant?.priceOverride ?? product.basePrice;

  // Rating calculations
  const averageRating = useMemo(() => {
    if (!product.reviews || product.reviews.length === 0) return 4.8; // beautiful premium default
    const sum = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / product.reviews.length) * 10) / 10;
  }, [product.reviews]);

  const totalReviews = product.reviews ? product.reviews.length : 24;

  const handleAdd = () => {
    if (!selectedColor) return;
    if (!selectedSize) {
      // Pick first size if user didn't select, or alert beautifully
      const firstAvailableSize = uniqueSizes.find((sz) => getStockStatusForSize(sz).stock > 0);
      if (firstAvailableSize) {
        setSelectedSize(firstAvailableSize);
        return;
      }
      return;
    }

    if (activeVariant) {
      onAddToCart(product, activeVariant.id, quantity);
      // Reset quantity on successful addition
      setQuantity(1);
    }
  };

  return (
    <div id="pdp-info-panel-container" className="flex flex-col gap-6 lg:pl-4">
      {/* Brand & Badge Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-kiwi/15 text-neutral-800 border border-kiwi/30">
            <Sparkles className="h-3.5 w-3.5 text-kiwi animate-pulse" />
            Fine Craftsmanship
          </span>
          {product.isFeatured && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-dark text-white">
              Limited Edition
            </span>
          )}
        </div>
        
        <h1 id="pdp-product-name" className="text-3xl md:text-4xl font-sans font-bold tracking-tight text-neutral-900">
          {product.name}
        </h1>

        {/* Rating Meter */}
        <div className="mt-2.5 flex items-center gap-2 text-sm text-neutral-500">
          <div className="flex text-amber-500">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                className={`h-4 w-4 fill-current ${
                  idx < Math.floor(averageRating) ? "text-amber-500" : "text-neutral-200"
                }`}
              />
            ))}
          </div>
          <span className="font-semibold text-neutral-900">{averageRating}</span>
          <span>•</span>
          <span className="underline cursor-pointer hover:text-neutral-900">{totalReviews} customer feedback</span>
        </div>
      </div>

      {/* Pricing Display */}
      <div id="pdp-price" className="border-y border-neutral-100 py-4 flex items-baseline justify-between">
        <div>
          <span className="text-xs text-neutral-400 font-mono tracking-widest block uppercase mb-1">Price</span>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-mono text-neutral-900 font-extrabold">
              ${activePrice.toFixed(2)}
            </span>
            {activeVariant?.priceOverride && activeVariant.priceOverride < product.basePrice && (
              <span className="text-lg text-neutral-400 line-through font-mono">
                ${product.basePrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        {activeVariant && (
          <div className="text-right">
            <span className="text-xs text-neutral-400 font-mono block uppercase mb-1">Status</span>
            {activeVariant.stockQuantity > 0 ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                {activeVariant.stockQuantity} remaining
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-50 text-red-600 border border-red-200">
                Out of Stock
              </span>
            )}
          </div>
        )}
      </div>

      {/* Selector: Color */}
      <div id="pdp-color-selector">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-neutral-800">Color:</span>
          <span className="text-xs font-mono text-neutral-500 capitalize">{selectedColor}</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {uniqueColors.map((color) => {
            // Match color background or default safely
            const isSelected = selectedColor.toLowerCase() === color.toLowerCase();
            return (
              <button
                key={color}
                id={`pdp-color-btn-${color}`}
                onClick={() => handleColorSelect(color)}
                className={`px-3.5 py-2 rounded-md font-sans text-xs font-medium border transition-all ${
                  isSelected
                    ? "border-neutral-900 bg-neutral-900 text-white shadow-xs ring-2 ring-kiwi/50"
                    : "border-neutral-200 hover:border-neutral-800 bg-white text-neutral-750"
                }`}
              >
                {color}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selector: Size */}
      <div id="pdp-size-selector">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-neutral-800 font-sans">Size:</span>
          <span className="text-xs font-mono text-neutral-500 uppercase">{selectedSize || "unselected"}</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {uniqueSizes.map((size) => {
            const { exists, stock } = getStockStatusForSize(size);
            const isOutOfStock = !exists || stock === 0;
            const isSelected = selectedSize.toLowerCase() === size.toLowerCase();

            return (
              <button
                key={size}
                id={`pdp-size-btn-${size}`}
                disabled={isOutOfStock}
                onClick={() => setSelectedSize(size)}
                className={`h-11 rounded-md text-xs font-mono uppercase tracking-widest border transition-all flex items-center justify-center relative ${
                  isOutOfStock
                    ? "border-neutral-100 bg-neutral-50/50 text-neutral-350 cursor-not-allowed line-through"
                    : isSelected
                    ? "border-neutral-900 bg-neutral-950 text-white font-bold ring-2 ring-kiwi/50 scale-102"
                    : "border-neutral-200 bg-white hover:border-neutral-800 text-neutral-800"
                }`}
              >
                {size}
                {isOutOfStock && (
                  <span className="absolute bottom-1 text-[8px] tracking-tight leading-none text-neutral-400 font-sans">
                    Sold Out
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Actions Container */}
      <div id="pdp-sticky-action-container" className="pt-4 flex flex-col gap-3">
        <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Select Amount</label>
        <div className="flex gap-3">
          {/* Quantity Micro Picker */}
          <div className="flex items-center border border-neutral-200 rounded-md bg-neutral-50/50 p-1">
            <button
              id="qty-minus-btn"
              onClick={decrementQty}
              disabled={quantity <= 1}
              className="p-1 px-2 text-neutral-500 hover:text-black hover:bg-white rounded transition disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span id="qty-val-indicator" className="px-4 font-mono font-bold text-neutral-800 text-sm">
              {quantity}
            </span>
            <button
              id="qty-plus-btn"
              onClick={incrementQty}
              disabled={!!activeVariant && quantity >= activeVariant.stockQuantity}
              className="p-1 px-2 text-neutral-500 hover:text-black hover:bg-white rounded transition disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA Button - Sticky/Full Width inside columns */}
          <button
            id="pdp-add-to-cart-btn"
            onClick={handleAdd}
            disabled={!selectedColor || !selectedSize || (!!activeVariant && activeVariant.stockQuantity === 0)}
            className="flex-1 bg-neutral-950 text-white rounded-md h-12 flex items-center justify-center gap-2.5 hover:bg-neutral-800 active:scale-98 transition-all shadow-sm font-semibold text-sm disabled:bg-neutral-100 disabled:text-neutral-450 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="h-4 w-4" />
            {!selectedSize
              ? "Select Size to Add"
              : activeVariant && activeVariant.stockQuantity === 0
              ? "Out of Stock"
              : `Add to Bag • $${((activeVariant?.priceOverride ?? product.basePrice) * quantity).toFixed(2)}`}
          </button>
        </div>
      </div>

      {/* Micro-Badges Trust Segment */}
      <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-dashed border-neutral-150 text-[11px] text-neutral-500 text-center">
        <div className="flex flex-col items-center gap-1.5 px-1">
          <Truck className="h-4 w-4 text-kiwi shrink-0" />
          <span className="font-semibold text-neutral-800">Complimentary Shipping</span>
          <span>Orders over $150</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 px-1 border-x border-neutral-200">
          <RefreshCw className="h-4 w-4 text-kiwi shrink-0" />
          <span className="font-semibold text-neutral-800">Return & Exchange</span>
          <span>Easy 30-day window</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 px-1">
          <ShieldCheck className="h-4 w-4 text-kiwi shrink-0" />
          <span className="font-semibold text-neutral-800">Craft Warranty</span>
          <span>100% authenticated</span>
        </div>
      </div>

      {/* Accordion List Segment */}
      <div id="pdp-accordions-group" className="border-t border-neutral-150 pt-2 flex flex-col">
        {/* Accordion: Description */}
        <div className="border-b border-neutral-150/80">
          <button
            id="accordion-description-trigger"
            onClick={() => toggleSection("description")}
            className="w-full py-4 flex items-center justify-between text-left focus:outline-hidden"
          >
            <span className="text-sm font-semibold text-neutral-900 font-sans uppercase tracking-wider">
              Product Description
            </span>
            <span className="text-lg font-mono leading-none text-neutral-500">
              {activeSection === "description" ? "−" : "+"}
            </span>
          </button>
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              activeSection === "description" ? "max-h-60 pb-4 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <p className="text-xs leading-relaxed text-neutral-600">
              {product.description || "Indulge in our carefully designed, high-performance garment built to respond naturally to physical movement. Specially constructed with comfortable fabrics for all-day reliability."}
            </p>
          </div>
        </div>

        {/* Accordion: Materials */}
        <div className="border-b border-neutral-150/80">
          <button
            id="accordion-materials-trigger"
            onClick={() => toggleSection("materials")}
            className="w-full py-4 flex items-center justify-between text-left focus:outline-hidden"
          >
            <span className="text-sm font-semibold text-neutral-900 font-sans uppercase tracking-wider">
              Quality & Materials
            </span>
            <span className="text-lg font-mono leading-none text-neutral-500">
              {activeSection === "materials" ? "−" : "+"}
            </span>
          </button>
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              activeSection === "materials" ? "max-h-60 pb-4 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <ul className="text-xs leading-relaxed text-neutral-600 list-disc pl-4 space-y-1">
              <li>88% GOTS Certified Premium Organic Cotton, 12% Lycra</li>
              <li>Ethically spun, woven, and prepared in compliant facilities</li>
              <li>Satin-weave interior for an exceptionally smooth, skin-friendly feel</li>
              <li>Dyed using certified non-toxic, eco-conscious pigments</li>
            </ul>
          </div>
        </div>

        {/* Accordion: Shipping */}
        <div className="border-b border-neutral-150/80">
          <button
            id="accordion-shipping-trigger"
            onClick={() => toggleSection("shipping")}
            className="w-full py-4 flex items-center justify-between text-left focus:outline-hidden"
          >
            <span className="text-sm font-semibold text-neutral-900 font-sans uppercase tracking-wider">
              Shipping & Returns
            </span>
            <span className="text-lg font-mono leading-none text-neutral-500">
              {activeSection === "shipping" ? "−" : "+"}
            </span>
          </button>
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              activeSection === "shipping" ? "max-h-60 pb-4 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <p className="text-xs leading-relaxed text-neutral-600 space-y-1.5">
              <span>Standard standard home delivery: Free for all checkout baskets above $150. Shipped within 1-2 business days with discrete premium tracking.</span>
              <br className="mb-1" />
              <span>We offer returns and full-refund replacement within 30 days of receiving your packaged items in pristine original unworn condition.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
