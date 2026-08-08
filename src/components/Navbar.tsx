import React from "react";
import { ShoppingCart, Phone, User, Store, Clock, Award, Compass, Heart } from "lucide-react";
import { CartItem } from "../types";

interface NavbarProps {
  cart: CartItem[];
  onOpenCart: () => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  currentSection: string;
  onNavigate: (section: string) => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
}

export default function Navbar({
  cart,
  onOpenCart,
  isAdmin,
  onToggleAdmin,
  currentSection,
  onNavigate,
  wishlistCount,
  onOpenWishlist
}: NavbarProps) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const links = [
    { id: "home", label: "Home" },
    { id: "about", label: "Our Story" },
    { id: "menu", label: "Bakery Menu" },
    { id: "custom", label: "Customize Cake" },
    { id: "reviews", label: "Reviews" },
    { id: "contact", label: "Contact Us" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#fdfbf7] border-b border-[#ebdcb9]/40 shadow-sm">
      {/* Top bar with business quick info */}
      <div className="hidden md:flex w-full bg-[#3d271d] text-[#ebdcb9] text-xs py-2 px-6 justify-between items-center font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Store className="w-3.5 h-3.5 text-[#d4af37]" />
            Sahjanand Chowk, Harmu Road, Ranchi
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
            9:00 AM - 10:30 PM Daily
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a href="tel:+919939123878" className="flex items-center gap-1 hover:text-white transition">
            <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
            +91 99391 23878
          </a>
          <span className="bg-[#593c2f] px-2 py-0.5 rounded text-[10px] text-[#ffd700] uppercase font-bold tracking-widest">
            ★ 4.9 Rated Bakery
          </span>
        </div>
      </div>

      {/* Main navigation */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 cursor-pointer text-left"
          id="nav-logo"
        >
          <div className="bg-[#3d271d] text-[#ebdcb9] p-2 rounded-full shadow-md flex items-center justify-center border border-[#ffd700]/30">
            <span className="font-serif font-black tracking-widest text-lg">OG</span>
          </div>
          <div>
            <span className="font-serif font-bold text-xl sm:text-2xl text-[#3d271d] block tracking-tight leading-none">
              Oven Grains
            </span>
            <span className="text-[10px] font-sans uppercase tracking-widest text-[#9d7e5d] font-bold block mt-0.5">
              Premium Bakery & Cake Shop
            </span>
          </div>
        </button>

        {/* Desktop links */}
        <nav className="hidden lg:flex items-center gap-7">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`text-sm font-sans font-medium tracking-wide transition-colors relative py-1 cursor-pointer ${
                currentSection === link.id
                  ? "text-[#c29b38] font-semibold"
                  : "text-[#543b2e] hover:text-[#c29b38]"
              }`}
            >
              {link.label}
              {currentSection === link.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#c29b38] rounded-full animate-fade-in" />
              )}
            </button>
          ))}
        </nav>

        {/* Action icons */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Admin Switcher */}
          <button
            onClick={onToggleAdmin}
            id="admin-toggle-btn"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs sm:text-sm font-medium transition cursor-pointer ${
              isAdmin
                ? "bg-[#c29b38] text-white border-[#c29b38] shadow-md shadow-[#c29b38]/20"
                : "bg-transparent text-[#543b2e] border-[#ebdcb9] hover:bg-[#faf4e8]"
            }`}
            title="Toggle Admin View"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">{isAdmin ? "Admin Active" : "Admin Panel"}</span>
          </button>

          {/* Wishlist trigger */}
          <button
            onClick={onOpenWishlist}
            id="wishlist-trigger"
            className="relative bg-[#faf6ed] hover:bg-[#f3ead3] text-red-500 hover:text-red-600 p-2.5 sm:p-3 rounded-full transition border border-[#ebdcb9] cursor-pointer flex items-center justify-center shadow-sm"
            title="Open Wishlist"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-red-500" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-[#3d271d] text-white text-[10px] sm:text-xs font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-[#fdfbf7]">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart trigger */}
          <button
            onClick={onOpenCart}
            id="cart-trigger"
            className="relative bg-[#3d271d] hover:bg-[#593c2f] text-white p-2.5 sm:p-3 rounded-full transition shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-[#fdfbf7]" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-[#c29b38] text-white text-[10px] sm:text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#fdfbf7]">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav indicator bar */}
      <div className="lg:hidden flex border-t border-[#ebdcb9]/40 overflow-x-auto scrollbar-none bg-[#fdfbf7] py-2 px-4 gap-4">
        {links.map((link) => (
          <button
            key={link.id + "-mobile"}
            onClick={() => onNavigate(link.id)}
            className={`whitespace-nowrap text-xs font-sans font-semibold px-3 py-1.5 rounded-full transition ${
              currentSection === link.id
                ? "bg-[#3d271d] text-white"
                : "bg-[#faf4e8] text-[#543b2e] hover:bg-[#ebdcb9]/40"
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>
    </header>
  );
}
