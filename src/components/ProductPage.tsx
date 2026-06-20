import React, { useState, useMemo } from "react";
import { ArrowLeft, Star, MessageSquare, ClipboardCheck, Sparkles } from "lucide-react";
import { Product, Review } from "../types";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";

interface ProductPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onAddToCart: (product: Product, variantId: string, quantity: number) => void;
  onAddReview: (productId: string, rating: number, comment: string, reviewerName: string) => void;
  onOpenProduct: (product: Product) => void;
}

export default function ProductPage({
  product,
  allProducts,
  onBack,
  onAddToCart,
  onAddReview,
  onOpenProduct,
}: ProductPageProps) {
  // Review writing state
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Active color to highlight gallery image match
  const [activeColor, setActiveColor] = useState<string>("");

  // Filter gallery images that correspond to the selected color
  const filteredImages = useMemo(() => {
    if (!activeColor) return product.images;
    const colorImgs = product.images.filter((img) => {
      if (!img.altText) return false;
      return img.altText.toLowerCase().includes(activeColor.toLowerCase());
    });
    return colorImgs.length > 0 ? colorImgs : product.images;
  }, [product.images, activeColor]);

  // Find related products in same category (excluding current)
  const relatedProducts = useMemo(() => {
    return allProducts
      .filter((p) => p.categoryId === product.categoryId && p.id !== product.id && !p.isArchived)
      .slice(0, 4);
  }, [allProducts, product]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !comment.trim()) return;

    onAddReview(product.id, rating, comment, reviewerName);
    setReviewSuccess(true);
    setComment("");
    setReviewerName("");
    
    // Clear success banner after delay
    setTimeout(() => {
      setReviewSuccess(false);
    }, 5000);
  };

  const handleColorChange = (color: string) => {
    setActiveColor(color);
  };

  return (
    <div id="pdp-container" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in select-none">
      
      {/* Editorial Navigation Headers */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100">
        <button
          id="pdp-back-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors py-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Collections
        </button>

        <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
          DESIGN COORDINATES: {product.slug}
        </span>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
        
        {/* Left Hand: Gallery Module (Sticky) */}
        <div className="lg:col-span-7">
          <ProductGallery images={filteredImages} productName={product.name} />
        </div>

        {/* Right Hand: Action & Selection Panel */}
        <div className="lg:col-span-5">
          <ProductInfo
            product={product}
            onAddToCart={onAddToCart}
            onColorChange={handleColorChange}
          />
        </div>

      </div>

      {/* Deep-Dive Reviews Section */}
      <div id="pdp-reviews-section" className="mt-20 border-t border-neutral-100 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Write a Review Block */}
          <div className="lg:col-span-5">
            <h3 className="text-lg font-sans font-bold tracking-tight text-neutral-900 mb-2">
              Customer Experiences
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed mb-6">
              Our customers value design utility, pristine materials, and deliberate silhouette forms. Share your authentic styling experience.
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4 bg-neutral-50 p-5 rounded-lg border border-neutral-150">
              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-800 font-bold mb-1">
                Write a review
              </h4>

              {reviewSuccess && (
                <div className="p-3 bg-green-50 text-green-700 text-xs rounded border border-green-200 flex items-center gap-1.5 animate-pulse">
                  <ClipboardCheck className="h-4 w-4 shrink-0" />
                  <span>Review logged successfully! Thank you for the insight.</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Avery Stone"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded border border-neutral-350 bg-white focus:outline-hidden focus:ring-1 focus:ring-kiwi"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Rating Value</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          star <= rating ? "text-amber-500 fill-amber-500" : "text-neutral-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Observations</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share feedback regarding fitting, silhouette structure, cloth texture..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full text-xs p-2.5 rounded border border-neutral-350 bg-white focus:outline-hidden focus:ring-1 focus:ring-kiwi resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-dark text-white text-xs uppercase tracking-widest font-bold py-3 rounded-md hover:bg-neutral-800 transition"
              >
                Submit Feedback
              </button>
            </form>
          </div>

          {/* List of Existing Reviews */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-2">
              Verified Feedback ({product.reviews?.length || 0})
            </h4>

            {(!product.reviews || product.reviews.length === 0) ? (
              <div className="text-center py-12 bg-neutral-50/50 rounded-lg border border-dashed border-neutral-200">
                <MessageSquare className="h-6 w-6 text-neutral-300 mx-auto mb-2" />
                <p className="text-xs text-neutral-400">No reviews recorded yet. Be the first to leave an observation!</p>
              </div>
            ) : (
              <div className="space-y-6 divide-y divide-neutral-100 max-h-120 overflow-y-auto pr-2">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="pt-6 first:pt-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-neutral-900">{rev.userName}</span>
                        <span className="text-[10px] font-mono text-neutral-400">
                          {new Date(rev.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`h-3 w-3 fill-current ${
                              idx < rev.rating ? "text-amber-500" : "text-neutral-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed italic pr-4">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Suggested / Related Products Segment */}
      {relatedProducts.length > 0 && (
        <div id="pdp-related-products" className="mt-24 border-t border-neutral-100 pt-16">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-kiwi font-bold block mb-1">Coordinated Fits</span>
              <h3 className="text-xl font-sans font-bold tracking-tight text-neutral-900">
                Complete the Silhouette
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => {
              const primaryImage = p.images.find((img) => img.order === 0) || p.images[0];
              const uniqueColorsCount = Array.from(new Set(p.variants.map((v) => v.color))).length;

              return (
                <div
                  key={p.id}
                  onClick={() => onOpenProduct(p)}
                  className="group cursor-pointer flex flex-col gap-3 rounded-lg overflow-hidden border border-neutral-100/30 hover:border-neutral-100 p-2.5 transition-all hover:shadow-xs bg-white"
                >
                  <div className="relative aspect-[3/4] w-full bg-neutral-100 overflow-hidden rounded-md">
                    {p.isFeatured && (
                      <span className="absolute top-2.5 left-2.5 bg-neutral-950 text-white text-[9px] font-mono uppercase tracking-wider py-1 px-2.5 rounded-full z-10">
                        Editorial choice
                      </span>
                    )}
                    <img
                      src={primaryImage?.url || "https://via.placeholder.com/300x400"}
                      alt={p.name}
                      className="h-full w-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 group-hover:underline line-clamp-1">
                      {p.name}
                    </h4>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-xs font-mono font-semibold text-neutral-500">
                        ${p.basePrice.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {uniqueColorsCount} {uniqueColorsCount === 1 ? "color" : "colors"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
