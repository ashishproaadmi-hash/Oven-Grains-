import React, { useState, useRef, useEffect } from "react";
import { Upload, Sparkles, Check, CheckCircle, Info, Heart } from "lucide-react";
import { CustomizedCake, Product } from "../types";

interface CakeCustomizerProps {
  products: Product[];
  onAddCustomizedToCart: (customization: CustomizedCake, basePrice: number) => void;
  onClose?: () => void;
  preselectedProduct?: Product | null;
}

export default function CakeCustomizer({
  products,
  onAddCustomizedToCart,
  onClose,
  preselectedProduct
}: CakeCustomizerProps) {
  // Filter for cake-related products
  const cakeProducts = products.filter(p => p.category === "Birthday Cakes" || p.category === "Custom Cakes");

  // Refs for each step section
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);
  const step5Ref = useRef<HTMLDivElement>(null);
  const step6Ref = useRef<HTMLDivElement>(null);
  const step7Ref = useRef<HTMLDivElement>(null);

  // State
  const [selectedBase, setSelectedBase] = useState<Product | null>(null);
  const [size, setSize] = useState("1.0 kg");
  const [flavor, setFlavor] = useState("Pineapple Delight");
  const [eggless, setEggless] = useState(true);
  const [message, setMessage] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeStep, setActiveStep] = useState(1);

  // Smooth scroll to step
  const scrollToStep = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      const elementPosition = ref.current.getBoundingClientRect().top + window.pageYOffset;
      // Offset by height of sticky header (~108px) + customizer sticky nav (~56px) + small safety margin
      const offsetPosition = elementPosition - 180;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Scroll Spy logic to update active step
  useEffect(() => {
    const handleScroll = () => {
      const stepsList = [
        { id: 1, ref: step1Ref },
        { id: 2, ref: step2Ref },
        { id: 3, ref: step3Ref },
        { id: 4, ref: step4Ref },
        { id: 5, ref: step5Ref },
        { id: 6, ref: step6Ref },
        { id: 7, ref: step7Ref },
      ];

      let currentActive = 1;
      let minDistance = Infinity;

      for (const s of stepsList) {
        if (s.ref.current) {
          const rect = s.ref.current.getBoundingClientRect();
          const distance = Math.abs(rect.top - 200);
          // Check if section is currently intersecting or close to the top view range
          if (rect.top < window.innerHeight * 0.7 && rect.bottom > 160) {
            if (distance < minDistance) {
              minDistance = distance;
              currentActive = s.id;
            }
          }
        }
      }
      setActiveStep(currentActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on load to establish default active step
    setTimeout(handleScroll, 100);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync selected base if products load asynchronously or preselectedProduct changes
  useEffect(() => {
    if (preselectedProduct) {
      setSelectedBase(preselectedProduct);
    } else if (!selectedBase && cakeProducts.length > 0) {
      setSelectedBase(cakeProducts[0]);
    }
  }, [products, preselectedProduct, cakeProducts, selectedBase]);

  // Computed Pricing
  const getBasePrice = () => {
    if (!selectedBase) return 650;
    return selectedBase.price;
  };

  const calculateTotalPrice = () => {
    let price = getBasePrice();
    
    // Multipliers for size
    if (size === "0.5 kg") price = price * 0.85;
    if (size === "2.0 kg") price = price * 1.8;
    if (size === "3.0 kg") price = price * 2.6;
    if (size === "4.0 kg" || size === "5.0 kg") price = price * 3.5;

    // Surcharge for customization / Eggless
    if (eggless) price += 50;
    if (photoUrl) price += 200; // custom icing print

    return Math.round(price);
  };

  // Image upload simulation
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit to cart
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBase) return;

    const customDetails: CustomizedCake = {
      productId: selectedBase.id,
      productName: selectedBase.name,
      size,
      flavor,
      message,
      photoUrl: photoUrl || undefined,
      eggless,
      specialInstructions
    };

    onAddCustomizedToCart(customDetails, calculateTotalPrice());
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      // Reset some fields
      setMessage("");
      setSpecialInstructions("");
      setPhotoUrl(null);
      if (onClose) onClose();
    }, 1800);
  };

  return (
    <section id="custom" className="py-16 bg-[#faf6ed] border-t border-b border-[#ebdcb9]/40 relative">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#c29b38] font-bold text-xs font-mono uppercase tracking-widest block mb-2">
            DESIGNER STUDIO
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#3d271d]">
            Interactive Cake Customizer
          </h2>
          <p className="text-gray-500 text-sm mt-3">
            Choose your signature sponge, size, delicious fusion flavors, and customize live. We bring your sweet thoughts to life.
          </p>
        </div>

        {/* Customizer Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: LIVE VISUAL CANVAS */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-xl border border-[#ebdcb9]/40 flex flex-col items-center lg:sticky lg:top-28 z-20 relative">
            <span className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-4 font-mono">
              Live Canvas Preview
            </span>

            {/* Cake Renderer Box */}
            <div className="w-full aspect-square max-w-[340px] relative bg-gradient-to-br from-[#faf8f4] to-[#f4ecd8] rounded-2xl border-2 border-dashed border-[#ebdcb9] flex items-center justify-center overflow-hidden group">
              
              {/* Floating Sparkles */}
              <div className="absolute top-4 right-4 text-[#ffd700] animate-pulse">
                <Sparkles className="w-6 h-6" />
              </div>

              {/* Real base cake visual overlay */}
              {selectedBase ? (
                <div className="w-full h-full relative p-4 flex flex-col items-center justify-center">
                  <img
                    src={selectedBase.image}
                    alt={selectedBase.name}
                    className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-full shadow-lg transform group-hover:scale-105 transition-transform duration-500 relative z-10 border-4 border-white/80"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Photo Icing print overlay simulation */}
                  {photoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#d4af37] shadow-lg bg-white/70 backdrop-blur-[1px] rotate-[-6deg] flex items-center justify-center transform scale-90">
                        <img
                          src={photoUrl}
                          alt="Icing custom upload"
                          className="w-full h-full object-cover opacity-90 filter sepia-[10%]"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  )}

                  {/* Message Render Overlay */}
                  {message && (
                    <div className="absolute z-30 bottom-10 left-1/2 transform -translate-x-1/2 bg-[#3d271d]/95 text-[#fdfbf7] px-4 py-1.5 rounded-full text-xs font-serif font-bold text-center tracking-wide shadow-md max-w-[240px] truncate border border-[#ffd700]/30 animate-bounce">
                      ✍️ "{message}"
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-6 text-gray-400">
                  Select a Base sponge to customize
                </div>
              )}

              {/* Eggless Banner */}
              {eggless && (
                <div className="absolute top-4 left-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 block" />
                  100% EGGLESS
                </div>
              )}
            </div>

            {/* Custom details display */}
            <div className="w-full mt-6 space-y-3 bg-[#faf6ed] p-4 rounded-xl text-xs border border-[#ebdcb9]/20 text-[#5c4a40]">
              <div className="flex justify-between border-b border-[#ebdcb9]/40 pb-2">
                <span className="font-semibold">Selected Base:</span>
                <span className="font-bold text-[#3d271d]">{selectedBase?.name || "None"}</span>
              </div>
              <div className="flex justify-between border-b border-[#ebdcb9]/40 pb-2">
                <span className="font-semibold">Sponge Size:</span>
                <span className="font-mono font-bold text-[#c29b38]">{size}</span>
              </div>
              <div className="flex justify-between border-b border-[#ebdcb9]/40 pb-2">
                <span className="font-semibold">Flavor Choice:</span>
                <span className="font-bold">{flavor}</span>
              </div>
              <div className="flex justify-between border-b border-[#ebdcb9]/40 pb-2">
                <span className="font-semibold">Eggless sponge:</span>
                <span className="font-bold text-emerald-700">{eggless ? "Yes (+₹50)" : "No"}</span>
              </div>
              {photoUrl && (
                <div className="flex justify-between border-b border-[#ebdcb9]/40 pb-2 text-indigo-700 font-medium">
                  <span>Edible Photo Icing Print:</span>
                  <span>Yes (+₹200)</span>
                </div>
              )}
              <div className="flex justify-between pt-1 text-sm font-bold text-[#3d271d]">
                <span>Estimated Price:</span>
                <span className="text-lg font-mono text-[#c29b38]">₹{calculateTotalPrice()}</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CONFIGURATION FORM */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#ebdcb9]/40 relative overflow-visible">
            
            {/* Sticky Steps Nav Bar */}
            <div className="sticky top-[72px] lg:top-[108px] z-30 bg-white px-2 py-3.5 -mx-6 sm:-mx-8 border-b-2 border-[#ebdcb9]/60 flex gap-2 overflow-x-auto scrollbar-none items-center shadow-md mb-6 rounded-t-3xl">
              <div className="flex gap-2 px-6 sm:px-8">
                {[
                  { id: 1, label: "Base", ref: step1Ref },
                  { id: 2, label: "Size", ref: step2Ref },
                  { id: 3, label: "Flavor", ref: step3Ref },
                  { id: 4, label: "Diet", ref: step4Ref },
                  { id: 5, label: "Text", ref: step5Ref },
                  { id: 6, label: "Photo", ref: step6Ref },
                  { id: 7, label: "Notes", ref: step7Ref },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => scrollToStep(s.ref)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeStep === s.id
                        ? "bg-[#3d271d] text-white shadow-md scale-105"
                        : "text-[#5c4a40] hover:bg-[#faf4e8] border border-[#ebdcb9]/20 bg-white"
                    }`}
                  >
                    <span className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-black ${
                      activeStep === s.id ? "bg-[#c29b38] text-white" : "bg-[#faf4e8] text-[#846338]"
                    }`}>
                      {s.id}
                    </span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* 1. Base Cake Sponge Selector */}
              <div ref={step1Ref} className="scroll-mt-48 transition-all">
                <label className="block text-sm font-bold text-[#3d271d] mb-3">
                  Step 1: Choose Your Signature Base Sponge
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {cakeProducts.slice(0, 6).map((cake) => (
                    <button
                      key={cake.id}
                      type="button"
                      onClick={() => setSelectedBase(cake)}
                      className={`p-3 rounded-xl border text-left transition relative cursor-pointer ${
                        selectedBase?.id === cake.id
                          ? "border-[#c29b38] bg-[#faf4e8] ring-2 ring-[#c29b38]/20"
                          : "border-[#ebdcb9]/40 hover:bg-[#faf9f5]"
                      }`}
                    >
                      {selectedBase?.id === cake.id && (
                        <Check className="w-4 h-4 text-white bg-[#c29b38] rounded-full p-0.5 absolute top-2 right-2 z-10" />
                      )}
                      <div className="aspect-video rounded-lg overflow-hidden bg-[#faf6ed] mb-2 border border-gray-100">
                        <img
                          src={cake.image}
                          alt={cake.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="font-serif font-bold text-[11px] text-[#3d271d] block line-clamp-1 leading-tight">
                        {cake.name}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono mt-0.5 block">
                        Base: ₹{cake.price}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Size Selector */}
              <div ref={step2Ref} className="scroll-mt-48 transition-all pt-2">
                <label className="block text-sm font-bold text-[#3d271d] mb-2.5">
                  Step 2: Choose Cake Size (Weight)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {["0.5 kg", "1.0 kg", "2.0 kg", "3.0 kg", "5.0 kg"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`py-2 px-3 rounded-lg border font-semibold text-xs text-center transition cursor-pointer ${
                        size === s
                          ? "bg-[#3d271d] text-white border-[#3d271d]"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {s}
                      <span className="text-[8px] block opacity-85 font-normal mt-0.5 font-mono">
                        {s === "0.5 kg" ? "Single layer" : s === "1.0 kg" ? "Standard" : "Celebration Tier"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Fusion Flavor Selector */}
              <div ref={step3Ref} className="scroll-mt-48 transition-all pt-2">
                <label className="block text-sm font-bold text-[#3d271d] mb-2.5">
                  Step 3: Choose Gourmet Fusion Flavor
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    "Pineapple Delight",
                    "Royal Rasmalai Twist",
                    "Saffron Butterscotch",
                    "Belgian Chocolate Fudge",
                    "Filippo Red Velvet",
                    "Classic Vanilla Frosting"
                  ].map((fl) => (
                    <button
                      key={fl}
                      type="button"
                      onClick={() => setFlavor(fl)}
                      className={`p-2.5 rounded-lg border text-xs text-left transition cursor-pointer ${
                        flavor === fl
                          ? "bg-[#c29b38] text-white border-[#c29b38] font-bold"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {fl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Eggless Surcharge Option (Diet Mode) */}
              <div ref={step4Ref} className="scroll-mt-48 transition-all pt-2">
                <label className="block text-sm font-bold text-[#3d271d] mb-2.5">
                  Step 4: Eggless Preference (100% Pure Veg)
                </label>
                <div className="bg-[#f0f9f1] p-4 rounded-xl border border-emerald-100 flex items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-white font-extrabold text-xs">
                      V
                    </span>
                    <div>
                      <span className="font-bold text-xs text-emerald-900 block">Make it 100% Eggless?</span>
                      <span className="text-[10px] text-emerald-700 block mt-0.5">We use high-quality organic yogurt & milk protein sponges</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setEggless(!eggless)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        eggless ? "bg-emerald-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          eggless ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* 5. Text on Cake */}
              <div ref={step5Ref} className="scroll-mt-48 transition-all pt-2">
                <label className="block text-sm font-bold text-[#3d271d] mb-1.5" htmlFor="cake-text-input">
                  Step 5: Custom Text on Cake Sponge (Icing Message)
                </label>
                <input
                  type="text"
                  id="cake-text-input"
                  maxLength={40}
                  placeholder="e.g. Happy Birthday Rohan! or Happy 25th Anniversary"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c29b38]/30 focus:border-[#c29b38] bg-[#fafaf8]"
                />
                <span className="text-[10px] text-gray-400 mt-1 block font-mono text-right">
                  {message.length}/40 characters maximum
                </span>
              </div>

              {/* 6. Photo icing upload */}
              <div ref={step6Ref} className="scroll-mt-48 transition-all pt-2">
                <label className="block text-sm font-bold text-[#3d271d] mb-2">
                  Step 6: Drag & Drop Edible Photo Print (Optional) (+₹200)
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  {photoUrl ? (
                    <div className="flex items-center justify-center gap-3">
                      <img
                        src={photoUrl}
                        alt="Preview upload"
                        className="w-12 h-12 object-cover rounded-md border border-gray-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="text-left text-xs text-[#3d271d]">
                        <span className="font-bold block">Photo upload successful</span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setPhotoUrl(null); }}
                          className="text-red-500 underline hover:text-red-700 mt-1 block"
                        >
                          Remove Photo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-gray-400">
                      <Upload className="w-8 h-8 mx-auto" />
                      <p className="text-xs font-semibold">Drag & drop photo here or <span className="text-[#c29b38] underline">browse files</span></p>
                      <p className="text-[10px]">Supports JPEG, PNG up to 5MB. Edible ink prints on customized wafer sheets.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 7. Special instructions */}
              <div ref={step7Ref} className="scroll-mt-48 transition-all pt-2">
                <label className="block text-sm font-bold text-[#3d271d] mb-1.5" htmlFor="instructions-input">
                  Step 7: Special Baking Instructions / Requests
                </label>
                <textarea
                  id="instructions-input"
                  rows={2}
                  placeholder="e.g. Less sugar, extra chocolate curls, double tier setup request, delivery on exact midnight..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c29b38]/30 focus:border-[#c29b38] bg-[#fafaf8]"
                />
              </div>

              {/* Order / Submit CTA */}
              <button
                type="submit"
                id="customizer-submit-btn"
                disabled={isAdded}
                className={`w-full py-4 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl ${
                  isAdded
                    ? "bg-emerald-600"
                    : "bg-[#3d271d] hover:bg-[#523527]"
                }`}
              >
                {isAdded ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Customized Cake Added to Cart!
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-[#ffd700]" />
                    Add Customized Cake to Cart • ₹{calculateTotalPrice()}
                  </>
                )}
              </button>

            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
