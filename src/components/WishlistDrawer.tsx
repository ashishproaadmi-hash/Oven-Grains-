import React from "react";
import { X, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Product } from "../types";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: string[];
  products: Product[];
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlist,
  products,
  onToggleWishlist,
  onAddToCart
}: WishlistDrawerProps) {
  if (!isOpen) return null;

  // Filter products in wishlist
  const wishlistedItems = products.filter((p) => wishlist.includes(p.id));

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 z-50 bg-[#3d271d]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#faf8f5] shadow-2xl flex flex-col justify-between h-full border-l border-[#ebdcb9]/40">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#3d271d] text-white flex justify-between items-center border-b border-[#ffd700]/20">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#ffd700] fill-[#ffd700]" />
            <div>
              <h2 className="font-serif font-bold text-lg sm:text-xl text-white">Your Wishlist</h2>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#ebdcb9]">
                Your Saved Delights
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

        {/* Scrollable List */}
        <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4">
          {wishlistedItems.length > 0 ? (
            <div className="space-y-3">
              {wishlistedItems.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-3 rounded-xl border border-gray-100 flex gap-3 shadow-sm hover:shadow-md transition-shadow duration-300 relative"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 bg-[#faf6ed]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Info details */}
                  <div className="flex-grow flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] text-[#c29b38] font-bold uppercase tracking-wider">
                          {product.category}
                        </span>
                        <button
                          onClick={() => onToggleWishlist(product.id)}
                          className="text-red-500 hover:text-red-600 transition cursor-pointer"
                          title="Remove from favorites"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="font-serif font-bold text-sm text-[#3d271d] leading-tight pr-4">
                        {product.name}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <span className="font-serif font-black text-xs text-[#3d271d] font-mono">
                        ₹{product.price}
                      </span>

                      <button
                        onClick={() => {
                          onAddToCart(product, 1);
                        }}
                        className="px-2.5 py-1.5 bg-[#3d271d] hover:bg-[#5c4236] text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                      >
                        <ShoppingCart className="w-3 h-3 text-[#fdfbf7]" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <span className="text-5xl block text-[#ebdcb9]">💖</span>
              <p className="font-serif text-[#3d271d] font-bold text-base">Your wishlist is empty</p>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Explore our menu and click the heart button on items you'd love to save for later celebrations!
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-[#3d271d] hover:bg-[#593c2f] text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Go Menu Exploring
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white p-4 border-t border-gray-100 shadow-xl flex items-center justify-center text-[10px] text-gray-400 font-mono">
          <span>Oven Grains Ranchi Favorites</span>
        </div>
      </div>
    </>
  );
}
