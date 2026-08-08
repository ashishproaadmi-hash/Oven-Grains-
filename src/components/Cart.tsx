import React, { useState, useEffect } from "react";
import { X, Trash2, Shield, Sparkles, MapPin, Truck, Store, Check, CreditCard } from "lucide-react";
import { CartItem, Order, Product } from "../types";

interface CartProps {
  isOpen: boolean;
  cart: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (id: string, q: number) => void;
  onRemoveItem: (id: string) => void;
  onPlaceOrder: (orderData: Partial<Order>) => Promise<Order | null>;
  onClearCart: () => void;
  onOrderSuccess: (order: Order) => void;
  products: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function Cart({
  isOpen,
  cart,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onClearCart,
  onOrderSuccess,
  products,
  onAddToCart
}: CartProps) {
  // Form State
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'COD'>('UPI');

  // AI Recommendations
  const [recommendations, setRecommendations] = useState<{ heading: string; recommendedIds: string[] } | null>(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  useEffect(() => {
    if (cart.length === 0) {
      setRecommendations(null);
      return;
    }

    const fetchRecommendations = async () => {
      setLoadingRecommendations(true);
      try {
        const res = await fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartItems: cart })
        });
        const data = await res.json();
        setRecommendations(data);
      } catch (err) {
        console.error("Error loading AI recommendations:", err);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    const timer = setTimeout(() => {
      fetchRecommendations();
    }, 400);

    return () => clearTimeout(timer);
  }, [cart]);

  // Payment/Checkout Sim States
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  // Calculators
  const calculateSubtotal = () => {
    return cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  };

  const calculateCustomizationSurcharges = () => {
    let extra = 0;
    cart.forEach(item => {
      if (item.customization) {
        // Multipliers based on sizes
        let base = item.product.price;
        let scale = 1.0;
        const size = item.customization.size;
        if (size === "0.5 kg") scale = 0.85;
        if (size === "2.0 kg") scale = 1.8;
        if (size === "3.0 kg") scale = 2.6;
        if (size === "4.0 kg" || size === "5.0 kg") scale = 3.5;

        const customizedBase = Math.round(base * scale);
        // Added delta
        extra += (customizedBase - base) * item.quantity;
        
        // Add eggless option (+₹50)
        if (item.customization.eggless) {
          extra += 50 * item.quantity;
        }
        // Add photo upload (+₹200)
        if (item.customization.photoUrl) {
          extra += 200 * item.quantity;
        }
      }
    });
    return extra;
  };

  const deliveryCharge = deliveryType === "delivery" ? 60 : 0;
  const totalAmount = calculateSubtotal() + calculateCustomizationSurcharges() + deliveryCharge;

  // Handle Order Submit Initiation
  const handleCheckoutInit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    // Open payment simulation gateway
    setShowCheckoutModal(true);
  };

  // Complete Simulated Razorpay payment
  const handlePaymentSubmit = async () => {
    setPaymentProcessing(true);
    
    // Simulate payment API delay
    setTimeout(async () => {
      const paymentId = "pay_rzp_" + Math.random().toString(36).substring(2, 9).toUpperCase();
      
      const orderPayload: Partial<Order> = {
        items: cart,
        customerName: name,
        phone,
        whatsapp: whatsapp || phone, // fallback
        email,
        address: deliveryType === "delivery" ? address : "Store Pickup - Maa Laxmi Plaza, Harmu Road, Ranchi",
        deliveryType,
        totalAmount,
        paymentStatus: paymentMethod === "COD" ? "pending" : "paid",
        paymentId: paymentMethod === "COD" ? "COD_PENDING" : paymentId,
        paymentMethod,
        orderNotes
      };

      try {
        const order = await onPlaceOrder(orderPayload);
        if (order) {
          setPlacedOrder(order);
          setPaymentSuccess(true);
          setPaymentProcessing(false);
          
          // Clear cart local state & redirect
          setTimeout(() => {
            onClearCart();
            setShowCheckoutModal(false);
            setPaymentSuccess(false);
            onOrderSuccess(order);
            onClose();
          }, 2000);
        } else {
          setPaymentProcessing(false);
          alert("Something went wrong with order registration. Please try again.");
        }
      } catch (err) {
        console.error("Order placing error:", err);
        setPaymentProcessing(false);
      }
    }, 2200);
  };

  return (
    <>
      {/* Drawer Overlay backdrop */}
      <div
        className="fixed inset-0 z-50 bg-[#3d271d]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Cart Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-[#faf8f5] shadow-2xl flex flex-col justify-between h-full border-l border-[#ebdcb9]/40">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-6 bg-[#3d271d] text-white flex justify-between items-center border-b border-[#ffd700]/20">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#593c2f] rounded-lg text-[#ffd700]">
              🛍️
            </span>
            <div>
              <h2 className="font-serif font-bold text-lg sm:text-xl text-white">Your Bakery Cart</h2>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#ebdcb9]">
                Oven Grains Fresh Baking
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Cart Items List */}
          {cart.length > 0 ? (
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-wider font-bold text-gray-400 font-mono">
                Items Selected
              </span>
              
              {cart.map((item) => {
                // Compute total item pricing inclusive of customizations
                let price = item.product.price;
                if (item.customization) {
                  let scale = 1.0;
                  const size = item.customization.size;
                  if (size === "0.5 kg") scale = 0.85;
                  if (size === "2.0 kg") scale = 1.8;
                  if (size === "3.0 kg") scale = 2.6;
                  if (size === "4.0 kg" || size === "5.0 kg") scale = 3.5;
                  
                  price = Math.round(price * scale);
                  if (item.customization.eggless) price += 50;
                  if (item.customization.photoUrl) price += 200;
                }

                return (
                  <div
                    key={item.id}
                    className="bg-white p-3 rounded-xl border border-gray-100 flex gap-3 shadow-sm"
                  >
                    {/* Img Thumbnail */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 bg-[#faf6ed]">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Meta info */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif font-bold text-sm text-[#3d271d] leading-tight pr-4">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Customization Details Block if any */}
                        {item.customization ? (
                          <div className="mt-1 bg-[#faf6ed] p-2 rounded-lg text-[10px] text-[#5c4a40] space-y-0.5 border border-[#ebdcb9]/30">
                            <div className="flex justify-between">
                              <span className="font-semibold">Size:</span>
                              <span className="font-bold">{item.customization.size}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-semibold">Flavor:</span>
                              <span>{item.customization.flavor}</span>
                            </div>
                            {item.customization.message && (
                              <div className="flex justify-between font-serif text-emerald-800 italic">
                                <span>Icing:</span>
                                <span>"{item.customization.message}"</span>
                              </div>
                            )}
                            <div className="flex justify-between font-mono">
                              <span>Spec:</span>
                              <span>{item.customization.eggless ? "Eggless (Veg)" : "Regular"}</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-[10px] text-gray-400 mt-1">Standard Recipe Bakery Fresh</p>
                        )}
                      </div>

                      {/* Quantity & Item Subtotal */}
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                        {/* Quantity selector */}
                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 py-0.5 bg-gray-50">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="text-xs font-bold text-gray-500 hover:text-gray-900 w-4 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-mono font-semibold w-6 text-center text-[#3d271d]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="text-xs font-bold text-gray-500 hover:text-gray-900 w-4 cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <span className="font-serif font-black text-xs text-[#3d271d] font-mono">
                          ₹{price * item.quantity}
                        </span>
                      </div>

                    </div>

                  </div>
                );
              })}

              {/* AI-Powered Smart Recommendations Widget */}
              {recommendations && (
                <div className="bg-[#fdfbf7] p-4 rounded-2xl border border-dashed border-[#c29b38]/40 space-y-3 relative overflow-hidden mt-6">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#c29b38]/5 rounded-full blur-xl pointer-events-none" />
                  
                  <div className="flex items-center gap-1.5 text-xs text-[#3d271d] font-serif font-bold">
                    <Sparkles className="w-4 h-4 text-[#c29b38]" />
                    <span>{recommendations.heading || "Complete the occasion!"}</span>
                  </div>

                  {loadingRecommendations ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="w-5 h-5 rounded-full border-2 border-[#3d271d] border-t-[#c29b38] animate-spin" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {recommendations.recommendedIds?.map((recId) => {
                        const recProduct = products.find((p) => p.id === recId);
                        if (!recProduct) return null;

                        return (
                          <div
                            key={recId}
                            className="bg-white p-2.5 rounded-xl border border-gray-100 flex gap-2 items-center justify-between shadow-xs hover:shadow-sm transition"
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={recProduct.image}
                                alt={recProduct.name}
                                className="w-10 h-10 object-cover rounded-md"
                                referrerPolicy="no-referrer"
                              />
                              <div className="max-w-[120px]">
                                <span className="text-[10px] font-serif font-bold block truncate leading-tight text-[#3d271d]">
                                  {recProduct.name}
                                </span>
                                <span className="text-[9px] text-[#c29b38] font-mono">
                                  ₹{recProduct.price}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                onAddToCart(recProduct, 1);
                              }}
                              className="p-1 rounded-full bg-[#fdfbf7] hover:bg-[#3d271d] border border-gray-100 hover:border-[#3d271d] text-[#3d271d] hover:text-white transition cursor-pointer flex items-center justify-center"
                              title="Add recommendation to cart"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <span className="text-5xl block">🧁</span>
              <p className="font-serif text-[#3d271d] font-bold text-base">Your cart is currently empty</p>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Explore our signature fusion cakes, fresh pastries and sourdough artisan breads to place your order!
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-[#3d271d] hover:bg-[#593c2f] text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Start Exploring Menu
              </button>
            </div>
          )}

          {/* Checkout Ordering Details Form */}
          {cart.length > 0 && (
            <form onSubmit={handleCheckoutInit} className="space-y-4 border-t border-[#ebdcb9]/40 pt-6">
              <span className="text-xs uppercase tracking-wider font-bold text-gray-400 font-mono block">
                Order Delivery & Contact Details
              </span>

              {/* Delivery Type selector toggle */}
              <div className="grid grid-cols-2 gap-3 bg-white p-1 rounded-xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => setDeliveryType('delivery')}
                  className={`py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                    deliveryType === 'delivery'
                      ? "bg-[#3d271d] text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  Delivery (+₹60)
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryType('pickup')}
                  className={`py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                    deliveryType === 'pickup'
                      ? "bg-[#3d271d] text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Store className="w-4 h-4" />
                  Self-Pickup (Free)
                </button>
              </div>

              {/* Form Input Fields */}
              <div className="space-y-3 bg-white p-4 rounded-xl border border-gray-100">
                
                {/* Name */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1" htmlFor="cart-name-input">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    id="cart-name-input"
                    required
                    placeholder="e.g. Rohan Sen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#c29b38] focus:border-[#c29b38] bg-gray-50/35"
                  />
                </div>

                {/* Contact grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Phone */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1" htmlFor="cart-phone-input">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      id="cart-phone-input"
                      required
                      placeholder="e.g. +91 98451 12345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#c29b38] focus:border-[#c29b38] bg-gray-50/35"
                    />
                  </div>
                  
                  {/* WhatsApp */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1" htmlFor="cart-whatsapp-input">
                      WhatsApp Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        id="cart-whatsapp-input"
                        placeholder="Copy phone if same"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full pl-3 pr-16 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#c29b38] focus:border-[#c29b38] bg-gray-50/35"
                      />
                      <button
                        type="button"
                        onClick={() => setWhatsapp(phone)}
                        className="absolute right-1 top-1.5 px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-[9px] font-bold text-gray-500 cursor-pointer"
                      >
                        Same
                      </button>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1" htmlFor="cart-email-input">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="cart-email-input"
                    required
                    placeholder="e.g. rohan.sen@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#c29b38] focus:border-[#c29b38] bg-gray-50/35"
                  />
                </div>

                {/* Delivery Address (only if delivery is toggled) */}
                {deliveryType === 'delivery' && (
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1" htmlFor="cart-address-input">
                      Ranchi Delivery Address *
                    </label>
                    <textarea
                      id="cart-address-input"
                      required
                      rows={2.5}
                      placeholder="Flat/House No., Street Name, Landmark (e.g. Near Harmu Hospital, Ashok Nagar, Lalpur, Ranchi)"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#c29b38] focus:border-[#c29b38] bg-gray-50/35"
                    />
                  </div>
                )}

                {/* Order notes */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1" htmlFor="cart-notes-input">
                    Order Notes / Birthday Greeting Tag
                  </label>
                  <input
                    type="text"
                    id="cart-notes-input"
                    placeholder="e.g. Write Happy Anniversary card tag"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#c29b38] focus:border-[#c29b38] bg-gray-50/35"
                  />
                </div>

              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2 bg-white p-4 rounded-xl border border-gray-100">
                <span className="block text-[10px] uppercase tracking-wider font-bold text-gray-400">
                  Select Payment Method *
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`py-2 rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-1 transition border cursor-pointer ${
                      paymentMethod === 'UPI'
                        ? "bg-emerald-50 text-emerald-800 border-emerald-500 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    <span className="text-lg">📱</span>
                    <span className="text-[11px]">Pay via UPI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`py-2 rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-1 transition border cursor-pointer ${
                      paymentMethod === 'COD'
                        ? "bg-amber-50 text-amber-900 border-amber-500 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    <span className="text-lg">💵</span>
                    <span className="text-[11px]">Cash on Delivery (COD)</span>
                  </button>
                </div>
              </div>

              {/* Submit trigger button */}
              <button
                type="submit"
                id="cart-submit-btn"
                className="w-full py-3.5 bg-[#3d271d] hover:bg-[#523527] text-[#ebdcb9] hover:text-white font-bold rounded-xl shadow-lg transition duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4 text-[#ffd700]" />
                {paymentMethod === 'COD' ? 'Buy Now & Place Order (COD)' : 'Proceed to Secure Payment (UPI)'}
              </button>
            </form>
          )}

        </div>

        {/* Drawer Footer summary panel */}
        {cart.length > 0 && (
          <div className="bg-white p-4 sm:p-6 border-t border-gray-100 shadow-xl space-y-3">
            <div className="space-y-1.5 text-xs text-[#5c4a40]">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-mono">₹{calculateSubtotal()}</span>
              </div>
              <div className="flex justify-between">
                <span>Gourmet Customization Deltas:</span>
                <span className="font-mono">+₹{calculateCustomizationSurcharges()}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-gray-100">
                <span>Service/Delivery Surcharge:</span>
                <span className="font-mono">₹{deliveryCharge}</span>
              </div>
              <div className="flex justify-between pt-1.5 text-sm sm:text-base font-black text-[#3d271d]">
                <span className="font-serif">Grand Total amount:</span>
                <span className="font-mono text-lg text-[#c29b38]">₹{totalAmount}</span>
              </div>
            </div>

            <div className="flex gap-2 items-center justify-center text-[10px] text-gray-400">
              <Shield className="w-3.5 h-3.5 text-[#c29b38]" />
              Secure 256-bit encrypted checkout via Razorpay & Stripe
            </div>
          </div>
        )}

      </div>

      {/* RAZORPAY / STRIPE MOCK CHECKOUT MODAL WINDOW */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-[#ebdcb9]/50 text-[#3d271d] relative animate-scale-up">
            
            {/* Header */}
            <div className="bg-[#1c2438] p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-[#c29b38] text-white p-1 rounded font-black text-sm">RP</div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider">Razorpay Gateway</h3>
                  <span className="text-[10px] opacity-75">Oven Grains Bakery Ranchi</span>
                </div>
              </div>
              {!paymentProcessing && (
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Content body */}
            <div className="p-6 space-y-6">
              
              {paymentSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                    <Check className="w-8 h-8 font-black" />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-emerald-800">
                    {paymentMethod === "COD" ? "Order Placed Successfully!" : "Payment Authorized!"}
                  </h4>
                  <p className="text-xs text-[#5c4a40] max-w-xs mx-auto">
                    {paymentMethod === "COD"
                      ? `Your Cash on Delivery order of ₹${totalAmount} has been registered successfully.`
                      : `Your payment of ₹${totalAmount} has been secured successfully.`}
                    {" "}Order <strong>{placedOrder?.id}</strong> registered.
                  </p>
                  <div className="bg-[#faf6ed] p-3 rounded-xl inline-block border border-[#ebdcb9]/40">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#846338] block font-bold">
                      Tracking ID generated
                    </span>
                    <span className="font-mono text-sm font-black text-[#3d271d]">
                      {placedOrder?.id}
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Summary row */}
                  <div className="bg-[#faf9f5] p-4 rounded-xl border border-[#ebdcb9]/30 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold font-mono">
                        Transaction Amount
                      </span>
                      <span className="font-serif font-black text-xl text-[#3d271d] block font-mono">
                        ₹{totalAmount}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold font-mono">
                        Recipient Phone
                      </span>
                      <span className="text-xs font-bold text-gray-600 block truncate max-w-[160px]">
                        {phone}
                      </span>
                    </div>
                  </div>

                  {paymentMethod === "UPI" ? (
                    <div className="space-y-4 text-center">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-[#c29b38] font-mono block">
                          Instant Scan & Pay Gateway
                        </span>
                        <p className="text-[11px] text-gray-500">
                          Scan the dynamic QR code below using any UPI app (GPay, PhonePe, Paytm, BHIM) to authorize.
                        </p>
                      </div>

                      <div className="mx-auto w-40 h-40 bg-white p-2 rounded-2xl border-2 border-[#ebdcb9] flex flex-col items-center justify-center relative shadow-sm">
                        <svg className="w-full h-full text-[#3d271d]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
                          <rect x="10" y="10" width="20" height="20" rx="2" />
                          <rect x="14" y="14" width="12" height="12" rx="1" strokeWidth="2" />
                          <rect x="70" y="10" width="20" height="20" rx="2" />
                          <rect x="74" y="14" width="12" height="12" rx="1" strokeWidth="2" />
                          <rect x="10" y="70" width="20" height="20" rx="2" />
                          <rect x="14" y="74" width="12" height="12" rx="1" strokeWidth="2" />
                          <path d="M45 10 h10 v10 h-10 Z M45 30 h10 v5 h-10 Z M10 45 h15 v10 h-15 Z M70 45 h20 v10 h-20 Z" fill="currentColor" stroke="none" />
                          <path d="M40 40 h20 v20 h-20 Z" fill="none" strokeWidth="2" />
                          <path d="M45 45 h10 v10 h-10 Z M70 70 h5 v5 h-5 Z M85 85 h5 v5 h-5 Z" fill="currentColor" stroke="none" />
                          <path d="M55 70 h20 v10 h-20 Z M70 80 h10 v10 h-10 Z" fill="currentColor" stroke="none" />
                        </svg>
                        <div className="absolute inset-0 m-auto w-8 h-8 bg-white border border-[#ebdcb9] rounded-full flex items-center justify-center font-bold text-[8px] text-[#3d271d] shadow-sm">
                          OG
                        </div>
                      </div>

                      <div className="flex justify-center items-center gap-3 text-[10px] text-gray-400 font-mono">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md font-bold">Google Pay</span>
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md font-bold">PhonePe</span>
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-bold">Paytm</span>
                      </div>

                      <button
                        onClick={handlePaymentSubmit}
                        disabled={paymentProcessing}
                        className="w-full py-3 bg-[#3d271d] hover:bg-[#523527] text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        I Have Scanned & Paid
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-amber-800 font-mono block">
                          Cash on Delivery (COD) Verification
                        </span>
                        <p className="text-[11px] text-gray-500">
                          Please verify your address before completing the purchase. Our Harmu Road chefs will begin baking once dispatched.
                        </p>
                      </div>

                      <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/50 text-xs text-amber-900 space-y-1">
                        <div className="flex justify-between font-mono text-[10px]">
                          <span>Dispatch Address:</span>
                          <span className="font-bold truncate max-w-[200px]">
                            {deliveryType === "delivery" ? address : "Harmu Road Store Pickup"}
                          </span>
                        </div>
                        <div className="flex justify-between font-mono text-[10px]">
                          <span>Billing terms:</span>
                          <span className="font-bold">Pay ₹{totalAmount} cash/card on delivery</span>
                        </div>
                      </div>

                      <button
                        onClick={handlePaymentSubmit}
                        disabled={paymentProcessing}
                        className="w-full py-3 bg-amber-850 hover:bg-amber-900 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <span>🚚</span> Place Cash on Delivery Order
                      </button>
                    </div>
                  )}

                  {/* Processing display */}
                  {paymentProcessing && (
                    <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-6 space-y-4">
                      {/* Spinner */}
                      <div className="w-12 h-12 rounded-full border-4 border-[#3d271d] border-t-[#c29b38] animate-spin" />
                      <div className="text-center">
                        <span className="font-bold text-sm text-[#3d271d] block">
                          {paymentMethod === "COD" ? "Registering COD Order..." : "Contacting Razorpay Bank..."}
                        </span>
                        <span className="text-xs text-gray-400 mt-1 block">
                          {paymentMethod === "COD" 
                            ? "Logging order details in our bakery queue system. Please wait."
                            : "Securing connection & authorizing order. Please wait."}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}

            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 font-mono">
              <span>Merchant ID: MID-OVEN-GRAINS</span>
              <span>PCI-DSS Secured</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
