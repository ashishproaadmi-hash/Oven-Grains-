import React from "react";
import { Check, ShieldCheck, Heart, Users, Truck, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export default function About() {
  const values = [
    {
      icon: <Sparkles className="w-5 h-5 text-[#c29b38]" />,
      title: "Fresh Ingredients",
      desc: "We prioritize local sourcing, real cream, Belgian chocolate, and fresh seasonal fruits for absolute flavor perfection."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#c29b38]" />,
      title: "Hygienic Baking",
      desc: "Our state-of-the-art kitchen at Maa Laxmi Plaza operates under strict temperature, sanitation, and safety checks."
    },
    {
      icon: <Heart className="w-5 h-5 text-[#c29b38]" />,
      title: "Custom Cake Orders",
      desc: "From massive multi-tiered dream wedding structures to customized theme cakes, your imagination sets our canvas limit."
    },
    {
      icon: <Users className="w-5 h-5 text-[#c29b38]" />,
      title: "Same-Day Cakes",
      desc: "Forgot an anniversary? Don't worry, our talented decorators design and deliver premium fresh cakes in under 3 hours."
    },
    {
      icon: <Truck className="w-5 h-5 text-[#c29b38]" />,
      title: "Fast Service & Delivery",
      desc: "Safe, contactless local delivery right to your doorstep across Ranchi, including Kanke, Lalpur, Ashok Nagar, and beyond."
    },
    {
      icon: <Check className="w-5 h-5 text-[#c29b38]" />,
      title: "Affordable Luxury Pricing",
      desc: "We believe premium, high-quality celebration cakes shouldn't carry steep premiums. Fair rates for five-star taste."
    }
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          {/* Left Column Text */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 space-y-6"
          >
            <span className="text-[#c29b38] font-bold font-mono text-xs uppercase tracking-widest block">
              ✦ ESTABLISHED IN RANCHI ✦
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#3d271d] leading-tight">
              Crafting Memories, One Fresh Slice At A Time
            </h2>
            <p className="text-[#5c4a40] leading-relaxed">
              Nestled in the bustling heart of Ranchi at <strong>Sahjanand Chowk</strong>, 
              Oven Grains is a premier designer patisserie. We are a family of passionate decorators 
              and pastry chefs committed to bringing genuine warmth, buttery textures, and luxurious cream formulations 
              to your family's landmark celebrations.
            </p>
            <p className="text-[#5c4a40] leading-relaxed">
              Every sponge we bake is aerated to soft perfection. Every dollop of frosting is prepared 
              with the finest ingredients to guarantee that melt-in-the-mouth magic. Whether it is our famous 
              Pineapple Cake, the rich fusion Rasmalai Cake, or delicate handcrafted pastries, we treat baking as a precise, premium art.
            </p>

            {/* Live Stats */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#ebdcb9]/40">
              <div>
                <span className="font-serif text-3xl sm:text-4xl font-black text-[#c29b38] block">100%</span>
                <span className="text-xs text-gray-500 font-sans uppercase font-bold tracking-wider">
                  Eggless Sponge Options
                </span>
              </div>
              <div>
                <span className="font-serif text-3xl sm:text-4xl font-black text-[#3d271d] block">3-Hour</span>
                <span className="text-xs text-gray-500 font-sans uppercase font-bold tracking-wider">
                  Express Order Window
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column Imagery collage */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-6 grid grid-cols-12 gap-4 relative"
          >
            
            {/* Main Picture */}
            <div className="col-span-8 rounded-2xl overflow-hidden shadow-lg border border-[#ebdcb9]/30 aspect-[4/5] transform hover:scale-[1.01] transition-all">
              <img
                src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80"
                alt="Inside Oven Grains Bakery"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Stacked Second Picture */}
            <div className="col-span-4 self-end space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-lg border border-[#ebdcb9]/30 aspect-square transform hover:-translate-y-1 transition-all">
                <img
                  src="https://images.unsplash.com/photo-1511018556340-d16986a1c194?w=400&auto=format&fit=crop&q=80"
                  alt="Fresh gourmet cupcakes and pastries iced daily"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-[#ebdcb9]/30 aspect-[3/4] bg-[#faf4e8] p-4 flex flex-col justify-between text-left">
                <span className="font-serif text-[#c29b38] font-bold text-lg block">Our Guarantee</span>
                <p className="text-[11px] text-[#5c4a40] leading-relaxed">
                  "If it's not baked fresh today, we don't put it on our shelves. That's the Oven Grains promise."
                </p>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#3d271d] font-mono">
                  - Head Baker
                </span>
              </div>
            </div>

          </motion.div>

        </div>

        {/* Why Choose Us Grid */}
        <div className="pt-16 border-t border-[#ebdcb9]/40">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="text-[#c29b38] font-bold text-xs font-mono uppercase tracking-widest block mb-2">
              WHY CHOOSE OVEN GRAINS
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#3d271d]">
              Our Uncompromising Standards
            </h3>
            <p className="text-gray-500 text-sm mt-3">
              We bring unmatched hygiene, authentic premium flavor, and speedy delivery together to serve Ranchi the best.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="p-6 rounded-2xl bg-[#fefdfa] hover:bg-[#faf6ed] border border-[#ebdcb9]/30 transition group flex gap-4"
              >
                <div className="bg-[#f3ebd3] text-[#c29b38] p-3 rounded-xl h-fit group-hover:bg-[#3d271d] group-hover:text-[#ebdcb9] transition duration-300">
                  {val.icon}
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-[#3d271d] mb-1">
                    {val.title}
                  </h4>
                  <p className="text-xs text-[#5c4a40] leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
