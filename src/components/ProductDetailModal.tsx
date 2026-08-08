import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  ShoppingCart, 
  Check, 
  Sparkles, 
  Heart, 
  Star, 
  ShieldCheck, 
  Award, 
  Clock, 
  Plus, 
  Minus, 
  Flame, 
  Camera, 
  Info,
  Gift,
  MapPin
} from "lucide-react";
import { Product, CustomizedCake } from "../types";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, customization?: any) => void;
  onCustomizeClick: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onCustomizeClick,
  isWishlisted,
  onToggleWishlist
}: ProductDetailModalProps) {
  // Option selections
  const [selectedSize, setSelectedSize] = useState("1.0 kg");
  const [selectedFlavor, setSelectedFlavor] = useState("");
  const [isEggless, setIsEggless] = useState(true);
  const [cakeMessage, setCakeMessage] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [photoCakeUpgrade, setPhotoCakeUpgrade] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  
  // Cart & Quantities
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  
  // Urgency Timer state (e.g. 9 mins, 54 secs)
  const [timeLeft, setTimeLeft] = useState(594); 
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize options based on product
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || "1.0 kg");
      setSelectedFlavor(product.flavors?.[0] || "Standard Deluxe");
      setIsEggless(true); // default to Veg in Ranchi context
      setCakeMessage("");
      setSpecialInstructions("");
      setPhotoCakeUpgrade(false);
      setUploadedPhoto(null);
      setQuantity(1);
    }
  }, [product, isOpen]);

  // Urgency Timer ticks when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 594));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!product) return null;

  const isCake = product.category === "Birthday Cakes" || product.category === "Custom Cakes";

  // Predefined quick phrases for text on cake
  const quickPhrases = [
    "Happy Birthday!",
    "Happy Anniversary",
    "Best Wishes",
    "I Love You",
    "Congratulations"
  ];

  // Helper to read and encode custom image
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPhoto(reader.result as string);
        setPhotoCakeUpgrade(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Pricing math aligned with Cart.tsx
  const getCalculatedPrice = () => {
    let base = product.price;
    let scale = 1.0;
    
    if (selectedSize === "0.5 kg") scale = 0.85;
    if (selectedSize === "2.0 kg") scale = 1.8;
    if (selectedSize === "3.0 kg") scale = 2.6;
    if (selectedSize === "4.0 kg" || selectedSize === "5.0 kg") scale = 3.5;

    let total = Math.round(base * scale);
    
    if (isEggless && isCake) {
      total += 50;
    }
    if (photoCakeUpgrade && uploadedPhoto) {
      total += 200;
    }
    
    return total;
  };

  const currentUnitPrice = getCalculatedPrice();
  const subtotal = currentUnitPrice * quantity;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleAddToCartClick = () => {
    // Compile customization parameters
    const customization: CustomizedCake | undefined = isCake ? {
      productId: product.id,
      productName: product.name,
      size: selectedSize,
      flavor: selectedFlavor,
      message: cakeMessage,
      eggless: isEggless,
      photoUrl: photoCakeUpgrade ? (uploadedPhoto || "uploaded") : undefined,
      specialInstructions: specialInstructions || undefined
    } : undefined;

    onAddToCart(product, quantity, customization);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose(); // Auto close on successful conversion
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 overflow-y-auto">
          {/* Backdrop blur layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#120a07]/80 backdrop-blur-md"
            id="modal-backdrop"
          />

          {/* Modal Content Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="relative bg-white w-full max-w-5xl rounded-[32px] overflow-hidden shadow-2xl border border-[#c29b38]/20 z-10 grid grid-cols-1 lg:grid-cols-12 flex-shrink-0"
            id={`product-detail-modal-${product.id}`}
          >
            {/* Close Button absolute */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 hover:bg-[#3d271d] text-[#3d271d] hover:text-white transition-all duration-200 z-30 shadow-lg cursor-pointer flex items-center justify-center"
              title="Close modal"
              id="close-modal-btn"
            >
              <X className="w-5 h-5" />
            </button>

            {/* LEFT COLUMN: VISUAL EXPERIENCE & LIVE INTERACTIVE PREVIEW */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#1c110b] to-[#120a07] relative min-h-[340px] lg:min-h-full flex flex-col justify-between overflow-hidden p-6 text-white border-b lg:border-b-0 lg:border-r border-[#c29b38]/15">
              
              {/* Premium Glow effect */}
              <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#c29b38]/10 filter blur-3xl pointer-events-none" />
              
              {/* Top info and status */}
              <div className="relative z-10 flex flex-col gap-2 pointer-events-none">
                <div className="flex gap-2">
                  {product.isSignature && (
                    <span className="bg-[#c29b38] text-[#120a07] text-[9px] uppercase font-black tracking-widest px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#120a07]" />
                      OVEN GRAINS SIGNATURE
                    </span>
                  )}
                  <span className="bg-white/10 backdrop-blur-sm text-amber-300 text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border border-white/5 shadow">
                    ★ {product.rating.toFixed(1)} Loved Locally
                  </span>
                </div>
              </div>

              {/* LIVE PREVIEW CANVAS AREA */}
              <div className="relative z-10 my-auto py-6 flex flex-col items-center justify-center">
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-[28px] overflow-hidden shadow-2xl border-4 border-white/10 group bg-amber-50/5">
                  
                  {/* Base product image */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />

                  {/* 100% Veg Dot indicator overlaid */}
                  {isEggless && isCake && (
                    <div className="absolute top-3 right-3 bg-white/95 px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-md border border-emerald-500/30">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white flex-shrink-0 animate-pulse" />
                      <span className="text-[9px] font-black tracking-widest text-emerald-800">EGGLESS</span>
                    </div>
                  )}

                  {/* INTERACTIVE TEXT WRITING OVERLAY */}
                  {isCake && cakeMessage.trim() && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-x-4 bottom-8 z-20 bg-amber-950/80 backdrop-blur-sm text-amber-100 py-2.5 px-4 rounded-2xl shadow-xl text-center border border-[#ebdcb9]/30 mx-auto max-w-[220px]"
                    >
                      <span className="block text-[8px] uppercase tracking-widest text-[#c29b38] font-bold mb-0.5">Icing script preview</span>
                      <p className="font-serif italic font-extrabold text-sm text-amber-50 tracking-wide line-clamp-2 shadow-sm break-all leading-snug">
                        "{cakeMessage}"
                      </p>
                    </motion.div>
                  )}

                  {/* PHOTO CAKE UPGRADE CIRCULAR PREVIEW OVERLAY */}
                  {isCake && photoCakeUpgrade && uploadedPhoto && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="absolute inset-0 m-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-dashed border-[#c29b38]/80 shadow-2xl overflow-hidden bg-white/10 flex items-center justify-center pointer-events-none"
                    >
                      <img 
                        src={uploadedPhoto} 
                        alt="Photo edible sheet preview" 
                        className="w-full h-full object-cover rounded-full"
                      />
                      <div className="absolute inset-0 bg-black/10 rounded-full" />
                      <span className="absolute bottom-1 bg-amber-950 text-[#ebdcb9] text-[7px] font-black tracking-widest px-1.5 py-0.5 rounded-full uppercase scale-90 border border-amber-800">
                        Edible Photo
                      </span>
                    </motion.div>
                  )}

                  {/* Ambient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                </div>

                <p className="text-[11px] text-gray-400 mt-3 font-medium tracking-wide">
                  {isCake ? "✨ Customize cake options on the right to see instant preview" : "🧁 Freshly baked today at Ranchi baking hub"}
                </p>
              </div>

              {/* Dynamic Bottom Info / Quick Trust Pillars */}
              <div className="relative z-10 pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-[#c29b38]/15 text-[#ebdcb9] p-2 rounded-xl border border-[#c29b38]/20 shrink-0">
                    <MapPin className="w-4 h-4 text-[#c29b38]" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-mono">Baking Station Location</span>
                    <span className="text-xs font-bold text-white">Sahjanand Chowk, Harmu Road, Ranchi</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#ebdcb9] bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                  <span className="opacity-85 font-semibold">Total Unit Value:</span>
                  <span className="font-serif font-black text-amber-300 text-sm">₹{currentUnitPrice}</span>
                </div>
              </div>

              {/* Floating Wishlist Heart */}
              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                className="absolute bottom-20 right-6 z-20 bg-[#21140e] border border-[#c29b38]/25 hover:border-[#c29b38] p-3 rounded-full shadow-lg hover:scale-110 transition text-rose-500 cursor-pointer flex items-center justify-center"
                title="Add to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-rose-500 text-rose-500" : "text-gray-400"}`} />
              </button>
            </div>

            {/* RIGHT COLUMN: RICH CONVERTING SPECIFICATION & ADD-TO-TRAY FLOW */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] lg:max-h-[720px] overflow-y-auto scrollbar-thin bg-white">
              
              <div className="space-y-6">
                
                {/* Back to Menu Link */}
                <button
                  onClick={() => {
                    onClose();
                    const menuEl = document.getElementById("menu");
                    if (menuEl) {
                      menuEl.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8d6e63] hover:text-[#3d271d] transition cursor-pointer mb-1 group/back"
                  id="back-to-menu-btn"
                >
                  <span className="transition-transform group-hover/back:-translate-x-1">←</span> Back to Menu
                </button>

                {/* Product Header details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-widest bg-amber-50 text-amber-800 px-2.5 py-1 rounded-md border border-amber-200">
                      {product.category}
                    </span>
                    <span className="text-[9px] text-emerald-600 font-extrabold flex items-center gap-1 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Fresh Slot Guaranteed
                    </span>
                  </div>

                  <h3 className="font-serif font-black text-2xl sm:text-3xl text-[#120a07] tracking-tight">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-[#c29b38]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-3.5 h-3.5 fill-current"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 font-bold">
                      5.0 rating • 312+ happy celebrations
                    </span>
                  </div>
                </div>

                {/* Gourmet Description */}
                <div className="bg-[#faf8f4] p-4 rounded-2xl border border-[#ebdcb9]/15 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block font-mono">
                    Baker's Composition Note
                  </span>
                  <p className="text-xs sm:text-sm text-[#4a3a31] leading-relaxed font-sans font-medium">
                    {product.description}
                  </p>
                </div>

                {/* DYNAMIC COUNTDOWN URGENCY FOR FREE CELEBRATION KIT */}
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-3 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#c29b38]/5 rounded-bl-full pointer-events-none" />
                  <div className="bg-[#c29b38] text-[#120a07] p-2.5 rounded-xl shrink-0 animate-bounce">
                    <Gift className="w-5 h-5 text-[#120a07]" />
                  </div>
                  <div className="flex-grow space-y-0.5">
                    <p className="text-xs font-black text-[#120a07] uppercase tracking-wide flex items-center gap-1.5">
                      <span>Limited Celebration Offer!</span>
                      <span className="bg-[#120a07] text-amber-300 text-[8px] font-mono px-1.5 py-0.5 rounded-md animate-pulse">
                        {formatTime(timeLeft)}
                      </span>
                    </p>
                    <p className="text-[11px] text-[#4a3a31] font-medium leading-relaxed">
                      Order in the next {formatTime(timeLeft)} mins to receive a <strong>FREE Sparkler Candle box & Gold Metallic Topper set</strong> inside your celebration bundle!
                    </p>
                  </div>
                </div>

                {/* CAKE INTERACTIVE CUSTOMIZERS IF APPLICABLE */}
                {isCake ? (
                  <div className="space-y-5 border-t border-gray-100 pt-5">
                    <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest font-mono">
                      Personalize Your Celebration Cake
                    </h4>

                    {/* 1. Size Selection (Bento Tiles) */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#120a07] flex justify-between">
                        <span>Select Cake Weight</span>
                        <span className="text-gray-400 font-normal">Surcharge updates below</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "0.5 kg", desc: "Serves 3-5", label: "0.5 kg (Mini)" },
                          { id: "1.0 kg", desc: "Serves 8-12", label: "1.0 kg (Best!)" },
                          { id: "2.0 kg", desc: "Serves 15-20", label: "2.0 kg (Party)" }
                        ].map((sz) => (
                          <button
                            key={sz.id}
                            type="button"
                            onClick={() => setSelectedSize(sz.id)}
                            className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-center items-center ${
                              selectedSize === sz.id
                                ? "bg-[#3d271d] border-[#3d271d] text-white shadow-md"
                                : "bg-white border-gray-200 text-[#4a3a31] hover:bg-gray-50"
                            }`}
                          >
                            <span className="text-xs font-bold font-mono block">{sz.label}</span>
                            <span className={`text-[9px] mt-0.5 ${selectedSize === sz.id ? "text-amber-300" : "text-gray-400"}`}>
                              {sz.desc}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. Recipe Option (Purity Vegetarian Toggle) */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#120a07] block">
                        Recipe Preparation
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {/* Veg / Eggless Option */}
                        <button
                          type="button"
                          onClick={() => setIsEggless(true)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                            isEggless
                              ? "bg-emerald-50/70 border-emerald-500 text-emerald-950 shadow-sm"
                              : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {/* Veg Green square box */}
                            <div className="w-4 h-4 border-2 border-emerald-600 flex items-center justify-center p-0.5 rounded-sm shrink-0">
                              <div className="w-2 h-2 rounded-full bg-emerald-600" />
                            </div>
                            <div>
                              <span className="text-xs font-bold block">100% Pure Veg (Eggless)</span>
                              <span className="text-[9px] opacity-75">Eggless sponge recipe</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md shrink-0">
                            +₹50
                          </span>
                        </button>

                        {/* Standard Option */}
                        <button
                          type="button"
                          onClick={() => setIsEggless(false)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                            !isEggless
                              ? "bg-[#3d271d] border-[#3d271d] text-white shadow-sm"
                              : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold block">Regular Sponge</span>
                            <span className="text-[9px] opacity-75">Traditional bakers recipe</span>
                          </div>
                          <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md shrink-0">
                            +₹0
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* 3. Flavor Picker */}
                    {product.flavors && product.flavors.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#120a07] block">
                          Gourmet Flavor Choice
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {product.flavors.map((fl) => (
                            <button
                              key={fl}
                              type="button"
                              onClick={() => setSelectedFlavor(fl)}
                              className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                selectedFlavor === fl
                                  ? "bg-amber-950 border-amber-950 text-white shadow-sm"
                                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                              }`}
                            >
                              🍰 {fl}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 4. Text on Cake Input (Custom Message) */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-[#120a07] block">
                          Text/Message on Cake (Max 35 Characters)
                        </label>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {cakeMessage.length}/35
                        </span>
                      </div>
                      
                      <input
                        type="text"
                        maxLength={35}
                        placeholder="e.g. Happy Birthday Rohit!"
                        value={cakeMessage}
                        onChange={(e) => setCakeMessage(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3d271d]/20 focus:border-[#3d271d] text-xs bg-gray-50/50 text-[#120a07]"
                      />

                      {/* Instant Presets buttons for conversion */}
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {quickPhrases.map((phrase) => (
                          <button
                            key={phrase}
                            type="button"
                            onClick={() => setCakeMessage(phrase)}
                            className="px-2.5 py-1 bg-gray-100 hover:bg-amber-100 text-[#4a3a31] hover:text-[#120a07] rounded-lg text-[10px] font-bold transition cursor-pointer"
                          >
                            + {phrase}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 5. PHOTO CAKE UPGRADE TRIGGER */}
                    <div className="space-y-2 border-t border-dashed border-gray-100 pt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xs font-black text-[#120a07] flex items-center gap-1.5">
                            <Camera className="w-4 h-4 text-[#c29b38]" />
                            Edible Photo Cake Upgrade
                          </span>
                          <span className="text-[10px] text-gray-400 block font-medium">Upload photos to print on sugar sheet</span>
                        </div>
                        <span className="text-[11px] font-mono font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                          +₹200
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-3 border-2 border-dashed border-gray-200 hover:border-[#c29b38] rounded-xl text-xs font-bold text-gray-500 hover:text-[#3d271d] transition bg-gray-50 flex items-center gap-2 cursor-pointer"
                        >
                          <Camera className="w-4 h-4 shrink-0" />
                          <span>{uploadedPhoto ? "Change Custom Photo" : "Select Photo File"}</span>
                        </button>

                        {uploadedPhoto && (
                          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 py-1 px-2.5 rounded-xl">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-[10px] font-bold text-emerald-800">Photo Loaded!</span>
                            <button
                              type="button"
                              onClick={() => {
                                setUploadedPhoto(null);
                                setPhotoCakeUpgrade(false);
                              }}
                              className="text-gray-400 hover:text-red-500 font-bold text-xs ml-1 font-mono"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 6. Special Baking Instructions */}
                    <div className="space-y-1.5 pt-2">
                      <label className="text-xs font-bold text-[#120a07] block">
                        Special Instructions for Bakery (Optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Please make it less sweet, write with white cream, delivery strictly by 4 PM."
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3d271d]/20 focus:border-[#3d271d] text-xs bg-gray-50/50 text-[#120a07] resize-none"
                      />
                    </div>

                  </div>
                ) : null}

                {/* HIGH CONVERTING TRUST ASSURANCES CARD */}
                <div className="bg-[#eaf5eb]/70 p-4 rounded-2xl border border-emerald-100 space-y-2 pt-3.5">
                  <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest font-mono flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Oven Grains Ranchi Purity Promise
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#2c3d2c]">
                    <div className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Baked On Delivery Day</strong>: Baked fresh for your event.</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Eggless Hygiene Certified</strong>: Distinct baking utensils.</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-emerald-950 sm:col-span-2">
                      <Clock className="w-3.5 h-3.5 text-[#c29b38] shrink-0 mt-0.5 fill-amber-100" />
                      <span><strong>Ranchi Fast Transit</strong>: Handcrafted at Sahjanand Chowk & delivered fast across Harmu, Lalpur, Kanke & Argora.</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* ACTION FOOTER BAR */}
              <div className="mt-8 pt-5 border-t border-gray-100 space-y-4 shrink-0 bg-white">
                
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#120a07] uppercase tracking-wide">Adjust Quantity</span>
                  
                  {/* Plus/Minus counter */}
                  <div className="flex items-center gap-3.5 border border-gray-200 rounded-xl px-3 py-1.5 bg-gray-50 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-lg font-bold text-[#3d271d] hover:text-[#c29b38] w-5 h-5 flex items-center justify-center cursor-pointer transition"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-mono font-black w-6 text-center text-[#3d271d]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-lg font-bold text-[#3d271d] hover:text-[#c29b38] w-5 h-5 flex items-center justify-center cursor-pointer transition"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Subtotal preview details */}
                <div className="flex justify-between items-center text-xs text-gray-500 font-mono bg-gray-50 px-3.5 py-2 rounded-xl">
                  <span>Unit Price: ₹{currentUnitPrice} • Qty: {quantity}</span>
                  <span className="text-sm font-black text-[#120a07]">Calculated Subtotal: ₹{subtotal}</span>
                </div>

                {/* Primary CTA button grids */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={handleAddToCartClick}
                    disabled={isAdded}
                    className={`py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${
                      isAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-[#120a07] hover:bg-[#c29b38] hover:text-[#120a07] text-amber-100"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 animate-bounce" />
                        Added to Baker's Tray!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Add {quantity} Item{quantity > 1 ? "s" : ""} to Tray • ₹{subtotal}
                      </>
                    )}
                  </button>

                  {isCake ? (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onCustomizeClick(product);
                      }}
                      className="py-4 px-6 bg-[#faf6ed] hover:bg-[#3d271d] text-amber-900 hover:text-amber-100 rounded-2xl text-xs font-bold border border-[#c29b38]/30 hover:border-transparent transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Sparkles className="w-4 h-4 text-[#c29b38]" />
                      Open Full 3D Studio Customizer
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleAddToCartClick();
                        onClose();
                      }}
                      className="py-4 px-6 bg-amber-50 hover:bg-amber-100 text-[#120a07] rounded-2xl text-xs font-bold border border-amber-200 hover:border-transparent transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Express Secure Checkout Now
                    </button>
                  )}
                </div>

              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
