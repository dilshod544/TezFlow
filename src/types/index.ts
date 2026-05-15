export type Role = "ADMIN" | "USER" | "MANAGER" | "SALES";

export type OrderStatus =
  | "NEW"
  | "CONTACTED"
  | "PACKED"
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface User {
  id: string;
  email: string;
  name?: string;
  role: Role;
  avatar?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productName: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  description?: string;
  createdAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  customerId: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: string;
  discount: string;
  tax: string;
  finalAmount: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryState?: string;
  deliveryZip?: string;
  notes?: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
  deliveredAt?: Date;
  customer?: Customer;
}

export interface DashboardStats {
  totalOrders: number;
  deliveredOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "order" | "customer" | "system";
  read: boolean;
  telegramSent: boolean;
  relatedId?: string;
  createdAt: Date;
}

export interface AnalyticsLog {
  id: string;
  userId: string;
  eventType: string;
  eventData?: Record<string, any>;
  createdAt: Date;
}
