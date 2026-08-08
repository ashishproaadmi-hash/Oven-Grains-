import React, { useState, useEffect } from "react";
import { Sparkles, MessageSquare, Phone, MapPin, Award, ArrowUp } from "lucide-react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Menu from "./components/Menu";
import CakeCustomizer from "./components/CakeCustomizer";
import Cart from "./components/Cart";
import WishlistDrawer from "./components/WishlistDrawer";
import OrderTracker from "./components/OrderTracker";
import Reviews from "./components/Reviews";
import Contact from "./components/Contact";
import AdminDashboard from "./components/AdminDashboard";
import { Product, CartItem, Order, Review, InventoryItem, CustomizedCake, OrderStatus } from "./types";

export default function App() {
  // Global States
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>("home");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTrackingId, setActiveTrackingId] = useState<string | undefined>(undefined);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [preselectedCake, setPreselectedCake] = useState<Product | null>(null);

  // Load static catalog and reviews
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error loading products:", err));

    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("Error loading reviews:", err));

    // Load cart from localStorage
    const savedCart = localStorage.getItem("ovengrains_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Cart load issue", e);
      }
    }

    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem("ovengrains_wishlist");
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Wishlist load issue", e);
      }
    }

    // Scroll listener for back to top button
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Save cart to localStorage automatically
  const updateCartState = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("ovengrains_cart", JSON.stringify(newCart));
  };

  // Toggle products on wishlist
  const handleToggleWishlist = (productId: string) => {
    const updated = wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];
    setWishlist(updated);
    localStorage.setItem("ovengrains_wishlist", JSON.stringify(updated));
  };

  // Add standard product or custom cake to cart
  const handleAddToCart = (product: Product, quantity: number, customization?: CustomizedCake) => {
    const compositeId = customization 
      ? `${product.id}-${customization.size}-${customization.flavor}-${customization.eggless ? "veg" : "reg"}-${customization.message || ""}`
      : product.id;

    const existingIndex = cart.findIndex((item) => item.id === compositeId);

    if (existingIndex !== -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      updateCartState(updated);
    } else {
      const newItem: CartItem = {
        id: compositeId,
        product,
        quantity,
        customization
      };
      updateCartState([...cart, newItem]);
    }
  };

  // Special launcher helper when clicking custom from base item card
  const handleCustomizeClick = (product: Product) => {
    setPreselectedCake(product);
    // Navigate straight to customizer panel
    setCurrentSection("custom");
    const elem = document.getElementById("custom");
    if (elem) elem.scrollIntoView({ behavior: "smooth" });
  };

  // Customized Cake Submission to cart
  const handleAddCustomizedToCart = (customization: CustomizedCake, totalPrice: number) => {
    // Locate the matching base product
    const baseProduct = products.find(p => p.id === customization.productId) || products[0];
    if (!baseProduct) return;

    // Treat as a virtual custom product incorporating calculated weight/flavor modifications
    const virtualProduct: Product = {
      ...baseProduct,
      price: baseProduct.price // keep base price reference, pricing multiplier math handles it in Cart display
    };

    handleAddToCart(virtualProduct, 1, customization);
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    const updated = cart.map((item) => (item.id === id ? { ...item, quantity: newQty } : item));
    updateCartState(updated);
  };

  const handleRemoveItem = (id: string) => {
    const filtered = cart.filter((item) => item.id !== id);
    updateCartState(filtered);
  };

  const handleClearCart = () => {
    updateCartState([]);
  };

  // Order Submission to server
  const handlePlaceOrder = async (orderPayload: Partial<Order>): Promise<Order | null> => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (data.success) {
        return data.order;
      }
      return null;
    } catch (err) {
      console.error("Order submission error", err);
      return null;
    }
  };

  // Redirect to Order tracking state immediately on success
  const handleOrderSuccess = (order: Order) => {
    setActiveTrackingId(order.id);
    setCurrentSection("tracker");
    setTimeout(() => {
      const element = document.getElementById("tracker");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Add product (Admin action)
  const handleAddProduct = async (prodPayload: Partial<Product>): Promise<Product> => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prodPayload)
    });
    const added = await res.json();
    setProducts((prev) => [...prev, added]);
    return added;
  };

  // Update product (Admin action)
  const handleUpdateProduct = async (id: string, prodPayload: Partial<Product>): Promise<Product> => {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prodPayload)
    });
    const updated = await res.json();
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  // Delete product (Admin action)
  const handleDeleteProduct = async (id: string): Promise<boolean> => {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return true;
    }
    return false;
  };

  // Update Order Status (Admin action)
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus, paymentStatus?: 'pending' | 'paid'): Promise<Order> => {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, paymentStatus })
    });
    return await res.json();
  };

  // Update Inventory Item count (Admin action)
  const handleUpdateInventory = async (productId: string, stockCount: number): Promise<InventoryItem> => {
    const res = await fetch(`/api/inventory/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stockCount })
    });
    return await res.json();
  };

  // Post verified Review
  const handleAddReview = async (reviewPayload: Partial<Review>): Promise<Review> => {
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewPayload)
    });
    const added = await res.json();
    setReviews((prev) => [added, ...prev]);
    return added;
  };

  // Track an Order
  const handleTrackOrder = async (orderId: string): Promise<Order | null> => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  // Submit order feedback/review
  const handleAddOrderReview = async (orderId: string, rating: number, text: string): Promise<Order | null> => {
    try {
      const res = await fetch(`/api/orders/${orderId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, text })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          // Add the newly created review to general reviews state so it populates immediately
          setReviews((prev) => [data.review, ...prev]);
          return data.order;
        }
      }
      return null;
    } catch (e) {
      console.error("Failed to add order review", e);
      return null;
    }
  };

  // Navigate smooth scroll handler
  const handleNavigate = (sectionId: string) => {
    setIsAdmin(false); // return to user view if navigating
    setCurrentSection(sectionId);
    
    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fdfbf7] selection:bg-[#c29b38]/20 selection:text-[#3d271d]">
      
      {/* Sticky Topbar Navbar */}
      <Navbar
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        isAdmin={isAdmin}
        onToggleAdmin={() => {
          if (isAdmin) {
            setIsAdmin(false);
          } else {
            setIsLoginOpen(true);
            setLoginPassword("");
            setLoginError("");
          }
        }}
        currentSection={currentSection}
        onNavigate={handleNavigate}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

      {/* Primary Display Switcher */}
      {isAdmin ? (
        <main className="flex-grow">
          {/* Admin Dashboard */}
          <AdminDashboard
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdateInventory={handleUpdateInventory}
            adminPassword="ownerowengrains1010"
          />
        </main>
      ) : (
        <main className="flex-grow relative">
          
          {/* 1. Hero */}
          <Hero
            onOrderNow={() => handleNavigate("menu")}
            onCustomizeCake={() => handleNavigate("custom")}
          />

          {/* 2. About */}
          <About />

          {/* 3. Products Menu */}
          <Menu
            products={products}
            onAddToCart={handleAddToCart}
            onCustomizeClick={handleCustomizeClick}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />

          {/* 4. Cake Interactive Customizer Studio */}
          <CakeCustomizer
            products={products}
            onAddCustomizedToCart={handleAddCustomizedToCart}
            preselectedProduct={preselectedCake}
          />

          {/* 5. Live Order tracking */}
          <OrderTracker
            onTrackOrder={handleTrackOrder}
            activeTrackingId={activeTrackingId}
            onAddOrderReview={handleAddOrderReview}
          />

          {/* 6. Customer Reviews section */}
          <Reviews
            reviews={reviews}
            onAddReview={handleAddReview}
          />

          {/* 7. Contact Details and Map */}
          <Contact />

        </main>
      )}

      {/* Shared Slide-out Cart Drawer */}
      <Cart
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onPlaceOrder={handlePlaceOrder}
        onClearCart={handleClearCart}
        onOrderSuccess={handleOrderSuccess}
        products={products}
        onAddToCart={handleAddToCart}
      />

      {/* Shared Slide-out Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        products={products}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      {/* FOOTER SECTION */}
      <footer className="bg-[#3d271d] text-white py-12 border-t border-[#ffd700]/10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Slogan */}
          <div className="space-y-4">
            <span className="font-serif font-extrabold text-2xl text-white block tracking-tight">
              Oven Grains
            </span>
            <p className="text-[#ebdcb9] text-xs leading-relaxed">
              Baking freshly crafted happiness daily at Sahjanand Chowk, Harmu Road, Ranchi. 
              Enjoy Ranchi's favorite Pineapple, Rasmalai, and designer custom cakes under strict hygiene standards.
            </p>
            <span className="text-[10px] text-[#ffd700]/70 uppercase font-mono tracking-widest font-bold block">
              ★ 4.9 Star Local Rated Shop
            </span>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#ebdcb9]">Quick Links</h4>
            <ul className="text-xs space-y-2 text-[#f4ecd8]">
              <li><button onClick={() => handleNavigate("home")} className="hover:text-white cursor-pointer transition">Home Welcome</button></li>
              <li><button onClick={() => handleNavigate("about")} className="hover:text-white cursor-pointer transition">Our Story</button></li>
              <li><button onClick={() => handleNavigate("menu")} className="hover:text-white cursor-pointer transition">Bakery Menu</button></li>
              <li><button onClick={() => handleNavigate("custom")} className="hover:text-white cursor-pointer transition">Customizer Studio</button></li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#ebdcb9]">Our Categories</h4>
            <ul className="text-xs space-y-2 text-[#f4ecd8]">
              <li>Birthday & Anniversary Cakes</li>
              <li>Tiered Custom designer cakes</li>
              <li>Fresh Fusion cookies & pastries</li>
              <li>Natural sourdough country breads</li>
            </ul>
          </div>

          {/* Outlet Contact Details */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#ebdcb9]">Sahjanand Plaza Outlet</h4>
            <div className="text-xs text-[#f4ecd8] space-y-2.5">
              <p className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#ffd700] shrink-0" />
                Maa Laxmi Plaza, Sahjanand Chowk, Ranchi
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-[#ffd700] shrink-0" />
                <a href="tel:+919939123878" className="hover:underline">+91 99391 23878</a>
              </p>
              <p className="text-[10px] text-gray-300 font-mono mt-2">
                © {new Date().getFullYear()} Oven Grains Bakery. All rights reserved.
              </p>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating back to top trigger */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 left-6 z-40 p-3 rounded-full bg-[#3d271d] hover:bg-[#c29b38] text-white transition-all shadow-lg hover:shadow-xl cursor-pointer"
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </button>
      )}

      {/* OWNER PASSWORD LOGIN MODAL */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-[#ebdcb9]/60 text-[#3d271d] relative p-6 space-y-4 animate-scale-up">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-[#faf6ed] text-[#c29b38] rounded-full flex items-center justify-center mx-auto mb-2 border border-[#ebdcb9]/40">
                <span className="text-xl">🔐</span>
              </div>
              <h3 className="font-serif font-bold text-lg">Owner Command Portal</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Please enter your private passcode to unlock business analytics, active order queues, and catalog inventory.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (loginPassword === "ownerowengrains1010") {
                  setIsAdmin(true);
                  setIsLoginOpen(false);
                  setLoginPassword("");
                  setLoginError("");
                } else {
                  setLoginError("Unauthorized Key. Please verify and retry.");
                }
              }}
              className="space-y-3"
            >
              <div>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    if (loginError) setLoginError("");
                  }}
                  className="w-full px-4 py-3 bg-[#faf9f5] border border-gray-200 rounded-xl text-center text-sm focus:outline-none focus:ring-1 focus:ring-[#c29b38] font-mono tracking-widest placeholder-gray-300"
                  autoFocus
                />
                {loginError && (
                  <p className="text-[11px] text-red-500 font-bold text-center mt-1.5">
                    ⚠️ {loginError}
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginOpen(false);
                    setLoginPassword("");
                    setLoginError("");
                  }}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#3d271d] hover:bg-[#523527] text-[#ebdcb9] font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Verify Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
