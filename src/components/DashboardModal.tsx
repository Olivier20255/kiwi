import React, { useState } from "react";
import { X, User, MapPin, Ticket, ShieldAlert, Plus, ShieldCheck, Check, Sparkles, PlusCircle } from "lucide-react";
import { Product, Address } from "../types";
import OrderTracker from "./OrderTracker";

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

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: "USER" | "ADMIN";
  onChangeRole: (role: "USER" | "ADMIN") => void;
  addresses: Address[];
  onAddAddress: (address: Omit<Address, "id">) => void;
  orderHistory: OrderLog[];
  products: Product[];
  onUpdateStock: (variantId: string, newStock: number) => void;
  onAddProduct: (product: {
    name: string;
    description: string;
    basePrice: number;
    categoryId: string;
    color: string;
    size: string;
    sku: string;
    stock: number;
    imageUrl: string;
  }) => void;
}

export default function DashboardModal({
  isOpen,
  onClose,
  userRole,
  onChangeRole,
  addresses,
  onAddAddress,
  orderHistory,
  products,
  onUpdateStock,
  onAddProduct,
}: DashboardModalProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "admin">("profile");
  
  // States to add address
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("Kenya");
  const [phone, setPhone] = useState("");

  // States to add Product (for Admin testing)
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState(150);
  const [newProdCat, setNewProdCat] = useState("cat-tops");
  const [newProdColor, setNewProdColor] = useState("Espresso Brown");
  const [newProdSize, setNewProdSize] = useState("M");
  const [newProdSku, setNewProdSku] = useState("");
  const [newProdStock, setNewProdStock] = useState(10);
  const [newProdDesc, setNewProdDesc] = useState("Tailored cotton essential.");
  const [newProdImg, setNewProdImg] = useState("https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800");

  if (!isOpen) return null;

  // Handle address submit
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAddress({
      street,
      city,
      state,
      postalCode,
      country,
      phone,
      isDefault: addresses.length === 0,
    });
    setStreet("");
    setCity("");
    setState("");
    setPostalCode("");
    setPhone("");
    setIsAddingAddress(false);
  };

  // Handle product append
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdSku) return;

    onAddProduct({
      name: newProdName,
      description: newProdDesc,
      basePrice: newProdPrice,
      categoryId: newProdCat,
      color: newProdColor,
      size: newProdSize,
      sku: newProdSku,
      stock: newProdStock,
      imageUrl: newProdImg,
    });

    setNewProdName("");
    setNewProdSku("");
    setIsAddingProduct(false);
  };

  return (
    <div id="dashboard-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div id="dashboard-container" className="relative w-full max-w-4xl rounded-lg bg-white shadow-2xl overflow-hidden max-h-[85vh] flex flex-col md:flex-row">
        
        {/* Absolute Close */}
        <button
          id="close-dashboard-btn"
          onClick={onClose}
          className="absolute right-4 top-4 z-50 rounded-full bg-neutral-100 p-1.5 text-neutral-500 hover:text-dark transition-colors"
          aria-label="Close dashboard"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Dashboard Sidebar Navigation */}
        <div className="w-full md:w-60 bg-neutral-50 border-b md:border-b-0 md:border-r border-neutral-100 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-dark text-kiwi">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-dark">Quenton Simiyu</h4>
                <p className="text-[10px] text-neutral-400 truncate max-w-[140px]">quentonsimiyu254@gmail.com</p>
              </div>
            </div>

            <nav className="space-y-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400">
              <button
                id="dash-tab-profile"
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left rounded-md py-2.5 px-3 flex items-center gap-2 transition-all ${
                  activeTab === "profile" ? "bg-white text-dark shadow-sm ring-1 ring-neutral-100" : "hover:text-dark hover:bg-neutral-100/50"
                }`}
              >
                <MapPin className="h-4 w-4 text-neutral-400" />
                Customer Identity
              </button>
              
              <button
                id="dash-tab-orders"
                onClick={() => setActiveTab("orders")}
                className={`w-full text-left rounded-md py-2.5 px-3 flex items-center gap-2 transition-all ${
                  activeTab === "orders" ? "bg-white text-dark shadow-sm ring-1 ring-neutral-100" : "hover:text-dark hover:bg-neutral-100/50"
                }`}
              >
                <Ticket className="h-4 w-4 text-neutral-400" />
                Past Order Logs ({orderHistory.length})
              </button>

              <button
                id="dash-tab-admin"
                onClick={() => setActiveTab("admin")}
                className={`w-full text-left rounded-md py-2.5 px-3 flex items-center gap-2 transition-all border border-dashed ${
                  activeTab === "admin" ? "bg-kiwi-light border-kiwi/40 text-kiwi-dark shadow-sm" : "border-neutral-200 text-neutral-500 hover:text-dark hover:bg-neutral-100/50"
                }`}
              >
                <ShieldAlert className="h-4 w-4 text-neutral-400" />
                Stock Management Panel
              </button>
            </nav>
          </div>

          {/* Quick Role Toggle Option */}
          <div className="mt-8 border-t border-neutral-100 pt-6">
            <label className="block text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-2">SYSTEM ROLE ACCREDITATION</label>
            <div className="grid grid-cols-2 gap-1 bg-neutral-150 p-1 rounded-md border border-neutral-200">
              <button
                id="role-user-btn"
                onClick={() => {
                  onChangeRole("USER");
                  setActiveTab("profile");
                }}
                className={`rounded py-1.5 text-[9px] font-bold uppercase tracking-wider text-center transition-all ${
                  userRole === "USER" ? "bg-white text-dark shadow-sm" : "text-neutral-500 hover:text-dark"
                }`}
              >
                Customer
              </button>
              <button
                id="role-admin-btn"
                onClick={() => {
                  onChangeRole("ADMIN");
                  setActiveTab("admin");
                }}
                className={`rounded py-1.5 text-[9px] font-bold uppercase tracking-wider text-center transition-all ${
                  userRole === "ADMIN" ? "bg-kiwi text-dark shadow-sm" : "text-neutral-500 hover:text-dark"
                }`}
              >
                CMS Admin
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Main Visual Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[60vh] md:max-h-[85vh]">
          
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div id="dash-profile-panel" className="space-y-6 animate-fade-in">
              <div className="border-b border-neutral-100 pb-3">
                <h3 className="font-display font-medium text-lg text-dark">Customer Identity Suite</h3>
                <p className="text-xs text-neutral-400">Manage addresses and personal settings.</p>
              </div>

              {/* Account Basic Specs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-md border border-neutral-100 p-4 bg-neutral-50/50 font-sans text-xs space-y-2">
                  <p><strong className="text-neutral-500 uppercase text-[10px]">Registry Account:</strong> {userRole === "ADMIN" ? "CMS System Administrator" : "Standard Verified Core User"}</p>
                  <p><strong className="text-neutral-500 uppercase text-[10px]">Verified Email:</strong> quentonsimiyu254@gmail.com</p>
                  <p><strong className="text-neutral-500 uppercase text-[10px]">System Locale:</strong> Nairobi, Kenya (EAT / UTC+3)</p>
                </div>
                
                <div className="rounded-md border border-kiwi/20 p-4 bg-kiwi/5 font-sans text-xs flex flex-col justify-between">
                  <div className="flex gap-2 items-start">
                    <Sparkles className="h-4 w-4 text-kiwi-dark shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <p className="font-bold text-kiwi-dark text-[11px] uppercase tracking-wide">KIWI Loyalty Club status</p>
                      <p className="text-neutral-600 mt-1">Authentic Member since June 2026. Custom discounts unlocked.</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-dark tracking-widest uppercase text-right mt-3">KIWI-BLACK-LEVEL</span>
                </div>
              </div>

              {/* Shipping Addresses Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Saved Shipping Coordinates ({addresses.length})</h4>
                  {!isAddingAddress && (
                    <button
                      id="add-address-trigger"
                      onClick={() => setIsAddingAddress(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-dark hover:text-kiwi-dark"
                    >
                      <Plus className="h-3 w-3" /> Add Coordinates
                    </button>
                  )}
                </div>

                {/* Sub-form to App Address */}
                {isAddingAddress ? (
                  <form onSubmit={handleAddressSubmit} className="rounded-md bg-neutral-50 border border-neutral-200 p-4 space-y-3 text-xs font-sans">
                    <p className="text-xs font-bold uppercase text-neutral-500">Provide Delivery Address Specs</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-neutral-400 uppercase mb-1">Street Location</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 1024 Kimathi St"
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          className="w-full rounded border border-neutral-200 px-3 py-1.5 focus:outline-none focus:border-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-neutral-400 uppercase mb-1">City</label>
                        <input
                          type="text"
                          required
                          placeholder="Nairobi"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full rounded border border-neutral-200 px-3 py-1.5 focus:outline-none focus:border-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-neutral-400 uppercase mb-1">State / Region</label>
                        <input
                          type="text"
                          required
                          placeholder="Nairobi County"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full rounded border border-neutral-200 px-3 py-1.5 focus:outline-none focus:border-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-neutral-400 uppercase mb-1">Postal Code</label>
                        <input
                          type="text"
                          required
                          placeholder="00100"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          className="w-full rounded border border-neutral-200 px-3 py-1.5 focus:outline-none focus:border-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-neutral-400 uppercase mb-1">Country</label>
                        <input
                          type="text"
                          required
                          placeholder="Kenya"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full rounded border border-neutral-200 px-3 py-1.5 focus:outline-none focus:border-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-neutral-400 uppercase mb-1">Contact Phone</label>
                        <input
                          type="text"
                          required
                          placeholder="+254 712 345 678"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full rounded border border-neutral-200 px-3 py-1.5 focus:outline-none focus:border-dark"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="rounded bg-neutral-200 text-dark px-3 py-1.5 hover:bg-neutral-300 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded bg-dark text-white px-4 py-1.5 hover:bg-neutral-800 font-semibold"
                      >
                        Save Coordinates
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="relative rounded-md border border-neutral-200 p-4 font-sans text-xs space-y-1">
                        {addr.isDefault && (
                          <span className="absolute right-3 top-3 inline-flex items-center gap-0.5 rounded-full bg-kiwi px-1.5 py-0.5 text-[9px] font-bold text-dark uppercase">
                            Default
                          </span>
                        )}
                        <p className="font-bold text-dark">{street || "Street Detail Address"}</p>
                        <p className="text-neutral-500">{addr.street}</p>
                        <p className="text-neutral-500">{addr.city}, {addr.state} {addr.postalCode}</p>
                        <p className="text-neutral-500">{addr.country}</p>
                        {addr.phone && <p className="text-neutral-400 text-[10px] pt-1">Tel: {addr.phone}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div id="dash-orders-panel" className="space-y-6 animate-fade-in">
              <div className="border-b border-neutral-100 pb-3">
                <h3 className="font-display font-medium text-lg text-dark">Past Customer Order Logs</h3>
                <p className="text-xs text-neutral-400">Comprehensive real-time dispatch trace files.</p>
              </div>

              {orderHistory.length === 0 ? (
                <div className="text-center py-12 rounded bg-neutral-50 select-none">
                  <p className="text-xs text-neutral-400 italic">No past bills or order files found on record. Complete checked out baskets to see them.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orderHistory.map((item) => (
                    <div key={item.id} className="rounded-md border border-neutral-100 bg-neutral-50/50 p-4 font-sans text-xs space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1.5 border-b border-neutral-150 pb-2 text-[11px]">
                        <div>
                          <span className="text-neutral-400">Order ID:</span> <strong className="font-mono text-dark">{item.id}</strong>
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className="text-[10px] font-mono text-neutral-400">{item.createdAt}</span>
                          <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                            {item.status}
                          </span>
                        </div>
                      </div>

                      {/* Items details */}
                      <div className="space-y-1.5 pl-2">
                        {item.items.map((line, idx) => (
                          <div key={idx} className="flex justify-between text-neutral-600 font-sans">
                            <span>
                              {line.productName} (<span className="text-[10px] text-neutral-400 font-mono">{line.color}/{line.size}</span>) x{line.quantity}
                            </span>
                            <span className="font-semibold text-neutral-900">${(line.price * line.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Summary footer line */}
                      <div className="border-t border-neutral-150 pt-2 flex justify-between text-[11px] font-bold text-dark">
                        <span>Grand Cash outlay out</span>
                        <span className="font-mono text-base text-neutral-900">${Number(item.totalAmount).toFixed(2)}</span>
                      </div>
                      
                      <p className="text-[10px] text-neutral-400 italic">Dispatched to: {item.shippingAddress}</p>

                      {/* Dynamic 'Track Order' status tracking */}
                      <OrderTracker
                        orderId={item.id}
                        createdAt={item.createdAt}
                        shippingAddress={item.shippingAddress}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ADMIN STOCK MANAGEMENT TAB */}
          {activeTab === "admin" && (
            <div id="dash-admin-panel" className="space-y-6 animate-fade-in">
              <div className="bg-neutral-900 text-white rounded-lg p-4 font-sans text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
                <div>
                  <p className="font-bold text-kiwi text-xs uppercase tracking-wider">🚀 DEDICATED ADMIN SECURED VIEW CONSOLE</p>
                  <p className="text-neutral-400 mt-1">Examine our fully featured Administrative sidebars, multi-image product creation flows, and paginated dynamic data tables.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    window.location.hash = "#/admin";
                  }}
                  className="bg-kiwi hover:bg-opacity-90 text-neutral-950 font-bold uppercase tracking-wider py-2.5 px-4 rounded text-[10px] inline-flex items-center gap-1 transition shrink-0 font-mono select-none"
                >
                  Launch Fullscreen Console
                </button>
              </div>

              <div className="border-b border-neutral-100 pb-3 flex flex-wrap justify-between items-center gap-3">
                <div>
                  <h3 className="font-display font-medium text-lg text-dark flex items-center gap-1.5">
                    <ShieldCheck className="h-5 w-5 text-emerald-500 animate-pulse" />
                    CMS Kiwi Stock Management
                  </h3>
                  <p className="text-xs text-neutral-400">Perform direct real-time product updates and SKU inserts.</p>
                </div>

                <div className="flex gap-2">
                  <button
                    id="trigger-add-product-btn"
                    onClick={() => setIsAddingProduct(!isAddingProduct)}
                    className="rounded bg-dark text-white py-1.5 px-3.5 text-xs font-bold uppercase tracking-wide flex items-center gap-1 hover:bg-neutral-800 transition-colors"
                  >
                    <PlusCircle className="h-3.5 w-3.5 text-kiwi" />
                    {isAddingProduct ? "Cancel Form" : "Insert Product"}
                  </button>
                </div>
              </div>

              {/* Form to insert new fashion item */}
              {isAddingProduct && (
                <form id="add-product-spec-form" onSubmit={handleProductSubmit} className="rounded-md border border-neutral-200 bg-neutral-50 p-4 space-y-3 text-xs font-sans animate-fade-in">
                  <h4 className="text-xs font-bold uppercase text-neutral-700 pb-1.5 border-b border-neutral-200">Catalog Registry Form</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] text-neutral-400 uppercase mb-1">Product Title</label>
                      <input
                        type="text"
                        required
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        placeholder="e.g. Italian Wool Blazer Jacket"
                        className="w-full rounded border border-neutral-200 px-3 py-1.5 bg-white text-dark focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-neutral-400 uppercase mb-1">Base Price ($)</label>
                      <input
                        type="number"
                        required
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(Number(e.target.value))}
                        className="w-full rounded border border-neutral-200 px-3 py-1.5 bg-white text-dark focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-neutral-400 uppercase mb-1">Category Route</label>
                      <select
                        value={newProdCat}
                        onChange={(e) => setNewProdCat(e.target.value)}
                        className="w-full rounded border border-neutral-200 px-3 py-1.5 bg-white text-dark focus:outline-none"
                      >
                        <option value="cat-outerwear">Outerwear</option>
                        <option value="cat-tops">Tops</option>
                        <option value="cat-pants">Pants</option>
                        <option value="cat-boots">Boots</option>
                        <option value="cat-sneakers">Sneakers</option>
                        <option value="cat-minibags">Mini Bags</option>
                        <option value="cat-eyewear">Eyewear</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-neutral-400 uppercase mb-1">Color Option</label>
                      <input
                        type="text"
                        required
                        value={newProdColor}
                        onChange={(e) => setNewProdColor(e.target.value)}
                        className="w-full rounded border border-neutral-200 px-3 py-1.5 bg-white text-dark focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-neutral-400 uppercase mb-1">Size Option</label>
                      <input
                        type="text"
                        required
                        value={newProdSize}
                        onChange={(e) => setNewProdSize(e.target.value)}
                        className="w-full rounded border border-neutral-200 px-3 py-1.5 bg-white text-dark focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] text-neutral-400 uppercase mb-1">Set Unique SKU</label>
                      <input
                        type="text"
                        required
                        value={newProdSku}
                        onChange={(e) => setNewProdSku(e.target.value)}
                        placeholder="e.g. KW-BLZ-BRN-MD"
                        className="w-full rounded border border-neutral-200 px-3 py-1.5 bg-white text-dark focus:outline-none font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-neutral-400 uppercase mb-1">Initial Stock Quantity</label>
                      <input
                        type="number"
                        required
                        value={newProdStock}
                        onChange={(e) => setNewProdStock(Number(e.target.value))}
                        className="w-full rounded border border-neutral-200 px-3 py-1.5 bg-white text-dark focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-[10px] text-neutral-400 uppercase mb-1">Description Paragraph</label>
                      <textarea
                        value={newProdDesc}
                        onChange={(e) => setNewProdDesc(e.target.value)}
                        rows={2}
                        className="w-full rounded border border-neutral-200 p-2 bg-white text-dark focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1 border-t border-neutral-200 mt-2">
                    <button
                      type="submit"
                      className="rounded bg-dark text-white px-5 py-2 font-bold uppercase tracking-wider hover:bg-neutral-800 transition"
                    >
                      Verify & Add Product to Catalog
                    </button>
                  </div>
                </form>
              )}

              {/* Inventory Table with individual stock overrides */}
              <div className="rounded-md border border-neutral-200 overflow-x-auto bg-white shadow-inner">
                <table className="w-full border-collapse font-sans text-xs text-left">
                  <thead>
                    <tr className="bg-neutral-50 text-neutral-450 border-b border-neutral-200 uppercase text-[10px] tracking-wider">
                      <th className="p-3">Product Item / Details</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Color/Size</th>
                      <th className="p-3 text-center">In-Stock Quantity</th>
                      <th className="p-3 text-right">Quick Overrides</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => {
                      return p.variants.map((v) => {
                        return (
                          <tr key={v.id} className="border-b border-neutral-100 hover:bg-neutral-50/50">
                            <td className="p-3 font-semibold text-dark">
                              {p.name}
                            </td>
                            <td className="p-3 font-mono text-neutral-400 uppercase">{v.sku}</td>
                            <td className="p-3 text-neutral-600 font-medium">
                              {v.color} / <span className="font-mono text-[10px] bg-neutral-100 px-1 py-0.5 rounded">{v.size}</span>
                            </td>
                            <td className="p-3 text-center font-bold">
                              <span className={`px-2 py-0.5 rounded font-mono ${
                                v.stockQuantity === 0
                                  ? "bg-rose-100 text-rose-800 font-black"
                                  : v.stockQuantity <= 5
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-neutral-100 text-neutral-900"
                              }`}>
                                {v.stockQuantity}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex justify-end gap-1 items-center">
                                {/* Direct Increments and decrements stock buttons */}
                                <button
                                  type="button"
                                  onClick={() => onUpdateStock(v.id, Math.max(0, v.stockQuantity - 5))}
                                  className="px-1.5 py-1 rounded bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                                  title="Deduct 5 items"
                                >
                                  -5
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onUpdateStock(v.id, v.stockQuantity + 5)}
                                  className="px-1.5 py-1 rounded bg-kiwi text-dark text-[10px] font-bold hover:bg-opacity-80"
                                  title="Add 5 items"
                                >
                                  +5
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onUpdateStock(v.id, 0)}
                                  className="px-1 py-1 text-rose-500 hover:text-rose-700 text-[10px] font-semibold"
                                  title="Force Out of stock"
                                >
                                  Empty
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
