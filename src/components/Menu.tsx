import React, { useState } from "react";
import { Search, ShoppingCart, Info, Sparkles, Filter, Check, Heart } from "lucide-react";
import { Product } from "../types";
import ProductDetailModal from "./ProductDetailModal";
import { motion } from "motion/react";

interface MenuProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number, customization?: any) => void;
  onCustomizeClick: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
}

export default function Menu({
  products,
  onAddToCart,
  onCustomizeClick,
  wishlist,
  onToggleWishlist
}: MenuProps) {
  // State
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Categories
  const categories = [
    "All",
    "Birthday Cakes",
    "Custom Cakes",
    "Pastries"
  ];

  // Filtering Logic
  const filteredProducts = products.filter((prod) => {
    const matchesCategory = selectedCategory === "All" || prod.category === selectedCategory;
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (prod.tags && prod.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const handleQuickAdd = (product: Product) => {
    onAddToCart(product, 1);
    
    // Add success animation
    setAddedItemMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <section id="menu" className="py-16 md:py-24 bg-[#fdfbf7] overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-[#c29b38] font-bold text-xs font-mono uppercase tracking-widest block mb-2">
            FRESHLY BAKED DAILY
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#3d271d]">
            Explore Our Gourmet Menu
          </h2>
          <p className="text-[#5c4a40] text-sm mt-3">
            Handcrafted with organic grains, pure milk butter, and Belgian chocolate layers. Made to celebrate Ranchi's sweetest memories.
          </p>
        </motion.div>

        {/* Search & Categories Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 bg-white p-4 rounded-2xl shadow-sm border border-[#ebdcb9]/30"
        >
          
          {/* Categories Horizontal Scroller */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 max-w-full md:max-w-[70%]">
            <Filter className="w-4 h-4 text-[#9d7e5d] hidden sm:block shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-[#3d271d] text-white"
                    : "bg-[#faf6ed] text-[#543b2e] hover:bg-[#ebdcb9]/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input Box */}
          <div className="relative md:max-w-[280px] w-full shrink-0">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Search cakes, pastries, bread..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#c29b38]/30 focus:border-[#c29b38] bg-gray-50/50"
            />
          </div>

        </motion.div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {filteredProducts.map((product, idx) => {
              const isAdded = addedItemMap[product.id] || false;
              const hasCustomOption = product.category === "Birthday Cakes" || product.category === "Custom Cakes";
              const isWishlisted = wishlist.includes(product.id);

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: Math.min((idx % 4) * 0.08, 0.45) }}
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsDetailOpen(true);
                  }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-[#ebdcb9]/20 flex flex-col justify-between group transform hover:-translate-y-1 transition-all duration-300 relative cursor-pointer"
                  id={`product-card-${product.id}`}
                >
                  
                  {/* Image Container */}
                  <div className="aspect-square relative overflow-hidden bg-gray-50">
                    
                    {/* Tags & Wishlist Layer */}
                    <div className="absolute top-3 inset-x-3 z-10 flex justify-between items-center pointer-events-none">
                      {product.isSignature ? (
                        <span className="bg-[#3d271d] text-[#ffd700] text-[9px] font-bold px-2 py-1 rounded-md shadow flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#ffd700]" />
                          OG SIGNATURE
                        </span>
                      ) : product.tags && product.tags.length > 0 ? (
                        <span className="bg-white/90 backdrop-blur-sm text-[#3d271d] text-[9px] font-bold px-2 py-1 rounded-md shadow border border-gray-100">
                          {product.tags[0]}
                        </span>
                      ) : (
                        <span />
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(product.id);
                        }}
                        className="pointer-events-auto bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-md hover:scale-110 transition cursor-pointer text-red-500 flex items-center justify-center border border-gray-100"
                        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${isWishlisted ? "fill-red-500" : ""}`}
                        />
                      </button>
                    </div>

                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />

                    {/* Quick custom overlay */}
                    {hasCustomOption && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCustomizeClick(product);
                          }}
                          className="px-4 py-2.5 bg-white text-[#3d271d] text-xs font-bold rounded-xl shadow-md cursor-pointer hover:bg-[#faf4e8] transition"
                        >
                          Design & Customize
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      {/* Category and Rating */}
                      <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                        <span>{product.category}</span>
                        <span className="text-[#c29b38]">★ {product.rating.toFixed(1)}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif font-bold text-base text-[#3d271d] group-hover:text-[#c29b38] transition-colors leading-tight mb-2">
                        {product.name}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-[#5c4a40] leading-relaxed line-clamp-2 mb-4">
                        {product.description}
                      </p>
                    </div>

                    {/* Pricing & Actions */}
                    <div className="pt-3 border-t border-[#ebdcb9]/20 flex items-center justify-between mt-auto">
                      <div className="text-left">
                        <span className="text-[10px] text-gray-400 block font-mono">Price starting at</span>
                        <span className="font-serif font-black text-lg text-[#3d271d] font-mono">
                          ₹{product.price}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {hasCustomOption ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCustomizeClick(product);
                            }}
                            className="p-2 rounded-xl bg-[#faf6ed] hover:bg-[#3d271d] text-[#c29b38] hover:text-white border border-[#ebdcb9] hover:border-transparent transition-colors cursor-pointer"
                            title="Customize and Order"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        ) : null}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickAdd(product);
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm ${
                            isAdded
                              ? "bg-emerald-600 text-white"
                              : "bg-[#3d271d] hover:bg-[#5c4236] text-white"
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              Added
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3.5 h-3.5" />
                              Add
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                  </div>

                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-8">
            <p className="text-gray-500 font-serif text-lg">No freshly baked treats match your search</p>
            <p className="text-xs text-gray-400 mt-1">Try another keyword or select a different category</p>
            <button
              onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
              className="mt-4 px-4 py-2 bg-[#3d271d] text-white rounded-lg text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onAddToCart={onAddToCart}
        onCustomizeClick={onCustomizeClick}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onToggleWishlist={onToggleWishlist}
      />
    </section>
  );
}
