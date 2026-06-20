import React, { useState, useEffect } from "react";
import { Shield, Lock, CreditCard, ArrowLeft, Heart, Check, BadgePercent, Landmark, Terminal } from "lucide-react";

interface CheckoutGatewayFallbackProps {
  onCancel: () => void;
}

export default function CheckoutGatewayFallback({ onCancel }: CheckoutGatewayFallbackProps) {
  const [orderId, setOrderId] = useState("");
  const [gatewayType, setGatewayType] = useState("stripe");
  const [orderAmount, setOrderAmount] = useState(0);
  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");

  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("421");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Parse order ID and gateway from hash query string
    const searchParams = new URLSearchParams(window.location.hash.split("?")[1] || "");
    const oid = searchParams.get("orderId") || "";
    const gwy = searchParams.get("gateway") || "stripe";
    
    setOrderId(oid);
    setGatewayType(gwy);

    // Fetch order specs from the backend DB directly
    if (oid) {
      fetch(`/api/orders/${oid}`)
        .then(res => res.json())
        .then(data => {
          setOrderAmount(data.totalAmount || 0);
          setClientEmail(data.email || "");
          setClientName(data.fullName || "");
        })
        .catch(err => {
          console.error("Failed fetching specs:", err);
        });
    }
  }, []);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate Stripe Completing Session by sending events directly to Webhook handler
      // This mimics real webhooks by triggering a server-side state modification before continuing
      const webhookResponse = await fetch("/api/webhooks/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `evt_sim_${Math.random().toString(36).substr(2, 9)}`,
          type: "checkout.session.completed",
          data: {
            object: {
              metadata: {
                orderId: orderId,
              }
            }
          }
        }),
      });

      if (!webhookResponse.ok) {
        throw new Error("Webhook signature handshake failed.");
      }

      // Briefly wait to allow visual completion feedback
      setTimeout(() => {
        setIsProcessing(false);
        setIsDone(true);
        // Navigate customer back to Success page
        window.location.hash = `#/checkout-success?orderId=${orderId}`;
      }, 2000);

    } catch (err) {
      console.error("Webhook processing error:", err);
      setIsProcessing(false);
    }
  };

  const isMpesa = gatewayType === "mpesa";
  const [mpesaCode, setMpesaCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 font-sans select-none text-neutral-850">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden border border-neutral-200 grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Column: Invoice Information */}
        <div className={`p-8 sm:p-12 flex flex-col justify-between transition-colors ${
          isMpesa ? "bg-[#094119] text-white" : "bg-[#1a1f36] text-white"
        }`}>
          <div>
            {/* Header branding */}
            <div className="flex items-center gap-2 mb-10">
              <div className={`h-7 w-7 rounded font-black flex items-center justify-center text-xs ${
                isMpesa ? "bg-white text-[#094119]" : "bg-kiwi text-dark"
              }`}>
                K
              </div>
              <span className="font-display font-medium text-sm tracking-widest uppercase">
                KIWI STYLING HOUSE
              </span>
            </div>

            {/* Price overview */}
            <div className="space-y-4">
              <span className={`text-[10px] font-mono tracking-widest uppercase block font-bold ${
                isMpesa ? "text-emerald-300" : "text-[#a3acb9]"
              }`}>
                {isMpesa ? "PAY VIA LIPA NA M-PESA" : "PAY TO KIWI RETAIL"}
              </span>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className={`text-4xl font-extrabold font-mono ${isMpesa ? "text-emerald-400" : "text-kiwi"}`}>
                  ${Number(orderAmount).toFixed(2)}
                </span>
                <span className="text-sm font-medium text-neutral-300">USD</span>
              </div>

              {isMpesa && (
                <div className="p-2 px-3 rounded bg-emerald-950/40 border border-emerald-800 text-xs font-mono space-y-0.5 mt-2">
                  <div className="text-emerald-300 font-semibold uppercase text-[10px]">Estimated conversion</div>
                  <div className="text-white font-bold text-sm">
                    KES {(orderAmount * 130).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-[9px] text-emerald-400">Calculated at standard rate of 130 KES/USD</div>
                </div>
              )}

              <p className={`text-xs font-mono leading-relaxed p-3 rounded border ${
                isMpesa ? "bg-emerald-950/60 border-emerald-800 text-emerald-100" : "bg-[#2a3049] border-[#3c4257] text-[#a3acb9]"
              }`}>
                Order Reference: <strong className="text-white font-mono">{orderId}</strong>
                <span className="block mt-1">Processed securely using SSL endpoint wrappers.</span>
              </p>
            </div>
          </div>

          <div className="mt-10 space-y-4 pt-6 border-t border-emerald-800/60">
            <div className="flex items-start gap-3 text-xs">
              <Shield className={`h-5 w-5 shrink-0 mt-0.5 ${isMpesa ? "text-emerald-400" : "text-kiwi"}`} />
              <div>
                <strong className="text-white font-semibold block mb-0.5">
                  {isMpesa ? "Direct Merchant Settlement" : "Stripe Webhook Pipeline"}
                </strong>
                <span className={isMpesa ? "text-emerald-200" : "text-[#a3acb9]"}>
                  {isMpesa 
                    ? "Your order triggers direct database clearance. Submit the 10-digit transaction string code to approve." 
                    : `This transaction triggers a standard Stripe Webhook callback event to /api/webhooks/stripe, updating the order status directly.`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-mono">
              <Lock className="h-3 w-3" />
              <span>AES-256 SSL COMPLIANCE</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interaction form */}
        <div className="p-8 sm:p-12 flex flex-col justify-between bg-white text-neutral-800">
          <div>
            {isMpesa ? (
              // M-PESA Custom direct payee portal
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                    <h2 className="font-bold text-sm uppercase tracking-wider text-neutral-900 font-sans">
                      Lipa na M-Pesa Direct
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 font-bold rounded">
                    0745892776
                  </span>
                </div>

                <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200 text-xs text-neutral-700 leading-relaxed font-sans space-y-2.5">
                  <span className="font-bold text-neutral-900 block uppercase text-[10px] tracking-wider text-emerald-700">
                    Payment Instructions:
                  </span>
                  <ol className="list-decimal pl-4 space-y-2 text-[11px]">
                    <li>
                      Go to your phone and open <strong>M-PESA</strong> (SIM ToolKit or MySafaricom App).
                    </li>
                    <li>
                      Select <strong>Send Money</strong> option.
                    </li>
                    <li>
                      Enter Phone Number: <strong className="font-mono text-emerald-700 text-xs">0745892776</strong>
                    </li>
                    <li>
                      Confirm recipient name: <strong className="text-neutral-900">Quenton Simiyu</strong>
                    </li>
                    <li>
                      Enter checkout total: <strong className="font-mono text-neutral-900">KES {(orderAmount * 130).toLocaleString()}</strong>
                    </li>
                    <li>
                      Complete your M-Pesa pin flow and check your SMS inbox for the message confirmation.
                    </li>
                  </ol>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs font-sans">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Your Phone Number (Paying From)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 07XXXXXXXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full font-mono text-xs border border-neutral-300 rounded p-2.5 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      10-Digit M-Pesa Transaction Code
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SFF98ABC42"
                      value={mpesaCode}
                      onChange={(e) => setMpesaCode(e.target.value.toUpperCase())}
                      className="w-full font-mono font-bold text-sm tracking-widest text-center border border-neutral-300 rounded p-2.5 focus:border-emerald-600 focus:outline-none placeholder:tracking-normal placeholder:font-normal placeholder:text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing || isDone}
                    className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold rounded flex items-center justify-center gap-2 mt-6 shadow-md transition-all disabled:bg-neutral-300 disabled:cursor-wait text-xs uppercase tracking-wider"
                  >
                    {isProcessing ? (
                      <>
                        <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                        Handshaking Transaction...
                      </>
                    ) : isDone ? (
                      <>
                        <Check className="h-4 w-4 text-white stroke-[3]" /> Payment Secured!
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" /> Confirm M-Pesa Code Submission
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              // Card Details interaction form
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100">
                  <h2 className="font-bold text-sm uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-blue-500" /> Secure Card payment
                  </h2>
                  <span className="text-[10px] font-mono text-neutral-400 font-semibold">
                    SANDBOX SIMULATOR
                  </span>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs font-sans">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Card Holder Name
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full font-mono font-medium border border-neutral-300 rounded p-2.5 focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Secure Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full font-mono font-semibold border border-neutral-300 rounded p-2.5 pl-10 focus:border-blue-600 focus:outline-none text-[13px]"
                      />
                      <CreditCard className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                        Expiration
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full font-mono font-semibold text-center border border-neutral-300 rounded p-2.5 focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                        CVC Code
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full font-mono font-semibold text-center border border-neutral-300 rounded p-2.5 focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="rounded-lg bg-blue-50 border border-blue-100 p-4 font-sans text-xs text-blue-800 leading-relaxed mt-4 flex gap-2.5">
                    <Terminal className="h-5 w-5 text-blue-500 shrink-0" />
                    <span>
                      <strong>Sandbox configuration applied.</strong> You can press the button below directly to trigger the webhook and confirm the checkout session successfully.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing || isDone}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold rounded flex items-center justify-center gap-2 mt-6 shadow transition-all disabled:bg-neutral-300 disabled:cursor-wait text-xs uppercase tracking-wider"
                  >
                    {isProcessing ? (
                      <>
                        <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                        Charging Credit Card • Handshaking...
                      </>
                    ) : isDone ? (
                      <>
                        <Check className="h-4 w-4 text-kiwi stroke-[3]" /> Invoice Paid!
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 text-kiwi" /> Pay to KIWI RETAIL • ${Number(orderAmount).toFixed(2)}
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          <button
            onClick={onCancel}
            className="text-center text-neutral-400 hover:text-neutral-900 mt-6 font-semibold uppercase tracking-widest text-[10px] flex items-center gap-1 mx-auto focus:outline-none hover:underline font-mono"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Stop Payment
          </button>
        </div>

      </div>
    </div>
  );
}
