import React from "react";
import { motion } from "motion/react";
import { Phone, MessageSquare, MapPin, ArrowRight, Award, Compass, Heart, Sparkles, Flame, ShieldCheck, Star } from "lucide-react";

// Local asset paths with absolute URLs matching public/
const rasmalaiCakeImg = "/assets/images/rasmalai_cake_1783069692060.jpg";
const makhanaCookiesImg = "/assets/images/makhana_cookies_1783069740333.jpg";
const designerCakeImg = "/assets/images/designer_cake_1783069727828.jpg";
const pineappleCakeImg = "/assets/images/pineapple_cake_1783069675253.jpg";

// High-resolution premium backup images for safety
const fallbackRasmalai = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80";
const fallbackCookies = "https://images.unsplash.com/photo-1486427944299-d1955d23e317?w=600&auto=format&fit=crop&q=80";
const fallbackDesigner = "https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=600&auto=format&fit=crop&q=80";

interface HeroProps {
  onOrderNow: () => void;
  onCustomizeCake: () => void;
}

export default function Hero({ onOrderNow, onCustomizeCake }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#120a07] py-10 sm:py-20 lg:py-28 border-b border-[#c29b38]/25">
      
      {/* Background Video loop of beautiful cakes & decorating */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-25 scale-105"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-decorating-a-chocolate-cake-with-cream-42220-large.mp4" type="video/mp4" />
          <source src="https://assets.mixkit.co/videos/preview/mixkit-chef-spreading-cream-on-a-biscuit-cake-42217-large.mp4" type="video/mp4" />
        </video>
        {/* Gradients to keep text extremely readable and overlay gorgeous premium tones */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#120a07] via-[#120a07]/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120a07] via-transparent to-[#120a07]/60" />
      </div>

      {/* Premium background grid styling */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3d271d_1px,transparent_1px),linear-gradient(to_bottom,#3d271d_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* Luxury Glowing background radial lights */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 right-10 w-96 h-96 rounded-full bg-[#c29b38] filter blur-3xl pointer-events-none" 
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: GORGEOUS STORY & CALL TO ACTIONS */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left"
          >
            
            {/* Elite Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#c29b38]/45 text-[11px] font-bold uppercase tracking-widest text-[#ebdcb9] mx-auto lg:mx-0 shadow-lg"
            >
              <Award className="w-4 h-4 text-[#c29b38] animate-pulse" />
              <span>Ranchi's Premier Designer Patisserie</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            </motion.div>

            {/* Main Luxury Heading */}
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="font-serif text-4xl sm:text-5xl lg:text-6.5xl font-extrabold text-white leading-[1.1] tracking-tight"
              >
                Gourmet Pastries & <br />
                <span className="relative inline-block text-[#c29b38] italic font-medium pr-1">
                  Designer Cakes
                  <span className="absolute bottom-1 left-0 w-full h-[6px] bg-[#c29b38]/20 -z-10 rounded-full" />
                </span> <br className="hidden sm:inline" />
                Baked Fresh Daily.
              </motion.h1>
              
              {/* Live Patisserie Notification Bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#24150e]/95 border border-[#c29b38]/30 text-xs font-semibold text-[#ebdcb9] shadow-md max-w-md mx-auto lg:mx-0"
              >
                <Flame className="w-3.5 h-3.5 text-[#c29b38] animate-bounce" />
                <span>Signature Batches: Freshly frosted luxury cakes ready by <strong>11:00 AM</strong> & <strong>05:00 PM</strong> daily</span>
              </motion.div>
            </div>

            {/* Story Subtext */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-base sm:text-lg text-[#eae0d5] max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans font-normal opacity-95"
            >
              Savor Ranchi's most authentic eggless designer cakes, custom premium fusion sweets, 
              and delicate artisan products. Handcrafted at <strong>Sahjanand Chowk, Harmu Road</strong> with 
              pure dairy, fresh organic ingredients, and zero artificial preservatives.
            </motion.p>

            {/* Interactive Luxury CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7 }}
              className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <button
                onClick={onOrderNow}
                id="hero-order-now"
                className="w-full sm:w-auto px-8 py-4 bg-[#c29b38] hover:bg-[#ebdcb9] text-[#120a07] font-bold rounded-xl shadow-xl hover:shadow-xl hover:shadow-[#c29b38]/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Order Premium Menu
                  <ArrowRight className="w-5 h-5 text-[#120a07] group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
              </button>

              <button
                onClick={onCustomizeCake}
                id="hero-customize"
                className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-white/5 text-white font-bold rounded-xl border-2 border-white/25 hover:border-[#ebdcb9] transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
              >
                <Sparkles className="w-4 h-4 text-[#c29b38] animate-spin" />
                <span>Bespoke Cake Customizer</span>
              </button>
            </motion.div>

            {/* Quick Contact & Info Grid */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.8 }}
              className="grid grid-cols-3 gap-3 pt-6 border-t border-[#ebdcb9]/20 max-w-lg mx-auto lg:mx-0"
            >
              {/* Phone Line */}
              <a
                href="tel:+919939123878"
                id="hero-call-link"
                className="flex flex-col items-center p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition shadow-lg hover:border-[#c29b38]/30 group"
              >
                <div className="bg-[#c29b38] text-[#120a07] p-2.5 rounded-xl group-hover:scale-105 transition">
                  <Phone className="w-4 h-4 text-[#120a07]" />
                </div>
                <span className="text-[10px] font-extrabold tracking-wider text-[#ebdcb9] uppercase mt-2">Call Hot-Line</span>
                <span className="text-[9px] text-[#eae0d5]/80 font-mono mt-0.5 font-bold">+91 99391 23878</span>
              </a>

              {/* Direct WhatsApp Chat */}
              <a
                href="https://wa.me/919939123878?text=Hello%20Oven%20Grains%2C%20I'd%20like%20to%20order%20a%20fresh%20cake!"
                target="_blank"
                rel="noreferrer"
                id="hero-wa-link"
                className="flex flex-col items-center p-3 rounded-2xl bg-white/5 hover:bg-[#25d366]/10 border border-white/10 transition shadow-lg hover:border-[#25d366]/30 group"
              >
                <div className="bg-[#25d366] text-white p-2.5 rounded-xl transition">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] font-extrabold tracking-wider text-[#25d366] uppercase mt-2">WhatsApp Order</span>
                <span className="text-[9px] text-[#eae0d5]/80 mt-0.5 font-bold">Fast Chat Assist</span>
              </a>

              {/* GPS Store Location */}
              <a
                href="https://maps.google.com/?q=Oven+Grains+Bakery+Maa+Laxmi+Plaza+Harmu+Road+Ranchi"
                target="_blank"
                rel="noreferrer"
                id="hero-direction-link"
                className="flex flex-col items-center p-3 rounded-2xl bg-white/5 hover:bg-[#4285f4]/10 border border-white/10 transition shadow-lg hover:border-[#4285f4]/30 group"
              >
                <div className="bg-[#4285f4] text-white p-2.5 rounded-xl transition">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] font-extrabold tracking-wider text-[#73a6fc] uppercase mt-2">Find Outlet</span>
                <span className="text-[9px] text-[#eae0d5]/80 mt-0.5 font-bold">Sahjanand Chowk</span>
              </a>
            </motion.div>

          </motion.div>

          {/* RIGHT COLUMN: LUXURY MULTI-IMAGE BENTO GRID OF SIGNATURE BAKED GOODIES */}
          <div className="lg:col-span-6 relative mt-10 lg:mt-0">
            
            {/* Visual background rings */}
            <div className="absolute inset-0 flex items-center justify-center -z-10">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="w-[110%] aspect-square border border-[#ebdcb9]/15 rounded-full pointer-events-none" 
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="w-[85%] aspect-square border border-dashed border-[#ebdcb9]/20 rounded-full pointer-events-none absolute" 
              />
            </div>

            {/* Dynamic visual grid system */}
            <div className="grid grid-cols-12 gap-4 relative">
              
              {/* Card 1: Large Featured Rasmalai fusion cake (Top Left - Main Highlight) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="col-span-8 bg-[#1e120d]/90 backdrop-blur-md p-2.5 rounded-3xl shadow-2xl border border-[#c29b38]/30 relative group cursor-pointer"
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden relative bg-amber-50">
                  <img
                    src={rasmalaiCakeImg}
                    onError={(e) => { (e.target as HTMLImageElement).src = fallbackRasmalai; }}
                    alt="Signature Rasmalai fusion cake"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90" />
                  <span className="absolute top-3 left-3 bg-[#c29b38] text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full shadow-md tracking-wider">
                    Most Popular
                  </span>
                  
                  {/* Rich overlay caption */}
                  <div className="absolute bottom-3 left-3 right-3 text-white text-left">
                    <p className="font-serif font-black text-sm text-[#ebdcb9]">Royal Rasmalai Fusion Cake</p>
                    <p className="text-[10px] text-gray-200 line-clamp-1">Fresh saffron cream layers infused with organic cardamoms</p>
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Exquisite Pineapple Filling Cake (Lower Right overlapping) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="col-span-7 -mt-10 bg-[#1e120d]/90 backdrop-blur-md p-2.5 rounded-3xl shadow-xl border border-[#c29b38]/20 relative z-20 group cursor-pointer"
              >
                <div className="aspect-video rounded-2xl overflow-hidden relative bg-amber-50">
                  <img
                    src={pineappleCakeImg}
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop&q=80"; }}
                    alt="Handcrafted Luxury Pineapple Cake"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white text-left">
                    <p className="font-serif font-bold text-xs text-[#ebdcb9]">Luxury Pineapple Cake</p>
                    <p className="text-[9px] text-gray-300">Moist vanilla sponge with caramelized organic pineapples</p>
                  </div>
                </div>
              </motion.div>

              {/* Card 3: Designer Customized Cakes (Upper Right) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="col-span-4 bg-[#1e120d]/90 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-[#c29b38]/20 relative group cursor-pointer"
              >
                <div className="aspect-square rounded-xl overflow-hidden relative bg-amber-50">
                  <img
                    src={designerCakeImg}
                    onError={(e) => { (e.target as HTMLImageElement).src = fallbackDesigner; }}
                    alt="Custom multi-tier cake designer work"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-white text-left">
                    <p className="font-serif font-bold text-[10px] text-white">Luxury Tiers</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating review card element: Local Rating */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-30 bg-[#2d1a10] text-white p-4 rounded-2xl shadow-2xl border border-[#c29b38]/40 flex flex-col gap-1.5 max-w-[170px] cursor-pointer"
              >
                <div className="flex gap-0.5 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <p className="font-serif text-sm font-black text-[#c29b38]">4.9 ★ Loved Locally</p>
                <p className="text-[9px] text-[#ebdcb9]/80 leading-snug font-sans font-medium">Over 1,200+ celebratory cakes delivered across Ranchi.</p>
              </motion.div>

              {/* Floating Pure Eggless Seal */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="absolute bottom-16 -left-6 z-30 bg-white/95 backdrop-blur-sm text-[#3d271d] py-2.5 px-4 rounded-2xl shadow-lg border-2 border-emerald-500/30 flex items-center gap-2.5 cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                </div>
                <div>
                  <span className="font-bold text-[10px] text-[#3d271d] block leading-none">100% Pure Veg</span>
                  <span className="text-[8px] text-emerald-600 font-bold block mt-0.5">Strictly Eggless Sponges</span>
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
