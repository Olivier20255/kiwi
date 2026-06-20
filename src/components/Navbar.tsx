import React, { useState } from "react";
import { ShoppingBag, Search, User, Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { CATEGORIES } from "../data";
import { Category } from "../types";

interface NavbarProps {
  cartItemsCount: number;
  onCartOpen: () => void;
  onUserOpen: () => void;
  selectedCategory: string | null;
  onSelectCategory: (categorySlug: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Navbar({
  cartItemsCount,
  onCartOpen,
  onUserOpen,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const handleCategoryClick = (categorySlug: string | null) => {
    onSelectCategory(categorySlug);
    setIsMobileMenuOpen(false);
    setActiveMegaMenu(null);
  };

  return (
    <header id="kiwi-navbar" className="sticky top-0 z-50 w-full border-b border-neutral-100 bg-white/90 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-neutral-600 hover:text-neutral-900 md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Core Brand Logo */}
          <div className="flex items-center">
            <button
              id="brand-logo-btn"
              onClick={() => handleCategoryClick(null)}
              className="flex items-center gap-1.5 focus:outline-none group"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-dark text-kiwi font-display font-semibold transition-all group-hover:bg-kiwi group-hover:text-dark">
                K
              </div>
              <span className="font-display text-xl font-bold tracking-wider text-dark group-hover:opacity-80">
                KIWI
              </span>
            </button>
          </div>

          {/* Desktop Categories Mega-Menu Links */}
          <nav className="hidden md:flex md:space-x-8" aria-label="Main navigation">
            <button
              id="nav-all-products"
              onClick={() => handleCategoryClick(null)}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-dark ${
                selectedCategory === null ? "text-dark font-semibold border-b border-dark pb-0.5" : "text-neutral-500"
              }`}
            >
              All Collection
            </button>
            
            {CATEGORIES.map((cat) => {
              const hasSubs = cat.subcategories && cat.subcategories.length > 0;
              const isSelected = selectedCategory === cat.slug;
              
              return (
                <div
                  key={cat.id}
                  className="relative group"
                  onMouseEnter={() => setActiveMegaMenu(cat.id)}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <button
                    id={`nav-${cat.slug}`}
                    onClick={() => handleCategoryClick(cat.slug)}
                    className={`flex items-center gap-1 text-sm font-medium tracking-wide transition-colors hover:text-dark ${
                      isSelected ? "text-dark font-semibold border-b border-dark pb-0.5" : "text-neutral-500"
                    }`}
                  >
                    {cat.name}
                    {hasSubs && <ChevronDown className="h-3 w-3 text-neutral-400 group-hover:text-dark transition-transform group-hover:rotate-180" />}
                  </button>

                  {/* Mega Menu Dropdown */}
                  {hasSubs && activeMegaMenu === cat.id && (
                    <div className="absolute left-1/2 top-full z-50 w-[450px] -translate-x-1/2 pt-4 animate-fade-in">
                      <div className="rounded-md border border-neutral-100 bg-white p-6 shadow-xl ring-1 ring-black/5">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                              Shop {cat.name}
                            </h4>
                            <ul className="mt-3 space-y-2.5">
                              {cat.subcategories?.map((sub) => (
                                <li key={sub.id}>
                                  <button
                                    id={`nav-sub-${sub.slug}`}
                                    onClick={() => handleCategoryClick(sub.slug)}
                                    className="text-sm text-neutral-600 hover:text-dark hover:font-medium transition-all"
                                  >
                                    {sub.name}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="rounded-lg bg-neutral-50 p-4 flex flex-col justify-between">
                            <div>
                              <div className="inline-flex items-center gap-1 rounded bg-kiwi/15 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-kiwi-dark">
                                <Sparkles className="h-2.5 w-2.5" /> EDITORIAL
                              </div>
                              <p className="mt-2 text-xs font-medium text-dark">
                                {cat.description || "The newest high-contrast wardrobe drop."}
                              </p>
                            </div>
                            <button
                              id={`shop-now-${cat.slug}`}
                              onClick={() => handleCategoryClick(cat.slug)}
                              className="mt-4 text-left text-xs font-bold uppercase tracking-wider text-dark underline decoration-kiwi decoration-2 underline-offset-4 hover:opacity-80 transition-all"
                            >
                              Shop Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Interactive Search, Cart & Account Icons */}
          <div className="flex items-center justify-end gap-3 md:gap-4 flex-1">
            
            {/* Search Bar Interface */}
            <div className={`relative flex items-center transition-all duration-300 ${isSearchExpanded ? "w-48 sm:w-64" : "w-10 sm:w-12"}`}>
              <button
                id="search-toggle-btn"
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                className="absolute left-0 p-2.5 text-neutral-600 hover:text-neutral-900 z-10 focus:outline-none"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search collection..."
                className={`w-full rounded-full border border-neutral-200 py-1.5 pl-10 pr-4 text-sm transition-all duration-300 focus:outline-none focus:border-neutral-400 ${
                  isSearchExpanded ? "opacity-100 scale-100 cursor-text" : "opacity-0 scale-95 pointer-events-none"
                }`}
              />
              {isSearchExpanded && searchQuery && (
                <button
                  id="search-clear-btn"
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 p-1 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Account Dashboard Button */}
            <button
              id="navbar-account-btn"
              onClick={onUserOpen}
              className="group relative p-2 text-neutral-600 hover:text-neutral-900 focus:outline-none"
              aria-label="Account"
            >
              <User className="h-5 w-5 group-hover:scale-105 transition-transform" />
              <span className="absolute bottom-0 left-[50%] h-1 w-1 -translate-x-[50%] rounded-full bg-kiwi opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </button>

            {/* Interactive Cart Button with Dynamic Badge */}
            <button
              id="navbar-cart-btn"
              onClick={onCartOpen}
              className="group relative p-2 text-neutral-600 hover:text-neutral-900 focus:outline-none"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5 group-hover:scale-105 transition-transform" />
              {cartItemsCount > 0 && (
                <span id="nav-cart-badge" className="absolute -top-[1px] -right-[1px] flex h-5 w-5 items-center justify-center rounded-full bg-kiwi text-[10px] font-bold text-dark border border-white animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      {isMobileMenuOpen && (
        <div id="mobile-menu-panel" className="border-t border-neutral-100 bg-white py-4 px-6 md:hidden max-h-[calc(100vh-64px)] overflow-y-auto animate-fade-in">
          <div className="space-y-4">
            <button
              id="mobile-nav-all"
              onClick={() => handleCategoryClick(null)}
              className="block w-full text-left font-display text-lg font-medium text-dark py-2 border-b border-neutral-50"
            >
              All Collection
            </button>
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="space-y-2 py-1">
                <button
                  id={`mobile-nav-${cat.slug}`}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className="block w-full text-left font-display text-lg font-semibold text-dark hover:text-kiwi-dark"
                >
                  {cat.name}
                </button>
                <div className="grid grid-cols-2 gap-2 pl-4">
                  {cat.subcategories?.map((sub) => (
                    <button
                      key={sub.id}
                      id={`mobile-nav-sub-${sub.slug}`}
                      onClick={() => handleCategoryClick(sub.slug)}
                      className="text-left text-sm text-neutral-500 hover:text-dark py-1"
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-neutral-100 pt-6">
            <button
              id="mobile-nav-profile"
              onClick={() => {
                onUserOpen();
                setIsMobileMenuOpen(false);
              }}
              className="flex w-full items-center justify-center gap-2 rounded bg-dark py-3 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors"
            >
              <User className="h-4 w-4 text-kiwi" /> My Customer Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
