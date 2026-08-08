export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: 'Birthday Cakes' | 'Custom Cakes' | 'Pastries' | 'Chocolates' | 'Cookies' | 'Fresh Bread';
  rating: number;
  sizes?: string[]; // e.g. ["0.5 kg", "1.0 kg", "2.0 kg"]
  flavors?: string[]; // e.g. ["Pineapple", "Rasmalai", "Chocolate", "Black Forest", "Butterscotch"]
  tags?: string[];
  isSignature?: boolean;
}

export interface CustomizedCake {
  productId?: string;
  productName: string;
  size: string;
  flavor: string;
  message: string;
  photoUrl?: string; // Base64 or mock URL
  eggless: boolean;
  specialInstructions?: string;
}

export interface CartItem {
  id: string; // unique cart item id (e.g. composite of product_id + customization hash)
  product: Product;
  quantity: number;
  customization?: CustomizedCake;
}

export type OrderStatus = 'pending' | 'baking' | 'ready' | 'delivery' | 'delivered';

export interface Order {
  id: string;
  items: CartItem[];
  customerName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  deliveryType: 'delivery' | 'pickup';
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid';
  paymentId?: string;
  paymentMethod?: 'UPI' | 'COD';
  createdAt: string;
  orderNotes?: string;
  reviewSubmitted?: boolean;
  reviewRating?: number;
  reviewText?: string;
}

export interface InventoryItem {
  productId: string;
  productName: string;
  category: string;
  stockCount: number;
  minStockAlert: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  avatar?: string;
  verified: boolean;
}

export interface DashboardAnalytics {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  pendingOrders: number;
  salesByDay: { day: string; amount: number }[];
  popularCakes: { name: string; count: number; image: string }[];
  inventoryStatus: { name: string; stock: number; min: number }[];
}
