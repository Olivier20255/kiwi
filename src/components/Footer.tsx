import React, { useState } from "react";
import { Sparkles, ArrowRight, Check } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer id="kiwi-footer" className="bg-dark text-white pt-24 pb-12 mt-32 border-t border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Brand/Editorial Segment */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-kiwi text-dark font-display font-black text-sm">
                K
              </div>
              <span className="font-display text-lg font-bold tracking-wider text-white">KIWI</span>
            </div>
            
            <p className="text-sm tracking-wide text-neutral-400 font-sans leading-relaxed max-w-sm">
              An editorial multi-brand experience framing elevated tailoring, architectural footwear, and modern daily uniforms.
            </p>
            
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 px-3.5 py-1.5 text-xs text-neutral-400">
              <Sparkles className="h-3 w-3 text-kiwi animate-spin-slow" />
              <span>Sustainably forged in Limited Collections</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Collection</h3>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a href="#" className="text-sm text-neutral-300 hover:text-white hover:underline hover:decoration-kiwi transition-all">
                    New Arrivals
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-neutral-300 hover:text-white hover:underline hover:decoration-kiwi transition-all">
                    Tailored Coats
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-neutral-300 hover:text-white hover:underline hover:decoration-kiwi transition-all">
                    Square Boots
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-neutral-300 hover:text-white hover:underline hover:decoration-kiwi transition-all">
                    Matte Hardware Bags
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Client Service</h3>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a href="#" className="text-sm text-neutral-300 hover:text-white transition-all">
                    Shipping & Customs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-neutral-300 hover:text-white transition-all">
                    Return Portal
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-neutral-300 hover:text-white transition-all">
                    Corporate Responsibility
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-neutral-300 hover:text-white transition-all">
                    Contact Studio
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Editorial Newsletter Subscription Form */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Newsletter</h3>
            
            <p className="text-sm text-neutral-300 leading-relaxed">
              Subscribe to unlock early access to drops, editorial features, and exclusive collection invites.
            </p>
            
            {isSubscribed ? (
              <div id="newsletter-success" className="flex items-center gap-2 rounded-md bg-neutral-900 border border-kiwi/20 p-4 text-emerald-400">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                  <Check className="h-3 w-3" />
                </div>
                <span className="text-xs font-medium tracking-wide">You are subbed to Kiwi drops. Welcome.</span>
              </div>
            ) : (
              <form id="newsletter-form" onSubmit={handleSubmit} className="flex flex-col gap-2">
                <div className="relative">
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full rounded-md border border-neutral-700 bg-neutral-900/50 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-kiwi focus:ring-1 focus:ring-kiwi focus:outline-none"
                  />
                  <button
                    id="newsletter-submit"
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm bg-kiwi p-1.5 text-dark hover:bg-white transition-colors"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-[10px] text-neutral-500 tracking-wide">
                  By joining, you agree to our Privacy Terms. Standard carrier drop lists apply.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Footer Signature Bar */}
        <div className="mt-20 border-t border-neutral-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-xs tracking-wider">
          <p>© 2026 KIWI Fashion Ltd. All rights reserved.</p>
          <div id="tech-techstack-signature" className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-400">
            <span>PLATFORM:</span>
            <span className="text-neutral-500">REACT/VITE</span>
            <span>•</span>
            <span>SYSTEM STATE:</span>
            <span className="text-kiwi font-bold">READY</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
