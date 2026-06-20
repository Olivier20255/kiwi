import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { PRODUCTS } from "./src/data"; // Import the initial products to seed the JSON DB!

interface OrderStore {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  subtotal: number;
  taxAmount: number;
  shippingFees: number;
  totalAmount: number;
  gateway: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

// Simple absolute database fallback files
const DB_ORDERS_PATH = path.join(process.cwd(), "db_orders.json");
const DB_PRODUCTS_PATH = path.join(process.cwd(), "db_products.json");

// Helper to load/save orders
function readOrders(): OrderStore[] {
  try {
    if (!fs.existsSync(DB_ORDERS_PATH)) {
      return [];
    }
    const data = fs.readFileSync(DB_ORDERS_PATH, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse orders json:", e);
    return [];
  }
}

function writeOrders(orders: OrderStore[]) {
  try {
    fs.writeFileSync(DB_ORDERS_PATH, JSON.stringify(orders, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write orders database:", e);
  }
}

// Helper to load/save products (Durable Cloud Persistence Simulator)
function readProducts(): any[] {
  try {
    if (!fs.existsSync(DB_PRODUCTS_PATH)) {
      // Seed initial catalog
      fs.writeFileSync(DB_PRODUCTS_PATH, JSON.stringify(PRODUCTS, null, 2), "utf-8");
      return PRODUCTS;
    }
    const data = fs.readFileSync(DB_PRODUCTS_PATH, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse products json database:", e);
    return PRODUCTS;
  }
}

function writeProducts(products: any[]) {
  try {
    fs.writeFileSync(DB_PRODUCTS_PATH, JSON.stringify(products, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write products database:", e);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // Set up initial database if not exists
  readProducts();

  // --- API ROUTE: Get all products ---
  app.get("/api/products", (req, res) => {
    try {
      const productsList = readProducts();
      return res.json(productsList);
    } catch (e) {
      console.error("Failed loading catalogue products:", e);
      return res.status(500).json({ message: "Unable to retrieve catalogue." });
    }
  });

  // --- API ROUTE: Create a product (Admin Mutation) ---
  app.post("/api/products", (req, res) => {
    try {
      const productPayload = req.body;
      if (!productPayload.name || !productPayload.basePrice) {
        return res.status(400).json({ message: "Title name and base price overrides are required attributes." });
      }

      const productsList = readProducts();
      
      const slug = productPayload.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      const newProduct = {
        id: `prod-${Date.now()}`,
        name: productPayload.name,
        slug,
        description: productPayload.description || "Tailored luxury essential curated by Kiwi CMS.",
        basePrice: Number(productPayload.basePrice),
        categoryId: productPayload.categoryId || "cat-tops",
        isFeatured: !!productPayload.isFeatured,
        isArchived: !!productPayload.isArchived,
        variants: (productPayload.variants || []).map((v: any, index: number) => ({
          id: `v-${Date.now()}-${index}`,
          sku: v.sku || `KW-${slug.substr(0,4).toUpperCase()}-${Date.now().toString().slice(-4)}`,
          color: v.color || "Standard Choice",
          size: v.size || "M",
          priceOverride: v.priceOverride ? Number(v.priceOverride) : undefined,
          stockQuantity: Number(v.stockQuantity || 0),
        })),
        images: (productPayload.images || []).map((imgUrl: string, idx: number) => ({
          id: `img-${Date.now()}-${idx}`,
          url: imgUrl,
          altText: `${productPayload.name} - Studio view ${idx + 1}`,
          order: idx,
        })),
        reviews: [],
        createdAt: new Date().toISOString().split("T")[0],
      };

      // Fallback images if list is empty
      if (newProduct.images.length === 0) {
        newProduct.images.push({
          id: `img-${Date.now()}-def`,
          url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800",
          altText: `${productPayload.name} - Core stock shot`,
          order: 0,
        });
      }

      productsList.push(newProduct);
      writeProducts(productsList);

      return res.status(201).json({ success: true, product: newProduct });
    } catch (e) {
      console.error("Error committing product creation:", e);
      return res.status(500).json({ message: "Intermittent database error while writing products." });
    }
  });

  // --- API ROUTE: Update product stock or fields ---
  app.put("/api/products/:id", (req, res) => {
    try {
      const productId = req.params.id;
      const { variants, isArchived, isFeatured, name, basePrice, description } = req.body;
      const productsList = readProducts();
      const matchIdx = productsList.findIndex((p) => p.id === productId);

      if (matchIdx === -1) {
        return res.status(404).json({ message: "No product matches this item ID." });
      }

      const current = productsList[matchIdx];

      if (variants) {
        // Support update of stock levels
        current.variants = current.variants.map((v: any) => {
          const matchOverride = variants.find((ov: any) => ov.id === v.id);
          if (matchOverride) {
            return {
              ...v,
              stockQuantity: typeof matchOverride.stockQuantity !== "undefined" ? Number(matchOverride.stockQuantity) : v.stockQuantity,
              sku: matchOverride.sku || v.sku,
              color: matchOverride.color || v.color,
              size: matchOverride.size || v.size,
              priceOverride: typeof matchOverride.priceOverride !== "undefined" ? Number(matchOverride.priceOverride) : v.priceOverride,
            };
          }
          return v;
        });
      }

      if (typeof isArchived !== "undefined") current.isArchived = !!isArchived;
      if (typeof isFeatured !== "undefined") current.isFeatured = !!isFeatured;
      if (name) current.name = name;
      if (basePrice) current.basePrice = Number(basePrice);
      if (description) current.description = description;

      productsList[matchIdx] = current;
      writeProducts(productsList);

      return res.json({ success: true, product: current });
    } catch (e) {
      console.error("Error handling product mutation:", e);
      return res.status(500).json({ message: "Intermittent storage update issue occurred." });
    }
  });

  // --- API ROUTE: Update individual stock level specifically (CMS Quick Override) ---
  app.put("/api/products/variants/:variantId", (req, res) => {
    try {
      const { variantId } = req.params;
      const { stockQuantity } = req.body;
      const productsList = readProducts();

      let found = false;
      for (let p of productsList) {
        const v = p.variants.find((v: any) => v.id === variantId);
        if (v) {
          v.stockQuantity = Number(stockQuantity);
          found = true;
          break;
        }
      }

      if (!found) {
        return res.status(404).json({ message: "Variant not discovered." });
      }

      writeProducts(productsList);
      return res.json({ success: true });
    } catch (e) {
      console.error("Failed to update stock via quick tools:", e);
      return res.status(500).json({ message: "Stock write issue." });
    }
  });

  // --- API ROUTE: Handshake Checkout Session ---
  app.post("/api/checkout", (req, res) => {
    try {
      const { fullName, email, phone, shippingAddress, gateway, cartItems } = req.body;

      if (!fullName || !email || !shippingAddress || !cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: "Incomplete shipping information coordinates." });
      }

      const orderId = `KIWI-${Math.floor(100000 + Math.random() * 900000)}`;
      
      let subtotal = 0;
      subtotal = cartItems.reduce((acc: number, item: any) => {
        // Resolve product in catalogue securely
        const productsList = readProducts();
        const p = productsList.find((p) => p.id === item.productId);
        const v = p?.variants.find((v: any) => v.id === item.variantId);
        const price = v?.priceOverride ? Number(v.priceOverride) : (p?.basePrice || 150);
        return acc + (price * item.quantity); 
      }, 0);

      const isFree = subtotal >= 150;
      const shippingFees = subtotal > 0 ? (isFree ? 0 : 15) : 0;
      const taxAmount = subtotal * 0.08;
      const totalAmount = subtotal + shippingFees + taxAmount;

      const newOrder: OrderStore = {
        id: orderId,
        fullName,
        email,
        phone,
        shippingAddress,
        subtotal,
        taxAmount,
        shippingFees,
        totalAmount,
        gateway: gateway || "stripe",
        status: "PENDING",
        paymentStatus: "PENDING",
        createdAt: new Date().toISOString(),
      };

      const orders = readOrders();
      orders.push(newOrder);
      writeOrders(orders);

      const checkoutUrl = `#/checkout-gateway-fallback?orderId=${orderId}&gateway=${gateway || "stripe"}`;

      return res.json({
        success: true,
        orderId,
        checkoutUrl,
      });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ message: "Server action failed executing checkouts." });
    }
  });

  // --- API ROUTE: Retrieve single order details ---
  app.get("/api/orders/:id", (req, res) => {
    const orders = readOrders();
    const order = orders.find((o) => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ message: "No blueprint matching this order code found." });
    }
    res.json(order);
  });

  // --- API ROUTE: Update order using backend simulated Webhooks ---
  app.post("/api/webhooks/stripe", (req, res) => {
    try {
      const payload = req.body;
      let orderId = "";

      if (payload.type === "checkout.session.completed") {
        orderId = payload.data?.object?.metadata?.orderId || "";
      } else {
        orderId = payload.orderId || "";
      }

      if (!orderId) {
        return res.status(400).json({ received: false, error: "No order index coordinates found in payload structures." });
      }

      const orders = readOrders();
      const matchIdx = orders.findIndex((o) => o.id === orderId);
      if (matchIdx > -1) {
        orders[matchIdx].status = "PAID";
        orders[matchIdx].paymentStatus = "PAID";
        writeOrders(orders);
        console.log(`[Webhooks SSL] Successful payment confirmation for ${orderId}`);
        return res.json({ received: true, orderId, updated: true });
      }

      res.status(404).json({ received: false, error: "No matching order code recorded." });
    } catch (e) {
      console.error("Webhook processing problem:", e);
      res.status(500).json({ error: "Intermittent handler exception." });
    }
  });

  // --- Integration with Vite Bundler / Static Engine ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[KIWI Full-Stack Server] Active on port ${PORT}`);
  });
}

startServer();
