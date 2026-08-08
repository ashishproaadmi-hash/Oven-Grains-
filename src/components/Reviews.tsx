import React, { useState } from "react";
import { Star, Award, Heart, ShieldCheck, Clock, User } from "lucide-react";
import { Review } from "../types";
import { motion } from "motion/react";

interface ReviewsProps {
  reviews: Review[];
  onAddReview: (reviewData: Partial<Review>) => Promise<Review>;
}

export default function Reviews({ reviews, onAddReview }: ReviewsProps) {
  // Local submission states
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !text) return;

    const newRev = {
      author,
      rating,
      text,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80" // default
    };

    try {
      await onAddReview(newRev);
      setIsSubmitted(true);
      setAuthor("");
      setText("");
      setRating(5);
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section id="reviews" className="py-16 md:py-24 bg-[#faf6ed] overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Rating Overview Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Left: Score Breakdown */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 space-y-4 text-center lg:text-left"
          >
            <span className="text-[#c29b38] font-bold text-xs font-mono uppercase tracking-widest block">
              OUR CUSTOMERS AGREE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#3d271d]">
              Ranchi's Most Loved Bakery
            </h2>
            <p className="text-[#5c4a40] text-sm leading-relaxed max-w-md mx-auto lg:mx-0">
              With a 4.9★ aggregate rating across 2000+ local orders, we are dedicated to providing consistent visual perfection and luxurious gourmet textures.
            </p>

            {/* aggregate block */}
            <div className="bg-white p-6 rounded-2xl border border-[#ebdcb9]/40 inline-flex flex-col items-center lg:items-start gap-2 shadow-md">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-6 h-6 fill-[#ffd700] text-[#ffd700]" />
                ))}
              </div>
              <span className="font-serif text-3xl font-black text-[#3d271d]">
                4.9 out of 5.0
              </span>
              <span className="text-xs text-gray-400 font-medium">Based on 640 verified Google Maps Reviews</span>
            </div>
          </motion.div>

          {/* Right: Write a Review Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#ebdcb9]/40 shadow-xl text-[#3d271d]"
          >
            <h3 className="font-serif text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
              <span>✍️</span> Leave a Fresh Review
            </h3>

            {isSubmitted ? (
              <div className="py-8 text-center space-y-2 bg-[#f0f9f1] rounded-xl border border-emerald-100">
                <span className="text-3xl block">🎉</span>
                <h4 className="font-bold text-emerald-800 text-sm">Review Submitted Successfully!</h4>
                <p className="text-xs text-emerald-600 max-w-xs mx-auto">Thank you for sharing your experience at Oven Grains Harmu Road.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Author Name */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1" htmlFor="review-name-input">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      id="review-name-input"
                      required
                      placeholder="e.g. Priyanshu Roy"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#c29b38] focus:border-[#c29b38]"
                    />
                  </div>

                  {/* Rating Selector */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
                      Choose Rating (Stars)
                    </label>
                    <div className="flex gap-1.5 py-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 cursor-pointer text-2xl transition hover:scale-110"
                        >
                          <span className={star <= rating ? "text-[#ffd700]" : "text-gray-200"}>
                            ★
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Text feedback */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1" htmlFor="review-text-input">
                    Tell us your experience *
                  </label>
                  <textarea
                    id="review-text-input"
                    required
                    rows={2.5}
                    placeholder="e.g. The Rasmalai Cake was spectacular! It was extremely soft, not overly sweet, and delivered right on time."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#c29b38] focus:border-[#c29b38]"
                  />
                </div>

                <button
                  type="submit"
                  id="submit-review-btn"
                  className="w-full py-2.5 bg-[#3d271d] hover:bg-[#523527] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition"
                >
                  Submit Verified Review
                </button>
              </form>
            )}
          </motion.div>

        </div>

        {/* Reviews Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: Math.min(idx * 0.08, 0.4) }}
              className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col justify-between shadow-sm relative hover:shadow-md transition"
              id={`review-item-${rev.id}`}
            >
              
              {/* Star line */}
              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#ffd700] text-[#ffd700]" />
                ))}
              </div>

              {/* Text comment */}
              <p className="text-xs text-[#5c4a40] leading-relaxed italic mb-4 flex-grow">
                "{rev.text}"
              </p>

              {/* Author Footer */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100 mt-auto">
                <div className="w-9 h-9 rounded-full bg-[#fdfbf7] border border-[#ebdcb9] flex items-center justify-center font-bold text-[#3d271d] text-xs">
                  {rev.avatar ? (
                    <img
                      src={rev.avatar}
                      alt={rev.author}
                      className="w-full h-full object-cover rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    rev.author.charAt(0)
                  )}
                </div>
                <div>
                  <span className="font-bold text-xs text-[#3d271d] block flex items-center gap-1">
                    {rev.author}
                    {rev.verified && (
                      <span className="text-[9px] bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold px-1 py-0.2 rounded-full font-mono flex items-center scale-90">
                        ✓ VERIFIED LOCAL
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                    {rev.date}
                  </span>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
