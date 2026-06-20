import React, { useState, useEffect } from "react";
import { Sparkles, SlidersHorizontal, ArrowRight, Grid, Filter, CheckCircle } from "lucide-react";

// Types
import { Product, CartItem, Address, Category } from "./types";

// Data
import { CATEGORIES, PRODUCTS } from "./data";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProductCard from "./components/ProductCard";
import ProductPage from "./components/ProductPage";
import ProductDetailModal from "./components/ProductDetailModal";
import CartDrawer from "./components/CartDrawer";
import DashboardModal from "./components/DashboardModal";

// Zustand State Store
import { useCartStore } from "./useCartStore";

// Checkout Pages
import CheckoutPage from "./components/CheckoutPage";
import CheckoutGatewayFallback from "./components/CheckoutGatewayFallback";
import CheckoutSuccessPage from "./components/CheckoutSuccessPage";

// Admin layout
import AdminLayout from "./components/AdminLayout";

// Newsletter Pop-up
import NewsletterPopup from "./components/NewsletterPopup";

interface OrderLog {
  id: string;
  customerEmail: string;
  shippingAddress: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: Array<{
    productName: string;
    color: string;
    size: string;
    quantity: number;
    price: number;
  }>;
}

export default function App() {
  // --- STATE ---
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals / Slider / Drawer toggles
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // Zustand Cart Management with fully native persistence layers
  const {
    cartItems,
    isOpen: isCartOpen,
    openCart,
    closeCart,
    addItem: storeAddItem,
    updateQuantity: storeUpdateQuantity,
    removeItem: storeRemoveItem,
    clearCart: storeClearCart,
  } = useCartStore();

  // Route tracker
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // User Profile Addresses with client-side localStorage persistence
  const [addresses, setAddresses] = useState<Address[]>(() => {
    try {
      const saved = localStorage.getItem("kiwi_addresses");
      return saved && JSON.parse(saved).length > 0
        ? JSON.parse(saved)
        : [
            {
              id: "addr-1",
              street: "1024 Kimathi Street",
              city: "Nairobi",
              state: "Nairobi County",
              postalCode: "00100",
              country: "Kenya",
              phone: "+254 712 345 678",
              isDefault: true,
            },
          ];
    } catch {
      return [];
    }
  });

  const [userRole, setUserRole] = useState<"USER" | "ADMIN">("USER");

  // Order history logs with client-side persistence
  const [orderHistory, setOrderHistory] = useState<OrderLog[]>(() => {
    try {
      const saved = localStorage.getItem("kiwi_orders");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Action toast message system
  const [toastMessage, setToastMessage] = useState("");

  // --- PERSISTENCE SYNCHRONIZATION EFFECTS ---
  // Load products inventory list once on load with server data sync
  useEffect(() => {
    const initProducts = async () => {
      try {
        const resp = await fetch("/api/products");
        if (resp.ok) {
          const data = await resp.json();
          setProducts(data);
          localStorage.setItem("kiwi_inventory", JSON.stringify(data));
          return;
        }
      } catch (err) {
        console.warn("Products API load error, loading fallback catalog data:", err);
      }

      try {
        const savedProducts = localStorage.getItem("kiwi_inventory");
        if (savedProducts) {
          setProducts(JSON.parse(savedProducts));
        } else {
          setProducts(PRODUCTS);
          localStorage.setItem("kiwi_inventory", JSON.stringify(PRODUCTS));
        }
      } catch {
        setProducts(PRODUCTS);
      }
    };

    initProducts();
  }, []);

  const refreshProductsFromServer = async () => {
    try {
      const resp = await fetch("/api/products");
      if (resp.ok) {
        const data = await resp.json();
        setProducts(data);
        localStorage.setItem("kiwi_inventory", JSON.stringify(data));
      }
    } catch (e) {
      console.error("Failed to sync latest products list from database server:", e);
    }
  };

  // Sync addresses to storage on update
  useEffect(() => {
    localStorage.setItem("kiwi_addresses", JSON.stringify(addresses));
  }, [addresses]);

  // Sync orders to storage on update
  useEffect(() => {
    localStorage.setItem("kiwi_orders", JSON.stringify(orderHistory));
  }, [orderHistory]);

  // --- HASH ROUTING SYNC EFFECT (Phase 4 Slug Simulation & Link Support) ---
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const match = hash.match(/^#\/product\/([^/]+)/);
      if (match && match[1]) {
        const slug = match[1];
        const searchPool = products.length > 0 ? products : PRODUCTS;
        const targetProduct = searchPool.find((p) => p.slug === slug);
        if (targetProduct) {
          setActiveProduct(targetProduct);
        }
      } else if (hash === "" || hash === "#/" || !hash.includes("/product/")) {
        setActiveProduct(null);
      }
    };

    // Parse path once inventory data has been set 
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [products]);

  const setAndSyncActiveProduct = (product: Product | null) => {
    setActiveProduct(product);
    if (product) {
      window.location.hash = `#/product/${product.slug}`;
    } else {
      window.location.hash = "#/";
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3500);
  };

  // --- INVENTORY MANAGEMENT TRIGGERS (ADMIN CMS) ---
  const handleUpdateStock = async (variantId: string, newStock: number) => {
    const updated = products.map((p) => {
      const updatedVariants = p.variants.map((v) => {
        if (v.id === variantId) {
          return { ...v, stockQuantity: newStock };
        }
        return v;
      });
      return { ...p, variants: updatedVariants };
    });

    setProducts(updated);
    localStorage.setItem("kiwi_inventory", JSON.stringify(updated));

    // If detail modal is active, update activeProduct representation in state to reflect the stock instantly
    if (activeProduct) {
      const match = updated.find((up) => up.id === activeProduct.id);
      if (match) setActiveProduct(match);
    }

    try {
      await fetch(`/api/products/variants/${variantId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stockQuantity: newStock }),
      });
      showToast("Product stock synchronized successfully");
    } catch (e) {
      console.error("Failed to sync stock updates to database server API:", e);
      showToast("Updated locally, background sync failed");
    }
  };

  const handleAddProduct = (newP: {
    name: string;
    description: string;
    basePrice: number;
    categoryId: string;
    color: string;
    size: string;
    sku: string;
    stock: number;
    imageUrl: string;
  }) => {
    const newProductId = `prod-${Date.now()}`;
    const newVariantId = `v-${Date.now()}`;

    const createdProduct: Product = {
      id: newProductId,
      name: newP.name,
      slug: newP.name.toLowerCase().replace(/\s+/g, "-"),
      description: newP.description,
      basePrice: newP.basePrice,
      categoryId: newP.categoryId,
      isFeatured: false,
      isArchived: false,
      variants: [
        {
          id: newVariantId,
          productId: newProductId,
          sku: newP.sku,
          color: newP.color,
          size: newP.size,
          stockQuantity: newP.stock,
        },
      ],
      images: [
        {
          id: `img-${Date.now()}`,
          productId: newProductId,
          url: newP.imageUrl,
          altText: newP.name,
          order: 0,
        },
      ],
      reviews: [],
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updated = [createdProduct, ...products];
    setProducts(updated);
    localStorage.setItem("kiwi_inventory", JSON.stringify(updated));
    showToast(`Added ${newP.name} to store catalog`);
  };

  // --- CART OPERATIONS (Zustand Interfaced) ---
  const handleAddToCart = (product: Product, variantId: string, quantity: number) => {
    // Audit selected variant stock
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant || variant.stockQuantity < 1) {
      showToast("Requested variation is currently sold out.");
      return;
    }

    storeAddItem(product.id, variantId, quantity);
    showToast(`Added ${product.name} to shopping bag`);

    setActiveProduct(null); // Dismiss details modal for high-fidelity conversion flow
    openCart();             // Open bag drawer for confirmation
  };

  const handleUpdateCartQuantity = (variantId: string, quantity: number) => {
    // Cap quantity between 1 and available variant stock
    const cartItem = cartItems.find((ci) => ci.variantId === variantId);
    if (!cartItem) return;

    const product = products.find((p) => p.id === cartItem.productId);
    const variant = product?.variants.find((v) => v.id === variantId);
    if (!variant) return;

    if (quantity < 1) {
      handleRemoveItem(variantId);
      return;
    }

    const nextQty = Math.min(quantity, variant.stockQuantity);
    storeUpdateQuantity(variantId, nextQty);
  };

  const handleRemoveItem = (variantId: string) => {
    storeRemoveItem(variantId);
    showToast("Removed item from shopping bag");
  };

  // --- ADDRESS OPERATIONS ---
  const handleAddAddress = (newAddr: Omit<Address, "id">) => {
    const fresh: Address = {
      id: `addr-${Date.now()}`,
      ...newAddr,
    };
    
    // Set default if requested
    let updated = [...addresses];
    if (fresh.isDefault) {
      updated = updated.map((a) => ({ ...a, isDefault: false }));
    }
    updated.push(fresh);
    setAddresses(updated);
    showToast("Appended delivery coordinates successfully");
  };

  // --- CHECKOUT CONVERSION ---
  const handleCheckoutComplete = (
    customerEmail: string,
    shippingAddress: string,
    customerPhone: string
  ) => {
    // Snapshot state of line items representing current cart contents
    const listLines = cartItems.map((ci) => {
      const p = products.find((prod) => prod.id === ci.productId);
      const v = p?.variants.find((vari) => vari.id === ci.variantId);
      const price = v?.priceOverride ? Number(v.priceOverride) : p!.basePrice;

      return {
        productName: p!.name,
        color: v!.color,
        size: v!.size,
        quantity: ci.quantity,
        price,
      };
    });

    const calculatedSub = listLines.reduce((acc, current) => acc + current.price * current.quantity, 0);
    const shippingThreshold = 150;
    const isShippingFree = calculatedSub >= shippingThreshold;
    const shipping = isShippingFree ? 0.00 : 15.00;
    const tax = calculatedSub * 0.08;
    const finalAmount = calculatedSub + shipping + tax;

    // Create Order object in chronological lists
    const createdLog: OrderLog = {
      id: "KW-DEC-" + Math.floor(100000 + Math.random() * 900000),
      customerEmail,
      shippingAddress,
      totalAmount: finalAmount,
      status: "PAID",
      createdAt: new Date().toISOString().split("T")[0],
      items: listLines,
    };

    // Deduct stock from master product inventory
    const updatedInventory = products.map((p) => {
      const nextVariants = p.variants.map((v) => {
        const cartMatch = cartItems.find((ci) => ci.variantId === v.id);
        if (cartMatch) {
          const reStock = Math.max(0, v.stockQuantity - cartMatch.quantity);
          return { ...v, stockQuantity: reStock };
        }
        return v;
      });
      return { ...p, variants: nextVariants };
    });

    setProducts(updatedInventory);
    localStorage.setItem("kiwi_inventory", JSON.stringify(updatedInventory));

    setOrderHistory((prev) => [createdLog, ...prev]);
    storeClearCart(); // Clear cart items on completion
    showToast("Checkout logged, stock levels decremented");
  };

  // --- REVIEWS INJECTION ---
  const handleAddReview = (productId: string, rating: number, comment: string, reviewerName?: string) => {
    const updated = products.map((p) => {
      if (p.id === productId) {
        const key = `rev-${Date.now()}`;
        const freshReview = {
          id: key,
          productId,
          userId: "user-current",
          userName: reviewerName?.trim() || "Quenton Simiyu (You)",
          rating,
          comment,
          createdAt: new Date().toISOString().split("T")[0],
        };

        const updatedReviews = [freshReview, ...p.reviews];
        return {
          ...p,
          reviews: updatedReviews,
        };
      }
      return p;
    });

    setProducts(updated);
    localStorage.setItem("kiwi_inventory", JSON.stringify(updated));
    showToast("Thank you for your valuable feedback review");

    // Instantly sync active product in details popup
    if (activeProduct) {
      const match = updated.find((m) => m.id === activeProduct.id);
      if (match) setActiveProduct(match);
    }
  };

  // --- FILTERS MATH SEGMENT ---
  // Find which category items currently match options
  const filteredProducts = products.filter((p) => {
    // 1. Filter by category slug (recursively mapping child categories)
    if (selectedCategory) {
      const selectedCatObj = CATEGORIES.find(
        (c) => c.slug === selectedCategory || c.subcategories?.some((s) => s.slug === selectedCategory)
      );

      // Check if product is in selected parent category or selected subcategory
      const exactSub = CATEGORIES.flatMap((c) => c.subcategories || []).find((s) => s.slug === selectedCategory);
      if (exactSub) {
        if (p.categoryId !== exactSub.id) return false;
      } else if (selectedCatObj) {
        const childIds = selectedCatObj.subcategories?.map((s) => s.id) || [];
        const isMatchedParent = p.categoryId === selectedCatObj.id || childIds.includes(p.categoryId);
        if (!isMatchedParent) return false;
      }
    }

    // 2. Filter by Search Query (Product Name or Descriptions)
    if (searchQuery.trim()) {
      const lookup = searchQuery.toLowerCase();
      const inTitle = p.name.toLowerCase().includes(lookup);
      const inDesc = p.description.toLowerCase().includes(lookup);
      const inColor = p.variants.some((v) => v.color.toLowerCase().includes(lookup));
      if (!inTitle && !inDesc && !inColor) return false;
    }

    return !p.isArchived;
  });

  // Calculate cart total quantity count
  const cartTotalQty = cartItems.reduce((acc, ci) => acc + ci.quantity, 0);

  if (currentHash === "#/admin") {
    return (
      <div id="kiwi-applet-shell" className="relative flex min-h-screen flex-col bg-brand-cream selection:bg-kiwi selection:text-dark">
        {toastMessage && (
          <div id="app-toast-notif" className="fixed bottom-6 right-6 z-50 rounded bg-dark border border-neutral-800 text-kiwi py-3 px-4 text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-2 shadow-2xl animate-fade-in animate-bounce">
            <Sparkles className="h-4 w-4 text-kiwi animate-spin" />
            <span>{toastMessage}</span>
          </div>
        )}
        <AdminLayout
          products={products}
          onRefreshProducts={refreshProductsFromServer}
          userRole={userRole}
          onChangeRole={setUserRole}
          onExit={() => { window.location.hash = "#/"; }}
        />
      </div>
    );
  }

  return (
    <div id="kiwi-applet-shell" className="relative flex min-h-screen flex-col bg-brand-cream selection:bg-kiwi selection:text-dark">
      
      {/* Top Banner Promotional Bar */}
      <div id="promo-banner" className="bg-dark text-white text-[10px] tracking-widest font-mono uppercase text-center py-2 relative overflow-hidden select-none border-b border-neutral-900 flex justify-center items-center gap-2">
        <Sparkles className="h-3 w-3 text-kiwi animate-pulse" />
        <span>LIMITED DROP // SHIPMENT INSURED GLOBALLY OUT OF EU WAREHOUSES // TAX FREE checkout</span>
      </div>

      {/* Main Navigation bar */}
      <Navbar
        cartItemsCount={cartTotalQty}
        onCartOpen={openCart}
        onUserOpen={() => setIsDashboardOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          window.location.hash = "#/";
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q) window.location.hash = "#/";
        }}
      />

      {/* Primary Layout container */}
      <main className="flex-grow animate-fade-in">
        {currentHash.startsWith("#/checkout-success") ? (
          <CheckoutSuccessPage onBackToApp={() => { window.location.hash = "#/"; }} />
        ) : currentHash.startsWith("#/checkout-gateway-fallback") ? (
          <CheckoutGatewayFallback onCancel={() => { window.location.hash = "#/checkout"; }} />
        ) : currentHash === "#/checkout" ? (
          <CheckoutPage
            products={products}
            onBack={() => { window.location.hash = "#/"; }}
            onOrderPlaced={(orderId) => {
              window.location.hash = `#/checkout-success?orderId=${orderId}`;
            }}
          />
        ) : activeProduct ? (
          <ProductPage
            product={activeProduct}
            allProducts={products}
            onBack={() => setAndSyncActiveProduct(null)}
            onAddToCart={handleAddToCart}
            onAddReview={handleAddReview}
            onOpenProduct={setAndSyncActiveProduct}
          />
        ) : (
          <>
            {/* EDITORIAL HERO BANNER AREA (When no active product filter selection is made, show high fidelity branding) */}
            {!selectedCategory && !searchQuery && (
              <section id="editorial-hero" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
                <div className="relative rounded-lg overflow-hidden bg-neutral-900 aspect-[16/9] md:aspect-[21/9] flex items-center justify-center">
                  
                  {/* Immersive Dark Fashion Background Cover */}
                  <img
                    src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1500"
                    alt="Kiwi editorial fashion cover"
                    className="absolute inset-0 h-full w-full object-cover object-center opacity-65 select-none"
                    referrerPolicy="no-referrer"
                  />

                  {/* Parallax Vignette layer */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/40 to-black/10"></div>

                  {/* Landing Visual Headers */}
                  <div className="relative text-center max-w-2xl px-6 space-y-4">
                    <span className="text-[10px] text-kiwi font-mono tracking-widest uppercase font-bold text-shadow">
                      VOL 26 // COMPLIMENTARY SHAPES
                    </span>
                    <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal italic tracking-tight leading-tight">
                      Elevated <span className="font-sans font-black tracking-normal uppercase not-italic">Uniforms</span>
                    </h1>
                    <p className="text-sm text-neutral-300 font-light leading-relaxed max-w-lg mx-auto">
                      Invest in wardrobe essentials detailed with robust geometric cuts, high weight cotton French terrys, and Command soles.
                    </p>
                    
                    <div className="pt-3 flex justify-center gap-3">
                      <button
                        onClick={() => setSelectedCategory("outerwear")}
                        className="rounded bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-dark hover:bg-kiwi transition-colors"
                      >
                        Examine Outerwear
                      </button>
                      <button
                        onClick={() => setSelectedCategory("mini-bags")}
                        className="rounded border border-white/40 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white hover:text-dark transition-all"
                      >
                        Explore Bags Catalog
                      </button>
                    </div>
                  </div>

                  {/* Quick specs footnote */}
                  <div className="absolute bottom-4 right-4 text-[9px] font-mono text-neutral-400 select-none hidden sm:block">
                    KIWI © 1/26 COLLECTION DEFILE — ALL RIGHTS PROTECTED
                  </div>
                </div>
              </section>
            )}

            {/* CLOTHING CATALOG LISTINGS / GRID SEGMENT */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 space-y-8">
              
              {/* Section Titles / Search summaries */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-4 border-b border-neutral-150 pb-4">
                <div>
                  <h2 className="font-display font-black text-xl sm:text-2xl uppercase tracking-wider text-dark">
                    {selectedCategory ? `${selectedCategory.replace("-", " ")}` : "Core Apparel Collection"}
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    {searchQuery
                      ? `Found ${filteredProducts.length} items matching lookup`
                      : `Reviewing ${filteredProducts.length} curated fashion items.`
                    }
                  </p>
                </div>

                {/* In-view quick subcategory tags selectors */}
                <div className="flex flex-wrap gap-1.5 font-sans">
                  <button
                    id="filter-all-btn"
                    onClick={() => setSelectedCategory(null)}
                    className={`rounded px-3 py-1 text-xs font-semibold ${
                      selectedCategory === null ? "bg-dark text-white ring-1 ring-kiwi" : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    All
                  </button>
                  {CATEGORIES.flatMap((c) => [{ slug: c.slug, name: c.name }, ...(c.subcategories?.map(s => ({ slug: s.slug, name: s.name })) || [])]).map((tag) => (
                    <button
                      key={tag.slug}
                      id={`filter-tag-${tag.slug}`}
                      onClick={() => setSelectedCategory(tag.slug)}
                      className={`rounded px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                        selectedCategory === tag.slug ? "bg-dark text-white ring-1 ring-kiwi" : "bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-400"
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* ACTIVE SEARCH ALERTS CHIPS */}
              {searchQuery && (
                <div className="flex items-center gap-2 rounded bg-neutral-100 p-3 text-xs text-neutral-600 animate-fade-in justify-between">
                  <span>Currently looking for: <strong className="text-dark">"{searchQuery}"</strong></span>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-xs font-bold text-rose-500 hover:underline"
                  >
                    Clear Search
                  </button>
                </div>
              )}

              {/* CATALOG PRODUCTS GRID */}
              {filteredProducts.length === 0 ? (
                /* No search mismatch view */
                <div id="no-products-view" className="text-center py-24 bg-white rounded-md border border-neutral-100 select-none">
                  <SlidersHorizontal className="mx-auto h-8 w-8 text-neutral-400 mb-3" />
                  <h3 className="font-display font-bold text-sm text-dark uppercase tracking-wider">No style coordinates found</h3>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1 leading-relaxed">
                    Adjust your filters or query string. Try searching for common colors like "Black", "Olive", or search specific categories.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSearchQuery("");
                    }}
                    className="mt-4 rounded bg-dark py-2 px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition"
                  >
                    Reset Visual Filters
                  </button>
                </div>
              ) : (
                <div id="products-listing-grid" className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                  {filteredProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onOpenDetails={setAndSyncActiveProduct}
                      onQuickAdd={(item, varId) => handleAddToCart(item, varId, 1)}
                    />
                  ))}
                </div>
              )}

            </section>
          </>
        )}
      </main>

      {/* FOOTER */}
      <Footer />

      {/* --- FLOATING TOAST FEEDBACK ANNOUNCEMENT --- */}
      {toastMessage && (
        <div id="live-toast" className="fixed bottom-6 right-6 z-50 rounded-lg bg-dark px-4 py-3 text-white text-xs tracking-wide shadow-2xl flex items-center gap-2.5 animate-slide-up border border-neutral-700">
          <CheckCircle className="h-4 w-4 text-kiwi shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* --- CART DRAWER OVERLAY --- */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        cartItems={cartItems}
        products={products}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckoutComplete={handleCheckoutComplete}
      />

      {/* --- CUSTOMER SUITE & ADMIN PANEL MODAL --- */}
      <DashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        userRole={userRole}
        onChangeRole={setUserRole}
        addresses={addresses}
        onAddAddress={handleAddAddress}
        orderHistory={orderHistory}
        products={products}
        onUpdateStock={handleUpdateStock}
        onAddProduct={handleAddProduct}
      />

      {/* --- RETENTION NEWSLETTER POPUP --- */}
      <NewsletterPopup />

    </div>
  );
}
