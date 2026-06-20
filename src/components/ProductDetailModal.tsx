import React, { useState, useEffect } from "react";
import { X, Star, ShoppingBag, ArrowRight, ShieldCheck, Heart, Truck, AlertTriangle } from "lucide-react";
import { Product, ProductVariant, Review } from "../types";

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, variantId: string, quantity: number) => void;
  onAddReview: (productId: string, rating: number, comment: string) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onAddReview
}: ProductDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");
  
  // Custom states for review submission
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Extract unique available values
  const uniqueColors = Array.from(new Set(product.variants.map((v) => v.color)));
  const uniqueSizes = Array.from(new Set(product.variants.map((v) => v.size)));

  // Autofill first selections
  useEffect(() => {
    if (uniqueColors.length > 0) setSelectedColor(uniqueColors[0]);
    if (uniqueSizes.length > 0) setSelectedSize(uniqueSizes[0]);
  }, [product]);

  // Find variant matching active color and size
  const activeVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  // Determine actual display price (using variant priceOverride if present)
  const displayPrice = activeVariant?.priceOverride
    ? Number(activeVariant.priceOverride)
    : product.basePrice;

  const totalStock = activeVariant?.stockQuantity ?? 0;

  // Re-bound quantity based on stock
  useEffect(() => {
    if (quantity > totalStock && totalStock > 0) {
      setQuantity(totalStock);
    } else if (quantity < 1) {
      setQuantity(1);
    }
  }, [selectedColor, selectedSize, totalStock]);

  const handleAddToCart = () => {
    if (!activeVariant) return;
    onAddToCart(product, activeVariant.id, quantity);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess(false);

    if (reviewRating < 1 || reviewRating > 5) {
      setReviewError("Please provide a rating between 1 and 5.");
      return;
    }

    onAddReview(product.id, reviewRating, reviewComment);
    setReviewSuccess(true);
    setReviewComment("");
    setReviewRating(5);
  };

  return (
    <div id="product-detail-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div id="product-modal-container" className="relative w-full max-w-5xl rounded-lg bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Close button */}
        <button
          id="close-modal-btn"
          onClick={onClose}
          className="absolute right-4 top-4 z-50 rounded-full bg-white/80 p-2 text-neutral-500 hover:text-dark hover:bg-white border border-neutral-100 shadow transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Column Left: Visual Studio Carousel */}
        <div className="w-full md:w-1/2 bg-neutral-50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-100 overflow-y-auto max-h-[50vh] md:max-h-[90vh]">
          <div className="relative aspect-[3/4] w-full rounded-md bg-white overflow-hidden shadow-inner">
            <img
              id="carousel-main-img"
              src={product.images[activeImageIndex]?.url || product.images[0]?.url}
              alt={product.images[activeImageIndex]?.altText || product.name}
              className="h-full w-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Thumbnails list */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 justify-center">
            {product.images.map((img, idx) => (
              <button
                key={img.id}
                id={`thumb-${idx}`}
                onClick={() => setActiveImageIndex(idx)}
                className={`h-16 w-12 rounded border overflow-hidden bg-white transition-all ${
                  idx === activeImageIndex ? "border-dark ring-2 ring-kiwi scale-105" : "border-neutral-200 opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img.url} alt="thumbnail" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Column Right: Custom Sizing/Purchasing Suite */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col overflow-y-auto max-h-[70vh] md:max-h-[90vh] justify-between">
          <div>
            {/* Breadcrumb / Category Tag */}
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
              Kiwi Collection / {product.categoryId.replace("cat-", "")}
            </span>

            {/* Title */}
            <h2 id="modal-product-title" className="text-xl sm:text-2xl font-display font-medium text-dark tracking-tight mt-1 mb-3">
              {product.name}
            </h2>

            {/* Star ratings details */}
            {product.reviews.length > 0 && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length)
                          ? "fill-amber-400"
                          : "text-neutral-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-neutral-700">
                  {(product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)} / 5.0
                </span>
                <span className="text-xs text-neutral-400">• ({product.reviews.length} Client Reviews)</span>
              </div>
            )}

            {/* Display Price & Variant override indicators */}
            <div className="flex items-baseline gap-3 mb-6">
              <span id="modal-current-price" className="font-mono text-2xl font-semibold text-neutral-900">
                ${displayPrice.toFixed(2)}
              </span>
              {activeVariant?.priceOverride && (
                <span className="font-mono text-xs text-neutral-400 line-through">
                  ${product.basePrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Variant Selector swatches: Color */}
            <div className="mb-5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Select Color: <span className="text-neutral-900 normal-case font-medium">{selectedColor}</span>
              </label>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {uniqueColors.map((color) => {
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      id={`color-swatch-${color.replace(/\s+/g, "-")}`}
                      onClick={() => setSelectedColor(color)}
                      className={`rounded-md border px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                        isSelected
                          ? "border-dark bg-dark text-white shadow-sm ring-1 ring-kiwi"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Variant Selector swatches: Size */}
            <div className="mb-6">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Select Size: <span className="text-neutral-900 font-mono font-medium">{selectedSize}</span>
              </label>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {uniqueSizes.map((size) => {
                  const isSelected = selectedSize === size;
                  // Check if color+size combo exists in variants
                  const combo = product.variants.find((v) => v.color === selectedColor && v.size === size);
                  const isAvailable = combo && combo.stockQuantity > 0;
                  
                  return (
                    <button
                      key={size}
                      id={`size-swatch-${size}`}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={`min-w-10 rounded-md border py-2 px-3 text-xs font-mono font-bold transition-all ${
                        isSelected
                          ? "border-dark bg-dark text-white ring-1 ring-kiwi"
                          : isAvailable
                            ? "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                            : "border-neutral-100 bg-neutral-100 text-neutral-300 cursor-not-allowed line-through"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Stock Indicators / Warning Alert */}
            <div className="mb-6">
              {totalStock > 0 ? (
                <div className={`flex items-center gap-2 rounded-md py-2 px-3 text-xs ${
                  totalStock <= 5 ? "bg-amber-50 text-amber-800" : "bg-neutral-50 text-neutral-600"
                }`}>
                  {totalStock <= 5 ? (
                    <>
                      <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                      <span className="font-semibold">Extreme Demand: Only {totalStock} units available in stock.</span>
                    </>
                  ) : (
                    <>
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Item color/size combination active. In-stock & ready to pack.</span>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-md bg-rose-50 p-2.5 text-xs text-rose-800">
                  <X className="h-4 w-4 text-rose-500 shrink-0" />
                  <span className="font-bold">This variation is out of stock. Select another color or size to buy.</span>
                </div>
              )}
            </div>

            {/* Tabs details / reviews */}
            <div className="border-b border-neutral-200 mb-5">
              <div className="flex gap-4">
                <button
                  id="tab-btn-details"
                  onClick={() => setActiveTab("details")}
                  className={`pb-2.5 text-xs uppercase tracking-widest font-bold border-b-2 transition-all ${
                    activeTab === "details" ? "border-dark text-dark" : "border-transparent text-neutral-400"
                  }`}
                >
                  Description
                </button>
                <button
                  id="tab-btn-reviews"
                  onClick={() => setActiveTab("reviews")}
                  className={`pb-2.5 text-xs uppercase tracking-widest font-bold border-b-2 transition-all ${
                    activeTab === "reviews" ? "border-dark text-dark" : "border-transparent text-neutral-400"
                  }`}
                >
                  Reviews ({product.reviews.length})
                </button>
              </div>
            </div>

            {/* Tab content area */}
            <div className="min-h-[140px] mb-6">
              {activeTab === "details" ? (
                <div className="space-y-4">
                  <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                    {product.description}
                  </p>
                  <ul className="grid grid-cols-2 gap-y-2 text-xs text-neutral-500 font-sans border-t border-neutral-100 pt-3">
                    <li><strong className="text-neutral-700">SKU:</strong> {activeVariant?.sku || "N/A"}</li>
                    <li><strong className="text-neutral-700">Craftsmanship:</strong> European finished</li>
                    <li><strong className="text-neutral-700">Material Blend:</strong> Grade-A selection</li>
                    <li><strong className="text-neutral-700">Drape Index:</strong> Elevated Structural</li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Client Reviews Feed */}
                  <div className="max-h-[180px] overflow-y-auto space-y-3.5 pr-2">
                    {product.reviews.length === 0 ? (
                      <p className="text-xs text-neutral-400 italic">No reviews received for this product yet. Be the first to add!</p>
                    ) : (
                      product.reviews.map((rev) => (
                        <div key={rev.id} className="rounded-md bg-neutral-50 p-3 text-xs border border-neutral-100">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-neutral-800">{rev.userName}</span>
                            <span className="text-neutral-400 text-[10px] font-mono">{rev.createdAt}</span>
                          </div>
                          <div className="flex text-amber-400 mb-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < rev.rating ? "fill-amber-400" : "text-neutral-200"}`} />
                            ))}
                          </div>
                          <p className="text-neutral-600 leading-relaxed">{rev.comment}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Submit review interactive block */}
                  <form onSubmit={handleReviewSubmit} className="mt-5 border-t border-neutral-100 pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">Write transparent product review</h4>
                    
                    {reviewSuccess && (
                      <div className="mb-3 text-[11px] text-emerald-600 bg-emerald-50 py-1.5 px-2.5 rounded">
                        Review received successfully! Added to client logs.
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-neutral-400">Rating:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="text-amber-400 hover:scale-110 focus:outline-none"
                          >
                            <Star className={`h-4 w-4 ${star <= reviewRating ? "fill-amber-400" : "text-neutral-200"}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your review comment..."
                        className="flex-1 rounded border border-neutral-200 py-1.5 px-3 text-xs focus:outline-none focus:border-dark"
                      />
                      <button
                        type="submit"
                        className="rounded bg-dark text-white text-xs font-bold px-4 py-1.5 hover:bg-neutral-800 transition-colors"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Sizing Advisory / Shipping Promo segment */}
          <div className="border-t border-neutral-100 pt-4 text-xs space-y-2.5 text-neutral-500 mb-4">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-dark" />
              <span>Complimentary insured shipping over $150. Delivery within 2-4 business days.</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-dark" />
              <span>Full original packaging. Zero friction exchanges. Securing authentic fashion.</span>
            </div>
          </div>

          {/* Row Bottom: Quantity and Master call to Action */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-neutral-200 rounded-md">
              <button
                id="dec-qty-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1 || totalStock === 0}
                className="px-3.5 py-2.5 text-neutral-500 hover:text-dark disabled:opacity-30"
              >
                -
              </button>
              <span id="quantity-display" className="w-8 text-center text-sm font-semibold font-mono font-medium text-neutral-900">
                {quantity}
              </span>
              <button
                id="inc-qty-btn"
                onClick={() => setQuantity(Math.min(totalStock, quantity + 1))}
                disabled={quantity >= totalStock || totalStock === 0}
                className="px-3.5 py-2.5 text-neutral-500 hover:text-dark disabled:opacity-30"
              >
                +
              </button>
            </div>

            <button
              id="add-to-cart-master-btn"
              onClick={handleAddToCart}
              disabled={totalStock === 0}
              className="flex-1 flex items-center justify-center gap-2 rounded-md bg-dark py-3.5 px-6 text-sm font-bold uppercase tracking-wider text-white hover:bg-neutral-800 focus:outline-none select-none transition-colors duration-200 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="h-4 w-4 text-kiwi" /> Add to Shopping Bag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
