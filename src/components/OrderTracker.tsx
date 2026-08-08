import React, { useState } from "react";
import { Search, Loader2, Award, Calendar, RefreshCw, MessageSquare, MapPin, Star } from "lucide-react";
import { Order, OrderStatus } from "../types";

interface OrderTrackerProps {
  onTrackOrder: (id: string) => Promise<Order | null>;
  activeTrackingId?: string;
  onClose?: () => void;
  onAddOrderReview?: (orderId: string, rating: number, text: string) => Promise<Order | null>;
}

export default function OrderTracker({ onTrackOrder, activeTrackingId, onClose, onAddOrderReview }: OrderTrackerProps) {
  const [searchId, setSearchId] = useState(activeTrackingId || "");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Review states
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmittedSuccess, setReviewSubmittedSuccess] = useState(false);

  // Auto search on load if an ID was passed in from active tracking
  React.useEffect(() => {
    if (activeTrackingId) {
      handleSearch(activeTrackingId);
    }
  }, [activeTrackingId]);

  const handleSearch = async (idToTrack: string) => {
    if (!idToTrack.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    setReviewSubmittedSuccess(false);

    try {
      const result = await onTrackOrder(idToTrack.trim());
      if (result) {
        setOrder(result);
        if (result.reviewSubmitted) {
          setReviewSubmittedSuccess(true);
        }
      } else {
        setError(`Order ${idToTrack} could not be found. Please check your spelling.`);
      }
    } catch (err) {
      console.error(err);
      setError("Server query failed. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !onAddOrderReview) return;
    setSubmittingReview(true);
    try {
      const updatedOrder = await onAddOrderReview(order.id, rating, reviewText);
      if (updatedOrder) {
        setOrder(updatedOrder);
        setReviewSubmittedSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case "pending": return 0;
      case "baking": return 1;
      case "ready": return 2;
      case "delivery": return 3;
      case "delivered": return 4;
      default: return 0;
    }
  };

  const steps = [
    { label: "Registered", desc: "Order confirmed by Oven Grains" },
    { label: "Baking", desc: "Sponges baking in our Harmu Road ovens" },
    { label: "Ready", desc: "Finished, iced, and packaged beautifully" },
    { label: "Out for Delivery", desc: "Entrusted to our speedy dispatch rider" },
    { label: "Delivered", desc: "Enjoy your freshly baked happiness!" }
  ];

  const currentStep = order ? getStatusStepIndex(order.status) : 0;

  return (
    <section id="tracker" className="py-12 bg-white border-b border-[#ebdcb9]/30">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Card Frame */}
        <div className="bg-[#fefdfa] p-6 sm:p-8 rounded-3xl shadow-lg border border-[#ebdcb9]/40 text-[#3d271d]">
          
          {/* Header */}
          <div className="text-center max-w-md mx-auto mb-8">
            <span className="text-[#c29b38] text-[10px] uppercase tracking-widest font-mono font-bold block mb-1">
              REAL-TIME STATUS
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-black">
              Track Your Oven Grains Order
            </h3>
            <p className="text-gray-500 text-xs mt-2">
              Input your 4-digit numeric ID (e.g., ORD-8942) found in your SMS/receipt.
            </p>
          </div>

          {/* Search box */}
          <div className="flex gap-2 max-w-md mx-auto mb-8">
            <div className="relative flex-grow">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. ORD-8942)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#c29b38]/30 focus:border-[#c29b38] font-mono bg-[#fafaf9]"
              />
            </div>
            <button
              onClick={() => handleSearch(searchId)}
              disabled={loading}
              className="bg-[#3d271d] hover:bg-[#523527] text-white px-5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                "Track"
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-center p-4 bg-red-50 text-red-800 rounded-xl text-xs border border-red-100 max-w-md mx-auto">
              {error}
            </div>
          )}

          {/* Dynamic tracking output detail */}
          {order && (
            <div className="space-y-8 animate-fade-in">
              
              {/* Order Meta details banner */}
              <div className="bg-[#faf6ed] p-4 rounded-xl border border-[#ebdcb9]/40 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#9d7e5d] block">
                    Baking Order Reference
                  </span>
                  <span className="font-mono text-base font-black text-[#3d271d] block">
                    {order.id}
                  </span>
                  <span className="text-[11px] text-gray-500 block flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Ordered on: {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block">
                    Customer Details
                  </span>
                  <span className="text-xs font-bold block">{order.customerName}</span>
                  <span className="text-xs text-gray-500 font-mono block">{order.phone}</span>
                </div>
              </div>

              {/* Multi-step progress bar visualizer */}
              <div className="relative py-4">
                {/* Connecting Track Line */}
                <div className="absolute top-8 left-4 right-4 sm:left-10 sm:right-10 h-1 bg-gray-200 -z-10 rounded-full">
                  <div
                    className="h-full bg-gradient-to-r from-[#c29b38] to-amber-500 transition-all duration-1000"
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                  />
                </div>

                {/* Steps points */}
                <div className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-4 relative z-10">
                  {steps.map((st, idx) => {
                    const isPassed = idx < currentStep;
                    const isActive = idx === currentStep;

                    return (
                      <div
                        key={idx}
                        className="flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center sm:w-1/5"
                      >
                        {/* Dot indicator */}
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition duration-700 shadow-sm shrink-0 border-2 ${
                            isPassed
                              ? "bg-gradient-to-br from-[#c29b38] to-amber-500 text-white border-transparent"
                              : isActive
                              ? "bg-[#3d271d] text-white border-[#3d271d] ring-4 ring-[#3d271d]/15 scale-110"
                              : "bg-white text-gray-400 border-gray-200"
                          }`}
                        >
                          {isPassed ? "✓" : idx + 1}
                        </div>

                        {/* Title & details label */}
                        <div>
                          <span
                            className={`font-serif text-xs font-bold block ${
                              isActive ? "text-[#c29b38] font-black text-sm" : "text-[#3d271d]"
                            }`}
                          >
                            {st.label}
                          </span>
                          <span className="text-[10px] text-gray-400 leading-tight block mt-0.5 max-w-[140px] sm:mx-auto">
                            {st.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ordered Items summary list */}
              <div className="border-t border-gray-100 pt-6">
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-3 font-mono">
                  Order Summary
                </span>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-[#fafbfd]/50 p-2.5 rounded-lg border border-gray-100 flex justify-between items-center text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="p-1 bg-white rounded border border-gray-100 font-bold text-[#c29b38]">
                          x{item.quantity}
                        </span>
                        <div>
                          <span className="font-bold text-[#3d271d]">{item.product.name}</span>
                          {item.customization && (
                            <span className="text-[10px] text-[#ebdcb9] bg-[#3d271d] px-1.5 py-0.5 rounded ml-2 inline-block font-mono uppercase font-bold text-[9px]">
                              Custom Styled
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="font-mono font-bold text-[#3d271d]">
                        ₹{item.product.price * item.quantity}
                      </span>
                    </div>
                  ))}
                  
                  {/* Delivery summary */}
                  <div className="flex justify-between text-xs pt-3 border-t border-dashed border-gray-100">
                    <span className="text-gray-500">Method:</span>
                    <span className="font-bold capitalize">{order.deliveryType}</span>
                  </div>
                  <div className="flex justify-between text-xs pb-1">
                    <span className="text-gray-500">Grand Total Paid:</span>
                    <span className="font-mono font-black text-sm text-[#c29b38]">₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* ORDER RATING & REVIEW FOR DELIVERED STATUS */}
              {order.status === "delivered" && (
                <div className="pt-6 border-t border-gray-100">
                  <div className="bg-[#fcfaf5] border-2 border-dashed border-[#c29b38]/40 p-6 rounded-2xl text-[#3d271d] space-y-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🎉</span>
                      <div>
                        <h4 className="font-serif font-black text-sm sm:text-base">
                          Rate Your Oven Grains Celebration!
                        </h4>
                        <p className="text-xs text-gray-500">
                          Your cake was freshly baked & delivered. Share your feedback with Ranchi!
                        </p>
                      </div>
                    </div>

                    {reviewSubmittedSuccess ? (
                      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center space-y-1">
                        <span className="text-2xl block">🌟</span>
                        <h5 className="font-bold text-emerald-800 text-xs">Thank you for your rating!</h5>
                        <p className="text-[11px] text-emerald-600">
                          Your review has been successfully added to our community wall. Enjoy your sweet memories!
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleReviewSubmit} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-600">Your Rating:</span>
                          <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="p-1 cursor-pointer transition hover:scale-110 flex items-center justify-center"
                                title={`${star} Stars`}
                              >
                                <Star
                                  className={`w-5 h-5 ${
                                    star <= rating
                                      ? "fill-[#ffd700] text-[#ffd700]"
                                      : "text-gray-300"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase font-bold text-gray-400">
                            Short Text Review
                          </label>
                          <textarea
                            required
                            rows={2}
                            placeholder="e.g. Absolutely delicious! Extremely fresh and perfect icing script. Ranchi's best bakery indeed!"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#c29b38] focus:border-[#c29b38] bg-white resize-none text-[#3d271d]"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="w-full py-2 bg-[#3d271d] hover:bg-[#523527] text-[#ebdcb9] hover:text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
                        >
                          {submittingReview ? "Submitting feedback..." : "Submit Verified Review"}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {/* AUTOMATED WHATSAPP CONFIRMATION LOGS BLOCK */}
              <div className="pt-6 border-t border-gray-100 bg-[#e5ddd5]/30 rounded-2xl p-4 border border-[#cfd4cf]/50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1 bg-[#25d366] text-white rounded-full">
                    <MessageSquare className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 font-mono">
                    Automated Confirmation Logs
                  </span>
                </div>
                
                <div className="space-y-2.5 font-mono text-[10px] text-gray-700">
                  <div className="bg-white p-2.5 rounded-xl shadow-sm max-w-xs relative border border-gray-100 text-left">
                    <span className="font-bold text-emerald-800 text-[9px] block mb-0.5">OVEN GRAINS • 12:42 PM</span>
                    "Namaste {order.customerName}, we have received your custom baking order <strong>{order.id}</strong>! Our master chefs at Harmu Road are initiating sponge aeration. Total: ₹{order.totalAmount}."
                  </div>

                  {currentStep >= 1 && (
                    <div className="bg-white p-2.5 rounded-xl shadow-sm max-w-xs relative border border-gray-100 text-left">
                      <span className="font-bold text-emerald-800 text-[9px] block mb-0.5">OVEN GRAINS • JUST NOW</span>
                      "Hi {order.customerName}, order <strong>{order.id}</strong> status is now updated: <strong>{steps[currentStep].label.toUpperCase()}</strong>! Fresh fragrances are filling Sahjanand Chowk!"
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* Quick info footer */}
          <div className="mt-8 border-t border-gray-100 pt-4 text-center text-[10px] text-gray-400 font-mono flex items-center justify-center gap-1">
            <RefreshCw className="w-3 h-3 animate-pulse text-[#c29b38]" />
            Live baking progress updates synchronized instantly.
          </div>

        </div>

      </div>
    </section>
  );
}
