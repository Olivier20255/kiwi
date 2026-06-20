import React, { useState } from "react";
import { Plus, Trash2, ArrowLeft, Image as ImageIcon, Sparkles, Check, AlertCircle, ShoppingBag, FolderOpen, Tag, Layers, RefreshCw } from "lucide-react";

interface CreateProductProps {
  onBack: () => void;
  onSuccess: () => void;
}

interface TempVariant {
  sku: string;
  color: string;
  size: string;
  priceOverride: string;
  stockQuantity: string;
}

export default function CreateProduct({ onBack, onSuccess }: CreateProductProps) {
  // Base details state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("180");
  const [categoryId, setCategoryId] = useState("cat-outerwear");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

  // Multi Image urls state
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1000", // Prepopulate 1 stunning sample
  ]);

  // Dynamic variants list
  const [variants, setVariants] = useState<TempVariant[]>([
    { sku: "KW-JKT-BRN-SM", color: "Cocoa Brown", size: "S", priceOverride: "", stockQuantity: "15" },
    { sku: "KW-JKT-BRN-MD", color: "Cocoa Brown", size: "M", priceOverride: "", stockQuantity: "25" },
    { sku: "KW-JKT-BLK-MD", color: "Core Jet Black", size: "M", priceOverride: "195", stockQuantity: "18" },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  // Handler to add image url to list
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    if (!imageUrlInput.startsWith("http://") && !imageUrlInput.startsWith("https://")) {
      setStatusMsg("Verify image link structures - URLs must begin with http:// or https://");
      setStatusType("error");
      return;
    }
    setImages([...images, imageUrlInput.trim()]);
    setImageUrlInput("");
    setStatusMsg("");
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  // Mock visual asset file attachment drag-drop dropping wrapper
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Simulate drop processing and auto generate high premium Unsplash placeholders to bypass asset uploads
    const sampleOptions = [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1000"
    ];
    const picked = sampleOptions[Math.floor(Math.random() * sampleOptions.length)];
    setImages([...images, picked]);
    setStatusMsg("File simulation processed successfully. Curated visual link injected.");
    setStatusType("success");
  };

  // Dynamic Variant Row actions
  const handleAddVariantRow = () => {
    setVariants([
      ...variants,
      { sku: "", color: "Noir Slate", size: "L", priceOverride: "", stockQuantity: "12" }
    ]);
  };

  const handleRemoveVariantRow = (index: number) => {
    if (variants.length <= 1) {
      setStatusMsg("Product specifications require at least one Active Variant dimension.");
      setStatusType("error");
      return;
    }
    setVariants(variants.filter((_, idx) => idx !== index));
    setStatusMsg("");
  };

  const handleVariantChange = (index: number, field: keyof TempVariant, val: string) => {
    const updated = [...variants];
    updated[index] = {
      ...updated[index],
      [field]: val,
    };
    setVariants(updated);
  };

  // Form submission server action integration
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setStatusMsg("The Product catalogue item requires a defined title.");
      setStatusType("error");
      return;
    }

    if (images.length === 0) {
      setStatusMsg("Please configure at least one active cover photo URL.");
      setStatusType("error");
      return;
    }

    setIsSubmitting(true);
    setStatusMsg("");
    setStatusType("");

    // Package payload
    const payload = {
      name,
      description,
      basePrice: Number(basePrice) || 150,
      categoryId,
      isFeatured,
      isArchived,
      images,
      variants: variants.map(v => ({
        sku: v.sku.trim(),
        color: v.color.trim() || "Multi-Colored",
        size: v.size.trim() || "OS",
        priceOverride: v.priceOverride ? Number(v.priceOverride) : undefined,
        stockQuantity: Number(v.stockQuantity) || 0,
      })),
    };

    try {
      const resp = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        throw new Error("Handshaking validation error from Kiwi CMS.");
      }

      const data = await resp.json();
      if (data.success) {
        setStatusMsg("Catalog specs stored. Redirecting back to inventory panels...");
        setStatusType("success");
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        throw new Error(data.message || "Unknown database error while storing SKU metadata.");
      }

    } catch (err: any) {
      console.error(err);
      setStatusMsg(err.message || "Server Action handshake failed. Retry typing the fields.");
      setStatusType("error");
      setIsSubmitting(false);
    }
  };

  return (
    <div id="create-product-container" className="max-w-4xl mx-auto space-y-8 p-1 animate-fade-in select-none">
      
      {/* Back to list controller */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors py-1.5 focus:outline-hidden"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Inventory Grid
        </button>
        <span className="text-[11px] font-mono uppercase text-neutral-400 tracking-wider">
          PRODUCT FORMULATION ENGINE (CMS)
        </span>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-lg flex items-start gap-2.5 text-xs ${
          statusType === "success" 
            ? "bg-green-50 text-green-800 border border-green-200" 
            : "bg-rose-50 text-rose-800 border border-rose-150"
        }`}>
          {statusType === "success" ? <Check className="h-4 w-4 shrink-0 mt-0.5" /> : <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />}
          <span>{statusMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmitForm} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Specifications Form (Col Span 7/8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Core parameters */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1.5 pb-2 border-b border-neutral-100">
              <Tag className="h-4 w-4 text-kiwi shrink-0" /> Core Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
              <div className="sm:col-span-2">
                <label className="block text-neutral-700 font-semibold mb-1">Catalog Title Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Minimalist Double-Lapel Wool trench coat"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded border border-neutral-250 bg-white focus:outline-hidden focus:border-dark focus:ring-1 focus:ring-dark"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Base Price ($)</label>
                <input
                  type="number"
                  required
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="w-full text-xs p-2.5 rounded border border-neutral-250 bg-white focus:outline-hidden focus:border-dark focus:ring-1 focus:ring-dark font-mono text-neutral-800 font-bold"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-neutral-700 font-semibold mb-1">Detailed Description Paragraph</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Elaborate on the aesthetic, sewing details, fabrication yarn density, source country information, and fitting attributes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-2.5 rounded border border-neutral-250 bg-white focus:outline-hidden focus:border-dark focus:ring-1 focus:ring-dark leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Image formulation area (Drag and Drop / links list) */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1.5 pb-2 border-b border-neutral-100">
              <ImageIcon className="h-4 w-4 text-kiwi shrink-0" /> Configure Visual Imagery
            </h3>

            <div className="space-y-4 text-xs font-sans">
              {/* Drag drop area */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-neutral-250 hover:border-dark hover:bg-neutral-50 rounded-lg p-5 text-center transition-all cursor-pointer select-none"
              >
                <FolderOpen className="h-7 w-7 text-neutral-300 mx-auto mb-1.5" />
                <p className="font-semibold text-neutral-700">Drag & Drop Fashion Images Here</p>
                <p className="text-[10px] text-neutral-400 mt-0.5 font-mono">// Drop file to trigger luxury mockup asset injection</p>
              </div>

              {/* URL paste mechanism */}
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Or append direct image links:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/... or relative/absolute path links"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="flex-1 text-xs p-2.5 rounded border border-neutral-250 bg-white focus:outline-hidden focus:border-dark focus:ring-1 focus:ring-dark"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="bg-neutral-900 text-white rounded px-4 text-xs font-semibold hover:bg-neutral-800 focus:outline-hidden"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* Grid of added visual assets */}
              {images.length > 0 && (
                <div className="space-y-1.5">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Configured Album list ({images.length})</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative rounded border border-neutral-200 overflow-hidden group h-24 bg-neutral-100">
                        <img src={img} alt="Product view" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                        <span className="absolute left-1.5 bottom-1.5 text-[9px] bg-dark/80 text-white px-1 py-0.2 rounded font-mono">
                          View {idx + 1}
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute right-1 top-1 bg-red-600 text-white rounded p-1 hover:bg-red-700 scale-0 group-hover:scale-100 transition-all select-none focus:outline-hidden duration-100"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Sub-variants formulation grid */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-kiwi shrink-0" /> Dynamic Variants Matrix
              </h3>
              <button
                type="button"
                onClick={handleAddVariantRow}
                className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-dark hover:text-kiwi-dark py-1"
              >
                <Plus className="h-3.5 w-3.5 text-kiwi strike-[3]" /> Add Variant Dimensions
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-sans text-left border-collapse min-w-[550px]">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200 font-bold text-neutral-500 font-mono text-[9px] uppercase tracking-wider">
                    <th className="p-2 pl-3">Unique SKU Prefix</th>
                    <th className="p-2">Color Specification</th>
                    <th className="p-2 text-center w-16">Size</th>
                    <th className="p-2 text-center w-24">Price Override ($)</th>
                    <th className="p-2 text-center w-20">Stock qty</th>
                    <th className="p-2 text-center w-8">Rem</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant, idx) => (
                    <tr key={idx} className="border-b border-neutral-100 hover:bg-neutral-50/45">
                      {/* SKU Input code */}
                      <td className="p-2 pl-3">
                        <input
                          type="text"
                          required
                          placeholder="e.g. KW-JKT-BRN"
                          value={variant.sku}
                          onChange={(e) => handleVariantChange(idx, "sku", e.target.value)}
                          className="w-full text-[11px] font-mono p-1 rounded border border-neutral-250 focus:outline-hidden focus:border-dark"
                        />
                      </td>

                      {/* Color Option parameter */}
                      <td className="p-2">
                        <input
                          type="text"
                          required
                          value={variant.color}
                          onChange={(e) => handleVariantChange(idx, "color", e.target.value)}
                          className="w-full text-xs p-1 rounded border border-neutral-250 focus:outline-hidden focus:border-dark"
                        />
                      </td>

                      {/* Size Parameter selection options */}
                      <td className="p-2">
                        <input
                          type="text"
                          required
                          value={variant.size}
                          onChange={(e) => handleVariantChange(idx, "size", e.target.value)}
                          className="w-full text-center font-mono text-[11px] p-1 rounded border border-neutral-250 focus:outline-hidden"
                        />
                      </td>

                      {/* Price Override Override value */}
                      <td className="p-2">
                        <input
                          type="number"
                          placeholder="Nil"
                          value={variant.priceOverride}
                          onChange={(e) => handleVariantChange(idx, "priceOverride", e.target.value)}
                          className="w-full text-center font-mono font-medium text-[11px] p-1 rounded border border-neutral-250 focus:outline-hidden"
                        />
                      </td>

                      {/* In-Stock Level */}
                      <td className="p-2">
                        <input
                          type="number"
                          required
                          value={variant.stockQuantity}
                          onChange={(e) => handleVariantChange(idx, "stockQuantity", e.target.value)}
                          className="w-full text-center font-mono text-[11px] p-1 rounded border border-neutral-250 focus:outline-hidden"
                        />
                      </td>

                      {/* Row Delete Button */}
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveVariantRow(idx)}
                          className="text-neutral-300 hover:text-red-600 rounded p-1.5 focus:outline-hidden transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Form: Meta & Settings Sidebar Controls (Col Span 5/4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-200 pb-2 flex gap-1 items-center">
              <Sparkles className="h-4 w-4 text-kiwi shrink-0 animate-bounce" /> Placement Presets
            </h3>

            {/* Category routing selection lists */}
            <div className="text-xs font-sans space-y-3">
              <div>
                <label className="block text-neutral-600 font-bold mb-1 uppercase text-[10px] tracking-wider">Placement Route Directory</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded border border-neutral-250 bg-white focus:outline-hidden focus:border-dark text-neutral-800 font-medium"
                >
                  <option value="cat-outerwear">Outerwear / Jackets</option>
                  <option value="cat-tops">Tops / Shirts</option>
                  <option value="cat-pants">Cargo & Denim Pants</option>
                  <option value="cat-boots">Surgical Boots</option>
                  <option value="cat-sneakers">Retro Sneakers</option>
                  <option value="cat-minibags">Handbags & Clutches</option>
                  <option value="cat-eyewear">Avant-Garde Eyewear</option>
                </select>
              </div>

              {/* Switches of isFeatured and archived toggle tags */}
              <div className="space-y-3 pt-3">
                <label className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 bg-white select-none cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="font-bold text-neutral-800 block text-[11px]">Feature Highlighting</span>
                    <span className="text-[10px] text-neutral-400 block font-normal leading-tight">Elevates item to home page featured sections index grids</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="h-4 w-4 text-dark focus:ring-dark border-neutral-300 rounded shrink-0 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border border-neutral-250 bg-white select-none cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="font-bold text-neutral-800 block text-[11px]">Direct Archive Flag</span>
                    <span className="text-[10px] text-neutral-400 block font-normal leading-tight">Temporarily blocks client sight while preserving SKU databases</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isArchived}
                    onChange={(e) => setIsArchived(e.target.checked)}
                    className="h-4 w-4 text-dark focus:ring-dark border-neutral-300 rounded shrink-0 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Action button triggers formulation compile */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-neutral-950 hover:bg-neutral-850 active:scale-98 text-white rounded-lg h-12 flex items-center justify-center gap-2 transition-all shadow font-sans font-bold uppercase tracking-wider text-xs disabled:bg-neutral-300 disabled:cursor-wait"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" /> Storing Product Matrix...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 text-kiwi stroke-[3]" /> Register To Live Catalogue
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
