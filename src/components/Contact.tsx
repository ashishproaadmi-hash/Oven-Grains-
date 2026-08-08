import React, { useState } from "react";
import { Phone, MessageSquare, MapPin, Clock, Send, Award } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !msg) return;

    // Simulate sending contact form message
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message: msg })
    })
    .then(res => res.json())
    .then(() => {
      setIsSent(true);
      setName("");
      setEmail("");
      setMsg("");
      setTimeout(() => setIsSent(false), 3000);
    });
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-white relative">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#c29b38] font-bold text-xs font-mono uppercase tracking-widest block mb-2">
            VISIT OUR BAKERY
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#3d271d]">
            Contact & Directions
          </h2>
          <p className="text-[#5c4a40] text-sm mt-3">
            Oven Grains welcomes you! Pop in for a fresh cappuccino and butter pastry, or order customized birthday cakes over phone or WhatsApp.
          </p>
        </div>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Block: Business cards, hours, Map */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Contacts */}
            <div className="bg-[#faf6ed] p-6 rounded-2xl border border-[#ebdcb9]/40 space-y-4 text-[#3d271d]">
              <h3 className="font-serif font-bold text-lg mb-4">Oven Grains Bakery</h3>
              
              {/* Address */}
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-[#c29b38] shrink-0 mt-0.5" />
                <div className="text-xs text-gray-700 leading-relaxed">
                  <span className="font-bold block text-[#3d271d]">Baking Outlet Address</span>
                  Shop No. G-6 & 7, Maa Laxmi Plaza, Sahjanand Chowk, Harmu Road, Ranchi, Jharkhand 834002
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-3">
                <Phone className="w-5 h-5 text-[#c29b38] shrink-0 mt-0.5" />
                <div className="text-xs text-gray-700">
                  <span className="font-bold block text-[#3d271d]">Hotline / Phone Orders</span>
                  <a href="tel:+919939123878" className="hover:underline text-[#c29b38] font-bold">+91 99391 23878</a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex gap-3">
                <MessageSquare className="w-5 h-5 text-[#c29b38] shrink-0 mt-0.5" />
                <div className="text-xs text-gray-700">
                  <span className="font-bold block text-[#3d271d]">WhatsApp Chat Orders</span>
                  <a
                    href="https://wa.me/919939123878?text=Hello%20Oven%20Grains%2C%20I'd%20like%20to%20place%20an%20order."
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline text-emerald-700 font-bold"
                  >
                    +91 99391 23878
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-[#c29b38] shrink-0 mt-0.5" />
                <div className="text-xs text-gray-700">
                  <span className="font-bold block text-[#3d271d]">Operational Baking Hours</span>
                  9:00 AM - 10:30 PM (All Days Open)
                </div>
              </div>
            </div>

            {/* Quick Interactive Map Canvas */}
            <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-white aspect-video relative z-10 bg-[#faf6ed]">
              {/* Embed premium live Google Map of Harmu Road Ranchi area */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3662.3789419137156!2d85.30397577583765!3d23.361026003233856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35003666b6c00001%3A0xe5ebef7041ca70ab!2sMaa%20Laxmi%20Plaza%2C%20Sahjanand%20Chowk%2C%20Harmu%20Rd%2C%20Ranchi%2C%20Jharkhand%20834002!5e0!3m2!1sen!2sin!4v1688000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Ranchi Sahjanand Chowk Harmu Road"
              />
            </div>

          </div>

          {/* Right Block: Instant Query Form */}
          <div className="lg:col-span-7 bg-[#faf9f5] p-6 sm:p-8 rounded-2xl border border-[#ebdcb9]/40 shadow-xl text-[#3d271d]">
            <h3 className="font-serif text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
              <span>📩</span> Send Us an Instant Inquiry
            </h3>
            
            {isSent ? (
              <div className="py-12 text-center bg-emerald-50 border border-emerald-100 rounded-xl space-y-2">
                <span className="text-3xl block">📨</span>
                <h4 className="font-bold text-emerald-800 text-sm">Message Transmitted!</h4>
                <p className="text-xs text-emerald-600 max-w-xs mx-auto">Our Ranchi baking outlet staff will respond to you over email or call within 20 minutes.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1" htmlFor="contact-name-input">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="contact-name-input"
                    required
                    placeholder="e.g. Priyanshu Roy"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#c29b38]"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1" htmlFor="contact-email-input">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="contact-email-input"
                    placeholder="e.g. priyanshu@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#c29b38]"
                  />
                </div>

                {/* Query Body */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1" htmlFor="contact-message-input">
                    Inquiry Details *
                  </label>
                  <textarea
                    id="contact-message-input"
                    required
                    rows={4}
                    placeholder="Tell us about your catering needs, event date, tier requirements, bulk corporate cookies order..."
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#c29b38]"
                  />
                </div>

                <button
                  type="submit"
                  id="contact-submit-btn"
                  className="w-full py-3 bg-[#3d271d] hover:bg-[#523527] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#ebdcb9]" />
                  Transmit Inquiry Form
                </button>
              </form>
            )}

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-[#ebdcb9]/40 text-left text-[11px] text-[#5c4a40]">
              <div className="flex gap-2">
                <Award className="w-5 h-5 text-[#c29b38] shrink-0" />
                <span><strong>Premium Standard:</strong> We design cakes exactly like your reference photo uploads.</span>
              </div>
              <div className="flex gap-2">
                <span>🎂</span>
                <span><strong>Bulk Catering:</strong> Fully customizable menu bundles for Harmu weddings & corporate meetups.</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
