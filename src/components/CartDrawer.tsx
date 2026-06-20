import React, { useState } from "react";
import { X, Trash2, Plus, Minus, CreditCard, ShoppingBag, Check, ArrowRight, TrendingUp } from "lucide-react";
import { Product, CartItem, ProductVariant } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  products: Product[];
  onUpdateQuantity: (variantId: string, quantity: number) => void;
  onRemoveItem: (variantId: string) => void;
  onCheckoutComplete: (customerEmail: string, shippingAddress: string, customerPhone: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  products,
  onUpdateQuantity,
  onRemoveItem,
  onCheckoutComplete,
}: CartDrawerProps) {
  const [checkoutMode, setCheckoutMode] = useState(false);
  
  // Checkout Fields
  const [shippingName, setShippingName] = useState("Quenton Simiyu");
  const [customerEmail, setCustomerEmail] = useState("quentonsimiyu254@gmail.com");
  const [shippingAddress, setShippingAddress] = useState("1024 Kimathi Street, Nairobi, Kenya");
  const [customerPhone, setCustomerPhone] = useState("+254 712 345 678");
  const [billingSame, setBillingSame] = useState(true);
  const [isPlacing, setIsPlacing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState("");

  if (!isOpen) return null;

  // Resolve Cart Details (combining quantity with item info)
  const resolvedItems = cartItems.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    const variant = product?.variants.find((v) => v.id === item.variantId);
    return {
      item,
      product,
      variant,
    };
  }).filter(data => data.product && data.variant);

  // Compute Prices
  const subtotal = resolvedItems.reduce((acc, current) => {
    const price = current.variant?.priceOverride ? Number(current.variant.priceOverride) : current.product!.basePrice;
    return acc + price * current.item.quantity;
  }, 0);

  const shippingThreshold = 150;
  const isShippingFree = subtotal >= shippingThreshold;
  const shippingCost = subtotal > 0 ? (isShippingFree ? 0.00 : 15.00) : 0.00;
  const taxCost = subtotal * 0.08; // 8% flat est luxury VAT
  const grandTotal = subtotal + shippingCost + taxCost;

  const progressPercent = Math.min((subtotal / shippingThreshold) * 100, 100);
  const remainingForFree = shippingThreshold - subtotal;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resolvedItems.length === 0) return;

    setIsPlacing(true);
    
    // Simulate API checkout process
    setTimeout(() => {
      const generatedNo = "KIWI-" + Math.floor(100000 + Math.random() * 900000);
      setCreatedOrderNumber(generatedNo);
      setIsPlacing(false);
      setIsSuccess(true);
      
      // Dispatch order to overall customer lists
      onCheckoutComplete(
        customerEmail,
        `${shippingName}, ${shippingAddress}`,
        customerPhone
      );
    }, 1800);
  };

  const handleResetSuccess = () => {
    setIsSuccess(false);
    setCheckoutMode(false);
    onClose();
  };

  return (
    <div id="cart-drawer-overlay" className="fixed inset-0 z-50 flex justify-end bg-black/60 p-0 backdrop-blur-xs">
      {/* Outer Click Closer */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>
      
      {/* Drawer panel content */}
      <div id="cart-drawer-container" className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-slide-left z-10">
        
        {/* Header segment */}
        <div className="flex items-center justify-between border-b border-neutral-100 p-5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-dark" />
            <h3 className="font-display font-bold text-base uppercase text-dark">
              Shopping Bag ({resolvedItems.length})
            </h3>
          </div>
          <button
            id="close-cart-btn"
            onClick={onClose}
            className="rounded-full p-1.5 text-neutral-400 hover:text-dark hover:bg-neutral-50 transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Conditional visual state blocks */}
        {isSuccess ? (
          /* Order success notification slip */
          <div id="checkout-success-panel" className="flex flex-1 flex-col items-center justify-center p-8 text-center bg-white space-y-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-kiwi text-dark animate-bounce shadow">
              <Check className="h-8 w-8 stroke-[3]" />
            </div>
            
            <div className="space-y-2">
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                PAYMENT CONFIRMED
              </span>
              <h4 className="text-xl font-display font-medium text-dark tracking-tight">
                Order Received successfully
              </h4>
              <p className="text-sm font-mono text-neutral-500">
                Receipt Number: <strong className="text-dark font-semibold">{createdOrderNumber}</strong>
              </p>
            </div>

            <p className="text-sm text-neutral-600 max-w-xs leading-relaxed">
              We have secure-routed your invoice details to <span className="font-semibold text-dark">{customerEmail}</span>. Our distribution hub is packing your curated items.
            </p>

            <div className="rounded-md bg-neutral-50 border border-neutral-100 p-4 text-xs text-left w-full space-y-1 text-neutral-500 select-none">
              <p><strong className="text-neutral-700">Client:</strong> {shippingName}</p>
              <p><strong className="text-neutral-700">Hub Routing:</strong> {shippingAddress}</p>
              <p><strong className="text-neutral-700">Gateway Secure API:</strong> STRIPE / PAYSTACK PROXY</p>
            </div>

            <button
              id="success-dismiss-btn"
              onClick={handleResetSuccess}
              className="w-full rounded-md bg-dark py-3.5 text-sm font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors"
            >
              Continue Styling
            </button>
          </div>
        ) : (
          /* Cart items or Checkout interactive segment */
          <>
            {/* Free shipping shipping utility indicator */}
            {!checkoutMode && resolvedItems.length > 0 && (
              <div id="shipping-progress-box" className="bg-neutral-50 border-b border-neutral-100 p-4 font-sans text-xs">
                {isShippingFree ? (
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">✓</span>
                    <span>Complimentary express courier shipping applied!</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-neutral-600">
                      <span>Add <strong className="text-dark font-semibold font-mono">${remainingForFree.toFixed(2)}</strong> for free delivery</span>
                      <span className="font-bold text-dark">{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-neutral-200 overflow-hidden">
                      <div className="h-full bg-kiwi transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Inner dynamic view scroll container */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {resolvedItems.length === 0 ? (
                /* Empty bag warning layout */
                <div id="empty-cart-view" className="flex h-full flex-col items-center justify-center text-center space-y-4 select-none">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-neutral-50 border border-neutral-100 text-neutral-400">
                    <ShoppingBag className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-kiwi text-[9px] font-medium text-dark font-bold">0</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-dark">Your bag is empty</h4>
                    <p className="text-xs text-neutral-400 max-w-xs mt-1">
                      Curate items from the Clothing, Shoes, Bags, or Accessories categories to see them here.
                    </p>
                  </div>
                </div>
              ) : checkoutMode ? (
                /* CHECKOUT INPUT SUBMENU */
                <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <div className="border-b border-neutral-200 pb-2 mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Secure Dispatch Gateway</h4>
                    <p className="text-xs text-neutral-500">Provide shipping coordinates below.</p>
                  </div>

                  <div className="space-y-3 font-sans text-xs">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Customer Name</label>
                      <input
                        id="shipping-name-input"
                        type="text"
                        required
                        value={shippingName}
                        onChange={(e) => setShippingName(e.target.value)}
                        className="w-full rounded border border-neutral-200 px-3 py-2 text-xs focus:ring-1 focus:ring-dark focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Secure Email Address</label>
                      <input
                        id="shipping-email-input"
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full rounded border border-neutral-200 px-3 py-2 text-xs focus:ring-1 focus:ring-dark focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Delivery Address</label>
                      <input
                        id="shipping-address-input"
                        type="text"
                        required
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        className="w-full rounded border border-neutral-200 px-3 py-2 text-xs focus:ring-1 focus:ring-dark focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Contact Phone Number</label>
                      <input
                        id="shipping-phone-input"
                        type="text"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full rounded border border-neutral-200 px-3 py-2 text-xs focus:ring-1 focus:ring-dark focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        id="billing-same-chk"
                        type="checkbox"
                        checked={billingSame}
                        onChange={() => setBillingSame(!billingSame)}
                        className="rounded border-neutral-300 accent-kiwi"
                      />
                      <span className="text-neutral-500 text-[11px]">Billing address matches delivery details</span>
                    </div>

                    {/* Integrated Payment Gateways info boxes */}
                    <div className="rounded-lg bg-neutral-50 border border-neutral-100 p-4 mt-6">
                      <div className="flex items-center gap-2 text-neutral-700 font-bold mb-1.5">
                        <CreditCard className="h-4 w-4 text-neutral-500" />
                        <span className="uppercase text-[10pt] tracking-wide">Multi-Gateway Integration</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 leading-relaxed">
                        Securely routed dynamically using <strong className="text-dark">Stripe</strong> API (Global checkouts) and <strong className="text-dark">Paystack / Mobile M-Pesa</strong> tokens. Secured via AES-256 compliance. No actual keys exposed in preview.
                      </p>
                    </div>
                  </div>

                  {/* Return back button */}
                  <button
                    type="button"
                    onClick={() => setCheckoutMode(false)}
                    className="w-full text-center text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-dark mt-4 py-2 hover:underline"
                  >
                    ← Review Items in bag
                  </button>
                </form>
              ) : (
                /* CART LIST ITEMS */
                <div className="space-y-4">
                  {resolvedItems.map(({ item, product, variant }) => {
                    const price = variant!.priceOverride ? Number(variant!.priceOverride) : product!.basePrice;
                    const displayImage = product?.images[0]?.url || "https://via.placeholder.com/150";

                    return (
                      <div
                        key={item.variantId}
                        id={`cart-row-${item.variantId}`}
                        className="flex items-start gap-4 rounded-md border border-neutral-100 bg-neutral-50/50 p-3 transition-colors hover:bg-neutral-50 hover:border-neutral-200"
                      >
                        {/* Compact thumbnail image */}
                        <div className="h-20 w-16 shrink-0 overflow-hidden rounded border border-neutral-100 bg-white">
                          <img
                            src={displayImage}
                            alt={product!.name}
                            className="h-full w-full object-cover object-center"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Middle info column */}
                        <div className="flex-1">
                          <h4 className="font-display font-medium text-xs tracking-tight text-dark line-clamp-1">
                            {product!.name}
                          </h4>
                          
                          <div className="mt-1 flex flex-wrap gap-x-2 text-[10px] text-neutral-400 font-sans">
                            <span>Color: <strong className="text-neutral-600 font-medium">{variant!.color}</strong></span>
                            <span>•</span>
                            <span>Size: <strong className="text-neutral-600 font-semibold font-mono">{variant!.size}</strong></span>
                          </div>

                          {/* Dynamic price override */}
                          <div className="mt-1.5 font-mono text-xs font-semibold text-neutral-900">
                            ${price.toFixed(2)}
                          </div>

                          {/* Multipliers up / down counters */}
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center border border-neutral-200 rounded bg-white">
                              <button
                                id={`dec-cart-${item.variantId}`}
                                onClick={() => onUpdateQuantity(item.variantId, item.quantity - 1)}
                                className="px-2 py-1 text-xs text-neutral-400 hover:text-dark"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-bold font-mono text-neutral-800">
                                {item.quantity}
                              </span>
                              <button
                                id={`inc-cart-${item.variantId}`}
                                onClick={() => onUpdateQuantity(item.variantId, item.quantity + 1)}
                                className="px-2 py-1 text-xs text-neutral-400 hover:text-dark"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <button
                              id={`remove-cart-${item.variantId}`}
                              onClick={() => onRemoveItem(item.variantId)}
                              className="text-neutral-400 hover:text-rose-500 p-1.5 transition-colors"
                              title="Delete Item"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom summary and Action call-outs */}
            {resolvedItems.length > 0 && (
              <div className="border-t border-neutral-100 bg-neutral-50/70 p-5 space-y-3 font-sans">
                {/* Math breakdown */}
                <div className="space-y-2 text-xs text-neutral-500">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-dark font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT Sales Taxes (8%)</span>
                    <span className="font-mono text-dark font-medium">${taxCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Insured Global Delivery</span>
                    <span className="font-mono text-dark font-medium">
                      {shippingCost === 0 ? <strong className="text-emerald-600 uppercase text-[10px] tracking-wider">FREE</strong> : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-200 pt-2.5 text-sm font-bold text-dark">
                    <span>Total Cost Outlay</span>
                    <span className="font-mono text-dark text-base">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Main Dynamic Checkout button trigger */}
                {checkoutMode ? (
                  <button
                    id="submit-order-button"
                    onClick={handleCheckoutSubmit}
                    disabled={isPlacing}
                    className="w-full mt-4 flex items-center justify-center gap-2 rounded bg-dark py-4 text-center text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors disabled:bg-neutral-400 disabled:cursor-wait"
                  >
                    {isPlacing ? (
                      <>
                        <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                        Authenticating Gateway Payment tokens...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 text-kiwi" /> Authorize Secure Payment (${grandTotal.toFixed(2)})
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    id="go-to-checkout-btn"
                    onClick={() => {
                      onClose();
                      window.location.hash = "#/checkout";
                    }}
                    className="w-full mt-4 flex items-center justify-center gap-2 rounded bg-dark py-4 text-center text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors group"
                  >
                    Proceed to Checkout Page <ArrowRight className="h-4 w-4 text-kiwi group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
