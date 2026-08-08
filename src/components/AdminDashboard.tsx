import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  Check,
  AlertTriangle,
  Loader2,
  Trash2,
  Plus,
  RefreshCw,
  Edit,
  Sliders,
  Sparkles,
  Info
} from "lucide-react";
import { Order, Product, InventoryItem, DashboardAnalytics, OrderStatus } from "../types";

interface AdminDashboardProps {
  onAddProduct: (productData: Partial<Product>) => Promise<Product>;
  onUpdateProduct: (id: string, productData: Partial<Product>) => Promise<Product>;
  onDeleteProduct: (id: string) => Promise<boolean>;
  onUpdateOrderStatus: (id: string, status: OrderStatus, paymentStatus?: 'pending' | 'paid') => Promise<Order>;
  onUpdateInventory: (productId: string, stock: number) => Promise<InventoryItem>;
  adminPassword?: string;
}

export default function AdminDashboard({
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onUpdateInventory,
  adminPassword = ""
}: AdminDashboardProps) {
  // Tabs
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'products' | 'inventory'>('analytics');
  
  // Data States
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdCat, setNewProdCat] = useState<Product['category']>("Birthday Cakes");
  const [newProdImage, setNewProdImage] = useState("");

  const [lastSyncedAt, setLastSyncedAt] = useState<string>("");

  // Trigger initial load and set up interval polling
  useEffect(() => {
    loadAllAdminData(false);

    // Keep data updated in real-time across devices
    const syncInterval = setInterval(() => {
      loadAllAdminData(true);
    }, 5000);

    return () => clearInterval(syncInterval);
  }, [adminPassword]);

  const loadAllAdminData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const headers = { "X-Admin-Password": adminPassword };
      const [analyticsRes, ordersRes, productsRes, inventoryRes] = await Promise.all([
        fetch("/api/analytics", { headers }).then(res => res.json()),
        fetch("/api/orders", { headers }).then(res => res.json()),
        fetch("/api/products").then(res => res.json()),
        fetch("/api/inventory").then(res => res.json())
      ]);

      setAnalytics(analyticsRes);
      setOrders(ordersRes);
      setProducts(productsRes);
      setInventory(inventoryRes);

      const now = new Date();
      setLastSyncedAt(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    } catch (err) {
      console.error("Error loading admin dashboard data:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, status: OrderStatus, paymentStatus?: 'pending' | 'paid') => {
    try {
      const updated = await onUpdateOrderStatus(orderId, status, paymentStatus);
      if (updated) {
        // Refresh local listings
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, paymentStatus: paymentStatus || o.paymentStatus } : o));
        // Update analytics pending
        const freshAnalytics = await fetch("/api/analytics", { headers: { "X-Admin-Password": adminPassword } }).then(res => res.json());
        setAnalytics(freshAnalytics);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStockAdd = async (productId: string, currentStock: number) => {
    try {
      const updated = await onUpdateInventory(productId, currentStock + 10);
      if (updated) {
        setInventory(prev => prev.map(i => i.productId === productId ? { ...i, stockCount: currentStock + 10 } : i));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    const payload: Partial<Product> = {
      name: newProdName,
      price: Number(newProdPrice),
      description: newProdDesc,
      category: newProdCat,
      image: newProdImage || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400"
    };

    try {
      const added = await onAddProduct(payload);
      if (added) {
        setProducts(prev => [...prev, added]);
        setShowAddProductModal(false);
        setNewProdName("");
        setNewProdPrice("");
        setNewProdDesc("");
        setNewProdImage("");
        
        // Refresh inventory to capture the new product record
        const freshInv = await fetch("/api/inventory").then(res => res.json());
        setInventory(freshInv);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleProductDelete = async (productId: string) => {
    if (confirm("Are you sure you want to retire this product from Oven Grains?")) {
      try {
        const deleted = await onDeleteProduct(productId);
        if (deleted) {
          setProducts(prev => prev.filter(p => p.id !== productId));
          setInventory(prev => prev.filter(i => i.productId !== productId));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3 bg-[#fdfbf7]">
        <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#c29b38]" />
        <p className="text-[#3d271d] font-serif font-bold">Summoning Oven Grains Database...</p>
        <p className="text-xs text-gray-400">Loading orders, stock alerts, and real-time sales curves.</p>
      </div>
    );
  }

  // Count metrics
  const pendingOrdersCount = orders.filter(o => o.status !== "delivered").length;
  const lowStockCount = inventory.filter(i => i.stockCount <= i.minStockAlert).length;

  return (
    <section className="py-12 bg-[#faf6ed] text-[#3d271d] min-h-screen">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ebdcb9]/40 pb-6">
          <div>
            <span className="text-[#c29b38] text-xs font-bold uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Sliders className="w-4 h-4" />
              Administrative Command Center
            </span>
            <h2 className="font-serif text-3xl font-extrabold text-[#3d271d] mt-1">
              Oven Grains Management Portal
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Fulfill custom orders, manage Sahjanand Plaza inventory, and monitor daily revenue.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 self-start">
            {/* Live Synchronizer Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200/60 rounded-xl text-xs font-semibold text-emerald-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-[11px] tracking-wide">Live Sync Active</span>
              {lastSyncedAt && (
                <span className="text-[10px] text-emerald-600 font-mono font-normal border-l border-emerald-200/80 pl-2">
                  Updated: {lastSyncedAt}
                </span>
              )}
            </div>

            <button
              onClick={() => loadAllAdminData(false)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-[#ebdcb9] hover:bg-gray-50 text-xs font-semibold cursor-pointer transition shadow-sm font-mono"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh DB
            </button>
          </div>
        </div>

        {/* METRICS ROW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Sales */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider font-mono">Total Sales (INR)</span>
              <span className="text-2xl font-black block font-mono text-[#c29b38]">
                ₹{analytics?.totalSales.toLocaleString() || "0"}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +14.2% Growth This Week
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#c29b38] flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider font-mono">Active Orders</span>
              <span className="text-2xl font-black block font-mono text-indigo-700">
                {pendingOrdersCount}
              </span>
              <span className="text-[10px] text-indigo-500 font-medium">Currently in baking/delivery queue</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider font-mono">Low Stock Items</span>
              <span className={`text-2xl font-black block font-mono ${lowStockCount > 0 ? "text-red-600 animate-pulse" : "text-emerald-700"}`}>
                {lowStockCount}
              </span>
              <span className="text-[10px] text-gray-500">
                {lowStockCount > 0 ? "Requires replenishing" : "All inventories green"}
              </span>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${lowStockCount > 0 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
              {lowStockCount > 0 ? <AlertTriangle className="w-6 h-6" /> : <Package className="w-6 h-6" />}
            </div>
          </div>

          {/* Customer Base */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider font-mono">Verified Customers</span>
              <span className="text-2xl font-black block font-mono">
                {analytics?.totalCustomers || "0"}
              </span>
              <span className="text-[10px] text-gray-500">Unique Ranchi contacts</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* TABS SELECTOR STRIP */}
        <div className="flex border-b border-[#ebdcb9]/40 gap-1 overflow-x-auto scrollbar-none">
          {[
            { id: "analytics", label: "📊 Sales Charts" },
            { id: "orders", label: `🎂 Active Orders (${pendingOrdersCount})` },
            { id: "products", label: "🛒 Catalog Manager" },
            { id: "inventory", label: `📦 Stock Alert Level (${lowStockCount})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 rounded-t-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white border-t border-x border-[#ebdcb9]/40 text-[#c29b38] -mb-[1px]"
                  : "text-gray-500 hover:text-[#3d271d]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}

        {/* 1. ANALYTICS GRAPHS */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Sales Weekly SVG curve */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="font-serif font-bold text-sm">Weekly Revenue Curve (INR)</span>
                <span className="text-[10px] text-[#c29b38] font-bold font-mono">Updated: Real-time</span>
              </div>

              {/* Responsive custom-crafted SVG Chart (guaranteed compilation with React 19) */}
              <div className="w-full h-56 pt-2">
                <svg viewBox="0 0 500 200" className="w-full h-full">
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="480" y2="20" stroke="#f3f4f6" strokeWidth="1" />
                  <line x1="40" y1="70" x2="480" y2="70" stroke="#f3f4f6" strokeWidth="1" />
                  <line x1="40" y1="120" x2="480" y2="120" stroke="#f3f4f6" strokeWidth="1" />
                  <line x1="40" y1="170" x2="480" y2="170" stroke="#e5e7eb" strokeWidth="1.5" />

                  {/* Graph Line Area */}
                  {analytics?.salesByDay && (
                    <>
                      {/* Plot path logic */}
                      {(() => {
                        const data = analytics.salesByDay;
                        const maxVal = Math.max(...data.map(d => d.amount), 1000);
                        const points = data.map((d, i) => {
                          const x = 40 + (i * 70);
                          // Inverse y calculation since SVG origin is top-left
                          const y = 170 - ((d.amount / maxVal) * 140);
                          return `${x},${y}`;
                        }).join(" ");

                        return (
                          <>
                            {/* Area Fill */}
                            <path
                              d={`M 40 170 L ${points} L 460 170 Z`}
                              fill="url(#gradient-amber)"
                              opacity="0.15"
                            />
                            {/* Line Curve */}
                            <polyline
                              fill="none"
                              stroke="#c29b38"
                              strokeWidth="3.5"
                              points={points}
                            />
                            {/* Joint circles */}
                            {data.map((d, i) => {
                              const x = 40 + (i * 70);
                              const y = 170 - ((d.amount / maxVal) * 140);
                              return (
                                <g key={i}>
                                  <circle cx={x} cy={y} r="5" fill="#3d271d" stroke="#c29b38" strokeWidth="2" />
                                  <text x={x} y={y - 10} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#3d271d" fontFamily="monospace">
                                    ₹{d.amount > 0 ? d.amount : ""}
                                  </text>
                                </g>
                              );
                            })}
                          </>
                        );
                      })()}
                    </>
                  )}

                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="gradient-amber" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c29b38" />
                      <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                  </defs>

                  {/* Labels */}
                  {analytics?.salesByDay.map((d, i) => {
                    const x = 40 + (i * 70);
                    return (
                      <text key={i} x={x} y="190" textAnchor="middle" fontSize="10" fill="#999" fontWeight="bold" fontFamily="sans-serif">
                        {d.day}
                      </text>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Popular items & stock warnings */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Top Ordered Items */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <span className="font-serif font-bold text-sm block border-b border-gray-100 pb-2">
                  🔥 Best Sellers Ranked
                </span>
                
                <div className="space-y-3">
                  {analytics?.popularCakes.map((cake, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={cake.image}
                          alt={cake.name}
                          className="w-10 h-10 object-cover rounded-md border border-gray-100"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="text-xs font-bold block leading-tight">{cake.name}</span>
                          <span className="text-[10px] text-gray-400">Ranchi Signature Selection</span>
                        </div>
                      </div>
                      <div className="bg-amber-50 text-[#c29b38] px-2 py-1 rounded text-xs font-mono font-bold">
                        {cake.count} orders
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Instruments Analytics */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="font-serif font-bold text-sm text-[#3d271d]">
                    💳 Payment Breakdown
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
                    "Buy Now" Clicks
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-gray-500">Instant Online Payment (UPI)</span>
                    <span className="font-mono font-bold text-[#c29b38]">
                      {(analytics as any)?.paymentStats?.UPI || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-gray-500">Cash on Delivery (COD)</span>
                    <span className="font-mono font-bold text-amber-800">
                      {(analytics as any)?.paymentStats?.COD || 0}
                    </span>
                  </div>
                  {/* Visual Progress Ratio */}
                  {(() => {
                    const upi = (analytics as any)?.paymentStats?.UPI || 0;
                    const cod = (analytics as any)?.paymentStats?.COD || 0;
                    const total = upi + cod || 1;
                    const upiPct = Math.round((upi / total) * 100);
                    const codPct = 100 - upiPct;
                    return (
                      <div className="space-y-2">
                        <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden flex">
                          <div style={{ width: `${upiPct}%` }} className="bg-[#c29b38]" title={`UPI: ${upiPct}%`} />
                          <div style={{ width: `${codPct}%` }} className="bg-amber-800" title={`COD: ${codPct}%`} />
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                          <span>UPI Option: {upiPct}%</span>
                          <span>COD Option: {codPct}%</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Warning box */}
              {lowStockCount > 0 && (
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-[#3d271d] flex gap-3 items-start">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-red-800 block">Critical Inventory Level Warning</span>
                    Some items at Maa Laxmi Plaza have dropped below the threshold warning. Update stock levels to fulfill future orders.
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* 2. ORDERS QUEUE MANAGER */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <span className="font-serif font-bold text-sm">Active Baking & Dispatch Pipeline</span>
              <span className="text-[10px] text-gray-400 font-mono">Fulfilling local रांची orders</span>
            </div>

            {orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-100 text-gray-500 uppercase tracking-wider font-mono text-[9px] border-b border-gray-200">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Items / customized</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Progress State</th>
                      <th className="p-4 text-center">Fulfillment Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50/50">
                        
                        {/* ID */}
                        <td className="p-4 font-mono font-bold text-[#3d271d]">{o.id}</td>
                        
                        {/* Customer */}
                        <td className="p-4 space-y-0.5">
                          <span className="font-bold block text-sm">{o.customerName}</span>
                          <span className="text-[10px] text-gray-400 block font-mono">{o.phone}</span>
                          <span className="text-[9px] text-gray-500 block truncate max-w-[150px]">{o.address}</span>
                        </td>

                        {/* Items */}
                        <td className="p-4">
                          <div className="space-y-1">
                            {o.items.map((item, i) => (
                              <div key={i} className="flex items-center gap-1 text-[11px]">
                                <span className="font-bold text-[#c29b38]">x{item.quantity}</span>
                                <span className="font-semibold">{item.product.name}</span>
                                {item.customization && (
                                  <span className="text-[8px] bg-[#3d271d] text-[#ffd700] px-1 rounded uppercase font-bold tracking-wider shrink-0 font-mono">
                                    Custom "{item.customization.message || "Message"}"
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Total */}
                        <td className="p-4 font-mono font-bold text-[#3d271d] text-sm">₹{o.totalAmount}</td>

                        {/* Payment */}
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            o.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}>
                            {o.paymentStatus.toUpperCase()}
                          </span>
                        </td>

                        {/* State */}
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                            o.status === "delivered" ? "bg-gray-100 text-gray-700" :
                            o.status === "delivery" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                            o.status === "ready" ? "bg-purple-50 text-purple-700 border border-purple-200" :
                            o.status === "baking" ? "bg-orange-50 text-orange-700 border border-orange-200 animate-pulse" :
                            "bg-red-50 text-red-700 border border-red-200"
                          }`}>
                            {o.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1.5">
                            {o.status === "pending" && (
                              <button
                                onClick={() => handleStatusChange(o.id, "baking")}
                                className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded cursor-pointer"
                              >
                                Bake
                              </button>
                            )}
                            {o.status === "baking" && (
                              <button
                                onClick={() => handleStatusChange(o.id, "ready")}
                                className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded cursor-pointer"
                              >
                                Package
                              </button>
                            )}
                            {o.status === "ready" && (
                              <button
                                onClick={() => handleStatusChange(o.id, "delivery")}
                                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded cursor-pointer"
                              >
                                Dispatch
                              </button>
                            )}
                            {o.status === "delivery" && (
                              <button
                                onClick={() => handleStatusChange(o.id, "delivered", "paid")}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded cursor-pointer"
                              >
                                Deliver
                              </button>
                            )}
                            {o.status === "delivered" && (
                              <span className="text-emerald-700 font-bold flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Fulfilled
                              </span>
                            )}
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400">
                No orders registered in queue yet.
              </div>
            )}
          </div>
        )}

        {/* 3. CATALOG MANAGER */}
        {activeTab === "products" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-serif font-bold text-sm">Active Bakery Catalog Products ({products.length})</span>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#3d271d] hover:bg-[#523527] text-white rounded-lg text-xs font-bold transition cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add New Item
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-3 relative justify-between items-start"
                >
                  <div className="flex gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-14 h-14 object-cover rounded-lg border border-gray-100"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">{p.category}</span>
                      <span className="font-bold text-sm text-[#3d271d] block line-clamp-1">{p.name}</span>
                      <span className="font-mono text-xs font-black text-[#c29b38] block mt-0.5">₹{p.price}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleProductDelete(p.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition cursor-pointer"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. INVENTORY MANAGER */}
        {activeTab === "inventory" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <span className="font-serif font-bold text-sm">Sahjanand Plaza Outlet Inventory Stock Levels</span>
              <span className="text-[10px] text-gray-400 font-mono">Synchronized with orders</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100 text-gray-500 uppercase font-mono text-[9px] border-b border-gray-200">
                    <th className="p-4">Product Ref</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Current Stock count</th>
                    <th className="p-4">Minimum Alert Threshold</th>
                    <th className="p-4">Status Flag</th>
                    <th className="p-4 text-center">Fulfillment Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inventory.map((inv) => {
                    const isLow = inv.stockCount <= inv.minStockAlert;
                    return (
                      <tr key={inv.productId} className="hover:bg-gray-50/50">
                        <td className="p-4 font-bold text-[#3d271d]">{inv.productName}</td>
                        <td className="p-4 font-mono text-gray-400">{inv.category}</td>
                        <td className={`p-4 font-mono font-bold text-sm ${isLow ? "text-red-600" : "text-emerald-700"}`}>
                          {inv.stockCount} units
                        </td>
                        <td className="p-4 font-mono text-gray-500">{inv.minStockAlert} units</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isLow ? "bg-red-50 text-red-700 border border-red-200 animate-pulse" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}>
                            {isLow ? "LOW STOCK ALERT" : "SUFFICIENT"}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleStockAdd(inv.productId, inv.stockCount)}
                            className="px-2 py-1 bg-white hover:bg-amber-50 border border-[#ebdcb9] hover:border-[#c29b38] text-[#c29b38] font-bold rounded cursor-pointer text-[10px] font-mono"
                          >
                            +10 Stock Units
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* ADD CATALOG PRODUCT OVERLAY MODAL */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-[#ebdcb9] relative text-[#3d271d]">
            
            {/* Header */}
            <div className="bg-[#3d271d] p-4 text-white flex justify-between items-center border-b border-[#ffd700]/20">
              <div className="flex items-center gap-2">
                <span>🧁</span>
                <span className="font-serif font-bold text-base">Add New Bakery Item</span>
              </div>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleProductSubmit} className="p-6 space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1" htmlFor="prod-name-input">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    id="prod-name-input"
                    required
                    placeholder="e.g. Saffron Butterscotch Slice"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#c29b38]"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1" htmlFor="prod-price-input">
                    Starting Retail Price (INR) *
                  </label>
                  <input
                    type="number"
                    id="prod-price-input"
                    required
                    placeholder="e.g. 550"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#c29b38]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1" htmlFor="prod-cat-select">
                    Category Group *
                  </label>
                  <select
                    id="prod-cat-select"
                    value={newProdCat}
                    onChange={(e) => setNewProdCat(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none bg-white"
                  >
                    <option value="Birthday Cakes">Birthday Cakes</option>
                    <option value="Custom Cakes">Custom Cakes</option>
                    <option value="Pastries">Pastries</option>
                  </select>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1" htmlFor="prod-img-input">
                    Photo URL (CDN or Unsplash)
                  </label>
                  <input
                    type="text"
                    id="prod-img-input"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newProdImage}
                    onChange={(e) => setNewProdImage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#c29b38]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1" htmlFor="prod-desc-input">
                  Flavor Description & Detail Spicing *
                </label>
                <textarea
                  id="prod-desc-input"
                  required
                  rows={3}
                  placeholder="e.g. Multi-layered sponge infused with authentic saffron syrup and decorated with roasted almonds..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#c29b38]"
                />
              </div>

              <button
                type="submit"
                id="add-prod-submit-btn"
                className="w-full py-3 bg-[#3d271d] hover:bg-[#523527] text-white rounded-xl font-bold uppercase tracking-wider"
              >
                Formulate Product Into System
              </button>

            </form>

          </div>
        </div>
      )}

    </section>
  );
}

// Inline fallback XIcon since lucide-react name is X
function XIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
