import React, { useState, useEffect, useRef } from "react";
import { Mail, X, Check, ArrowRight, ShieldCheck, Heart, Sparkles } from "lucide-react";

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Inactivity tracking (15 seconds = 15000 ms)
  useEffect(() => {
    // Check if user already completed signup or manually closed it in this session
    const newsletterDismissed = sessionStorage.getItem("kiwi_newsletter_dismissed");
    if (newsletterDismissed === "true") {
      return;
    }

    const INACTIVITY_LIMIT = 15000; // 15 seconds

    const resetInactivityTimer = () => {
      // Clear previous timer
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      // If already shown/open, don't re-track until minimized
      if (isOpen || isSubmitted) return;

      // Start new countdown
      inactivityTimerRef.current = setTimeout(() => {
        setIsOpen(true);
      }, INACTIVITY_LIMIT);
    };

    // User action listeners to determine dynamic inactivity
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click"
    ];

    // Initialize timer
    resetInactivityTimer();

    // Attach listeners
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer);
    });

    // Cleanup listeners
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [isOpen, isSubmitted]);

  const handleClose = () => {
    setIsOpen(false);
    // Persist session-level dismissal to avoid annoying active shoppers
    sessionStorage.setItem("kiwi_newsletter_dismissed", "true");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    
    // Strict pattern validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Please input a valid email route coordinate.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
      setErrorMessage("Validate target structure. Include standard '@' and email domains.");
      return;
    }

    setIsSubmitting(true);

    // Simulate elite database compilation subscription receipt delays
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      sessionStorage.setItem("kiwi_newsletter_dismissed", "true");
      
      // Auto-dimiss the successful registration window after 3.5 seconds
      setTimeout(() => {
        setIsOpen(false);
      }, 3500);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div
      id="newsletter-popup-overlay"
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-xs select-none animate-fade-in"
    >
      <div
        id="newsletter-popup-body"
        className="relative bg-white text-neutral-850 rounded-2xl w-full max-w-2xl border border-neutral-150 overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 max-h-[90vh] md:max-h-none overflow-y-auto"
      >
        
        {/* Absolute Exit button */}
        <button
          onClick={handleClose}
          id="close-newsletter-popup-btn"
          className="absolute right-4 top-4 z-10 p-2 text-neutral-400 hover:text-neutral-800 bg-white/80 hover:bg-neutral-100 rounded-full transition-all focus:outline-hidden"
          aria-label="Close newsletter invite"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Left Column: Stylized imagery segment (Col Span 5) */}
        <div className="md:col-span-5 bg-neutral-900 text-white min-h-[160px] md:min-h-[400px] relative flex flex-col justify-end p-6 overflow-hidden">
          {/* Unsplash luxury styling display background */}
          <img
            src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800"
            alt="Kiwi Autumn Studio curation"
            className="absolute inset-0 h-full w-full object-cover opacity-60 pointer-events-none scale-105"
            referrerPolicy="no-referrer"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

          <div className="relative z-10 space-y-2">
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-kiwi bg-kiwi/15 px-2.5 py-0.5 rounded-full uppercase tracking-widest leading-none font-mono">
              <Sparkles className="h-3 w-3 animate-spin" /> Members Only Club
            </span>
            <h3 className="text-lg font-display font-bold uppercase tracking-tight leading-tight">
              Curated Style Circular
            </h3>
            <p className="text-[10px] text-neutral-300 leading-relaxed font-sans">
              Sign up today and receive a 15% promotional checkout credential valid across all seasonal fits.
            </p>
          </div>
        </div>

        {/* Right Column: Interaction form (Col Span 7) */}
        <div className="md:col-span-7 p-8 flex flex-col justify-center space-y-4">
          
          {!isSubmitted ? (
            <>
              <div className="space-y-1.5 text-left">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#a8a29e] block font-bold">
                  AUTUMN/WINTER OUTLOOK
                </span>
                <h2 className="text-xl font-sans font-black tracking-tight text-neutral-900 uppercase">
                  Do not miss the drops
                </h2>
                <p className="text-xs text-neutral-550 leading-relaxed">
                  Join 14,000+ style preservationists who get weekly insights, digital lookbooks, and high-fidelity archival restocking alerts first.
                </p>
              </div>

              {errorMessage && (
                <div className="p-2.5 bg-rose-50 text-rose-700 rounded-md border border-rose-150 text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-3 pt-1 text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1 font-mono">
                    Electronic Email Coordinate
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. fashion@kiwistyles.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs p-3 rounded-lg border border-neutral-250 bg-white focus:outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                    />
                    <Mail className="absolute right-3.5 top-3.5 h-4.5 w-4.5 text-neutral-300 pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-neutral-950 font-sans hover:bg-neutral-850 active:scale-[0.99] text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all text-xs uppercase tracking-wider disabled:bg-neutral-300 disabled:cursor-wait"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      SECURE SIGNING...
                    </>
                  ) : (
                    <>
                      Secure Autumn Pass <ArrowRight className="h-4 w-4 text-kiwi" />
                    </>
                  )}
                </button>
              </form>

              <div className="flex gap-2 items-start text-[9px] text-[#78716c] font-sans pt-1 border-t border-neutral-100">
                <ShieldCheck className="h-4 w-4 text-kiwi shrink-0 mt-0.5" />
                <p className="leading-tight">
                  We value digital space. You will receive zero spam. Opt out seamlessly in one click via footer footings.
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-6 space-y-4 animate-fade-in">
              <div className="h-14 w-14 rounded-full bg-kiwi text-dark flex items-center justify-center mx-auto shadow-sm animate-bounce">
                <Check className="h-7 w-7 stroke-[3]" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-bold text-lg text-neutral-950 uppercase tracking-tight">
                  Outlook Credentials Signed
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
                  Your registration was processed. We have dispatched a <strong>15% OFF VIP credential</strong> to your inbox.
                </p>
              </div>

              <p className="text-[10px] text-kiwi-dark font-mono animate-pulse">
                // closing checkout gateway wrapper...
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
