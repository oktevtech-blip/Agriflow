// export type HarvestStatus = 'planted' | 'growing' | 'ready' | 'harvested';
// export type OrderStatus = 'requested' | 'pending' | 'confirmed' | 'processing' | 'in_transit' | 'delivered' | 'cancelled';
// export type DeliveryStatus = 'assigned' | 'pickup' | 'in_transit' | 'delivered';

// export interface Farmer {
//   id: string;
//   name: string;
//   phone: string;
//   location: string;
//   farmSizeHectares: number;
//   joinedDate: string;
// }

// export interface Crop {
//   id: string;
//   name: string;
//   category: string;
//   unit: string;
// }

// export interface Harvest {
//   id: string;
//   cropId: string;
//   cropName: string;
//   cropCategory: string;
//   plantingDate: string;
//   expectedHarvestDate: string;
//   actualHarvestDate: string | null;
//   expectedYieldKg: number;
//   actualYieldKg: number;
//   grade: string | null;
//   status: HarvestStatus;
//   notes: string | null;
// }

// export interface Order {
//   id: string;
//   buyerName: string;
//   buyerCompany: string;
//   cropName: string;
//   quantityKg: number;
//   unitPrice: number;
//   status: OrderStatus;
//   createdAt: string;
//   totalValue: number;
// }

// export interface Delivery {
//   id: string;
//   orderId: string;
//   cropName: string;
//   transporterName: string;
//   vehicleType: string;
//   pickupLocation: string;
//   deliveryLocation: string;
//   status: DeliveryStatus;
//   estimatedDelivery: string;
//   pickedUpAt: string | null;
//   deliveredAt: string | null;
// }

// export interface AppNotification {
//   id: string;
//   type: 'order' | 'harvest' | 'delivery' | 'reminder';
//   title: string;
//   message: string;
//   timestamp: string;
//   read: boolean;
// }


// ─── Farmer / Production Types ─────────────────────────────────────

export type ProductionStage =
  | 'planted'
  | 'growing'
  | 'flowering'
  | 'maturing'
  | 'almost_ready'
  | 'ready'
  | 'harvested';

export type ProductStatus = 'active' | 'paused' | 'sold_out' | 'harvested';

export type OrderStatus =
  | 'pending'
  | 'approved'
  | 'denied'
  | 'processing'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export type DeliveryStatus =
  | 'assigned'
  | 'pickup'
  | 'in_transit'
  | 'delivered';


// ─── Farmer ────────────────────────────────────────────────────────

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  location: string;
  farmSizeHectares: number;
  joinedDate: string;

  // Farmer-editable profile information
  farmDescription: string | null;
  profileImage: string | null;
}


// ─── Crop Catalogue ────────────────────────────────────────────────
// Basic information about the type of crop/product.

export interface Crop {
  id: string;
  name: string;
  category: string;
  unit: string;
}


// ─── Farmer Product ────────────────────────────────────────────────
// The actual crop/product being produced by this farmer.
// This is the main information customers will eventually see.

export interface FarmerProduct {
  id: string;
  farmerId: string;

  cropId: string;
  cropName: string;
  category: string;

  variety: string | null;
  unit: string;

  // Production quantities
  quantityPlanted: number;
  expectedYield: number;
  availableQuantity: number;

  // Production dates
  plantingDate: string;
  expectedHarvestDate: string;

  // Current production condition
  productionStage: ProductionStage;
  readinessPercentage: number;

  // Selling information
  unitPrice: number;
  minimumOrderQuantity: number;

  description: string | null;
  image: string | null;

  status: ProductStatus;

  createdAt: string;
  updatedAt: string;
}


// ─── Harvest ───────────────────────────────────────────────────────
// Information recorded when the product is actually harvested.

export type HarvestStatus =
  | 'planted'
  | 'growing'
  | 'flowering'
  | 'maturing'
  | 'almost_ready'
  | 'ready'
  | 'harvested';

export interface Harvest {
  id: string;
  productId: string;
  cropId: string;
  cropName: string;
  cropCategory: string;
  plantingDate: string;
  expectedHarvestDate: string;
  actualHarvestDate: string | null;
  expectedYieldKg: number;
  actualYieldKg: number;
  grade: string | null;
  status: HarvestStatus;
  notes: string | null;
  createdAt: string;
}

// ─── Orders ────────────────────────────────────────────────────────
// Orders originate from the web/customer side.
// The farmer can approve or deny them.

export interface Order {
  id: string;

  farmerId: string;

  buyerName: string;
  buyerCompany: string;

  productId: string;
  cropName: string;

  quantityKg: number;
  unitPrice: number;
  totalValue: number;

  status: OrderStatus;

  createdAt: string;

  // Filled when farmer denies an order
  denialReason: string | null;

  // Farmer decision timestamp
  respondedAt: string | null;
}


// ─── Delivery ──────────────────────────────────────────────────────

export interface Delivery {
  id: string;

  orderId: string;

  cropName: string;

  transporterName: string;
  vehicleType: string;

  pickupLocation: string;
  deliveryLocation: string;

  status: DeliveryStatus;

  estimatedDelivery: string;

  pickedUpAt: string | null;
  deliveredAt: string | null;
}


// ─── Notifications ────────────────────────────────────────────────

export interface AppNotification {
  id: string;

  type: 'order' | 'harvest' | 'delivery' | 'reminder' | 'production';

  title: string;
  message: string;

  timestamp: string;

  read: boolean;
}

