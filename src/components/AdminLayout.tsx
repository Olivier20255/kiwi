import React, { useState } from "react";
import { ShieldCheck, Calendar, LayoutDashboard, Key, ClipboardList, ShieldAlert, PlusCircle, ShoppingBag, Eye, LogOut, Check, ArrowUpRight, HelpCircle, Lock } from "lucide-react";
import { Product } from "../types";
import AdminProducts from "./AdminProducts";
import CreateProduct from "./CreateProduct";

interface AdminLayoutProps {
  products: Product[];
  onRefreshProducts: () => void;
  userRole: "USER" | "ADMIN";
  onChangeRole: (role: "USER" | "ADMIN") => void;
  onExit: () => void;
}

export default function AdminLayout({
  products,
  onRefreshProducts,
  userRole,
  onChangeRole,
  onExit,
}: AdminLayoutProps) {
  const [activeTab, setActiveTab] = useState<"products" | "create">("products");
  
  // Security lock state
  const [passcode, setPasscode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "admin" || passcode === "password") {
      onChangeRole("ADMIN");
      setErrorMessage("");
    } else {
      setErrorMessage("Unauthorized security signature. Key password didn't match.");
    }
  };

  const handleBypassBypass = () => {
    onChangeRole("ADMIN");
  };

  // 1. Role-based access gate
  if (userRole !== "ADMIN") {
    return (
      <div id="admin-security-gate" className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-6 select-none animate-fade-in">
        <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          
          {/* Subtle ambient lighting inside gate */}
          <div className="absolute top-0 right-0 h-40 w-40 bg-kiwi/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center space-y-3 mb-6 relative z-10">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 text-kiwi">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="font-display font-bold text-xl tracking-tight text-white">Kiwi CMS Security Hub</h2>
            <p className="text-xs text-neutral-450 leading-relaxed">
              Section requires administrative credential validation. Provide CMS bypass authorization to sign logs.
            </p>
          </div>

          <form onSubmit={handleAuthorize} className="space-y-4 relative z-10 font-sans text-xs">
            {errorMessage && (
              <div className="p-3.5 bg-red-950/40 border border-red-805 text-red-400 rounded-lg text-center font-semibold">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-neutral-450 mb-1.5 font-bold">Admin Code Password</label>
              <input
                type="password"
                required
                placeholder="Type 'admin' or 'password'..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full text-xs p-3 bg-neutral-900 rounded-xl border border-neutral-800 focus:outline-hidden focus:border-kiwi focus:ring-1 focus:ring-kiwi text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-kiwi text-neutral-950 font-bold uppercase tracking-wider h-11 rounded-xl hover:bg-opacity-90 active:scale-98 transition"
            >
              Verify Administrative Clearance
            </button>
          </form>

          {/* Quick simulation bypass for convenience */}
          <div className="mt-6 border-t border-neutral-900 pt-5 text-center relative z-10">
            <p className="text-[10px] text-neutral-500 mb-2">Simulate instant authorization bypass trigger:</p>
            <button
              onClick={handleBypassBypass}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-kiwi-light hover:text-white transition"
            >
              <Key className="h-3 w-3" /> Grant Admin Bypass Clearance
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={onExit}
              className="text-[10px] font-mono text-neutral-500 hover:text-white uppercase tracking-wider"
            >
              Cancel & Exit back to shop
            </button>
          </div>

        </div>
      </div>
    );
  }

  // 2. Fully authorized Admin Layout & visual environment
  return (
    <div id="admin-secured-console" className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col md:flex-row font-sans animate-fade-in">
      
      {/* 1. SIDEBAR Navigation Layout */}
      <aside className="w-full md:w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col justify-between shrink-0 text-white select-none">
        
        {/* Upper Sidebar visual segment */}
        <div>
          {/* Brand header branding */}
          <div className="p-6 border-b border-neutral-850 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-kiwi flex items-center justify-center text-neutral-950">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-display font-black text-sm uppercase tracking-wide">CMS Console</h1>
                <p className="text-[9px] text-neutral-400 font-mono tracking-widest">// SYSTEM-SECURE</p>
              </div>
            </div>
          </div>

          {/* Admin Details metadata */}
          <div className="px-6 py-4 border-b border-neutral-850 bg-neutral-955/40 text-xs">
            <p className="text-neutral-450 text-[10px] uppercase font-bold tracking-wider mb-1">Authenticated user:</p>
            <p className="font-bold text-neutral-200">Quenton Simiyu</p>
            <p className="text-[10px] text-neutral-400 mt-0.5 truncate">quentonsimiyu254@gmail.com</p>
          </div>

          {/* Navigation link choices */}
          <nav className="p-4 space-y-1">
            <span className="block text-[9px] uppercase tracking-widest text-neutral-500 font-bold px-3.5 mb-2">Inventory Ledger</span>

            {/* Products grid trigger */}
            <button
              onClick={() => setActiveTab("products")}
              className={`w-full text-xs font-semibold py-3 px-3.5 rounded-lg flex items-center gap-2.5 transition-all select-none focus:outline-hidden uppercase tracking-wider ${
                activeTab === "products"
                  ? "bg-neutral-800 text-kiwi font-bold shadow-xs border-l-2 border-kiwi-light"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-850"
              }`}
            >
              <ClipboardList className="h-4 w-4 shrink-0" />
              Product Catalog ({products.length})
            </button>

            {/* Create Product Form trigger */}
            <button
              onClick={() => setActiveTab("create")}
              className={`w-full text-xs font-semibold py-3 px-3.5 rounded-lg flex items-center gap-2.5 transition-all select-none focus:outline-hidden uppercase tracking-wider ${
                activeTab === "create"
                  ? "bg-neutral-800 text-kiwi font-bold shadow-xs border-l-2 border-kiwi-light"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-850"
              }`}
            >
              <PlusCircle className="h-4 w-4 shrink-0" />
              Create Outfit Variant
            </button>
          </nav>
        </div>

        {/* Lower Sidebar Actions: exit controllers */}
        <div className="p-4 border-t border-neutral-850 bg-neutral-950/15 text-xs text-neutral-450 space-y-2">
          
          <div className="p-3 bg-neutral-850/40 rounded-lg text-[10px] flex gap-1.5 items-start">
            <ShieldAlert className="h-4 w-4 text-kiwi shrink-0" />
            <p className="leading-tight">
              Acknowledge that server-side database sync actions take effect in real-time.
            </p>
          </div>

          <div className="pt-2 grid grid-cols-2 gap-1.5">
            <button
              onClick={() => onChangeRole("USER")}
              className="rounded-lg border border-neutral-750 p-2 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-all text-center uppercase tracking-widest text-[9px] font-bold"
              title="Switch user clearance to normal Customer view"
            >
              Go Client
            </button>

            <button
              onClick={onExit}
              className="rounded-lg bg-red-900 p-2 hover:bg-red-850 text-white transition-all text-center uppercase tracking-widest text-[9px] font-bold flex items-center justify-center gap-1.5"
            >
              Exit Console <LogOut className="h-3 w-3" />
            </button>
          </div>

        </div>
      </aside>

      {/* 2. MAIN CONTENT Visual Workspace Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Core Workspace Header */}
        <header className="bg-white border-b border-neutral-200 px-8 py-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-kiwi/20 text-neutral-800 font-bold uppercase py-0.5 px-2 rounded-full font-mono tracking-wider">
                Authorized CMS Session
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h2 className="font-display font-bold text-lg text-neutral-900 mt-1">
              {activeTab === "products" ? "Fashion Inventory Registry" : "Instantiate New Outfit Concept"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-neutral-450 hidden md:inline select-none">
              Locale Checked: Nairobi (UTC+3)
            </span>
            <button
              onClick={onExit}
              className="inline-flex items-center gap-1 bg-neutral-100 border border-neutral-250 hover:bg-neutral-200 text-dark font-semibold text-xs py-2 px-3.5 rounded-lg select-none uppercase tracking-wider transition-all"
            >
              View Shop Staging <ArrowUpRight className="h-3.5 w-3.5 text-neutral-500" />
            </button>
          </div>
        </header>

        {/* Dynamic Display workspace panels */}
        <section className="flex-1 p-8 overflow-y-auto">
          {activeTab === "products" ? (
            <AdminProducts
              products={products}
              onRefreshProducts={onRefreshProducts}
              onNavigateToCreate={() => setActiveTab("create")}
            />
          ) : (
            <CreateProduct
              onBack={() => setActiveTab("products")}
              onSuccess={() => {
                onRefreshProducts();
                setActiveTab("products");
              }}
            />
          )}
        </section>

      </main>

    </div>
  );
}
