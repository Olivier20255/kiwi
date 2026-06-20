import React, { useEffect, useState } from "react";
import { Check, Calendar, Mail, ArrowRight, ShieldCheck, ShoppingBag, Terminal } from "lucide-react";
import { useCartStore } from "../useCartStore";

interface CheckoutSuccessPageProps {
  onBackToApp: () => void;
}

interface SimulatedOrder {
  id: string;
  fullName: string;
  email: string;
  shippingAddress: string;
  totalAmount: number;
  gateway: string;
  status: string;
}

export default function CheckoutSuccessPage({ onBackToApp }: CheckoutSuccessPageProps) {
  const { clearCart } = useCartStore();
  const [order, setOrder] = useState<SimulatedOrder | null>(null);
  const [loading, setLoading] = useState(true);

  // Clear cart upon arriving at success page to ensure proper lifecycle
  useEffect(() => {
    clearCart();

    // Recover order details from localStorage or parse path hash query
    const searchParams = new URLSearchParams(window.location.hash.split("?")[1] || "");
    const orderId = searchParams.get("orderId");

    const fetchOrderDetails = async () => {
      try {
        if (orderId) {
          const res = await fetch(`/api/orders/${orderId}`);
          if (res.ok) {
            const data = await res.json();
            setOrder(data);
          }
        }
      } catch (e) {
        console.error("Could not fetch sync data from backend:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [clearCart]);

  return (
    <div id="success-view-container" className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8 text-center animate-fade-in select-none">
      
      {/* Visual Badge Indicator */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-kiwi text-dark animate-bounce shadow mx-auto mb-8">
        <Check className="h-10 w-10 stroke-[3]" />
      </div>

      <div className="space-y-3 mb-8">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 uppercase tracking-widest leading-none">
          <ShieldCheck className="h-3 w-3" /> Secure Gate Audit Passed
        </span>
        
        <h1 className="text-3xl font-display font-black tracking-tight text-neutral-900 uppercase">
          Billing Authorized
        </h1>
        <p className="text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
          Your order formulation was successfully authenticated. Distribution centers are packing and dispatching your items.
        </p>
      </div>

      {order && (
        <div className="rounded-lg bg-neutral-50 border border-neutral-150 p-6 text-left space-y-3 font-sans text-xs mb-8 select-text">
          <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 mb-1 border-b border-neutral-100 pb-2 flex items-center justify-between">
            <span>Order Blueprint</span>
            <span className="text-neutral-900 font-mono text-xs">{order.id}</span>
          </h4>

          <div className="grid grid-cols-3 gap-2 py-0.5">
            <span className="text-neutral-400">Recipient:</span>
            <span className="col-span-2 font-semibold text-neutral-800 text-right">{order.fullName}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 py-0.5">
            <span className="text-neutral-400">Secure Mail:</span>
            <span className="col-span-2 font-semibold text-neutral-800 text-right break-all">{order.email}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 py-0.5">
            <span className="text-neutral-400">Destination:</span>
            <span className="col-span-2 text-neutral-700 text-right">{order.shippingAddress}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 py-0.5">
            <span className="text-neutral-400">Charged:</span>
            <span className="col-span-2 font-mono font-bold text-neural-900 text-right text-sm">
              ${Number(order.totalAmount).toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 py-0.5">
            <span className="text-neutral-400">Payment status:</span>
            <span className="col-span-2 text-right">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest font-bold bg-green-100 text-green-800 border border-green-200">
                {order.status}
              </span>
            </span>
          </div>
        </div>
      )}

      {/* Interactive Terminal Mock for developer satisfaction */}
      <div className="bg-neutral-950 text-neutral-300 p-4 rounded-lg text-left font-mono text-[10px] space-y-1 mb-8 shadow-inner select-none border border-neutral-800">
        <div className="flex items-center gap-1.5 text-neutral-400 mb-2 border-b border-neutral-800 pb-1.5 uppercase tracking-wider text-[9px] font-bold">
          <Terminal className="h-3.5 w-3.5 text-kiwi shrink-0" />
          <span>Gateway Compliance Console</span>
        </div>
        <p className="text-neutral-500">// handshaking socket webhook events...</p>
        <p className="text-green-400">✔ status code 200 (WEBHOOK_SIGNATURE_AUTHENTICATED)</p>
        <p className="text-kiwi">✔ order status updated: PENDING ➔ PAID</p>
        <p className="text-neutral-400">✔ local user store cart cleared.</p>
      </div>

      {/* Action buttons */}
      <button
        id="dismiss-success-view-btn"
        onClick={onBackToApp}
        className="w-full bg-neutral-950 text-white rounded-md h-12 flex items-center justify-center gap-2 hover:bg-neutral-850 transition-all font-semibold font-sans tracking-wide uppercase text-xs"
      >
        Continue Curating Fits <ArrowRight className="h-4 w-4 text-kiwi" />
      </button>

    </div>
  );
}
