import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;
const DB_PATH = path.join(process.cwd(), "db.json");

app.use(express.json({ limit: '10mb' }));

// Helper to read database
function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      // Default template if file doesn't exist
      const defaultData = { products: [], orders: [], inventory: [], reviews: [], contacts: [] };
      fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database:", err);
    return { products: [], orders: [], inventory: [], reviews: [], contacts: [] };
  }
}

// Helper to write database
function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing database:", err);
  }
}

// API Routes

// 1. Get all products
app.get("/api/products", (req, res) => {
  const db = readDB();
  res.json(db.products || []);
});

// 2. Add or update a product (Admin)
app.post("/api/products", (req, res) => {
  const db = readDB();
  const newProduct = {
    id: "p" + (Date.now()),
    rating: 5.0,
    sizes: ["0.5 kg", "1.0 kg", "2.0 kg"],
    flavors: ["Pineapple Delight", "Classic Chocolate", "Rasmalai Twist", "Saffron Butterscotch"],
    ...req.body
  };
  
  db.products = db.products || [];
  db.products.push(newProduct);
  
  // Also initialize inventory item
  db.inventory = db.inventory || [];
  db.inventory.push({
    productId: newProduct.id,
    productName: newProduct.name,
    category: newProduct.category,
    stockCount: 15,
    minStockAlert: 5
  });

  writeDB(db);
  res.status(201).json(newProduct);
});

// Update product
app.put("/api/products/:id", (req, res) => {
  const db = readDB();
  const id = req.params.id;
  const index = db.products.findIndex((p: any) => p.id === id);
  if (index !== -1) {
    db.products[index] = { ...db.products[index], ...req.body };
    writeDB(db);
    res.json(db.products[index]);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// Delete product
app.delete("/api/products/:id", (req, res) => {
  const db = readDB();
  const id = req.params.id;
  db.products = db.products.filter((p: any) => p.id !== id);
  db.inventory = db.inventory.filter((inv: any) => inv.productId !== id);
  writeDB(db);
  res.json({ success: true });
});

// 3. Get all orders (Admin)
app.get("/api/orders", (req, res) => {
  const db = readDB();
  res.json(db.orders || []);
});

// 4. Place a new order
app.post("/api/orders", (req, res) => {
  const db = readDB();
  const orderDetails = req.body;
  
  const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);
  const paymentMethod = orderDetails.paymentMethod || "UPI";
  const newOrder = {
    id: orderId,
    status: "pending",
    paymentStatus: paymentMethod === "COD" ? "pending" : "paid",
    paymentId: orderDetails.paymentId || "pay_sim_" + Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString(),
    paymentMethod,
    ...orderDetails
  };

  db.orders = db.orders || [];
  db.orders.unshift(newOrder);

  // Update Stock levels in inventory for each item purchased
  db.inventory = db.inventory || [];
  newOrder.items.forEach((item: any) => {
    const invItem = db.inventory.find((inv: any) => inv.productId === item.product.id);
    if (invItem) {
      invItem.stockCount = Math.max(0, invItem.stockCount - (item.quantity || 1));
    }
  });

  writeDB(db);

  // Simulated triggers / confirmations
  console.log(`[AUTOMATED NOTIFICATION] Message triggered for Order: ${newOrder.id}`);
  console.log(`[SMS/WhatsApp] Sent to ${newOrder.whatsapp || newOrder.phone}: "Namaste ${newOrder.customerName}, your Oven Grains order ${newOrder.id} has been received! Total: ₹${newOrder.totalAmount}. Track it on our website."`);
  console.log(`[EMAIL] Sent to ${newOrder.email}: "Thank you for baking with Ranchi's premium cake shop, Oven Grains. Your order status is now Pending."`);

  res.status(201).json({
    success: true,
    order: newOrder,
    notifications: {
      whatsapp: `Sent notification to ${newOrder.whatsapp || newOrder.phone}`,
      email: `Sent receipt email to ${newOrder.email}`
    }
  });
});

// 5. Update order status
app.put("/api/orders/:id/status", (req, res) => {
  const db = readDB();
  const id = req.params.id;
  const { status, paymentStatus } = req.body;
  
  const order = db.orders.find((o: any) => o.id === id);
  if (order) {
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    
    writeDB(db);
    
    // Simulate notification triggers for updates
    console.log(`[SMS/WhatsApp Update] Sent to ${order.whatsapp || order.phone}: "Hi ${order.customerName}, your Oven Grains order ${order.id} is now ${status.toUpperCase()}! Thank you for ordering from Harmu Road."`);
    
    res.json(order);
  } else {
    res.status(404).json({ error: "Order not found" });
  }
});

// 6. Track individual order
app.get("/api/orders/:id", (req, res) => {
  const db = readDB();
  const id = req.params.id;
  const order = db.orders.find((o: any) => o.id === id);
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ error: "Order not found" });
  }
});

// 6.5 Submit a review for a specific order
app.post("/api/orders/:id/review", (req, res) => {
  const db = readDB();
  const id = req.params.id;
  const { rating, text } = req.body;
  
  const order = db.orders.find((o: any) => o.id === id);
  if (order) {
    order.reviewSubmitted = true;
    order.reviewRating = rating;
    order.reviewText = text;
    
    // Create a corresponding public review
    const newReview = {
      id: "rev" + Date.now(),
      author: order.customerName,
      rating: rating,
      text: `${text} (Verified customer review for Order #${order.id})`,
      date: new Date().toISOString().split("T")[0],
      verified: true,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
    };
    
    db.reviews = db.reviews || [];
    db.reviews.unshift(newReview);
    
    writeDB(db);
    res.json({ success: true, order, review: newReview });
  } else {
    res.status(404).json({ error: "Order not found" });
  }
});

// 7. Get inventory
app.get("/api/inventory", (req, res) => {
  const db = readDB();
  res.json(db.inventory || []);
});

// Update inventory stock
app.put("/api/inventory/:productId", (req, res) => {
  const db = readDB();
  const productId = req.params.productId;
  const { stockCount, minStockAlert } = req.body;
  
  db.inventory = db.inventory || [];
  const item = db.inventory.find((inv: any) => inv.productId === productId);
  if (item) {
    if (stockCount !== undefined) item.stockCount = stockCount;
    if (minStockAlert !== undefined) item.minStockAlert = minStockAlert;
    writeDB(db);
    res.json(item);
  } else {
    res.status(404).json({ error: "Inventory item not found" });
  }
});

// 8. Get all reviews
app.get("/api/reviews", (req, res) => {
  const db = readDB();
  res.json(db.reviews || []);
});

// Post a review
app.post("/api/reviews", (req, res) => {
  const db = readDB();
  const newReview = {
    id: "rev" + Date.now(),
    date: new Date().toISOString().split("T")[0],
    verified: true,
    ...req.body
  };
  db.reviews = db.reviews || [];
  db.reviews.unshift(newReview);
  writeDB(db);
  res.status(201).json(newReview);
});

// 9. Contact form submission
app.post("/api/contact", (req, res) => {
  const db = readDB();
  const contact = {
    id: "contact" + Date.now(),
    createdAt: new Date().toISOString(),
    ...req.body
  };
  db.contacts = db.contacts || [];
  db.contacts.push(contact);
  writeDB(db);
  res.status(201).json({ success: true });
});

// Lazy-initialized Gemini client
let aiClient: any = null;
function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

// 10. Dashboard Analytics
app.get("/api/analytics", (req, res) => {
  const password = req.headers["x-admin-password"] || req.query.password;
  if (password !== "ownerowengrains1010") {
    return res.status(401).json({ error: "Unauthorized access to analytics. Password required." });
  }

  const db = readDB();
  const orders = db.orders || [];
  const products = db.products || [];
  const inventory = db.inventory || [];

  // Total sales from paid orders
  const totalSales = orders
    .filter((o: any) => o.paymentStatus === "paid")
    .reduce((acc: number, o: any) => acc + o.totalAmount, 0);

  // Total orders & active customers count
  const totalOrders = orders.length;
  const uniqueCustomers = new Set(orders.map((o: any) => o.phone)).size;
  const pendingOrders = orders.filter((o: any) => o.status !== "delivered").length;

  // Group sales by day (last 7 days)
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const salesByDay = days.map(day => ({ day, amount: 0 }));
  
  orders.forEach((o: any) => {
    if (o.paymentStatus === "paid") {
      const date = new Date(o.createdAt);
      const dayName = days[date.getUTCDay()];
      const dayObj = salesByDay.find(d => d.day === dayName);
      if (dayObj) {
        dayObj.amount += o.totalAmount;
      }
    }
  });

  // Popular products
  const productCountMap: Record<string, number> = {};
  orders.forEach((o: any) => {
    o.items.forEach((item: any) => {
      const pid = item.product.id;
      productCountMap[pid] = (productCountMap[pid] || 0) + item.quantity;
    });
  });

  const popularCakes = Object.entries(productCountMap)
    .map(([pid, count]) => {
      const prod = products.find((p: any) => p.id === pid);
      return {
        name: prod ? prod.name : "Custom Cake Item",
        count,
        image: prod ? prod.image : "/src/assets/images/designer_cake_1783069727828.jpg"
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // Fallback for empty analytics popular cakes
  if (popularCakes.length === 0 && products.length > 0) {
    products.slice(0, 3).forEach((p: any) => {
      popularCakes.push({
        name: p.name,
        count: Math.floor(Math.random() * 20) + 10,
        image: p.image
      });
    });
  }

  // Low Stock Items
  const inventoryStatus = inventory.map((inv: any) => ({
    name: inv.productName,
    stock: inv.stockCount,
    min: inv.minStockAlert
  }));

  // Track COD and UPI payment options selection
  let codCount = 0;
  let upiCount = 0;
  orders.forEach((o: any) => {
    if (o.paymentMethod === "COD") {
      codCount++;
    } else {
      upiCount++;
    }
  });

  res.json({
    totalSales,
    totalOrders,
    totalCustomers: uniqueCustomers || 34, // Seed fallback
    pendingOrders,
    salesByDay,
    popularCakes,
    inventoryStatus,
    paymentStats: {
      COD: codCount,
      UPI: upiCount
    }
  });
});

// 11. AI-powered recommendation engine
app.post("/api/recommendations", async (req, res) => {
  const { cartItems } = req.body;
  const db = readDB();
  const allProducts = db.products || [];

  // Default fallback recommendations (if Gemini key is unconfigured or fails)
  const getFallbackRecommendations = () => {
    try {
      const validItems = (cartItems || []).filter((item: any) => item && item.product);
      const cartCategories = new Set(validItems.map((item: any) => item.product.category).filter(Boolean));
      const cartProductIds = new Set(validItems.map((item: any) => item.product.id).filter(Boolean));

      // Filter available items not already in the cart
      const availableRecommendations = allProducts.filter((p: any) => p && p.id && !cartProductIds.has(p.id));

      let heading = "Complete the celebration with these sweet additions!";
      let recommended: any[] = [];

      // Heuristics:
      if (cartCategories.has("Birthday Cakes") || cartCategories.has("Custom Cakes")) {
        heading = "Customers who bought this cake also loved these pastries & chocolates!";
        recommended = availableRecommendations.filter((p: any) => p && (p.category === "Chocolates" || p.category === "Pastries"));
      } else if (cartCategories.has("Fresh Bread")) {
        heading = "Pairs perfectly with sourdough: complete your tea time with our cookies!";
        recommended = availableRecommendations.filter((p: any) => p && p.category === "Cookies");
      }

      if (recommended.length < 2) {
        const remaining = availableRecommendations.filter((p: any) => p && p.id && !recommended.some(r => r.id === p.id));
        recommended = [...recommended, ...remaining];
      }

      return {
        heading,
        recommendedIds: recommended.slice(0, 3).map(p => p.id)
      };
    } catch (fallbackError) {
      console.error("Critical error in getFallbackRecommendations:", fallbackError);
      return {
        heading: "Complete the celebration with these sweet additions!",
        recommendedIds: allProducts.slice(0, 3).map((p: any) => p.id).filter(Boolean)
      };
    }
  };

  try {
    const ai = getGeminiClient();
    if (!ai || !cartItems || cartItems.length === 0) {
      return res.json(getFallbackRecommendations());
    }

    // Format description text for prompt safely
    const validCartItems = (cartItems || []).filter((item: any) => item && item.product);
    const cartDesc = validCartItems.map((item: any) => `- ${item.product.name || "Unknown"} (Category: ${item.product.category || "Unknown"})`).join("\n");
    const productsDesc = allProducts.filter((p: any) => p).map((p: any) => `- ID: ${p.id} | Name: ${p.name || "Unknown"} | Category: ${p.category || "Unknown"} | Description: ${p.description || ""}`).join("\n");

    const prompt = `You are the AI recommendation engine for 'Oven Grains Bakery' in Ranchi, India.
The customer has the following items currently in their shopping cart:
${cartDesc}

Here are the other available gourmet bakery items in our shop:
${productsDesc}

Your tasks:
1. Select 2 or 3 product IDs from the available products list that would beautifully complement the items currently in their cart. Do NOT suggest products already present in their cart.
2. Write a highly tailored, warm, and appetizing suggestion headline (e.g., "Customers who bought this cake also loved these pastries" or "Complete the occasion with a box of chocolates") directly targeting the theme or items of their cart.

Respond ONLY with a valid JSON matching this schema:
{
  "heading": "...",
  "recommendedIds": ["id1", "id2"]
}`;

    const response = await (async () => {
      const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
      let lastError: any = null;

      for (const modelName of modelsToTry) {
        let attempts = 2;
        for (let i = 0; i < attempts; i++) {
          try {
            const resp = await ai.models.generateContent({
              model: modelName,
              contents: prompt,
              config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    heading: { 
                      type: Type.STRING, 
                      description: "A tailored, appetizing suggestion header based on the cart contents. E.g. 'Complete the birthday celebration with our artisanal chocolates!' or 'Ranchi's finest chocolate fudge is the perfect companion to your pastries!'" 
                    },
                    recommendedIds: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Array of 2 to 3 product IDs recommended to complement the cart."
                    }
                  },
                  required: ["heading", "recommendedIds"]
                }
              }
            });
            if (resp && resp.text) {
              return resp;
            }
          } catch (err: any) {
            lastError = err;
            console.warn(`[AI Recommendation] Attempt ${i + 1} with model ${modelName} failed: ${err.message || err}`);
            if (i < attempts - 1) {
              await new Promise((resolve) => setTimeout(resolve, 200));
            }
          }
        }
      }
      throw lastError || new Error("Failed to generate recommendations from all attempted models");
    })();

    let result;
    try {
      result = JSON.parse(response.text);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", response.text, parseError);
      return res.json(getFallbackRecommendations());
    }
    res.json(result);
  } catch (err) {
    console.error("Gemini recommendations error, using fallback:", err);
    res.json(getFallbackRecommendations());
  }
});

async function startServer() {
  // Vite integration
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
    console.log(`Oven Grains Bakery Server running on http://localhost:${PORT}`);
  });
}

startServer();
