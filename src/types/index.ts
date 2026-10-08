// ─── Product Types ───────────────────────────────────────────────────────────

export type ProductCategory =
  | 'live-stock'
  | 'processed-meat'
  | 'catering'
  | 'by-products'
  | 'equipment';

export type StockStatus = 'in-stock' | 'out-of-stock' | 'pre-order';

export interface BaseProduct {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  description: string;
  price: number;
  images: string[];
  videoUrl?: string;
  stockStatus: StockStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

// Category 1: Live Breeding Stock & Pets
export type PrimaryUse = 'commercial-meat' | 'domestic-pet' | 'medical-research';

export interface LiveStockProduct extends BaseProduct {
  category: 'live-stock';
  breed: string;
  primaryUse: PrimaryUse;
  ageMonths: number;
  weightKg: number;
  dewormingStatus: boolean;
  vaccinationStatus: boolean;
  lineageNotes?: string;
  sex: 'male' | 'female';
}

// Category 2: Processed Rabbit Meat
export type StorageState = 'fresh' | 'frozen';
export type MeatType = 'whole-dressed' | 'cut-parts';

export interface ProcessedMeatProduct extends BaseProduct {
  category: 'processed-meat';
  meatType: MeatType;
  weightKg: number;
  storageState: StorageState;
  pricePerKg: number;
}

// Category 3: Culinary & Event Catering
export type EventType = 'wedding' | 'burial' | 'graduation' | 'birthday' | 'corporate' | 'other';
export type CateringItemType = 'bbq-skewers' | 'roasted-whole';

export interface CateringProduct extends BaseProduct {
  category: 'catering';
  cateringType: CateringItemType;
  servingSize: string;
  leadTimeDays: number;
  eventTypes: EventType[];
  minOrderQty: number;
}

// Category 4: By-Products & Farm Inputs
export type ByProductType = 'rabbit-urine' | 'dried-manure' | 'cured-fur';

export interface ByProductItem extends BaseProduct {
  category: 'by-products';
  byProductType: ByProductType;
  volumeLiters?: number;
  weightKg?: number;
  applicationGuide: string;
}

// Category 5: Equipment & Fabrication
export type EquipmentType = 'wire-cage' | 'nipple-drinker' | 'feeding-trough';

export interface EquipmentProduct extends BaseProduct {
  category: 'equipment';
  equipmentType: EquipmentType;
  dimensionsLWH?: string;
  rabbitCapacity?: number;
  materialSpec?: string;
}

export type Product =
  | LiveStockProduct
  | ProcessedMeatProduct
  | CateringProduct
  | ByProductItem
  | EquipmentProduct;

// ─── Cart Types ───────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface Cart {
  items: CartItem[];
  deliveryState?: string;
  deliveryCity?: string;
}

// ─── Order Types ─────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'payment-proof-uploaded'
  | 'confirmed'
  | 'processing'
  | 'dispatched'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'bank-transfer' | 'paystack' | 'whatsapp';

export interface OrderItem {
  productId: string;
  productName: string;
  productCategory: ProductCategory;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryState: string;
  deliveryCity: string;
  deliveryAddress: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number | null;
  total: number | null;
  paymentMethod: PaymentMethod;
  paymentProofUrl?: string;
  paystackReference?: string;
  status: OrderStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Lead Magnet Types ────────────────────────────────────────────────────────

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: 'lead-magnet' | 'catering-inquiry' | 'contact-form';
  inquiryDetails?: string;
  createdAt: string;
}

// ─── Admin Types ──────────────────────────────────────────────────────────────

export interface AdminStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalLeads: number;
}

export interface DeliveryRegion {
  id: string;
  state: string;
  baselineFee: number;
  notes?: string;
}

// ─── Estimator Types ──────────────────────────────────────────────────────────

export interface EstimatorResult {
  rabbitCount: number;
  cageRecommendation: string;
  cageCount: number;
  drinkerCount: number;
  feedVolumeKgPerDay: number;
  feedVolumeKgPerMonth: number;
  estimatedCageCost: string;
}

// ─── Nigerian States ──────────────────────────────────────────────────────────

export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
] as const;

export type NigerianState = typeof NIGERIAN_STATES[number];
