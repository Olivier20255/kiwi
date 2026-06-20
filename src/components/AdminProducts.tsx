import React, { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, ToggleLeft, ToggleRight, Sparkles, Archive, Plus, Trash, Eye, ShieldAlert, BadgeAlert, Coins } from "lucide-react";
import { Product } from "../types";

interface AdminProductsProps {
  products: Product[];
  onRefreshProducts: () => void;
  onNavigateToCreate: () => void;
}

export default function AdminProducts({ products, onRefreshProducts, onNavigateToCreate }: AdminProductsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);

  // Search filter
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSlug = p.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = p.categoryId.toLowerCase().includes(searchQuery.toLowerCase());
      return matchName || matchSlug || matchCategory;
    });
  }, [products, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Synchronize pagination values if query shifts
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, itemsPerPage]);

  // Server actions (mutations via API route handlers)
  const handleToggleArchive = async (product: Product) => {
    setIsUpdatingId(product.id);
    try {
      const resp = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: !product.isArchived }),
      });
      if (resp.ok) {
        onRefreshProducts();
      }
    } catch (e) {
      console.error("Archive mutation error:", e);
    } finally {
      setIsUpdatingId(null);
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    setIsUpdatingId(product.id);
    try {
      const resp = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !product.isFeatured }),
      });
      if (resp.ok) {
        onRefreshProducts();
      }
    } catch (e) {
      console.error("Featured mutation error:", e);
    } finally {
      setIsUpdatingId(null);
    }
  };

  return (
    <div id="admin-products-container" className="space-y-6">
      
      {/* Search and Insert Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
        {/* Search input tool */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search catalog index (Title, category or handle SKU...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-3 bg-neutral-50 rounded-lg border border-neutral-250 focus:border-dark focus:bg-white focus:outline-hidden"
          />
        </div>

        <div className="flex gap-2.5">
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="text-xs px-3 py-2 bg-white border border-neutral-250 rounded-lg focus:outline-hidden focus:border-dark font-sans"
          >
            <option value={5}>Show 5 Items</option>
            <option value={10}>Show 10 Items</option>
            <option value={20}>Show 20 Items</option>
          </select>

          <button
            onClick={onNavigateToCreate}
            className="rounded-lg bg-neutral-950 font-sans hover:bg-neutral-850 text-white font-bold py-2.5 px-4 text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-98 transition-all"
          >
            <Plus className="h-4 w-4 text-kiwi stroke-[2.5]" /> Create Fit SKU
          </button>
        </div>
      </div>

      {/* Primary Data table layout */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs font-sans">
            <thead>
              <tr className="bg-neutral-50/70 border-b border-neutral-250 text-neutral-450 uppercase text-[10px] tracking-widest font-bold">
                <th className="p-4 pl-6">Collection Cover</th>
                <th className="p-4">Specs Title & Slug</th>
                <th className="p-4">Base Price</th>
                <th className="p-4 text-center">Variants count</th>
                <th className="p-4 text-center">Total Inventory</th>
                <th className="p-4 text-right">Statuses & Mutations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-neutral-400 italic">
                    No products compiled in this index slice search. Try again.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const displayImage = p.images[0]?.url || "https://photo.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800";
                  
                  // Calculate cumulative stock
                  const aggregateStock = p.variants.reduce((acc, curr) => acc + curr.stockQuantity, 0);

                  return (
                    <tr key={p.id} className="hover:bg-neutral-55/40 transition-colors">
                      {/* Thumbnail Cover */}
                      <td className="p-4 pl-6">
                        <div className="h-14 w-11 rounded border border-neutral-200 bg-neutral-50 overflow-hidden shrink-0">
                          <img
                            src={displayImage}
                            alt={p.name}
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </td>

                      {/* Info & Category code */}
                      <td className="p-4">
                        <h4 className="font-bold text-neutral-900 text-sm line-clamp-1">{p.name}</h4>
                        <div className="flex gap-2 items-center mt-1 text-[10px] uppercase font-mono tracking-wider text-neutral-400">
                          <span className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-600 font-medium">
                            {p.categoryId.replace("cat-", "")}
                          </span>
                          <span>/ {p.slug}</span>
                        </div>
                      </td>

                      {/* Pricing Tag */}
                      <td className="p-4 font-mono font-bold text-neutral-800 text-xs">
                        ${p.basePrice.toFixed(2)}
                      </td>

                      {/* Variant counting */}
                      <td className="p-4 text-center font-semibold font-mono text-neutral-600">
                        {p.variants.length} SKU{p.variants.length !== 1 && "s"}
                      </td>

                      {/* Aggregate stock levels */}
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1 font-mono text-xs font-bold px-2 py-0.5 rounded-full ${
                          aggregateStock === 0
                            ? "bg-rose-50 text-rose-700 border border-rose-100"
                            : aggregateStock <= 10
                              ? "bg-amber-50 text-amber-700 border border-amber-150"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        }`}>
                          {aggregateStock} items
                        </span>
                      </td>

                      {/* Live Actions and status toggle triggers */}
                      <td className="p-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          
                          {/* Featured toggle action */}
                          <button
                            onClick={() => handleToggleFeatured(p)}
                            disabled={isUpdatingId === p.id}
                            className={`p-1.5 rounded-md border text-xs flex items-center gap-1 transition-all ${
                              p.isFeatured
                                ? "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                                : "bg-neutral-50 text-neutral-400 border-neutral-200 hover:text-neutral-700"
                            }`}
                            title="Toggle Featured Highlights"
                          >
                            <Sparkles className={`h-3.5 w-3.5 ${p.isFeatured ? "fill-amber-400 text-amber-600" : ""}`} />
                            <span className="hidden md:inline uppercase tracking-widest text-[9px] font-bold">
                              {p.isFeatured ? "Featured" : "Regular"}
                            </span>
                          </button>

                          {/* Archiving Toggle Action */}
                          <button
                            onClick={() => handleToggleArchive(p)}
                            disabled={isUpdatingId === p.id}
                            className={`p-1.5 rounded-md border text-xs flex items-center gap-1 transition-all ${
                              p.isArchived
                                ? "bg-red-50 text-red-800 border-red-200 hover:bg-red-100"
                                : "bg-neutral-50 text-neutral-400 border-neutral-200 hover:text-neutral-700"
                            }`}
                            title="Toggle Catalog Archiving"
                          >
                            <Archive className="h-3.5 w-3.5" />
                            <span className="hidden md:inline uppercase tracking-widest text-[9px] font-bold">
                              {p.isArchived ? "Archived" : "Visible"}
                            </span>
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer dynamic pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-neutral-100 bg-neutral-50/50">
            <span className="text-[11px] font-mono text-neutral-400 font-semibold uppercase tracking-wider">
              Showing page {currentPage} of {totalPages}
            </span>

            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 px-2.5 rounded border border-neutral-200 hover:bg-neutral-150 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer font-sans"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 px-2.5 rounded border border-neutral-200 hover:bg-neutral-150 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer font-sans"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
