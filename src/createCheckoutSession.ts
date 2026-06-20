import { CartItem } from "./types";

interface CheckoutActionPayload {
  fullName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  gateway: "stripe" | "paystack" | "mpesa";
  cartItems: CartItem[];
}

interface CheckoutResponse {
  success: boolean;
  orderId: string;
  checkoutUrl: string;
}

/**
 * Server Action: createCheckoutSession
 * Coordinates with the backend API to securely calculate correct totals,
 * create a 'PENDING' Order in the database, and generate the Stripe/Paystack session URL.
 */
export async function createCheckoutSession(payload: CheckoutActionPayload): Promise<CheckoutResponse> {
  const { fullName, email, phone, shippingAddress, gateway, cartItems } = payload;

  if (!fullName || !email || !shippingAddress || !cartItems || cartItems.length === 0) {
    throw new Error("Missing critical checkout details required to establish secure invoice session.");
  }

  // Communicate with full-stack database route
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fullName,
      email,
      phone,
      shippingAddress,
      gateway,
      cartItems: cartItems.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || "Stripe checkout gateway returned a connection error.");
  }

  const data = await response.json();
  if (!data.success || !data.checkoutUrl) {
    throw new Error(data.message || "Failed to initialize standard checkout session handshake.");
  }

  return {
    success: true,
    orderId: data.orderId,
    checkoutUrl: data.checkoutUrl,
  };
}
